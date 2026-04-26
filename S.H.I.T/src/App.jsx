import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  MessageSquare,
  AlertTriangle,
  User,
  Zap,
} from "lucide-react";

// --- 弹窗组件：去掉了 backdrop-blur (背景模糊) ---
const MessageModal = ({
  isOpen,
  onClose,
  title,
  content,
  avatar,
  colorClass = "border-cyan-500",
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* 背景遮罩：去掉了模糊，只保留半透明黑 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className={`relative bg-slate-900 border-2 ${colorClass} p-6 w-80 shadow-2xl`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`w-10 h-10 border ${colorClass} flex items-center justify-center`}
            >
              {avatar || <User className="text-inherit" />}
            </div>
            <h3 className="font-bold tracking-tighter uppercase">{title}</h3>
          </div>
          <p className="text-slate-300 font-mono text-sm">{content}</p>
          <button
            onClick={onClose}
            className={`mt-6 w-full py-2 border ${colorClass} hover:bg-white/10 transition-colors font-mono text-xs`}
          >
            ACKNOWLEDGE_PROMPT
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function App() {
  // 状态：'IDLE' (低位), 'HIGH' (高位), 'CRITICAL' (暴走)
  const [mode, setMode] = useState("IDLE");
  const [data, setData] = useState(new Array(25).fill(15));

  // 弹窗队列状态
  const [modalStep, setModalStep] = useState(0); // 0:无, 1:第一个, 2:第二个

  // 音效播放函数
  const playAlertSound = () => {
    // 这里可以使用你自己的 MP3 路径，或者使用这个公共测试音效
    const audio = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
    );
    audio.volume = 0.5;
    audio.play().catch((e) => console.log("等待用户交互后播放音效"));
  };

  // 动态数据逻辑
  useEffect(() => {
    const timer = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1)];
        let nextVal;
        if (mode === "CRITICAL") {
          nextVal = Math.random() * 80 + 120; // 120-200 溢出
        } else if (mode === "HIGH") {
          nextVal = Math.random() * 15 + 75; // 75-90 接近顶部
        } else {
          nextVal = Math.random() * 10 + 10; // 10-20 低位
        }
        return [...newData, nextVal];
      });
    }, 150);
    return () => clearInterval(timer);
  }, [mode]);

  // 触发完全失控的逻辑
  const triggerCritical = () => {
    setMode("CRITICAL");
    setModalStep(1); // 触发第一个弹窗
    playAlertSound();
  };

  // 关闭第一个弹窗后的逻辑
  const handleCloseFirstModal = () => {
    setModalStep(2); // 开启第二个弹窗
    playAlertSound(); // 再次播放音效
  };

  return (
    <div className="min-h-screen bg-black text-cyan-500 p-10 font-mono flex flex-col items-center">
      {/* 标题区 */}
      <div className="w-full max-w-4xl mb-12 flex justify-between border-l-4 border-cyan-700 pl-4">
        <div>
          <h1 className="text-3xl font-black italic tracking-widest text-white">
            CORE_SYNC_MONITOR
          </h1>
          <p className="text-[10px] opacity-50 uppercase">
            Security Protocol: Level 4 Active
          </p>
        </div>
        <div
          className={`text-right ${mode === "CRITICAL" ? "text-red-500 animate-pulse" : ""}`}
        >
          <p className="text-xs">SYSTEM_STATUS</p>
          <p className="font-bold">{mode}</p>
        </div>
      </div>

      {/* 监控面板区：居中且带框 */}
      <div className="relative w-full max-w-2xl bg-slate-950/30 border-2 border-slate-800 p-8 rounded-sm shadow-inner">
        {/* 图表容器 */}
        <div className="relative h-48 flex items-end gap-1.5 border-b border-slate-700 pb-1">
          {/* 坐标轴 (右侧) */}
          <div className="absolute -right-10 inset-y-0 flex flex-col justify-between text-[10px] text-slate-500 py-1 border-l border-slate-800 pl-2">
            <span>200%</span>
            <span>100%</span>
            <span>0%</span>
          </div>

          {/* 动态条状图 */}
          {data.map((val, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                height: `${val}%`,
                backgroundColor:
                  val > 100 ? "#ef4444" : val > 70 ? "#f59e0b" : "#06b6d4",
              }}
              className="flex-1 min-w-[4px] rounded-t-sm transition-colors shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            />
          ))}

          {/* 100% 警戒线 */}
          <div className="absolute w-full h-[2px] bg-red-900/30 border-t border-dashed border-red-500/40 bottom-[100%] pointer-events-none">
            <span className="absolute -left-16 text-[10px] text-red-500/50 uppercase italic">
              Overflow Limit
            </span>
          </div>
        </div>

        <div className="mt-4 text-center text-[10px] text-slate-600 tracking-[0.3em] uppercase">
          Neural Link Frequency Analysis
        </div>
      </div>

      {/* 按钮控制区 */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
        {/* 新增按钮：高位震荡 */}
        <button
          onClick={() => setMode(mode === "HIGH" ? "IDLE" : "HIGH")}
          className={`border-2 p-4 flex flex-col items-center gap-2 transition-all ${mode === "HIGH" ? "bg-amber-500/20 border-amber-500 text-amber-500" : "border-slate-800 hover:border-amber-500/50"}`}
        >
          <Zap size={20} />
          <span className="text-xs font-bold uppercase">
            {mode === "HIGH" ? "恢复正常" : "压力测试"}
          </span>
        </button>

        {/* 之前的按钮：完全失控 */}
        <button
          onClick={triggerCritical}
          className={`border-2 p-4 flex flex-col items-center gap-2 transition-all ${mode === "CRITICAL" ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse" : "border-slate-800 hover:border-red-500/50"}`}
        >
          <AlertTriangle size={20} />
          <span className="text-xs font-bold uppercase italic">
            致命错误模拟
          </span>
        </button>

        <button
          onClick={() => {
            setMode("IDLE");
            setModalStep(0);
          }}
          className="border-2 border-slate-800 p-4 flex flex-col items-center gap-2 hover:bg-white/5 transition-all text-slate-500"
        >
          <Activity size={20} />
          <span className="text-xs font-bold uppercase">重置系统</span>
        </button>
      </div>

      {/* 弹窗序列 */}
      <MessageModal
        isOpen={modalStep === 1}
        onClose={handleCloseFirstModal}
        title="[CRITICAL_FAILURE]"
        content="检测到核心过载！数据缓冲区已溢出。系统完整性下降至 34%。"
        colorClass="border-red-600 text-red-500"
        avatar={<AlertTriangle className="text-red-600" />}
      />

      <MessageModal
        isOpen={modalStep === 2}
        onClose={() => setModalStep(0)}
        title="[INTRUDER_DETECTED]"
        content="警告：检测到外部连接正在尝试通过缓冲区漏洞提取数据。协议 99 已启动。"
        colorClass="border-amber-500 text-amber-500"
        avatar={<Zap className="text-amber-500" />}
      />
    </div>
  );
}
