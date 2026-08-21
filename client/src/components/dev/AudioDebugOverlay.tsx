import React, { useEffect, useMemo, useState } from 'react';
import { soundService } from '../../services/audio';

type Diagnostics = ReturnType<typeof soundService.getAudioDiagnostics>;

const stateColor = (value: boolean) => value ? 'text-emerald-300' : 'text-rose-300';

export const AudioDebugOverlay: React.FC = () => {
  const enabled = useMemo(() => soundService.isAudioDebugEnabled(), []);
  const [diagnostics, setDiagnostics] = useState<Diagnostics | null>(null);
  const [peak, setPeak] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [copyStatus, setCopyStatus] = useState('Sao chép báo cáo');
  const [testStatus, setTestStatus] = useState('Phát âm test');

  useEffect(() => {
    if (!enabled) return;
    const update = () => {
      const next = soundService.getAudioDiagnostics();
      setDiagnostics(next);
      setPeak((current) => Math.max(current, next.engine?.outputLevel ?? 0));
    };
    update();
    const timer = window.setInterval(update, 250);
    return () => window.clearInterval(timer);
  }, [enabled]);

  if (!enabled || !diagnostics) return null;

  const engine = diagnostics.engine;
  const unlock = async () => {
    setTestStatus('Đang mở khóa…');
    const ok = await soundService.unlockAudio();
    setTestStatus(ok ? 'Đã mở khóa' : 'Mở khóa thất bại');
  };
  const playTest = async () => {
    setPeak(0);
    setTestStatus('Đang phát…');
    const ok = await soundService.playDiagnosticTone();
    setTestStatus(ok ? 'Đã kích hoạt âm test' : 'Không thể phát');
  };
  const copyReport = async () => {
    const report = JSON.stringify({ ...soundService.getAudioDiagnostics(), observedPeak: peak }, null, 2);
    try {
      await navigator.clipboard.writeText(report);
      setCopyStatus('Đã sao chép ✓');
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = report;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand('copy');
      textarea.remove();
      setCopyStatus(copied ? 'Đã sao chép ✓' : 'Không sao chép được');
    }
  };

  if (collapsed) {
    return (
      <button
        data-testid="audio-debug-expand"
        onClick={() => setCollapsed(false)}
        className="fixed z-[200] right-2 bottom-[calc(env(safe-area-inset-bottom)+8px)] min-h-11 px-4 rounded-xl border border-amber-400/60 bg-slate-950 text-amber-200 font-bold shadow-2xl touch-manipulation"
      >
        Audio Debug
      </button>
    );
  }

  return (
    <section
      data-testid="audio-debug-overlay"
      className="fixed z-[200] inset-x-2 bottom-[calc(env(safe-area-inset-bottom)+8px)] max-w-xl mx-auto max-h-[72dvh] overflow-auto rounded-2xl border border-amber-400/60 bg-slate-950/95 text-white shadow-2xl backdrop-blur-xl p-3 text-xs select-text"
    >
      <div className="sticky top-0 bg-slate-950/95 flex items-center justify-between gap-2 pb-2 border-b border-slate-700">
        <div>
          <div className="font-black text-amber-300">iPhone Audio Debug</div>
          <div className="text-[10px] text-slate-400">Không tự động gửi dữ liệu</div>
        </div>
        <button onClick={() => setCollapsed(true)} className="min-h-11 px-4 rounded-lg bg-slate-800 font-bold touch-manipulation">Thu nhỏ</button>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 py-3 font-mono">
        <span className="text-slate-400">Audio unlocked</span><span className={stateColor(diagnostics.service.audioUnlocked)}>{String(diagnostics.service.audioUnlocked)}</span>
        <span className="text-slate-400">Context</span><span className={engine?.contextState === 'running' ? 'text-emerald-300' : 'text-rose-300'}>{engine?.contextState ?? 'engine-not-ready'}</span>
        <span className="text-slate-400">Raw context</span><span>{engine?.rawContextState ?? '—'}</span>
        <span className="text-slate-400">Graph ready</span><span className={stateColor(Boolean(engine?.graphReady))}>{String(Boolean(engine?.graphReady))}</span>
        <span className="text-slate-400">BGM / SFX</span><span>{String(diagnostics.service.bgmEnabled)} / {String(diagnostics.service.sfxEnabled)}</span>
        <span className="text-slate-400">BGM playing</span><span>{String(Boolean(engine?.bgmPlaying))}</span>
        <span className="text-slate-400">Transport</span><span>{engine?.transportState ?? '—'}</span>
        <span className="text-slate-400">Output / peak</span><span>{(engine?.outputLevel ?? 0).toFixed(6)} / {peak.toFixed(6)}</span>
        <span className="text-slate-400">Sample rate</span><span>{engine?.sampleRate ?? '—'}</span>
        <span className="text-slate-400">Visibility</span><span>{diagnostics.page.visibility}</span>
        <span className="text-slate-400">User activation</span><span>{typeof diagnostics.userActivation === 'string' ? diagnostics.userActivation : `${diagnostics.userActivation.isActive}/${diagnostics.userActivation.hasBeenActive}`}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={unlock} className="min-h-11 rounded-xl bg-sky-700 font-bold touch-manipulation">Mở khóa / thử lại</button>
        <button onClick={playTest} className="min-h-11 rounded-xl bg-emerald-700 font-bold touch-manipulation">Phát âm test</button>
        <button onClick={() => soundService.startBGM()} className="min-h-11 rounded-xl bg-indigo-700 font-bold touch-manipulation">Phát BGM</button>
        <button onClick={() => soundService.stopBGM()} className="min-h-11 rounded-xl bg-slate-700 font-bold touch-manipulation">Dừng BGM</button>
      </div>
      <div className="mt-2 text-center text-amber-200 min-h-5">{testStatus}</div>
      <button onClick={copyReport} className="w-full min-h-11 mt-1 rounded-xl bg-amber-600 text-slate-950 font-black touch-manipulation">{copyStatus}</button>

      <details className="mt-3 border-t border-slate-700 pt-2">
        <summary className="font-bold text-slate-300 cursor-pointer">Nhật ký ({diagnostics.events.length})</summary>
        <pre className="mt-2 whitespace-pre-wrap break-words text-[10px] text-slate-300">{JSON.stringify(diagnostics.events.slice(-30), null, 2)}</pre>
      </details>
      <details className="mt-2 border-t border-slate-700 pt-2">
        <summary className="font-bold text-slate-300 cursor-pointer">Báo cáo đầy đủ (có thể nhấn giữ để chọn)</summary>
        <pre className="mt-2 whitespace-pre-wrap break-words text-[10px] text-slate-300">{JSON.stringify({ ...diagnostics, observedPeak: peak }, null, 2)}</pre>
      </details>
      <div className="mt-2 text-[10px] text-slate-500 break-all">{diagnostics.device.userAgent}</div>
    </section>
  );
};
