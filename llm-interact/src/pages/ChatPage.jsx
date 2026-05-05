import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './ChatPage.css';

const CHUNK_SIZE = 80;          // 每次输出的字符数
const CHUNK_INTERVAL = 10;     // 每块的间隔（毫秒），可调整

// 图片资源
import userAvatar from '../assets/toyohime.png';   // 用户头像
import botAvatar from '../assets/nina.png';    // 机器人头像（可换成其他图）
import topTitle from '../assets/shell.png';     // 顶部标题图标
import welcomeLogo from '../assets/nina_full.png';  // 欢迎页大图标

// ==================== 预设剧本 ====================
const SCRIPTED_REPLIES = [
  `我是shell intelligence，会写代码，想创意。请把你想完成的任务交给我吧！`,
`
好的，根据你的需求，以下是我为您生成的污秽处理代码，可以直接粘贴进react前端项目中使用


**App.jsx**
\`\`\`jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ShieldAlert } from 'lucide-react';
import s1_1 from './assets/sentence1-1.mp3';
import s1_2 from './assets/sentence1-2.mp3';
import s2_1 from './assets/sentence2-1.mp3';
import s2_2 from './assets/sentence2-2.mp3';
import s2_3 from './assets/sentence2-3.mp3';
import s2_4 from './assets/sentence2-4.mp3';
import s2_explosion from './assets/explosion7.ogg';
import s2_dead from './assets/se_pldead00.wav';

import nina from './assets/nina_full.png';
import './App.css';

// --- 弹窗组件 ---
const MessageModal = ({ isOpen, onClose, title, content, avatar, colorClass = "modal-cyan" }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="modal-backdrop">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="modal-overlay"
        />
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 100 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          className={\`modal-card \${colorClass}\`}
        >
          <div className="modal-header">
            <div className="modal-avatar-box">
              {avatar || <ShieldAlert className="modal-avatar-icon" />}
            </div>
            <h3 className="modal-title">{title}</h3>
          </div>
          {content && <p className="modal-content">{content}</p>}
          <button onClick={onClose} className="modal-button">
            确认
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function App() {
  const [mode, setMode] = useState('IDLE');
  const [data, setData] = useState(new Array(30).fill(15));
  const [modalStep, setModalStep] = useState(0);
  const [isFreeze, setIsFreeze] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);

  const timerRef = useRef(null);

  const playSentence = (sentence) => {
    const audio = new Audio(sentence);
    audio.volume = 0.6;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFreeze && modalStep === 6 && e.key !== 'escape') return;
      if (modalStep !== 0 && e.key !== 'escape') return;
      const key = e.key.toLowerCase();
      if (key === 'q') {
        playSentence(s1_1);
        setMode('HIGH');
        setModalStep(1);
      } else if (key === 'w') {
        playSentence(s1_2);
        setMode('IDLE');
        setModalStep(2);
      } else if (key === 'e') {
        setModalStep(10);
      } else if (key === 'r') {
        setMode('CRITICAL');
        setModalStep(3);
        playSentence(s2_1);
      } else if (key === 'escape') {
        setMode('IDLE');
        setModalStep(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalStep, isFreeze]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isFreeze && !isCrashed) {
      timerRef.current = setInterval(() => {
        setData(prev => {
          const newData = [...prev.slice(1)];
          let nextVal;
          if (mode === 'CRITICAL') nextVal = Math.random() * 80 + 130;
          else if (mode === 'HIGH') nextVal = Math.random() * 20 + 70;
          else nextVal = Math.random() * 10 + 10;
          return [...newData, nextVal];
        });
      }, 120);
    }
    return () => clearInterval(timerRef.current);
  }, [mode, isFreeze, isCrashed]);

  useEffect(() => {
    if (modalStep === 6) {
      setIsFreeze(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modalStep]);

  const handleCloseModal = () => {
    const sentenceList = [s2_1, s2_2, s2_3, s2_4];
    if (modalStep === 5) {
      playSentence(s2_explosion);
      playSentence(sentenceList[3]);
    }
    if (modalStep < 5) {
      const nextIndex = modalStep - 2;
      if (nextIndex >= 0 && nextIndex <= sentenceList.length) {
        playSentence(sentenceList[nextIndex]);
      }
      setModalStep(modalStep + 1);
    } else if (modalStep === 5) {
      setModalStep(6);
    } else {
      setModalStep(0);
    }
  };

  const finalClose = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsCrashed(true);
    setModalStep(0);
    playSentence(s2_dead);
    document.body.style.overflow = '';
    setTimeout(() => {
      window.close();
    }, 800);
  };

  return (
    <div className="app-container">
      {isCrashed && (
        <div className="crash-screen">
          <div className="crash-content">
            <pre className="crash-text">⚡ 似了 ⚡</pre>
            <p className="crash-sub">你个活爹，辛辛苦苦训出来的AI被你用污秽活活撑死了</p>
          </div>
        </div>
      )}

      {/* 顶部状态栏 */}
      <div className="top-bar">
        <div className="top-left">
          <div className="icon-box">
            <Terminal size={32} />
          </div>
          <div>
            <h1 className="site-title">S.H.I.T. ── 同步异构智能污染监控</h1>
            <div className="status-line">
              <span>INPUT_BUFFER: ACTIVE</span>
              <span>ENCRYPTION: RSA_4096</span>
            </div>
          </div>
        </div>
        <div className="top-right">
          <div className={\`mode-indicator \${mode === 'CRITICAL' ? 'critical' : 'normal'}\`}>
            MODE: {mode}
          </div>
          <div className="time-display">LOCAL_TIME: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      {/* 居中监控框 */}
      <div className="monitor-box">
        <div className="corner-tr" />
        <div className="corner-bl" />
        <div className="chart-area">
          <div className="y-axis">
            <span>200%</span>
            <span>150%</span>
            <span>100%</span>
            <span>50%</span>
            <span>0%</span>
          </div>
          {data.map((val, i) => (
            <motion.div
              key={i}
              animate={{
                height: \`\${val}%\`,
                backgroundColor: val > 100 ? '#dc2626' : (val > 65 ? '#d97706' : '#542e91')
              }}
              className="bar"
              style={{ boxShadow: val > 100 ? '0 0 15px #dc2626' : 'none' }}
            />
          ))}
          <div className="threshold">
            <span>OVERFLOW_THRESHOLD</span>
          </div>
        </div>
      </div>

      {/* 假死遮罩 */}
      {modalStep === 6 && !isCrashed && <div className="freeze-overlay" />}

      {/* 弹窗 */}
      <MessageModal
        isOpen={modalStep === 1}
        onClose={() => setModalStep(0)}
        title="完了呀老师，这个代码会涨潮的喔"
      />
      <MessageModal
        isOpen={modalStep === 2}
        onClose={() => setModalStep(0)}
        title="又退潮啦"
      />
      <MessageModal
        isOpen={modalStep === 3}
        onClose={handleCloseModal}
        title="老师救命啊，堆栈溢出了啊，爆辣！"
        colorClass="modal-red"
      />
      <MessageModal
        isOpen={modalStep === 4}
        onClose={handleCloseModal}
        title="这个污秽炸出来啦"
        colorClass="modal-amber"
      />
      <MessageModal
        isOpen={modalStep === 5}
        onClose={handleCloseModal}
        title="丰姬老师这个污秽炸出来了哇"
        colorClass="modal-amber"
      />
      <MessageModal
        isOpen={modalStep === 6}
        onClose={finalClose}
        title="爆出来了哇老师"
        colorClass="modal-amber"
      />
      <MessageModal
        isOpen={modalStep === 10}
        onClose={() => setModalStep(0)}
        title="此乃真实！"
        avatar={<img src={nina} alt="nina" className="avatar-img" />}
        colorClass="modal-purple"
      />
    </div>
  );
}
\`\`\`

**App.css**
\`\`\`css
/* 与首页统一的蓝紫色系 */
:root {
  --primary-purple: #542e91;
  --primary-blue: #2b5797;
  --accent-cyan: #06b6d4;
  --bg-main: #f5f7fa;
  --text-dark: #1e1e2a;
  --text-light: #5a5a6e;
  --border-light: #e2e6ee;
  --red: #dc2626;
  --amber: #d97706;
}

body {
  margin: 0;
  font-family: 'Inter', system-ui, sans-serif;
  background: var(--bg-main);
  color: var(--text-dark);
  -webkit-font-smoothing: antialiased;
}

/* ---------- 主容器 ---------- */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  background: var(--bg-main);
}

/* ---------- 崩溃画面 ---------- */
.crash-screen {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}
.crash-content {
  text-align: center;
  color: white;
}
.crash-text {
  font-size: 3.5rem;
  color: #dc2626;
  font-family: monospace;
  margin: 0 0 20px;
  animation: pulse 1s infinite;
}
.crash-sub {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.8);
  margin: 0;
}

/* ---------- 顶部状态栏 ---------- */
.top-bar {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 50px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-light);
}
.top-left {
  display: flex;
  gap: 20px;
  align-items: center;
}
.icon-box {
  border: 2px solid var(--primary-purple);
  background: rgba(84,46,145,0.1);
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-purple);
}
.site-title {
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--text-dark);
  margin: 0;
}
.status-line {
  display: flex;
  gap: 20px;
  margin-top: 6px;
  font-size: 0.8rem;
  color: var(--text-light);
  font-family: monospace;
}
.top-right {
  text-align: right;
}
.mode-indicator {
  font-size: 1.1rem;
  font-weight: 700;
  font-family: monospace;
  color: var(--primary-purple);
  transition: color 0.2s;
}
.mode-indicator.critical {
  color: var(--red);
  animation: pulse 0.8s infinite;
}
.time-display {
  font-size: 0.75rem;
  color: var(--text-light);
  margin-top: 6px;
  font-family: monospace;
}

/* ---------- 监控框 ---------- */
.monitor-box {
  position: relative;
  width: 100%;
  max-width: 900px;
  background: white;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 40px 30px 30px;
  box-shadow: 0 8px 20px rgba(84,46,145,0.04);
}
.corner-tr {
  position: absolute;
  top: 0;
  right: 0;
  width: 24px;
  height: 24px;
  border-top: 3px solid var(--primary-purple);
  border-right: 3px solid var(--primary-purple);
  border-radius: 0 12px 0 0;
}
.corner-bl {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 24px;
  height: 24px;
  border-bottom: 3px solid var(--primary-purple);
  border-left: 3px solid var(--primary-purple);
  border-radius: 0 0 0 12px;
}
.chart-area {
  height: 240px;
  display: flex;
  align-items: flex-end;
  gap: 2px;
  padding: 0 10px;
  border-bottom: 1px solid var(--border-light);
  position: relative;
}
.y-axis {
  position: absolute;
  left: -60px;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 0.7rem;
  color: var(--text-light);
  font-family: monospace;
  text-align: right;
  width: 50px;
}
.bar {
  flex: 1;
  min-width: 4px;
  border-radius: 2px 2px 0 0;
  transition: background-color 0.1s;
}
.threshold {
  position: absolute;
  top: 0;
  left: 10px;
  right: 10px;
  height: 2px;
  background: repeating-linear-gradient(90deg, var(--red) 0 4px, transparent 4px 8px);
  border-top: none;
}
.threshold span {
  position: absolute;
  right: 0;
  top: -20px;
  font-size: 0.7rem;
  color: var(--red);
  font-weight: 600;
  white-space: nowrap;
}

/* ---------- 假死遮罩 ---------- */
.freeze-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(2px);
}

/* ---------- 弹窗组件 ---------- */
.modal-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  pointer-events: none;
}
.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.25);
}
.modal-card {
  position: relative;
  background: white;
  border-width: 3px;
  border-style: solid;
  padding: 30px;
  width: 380px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
  pointer-events: auto;
  border-radius: 8px;
}
.modal-card.modal-cyan { border-color: var(--accent-cyan); }
.modal-card.modal-red { border-color: var(--red); }
.modal-card.modal-amber { border-color: var(--amber); }
.modal-card.modal-purple { border-color: var(--primary-purple); }

.modal-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}
.modal-avatar-box {
  width: 56px;
  height: 56px;
  border: 3px solid currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: inherit;
}
.modal-avatar-icon {
  width: 28px;
  height: 28px;
}
.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.modal-title {
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--text-dark);
  margin: 0;
  text-transform: uppercase;
}
.modal-content {
  font-size: 0.95rem;
  color: var(--text-light);
  line-height: 1.6;
  margin: 0 0 24px;
}
.modal-button {
  width: 100%;
  padding: 10px;
  border: 2px solid currentColor;
  background: transparent;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: background 0.2s;
  text-transform: uppercase;
}
.modal-button:hover {
  background: rgba(0,0,0,0.03);
}

/* ---------- 动画 ---------- */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
\`\`\`
`,

  `表格输出测试

**评测数据对比：**

| 模型 | MMLU | HumanEval | GSM8K |
|------|------|-----------|-------|
| Shell Intelligence (Ours) | **89.7** | **82.4** | **94.2** |
| GPT-4 | 86.4 | 67.0 | 92.0 |
| Claude 3 | 88.2 | 76.5 | 91.8 |

> 注：以上数据来自 NeuraCore AI Lab 内部评测。`,

  `当然，以上数据均来自 NeuraCore AI Lab 的内部评测。由于这是预设剧本演示，我能透露的技术细节就到这里了。感谢您的体验！

如果您想了解更底层的实现，可以参考我们的论文草案：

\`\`\`bibtex
@article{vance2025superconductive,
  title={Superconductive Thinking: Dynamic Sparse Activation for Efficient Long-Context LLMs},
  author={Vance, Elias and others},
  journal={arXiv preprint arXiv:2503.12345},
  year={2025}
}
\`\`\``,

  `（演示结束。若需继续对话，请刷新页面从头开始。）`
];

