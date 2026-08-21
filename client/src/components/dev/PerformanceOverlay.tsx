import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Activity, X, Gauge, Cpu } from 'lucide-react';

export const PerformanceOverlay: React.FC = () => {
  const { showFpsOverlay, toggleFpsOverlay } = useGameStore();
  const [fps, setFps] = useState<number>(60);
  const [frameTime, setFrameTime] = useState<number>(16.6);
  const [memoryMB, setMemoryMB] = useState<number | null>(null);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const frameCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const lastFrameTimeRef = useRef<number>(performance.now());
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (!showFpsOverlay) return;

    const measure = (now: number) => {
      frameCountRef.current++;
      const delta = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;

      // Update FPS every 500ms
      if (now - lastTimeRef.current >= 500) {
        const measuredFps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
        setFps(measuredFps);
        setFrameTime(Math.round(delta * 10) / 10);
        frameCountRef.current = 0;
        lastTimeRef.current = now;

        // Measure memory if available in Chrome/Chromium
        const perf = window.performance as unknown as { memory?: { usedJSHeapSize: number } };
        if (perf && perf.memory) {
          const usedMB = Math.round(perf.memory.usedJSHeapSize / (1024 * 1024));
          setMemoryMB(usedMB);
        }
      }

      requestRef.current = requestAnimationFrame(measure);
    };

    requestRef.current = requestAnimationFrame(measure);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [showFpsOverlay]);

  if (!showFpsOverlay) return null;

  // Color code based on FPS health
  const getFpsColor = () => {
    if (fps >= 55) return 'text-emerald-400 border-emerald-500/50 bg-emerald-950/80';
    if (fps >= 30) return 'text-amber-400 border-amber-500/50 bg-amber-950/80';
    return 'text-rose-400 border-rose-500/50 bg-rose-950/80';
  };

  const getStatusText = () => {
    if (fps >= 55) return 'Mượt Mà (Smooth)';
    if (fps >= 30) return 'Tải Vừa (Fair)';
    return 'Lag/Drop Cảnh Báo!';
  };

  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="fixed top-14 right-3 z-[90] cursor-pointer select-none animate-fadeIn"
      >
        <div className={`px-2.5 py-1 rounded-xl border backdrop-blur-md shadow-2xl flex items-center gap-1.5 ${getFpsColor()}`}>
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span className="font-mono font-black text-xs">{fps} FPS</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      data-testid="performance-overlay"
      className="fixed top-14 right-3 z-[90] select-none animate-fadeIn max-w-[220px] w-full"
    >
      <div className="bg-slate-950/90 backdrop-blur-xl border border-sky-500/40 rounded-2xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-white text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 text-sky-300 font-black text-[11px] uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>Hiệu Năng (Dev HUD)</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="w-5 h-5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-[10px] font-mono transition-all"
              title="Thu nhỏ"
            >
              _
            </button>
            <button
              onClick={() => toggleFpsOverlay(false)}
              className="w-5 h-5 rounded-md bg-slate-800 hover:bg-rose-900/80 text-slate-400 hover:text-rose-300 flex items-center justify-center transition-all"
              title="Tắt HUD"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Primary Metric: FPS */}
        <div className={`p-2.5 rounded-xl border mb-2 flex items-center justify-between transition-colors ${getFpsColor()}`}>
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5" />
            <div>
              <div className="text-[10px] font-bold opacity-80">KHUNG HÌNH</div>
              <div className="text-sm font-black">{getStatusText()}</div>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-xl font-black">{fps}</span>
            <span className="text-[9px] font-bold ml-0.5">FPS</span>
          </div>
        </div>

        {/* Secondary Metrics: Frame time & Memory */}
        <div className="space-y-1.5 font-mono text-[11px]">
          <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400 font-medium">Frame Time:</span>
            <span className={`font-bold ${frameTime > 33 ? 'text-rose-400' : 'text-sky-300'}`}>
              {frameTime} ms
            </span>
          </div>

          {memoryMB !== null && (
            <div className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Cpu className="w-3 h-3 text-purple-400" /> JS Heap:
              </span>
              <span className="font-bold text-purple-300">
                {memoryMB} MB
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
