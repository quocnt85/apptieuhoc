import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { parentFeatureFlags } from '../../config/parentFeatureFlags';
import { parentGate } from '../../services/personalization/parentGate';
import type { ParentGatePurpose } from '../../types/personalization';

type PendingReauthentication = {
  title: string;
  purpose: ParentGatePurpose;
};

type Resolver = {
  resolve: () => void;
  reject: (error: Error) => void;
};

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

export const useParentReauthDialog = () => {
  const [pending, setPending] = useState<PendingReauthentication | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const resolver = useRef<Resolver | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLFormElement>(null);

  const settle = useCallback((result: 'resolve' | 'reject', reason?: Error) => {
    const current = resolver.current;
    resolver.current = null;
    setPending(null);
    setPassword('');
    setError('');
    setSubmitting(false);
    if (!current) return;
    if (result === 'resolve') current.resolve();
    else current.reject(reason ?? new Error('Đã hủy xác thực.'));
  }, []);

  const requestReauthentication = useCallback((title: string, purpose: ParentGatePurpose) => {
    resolver.current?.reject(new Error('Yêu cầu xác thực trước đã được thay thế.'));
    setPassword('');
    setError('');
    setPending({ title, purpose });
    return new Promise<void>((resolve, reject) => {
      resolver.current = { resolve, reject };
    });
  }, []);

  useEffect(() => {
    if (!pending) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [pending]);

  useEffect(() => () => {
    resolver.current?.reject(new Error('Luồng xác thực đã đóng.'));
    resolver.current = null;
  }, []);

  const submit = async () => {
    if (!pending || submitting) return;
    setError('');
    setSubmitting(true);
    try {
      await parentGate.authorizeWithPin(password, pending.purpose, true);
      settle('resolve');
    } catch (value) {
      setError(value instanceof Error ? value.message : 'Không thể xác thực phụ huynh.');
      setSubmitting(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  const handleDialogKeyboard = (event: ReactKeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      settle('reject');
      return;
    }
    if (event.key !== 'Tab') return;
    const controls = [...(dialogRef.current?.querySelectorAll<HTMLElement>('input:not([disabled]), button:not([disabled])') ?? [])];
    if (!controls.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const dialog = pending ? <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) settle('reject'); }}>
    <form ref={dialogRef} aria-labelledby="parent-reauth-title" aria-describedby="parent-reauth-description" role="dialog" aria-modal="true" className="w-full max-w-sm rounded-3xl border border-cyan-800 bg-slate-900 p-5 shadow-2xl" onKeyDown={handleDialogKeyboard} onSubmit={(event) => { event.preventDefault(); void submit(); }}>
      <h2 id="parent-reauth-title" className="text-lg font-black text-cyan-200">Xác thực lại phụ huynh</h2>
      <p id="parent-reauth-description" className="mt-2 text-sm text-slate-300">{pending.title}</p>
      <label className="mt-4 block text-xs font-bold text-slate-300" htmlFor="parent-reauth-password">{parentFeatureFlags.demoAccess ? 'Mật khẩu demo' : 'PIN phụ huynh 6 số'}</label>
      <input ref={inputRef} id="parent-reauth-password" name="parent-reauth-password" type="password" inputMode="numeric" autoComplete="off" maxLength={6} value={password} onChange={(event) => setPassword(event.target.value.replace(/\D/g, ''))} className={`mt-2 min-h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-base text-white ${focusRing}`} />
      {error && <p role="alert" className="mt-2 text-xs text-rose-300">{error}</p>}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button type="button" disabled={submitting} onClick={() => settle('reject')} className={`min-h-11 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-black text-slate-200 ${focusRing}`}>Hủy</button>
        <button type="submit" disabled={submitting || !password} className={`min-h-11 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-black text-slate-950 disabled:opacity-40 ${focusRing}`}>{submitting ? 'Đang kiểm tra…' : 'Xác nhận'}</button>
      </div>
    </form>
  </div> : null;

  return { requestReauthentication, dialog };
};
