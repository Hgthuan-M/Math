export type TutorConfig = {
  AI_PROVIDER?: string;
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
};

export function tutorSettings(cfg: TutorConfig) {
  const provider = cfg.AI_PROVIDER === 'gemini' ? 'gemini' : 'openai';
  const key = provider === 'gemini' ? cfg.GEMINI_API_KEY : cfg.OPENAI_API_KEY;
  const model = provider === 'gemini' ? cfg.GEMINI_MODEL : cfg.OPENAI_MODEL;
  return {provider, key, model, configured: Boolean(key && model)};
}

export class TutorError extends Error {
  constructor(message: string, public status = 502) { super(message); }
}

export async function askTutor(cfg: TutorConfig, instructions: string, input: {role: string; content: string}[]) {
  const {provider, key, model, configured} = tutorSettings(cfg);
  if (!configured) throw new TutorError('AI Tutor chưa được kết nối. Chủ trang cần hoàn tất cấu hình.', 503);
  const gemini = provider === 'gemini';
  const res = await fetch(gemini
    ? `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model!)}:generateContent`
    : 'https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: gemini
      ? {'x-goog-api-key': key!, 'Content-Type': 'application/json'}
      : {Authorization: `Bearer ${key}`, 'Content-Type': 'application/json'},
    body: JSON.stringify(gemini ? {
      systemInstruction: {parts: [{text: instructions}]},
      contents: input.map(m => ({role: m.role === 'assistant' ? 'model' : 'user', parts: [{text: m.content}]})),
      generationConfig: {maxOutputTokens: 4096},
    } : {model, store: false, max_output_tokens: 1800, instructions, input}),
    signal: AbortSignal.timeout(45000),
  });
  if (!res.ok) {
    if (res.status === 429) throw new TutorError('AI đã hết hạn mức hoặc đang giới hạn lượt dùng. Hãy thử lại sau hoặc báo chủ trang kiểm tra hạn mức.', 429);
    if (res.status === 401 || res.status === 403) throw new TutorError('Kết nối AI chưa được cấp quyền. Vui lòng báo chủ trang kiểm tra khóa API.', 503);
    throw new TutorError('Chưa nhận được trả lời từ AI. Hãy thử lại.');
  }
  let answer = '';
  if (gemini) {
    const data = await res.json() as {candidates?: {finishReason?: string; content?: {parts?: {text?: string; thought?: boolean}[]}}[]};
    const candidate = data.candidates?.[0];
    answer = (candidate?.content?.parts ?? []).filter(p => !p.thought).map(p => p.text ?? '').join('\n');
    if (candidate?.finishReason === 'MAX_TOKENS' && answer) answer += '\n\nCâu trả lời đã tới giới hạn độ dài. Bạn có thể yêu cầu giải thích tiếp.';
  } else {
    const data = await res.json() as {output?: {content?: {type: string; text?: string; refusal?: string}[]}[]};
    answer = (data.output ?? []).flatMap(o => o.content ?? []).map(c => c.type === 'output_text' ? c.text : c.type === 'refusal' ? c.refusal : '').filter(Boolean).join('\n');
  }
  if (!answer.trim()) throw new TutorError('AI chưa trả về nội dung. Hãy thử diễn đạt lại câu hỏi.');
  return answer;
}
