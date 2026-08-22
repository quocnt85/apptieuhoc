import React, { useEffect, useRef, useState } from 'react';
import { BarChart3, Clock, Download, HeartHandshake, LogOut, Palette, ShieldCheck, ShoppingBag, Trash2, Upload, UserRound, WalletCards } from 'lucide-react';
import { DOMAINS_DATA } from '../../data/mockQuestions';
import { createEncryptedBackup, previewEncryptedBackup, restoreEncryptedBackup } from '../../services/parentBackup';
import { exportEncryptedParentBackup } from '../../services/parentBackupExport';
import { switchProfileGameState } from '../../services/localGameStateRepository';
import { deleteParentAccountAndLocalData } from '../../services/parentDeletion';
import { ParentApiError, parentApi } from '../../services/parentApi';
import { parentBiometric } from '../../services/parentBiometric';
import { PRODUCT_IDS, purchaseProvider, type LocalizedProduct, type ParentProductId } from '../../services/purchaseProvider';
import { waitForParentVaultCredit } from '../../services/purchaseConfirmation';
import { LocalMediaImage } from '../personalization/LocalMediaImage';
import { processLocalImage } from '../../services/personalization/imageProcessing';
import { clearAllPersonalizationData, clearChildPersonalizationData, deleteMediaAsset, saveProcessedMedia } from '../../services/personalization/personalizationLifecycle';
import { parentGate } from '../../services/personalization/parentGate';
import { useGameStore } from '../../stores/useGameStore';
import { useParentZoneStore } from '../../stores/useParentZoneStore';
import { usePersonalizationStore } from '../../stores/usePersonalizationStore';
import { PERSONALIZATION_FEATURE_FLAGS } from '../../config/personalizationFeatureFlags';
import { parentFeatureFlags } from '../../config/parentFeatureFlags';
import { isParentDemoPassword, isParentDemoPasswordLength } from '../../config/parentDemoAccess';
import type { ChildGrade } from '../../types/parentZone';
import { localDateKey, normalizeDailyUsage, summarizeRecentUsage } from '../../services/screenTime';
import { conversationTemplatesForContent, visibleParentGuides } from '../../content/parentGuides';
import { emitMissionRewardConfirmed } from '../../services/missionCelebration';
import { openApprovedParentExternalSource } from '../../services/parentExternalLinks';
import type { ParentGuideExternalSource } from '../../content/parentGuides';
import { useParentReauthDialog } from '../parent/useParentReauthDialog';
import { isParentSecretDialogCancellation, useParentSecretDialog } from '../parent/useParentSecretDialog';
import { isParentTextDialogCancellation, useParentTextDialog } from '../parent/useParentTextDialog';
import { useParentConfirmDialog } from '../parent/useParentConfirmDialog';
import { createParentDiagnosticBlob, createParentDiagnosticReport } from '../../services/parentDiagnostics';
import { exportParentDiagnosticReport } from '../../services/parentDiagnosticExport';

type Section = 'overview' | 'profiles' | 'personalization' | 'missions' | 'guides' | 'limits' | 'store' | 'account';
type AuthStep = 'demo' | 'email' | 'otp' | 'setup-pin' | 'pin' | 'pin-reset-email' | 'pin-reset-confirm';
const DEMO_SESSION_MS = 30 * 60_000;
const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';
const Field: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => <input {...props} className={`min-h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400 ${focusRing} ${props.className ?? ''}`} />;
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', ...props }) => <button {...props} className={`min-h-11 min-w-11 rounded-xl px-4 py-2.5 text-sm font-black transition active:scale-[.98] disabled:opacity-40 ${focusRing} ${className}`} />;

