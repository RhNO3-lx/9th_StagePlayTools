import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './ChatPage.css';



// 图片资源
import userAvatar from '../assets/toyohime.png';   // 用户头像
import botAvatar from '../assets/nina.png';    // 机器人头像（可换成其他图）
import topTitle from '../assets/shell.png';     // 顶部标题图标
import welcomeLogo from '../assets/nina_full.png';  // 欢迎页大图标

// ==================== 预设剧本 ====================
const SCRIPTED_REPLIES = [
  `markdown输出测试：

**标题**
- itemize 1
- itemize 2
- itemize 3`,

  `代码段输出测试：

下面是一段示例代码，演示如何在 Python 中调用 DSAA 层：

\`\`\`python
import torch
from Shell Intelligence import DSAAttention

# 初始化 DSAA 层
attn = DSAAttention(
    hidden_size=4096,
    num_heads=32,
    sparsity_ratio=0.7
)

# 前向传播
hidden_states = torch.randn(1, 2048, 4096)
output = attn(hidden_states)
print(output.shape)  # (1, 2048, 4096)
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

const TYPING_SPEED = 35;
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

    const typeNextChar = () => {
      if (currentIndex < fullText.length) {
        setMessages(prev => prev.map(msg => {
          if (msg.id === messageId) {
            return {
              ...msg,
              content: fullText.slice(0, currentIndex + 1),
              isStreaming: currentIndex < fullText.length - 1
            };
          }
          return msg;
        }));

        currentIndex++;
        const nextDelay = TYPING_SPEED + (Math.random() * 20 - 10);
        typingTimerRef.current = setTimeout(typeNextChar, nextDelay);
      } else {
        setMessages(prev => prev.map(msg => {
          if (msg.id === messageId) {
            return { ...msg, isStreaming: false };
          }
          return msg;
        }));
        setIsTyping(false);
        setIsLoading(false);
        typingTimerRef.current = null;
        currentTypingMessageIdRef.current = null;
      }
    };

    typingTimerRef.current = setTimeout(typeNextChar, TYPING_SPEED);
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