import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, MessageSquare, AlertTriangle, User } from "lucide-react";

// --- 子组件：可复用的消息弹窗 ---
const MessageModal = ({ isOpen, onClose, title, content, avatar }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* 背景遮罩 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        {/* 弹窗主体 */}
        <motion.div
          initial={{ scale: 0, rotateX: 90 }}
          animate={{ scale: 1, rotateX: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          className="relative bg-slate-900 border-2 border-cyan-500 p-6 w-80 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-cyan-900 border border-cyan-400 flex items-center justify-center">
              {avatar || <User className="text-cyan-400" />}
            </div>
            <h3 className="text-cyan-400 font-bold tracking-widest">{title}</h3>
          </div>
          <p className="text-slate-300 font-mono text-sm leading-relaxed">
            {content}
          </p>
          <button
            onClick={onClose}
            className="mt-6 w-full py-1 border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors font-mono text-xs"
          >
            CONFIRM_AND_CLOSE
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- 主程序 ---
export default function App() {
  const [data, setData] = useState(new Array(20).fill(20)); // 初始数据
  const [isSurge, setIsSurge] = useState(false); // 是否暴走
  const [modalConfig, setModalConfig] = useState({
    show: false,
    title: "",
    content: "",
  });

  // 模拟数据动态变化
  useEffect(() => {
    const timer = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1)];
        // 如果是暴走模式，数值极大；否则低位震荡
        const nextVal = isSurge
          ? Math.random() * 150 + 100 // 暴走：100-250
          : Math.random() * 20 + 10; // 正常：10-30
        return [...newData, nextVal];
      });
    }, 200);
    return () => clearInterval(timer);
  }, [isSurge]);

  return (
    <div className="min-h-screen bg-black text-cyan-500 p-8 font-mono overflow-hidden">
      {/* 标题区 */}
      <header className="border-b border-cyan-900 mb-8 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic">
            SYSTEM_MONITOR_V0.4
          </h1>
          <p className="text-xs text-cyan-800">ENCRYPTION: AES-256 ACTIVE</p>
        </div>
        <div className="text-right text-xs">
          <p>STATUS: {isSurge ? "⚠️ OVERLOAD" : "NORMAL"}</p>
          <p>UPTIME: 124:08:09</p>
        </div>
      </header>

      {/* 监控面板区 */}
      <div className="relative h-64 border border-cyan-900 bg-slate-950/50 flex items-end gap-1 px-4 overflow-visible mb-12">
        {/* 背景网格线 */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-20">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="border border-cyan-900"></div>
          ))}
        </div>

        {/* 动态条状图 */}
        {data.map((val, i) => (
          <motion.div
            key={i}
            animate={{ height: `${val}%` }}
            className={`flex-1 transition-colors ${isSurge ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.7)]" : "bg-cyan-500"}`}
          />
        ))}
      </div>

      {/* 控制按钮区 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <button
          onClick={() =>
            setModalConfig({
              show: true,
              title: "LOG_REPORT",
              content:
                "发现异常接入点，源IP: 192.168.1.105。加密协议版本不匹配。",
            })
          }
          className="border border-cyan-900 p-4 hover:bg-cyan-950 flex flex-col items-center gap-2"
        >
          <MessageSquare size={20} /> 查看日志
        </button>

        <button
          onClick={() =>
            setModalConfig({
              show: true,
              title: "USER_ACCESS",
              content: "管理员 [NEO] 已上线。系统权限已提升至最高级。",
            })
          }
          className="border border-cyan-900 p-4 hover:bg-cyan-950 flex flex-col items-center gap-2"
        >
          <User size={20} /> 访问记录
        </button>

        <button
          onClick={() => setIsSurge(!isSurge)}
          className={`border p-4 flex flex-col items-center gap-2 transition-all ${isSurge ? "border-red-500 text-red-500 animate-pulse" : "border-cyan-900 hover:bg-cyan-950"}`}
        >
          <AlertTriangle size={20} /> {isSurge ? "停止超载" : "启动模拟测试"}
        </button>
      </div>

      {/* 弹窗 */}
      <MessageModal
        isOpen={modalConfig.show}
        onClose={() => setModalConfig({ ...modalConfig, show: false })}
        title={modalConfig.title}
        content={modalConfig.content}
      />
    </div>
  );
}
