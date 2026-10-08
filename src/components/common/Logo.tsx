import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  enableHoldToAdmin?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = true,
  enableHoldToAdmin = true,
}) => {
  const { navigateTo, showToast } = useApp();
  const [holdProgress, setHoldProgress] = useState<number>(0);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const timerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);

  const startHold = () => {
    if (!enableHoldToAdmin) return;
    setIsHolding(true);
    setHoldProgress(0);

    const startTime = Date.now();
    const duration = 5000; // 5 seconds hold requirement

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setHoldProgress(progress);
    }, 50);

    timerRef.current = setTimeout(() => {
      clearInterval(progressIntervalRef.current);
      setIsHolding(false);
      setHoldProgress(0);
      showToast('লোগো প্রেস-অ্যান্ড-হোল্ড শনাক্ত হয়েছে। অ্যাডমিন পোর্টালে নিয়ে যাওয়া হচ্ছে...', 'info');
      navigateTo('admin');
    }, duration);
  };

  const endHold = () => {
    if (!enableHoldToAdmin) return;
    setIsHolding(false);
    setHoldProgress(0);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div
      className="relative flex items-center gap-3 select-none cursor-pointer group"
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      onTouchCancel={endHold}
      title={enableHoldToAdmin ? 'ফ্লিআর্ন লোগো (অ্যাডমিনের জন্য ৫ সেকেন্ড চেপে রাখুন)' : 'Fleearn Bangladesh Ltd'}
    >
      {/* 3D-inspired Layered Brand Logo Icon */}
      <div className="relative">
        <div
          className={`${iconSizes[size]} rounded-xl bg-gradient-to-br from-[#054541] via-[#075954] to-[#0a3532] text-white font-bold flex items-center justify-center shadow-md shadow-[#054541]/30 border border-[#0d6b63]/50 transform transition-transform group-hover:scale-105 active:scale-95`}
        >
          {/* Stylized 'F' icon */}
          <span className="font-extrabold tracking-tight text-white drop-shadow-sm font-sans">
            FL
          </span>
        </div>

        {/* 5-second Hold Radial Indicator */}
        {isHolding && (
          <div className="absolute -inset-1 rounded-2xl border-2 border-emerald-400/80 animate-pulse pointer-events-none flex items-center justify-center">
            <span
              className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] bg-slate-900 text-emerald-300 px-1.5 py-0.5 rounded font-mono shadow"
            >
              {Math.round(holdProgress)}%
            </span>
          </div>
        )}
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold tracking-tight text-lg text-slate-900 dark:text-white font-sans group-hover:text-[#0a6660] dark:group-hover:text-emerald-400 transition-colors">
            Fleearn
          </span>
          <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 rounded border border-emerald-500/20">
            BD Ltd
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400 tracking-normal font-normal">
            অফিসিয়াল কর্পোরেট পোর্টাল
          </span>
        )}
      </div>
    </div>
  );
};
