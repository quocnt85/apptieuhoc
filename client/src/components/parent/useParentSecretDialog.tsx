import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';

export type ParentSecretDialogRequest = {
  title: string;
  description: string;
  confirm?: boolean;
  minLength?: number;
  submitLabel?: string;
};

type Resolver = {
  resolve: (value: string) => void;
  reject: (error: Error) => void;
};

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';
const cancellation = () => new Error('Đã hủy nhập mật khẩu.');

export const isParentSecretDialogCancellation = (value: unknown) =>
  value instanceof Error && value.message === cancellation().message;

export const useParentSecretDialog = () => {
  const titleId = useId();
  const descriptionId = useId();
  const [request, setRequest] = useState<ParentSecretDialogRequest | null>(null);
  const [secret, setSecret] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const resolver = useRef<Resolver | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLFormElement>(null);

  const settle = useCallback((value?: string, reason?: Error) => {
    const current = resolver.current;
    resolver.current = null;
    setRequest(null);
    setSecret('');
    setConfirmation('');
    setError('');
    if (!current) return;
    if (value !== undefined) current.resolve(value);
    else current.reject(reason ?? cancellation());
  }, []);

  const requestSecret = useCallback((next: ParentSecretDialogRequest) => {
    resolver.current?.reject(new Error('Yêu cầu nhập mật khẩu trước đã được thay thế.'));
    setSecret('');
    setConfirmation('');
    setError('');
    setRequest(next);
    return new Promise<string>((resolve, reject) => {
      resolver.current = { resolve, reject };
    });
  }, []);

  useEffect(() => {
    if (!request) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [request]);

  useEffect(() => () => {
    resolver.current?.reject(new Error('Dialog nhập mật khẩu đã đóng.'));
    resolver.current = null;
  }, []);

  const submit = () => {
    if (!request) return;
    const minimum = request.minLength ?? 1;
    if (secret.length < minimum) {
      setError(`Mật khẩu phải có ít nhất ${minimum} ký tự.`);
      inputRef.current?.focus();
      return;
    }
    if (request.confirm && secret !== confirmation) {
      setError('Hai mật khẩu không trùng nhau.');
      return;
    }
    settle(secret);
  };

  const handleKeyboard = (event: ReactKeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      settle();
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

  const dialog = request ? <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) settle(); }}>
    <form ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} className="w-full max-w-sm rounded-3xl border border-indigo-700 bg-slate-900 p-5 shadow-2xl" onKeyDown={handleKeyboard} onSubmit={(event) => { event.preventDefault(); submit(); }}>
      <h2 id={titleId} className="text-lg font-black text-indigo-200">{request.title}</h2>
      <p id={descriptionId} className="mt-2 text-sm text-slate-300">{request.description}</p>
      <label className="mt-4 block text-xs font-bold text-slate-300" htmlFor="parent-secret-password">Mật khẩu tệp sao lưu</label>
      <input ref={inputRef} id="parent-secret-password" type="password" autoComplete={request.confirm ? 'new-password' : 'current-password'} maxLength={128} value={secret} onChange={(event) => { setSecret(event.target.value); setError(''); }} className={`mt-2 min-h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-base text-white ${focusRing}`} />
      {request.confirm && <>
        <label className="mt-3 block text-xs font-bold text-slate-300" htmlFor="parent-secret-confirmation">Nhập lại mật khẩu</label>
        <input id="parent-secret-confirmation" type="password" autoComplete="new-password" maxLength={128} value={confirmation} onChange={(event) => { setConfirmation(event.target.value); setError(''); }} className={`mt-2 min-h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-base text-white ${focusRing}`} />
      </>}
      {error && <p role="alert" className="mt-2 text-xs text-rose-300">{error}</p>}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => settle()} className={`min-h-11 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-black text-slate-200 ${focusRing}`}>Hủy</button>
        <button type="submit" disabled={!secret || Boolean(request.confirm && !confirmation)} className={`min-h-11 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-black text-white disabled:opacity-40 ${focusRing}`}>{request.submitLabel ?? 'Tiếp tục'}</button>
      </div>
    </form>
  </div> : null;

  return { requestSecret, dialog };
};
