import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, Zap, Terminal, ShieldAlert } from 'lucide-react';

// --- 弹窗组件 ---
const MessageModal = ({ isOpen, onClose, title, content, avatar, colorClass = "border-cyan-500" }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        {/* 背景遮罩：透明度调低，无模糊 */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/30" 
        />
        <motion.div 
          initial={{ scale: 0.5, opacity: 0, y: 100 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          className={`relative bg-slate-900/90 border-2 ${colorClass} p-6 w-80 shadow-[0_0_30px_rgba(0,0,0,0.8)] pointer-events-auto`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-10 h-10 border ${colorClass} flex items-center justify-center`}>
              {avatar || <ShieldAlert className="text-inherit" />}
            </div>
            <h3 className="font-bold tracking-tighter uppercase text-sm">{title}</h3>
          </div>
          <p className="text-slate-300 font-mono text-xs leading-relaxed">{content}</p>
          <div className="mt-4 text-[9px] opacity-30 animate-pulse uppercase">Press any key or click to ack</div>
          <button 
            onClick={onClose}
            className={`mt-4 w-full py-1 border ${colorClass} hover:bg-white/10 transition-colors font-mono text-[10px]`}
          >
            CLOSE_TERMINAL_WINDOW
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function App() {
  const [mode, setMode] = useState('IDLE'); // IDLE, HIGH, CRITICAL
  const [data, setData] = useState(new Array(30).fill(15));
  const [modalStep, setModalStep] = useState(0); // 0:关, 1:Q窗, 2:W窗, 3:R序列-1, 4:R序列-2

  // 音效播放
  const playAlertSound = (type = 'normal') => {
    const url = type === 'critical' 
      ? 'https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3' // 更响的警报
      : 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'; // 普通哔哔声
    const audio = new Audio(url);
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  // 监听键盘事件
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      
      if (key === 'q') {
        setModalStep(1);
        playAlertSound();
      } else if (key === 'w') {
        setModalStep(2);
        playAlertSound();
      } else if (key === 'e') {
        setMode(prev => prev === 'HIGH' ? 'IDLE' : 'HIGH');
      } else if (key === 'r') {
        setMode('CRITICAL');
        setModalStep(3); // 触发失控序列第一个窗
        playAlertSound('critical');
      } else if (key === 'escape') {
        setMode('IDLE');
        setModalStep(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 动态数据生成
  useEffect(() => {
    const timer = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        let nextVal;
        if (mode === 'CRITICAL') nextVal = Math.random() * 80 + 130;
        else if (mode === 'HIGH') nextVal = Math.random() * 20 + 70;
        else nextVal = Math.random() * 10 + 10;
        return [...newData, nextVal];
      });
    }, 120);
    return () => clearInterval(timer);
  }, [mode]);

  // 处理R键弹窗序列的关闭
  const handleCloseModal = () => {
    if (modalStep === 3) {
      setModalStep(4); // 关掉第一个，自动跳出第二个
      playAlertSound('critical');
    } else {
      setModalStep(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-cyan-500 p-10 font-mono flex flex-col items-center overflow-hidden">
      
      {/* 顶部状态栏 */}
      <div className="w-full max-w-5xl flex justify-between items-start mb-20 border-b border-cyan-900/30 pb-4">
        <div className="flex gap-6 items-center">
          <div className="p-2 border border-cyan-500/50 bg-cyan-500/10">
            <Terminal size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-[0.2em] text-white">SYS_COMMAND_CENTER</h1>
            <div className="flex gap-4 mt-1">
              <span className="text-[10px] text-cyan-700">INPUT_BUFFER: ACTIVE</span>
              <span className="text-[10px] text-cyan-700">ENCRYPTION: RSA_4096</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-sm font-bold ${mode === 'CRITICAL' ? 'text-red-500 animate-pulse' : 'text-cyan-500'}`}>
            MODE: {mode}
          </div>
          <div className="text-[9px] opacity-40 mt-1">LOCAL_TIME: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      {/* 居中监控框 */}
      <div className="relative w-full max-w-3xl bg-slate-900/20 border border-white/5 p-12 rounded-lg shadow-2xl">
        {/* 装饰性角标 */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500"></div>

        {/* 条状图容器 */}
        <div className="relative h-56 flex items-end gap-1 px-2 border-b border-white/10">
          {/* 坐标刻度 */}
          <div className="absolute -left-12 inset-y-0 flex flex-col justify-between text-[10px] text-white/20 py-1">
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
                backgroundColor: val > 100 ? '#ff1212' : (val > 65 ? '#f59e0b' : '#06b6d4')
              }}
              className="flex-1 min-w-[2px] transition-colors"
              style={{ boxShadow: val > 100 ? '0 0 15px #ef4444' : 'none' }}
            />
          ))}

          {/* 100% 警戒线 */}
          <div className="absolute bottom-[100%] w-full h-[1px] bg-red-500/50 border-t border-dashed border-red-500/50 pointer-events-none">
            <span className="absolute -top-4 right-0 text-[9px] text-red-500 italic font-bold">OVERFLOW_THRESHOLD</span>
          </div>
        </div>
      </div>

      {/* 底部操作说明 - 代替了原来的按钮 */}
      <div className="mt-20 flex gap-8">
        {[
          { key: 'Q', desc: 'SYSTEM_LOG' },
          { key: 'W', desc: 'ACCESS_TRACE' },
          { key: 'E', desc: 'STRESS_TEST' },
          { key: 'R', desc: 'CRITICAL_FAIL' },
          { key: 'ESC', desc: 'REBOOT' },
        ].map(item => (
          <div key={item.key} className="flex flex-col items-center">
            <div className="w-10 h-10 border border-cyan-500/30 flex items-center justify-center text-sm font-bold text-cyan-400 bg-cyan-500/5">
              {item.key}
            </div>
            <span className="text-[9px] mt-2 text-cyan-800 font-bold">{item.desc}</span>
          </div>
        ))}
      </div>

      {/* 弹窗逻辑 */}
      <MessageModal 
        isOpen={modalStep === 1} 
        onClose={() => setModalStep(0)}
        title="Diagnostic Log [Q]"
        content="Kernel trace active. No significant anomalies found in sector 7G. Memory usage: 14%."
      />

      <MessageModal 
        isOpen={modalStep === 2} 
        onClose={() => setModalStep(0)}
        title="Access Trace [W]"
        content="Incoming connection from Proxy_Node_882. Handshake confirmed. Level 2 clearance granted."
        colorClass="border-blue-500 text-blue-400"
      />

      <MessageModal 
        isOpen={modalStep === 3} 
        onClose={handleCloseModal}
        title="!!! SYSTEM FAILURE !!!"
        content="WARNING: Data corruption detected in primary buffer. R-Key injection successful. System is overflowing!"
        colorClass="border-red-600 text-red-500"
      />

      <MessageModal 
        isOpen={modalStep === 4} 
        onClose={() => setModalStep(0)}
        title="CRITICAL BREACH"
        content="Secondary containment failed. Emergency shutdown bypassed. Unauthorized data transfer in progress..."
        colorClass="border-amber-600 text-amber-500"
      />

    </div>
  );
}