const ParentAuth: React.FC<{ onUnlocked: () => void }> = ({ onUnlocked }) => {
  const [step, setStep] = useState<AuthStep>(parentFeatureFlags.demoAccess ? 'demo' : 'email');
  const [email, setEmail] = useState(localStorage.getItem('novastars_parent_email') ?? '');
  const [otp, setOtp] = useState(''); const [pin, setPin] = useState(''); const [confirmPin, setConfirmPin] = useState('');
  const [resetEmail, setResetEmail] = useState(''); const [resetOtp, setResetOtp] = useState(''); const [resetPin, setResetPin] = useState(''); const [resetConfirmPin, setResetConfirmPin] = useState('');
  const [serviceConsent, setServiceConsent] = useState(false); const [marketingConsent, setMarketingConsent] = useState(false);
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState(''); const [error, setError] = useState('');
  const [lockedUntil, setLockedUntil] = useState<number | null>(null); const [clock, setClock] = useState(Date.now());
  useEffect(() => { if (parentFeatureFlags.demoAccess) return; void parentApi.hasSession().then(async (hasSession) => { if (!hasSession) return; setStep('pin'); if (parentBiometric.isEnabled()) { try { await parentBiometric.authenticate(); parentGate.markAuthenticated(); onUnlocked(); } catch { /* PIN remains available */ } } }); }, []);
  useEffect(() => {
    if (!lockedUntil) return;
    const timer = window.setInterval(() => { const current = Date.now(); setClock(current); if (current >= lockedUntil) setLockedUntil(null); }, 1_000);
    return () => window.clearInterval(timer);
  }, [lockedUntil]);
  const lockRemaining = lockedUntil ? Math.max(0, Math.ceil((lockedUntil - clock) / 1_000)) : 0;
  const run = async (operation: () => Promise<void>) => { setBusy(true); setError(''); try { await operation(); } catch (value) {
    if (value instanceof ParentApiError && value.code === 'PIN_LOCKED') {
      const parsed = typeof value.details?.lockedUntil === 'string' ? Date.parse(value.details.lockedUntil) : Number.NaN;
      if (Number.isFinite(parsed)) { setLockedUntil(parsed); setClock(Date.now()); }
    }
    if (value instanceof ParentApiError && value.code === 'INVALID_PIN' && typeof value.details?.attemptsRemaining === 'number') {
      setError(`${value.message} Còn ${value.details.attemptsRemaining} lần thử.`);
    } else setError(value instanceof Error ? value.message : 'Không thể thực hiện.');
  } finally { setBusy(false); } };
  const sendOtp = () => run(async () => { if (!serviceConsent) throw new Error('Bạn cần đồng ý điều khoản dịch vụ.'); const result = await parentApi.register(email, marketingConsent); localStorage.setItem('novastars_parent_email', email); setMessage(result.debugOtp ? `Mã thử nghiệm: ${result.debugOtp}` : 'Mã 6 số đã được gửi tới email.'); setStep('otp'); });
  const verifyOtp = () => run(async () => { const result = await parentApi.verifyEmail(email, otp); localStorage.setItem('novastars_parent_id', result.parentId); setStep(result.requiresPinSetup ? 'setup-pin' : 'pin'); });
  const savePin = () => run(async () => { if (pin !== confirmPin) throw new Error('Hai mã PIN không trùng nhau.'); await parentApi.setupPin(pin); const result = await parentApi.verifyPin(pin); parentGate.markAuthenticated(Date.parse(result.unlockedUntil)); onUnlocked(); });
  const verifyPin = () => run(async () => {
    try {
      const result = await parentApi.verifyPin(pin);
      parentGate.markAuthenticated(Date.parse(result.unlockedUntil));
      onUnlocked();
    } catch (value) {
      if (value instanceof ParentApiError && value.status === 401 && value.code === 'INVALID_SESSION') {
        setPin(''); setStep('email'); setMessage('Phiên đăng nhập đã hết hạn. Vui lòng nhận mã email để đăng nhập lại.');
        return;
      }
      throw value;
    }
  });
  const verifyDemoPassword = () => { setError(''); if (!isParentDemoPassword(pin)) { setError('Mật khẩu demo không đúng.'); return; } parentGate.markAuthenticated(Date.now() + DEMO_SESSION_MS); onUnlocked(); };
  const startPinReset = () => { setError('');setMessage('');setResetEmail(email||localStorage.getItem('novastars_parent_email')||'');setResetOtp('');setResetPin('');setResetConfirmPin('');setStep('pin-reset-email'); };
  const requestPinReset = () => run(async () => {
    const normalizedEmail=resetEmail.trim().toLowerCase();
    if(!normalizedEmail.includes('@'))throw new Error('Cần nhập email phụ huynh hợp lệ.');
    const requested=await parentApi.requestPinReset(normalizedEmail);
    setResetEmail(normalizedEmail);setEmail(normalizedEmail);localStorage.setItem('novastars_parent_email',normalizedEmail);
    setMessage(requested.debugOtp?`Mã thử nghiệm: ${requested.debugOtp}`:'Nếu email tồn tại, mã 6 số đã được gửi.');
    setStep('pin-reset-confirm');
  });
  const confirmPinReset = () => run(async () => {
    if(!/^\d{6}$/.test(resetOtp)||!/^\d{6}$/.test(resetPin))throw new Error('OTP và PIN mới phải gồm đúng 6 số.');
    if(resetPin!==resetConfirmPin)throw new Error('Hai mã PIN mới không trùng nhau.');
    await parentApi.confirmPinReset(resetEmail,resetOtp,resetPin);
    const result = await parentApi.verifyPin(resetPin);
    parentGate.markAuthenticated(Date.parse(result.unlockedUntil));
    onUnlocked();
  });
  return <div className="m-auto w-full max-w-sm rounded-3xl border border-cyan-500/30 bg-slate-900 p-6 shadow-2xl">
    <div className="mb-5 text-center"><ShieldCheck className="mx-auto h-10 w-10 text-cyan-300"/><h1 className="mt-2 text-xl font-black">Góc phụ huynh</h1><p className="mt-1 text-xs text-slate-400">Dữ liệu học tập của trẻ chỉ lưu trên thiết bị này.</p></div>
    {step === 'demo' && <div className="space-y-3"><div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-3 text-xs text-amber-200"><strong>Chế độ review demo</strong><br/>Email và OTP đang tạm bỏ qua. Dữ liệu tạo trong phần này chỉ nằm trên thiết bị.</div><Field autoFocus type="password" inputMode="numeric" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} placeholder="Mật khẩu demo"/><Button disabled={!isParentDemoPasswordLength(pin)} onClick={verifyDemoPassword} className="w-full bg-cyan-500 text-slate-950">Vào Góc phụ huynh</Button><p className="text-center text-xs text-slate-400">Mật khẩu review: <strong className="text-amber-300">1234</strong> hoặc <strong className="text-amber-300">123456</strong></p></div>}
    {step === 'email' && <div className="space-y-3"><Field type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email phụ huynh"/><label className="flex gap-2 text-xs text-slate-300"><input type="checkbox" checked={serviceConsent} onChange={e=>setServiceConsent(e.target.checked)}/> Tôi đồng ý điều khoản dịch vụ (bắt buộc).</label><label className="flex gap-2 text-xs text-slate-400"><input type="checkbox" checked={marketingConsent} onChange={e=>setMarketingConsent(e.target.checked)}/> Nhận email cập nhật sản phẩm (tùy chọn).</label><Button disabled={busy || !email.includes('@') || !serviceConsent} onClick={sendOtp} className="w-full bg-cyan-500 text-slate-950">Nhận mã xác minh</Button></div>}
    {step === 'otp' && <div className="space-y-3"><Field inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="Mã OTP 6 số"/><Button disabled={busy || otp.length !== 6} onClick={verifyOtp} className="w-full bg-cyan-500 text-slate-950">Xác minh email</Button><button onClick={sendOtp} className="w-full text-xs text-cyan-300">Gửi lại mã</button></div>}
    {step === 'setup-pin' && <div className="space-y-3"><Field type="password" inputMode="numeric" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} placeholder="Tạo PIN 6 số"/><Field type="password" inputMode="numeric" maxLength={6} value={confirmPin} onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))} placeholder="Nhập lại PIN"/><Button disabled={busy || pin.length !== 6} onClick={savePin} className="w-full bg-cyan-500 text-slate-950">Lưu PIN</Button></div>}
    {step === 'pin' && <div className="space-y-3"><Field autoFocus type="password" inputMode="numeric" maxLength={6} disabled={lockRemaining > 0} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} placeholder="PIN phụ huynh 6 số"/><Button disabled={busy || pin.length !== 6 || lockRemaining > 0} onClick={verifyPin} className="w-full bg-cyan-500 text-slate-950">{lockRemaining > 0 ? `Thử lại sau ${Math.floor(lockRemaining / 60)}:${String(lockRemaining % 60).padStart(2, '0')}` : 'Mở khóa'}</Button><button onClick={startPinReset} className="w-full text-xs text-slate-400">Quên PIN / đặt lại bằng email</button></div>}
    {step === 'pin-reset-email' && <div className="space-y-3"><div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3 text-xs text-slate-300">Nhập email đã dùng cho tài khoản phụ huynh. Phản hồi không tiết lộ email có tồn tại hay không.</div><Field autoFocus aria-label="Email đặt lại PIN" type="email" autoComplete="email" value={resetEmail} onChange={(e)=>setResetEmail(e.target.value)} placeholder="Email phụ huynh"/><Button disabled={busy||!resetEmail.includes('@')} onClick={requestPinReset} className="w-full bg-cyan-500 text-slate-950">Gửi mã đặt lại</Button><button disabled={busy} onClick={()=>{setError('');setMessage('');setStep('pin');}} className="w-full text-xs text-slate-400">Quay lại nhập PIN</button></div>}
    {step === 'pin-reset-confirm' && <div className="space-y-3"><p className="text-xs text-slate-300">Nhập mã gửi tới <strong>{resetEmail}</strong> và đặt PIN mới.</p><Field autoFocus aria-label="Mã đặt lại PIN" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={resetOtp} onChange={(e)=>setResetOtp(e.target.value.replace(/\D/g,''))} placeholder="Mã OTP 6 số"/><Field aria-label="PIN mới" type="password" inputMode="numeric" autoComplete="new-password" maxLength={6} value={resetPin} onChange={(e)=>setResetPin(e.target.value.replace(/\D/g,''))} placeholder="PIN mới 6 số"/><Field aria-label="Nhập lại PIN mới" type="password" inputMode="numeric" autoComplete="new-password" maxLength={6} value={resetConfirmPin} onChange={(e)=>setResetConfirmPin(e.target.value.replace(/\D/g,''))} placeholder="Nhập lại PIN mới"/><Button disabled={busy||resetOtp.length!==6||resetPin.length!==6||resetConfirmPin.length!==6} onClick={confirmPinReset} className="w-full bg-cyan-500 text-slate-950">Đặt lại PIN</Button><button disabled={busy} onClick={()=>void requestPinReset()} className="w-full text-xs text-cyan-300">Gửi lại mã</button><button disabled={busy} onClick={()=>{setError('');setMessage('');setStep('pin');}} className="w-full text-xs text-slate-400">Hủy đặt lại PIN</button></div>}
    {message && <p role="status" aria-live="polite" className="mt-3 rounded-lg bg-cyan-950 p-2 text-xs text-cyan-200">{message}</p>}{error && <p role="alert" className="mt-3 rounded-lg bg-rose-950 p-2 text-xs text-rose-300">{error}</p>}
  </div>;
};

