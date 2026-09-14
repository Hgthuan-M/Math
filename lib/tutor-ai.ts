export type TutorConfig = {
  AI_PROVIDER?: string;
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  GOOGLE_API_KEY?: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
  COPILOT_API_KEY?: string;
  COPILOT_MODEL?: string;
  COPILOT_BASE_URL?: string;
};

export function tutorSettings(cfg: TutorConfig = {}) {
  const pEnv: Record<string, string | undefined> = typeof process !== 'undefined' && process.env ? process.env : {};
  const rawProvider = (cfg.AI_PROVIDER || pEnv.AI_PROVIDER || '').toLowerCase();
  const geminiKey = cfg.GEMINI_API_KEY || cfg.GOOGLE_API_KEY || pEnv.GEMINI_API_KEY || pEnv.GOOGLE_API_KEY;
  const copilotKey = cfg.COPILOT_API_KEY || cfg.OPENAI_API_KEY || pEnv.COPILOT_API_KEY || pEnv.OPENAI_API_KEY;

  // Select provider: 'copilot' (OpenAI / GitHub Copilot compatible) vs 'gemini'
  const isCopilot = rawProvider === 'copilot' || rawProvider === 'openai' || (!geminiKey && Boolean(copilotKey));
  const provider = isCopilot ? 'copilot' : 'gemini';
  const key = provider === 'copilot' ? copilotKey : geminiKey;
  const defaultModel = provider === 'copilot' ? (cfg.COPILOT_MODEL || cfg.OPENAI_MODEL || 'gpt-4o-mini') : 'gemini-3.6-flash';
  const model = (provider === 'copilot' ? (cfg.COPILOT_MODEL || cfg.OPENAI_MODEL || pEnv.COPILOT_MODEL || pEnv.OPENAI_MODEL) : (cfg.GEMINI_MODEL || pEnv.GEMINI_MODEL)) || defaultModel;
  const baseUrl = cfg.COPILOT_BASE_URL || pEnv.COPILOT_BASE_URL || 'https://api.openai.com/v1/chat/completions';

  return {
    provider,
    key,
    model,
    baseUrl,
    configured: Boolean(key && key.trim().length > 0),
  };
}

export class TutorError extends Error {
  constructor(message: string, public status = 502) { super(message); }
}

export async function askTutor(
  cfg: TutorConfig,
  instructions: string,
  input: {role: string; content: string}[],
  image?: string,
) {
  const {provider, key, model, baseUrl, configured} = tutorSettings(cfg);
  if (!configured) {
    throw new TutorError('Math Copilot chưa được kết nối API Key. Vui lòng cấu hình GEMINI_API_KEY hoặc COPILOT_API_KEY trong .env hoặc nhập trong giao diện.', 503);
  }

  const isGemini = provider === 'gemini';
  const url = isGemini
    ? `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model!)}:generateContent`
    : baseUrl;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (isGemini) {
    headers['x-goog-api-key'] = key!;
  } else {
    headers['Authorization'] = `Bearer ${key!}`;
  }

  // Multimodal parsing
  let inlineImage: { mimeType: string; data: string } | null = null;
  if (image) {
    const match = image.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      inlineImage = { mimeType: match[1], data: match[2] };
    } else if (/^[A-Za-z0-9+/=]+$/.test(image.slice(0, 100))) {
      inlineImage = { mimeType: 'image/jpeg', data: image };
    }
  }

  const body = JSON.stringify(isGemini ? {
    systemInstruction: { parts: [{ text: instructions }] },
    contents: input.map((m, idx) => {
      const isTargetTurn = (idx === input.length - 1 && m.role === 'user');
      const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [
        { text: m.content || 'Hãy giải bài toán trong hình ảnh này.' }
      ];
      if (isTargetTurn && inlineImage) {
        parts.push({ inlineData: inlineImage });
      }
      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts,
      };
    }),
    generationConfig: { maxOutputTokens: 4096, temperature: 0.7 },
  } : {
    model,
    messages: [
      { role: 'system', content: instructions },
      ...input.map((m, idx) => {
        const isTargetTurn = (idx === input.length - 1 && m.role === 'user');
        if (isTargetTurn && inlineImage) {
          const imgUrl = image!.startsWith('data:') ? image! : `data:image/jpeg;base64,${image}`;
          return {
            role: m.role,
            content: [
              { type: 'text', text: m.content || 'Hãy giải bài toán trong hình ảnh này.' },
              { type: 'image_url', image_url: { url: imgUrl } },
            ],
          };
        }
        return { role: m.role, content: m.content };
      }),
    ],
    max_tokens: 4096,
    temperature: 0.7,
  });

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body,
    signal: AbortSignal.timeout(50000),
  });

  if (!res.ok) {
    let errorDetail = '';
    try {
      const errData = await res.json() as { error?: { message?: string } | string };
      if (typeof errData.error === 'object' && errData.error?.message) {
        errorDetail = errData.error.message;
      } else if (typeof errData.error === 'string') {
        errorDetail = errData.error;
      }
    } catch {}

    if (res.status === 429) {
      throw new TutorError(`API ${isGemini ? 'Google Gemini' : 'Copilot/OpenAI'} đã đạt hạn mức lượt gọi (Quota limit). Vui lòng thử lại sau giây lát.`, 429);
    }
    if (res.status === 401 || res.status === 403) {
      throw new TutorError(`Khóa API không hợp lệ hoặc không có quyền gọi dịch vụ: ${errorDetail || 'Vui lòng kiểm tra lại API Key.'}`, 503);
    }
    throw new TutorError(`Lỗi kết nối ${isGemini ? 'Gemini' : 'Copilot'} API (${res.status}): ${errorDetail || 'Hãy thử lại.'}`);
  }

  let answer = '';
  if (isGemini) {
    const data = await res.json() as {
      candidates?: {
        finishReason?: string;
        content?: { parts?: { text?: string; thought?: boolean }[] };
      }[];
    };
    const candidate = data.candidates?.[0];
    answer = (candidate?.content?.parts ?? []).filter(p => !p.thought).map(p => p.text ?? '').join('\n');
    if (candidate?.finishReason === 'MAX_TOKENS' && answer) {
      answer += '\n\nCâu trả lời đã tới giới hạn độ dài. Bạn có thể yêu cầu Copilot giải thích tiếp.';
    }
  } else {
    const data = await res.json() as {
      choices?: { message?: { content?: string } }[];
    };
    answer = data.choices?.[0]?.message?.content ?? '';
  }

  if (!answer.trim()) throw new TutorError('Copilot chưa trả về nội dung. Hãy thử diễn đạt lại câu hỏi.');
  return answer;
}
