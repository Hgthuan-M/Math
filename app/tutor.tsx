'use client';
import {useState,useEffect,useCallback,useRef} from 'react';
import {
  Send,Sparkles,BookOpen,Key,Check,AlertCircle,Trash2,ExternalLink,
  Bot,Zap,CheckCircle2,HelpCircle,Sliders,Cpu,Layers,FileText,
  Camera,Image as ImageIcon,X,UploadCloud,Eye
} from 'lucide-react';
import {findFormulas} from '@/lib/content';
import {sampleMathExamProblems,type SampleProblem} from '@/lib/sample-math-images';
import {MathText} from './math';

export type CopilotMode = 'general' | 'step_by_step' | 'error_check' | 'practice' | 'socratic' | 'proof' | 'photo_solve';

export function Tutor({openLesson}:{openLesson:(id:string)=>void}){
  const [question,setQuestion]=useState('');
  const [mode,setMode]=useState<CopilotMode>('general');
  const [provider,setProvider]=useState<'gemini'|'copilot'>('gemini');
  const [modelName,setModelName]=useState('gemini-3.6-flash');
  const [serverConfigured,setServerConfigured]=useState(false);
  const [geminiKey,setGeminiKey]=useState('');
  const [copilotKey,setCopilotKey]=useState('');
  const [copilotModel,setCopilotModel]=useState('gpt-4o-mini');
  const [copilotEndpoint,setCopilotEndpoint]=useState('');
  const [showSettings,setShowSettings]=useState(false);
  const [loading,setLoading]=useState(true);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const [messages,setMessages]=useState<{question:string;answer:string;mode?:CopilotMode;image?:string}[]>([]);
  const [selectedImage,setSelectedImage]=useState<string|null>(null);
  const [imageFileName,setImageFileName]=useState<string>('');
  const [isDragging,setIsDragging]=useState(false);
  const [previewModalImage,setPreviewModalImage]=useState<string|null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeKey = provider === 'gemini' ? geminiKey : copilotKey;
  const isConfigured = serverConfigured || Boolean(activeKey.trim());

  const checkStatus = useCallback(async () => {
    const savedGemini = typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') || '' : '';
    const savedCopilot = typeof window !== 'undefined' ? localStorage.getItem('copilot_api_key') || '' : '';
    const savedProv = (typeof window !== 'undefined' ? localStorage.getItem('copilot_provider') : null) as 'gemini' | 'copilot' | null;
    const effectiveProv = savedProv || 'gemini';

    const headers: Record<string, string> = {};
    if (savedGemini.trim()) headers['x-user-gemini-key'] = savedGemini.trim();
    if (savedCopilot.trim()) headers['x-user-copilot-key'] = savedCopilot.trim();
    headers['x-copilot-provider'] = effectiveProv;

    try {
      const r = await fetch('/api/tutor', { headers });
      if (!r.ok) throw new Error();
      const d = await r.json() as {
        configured: boolean;
        provider?: string;
        model?: string;
        history?: {question: string; answer: string}[];
      };
      setServerConfigured(d.configured);
      if (d.model) setModelName(d.model);
      if (d.history && d.history.length > 0) {
        setMessages(d.history.map(h => ({ ...h, mode: 'general' })));
      }
    } catch {
      setError('Chưa kiểm tra được trạng thái máy chủ Copilot.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const gKey = localStorage.getItem('gemini_api_key') || '';
      const cKey = localStorage.getItem('copilot_api_key') || '';
      const prov = (localStorage.getItem('copilot_provider') as 'gemini' | 'copilot') || 'gemini';
      const cModel = localStorage.getItem('copilot_model') || 'gpt-4o-mini';
      const cEp = localStorage.getItem('copilot_endpoint') || '';

      setGeminiKey(gKey);
      setCopilotKey(cKey);
      setProvider(prov);
      setCopilotModel(cModel);
      setCopilotEndpoint(cEp);
    } catch {}
    checkStatus();
  }, [checkStatus]);

  function saveSettings(opts: {
    prov?: 'gemini' | 'copilot';
    gKey?: string;
    cKey?: string;
    cModel?: string;
    cEp?: string;
  }) {
    try {
      if (opts.prov !== undefined) {
        setProvider(opts.prov);
        localStorage.setItem('copilot_provider', opts.prov);
      }
      if (opts.gKey !== undefined) {
        const val = opts.gKey.trim();
        setGeminiKey(val);
        if (val) localStorage.setItem('gemini_api_key', val);
        else localStorage.removeItem('gemini_api_key');
      }
      if (opts.cKey !== undefined) {
        const val = opts.cKey.trim();
        setCopilotKey(val);
        if (val) localStorage.setItem('copilot_api_key', val);
        else localStorage.removeItem('copilot_api_key');
      }
      if (opts.cModel !== undefined) {
        setCopilotModel(opts.cModel);
        localStorage.setItem('copilot_model', opts.cModel);
      }
      if (opts.cEp !== undefined) {
        setCopilotEndpoint(opts.cEp.trim());
        localStorage.setItem('copilot_endpoint', opts.cEp.trim());
      }
      setNotice('Đã cập nhật cấu hình Math Copilot!');
      setTimeout(() => setNotice(''), 3500);
      checkStatus();
    } catch {}
  }

  function handleImageFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn tệp hình ảnh (PNG, JPG, WEBP, GIF).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Dung lượng hình ảnh quá lớn (vui lòng chọn ảnh dưới 10MB).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedImage(reader.result);
        setImageFileName(file.name);
        setMode('photo_solve');
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

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function loadSampleProblem(sample: SampleProblem, autoSend = false) {
    try {
      const imgData = sample.generateImage();
      if (!imgData) return;
      setSelectedImage(imgData);
      setImageFileName(`${sample.id}.png`);
      setMode('photo_solve');
      const prompt = sample.previewPrompt;
      setQuestion(prompt);
      if (autoSend) {
        send(prompt, 'photo_solve', imgData);
      }
    } catch (err) {
      console.error('Error loading sample problem:', err);
    }
  }

  async function send(textToSend?: string, overrideMode?: CopilotMode, imageToSend?: string) {
    const img = imageToSend !== undefined ? imageToSend : selectedImage;
    const q = (textToSend || question).trim();
    if ((!q && !img) || busy) return;
    const activeMode = overrideMode || (img ? 'photo_solve' : mode);
    setBusy(true);
    setError('');

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (geminiKey.trim()) headers['x-user-gemini-key'] = geminiKey.trim();
    if (copilotKey.trim()) headers['x-user-copilot-key'] = copilotKey.trim();
    headers['x-copilot-provider'] = provider;
    if (provider === 'copilot' && copilotModel) headers['x-copilot-model'] = copilotModel;
    if (provider === 'copilot' && copilotEndpoint) headers['x-copilot-endpoint'] = copilotEndpoint;

    try {
      const r = await fetch('/api/tutor', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          question: q,
          mode: activeMode,
          image: img || undefined,
        }),
      });
      const d = await r.json() as { error?: string; answer?: string; saved?: boolean; model?: string };
      if (!r.ok) throw new Error(d.error || 'Lỗi khi gọi Math Copilot');
      if (d.answer) {
        setMessages(m => [
          ...m,
          {
            question: q || 'Đề bài toán từ hình ảnh đã gửi',
            answer: d.answer!,
            mode: activeMode,
            image: img || undefined,
          },
        ]);
      }
      if (d.model) setModelName(d.model);
      setQuestion('');
      setSelectedImage(null);
      setImageFileName('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Chưa gửi được câu hỏi.');
    } finally {
      setBusy(false);
    }
  }

  function insertSymbol(symbol: string) {
    if (!textareaRef.current) {
      setQuestion(prev => prev + symbol);
      return;
    }
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = question;
    const updated = text.substring(0, start) + symbol + text.substring(end);
    setQuestion(updated);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + symbol.length, start + symbol.length);
    }, 10);
  }

  const related = findFormulas(question).slice(0, 3);

  const copilotModes = [
    { id: 'photo_solve', label: '📸 Giải đề bằng ảnh', icon: Camera, desc: 'Tải hoặc dán ảnh chụp đề bài để nhận diện và giải chi tiết từng bước' },
    { id: 'general', label: 'Copilot Tổng quát', icon: Bot, desc: 'Giải thích trực quan, ứng dụng' },
    { id: 'step_by_step', label: 'Giải từng bước', icon: Zap, desc: 'Tách từng Bước 1, 2, 3 chi tiết' },
    { id: 'error_check', label: 'Soát lỗi bài làm', icon: CheckCircle2, desc: 'Chỉ ra dòng sai & cách sửa' },
    { id: 'practice', label: 'Tạo bài tự luyện', icon: Layers, desc: 'Tạo 3 bài tập kèm lời giải' },
    { id: 'socratic', label: 'Gợi mở Socratic', icon: HelpCircle, desc: 'Dẫn dắt tư duy, không giải hộ' },
    { id: 'proof', label: 'Chứng minh chặt chẽ', icon: FileText, desc: 'Chứng minh theo logic toán' },
  ] as const;

  const quickMathSnippets = [
    { label: 'Ma trận', val: '[[a, b], [c, d]]' },
    { label: 'det(A)', val: 'det(A)' },
    { label: 'A⁻¹', val: 'A^{-1}' },
    { label: '∫ dx', val: '\\int f(x) dx' },
    { label: '∑', val: '\\sum_{i=1}^n ' },
    { label: '√x', val: '\\sqrt{x}' },
    { label: 'a/b', val: '\\frac{a}{b}' },
    { label: 'x²', val: '^2' },
    { label: 'x₁', val: '_1' },
    { label: 'Δ', val: '\\Delta' },
    { label: 'λ', val: '\\lambda' },
    { label: 'π', val: '\\pi' },
    { label: '±', val: '\\pm' },
    { label: 'lim', val: '\\lim_{x \\to 0} ' },
  ];

  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">ĐỒNG HÀNH & GIẢI TOÁN THÔNG MINH</p>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
          <div>
            <h1>Math Copilot · Gia sư Toán học AI</h1>
            <p>Trợ lý đồng hành: giải chi tiết từng bước, soát lỗi sai bài làm, tạo bài tập tự luyện và xuất MathML chuẩn W3C.</p>
          </div>
          <div className="control-row">
            <button
              className="secondary-btn small-btn"
              onClick={() => setShowSettings(v => !v)}
              title="Cài đặt Copilot API & Mô hình"
            >
              <Sliders size={15}/> {showSettings ? 'Đóng cài đặt' : 'Cài đặt Copilot'}
            </button>
          </div>
        </div>
      </div>

      {/* SETTINGS DRAWER / BOX */}
      {showSettings && (
        <div className="connection-note" style={{marginTop:0,marginBottom:20}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <strong>⚙️ Cấu hình Math Copilot Engine & API Key</strong>
            <span className="small muted">Hỗ trợ Google Gemini & GitHub/OpenAI Copilot</span>
          </div>

          {/* Provider Selection Tabs */}
          <div className="control-row" style={{marginBottom:14}}>
            <button
              className={`pill-toggle ${provider === 'gemini' ? 'active f' : ''}`}
              onClick={() => saveSettings({ prov: 'gemini' })}
            >
              <Sparkles size={14}/> Google Gemini Copilot
            </button>
            <button
              className={`pill-toggle ${provider === 'copilot' ? 'active d' : ''}`}
              onClick={() => saveSettings({ prov: 'copilot' })}
            >
              <Cpu size={14}/> GitHub / OpenAI Copilot
            </button>
          </div>

          {provider === 'gemini' ? (
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                <span className="small">Khóa API Google Gemini:</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="small"
                  style={{display:'inline-flex',alignItems:'center',gap:4,color:'var(--primary)'}}
                >
                  Lấy khóa miễn phí tại Google AI Studio <ExternalLink size={12}/>
                </a>
              </div>
              <div style={{display:'flex',gap:8}}>
                <input
                  type="password"
                  placeholder="Dán Google Gemini API Key (bắt đầu bằng AIzaSy...)"
                  value={geminiKey}
                  onChange={e => setGeminiKey(e.target.value)}
                  style={{flex:1,height:38,padding:'0 12px',borderRadius:6,border:'1px solid var(--border)',background:'var(--background)',color:'var(--foreground)',fontSize:14}}
                />
                <button
                  className="primary-btn"
                  style={{padding:'0 16px',height:38}}
                  onClick={() => saveSettings({ gKey: geminiKey })}
                >
                  <Check size={16}/> Lưu khóa
                </button>
                {geminiKey && (
                  <button
                    className="secondary-btn"
                    style={{padding:'0 12px',height:38}}
                    onClick={() => saveSettings({ gKey: '' })}
                    title="Xóa khóa"
                  >
                    <Trash2 size={16}/>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                <span className="small">Khóa API Copilot / OpenAI / Azure:</span>
                <span className="small muted">Mặc định gọi https://api.openai.com/v1/chat/completions</span>
              </div>
              <div style={{display:'flex',gap:8,marginBottom:8}}>
                <input
                  type="password"
                  placeholder="Dán OpenAI / Copilot API Key (sk-...)"
                  value={copilotKey}
                  onChange={e => setCopilotKey(e.target.value)}
                  style={{flex:1,height:38,padding:'0 12px',borderRadius:6,border:'1px solid var(--border)',background:'var(--background)',color:'var(--foreground)',fontSize:14}}
                />
                <button
                  className="primary-btn"
                  style={{padding:'0 16px',height:38}}
                  onClick={() => saveSettings({ cKey: copilotKey })}
                >
                  <Check size={16}/> Lưu
                </button>
                {copilotKey && (
                  <button
                    className="secondary-btn"
                    style={{padding:'0 12px',height:38}}
                    onClick={() => saveSettings({ cKey: '' })}
                    title="Xóa khóa"
                  >
                    <Trash2 size={16}/>
                  </button>
                )}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                <div>
                  <label className="small muted" style={{display:'block',marginBottom:3}}>Tên Model:</label>
                  <input
                    type="text"
                    value={copilotModel}
                    onChange={e => { setCopilotModel(e.target.value); saveSettings({ cModel: e.target.value }); }}
                    placeholder="gpt-4o-mini hoặc gpt-4o"
                    style={{width:'100%',height:34,padding:'0 10px',borderRadius:6,border:'1px solid var(--border)',background:'var(--background)',color:'var(--foreground)',fontSize:13}}
                  />
                </div>
                <div>
                  <label className="small muted" style={{display:'block',marginBottom:3}}>Custom Endpoint (Tùy chọn):</label>
                  <input
                    type="text"
                    value={copilotEndpoint}
                    onChange={e => { setCopilotEndpoint(e.target.value); saveSettings({ cEp: e.target.value }); }}
                    placeholder="https://api.openai.com/v1/chat/completions"
                    style={{width:'100%',height:34,padding:'0 10px',borderRadius:6,border:'1px solid var(--border)',background:'var(--background)',color:'var(--foreground)',fontSize:13}}
                  />
                </div>
              </div>
            </div>
          )}

          {notice && <p className="small" style={{color:'#29a393',marginTop:8,fontWeight:600}}>{notice}</p>}
        </div>
      )}

      <div className="tutor-layout">
        <section className="panel chat-panel">
          {/* COPILOT STATUS & ACTIVE MODE */}
          <div className="section-title" style={{marginBottom:10}}>
            <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
              <h3><Bot size={20} className="copilot-sparkle-icon"/> Math Copilot</h3>
              <span className={`tag ${isConfigured ? 'green' : ''}`}>
                {loading ? 'Đang kết nối…' : isConfigured ? `${provider === 'gemini' ? 'Google Gemini' : 'Copilot'} (${modelName})` : 'Chưa có API Key'}
              </span>
            </div>
            <span className="small muted">Chế độ: <strong>{copilotModes.find(m => m.id === mode)?.label}</strong></span>
          </div>

          {/* COPILOT MODE PILLS */}
          <div className="copilot-mode-pills-row">
            {copilotModes.map(m => {
              const Icon = m.icon;
              const isActive = mode === m.id;
              return (
                <button
                  key={m.id}
                  className={`copilot-pill ${isActive ? 'active' : ''}`}
                  onClick={() => setMode(m.id)}
                  title={m.desc}
                >
                  <Icon size={14}/>
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* CHAT MESSAGES HISTORY */}
          <div className="chat-history" aria-live="polite">
            {messages.length ? (
              messages.map((m, i) => (
                <div key={i} style={{marginBottom:18}}>
                  <div className="chat-message user">
                    {m.image && (
                      <div className="chat-uploaded-img-box">
                        <img
                          src={m.image}
                          alt="Đề bài tải lên"
                          className="chat-uploaded-img"
                          onClick={() => setPreviewModalImage(m.image!)}
                          title="Bấm để xem ảnh phóng to"
                        />
                        <span className="photo-user-badge">📸 Đề bài từ hình ảnh</span>
                      </div>
                    )}
                    <div>{m.question}</div>
                  </div>
                  <div className="chat-message assistant">
                    {m.mode && m.mode !== 'general' && (
                      <div className="copilot-badge-in-turn">
                        <span>Chế độ: {copilotModes.find(x => x.id === m.mode)?.label}</span>
                      </div>
                    )}
                    <MathText text={m.answer}/>
                  </div>
                </div>
              ))
            ) : (
              <div className="chat-empty">
                <Bot size={42} className="copilot-sparkle-icon" style={{margin:'0 auto'}}/>
                <h2>Tôi có thể đồng hành cùng bạn điều gì hôm nay?</h2>
                <p>Hãy chọn một tác vụ Copilot bên dưới hoặc gõ bài toán / tải ảnh đề bạn cần giải quyết:</p>

                {/* Copilot Action Cards */}
                <div className="copilot-action-grid">
                  <button
                    className="copilot-action-card highlight-photo-card"
                    onClick={() => {
                      setMode('photo_solve');
                      fileInputRef.current?.click();
                    }}
                  >
                    <Camera size={18} className="accent-color"/>
                    <strong>Giải đề bằng hình ảnh</strong>
                    <span>Chụp hoặc tải ảnh đề thi, AI đọc đề và giải chi tiết</span>
                  </button>

                  <button
                    className="copilot-action-card"
                    onClick={() => {
                      setMode('step_by_step');
                      const q = 'Giải chi tiết từng bước cách tính ma trận nghịch đảo cấp 2 và cấp 3';
                      setQuestion(q);
                      send(q, 'step_by_step');
                    }}
                    disabled={!isConfigured || busy}
                  >
                    <Zap size={18} className="accent-color"/>
                    <strong>Giải từng bước</strong>
                    <span>Tách rõ từng bước giải bài toán mẫu</span>
                  </button>

                  <button
                    className="copilot-action-card"
                    onClick={() => {
                      setMode('error_check');
                      const q = 'Kiểm tra giúp tôi bài giải ma trận này có đúng không: A = [[2, 1], [5, 3]], det(A) = 2*3 - 1*5 = 1, adj(A) = [[3, -1], [-5, 2]].';
                      setQuestion(q);
                      send(q, 'error_check');
                    }}
                    disabled={!isConfigured || busy}
                  >
                    <CheckCircle2 size={18} className="accent-color"/>
                    <strong>Bắt lỗi bài làm</strong>
                    <span>Chỉ ra bước sai và nguyên nhân</span>
                  </button>

                  <button
                    className="copilot-action-card"
                    onClick={() => {
                      setMode('practice');
                      const q = 'Tạo 3 bài tập tự luyện về định thức ma trận và giá trị riêng kèm đáp án chi tiết';
                      setQuestion(q);
                      send(q, 'practice');
                    }}
                    disabled={!isConfigured || busy}
                  >
                    <Layers size={18} className="accent-color"/>
                    <strong>Tạo bài tập</strong>
                    <span>3 cấp độ: cơ bản, vận dụng, nâng cao</span>
                  </button>

                  <button
                    className="copilot-action-card"
                    onClick={() => {
                      setMode('proof');
                      const q = 'Chứng minh công thức Euler e^(i*theta) = cos(theta) + i*sin(theta) bằng chuỗi Taylor';
                      setQuestion(q);
                      send(q, 'proof');
                    }}
                    disabled={!isConfigured || busy}
                  >
                    <FileText size={18} className="accent-color"/>
                    <strong>Chứng minh công thức</strong>
                    <span>Trình bày logic toán học chặt chẽ</span>
                  </button>
                </div>

                {/* DEDICATED PHOTO SOLVE HUB (WHEN IN PHOTO_SOLVE MODE) */}
                {mode === 'photo_solve' && (
                  <div className="photo-solve-hub">
                    <div
                      className={`photo-dropzone ${isDragging ? 'dragging' : ''}`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadCloud size={34} className="photo-upload-icon"/>
                      <div className="photo-dropzone-text">
                        <strong>Tải lên hoặc chụp ảnh đề bài toán</strong>
                        <p className="small muted">
                          Kéo thả ảnh vào đây hoặc bấm để chọn ảnh (PNG, JPG, WEBP). Bạn cũng có thể dùng công cụ chụp màn hình và dán trực tiếp bằng <strong>Ctrl + V</strong>.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="secondary-btn small-btn"
                        onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      >
                        <Camera size={14}/> Chọn ảnh từ thiết bị
                      </button>
                    </div>

                    {/* Quick Sample Exam Problems */}
                    <div className="photo-samples-container">
                      <div className="photo-samples-header">
                        <span className="small"><strong>⚡ Thử nghiệm nhanh với đề thi mẫu thực tế:</strong></span>
                        <span className="small muted">(Bấm nút để nạp ảnh bài toán và giải ngay)</span>
                      </div>
                      <div className="photo-samples-grid">
                        {sampleMathExamProblems.map(sample => (
                          <div
                            key={sample.id}
                            className="photo-sample-card"
                            onClick={() => loadSampleProblem(sample, false)}
                          >
                            <div className="photo-sample-badge">{sample.topic}</div>
                            <h4 className="photo-sample-title">{sample.title}</h4>
                            <p className="photo-sample-desc">{sample.previewPrompt}</p>
                            <div className="photo-sample-action">
                              <span>Bấm để nạp ảnh</span>
                              <button
                                type="button"
                                className="small-btn primary-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  loadSampleProblem(sample, true);
                                }}
                              >
                                Giải ngay
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {error && (
            <div role="alert" className="warning-box" style={{margin:'8px 0'}}>
              <div style={{display:'flex',alignItems:'center',gap:6}}>
                <AlertCircle size={16} />
                <strong>{error}</strong>
              </div>
            </div>
          )}

          {/* MATH KEYBOARD / FORMULA INSERTER TOOLBAR */}
          <div className="copilot-math-toolbar">
            <span className="small muted" style={{marginRight:4,fontSize:11}}>Ký hiệu nhanh:</span>
            {quickMathSnippets.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="copilot-math-chip"
                onClick={() => insertSymbol(item.val)}
                title={`Chèn ${item.label}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* IMAGE PREVIEW BAR IN COMPOSER */}
          {selectedImage && (
            <div className="photo-composer-preview">
              <div className="photo-preview-left">
                <img
                  src={selectedImage}
                  alt="Ảnh đề bài đã chọn"
                  className="photo-preview-thumbnail"
                  onClick={() => setPreviewModalImage(selectedImage)}
                  title="Xem phóng to"
                />
                <div className="photo-preview-info">
                  <span className="photo-preview-badge">📸 Đã đính kèm ảnh đề bài</span>
                  <span className="small muted">{imageFileName || 'Ảnh từ bộ nhớ đệm / tải lên'}</span>
                </div>
              </div>
              <div className="photo-preview-actions">
                <button
                  type="button"
                  className="text-btn small"
                  onClick={() => setPreviewModalImage(selectedImage)}
                  style={{display:'inline-flex',alignItems:'center',gap:4}}
                >
                  <Eye size={13}/> Xem to
                </button>
                <button
                  type="button"
                  className="text-btn small"
                  onClick={() => {
                    setSelectedImage(null);
                    setImageFileName('');
                  }}
                  style={{display:'inline-flex',alignItems:'center',gap:4,color:'#ef4444'}}
                  title="Gỡ ảnh này"
                >
                  <X size={14}/> Gỡ ảnh
                </button>
              </div>
            </div>
          )}

          {/* COMPOSE FORM */}
          <form
            className={`chat-compose ${isDragging ? 'dragging' : ''}`}
            onSubmit={e => { e.preventDefault(); send(); }}
            onPaste={handlePaste}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{display:'none'}}
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  handleImageFile(e.target.files[0]);
                  e.target.value = '';
                }
              }}
            />

            <button
              type="button"
              className={`chat-media-btn ${selectedImage ? 'active' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              title="Tải ảnh đề thi / bài tập toán (hoặc bấm Ctrl+V để dán ảnh)"
            >
              <Camera size={19}/>
            </button>

            <textarea
              ref={textareaRef}
              aria-label="Câu hỏi cho Math Copilot"
              maxLength={2500}
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onPaste={handlePaste}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={
                selectedImage
                  ? 'Ảnh đề bài đã sẵn sàng! Gõ thêm yêu cầu (ví dụ: "giải chi tiết câu 38", "chỉ ra bẫy") hoặc nhấn Gửi ngay…'
                  : isConfigured
                  ? `Hỏi Math Copilot ở chế độ [${copilotModes.find(m => m.id === mode)?.label}]… (Enter để gửi, Ctrl+V để dán ảnh)`
                  : 'Hãy cài đặt API Key ở trên để kích hoạt Math Copilot…'
              }
              disabled={!isConfigured || busy}
            />
            <button className="primary-btn chat-send-btn" disabled={!isConfigured || busy || (!question.trim() && !selectedImage)}>
              <Send size={17}/> {busy ? 'Đang giải…' : 'Gửi'}
            </button>
          </form>

          {/* FULL IMAGE MODAL */}
          {previewModalImage && (
            <div className="photo-modal-overlay" onClick={() => setPreviewModalImage(null)}>
              <div className="photo-modal-content" onClick={e => e.stopPropagation()}>
                <div className="photo-modal-header">
                  <h4>Chi tiết hình ảnh đề bài đã đính kèm</h4>
                  <button className="text-btn small" onClick={() => setPreviewModalImage(null)}>
                    <X size={18}/>
                  </button>
                </div>
                <div className="photo-modal-body">
                  <img src={previewModalImage} alt="Ảnh đề bài phóng to" className="photo-modal-img"/>
                </div>
              </div>
            </div>
          )}

          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
            <p className="small muted">
              Math Copilot hỗ trợ giải toán bằng hình ảnh OCR và văn bản. Mọi công thức đều kết xuất MathML chuẩn W3C.
            </p>
            {messages.length > 0 && (
              <button
                className="text-btn small"
                onClick={() => setMessages([])}
                style={{display:'inline-flex',alignItems:'center',gap:4}}
              >
                <Trash2 size={13}/> Xóa hội thoại
              </button>
            )}
          </div>
        </section>

        {/* SIDEBAR CONTEXT */}
        <aside className="panel prose">
          <BookOpen className="accent-icon"/>
          <h3>Gợi ý & Học liệu Copilot</h3>
          <p className="small">Copilot tự động kết nối lý thuyết và các bài học trong sổ tay liên quan đến câu hỏi của bạn.</p>
          {question.trim() ? (
            related.length ? (
              related.map(f => (
                <button className="related-lesson" key={f.id} onClick={() => openLesson(f.id)}>
                  <strong>{f.name}</strong>
                  <div className="small"><MathText text={f.theory}/></div>
                </button>
              ))
            ) : (
              <p className="small muted">Nhập từ khóa như “ma trận”, “định thức”, “tích phân”, “Euler” để Copilot liên kết công thức.</p>
            )
          ) : (
            [
              { name: 'Ma trận & Định thức', prompt: 'Giải thích định thức ma trận và cách tính' },
              { name: 'Ma trận nghịch đảo A⁻¹', prompt: 'Hướng dẫn tìm ma trận nghịch đảo của A = [[2, 1], [5, 3]]' },
              { name: 'Giá trị riêng & Vectơ riêng', prompt: 'Cách tìm giá trị riêng của ma trận cấp 2' },
              { name: 'Công thức Euler', prompt: 'Chứng minh công thức Euler e^(i*theta)' },
              { name: 'Bất đẳng thức AM-GM', prompt: 'Ứng dụng bất đẳng thức AM-GM trong giải toán' },
            ].map(item => (
              <button
                className="related-lesson"
                key={item.name}
                onClick={() => {
                  setQuestion(item.prompt);
                  if (textareaRef.current) textareaRef.current.focus();
                }}
              >
                <strong>{item.name}</strong>
                <span className="small muted">Hỏi: &quot;{item.prompt}&quot;</span>
              </button>
            ))
          )}
        </aside>
      </div>
    </>
  );
}