export const ParentDashboard: React.FC = () => {
  const [unlocked, setUnlocked] = useState(parentGate.isUnlocked()); const [section, setSection] = useState<Section>('overview');
  const { user, domainProgress, setDiamonds } = useGameStore();
  const parent = useParentZoneStore(); const profile = parent.profiles.find((item) => item.id === parent.activeProfileId) ?? parent.profiles[0];
  const slotProvisioning = useRef(false);
  const [vault, setVault] = useState(0); const [walletBalance, setWalletBalance] = useState(user.diamonds); const [isVip, setIsVip] = useState(false); const [notice, setNotice] = useState('');
  const refreshWallet = async () => { if (parentFeatureFlags.demoAccess) { setWalletBalance(useGameStore.getState().user.diamonds); return; } try { const [result, subscriptions] = await Promise.all([parentApi.wallets(), parentApi.subscriptions()]); setVault(result.parentVault); const balance = result.children.find((item) => item.childSlotId === profile?.childSlotId)?.balance ?? 0; setWalletBalance(balance); setDiamonds(balance); setIsVip(subscriptions.subscriptions.some((item) => ['active','grace','billing_retry','cancelled'].includes(item.status) && (!item.periodEnd || new Date(item.periodEnd).getTime() > Date.now()))); } catch { /* offline cache remains visible */ } };
  useEffect(() => {
    if (!unlocked || !profile || parentFeatureFlags.demoAccess) return;
    if (!profile.childSlotId && !slotProvisioning.current) {
      slotProvisioning.current = true;
      void parentApi.createChildSlot(`profile:${profile.id}`).then(({ childSlotId }) => parent.updateProfile(profile.id, { childSlotId })).catch(() => setNotice('Chưa thể tạo ví ẩn danh; dữ liệu học tập local vẫn dùng bình thường.')).finally(() => { slotProvisioning.current = false; });
      return;
    }
    void refreshWallet();
  }, [unlocked, profile?.id, profile?.childSlotId]);
  useEffect(() => parentGate.subscribe((session) => setUnlocked(Boolean(session))), []);
  if (!unlocked) return <div className="flex h-full overflow-y-auto p-4"><ParentAuth onUnlocked={() => setUnlocked(true)}/></div>;
  const flagEnabled = import.meta.env.DEV || PERSONALIZATION_FEATURE_FLAGS.territoryFlag;
  const tabs: [Section, string, React.ReactNode][] = [['overview','Báo cáo',<BarChart3/>],['profiles','Hồ sơ',<UserRound/>],...(flagEnabled ? [['personalization','Cá nhân hóa',<Palette/>] as [Section,string,React.ReactNode]] : []),['missions','Nhiệm vụ',<HeartHandshake/>],['guides','Cẩm nang',<HeartHandshake/>],['limits','Thời gian',<Clock/>],['store','Cửa hàng',<ShoppingBag/>],['account','Tài khoản',<ShieldCheck/>]];
  const selectTabFromKeyboard = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = tabs.length - 1;
    const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length
      : event.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length
        : event.key === 'Home' ? 0 : event.key === 'End' ? last : null;
    if (next === null) return;
    event.preventDefault();
    const nextId = tabs[next][0];
    setSection(nextId);
    document.getElementById(`parent-tab-${nextId}`)?.focus();
  };
  return <div className="flex h-full flex-col overflow-hidden bg-[#070b18]">
    <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3"><div><h1 className="flex items-center gap-2 text-sm font-black text-cyan-200">Góc phụ huynh {parentFeatureFlags.demoAccess&&<span className="rounded bg-amber-500 px-1.5 py-0.5 text-[9px] text-slate-950">DEMO</span>}</h1><div className="text-[11px] text-slate-400">{profile?.name} · Kho 💎 {vault.toLocaleString('vi-VN')}</div></div><button onClick={() => parentGate.lock()} className={`min-h-11 min-w-11 rounded-lg bg-slate-800 p-2 ${focusRing}`} aria-label="Khóa góc phụ huynh"><ShieldCheck className="mx-auto h-4 w-4"/></button></div>
    <nav aria-label="Các mục Góc phụ huynh" role="tablist" className="flex shrink-0 gap-1 overflow-x-auto border-b border-slate-800 p-2">{tabs.map(([id,label,icon],index) => <button id={`parent-tab-${id}`} aria-controls="parent-section-panel" aria-selected={section===id} role="tab" tabIndex={section===id?0:-1} key={id} onClick={() => setSection(id)} onKeyDown={(event)=>selectTabFromKeyboard(event,index)} className={`flex min-h-11 min-w-fit items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold ${focusRing} ${section===id?'bg-cyan-500 text-slate-950':'bg-slate-900 text-slate-300'}`}>{React.cloneElement(icon as React.ReactElement<{className:string}>,{className:'h-3.5 w-3.5'})}{label}</button>)}</nav>
    <main id="parent-section-panel" role="tabpanel" aria-labelledby={`parent-tab-${section}`} tabIndex={0} className={`flex-1 overflow-y-auto p-4 pb-24 ${focusRing}`}>{notice && <div role="status" aria-live="polite" className="mb-3 rounded-xl bg-cyan-950 p-3 text-xs text-cyan-200">{notice}</div>}
      {section==='overview' && <Overview profileName={profile?.name ?? user.name} domainProgress={domainProgress} activities={parent.activities.filter((a)=>a.profileId===profile?.id)} walletBalance={walletBalance}/>}
      {section==='profiles' && <Profiles/>}{section==='personalization' && <PersonalizationReview/>}{section==='missions' && <Missions onWalletRefresh={refreshWallet}/>} {section==='guides' && <Guides isVip={isVip}/>} {section==='limits' && <Limits/>}
      {section==='store' && <Store vault={vault} onNotice={setNotice} onRefresh={refreshWallet}/>} {section==='account' && <Account onNotice={setNotice}/>}
    </main>
  </div>;
};

