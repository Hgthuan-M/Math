'use client';
import {useState,useEffect,useRef} from 'react';
import {Sparkles,Bot,X,Send,Maximize2,ChevronDown,Zap,CheckCircle2,HelpCircle,Camera} from 'lucide-react';
import {MathText} from './math';

export function FloatingCopilot({
  activeFormulaName,
  openTutorPage,
}: {
  activeFormulaName?: string | null;
  openTutorPage?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<{question: string; answer: string; image?: string}[]>([]);
  const [mode, setMode] = useState<'general' | 'step_by_step' | 'error_check' | 'socratic'>('general');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  function handleImageFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn tệp hình ảnh (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAttachedImage(reader.result);
        setError('');
      }
    };
    reader.readAsDataURL(file);
  }

  function handlePaste(e: React.ClipboardEvent) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          handleImageFile(file);
          e.preventDefault();
          break;
        }
      }
    }
  }

  async function handleSend(textToSend?: string) {
    const q = (textToSend || question).trim();
    if ((!q && !attachedImage) || busy) return;
    setBusy(true);
    setError('');

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const savedGeminiKey = typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') || '' : '';
    const savedCopilotKey = typeof window !== 'undefined' ? localStorage.getItem('copilot_api_key') || '' : '';
    const savedProvider = typeof window !== 'undefined' ? localStorage.getItem('copilot_provider') || 'gemini' : 'gemini';

    if (savedGeminiKey) headers['x-user-gemini-key'] = savedGeminiKey;
    if (savedCopilotKey) headers['x-user-copilot-key'] = savedCopilotKey;
    headers['x-copilot-provider'] = savedProvider;

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          question: q,
          mode: attachedImage ? 'photo_solve' : mode,
          image: attachedImage || undefined,
        }),
      });
      const data = await res.json() as { error?: string; answer?: string };
      if (!res.ok) throw new Error(data.error || 'Lỗi kết nối Copilot');
      if (data.answer) {
        setMessages(prev => [
          ...prev,
          {
            question: q || 'Đề bài từ ảnh chụp',
            answer: data.answer!,
            image: attachedImage || undefined,
          },
        ]);
      }
      setQuestion('');
      setAttachedImage(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Chưa gửi được câu hỏi.');
    } finally {
      setBusy(false);
    }
  }

  function askAboutCurrentTopic() {
    if (!activeFormulaName) return;
    const prompt = `Giải thích trực quan và nêu các bước áp dụng của công thức: ${activeFormulaName}`;
    setQuestion(prompt);
    handleSend(prompt);
  }

  return (
    <div className="floating-copilot-wrapper">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          className="floating-copilot-trigger"
          onClick={() => setIsOpen(true)}
          aria-label="Mở Math Copilot"
          title="Mở Math Copilot - Trợ lý Toán học thông minh"
        >
          <div className="copilot-icon-glow">
            <Bot size={22} />
          </div>
          <span className="floating-copilot-label">Math Copilot</span>
          <span className="copilot-badge-pulse" />
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="floating-copilot-window" role="dialog" aria-label="Math Copilot Chat">
          {/* Header */}
          <div className="floating-copilot-header">
            <div className="floating-copilot-title">
              <Bot size={18} className="copilot-sparkle-icon" />
              <div>
                <strong>Math Copilot</strong>
                <span className="copilot-status-dot">Online</span>
              </div>
            </div>
            <div className="floating-copilot-actions">
              {openTutorPage && (
                <button
                  className="icon-button small-icon"
                  title="Mở toàn màn hình AI Tutor"
                  onClick={() => {
                    setIsOpen(false);
                    openTutorPage();
                  }}
                >
                  <Maximize2 size={14} />
                </button>
              )}
              <button
                className="icon-button small-icon"
                title="Thu nhỏ"
                onClick={() => setIsOpen(false)}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Context Banner */}
          {activeFormulaName && (
            <div className="copilot-context-banner">
              <span>Đang xem: <strong>{activeFormulaName}</strong></span>
              <button className="copilot-chip" onClick={askAboutCurrentTopic}>
                <Sparkles size={12} /> Hỏi bài này
              </button>
            </div>
          )}

          {/* Mode Selector */}
          <div className="copilot-mini-modes">
            <button
              className={`copilot-mode-btn ${mode === 'general' ? 'active' : ''}`}
              onClick={() => setMode('general')}
              title="Copilot tổng quát"
            >
              Tổng quát
            </button>
            <button
              className={`copilot-mode-btn ${mode === 'step_by_step' ? 'active' : ''}`}
              onClick={() => setMode('step_by_step')}
              title="Giải từng bước"
            >
              Từng bước
            </button>
            <button
              className={`copilot-mode-btn ${mode === 'socratic' ? 'active' : ''}`}
              onClick={() => setMode('socratic')}
              title="Gợi mở"
            >
              Gợi mở
            </button>
            <button
              className={`copilot-mode-btn ${mode === 'error_check' ? 'active' : ''}`}
              onClick={() => setMode('error_check')}
              title="Soát lỗi bài làm"
            >
              Soát lỗi
            </button>
          </div>

          {/* Messages List */}
          <div className="floating-copilot-body">
            {messages.length === 0 ? (
              <div className="copilot-mini-empty">
                <Bot size={28} className="muted" />
                <p className="small" style={{ margin: '8px 0 4px', fontWeight: 600 }}>
                  Chào bạn! Tôi là Math Copilot.
                </p>
                <p className="small muted" style={{ margin: 0, fontSize: '11px' }}>
                  Hỏi bất kỳ bài toán, ma trận, công thức hoặc dán bước giải để Copilot kiểm tra.
                </p>
                <div className="copilot-quick-suggestions">
                  <button
                    className="copilot-suggestion-pill"
                    onClick={() => {
                      const q = 'Hướng dẫn tính định thức và ma trận nghịch đảo cấp 2 và 3';
                      setQuestion(q);
                      handleSend(q);
                    }}
                  >
                    ⚡ Tính ma trận nghịch đảo
                  </button>
                  <button
                    className="copilot-suggestion-pill"
                    onClick={() => {
                      const q = 'Giải thích công thức Euler e^(i*pi) + 1 = 0';
                      setQuestion(q);
                      handleSend(q);
                    }}
                  >
                    💡 Ý nghĩa công thức Euler
                  </button>
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className="copilot-chat-turn">
                  <div className="copilot-user-bubble">
                    {m.image && (
                      <div style={{marginBottom: 6}}>
                        <img
                          src={m.image}
                          alt="Đề bài"
                          style={{maxWidth: '100%', maxHeight: 130, borderRadius: 6, display: 'block', background: '#fff'}}
                        />
                        <span style={{fontSize: 10.5, opacity: 0.85}}>📸 Ảnh đề bài</span>
                      </div>
                    )}
                    <div>{m.question}</div>
                  </div>
                  <div className="copilot-assistant-bubble">
                    <MathText text={m.answer} />
                  </div>
                </div>
              ))
            )}
            {busy && (
              <div className="copilot-chat-turn">
                <div className="copilot-assistant-bubble loading-dots">
                  <span>Math Copilot đang giải toán</span>
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                  <span className="dot">.</span>
                </div>
              </div>
            )}
            {error && (
              <div className="copilot-error-banner">
                {error}
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Image preview in floating copilot footer */}
          {attachedImage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 10px',
              background: 'rgba(83, 104, 230, 0.1)',
              borderTop: '1px solid var(--border)',
              fontSize: 12
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                <img src={attachedImage} alt="Preview" style={{width: 26, height: 26, borderRadius: 4, objectFit: 'cover'}} />
                <span>📸 Đã đính kèm ảnh</span>
              </div>
              <button
                type="button"
                className="text-btn small"
                onClick={() => setAttachedImage(null)}
                style={{padding: '0 4px', color: '#ef4444'}}
                title="Bỏ ảnh"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Compose Footer */}
          <form
            className="floating-copilot-footer"
            onSubmit={e => { e.preventDefault(); handleSend(); }}
            onPaste={handlePaste}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{display: 'none'}}
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  handleImageFile(e.target.files[0]);
                  e.target.value = '';
                }
              }}
            />
            <button
              type="button"
              className="icon-button small-icon"
              onClick={() => fileInputRef.current?.click()}
              title="Tải hoặc chụp ảnh đề thi"
              style={{color: attachedImage ? 'var(--primary)' : 'var(--muted-foreground)'}}
            >
              <Camera size={16} />
            </button>
            <input
              type="text"
              placeholder={attachedImage ? 'Ảnh đề bài sẵn sàng, nhấn Gửi…' : 'Nhập câu hỏi hoặc dán ảnh Ctrl+V…'}
              value={question}
              onChange={e => setQuestion(e.target.value)}
              disabled={busy}
              className="floating-copilot-input"
            />
            <button
              type="submit"
              className="floating-copilot-send"
              disabled={busy || (!question.trim() && !attachedImage)}
              aria-label="Gửi câu hỏi"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
