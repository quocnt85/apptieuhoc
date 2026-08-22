import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';

export type ParentConfirmDialogRequest = {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'danger' | 'warning' | 'neutral';
  requiredAcknowledgement?: boolean;
};

type Resolver = (confirmed: boolean) => void;
const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

export const useParentConfirmDialog = () => {
  const titleId = useId();
  const descriptionId = useId();
  const [request, setRequest] = useState<ParentConfirmDialogRequest | null>(null);
  const resolver = useRef<Resolver | null>(null);
  const dialogRef = useRef<HTMLFormElement>(null);
  const safeButtonRef = useRef<HTMLButtonElement>(null);

  const settle = useCallback((confirmed: boolean) => {
    const current = resolver.current;
    resolver.current = null;
    setRequest(null);
    current?.(confirmed);
  }, []);

  const requestConfirmation = useCallback((next: ParentConfirmDialogRequest) => {
    resolver.current?.(false);
    setRequest(next);
    return new Promise<boolean>((resolve) => { resolver.current = resolve; });
  }, []);

  useEffect(() => {
    if (!request) return;
    const frame = requestAnimationFrame(() => safeButtonRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [request]);

  useEffect(() => () => {
    resolver.current?.(false);
    resolver.current = null;
  }, []);

  const cancel = () => {
    if (!request?.requiredAcknowledgement) settle(false);
  };

  const handleKeyboard = (event: ReactKeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Escape') {
      if (!request?.requiredAcknowledgement) { event.preventDefault(); settle(false); }
      return;
    }
    if (event.key !== 'Tab') return;
    const controls = [...(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled])') ?? [])];
    if (!controls.length) return;
    const first = controls[0]; const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  const tone = request?.tone ?? 'neutral';
  const colors = tone === 'danger'
    ? { border: 'border-rose-800', title: 'text-rose-200', button: 'bg-rose-600 text-white' }
    : tone === 'warning'
      ? { border: 'border-amber-700', title: 'text-amber-200', button: 'bg-amber-500 text-slate-950' }
      : { border: 'border-cyan-800', title: 'text-cyan-200', button: 'bg-cyan-500 text-slate-950' };

  const dialog = request ? <div role="presentation" className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) cancel(); }}>
    <form ref={dialogRef} role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} className={`w-full max-w-sm rounded-3xl border bg-slate-900 p-5 shadow-2xl ${colors.border}`} onKeyDown={handleKeyboard} onSubmit={(event) => { event.preventDefault(); settle(true); }}>
      <h2 id={titleId} className={`text-lg font-black ${colors.title}`}>{request.title}</h2>
      <p id={descriptionId} className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-300">{request.description}</p>
      <div className={`mt-5 grid gap-3 ${request.requiredAcknowledgement ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {!request.requiredAcknowledgement && <button ref={safeButtonRef} type="button" onClick={() => settle(false)} className={`min-h-11 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-black text-slate-200 ${focusRing}`}>{request.cancelLabel ?? 'Hủy'}</button>}
        <button ref={request.requiredAcknowledgement ? safeButtonRef : undefined} type="submit" className={`min-h-11 rounded-xl px-4 py-2.5 text-sm font-black ${focusRing} ${colors.button}`}>{request.confirmLabel}</button>
      </div>
    </form>
  </div> : null;

  return { requestConfirmation, dialog };
};