const Overview: React.FC<{profileName:string; domainProgress: ReturnType<typeof useGameStore.getState>['domainProgress']; activities: ReturnType<typeof useParentZoneStore.getState>['activities']; walletBalance:number}> = ({profileName,activities,walletBalance}) => {
  const monday = new Date(); monday.setHours(0,0,0,0); monday.setDate(monday.getDate()-((monday.getDay()+6)%7));
  const weekly = activities.filter((item) => item.completedAt >= monday.getTime());
  const scored = activities.filter((item) => typeof item.score === 'number');
  const average = scored.length ? Math.round(scored.reduce((sum,item)=>sum+(item.score??0),0)/scored.length) : 0;
  const suggestedConversation = activities.find((activity) => activity.sourceId && conversationTemplatesForContent(activity.sourceId).length)?.sourceId;
  const conversationPrompts = suggestedConversation ? conversationTemplatesForContent(suggestedConversation)[0]?.prompts ?? [] : [];
  const domainMetrics = DOMAINS_DATA.map((domain) => { const samples=activities.filter((item)=>item.domainId===domain.id&&typeof item.score==='number').slice(0,5);const accuracy=samples.length?Math.round(samples.reduce((sum,item)=>sum+(item.score??0),0)/samples.length):0;return{domain,sampleCount:samples.length,accuracy,confident:samples.length>=5}; });
  const radarReady = domainMetrics.every(metric=>metric.confident);
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950 to-slate-900 p-5">
        <h1 className="text-xl font-black">Báo cáo của {profileName}</h1>
        <p className="mt-1 text-xs text-slate-400">Tổng hợp ngay trên thiết bị, không gửi đáp án hay tiến độ của trẻ lên máy chủ.</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center"><Metric label="Accuracy" value={`${average}%`}/><Metric label="Hoạt động" value={String(activities.length)}/><Metric label="Ví của bé" value={`💎 ${walletBalance}`}/></div>
      </div>
      <div className="grid grid-cols-2 gap-2"><Metric label="Tuần này" value={`${weekly.length} hoạt động`}/><Metric label="Toàn thời gian" value={`${activities.length} hoạt động`}/></div>
      <div className="space-y-2 rounded-3xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center justify-between gap-3"><h2 className="font-black">Radar 5 miền năng lực</h2><span className={`rounded px-2 py-1 text-[9px] font-black ${radarReady?'bg-emerald-950 text-emerald-300':'bg-amber-950 text-amber-300'}`}>{radarReady?'ĐỦ ĐỘ TIN CẬY':'CHƯA ĐỦ DỮ LIỆU'}</span></div>
        <MasteryRadar values={domainMetrics.map(metric=>metric.confident?metric.accuracy:0)} ready={radarReady}/>
        {domainMetrics.map(({domain,sampleCount,accuracy,confident}) => { const label = confident ? `${accuracy}% · ${accuracy >= 80 ? 'Mastered' : 'Đang luyện'}` : `${sampleCount}/5 mẫu · Chưa đủ dữ liệu`;return <div key={domain.id}><div className="flex justify-between text-xs"><span>{domain.icon} {domain.nameVi}</span><span>{label}</span></div><div className="mt-1 h-2 overflow-hidden rounded bg-slate-800"><div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500" style={{width:`${confident?accuracy:0}%`}}/></div></div>;})}
        <p className="pt-2 text-[10px] text-slate-500">Đây là tiến độ trong ứng dụng, không phải đánh giá tâm lý hay chẩn đoán.</p>
      </div>
      <div className="rounded-3xl border border-emerald-700/40 bg-emerald-950/20 p-4"><h2 className="font-black text-emerald-300">Gợi ý đồng hành đã biên tập</h2>{conversationPrompts.length?<div className="mt-2 space-y-1">{conversationPrompts.map(prompt=><p key={prompt} className="text-xs leading-relaxed text-slate-300">• {prompt}</p>)}</div>:<p className="mt-2 text-xs leading-relaxed text-slate-300">Hỏi con: “Hôm nay điều gì làm con vui nhất, và có điều gì khiến con bối rối?” Hãy lắng nghe trước khi đưa lời khuyên.</p>}</div>
    </div>
  );
};
const Metric:React.FC<{label:string;value:string}>=({label,value})=><div className="rounded-2xl bg-slate-950 p-3"><div className="text-[10px] text-slate-400">{label}</div><div className="mt-1 font-black text-cyan-300">{value}</div></div>;
const MasteryRadar:React.FC<{values:number[];ready:boolean}>=({values,ready})=>{const center=90;const radius=62;const point=(index:number,scale:number)=>{const angle=-Math.PI/2+index*(Math.PI*2/5);return`${center+Math.cos(angle)*radius*scale},${center+Math.sin(angle)*radius*scale}`;};const polygon=(scales:number[])=>scales.map((scale,index)=>point(index,scale)).join(' ');return <div className="flex justify-center"><svg role="img" aria-label={ready?'Radar năng lực dựa trên ít nhất 5 mẫu ở mỗi miền':'Radar năng lực đang chờ đủ 5 mẫu ở mỗi miền'} viewBox="0 0 180 180" className="h-44 w-44"><title>{ready?'Radar năng lực đủ độ tin cậy':'Chưa đủ dữ liệu để vẽ radar năng lực'}</title>{[.25,.5,.75,1].map(scale=><polygon key={scale} points={polygon(Array(5).fill(scale))} fill="none" stroke="#334155" strokeWidth="1"/>)}{Array.from({length:5},(_,index)=><line key={index} x1={center} y1={center} x2={point(index,1).split(',')[0]} y2={point(index,1).split(',')[1]} stroke="#334155" strokeWidth="1"/>)}<polygon points={polygon(values.map(value=>Math.max(0,Math.min(100,value))/100))} fill={ready?'rgba(34,211,238,.25)':'rgba(100,116,139,.12)'} stroke={ready?'#22d3ee':'#64748b'} strokeWidth="2" strokeDasharray={ready?undefined:'4 4'}/></svg></div>;};

const Guides: React.FC<{ isVip: boolean }> = ({ isVip }) => {
  const [playing, setPlaying] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [notice, setNotice] = useState('');
  const { requestReauthentication, dialog: reauthDialog } = useParentReauthDialog();
  const guides = visibleParentGuides(import.meta.env.VITE_ENABLE_PENDING_HEALTH_CONTENT === 'true');
  const categories = [...new Set(guides.map((guide) => guide.category))];
  const normalized = query.trim().toLocaleLowerCase('vi');
  const filtered = guides.filter((guide) =>
    (category === 'all' || guide.category === category)
    && (!normalized || `${guide.title} ${guide.category} ${guide.checklist.join(' ')}`.toLocaleLowerCase('vi').includes(normalized)),
  );

  useEffect(() => () => {
    if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
  }, []);

  const openSource = async (source: ParentGuideExternalSource) => {
    try {
      await openApprovedParentExternalSource(
        source,
        () => requestReauthentication(`Mở nguồn ${source.publisher}: ${source.label}`, 'EXTERNAL_LINK'),
      );
      setNotice(`Đã mở nguồn ${source.publisher} trong trình duyệt an toàn.`);
    } catch (value) {
      setNotice(value instanceof Error ? value.message : 'Không thể mở nguồn bên ngoài.');
    }
  };

  const play = (id: string, content: string) => {
    if (typeof speechSynthesis === 'undefined' || typeof SpeechSynthesisUtterance === 'undefined') {
      setNotice('Thiết bị này chưa hỗ trợ bản đọc.');
      return;
    }
    speechSynthesis.cancel();
    if (playing === id) {
      setPlaying(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = 'vi-VN';
    utterance.rate = .82;
    utterance.onend = () => setPlaying(null);
    utterance.onerror = () => {
      setPlaying(null);
      setNotice('Không thể phát bản đọc trên thiết bị này.');
    };
    speechSynthesis.speak(utterance);
    setPlaying(id);
  };

  return <div className="space-y-3">
    {reauthDialog}
    <div className="rounded-2xl bg-indigo-950/40 p-4 text-xs text-indigo-200">Nội dung được đóng gói offline, biên soạn sẵn và không dùng AI. Bản đọc dùng giọng trên thiết bị, chỉ chạy trong Góc phụ huynh.</div>
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <Field type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm trong cẩm nang"/>
      <select aria-label="Lọc cẩm nang theo chủ đề" value={category} onChange={(event) => setCategory(event.target.value)} className={`min-h-11 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white ${focusRing}`}>
        <option value="all">Tất cả chủ đề</option>
        {categories.map((value) => <option key={value} value={value}>{value}</option>)}
      </select>
    </div>
    {notice && <div role="status" aria-live="polite" className="rounded-xl bg-amber-950/30 p-2 text-xs text-amber-200">{notice}</div>}
    {filtered.length === 0 && <div className="rounded-2xl bg-slate-900 p-5 text-center text-sm text-slate-400">Không tìm thấy nội dung phù hợp.</div>}
    {filtered.map((guide) => {
      const locked = guide.access === 'vip' && !isVip;
      const pending = guide.review.status === 'PENDING_HEALTH_REVIEW';
      return <article key={guide.id} className={`rounded-3xl border p-4 ${pending ? 'border-amber-700 bg-amber-950/20' : 'border-slate-800 bg-slate-900'}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="text-[10px] font-black uppercase text-cyan-300">{guide.category}</div>
          {pending && <span className="rounded bg-amber-700/40 px-2 py-1 text-[9px] font-black text-amber-200">BẢN NHÁP · CHỜ HẬU KIỂM</span>}
        </div>
        <h2 className="mt-1 font-black">{guide.title} {locked && '🔒'}</h2>
        {locked
          ? <p className="mt-2 text-xs text-slate-400">Nội dung này thuộc VIP. Gói tháng là lựa chọn chính.</p>
          : <>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-300">{guide.checklist.map((item) => <li key={item}>{item}</li>)}</ul>
            <div className="mt-3 rounded-xl bg-slate-950/70 p-3">
              <div className="text-[10px] font-black uppercase text-indigo-300">Gợi ý trò chuyện</div>
              {guide.conversation.prompts.map((item) => <div key={item} className="mt-1 text-xs text-slate-300">• {item}</div>)}
            </div>
            <Button onClick={() => play(guide.id, guide.podcastTranscript)} className="mt-3 bg-indigo-600">{playing === guide.id ? 'Dừng bản đọc' : 'Nghe bản đọc'}</Button>
            <div className="mt-3 text-[10px] text-slate-500">{guide.review.author} · {guide.review.reviewer} · v{guide.review.version} · {guide.review.reviewedAt}</div>
          </>}
        {(guide.externalSources ?? []).map((source) =>
          <Button key={source.url} onClick={() => void openSource(source)} className="mt-3 w-full bg-slate-800 text-cyan-200">
            Mở nguồn {source.publisher}: {source.label}
          </Button>,
        )}
        {Boolean(guide.externalSources?.length) && <p className="mt-2 text-[10px] text-slate-500">Nguồn ngoài chỉ mở sau khi xác thực lại; ứng dụng không gắn dữ liệu trẻ vào liên kết.</p>}
      </article>;
    })}
  </div>;
};

const ProfileAvatar:React.FC<{profileId:string;emoji:string}>=({profileId,emoji})=>{const assetId=usePersonalizationStore(state=>state.children[profileId]?.avatarAssetId);return assetId?<LocalMediaImage assetId={assetId} alt="Ảnh hồ sơ local" className="h-12 w-12 rounded-full object-cover" fallback={emoji}/>:<>{emoji}</>;};

const PersonalizationReview = () => {
  const profiles = useParentZoneStore((state) => state.profiles);
  const children = usePersonalizationStore((state) => state.children);
  const transition = usePersonalizationStore((state) => state.transitionFlagReview);
  const [error, setError] = useState('');
  const { requestText, dialog: noteDialog } = useParentTextDialog();
  const { requestConfirmation, dialog: confirmDialog } = useParentConfirmDialog();
  const rows = profiles.map((profile) => ({ profile, child: children[profile.id] })).filter((row) => row.child?.flagAssetId);
  const reject = async (childId: string) => { try { const entered=await requestText({title:'Yêu cầu trẻ chỉnh lại',description:'Viết lời nhắn ngắn, tích cực để trẻ biết cần thay đổi điều gì. Bỏ trống để dùng lời nhắn mặc định.',maxLength:160,placeholder:'Ví dụ: Con thử chọn hình rõ hơn nhé.',submitLabel:'Gửi yêu cầu'});const note=entered||'Phụ huynh đề nghị chọn hình khác.';if(!transition(childId,'REJECTED',note))setError('Không thể từ chối ở trạng thái hiện tại.');}catch(value){if(!isParentTextDialogCancellation(value))setError(value instanceof Error?value.message:'Không thể ghi nhận yêu cầu.');} };
  const remove = async (assetId: string) => { if (!await requestConfirmation({title:'Xóa ảnh cờ?',description:'Ảnh sẽ bị xóa vĩnh viễn khỏi thiết bị này và không thể khôi phục.',confirmLabel:'Xóa ảnh',tone:'danger'})) return; try { await deleteMediaAsset(assetId); } catch { setError('Không thể xóa ảnh cờ local.'); } };
  return <div className="space-y-3">{noteDialog}{confirmDialog}<div className="rounded-2xl border border-cyan-900 bg-cyan-950/30 p-3 text-xs text-cyan-100">Bạn đang ở trong phiên Góc Phụ Huynh đã mở khóa. Duyệt chỉ cho phép cờ được áp dụng trong game trên thiết bị, không chia sẻ hay đăng công khai.</div>{rows.length===0&&<div className="rounded-2xl bg-slate-900 p-5 text-center text-sm text-slate-400">Chưa có cờ nào chờ xem xét.</div>}{rows.map(({profile,child})=><article key={profile.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-4"><div className="flex gap-3"><div className="aspect-[3/2] w-32 overflow-hidden rounded-xl border border-slate-700">{child.flagAssetId&&<LocalMediaImage assetId={child.flagAssetId} alt={`Cờ của ${profile.name}`} className="h-full w-full object-cover" fallback="🚩"/>}</div><div className="min-w-0 flex-1"><h3 className="font-black">{profile.name}</h3><p className="mt-1 text-xs text-slate-400">{child.flagReviewStatus==='PENDING_PARENT_REVIEW'?'Đang chờ duyệt':child.flagReviewStatus==='APPROVED_LOCAL'?'Đã áp dụng trong game':child.flagReviewStatus==='REJECTED'?'Đã yêu cầu chỉnh lại':'Bản nháp local'}</p>{child.flagReviewNote&&<p className="mt-1 text-xs text-rose-300">{child.flagReviewNote}</p>}</div></div><div className="mt-3 flex flex-wrap gap-2">{child.flagReviewStatus==='PENDING_PARENT_REVIEW'&&<><Button data-testid={`approve-flag-${profile.id}`} onClick={()=>{if(!transition(profile.id,'APPROVED_LOCAL'))setError('Không thể duyệt ở trạng thái hiện tại.');}} className="bg-emerald-500 text-slate-950">Duyệt & áp dụng</Button><Button onClick={()=>void reject(profile.id)} className="bg-rose-950 text-rose-300">Yêu cầu chỉnh</Button></>}{child.flagReviewStatus==='APPROVED_LOCAL'&&<Button onClick={()=>transition(profile.id,'DRAFT_LOCAL','Đã gỡ áp dụng bởi phụ huynh.')} className="bg-amber-950 text-amber-200">Gỡ khỏi game</Button>}<Button onClick={()=>void remove(child.flagAssetId!)} className="flex items-center gap-1 bg-slate-800 text-slate-300"><Trash2 className="h-3.5 w-3.5"/>Xóa ảnh</Button></div></article>)}{error&&<p role="alert" className="text-xs text-rose-300">{error}</p>}</div>;
};
const Profiles = () => { const state=useParentZoneStore(); const current=state.profiles.find(profile=>profile.id===state.activeProfileId)??state.profiles[0]; const [name,setName]=useState(''); const [grade,setGrade]=useState<ChildGrade|undefined>(); const [avatar,setAvatar]=useState('🧑‍🚀'); const [editName,setEditName]=useState(current?.name??''); const [editGrade,setEditGrade]=useState<ChildGrade|undefined>(current?.grade); const [editAvatar,setEditAvatar]=useState(current?.avatar??'🧑‍🚀'); const [error,setError]=useState(''); const fileRef=useRef<HTMLInputElement>(null); const {requestConfirmation,dialog:confirmDialog}=useParentConfirmDialog();
  useEffect(()=>{setEditName(current?.name??'');setEditGrade(current?.grade);setEditAvatar(current?.avatar??'🧑‍🚀');},[current?.id]);
  const selectProfile=(id:string)=>{if(id===state.activeProfileId)return;try{const game=useGameStore.getState();game.saveToLocalStorage();switchProfileGameState(state.activeProfileId,id,localStorage,parentFeatureFlags.demoAccess);state.setActiveProfile(id);game.loadFromLocalStorage(true);}catch(value){setError(value instanceof Error?value.message:'Không thể chuyển hồ sơ.');}};
  const create=async()=>{setError('');try{const cleanName=name.trim();if(!cleanName||cleanName.length>40)throw new Error('Tên hiển thị cần từ 1 đến 40 ký tự.');const childSlotId=parentFeatureFlags.demoAccess?null:(await parentApi.createChildSlot(crypto.randomUUID())).childSlotId;const previousProfileId=state.activeProfileId;const id=state.createProfile({name:cleanName,grade,avatar:avatar.trim()||'🧑‍🚀',childSlotId});const game=useGameStore.getState();game.saveToLocalStorage();switchProfileGameState(previousProfileId,id,localStorage,parentFeatureFlags.demoAccess);state.setActiveProfile(id);game.loadFromLocalStorage(true);setName('');}catch(value){setError(value instanceof Error?value.message:'Không thể tạo hồ sơ.');}};
  const save=()=>{setError('');const cleanName=editName.trim();if(!current||!cleanName||cleanName.length>40){setError('Tên hiển thị cần từ 1 đến 40 ký tự.');return;}state.updateProfile(current.id,{name:cleanName,grade:editGrade,avatar:editAvatar.trim()||'🧑‍🚀'});};
  const photo=async(file?:File)=>{if(!file)return;setError('');try{const processed=await processLocalImage(file,{aspectRatio:3/4,maxWidth:768,maxHeight:1024});const previous=usePersonalizationStore.getState().children[state.activeProfileId]?.avatarAssetId??null;await saveProcessedMedia(state.activeProfileId,'AVATAR_SOURCE',processed,previous);state.updateProfile(state.activeProfileId,{photoDataUrl:undefined});}catch(value){setError(value instanceof Error?value.message:'Không thể lưu ảnh local.');}};
  const remove=async()=>{const current=state.profiles.find(p=>p.id===state.activeProfileId);if(!current||!await requestConfirmation({title:`Xóa hồ sơ ${current.name}?`,description:'Toàn bộ dữ liệu local và ảnh của trẻ trong hồ sơ này sẽ bị xóa vĩnh viễn khỏi thiết bị.',confirmLabel:'Xóa hồ sơ',tone:'danger'}))return;try{if(current.childSlotId&&!parentFeatureFlags.demoAccess)await parentApi.closeChildSlot(current.childSlotId,`profile-close:${current.id}`);await clearChildPersonalizationData(current.id);state.removeProfileLocal(current.id);}catch(value){setError(value instanceof Error?value.message:'Không thể xóa hồ sơ.');}};
  return <div className="space-y-4">{confirmDialog}<div className="grid grid-cols-2 gap-2">{state.profiles.map(p=><button aria-pressed={p.id===state.activeProfileId} key={p.id} onClick={()=>selectProfile(p.id)} className={`min-h-11 rounded-2xl border p-3 text-left ${focusRing} ${p.id===state.activeProfileId?'border-cyan-400 bg-cyan-950':'border-slate-800 bg-slate-900'}`}><div className="text-2xl"><ProfileAvatar profileId={p.id} emoji={p.avatar}/></div><div className="mt-1 font-black">{p.name}</div><div className="text-xs text-slate-400">{p.grade?`Khối ${p.grade}`:'Chưa chọn khối'} · chỉ để hiển thị</div></button>)}</div>
  {current&&<div className="space-y-3 rounded-3xl border border-cyan-900 bg-cyan-950/20 p-4"><h2 className="font-black">Chỉnh sửa hồ sơ đang chọn</h2><Field maxLength={40} value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Tên hồ sơ đang chọn"/><div className="flex flex-wrap gap-2"><select aria-label="Khối của hồ sơ đang chọn" value={editGrade??''} onChange={e=>setEditGrade(e.target.value?Number(e.target.value) as ChildGrade:undefined)} className="min-h-11 min-w-0 flex-1 rounded-xl bg-slate-950 p-2 text-sm"><option value="">Khối (tùy chọn)</option>{[1,2,3,4,5].map(v=><option key={v} value={v}>Khối {v}</option>)}</select><Field aria-label="Biểu tượng hồ sơ đang chọn" value={editAvatar} onChange={e=>setEditAvatar(e.target.value)} className="w-20 max-w-full shrink-0"/></div><Button disabled={!editName.trim()} onClick={save} className="bg-cyan-500 text-slate-950">Lưu hồ sơ</Button></div>}
  <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-900 p-4"><h2 className="font-black">Thêm hồ sơ ({state.profiles.length}/4)</h2><Field maxLength={40} value={name} onChange={e=>setName(e.target.value)} placeholder="Tên hiển thị local"/><div className="flex flex-wrap gap-2"><select aria-label="Khối của hồ sơ mới" value={grade??''} onChange={e=>setGrade(e.target.value?Number(e.target.value) as ChildGrade:undefined)} className="min-h-11 min-w-0 flex-1 rounded-xl bg-slate-950 p-2 text-sm"><option value="">Khối (tùy chọn)</option>{[1,2,3,4,5].map(v=><option key={v} value={v}>Khối {v}</option>)}</select><Field aria-label="Biểu tượng hồ sơ mới" value={avatar} onChange={e=>setAvatar(e.target.value)} className="w-20 max-w-full shrink-0"/></div><Button disabled={!name.trim()||state.profiles.length>=4} onClick={create} className="bg-cyan-500 text-slate-950">Tạo hồ sơ</Button></div>
  <div className="flex gap-2">{(import.meta.env.DEV||PERSONALIZATION_FEATURE_FLAGS.photoAvatar)&&<><input ref={fileRef} hidden type="file" accept="image/*" onChange={e=>void photo(e.target.files?.[0])}/><Button onClick={()=>fileRef.current?.click()} className="bg-slate-800">Chọn ảnh local</Button></>}<Button onClick={remove} className="bg-rose-950 text-rose-300">Xóa hồ sơ</Button></div>{error&&<p role="alert" className="text-xs text-rose-300">{error}</p>}<p className="text-xs text-slate-500">Tên, khối và ảnh không rời khỏi thiết bị. Khối hiện chỉ mang tính hiển thị.</p></div>;
};

const Missions:React.FC<{onWalletRefresh:()=>Promise<void>}>=({onWalletRefresh})=>{
  const state=useParentZoneStore();
  const missions=state.missions.filter(m=>m.profileId===state.activeProfileId);
  const [amounts,setAmounts]=useState<Record<string,string>>({});
  const [error,setError]=useState('');
  const [celebration,setCelebration]=useState('');
  const {requestConfirmation,dialog:confirmDialog}=useParentConfirmDialog();
  const approve=async(id:string)=>{
    const mission=missions.find(m=>m.id===id);const profile=state.profiles.find(p=>p.id===state.activeProfileId);if(!mission||!profile)return;
    const diamonds=Number(amounts[id]||0);if(!Number.isSafeInteger(diamonds)||diamonds<0){setError('Kim Cương phải là số nguyên hợp lệ.');return;}
    if(diamonds>=500&&!await requestConfirmation({title:'Xác nhận phần thưởng lớn',description:`Trao ${diamonds.toLocaleString('vi-VN')} Kim Cương? Giao dịch MVP không thể hoàn tác.`,confirmLabel:'Trao Kim Cương',tone:'warning'}))return;
    try{
      if(diamonds>0&&!parentFeatureFlags.demoAccess){if(!profile.childSlotId)throw new Error('Hồ sơ chưa có ví máy chủ.');await parentApi.approveReward(mission.rewardRequestId,profile.childSlotId,diamonds);}
      const local=state.approveMissionLocal(id,diamonds,mission.fixedCoinReward);
      if(!local.committed)return;
      if(parentFeatureFlags.demoAccess&&diamonds>0)useGameStore.getState().addDiamonds(diamonds);
      if(local.coinsAwarded>0)useGameStore.getState().creditAwardedNovaCoins(local.coinsAwarded);
      emitMissionRewardConfirmed({localMissionId:id,contentMissionId:mission.contentMissionId,coinsAwarded:local.coinsAwarded,diamondsAwarded:diamonds});
      setCelebration(`🎉 Đã xác nhận nhiệm vụ · +${local.coinsAwarded} Xu · +${diamonds} 💎`);
      await onWalletRefresh();
    }catch(value){setError(value instanceof Error?value.message:'Không thể duyệt.');}
  };
  const difficultyLabel={easy:'Easy',medium:'Medium',hard:'Hard',challenge:'Challenge'} as const;
  return <div className="space-y-3">{confirmDialog}<p className="text-xs text-slate-400">Nhiệm vụ chỉ xuất hiện từ bài học. Xu cố định theo độ khó (50/100/150/200), chịu trần 200 Xu/ngày và 1.000 Xu/tuần; Kim Cương được nhập khi duyệt và MVP không hoàn tác.</p>{celebration&&<div role="status" aria-live="polite" className="rounded-xl border border-emerald-500 bg-emerald-950/40 p-3 text-sm font-black text-emerald-200">{celebration}</div>}{parentFeatureFlags.demoAccess&&<div className="rounded-xl bg-amber-950/30 p-3 text-xs text-amber-200">Trong demo, Kim Cương được cộng local để review và không phải giao dịch tài chính thật.</div>}{missions.length===0&&<div className="rounded-2xl bg-slate-900 p-5 text-center text-sm text-slate-400">Chưa có nhiệm vụ từ bài học.</div>}{missions.map(m=><div key={m.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><div className="font-bold">{m.title}</div><div className="mt-1 text-xs text-amber-300">{difficultyLabel[m.difficulty]} · {m.fixedCoinReward} Xu Nova</div><div className="mt-1 text-xs text-slate-400">{m.status==='suggested'?'Đang chờ trẻ thực hiện':m.status==='done_by_child'?'Trẻ đã báo hoàn thành':'Đã duyệt'}</div>{m.status==='suggested'&&<Button onClick={()=>state.markMissionDone(m.id)} className="mt-3 bg-indigo-600">Con đã làm xong</Button>}{m.status==='done_by_child'&&<div className="mt-3 flex gap-2"><Field inputMode="numeric" value={amounts[m.id]??''} onChange={e=>setAmounts({...amounts,[m.id]:e.target.value.replace(/\D/g,'')})} placeholder="Kim cương (0 = không thưởng)"/><Button onClick={()=>void approve(m.id)} className="bg-cyan-500 text-slate-950">Duyệt</Button></div>}{m.status==='approved'&&<div className="mt-2 text-xs text-emerald-300">Đã duyệt · {m.diamondsAwarded??0} 💎 · +{m.novaCoinsAwarded??0} Xu{(m.novaCoinsAwarded??0)<m.fixedCoinReward?' (đã áp dụng giới hạn)':''}</div>}</div>)}{error&&<p role="alert" className="text-xs text-rose-300">{error}</p>}</div>;
};

const Limits=()=>{const state=useParentZoneStore();const value=state.limits[state.activeProfileId]??{dailyMinutes:30,curfewStart:'21:30',curfewEnd:'06:00'};const date=localDateKey();const today=normalizeDailyUsage(state.usage[`${state.activeProfileId}:${date}`],date);const weekly=summarizeRecentUsage(Object.entries(state.usage).filter(([key])=>key.startsWith(`${state.activeProfileId}:`)).map(([,usage])=>usage));const minutes=(value:number)=>Math.round(value);const [notice,setNotice]=useState<{message:string;error:boolean}|null>(null);const {requestReauthentication,dialog:reauthDialog}=useParentReauthDialog();const extend=async()=>{setNotice(null);try{await requestReauthentication('Gia hạn thêm 15 phút hôm nay','SCREEN_TIME_EXTENSION');const extended=state.extendToday(state.activeProfileId);setNotice({message:extended?'Đã thêm 15 phút hôm nay.':'Đã dùng đủ 2 lần gia hạn hôm nay.',error:!extended});}catch(e){setNotice({message:e instanceof Error?e.message:'Không thể gia hạn.',error:true});}};const resetClock=async()=>{setNotice(null);try{await requestReauthentication('Xác nhận lại giờ thiết bị','CLOCK_RESET');state.resetClockGuard();setNotice({message:'Đã xác nhận lại giờ thiết bị.',error:false});}catch(e){setNotice({message:e instanceof Error?e.message:'Không thể xác nhận giờ thiết bị.',error:true});}};return <div className="space-y-4">{reauthDialog}{notice&&<div role={notice.error?'alert':'status'} aria-live={notice.error?'assertive':'polite'} className={`rounded-xl border p-3 text-sm ${notice.error?'border-rose-800 bg-rose-950/40 text-rose-200':'border-emerald-700 bg-emerald-950/40 text-emerald-200'}`}>{notice.message}</div>}{state.clockGuard.rollbackDetected&&<div className="rounded-2xl border border-amber-600 bg-amber-950/30 p-4 text-xs text-amber-200"><div className="font-black">Phát hiện giờ thiết bị bị lùi</div><p className="mt-1">Hoạt động mới đang bị khóa để tránh vượt giới hạn. Hãy sửa giờ hệ thống rồi xác nhận bằng mật khẩu phụ huynh.</p><Button onClick={()=>void resetClock()} className="mt-3 bg-amber-500 text-slate-950">Xác nhận lại giờ thiết bị</Button></div>}<div className="grid grid-cols-2 gap-2"><Metric label="Hôm nay" value={`${minutes(today.minutes)} phút`}/><Metric label="7 ngày gần đây" value={`${minutes(weekly.minutes)} phút`}/></div><div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-xs text-slate-300"><div className="font-black text-white">Phân bổ hôm nay</div><div className="mt-2 grid grid-cols-3 gap-2 text-center"><div>Bài học<br/><strong>{minutes(today.byCategory?.lesson??0)}p</strong></div><div>Mini-game<br/><strong>{minutes(today.byCategory?.minigame??0)}p</strong></div><div>Khám phá<br/><strong>{minutes(today.byCategory?.exploration??0)}p</strong></div></div></div><div className="rounded-3xl border border-slate-800 bg-slate-900 p-4 space-y-4"><label className="block text-sm font-bold">Giới hạn mỗi ngày: {value.dailyMinutes} phút<input type="range" min="10" max="120" step="5" value={value.dailyMinutes} onChange={e=>state.setLimits(state.activeProfileId,{...value,dailyMinutes:Number(e.target.value)})} className="mt-2 w-full"/></label><div className="grid grid-cols-2 gap-3"><label className="text-xs">Giờ nghỉ từ<Field type="time" value={value.curfewStart} onChange={e=>state.setLimits(state.activeProfileId,{...value,curfewStart:e.target.value})}/></label><label className="text-xs">Đến<Field type="time" value={value.curfewEnd} onChange={e=>state.setLimits(state.activeProfileId,{...value,curfewEnd:e.target.value})}/></label></div></div><Button onClick={()=>void extend()} className="bg-indigo-600">Thêm 15 phút hôm nay</Button><p className="text-xs text-slate-400">Chỉ tính khi trẻ tương tác ở foreground; không tính Góc phụ huynh, thời gian nền hoặc idle. Tối đa 2 lần gia hạn/ngày. Khi hết giờ, ứng dụng cho trẻ hoàn thành địa điểm bài học hoặc lượt chơi đang diễn ra rồi mới khóa.</p></div>};

const Store:React.FC<{vault:number;onNotice:(v:string)=>void;onRefresh:()=>Promise<void>}>=({vault,onNotice,onRefresh})=>{
  const [products,setProducts]=useState<LocalizedProduct[]>([]);const [pendingProduct,setPendingProduct]=useState<ParentProductId|null>(null);const parentId=localStorage.getItem('novastars_parent_id')??'';
  const {requestReauthentication,dialog:reauthDialog}=useParentReauthDialog();
  useEffect(()=>{void purchaseProvider.getProducts().then(setProducts).catch(()=>setProducts([]))},[]);
  const labels:Record<ParentProductId,string>={'novastars.vip.monthly':'VIP tháng · 150 💎/kỳ','novastars.vip.annual':'VIP năm · 2.000 💎/kỳ','novastars.diamonds.100':'100 kim cương','novastars.diamonds.350':'350 kim cương','novastars.diamonds.1000':'1.000 kim cương','novastars.diamonds.2500':'2.500 kim cương'};
  const buy=async(id:ParentProductId)=>{if(pendingProduct)return;setPendingProduct(id);try{await requestReauthentication('Tiếp tục mua hàng trong cửa hàng ứng dụng','PURCHASE');await purchaseProvider.purchase(id,parentId);onNotice('Giao dịch đã được cửa hàng chấp nhận; đang chờ máy chủ xác nhận webhook.');const confirmed=await waitForParentVaultCredit(async()=>(await parentApi.wallets()).parentVault,vault);await onRefresh();onNotice(confirmed?'Máy chủ đã xác nhận và cập nhật Kho phụ huynh.':'Giao dịch vẫn đang được xử lý. Không mua lại; ứng dụng sẽ cập nhật khi webhook tới.');}catch(e){onNotice(e instanceof Error?e.message:'Không thể mua hàng.');}finally{setPendingProduct(null);}};
  const restore=async()=>{if(pendingProduct)return;try{await requestReauthentication('Khôi phục giao dịch từ cửa hàng ứng dụng','PURCHASE_RESTORE');await purchaseProvider.restore(parentId);await onRefresh();onNotice('Đã yêu cầu khôi phục giao dịch; consumable cũ không được cấp lại.');}catch(e){onNotice(e instanceof Error?e.message:'Không thể khôi phục.');}};
  return <div className="space-y-4">{reauthDialog}<div className="rounded-3xl bg-gradient-to-br from-cyan-950 to-slate-900 p-5"><WalletCards className="h-7 w-7 text-cyan-300"/><div className="mt-2 text-sm text-slate-400">Kho phụ huynh</div><div className="text-2xl font-black">💎 {vault.toLocaleString('vi-VN')}</div></div>{pendingProduct&&<div role="status" aria-live="polite" className="rounded-xl bg-cyan-950 p-3 text-xs text-cyan-200">Đang xác nhận giao dịch. Các nút mua được tạm khóa để tránh mua lặp.</div>}<div className="grid grid-cols-2 gap-3">{PRODUCT_IDS.map(id=>{const product=products.find(p=>p.id===id);return <button key={id} disabled={Boolean(pendingProduct)} onClick={()=>void buy(id)} className={`min-h-11 rounded-2xl border p-4 text-left disabled:opacity-40 ${focusRing} ${id==='novastars.vip.monthly'?'border-amber-400 bg-amber-950/30':'border-slate-800 bg-slate-900'}`}><div className="font-black">{labels[id]}</div><div className="mt-2 text-sm text-cyan-300">{pendingProduct===id?'Đang xác nhận…':product?.localizedPrice??'Giá theo cửa hàng'}</div></button>})}</div><Button disabled={Boolean(pendingProduct)} onClick={()=>void restore()} className="bg-slate-800">Khôi phục giao dịch</Button><p className="text-xs text-slate-500">VIP tháng là gói chính. Giá và thanh toán do App Store/Google Play hiển thị; máy chủ chỉ ghi nhận webhook hợp lệ.</p></div>;
};

const Account:React.FC<{onNotice:(v:string)=>void}>=({onNotice})=>{const fileRef=useRef<HTMLInputElement>(null);const parentState=useParentZoneStore();const [biometricEnabled,setBiometricEnabled]=useState(parentBiometric.isEnabled());const {requestReauthentication,dialog:reauthDialog}=useParentReauthDialog();const {requestSecret,dialog:secretDialog}=useParentSecretDialog();const {requestConfirmation,dialog:confirmDialog}=useParentConfirmDialog();const backup=async()=>{try{const password=await requestSecret({title:'Bảo vệ tệp sao lưu',description:'Đặt mật khẩu riêng có ít nhất 8 ký tự. Bạn sẽ cần mật khẩu này để khôi phục dữ liệu.',confirm:true,minLength:8,submitLabel:'Tạo bản sao lưu'});const blob=await createEncryptedBackup(password);const result=await exportEncryptedParentBackup(blob,`novastars-backup-${new Date().toISOString().slice(0,10)}.json`);onNotice(result==='shared'?'Đã mở bảng lưu/chia sẻ bản sao lưu mã hóa.':'Đã tải bản sao lưu mã hóa.');}catch(e){if(!isParentSecretDialogCancellation(e)&&!String(e).toLowerCase().includes('cancel'))onNotice(e instanceof Error?e.message:'Không thể sao lưu.');}};const restore=async(file?:File)=>{if(!file)return;try{const password=await requestSecret({title:'Mở tệp sao lưu',description:'Nhập mật khẩu đã dùng khi tạo tệp. Mật khẩu không được gửi ra khỏi thiết bị.',submitLabel:'Kiểm tra tệp'});const preview=await previewEncryptedBackup(file,password);const exportedAt=new Date(preview.exportedAt).toLocaleString('vi-VN');const mediaLabel=preview.mediaCount?` và ${preview.mediaCount} ảnh local`:'';if(!await requestConfirmation({title:'Khôi phục bản sao lưu?',description:`Khôi phục ${preview.keyCount} mục dữ liệu${mediaLabel} từ bản sao lưu ngày ${exportedAt}? Dữ liệu hiện tại tương ứng sẽ bị thay thế.`,confirmLabel:'Khôi phục',tone:'warning'}))return;await restoreEncryptedBackup(file,password);location.reload();}catch(e){if(!isParentSecretDialogCancellation(e))onNotice(e instanceof Error?e.message:'Không thể khôi phục tệp sao lưu.');}finally{if(fileRef.current)fileRef.current.value='';}};const toggleBiometric=async()=>{if(biometricEnabled){parentBiometric.setEnabled(false);setBiometricEnabled(false);return;}try{await requestReauthentication('Bật Face ID / vân tay trên thiết bị này','BIOMETRIC_ENABLE');if(!await parentBiometric.isAvailable())throw new Error('Thiết bị chưa có sinh trắc học khả dụng.');await parentBiometric.authenticate();parentBiometric.setEnabled(true);setBiometricEnabled(true);}catch(e){onNotice(e instanceof Error?e.message:'Không thể bật sinh trắc học.');}};const diagnostics=async()=>{try{if(!await requestConfirmation({title:'Xuất báo cáo chẩn đoán local?',description:'Tệp chỉ chứa số liệu tổng hợp về thời gian sử dụng, hoạt động và nhiệm vụ. Không có tên, ID hồ sơ, email, đáp án, điểm số hoặc ảnh. Tệp không tự tải lên; bạn chủ động chọn nơi lưu/chia sẻ.',confirmLabel:'Tôi đồng ý xuất',tone:'neutral'}))return;await requestReauthentication('Xác nhận xuất báo cáo chẩn đoán local','DIAGNOSTIC_EXPORT');const report=createParentDiagnosticReport(parentState);const result=await exportParentDiagnosticReport(createParentDiagnosticBlob(report),`novastars-diagnostics-${new Date().toISOString().slice(0,10)}.json`);onNotice(result==='shared'?'Đã mở bảng lưu/chia sẻ báo cáo chẩn đoán local.':'Đã tải báo cáo chẩn đoán local.');}catch(e){if(!String(e).toLowerCase().includes('hủy')&&!String(e).toLowerCase().includes('cancel'))onNotice(e instanceof Error?e.message:'Không thể xuất báo cáo chẩn đoán.');}};const deleteAccount=async()=>{if(!await requestConfirmation({title:'Xóa tài khoản và dữ liệu?',description:'Tài khoản phụ huynh, các ví và toàn bộ dữ liệu trẻ trên thiết bị này sẽ bị xóa. Dữ liệu giao dịch bắt buộc có thể vẫn được lưu theo quy định.',confirmLabel:'Xóa vĩnh viễn',tone:'danger'}))return;const result=await deleteParentAccountAndLocalData({deleteRemote:parentFeatureFlags.demoAccess?async()=>undefined:parentApi.deleteAccount,clearMedia:clearAllPersonalizationData});if(result.warnings.length)await requestConfirmation({title:'Dữ liệu local đã được xóa',description:result.warnings.join('\n'),confirmLabel:'Đã hiểu',tone:'warning',requiredAcknowledgement:true});location.reload();};return <div className="space-y-3">{reauthDialog}{secretDialog}{confirmDialog}<div className="rounded-3xl border border-slate-800 bg-slate-900 p-4"><h2 className="font-black">Dữ liệu & quyền riêng tư</h2><p className="mt-2 text-xs leading-relaxed text-slate-400">Tiến độ, câu trả lời, thời lượng, nhiệm vụ và ảnh của trẻ chỉ nằm local. Máy chủ chỉ giữ tài khoản phụ huynh, đồng ý chính sách và dữ liệu tài chính gắn với mã hồ sơ ẩn danh.</p></div><Button onClick={()=>void toggleBiometric()} className="w-full bg-slate-800">{biometricEnabled?'Tắt':'Bật'} Face ID / vân tay</Button><Button onClick={()=>void backup()} className="flex w-full items-center justify-center gap-2 bg-indigo-600"><Download className="h-4 w-4"/>Sao lưu mã hóa thủ công</Button><input ref={fileRef} hidden type="file" accept="application/json" onChange={e=>void restore(e.target.files?.[0])}/><Button onClick={()=>fileRef.current?.click()} className="flex w-full items-center justify-center gap-2 bg-slate-800"><Upload className="h-4 w-4"/>Khôi phục từ tệp</Button><Button onClick={()=>void diagnostics()} className="flex w-full items-center justify-center gap-2 bg-slate-800"><Download className="h-4 w-4"/>Xuất báo cáo chẩn đoán local</Button><Button onClick={()=>void parentApi.logout().then(()=>location.reload())} className="flex w-full items-center justify-center gap-2 bg-slate-800"><LogOut className="h-4 w-4"/>Đăng xuất phụ huynh</Button><Button onClick={()=>void deleteAccount()} className="w-full bg-rose-950 text-rose-300">Xóa tài khoản và dữ liệu local</Button></div>};
