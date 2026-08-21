import React from 'react';
import { Rocket } from 'lucide-react';

const STREAKS = Array.from({ length: 52 }, (_, index) => ({
  angle: (index * 137.508) % 360,
  distance: 24 + ((index * 47) % 190),
  length: 70 + ((index * 83) % 260),
  width: 1 + (index % 3) * 0.65,
  delay: ((index * 29) % 23) / 100,
  opacity: 0.35 + (index % 5) * 0.12,
}));

type WarpStyle = React.CSSProperties & Record<`--${string}`, string>;

interface Props {
  durationMs?: number;
  title?: string;
  subtitle?: string;
}

export const HyperspaceTransition: React.FC<Props> = ({
  durationMs = 1600,
  title = 'Khóa tọa độ · Hyperdrive sẵn sàng',
  subtitle = 'Đang mở hành lang tri thức',
}) => (
  <div
    data-testid="hyperspeed-transition-overlay"
    className="hyperspace fixed inset-0 z-50 overflow-hidden bg-[#01030b] pointer-events-none select-none"
    role="status"
    aria-label="Đang kích hoạt du hành siêu tốc"
    style={{ '--warp-duration': `${durationMs}ms` } as WarpStyle}
  >
    <style>{`
      .hyperspace {
        --warp-cyan: 103, 232, 249;
        animation: warpScene var(--warp-duration) linear both;
        isolation: isolate;
      }
      .warp-nebula {
        position: absolute; inset: -35%;
        background:
          radial-gradient(circle at 50% 50%, rgba(224,242,254,.16) 0 2%, transparent 18%),
          conic-gradient(from 30deg at 50% 50%, #020617 0deg, #172554 58deg, #07152d 116deg, #312e81 180deg, #020617 260deg, #164e63 320deg, #020617 360deg);
        filter: blur(22px) saturate(1.35);
        animation: nebulaCollapse var(--warp-duration) cubic-bezier(.65,0,.25,1) both;
      }
      .warp-vignette {
        position: absolute; inset: 0; z-index: 8;
        background: radial-gradient(circle, transparent 0 18%, rgba(1,3,11,.28) 48%, rgba(1,3,11,.92) 100%);
      }
      .warp-streak {
        position: absolute; z-index: 3; left: 50%; top: 50%;
        width: var(--length); height: var(--width);
        border-radius: 999px;
        transform-origin: left center;
        background: linear-gradient(90deg, transparent, rgba(var(--warp-cyan),.25) 18%, rgba(224,242,254,.95));
        box-shadow: 0 0 8px rgba(var(--warp-cyan),.8);
        opacity: 0;
        animation: streakLaunch var(--warp-duration) var(--delay) cubic-bezier(.3,0,.05,1) both;
      }
      .warp-ring {
        position: absolute; z-index: 5; left: 50%; top: 50%;
        width: 18vmin; height: 18vmin; border-radius: 50%;
        border: 2px solid rgba(165,243,252,.9);
        box-shadow: 0 0 22px #67e8f9, inset 0 0 22px #818cf8;
        transform: translate(-50%,-50%) scale(.08);
        animation: warpRing var(--warp-duration) cubic-bezier(.1,.75,.15,1) both;
      }
      .warp-ring--late { animation-delay: .08s; border-color: rgba(196,181,253,.75); }
      .warp-core {
        position: absolute; z-index: 6; left: 50%; top: 50%;
        width: 7vmin; height: 7vmin; border-radius: 50%;
        transform: translate(-50%,-50%);
        background: white;
        box-shadow: 0 0 18px 8px #cffafe, 0 0 65px 24px #38bdf8, 0 0 150px 54px #4f46e5;
        animation: coreCharge var(--warp-duration) cubic-bezier(.7,0,.2,1) both;
      }
      .warp-ship {
        position: absolute; z-index: 7; left: 50%; top: 50%; color: white;
        filter: drop-shadow(0 0 12px #67e8f9);
        animation: shipCommit var(--warp-duration) cubic-bezier(.55,0,.1,1) both;
      }
      .warp-flash {
        position: absolute; inset: 0; z-index: 20; background: white; opacity: 0;
        animation: jumpFlash var(--warp-duration) linear both;
      }
      .warp-caption {
        position: absolute; z-index: 12; left: 50%; bottom: max(9vh, 42px);
        transform: translateX(-50%); width: min(90vw, 520px); text-align: center;
        color: #cffafe; text-transform: uppercase; letter-spacing: .24em;
        font-size: clamp(10px, 1.8vw, 13px); font-weight: 900;
        text-shadow: 0 0 14px #0ea5e9;
        animation: captionPhase var(--warp-duration) ease both;
      }
      .warp-caption span { display:block; margin-top:6px; color:#94a3b8; font-size:9px; letter-spacing:.17em; }
      @keyframes warpScene { 0%{opacity:0} 5%,90%{opacity:1} 100%{opacity:0} }
      @keyframes nebulaCollapse {
        0%{transform:rotate(0) scale(1.25);opacity:.4}
        42%{transform:rotate(8deg) scale(.85);opacity:.95}
        58%{transform:rotate(12deg) scale(2.2);opacity:.55}
        100%{transform:rotate(18deg) scale(3);opacity:0}
      }
      @keyframes streakLaunch {
        0%,10%{transform:rotate(var(--angle)) translateX(var(--distance)) scaleX(.02);opacity:0}
        38%{opacity:var(--opacity)}
        63%{transform:rotate(var(--angle)) translateX(var(--distance)) scaleX(.18);opacity:var(--opacity)}
        100%{transform:rotate(var(--angle)) translateX(calc(var(--distance) + 26vmin)) scaleX(2.5);opacity:0}
      }
      @keyframes coreCharge {
        0%{transform:translate(-50%,-50%) scale(.08);opacity:0}
        38%{transform:translate(-50%,-50%) scale(.42);opacity:.9}
        58%{transform:translate(-50%,-50%) scale(1);opacity:1}
        72%{transform:translate(-50%,-50%) scale(7);opacity:.95}
        100%{transform:translate(-50%,-50%) scale(18);opacity:0}
      }
      @keyframes shipCommit {
        0%{transform:translate(-50%,42px) scale(1.15);opacity:0}
        20%,52%{transform:translate(-50%,-50%) scale(1);opacity:1}
        68%{transform:translate(-50%,-50%) scale(.2);opacity:1}
        72%,100%{transform:translate(-50%,-50%) scale(.01);opacity:0}
      }
      @keyframes warpRing {
        0%,42%{transform:translate(-50%,-50%) scale(.08);opacity:0}
        47%{opacity:1}
        100%{transform:translate(-50%,-50%) scale(10);opacity:0}
      }
      @keyframes jumpFlash { 0%,42%{opacity:0} 46%{opacity:.95} 53%{opacity:.08} 100%{opacity:0} }
      @keyframes captionPhase { 0%{opacity:0;transform:translate(-50%,8px)} 14%,45%{opacity:1;transform:translate(-50%,0)} 57%,100%{opacity:0;transform:translate(-50%,-6px)} }
      @media (prefers-reduced-motion: reduce) {
        .warp-streak,.warp-ring,.warp-nebula,.warp-core,.warp-ship { animation-duration:.01ms !important; }
        .warp-flash { display:none; }
      }
    `}</style>

    <div className="warp-nebula" />
    {STREAKS.map((streak, index) => (
      <i
        key={index}
        className="warp-streak"
        style={{
          '--angle': `${streak.angle}deg`,
          '--distance': `${streak.distance}px`,
          '--length': `${streak.length}px`,
          '--width': `${streak.width}px`,
          '--delay': `${streak.delay}s`,
          '--opacity': `${streak.opacity}`,
        } as WarpStyle}
      />
    ))}
    <div className="warp-core" />
    <div className="warp-ring" />
    <div className="warp-ring warp-ring--late" />
    <Rocket className="warp-ship h-12 w-12 sm:h-16 sm:w-16" aria-hidden="true" />
    <div className="warp-vignette" />
    <div className="warp-caption">
      {title}
      <span>{subtitle}</span>
    </div>
    <div className="warp-flash" />
  </div>
);
