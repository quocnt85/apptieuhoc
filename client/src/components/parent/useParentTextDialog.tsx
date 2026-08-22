import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';

export type ParentTextDialogRequest = {
  title: string;
  description: string;
  initialValue?: string;
  maxLength: number;
  placeholder?: string;
  submitLabel?: string;
};

type Resolver = {
  resolve: (value: string) => void;
  reject: (error: Error) => void;
};

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';
const cancellationMessage = 'Đã hủy nhập ghi chú.';

export const isParentTextDialogCancellation = (value: unknown) =>
  value instanceof Error && value.message === cancellationMessage;

export const useParentTextDialog = () => {
  const titleId = useId();
  const descriptionId = useId();
  const [request, setRequest] = useState<ParentTextDialogRequest | null>(null);
  const [value, setValue] = useState('');
  const resolver = useRef<Resolver | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dialogRef = useRef<HTMLFormElement>(null);

  const settle = useCallback((result?: string, error?: Error) => {
    const current = resolver.current;
    resolver.current = null;
    setRequest(null);
    setValue('');
    if (!current) return;
    if (result !== undefined) current.resolve(result);
    else current.reject(error ?? new Error(cancellationMessage));
  }, []);

  const requestText = useCallback((next: ParentTextDialogRequest) => {
    resolver.current?.reject(new Error('Yêu cầu nhập ghi chú trước đã được thay thế.'));
    setValue(next.initialValue ?? '');
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
    resolver.current?.reject(new Error(cancellationMessage));
    resolver.current = null;
  }, []);

  const handleKeyboard = (event: ReactKeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      settle();
      return;
    }
    if (event.key !== 'Tab') return;
    const controls = [...(dialogRef.current?.querySelectorAll<HTMLElement>('textarea:not([disabled]), button:not([disabled])') ?? [])];
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
    <form ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} className="w-full max-w-sm rounded-3xl border border-rose-800 bg-slate-900 p-5 shadow-2xl" onKeyDown={handleKeyboard} onSubmit={(event) => { event.preventDefault(); settle(value.trim()); }}>
      <h2 id={titleId} className="text-lg font-black text-rose-200">{request.title}</h2>
      <p id={descriptionId} className="mt-2 text-sm text-slate-300">{request.description}</p>
      <label className="mt-4 block text-xs font-bold text-slate-300" htmlFor="parent-review-note">Lời nhắn cho trẻ (tùy chọn)</label>
      <textarea ref={inputRef} id="parent-review-note" maxLength={request.maxLength} rows={4} value={value} placeholder={request.placeholder} onChange={(event) => setValue(event.target.value)} className={`mt-2 min-h-24 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-base text-white ${focusRing}`} />
      <div className="mt-1 text-right text-[10px] text-slate-500">{value.length}/{request.maxLength}</div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => settle()} className={`min-h-11 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-black text-slate-200 ${focusRing}`}>Hủy</button>
        <button type="submit" className={`min-h-11 rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-black text-white ${focusRing}`}>{request.submitLabel ?? 'Xác nhận'}</button>
      </div>
    </form>
  </div> : null;

  return { requestText, dialog };
};
