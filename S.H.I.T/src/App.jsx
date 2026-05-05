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
          className={`modal-card ${colorClass}`}
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
          <div className={`mode-indicator ${mode === 'CRITICAL' ? 'critical' : 'normal'}`}>
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
                height: `${val}%`,
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