const TYPING_SPEED = 0.1;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== 代码块包装组件 ====================
function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-language">{language || 'text'}</span>
        <button className="copy-button" onClick={handleCopy}>
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <SyntaxHighlighter
        style={oneLight}
        language={language}
        PreTag="div"
        customStyle={{ 
          margin: 0,
          borderRadius: '0 0 8px 8px',
          fontSize: '0.85rem'
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

// ==================== Markdown 渲染组件 ====================
function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const codeString = String(children).replace(/\n$/, '');
          
          if (!inline && match) {
            return <CodeBlock language={match[1]} code={codeString} />;
          }
          
          if (!inline) {
            return <CodeBlock language="text" code={codeString} />;
          }
          
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        a({ href, children }) {
          return (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

let chunk_size_ratio=0.5;
// ==================== 主组件 ====================
function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [turn, setTurn] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const typingTimerRef = useRef(null);
  const currentTypingMessageIdRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  const startTypingEffect = (fullText, messageId) => {
    let currentIndex = 0;
    setIsTyping(true);

    const pushChunk = () => {
      if (currentIndex < fullText.length) {
        // 计算下一个块的结束位置
        chunk_size_ratio+=0.05;
        const nextIndex = Math.min(currentIndex + CHUNK_SIZE*chunk_size_ratio, fullText.length);
        const newContent = fullText.slice(0, nextIndex);
        const isFinished = nextIndex >= fullText.length;

        setMessages(prev =>
          prev.map(msg => {
            if (msg.id === messageId) {
              return {
                ...msg,
                content: newContent,
                isStreaming: !isFinished
              };
            }
            return msg;
          })
        );

        currentIndex = nextIndex;

        if (isFinished) {
          // 输出完毕
          setIsTyping(false);
          setIsLoading(false);
        } else {
          // 继续下一块
          setTimeout(pushChunk, CHUNK_INTERVAL);
        }
      }
    };

    // 首次调度（可加一点小延迟模拟思考）
    setTimeout(pushChunk, 200);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading || isTyping) return;

    const userContent = inputValue.trim();
    
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: userContent,
      isStreaming: false
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const replyIndex = Math.min(turn, SCRIPTED_REPLIES.length - 1);
    const fullReply = SCRIPTED_REPLIES[replyIndex] || "（剧本已结束，感谢您的参与。）";

    await sleep(600 + Math.random() * 400);

    const botMessageId = Date.now() + 1;
    const botMessage = {
      id: botMessageId,
      role: 'assistant',
      content: '',
      isStreaming: true
    };
    
    setMessages(prev => [...prev, botMessage]);
    currentTypingMessageIdRef.current = botMessageId;
    startTypingEffect(fullReply, botMessageId);
    setTurn(prev => prev + 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageContent = (msg) => {
    return (
      <div className="message-content">
        <MarkdownRenderer content={msg.content} />
        {msg.isStreaming && <span className="typing-cursor">▊</span>}
      </div>
    );
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        <header className="chat-header">
          <div className="header-left">
            <img src={topTitle} alt="NeuraCore Logo" className="logo-icon-img" style={{ width: '65px' }} />
            <span className="model-name">Shell Intelligence</span>
            <span className="badge">SOTA 内测版</span>
          </div>
          <div className="header-right">
            <button className="icon-btn" onClick={() => window.location.reload()} title="新对话">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
            <button className="icon-btn" onClick={() => {}} title="设置" disabled>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </div>
        </header>

        {messages.length === 0 ? (
          <div className="welcome-screen">
            <div className="welcome-content">
              <div className="welcome-logo"> <img src={welcomeLogo} alt="Logo" className="welcome-logo-img" /></div>
              <h1 className="welcome-title">体验下一代大语言模型</h1>
              <p className="welcome-subtitle">
                基于『超导思维』架构，多项指标达到 SOTA
              </p>
              
              <div className="input-wrapper">
                <div className="input-container">
                  <textarea
                    className="chat-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="向 Shell Intelligence 发送消息..."
                    rows="1"
                    disabled={isLoading || isTyping}
                  />
                  <button 
                    className="send-btn"
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isLoading || isTyping}
                  >
                    {isLoading || isTyping ? (
                      <span className="loading-dots">⋯</span>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* <p className="input-hint">
                  Shell Intelligence 可能产生不准确信息，本演示为预设剧本。
                </p> */}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="messages-list">
              {messages.map((msg) => (
                <div key={msg.id} className={`message-row ${msg.role}`}>
                  <div className="message-avatar">
                    <div className="message-avatar">
                      {msg.role === 'user' ? (
                        <img src={userAvatar} alt="用户" className="avatar-img" style={{ width: '50px' }}/>
                      ) : (
                        <img src={botAvatar} alt="机器人" className="avatar-img" style={{ width: '50px' }}/>
                      )}
                    </div>
                  </div>
                  <div className="message-bubble-wrapper">
                    <div className={`message-bubble ${msg.role} ${msg.isStreaming ? 'streaming' : ''}`}>
                      {renderMessageContent(msg)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="input-area-bottom">
              <div className="input-container">
                <textarea
                  className="chat-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="继续对话..."
                  rows="1"
                  disabled={isLoading || isTyping}
                />
                <button 
                  className="send-btn"
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading || isTyping}
                >
                  {isLoading || isTyping ? (
                    <span className="loading-dots">⋯</span>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {/* <p className="input-hint">
                Shift + Enter 换行 · 本演示为预设流式输出
              </p> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatPage;