import {z} from 'zod';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {getDB,sameOrigin} from '@/lib/server';
import {findFormulas} from '@/lib/content';
import {askTutor,tutorSettings,TutorError,type TutorConfig} from '@/lib/tutor-ai';

let cfEnv: any = null;
try {
  // @ts-ignore
  cfEnv = (await import(/* webpackIgnore: true */ 'cloudflare:workers')).env;
} catch {}

function getEffectiveConfig(req: Request): TutorConfig {
  const pEnv = typeof process !== 'undefined' && process.env ? process.env : {};
  const cfg = (cfEnv as unknown as TutorConfig) || (pEnv as unknown as TutorConfig) || {};
  const clientGeminiKey = req.headers.get('x-user-gemini-key') || undefined;
  const clientCopilotKey = req.headers.get('x-user-copilot-key') || undefined;
  const clientProvider = req.headers.get('x-copilot-provider') || undefined;
  const clientModel = req.headers.get('x-copilot-model') || undefined;
  const clientEndpoint = req.headers.get('x-copilot-endpoint') || undefined;

  const result: TutorConfig = { ...cfg };
  if (clientGeminiKey) result.GEMINI_API_KEY = clientGeminiKey;
  if (clientCopilotKey) {
    result.COPILOT_API_KEY = clientCopilotKey;
    result.OPENAI_API_KEY = clientCopilotKey;
  }
  if (clientProvider) result.AI_PROVIDER = clientProvider;
  if (clientModel) {
    if (clientProvider === 'copilot' || clientProvider === 'openai') {
      result.COPILOT_MODEL = clientModel;
      result.OPENAI_MODEL = clientModel;
    } else {
      result.GEMINI_MODEL = clientModel;
    }
  }
  if (clientEndpoint) result.COPILOT_BASE_URL = clientEndpoint;

  return result;
}

export async function GET(req: Request) {
  const effectiveCfg = getEffectiveConfig(req);
  const settings = tutorSettings(effectiveCfg);
  const user = await getChatGPTUser();
  const userId = user ? user.userId : 'guest_learner';
  let history: unknown[] = [];
  let historyError = false;

  try {
    const db = getDB();
    const h = await db.prepare('SELECT question,answer,created_at FROM ai_history WHERE user_id=? ORDER BY created_at DESC LIMIT 20').bind(userId).all();
    history = h.results.reverse();
  } catch {
    historyError = false;
  }

  return Response.json({
    configured: settings.configured,
    provider: settings.provider,
    model: settings.model,
    signedIn: true,
    userName: user?.fullName || 'Người học',
    history,
    historyError,
  });
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return Response.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 403 });
  const user = await getChatGPTUser();
  const userId = user ? user.userId : 'guest_learner';

  const effectiveCfg = getEffectiveConfig(req);
  const settings = tutorSettings(effectiveCfg);

  if (!settings.configured) {
    return Response.json({
      error: 'Math Copilot chưa kết nối API Key. Bạn có thể cấu hình GEMINI_API_KEY / COPILOT_API_KEY trong file .env hoặc nhập trực tiếp trong giao diện cài đặt.',
    }, { status: 503 });
  }

  let body: {
    question?: string;
    mode?: 'general' | 'step_by_step' | 'error_check' | 'practice' | 'socratic' | 'proof' | 'photo_solve';
    image?: string;
  };

  try {
    body = z.object({
      question: z.string().trim().max(4000).optional().default(''),
      mode: z.enum(['general', 'step_by_step', 'error_check', 'practice', 'socratic', 'proof', 'photo_solve']).optional().default('general'),
      image: z.string().max(15_000_000).optional(),
    }).parse(await req.json());

    if (!body.question && !body.image) {
      return Response.json({ error: 'Vui lòng nhập nội dung câu hỏi hoặc tải lên hình ảnh đề bài.' }, { status: 400 });
    }
  } catch {
    return Response.json({ error: 'Dữ liệu câu hỏi không hợp lệ.' }, { status: 400 });
  }

  try {
    let dbAvailable = true;
    let db;
    try {
      db = getDB();
    } catch {
      dbAvailable = false;
    }

    let historyTurns: { role: string; content: string }[] = [];
    if (dbAvailable && db) {
      try {
        const recent = await db.prepare('SELECT COUNT(*) AS n FROM ai_history WHERE user_id=? AND created_at>?')
          .bind(userId, new Date(Date.now() - 3600000).toISOString())
          .first<{ n: number }>();
        if ((recent?.n ?? 0) >= 80) {
          return Response.json({ error: 'Bạn đã dùng 80 lượt trong một giờ. Vui lòng thử lại sau.' }, { status: 429 });
        }

        const h = await db.prepare('SELECT question,answer FROM ai_history WHERE user_id=? ORDER BY created_at DESC LIMIT 4')
          .bind(userId)
          .all<{ question: string; answer: string }>();
        historyTurns = h.results.reverse().flatMap(v => [
          { role: 'user', content: v.question },
          { role: 'assistant', content: v.answer },
        ]);
      } catch {}
    }

    const questionText = body.question || (body.image ? 'Hãy nhận diện đề bài trong ảnh, chép lại đề bằng công thức toán học và giải chi tiết từng bước.' : 'Hỏi trợ lý toán');

    const context = findFormulas(questionText).slice(0, 3).map(f => ({
      name: f.name,
      condition: f.condition,
      formula: f.unicodeMath || f.latex,
      explanation: f.theory,
    }));

    historyTurns.push({ role: 'user', content: questionText });

    const mode = body.mode || (body.image ? 'photo_solve' : 'general');
    let modeInstruction = '';

    if (mode === 'photo_solve' || Boolean(body.image)) {
      modeInstruction = 'CHẾ ĐỘ HIỆN TẠI: [GIẢI ĐỀ BẰNG HÌNH ẢNH / PHOTO MATH SOLVER].\n'
        + '- Người học đã tải lên hình ảnh chụp đề bài (sách giáo khoa, đề thi, hoặc chữ viết tay).\n'
        + '- BƯỚC 1: [Đọc đề bài (OCR & Nhận diện hình)]: Chép lại chính xác nội dung câu hỏi, dữ kiện và phương trình từ hình ảnh. Viết lại đề bài thật rõ ràng bằng các công thức toán/LaTeX chuẩn.\n'
        + '- BƯỚC 2: [Phương pháp & Công thức]: Nêu ngắn gọn phương pháp tư duy, định lý hoặc công thức liên quan.\n'
        + '- BƯỚC 3: [Lời giải chi tiết từng bước]: Giải trình tự từ đầu đến cuối, biến đổi tường minh, tính toán cẩn thận.\n'
        + '- BƯỚC 4: [Đáp số cuối cùng]: Kết luận nghiệm hoặc chọn đáp án trắc nghiệm (A, B, C, D) nếu là câu trắc nghiệm.\n'
        + '- BƯỚC 5: [Lưu ý & Bẫy đề thi]: Cảnh báo sai lầm học sinh dễ mắc phải hoặc mẹo kiểm tra lại nhanh.';
    } else if (mode === 'step_by_step') {
      modeInstruction = 'CHẾ ĐỘ HIỆN TẠI: [GIẢI CHI TIẾT TỪNG BƯỚC].\n'
        + '- Trình bày bài giải mẫu hoàn chỉnh, phân tách rõ ràng: Bước 1, Bước 2, Bước 3,...\n'
        + '- Mỗi bước phải nêu rõ công thức áp dụng, phép biến đổi số học và lý do.\n'
        + '- Kết luận nghiệm/đáp số cuối cùng được làm nổi bật và nêu phương pháp kiểm tra lại.';
    } else if (mode === 'error_check') {
      modeInstruction = 'CHẾ ĐỘ HIỆN TẠI: [THẨM ĐỊNH & SỬA LỖI BÀI LÀM].\n'
        + '- Người học cung cấp đề bài và các bước giải của họ.\n'
        + '- Đọc kỹ từng dòng: kiểm tra điều kiện, dấu âm/dương, hằng đẳng thức, ma trận hay phép biến đổi.\n'
        + '- Nếu có bước sai: Chỉ rõ chính xác dòng nào sai, phân tích lỗi sai và đưa ra cách sửa đúng kèm đáp số chuẩn.';
    } else if (mode === 'practice') {
      modeInstruction = 'CHẾ ĐỘ HIỆN TẠI: [TẠO BÀI TẬP TỰ LUYỆN].\n'
        + '- Tạo 3 bài tập toán theo đúng chủ đề người học yêu cầu:\n'
        + '  * Bài 1: Mức độ Nhận biết / Thông hiểu (Cơ bản).\n'
        + '  * Bài 2: Mức độ Vận dụng.\n'
        + '  * Bài 3: Mức độ Vận dụng cao / Tư duy sâu.\n'
        + '- Kèm theo đáp án và lời giải chi tiết từng bước cho cả 3 bài.';
    } else if (mode === 'socratic') {
      modeInstruction = 'CHẾ ĐỘ HIỆN TẠI: [GIA SƯ GỢI MỞ SOCRATIC].\n'
        + '- TUYỆT ĐỐI KHÔNG giải hộ toàn bộ bài toán hoặc đưa ngay đáp số!\n'
        + '- Đặt 1-2 câu hỏi gợi ý để học sinh nhận diện dạng bài, xác định công thức liên quan, và tự khám phá ra bước giải tiếp theo.';
    } else if (mode === 'proof') {
      modeInstruction = 'CHẾ ĐỘ HIỆN TẠI: [CHỨNG MINH TOÁN HỌC CHẶT CHẼ].\n'
        + '- Trình bày chứng minh logic, mạch lạc, đầy đủ giả thiết và điều kiện.\n'
        + '- Dùng các ký hiệu suy luận rõ ràng (=>, <=>) và kết thúc bằng kết luận chuẩn mực.';
    } else {
      modeInstruction = 'CHẾ ĐỘ HIỆN TẠI: [MATH COPILOT ĐỒNG HÀNH TỔNG QUÁT].\n'
        + '- Giải thích trực quan, nêu bản chất toán học và ý nghĩa thực tế của vấn đề.\n'
        + '- Hướng dẫn tận tình, dễ hiểu từ cấp THCS, THPT đến Đại học.';
    }

    const systemPrompt = `Bạn là MATH COPILOT — Trợ lý Toán học thông minh bằng tiếng Việt của MATH HANDBOOK PRO.
Bạn hỗ trợ toàn diện các môn toán từ THCS, THPT đến Đại học (Đại số, Hình học, Giải tích, Đạo hàm, Tích phân, Ma trận & Đại số tuyến tính, Số phức, Xác suất Thống kê).

${modeInstruction}

Quy tắc trình bày công thức:
- Luôn viết công thức toán học mạch lạc trên các dòng riêng hoặc dùng ký hiệu LaTeX / chuẩn toán (ví dụ: c^2 = a^2 + b^2, \\Delta = b^2 - 4ac, \\det(A), \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}, \\int f(x)dx) để hệ thống tự động kết xuất MathML chuẩn W3C đẹp mắt.
- Thái độ nhiệt tình, khích lệ học tập, thân thiện và chuyên nghiệp.

Tài liệu sổ tay tham khảo: ${JSON.stringify(context)}`;

    const answer = await askTutor(effectiveCfg, systemPrompt, historyTurns, body.image);

    let saved = false;
    if (dbAvailable && db) {
      try {
        await db.prepare('INSERT INTO ai_history(id,user_id,question,answer,created_at) VALUES(?,?,?,?,?)')
          .bind(crypto.randomUUID(), userId, questionText, answer, new Date().toISOString())
          .run();
        saved = true;
      } catch {
        saved = false;
      }
    }

    return Response.json({ answer, saved, mode, provider: settings.provider, model: settings.model });
  } catch (e) {
    if (e instanceof TutorError) return Response.json({ error: e.message }, { status: e.status });
    console.error('Tutor error:', e);
    return Response.json({ error: 'Kết nối Math Copilot bị gián đoạn: ' + (e instanceof Error ? e.message : 'Vui lòng thử lại.') }, { status: 503 });
  }
}
