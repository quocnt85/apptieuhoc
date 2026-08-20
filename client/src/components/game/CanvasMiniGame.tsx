import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Play, RotateCcw, Sparkles, ChevronLeft, ChevronRight, Sliders } from 'lucide-react';
import { interactionService } from '../../services/interaction';

interface Star {
  x: number;
  y: number;
  radius: number;
  speed: number;
  color: string;
  type: 'good' | 'bad';
  label: string;
}

export const CanvasMiniGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sliderBarRef = useRef<HTMLDivElement | null>(null);
  const { addXP, addGems } = useGameStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  const playerPosRef = useRef({ x: 170, y: 340 });
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number>(0);
  const isMovingLeftRef = useRef(false);
  const isMovingRightRef = useRef(false);

  const startMiniGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(30);
    starsRef.current = [];
    interactionService.playTap();
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          setIsPlaying(false);
          interactionService.playVictory();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, gameOver]);

  // Kết thúc game cộng thưởng
  useEffect(() => {
    if (gameOver && score > 0) {
      const earnedXp = Math.round(score * 2);
      const earnedGems = Math.max(1, Math.round(score / 10));
      addXP(earnedXp);
      addGems(earnedGems);
    }
  }, [gameOver]);

  // Handle Thumb Slider & D-Pad Move
  const updatePlayerX = useCallback((newX: number, canvasWidth: number) => {
    playerPosRef.current.x = Math.max(28, Math.min(canvasWidth - 28, newX));
  }, []);

  const handleSliderTouch = (clientX: number) => {
    if (!sliderBarRef.current || !canvasRef.current) return;
    const rect = sliderBarRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const canvas = canvasRef.current;
    const logicalWidth = canvas.clientWidth || 340;
    updatePlayerX(ratio * logicalWidth, logicalWidth);
  };

  // Canvas Game Loop with Retina DPI
  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = canvas.parentElement?.clientWidth || 340;
    const logicalHeight = 360;

    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;
    ctx.scale(dpr, dpr);

    playerPosRef.current.x = logicalWidth / 2;
    playerPosRef.current.y = logicalHeight - 36;

    // Handle Direct Touch & Mouse on Canvas (Optional direct touch)
    const handleMove = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      updatePlayerX(relativeX, logicalWidth);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    };

    const onMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('mousemove', onMouseMove);

    let frameCount = 0;

    const render = () => {
      frameCount++;

      // D-Pad smooth holding continuous move
      if (isMovingLeftRef.current) {
        updatePlayerX(playerPosRef.current.x - 7, logicalWidth);
      }
      if (isMovingRightRef.current) {
        updatePlayerX(playerPosRef.current.x + 7, logicalWidth);
      }

      ctx.clearRect(0, 0, logicalWidth, logicalHeight);

      // Background stars gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, logicalHeight);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(1, '#080c14');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, logicalWidth, logicalHeight);

      // Spawn falling stars / obstacles
      if (frameCount % 38 === 0) {
        const isBad = Math.random() < 0.28;
        const colors = ['#fbbf24', '#f43f5e', '#a855f7', '#06b6d4', '#10b981'];
        const randomColor = isBad ? '#ef4444' : colors[Math.floor(Math.random() * colors.length)];
        const labels = isBad 
          ? ['⚠️ Xem TV quá giờ', '❌ Bỏ bữa sáng', '⚡ Không rửa tay', '🛑 Xung đột'] 
          : ['⭐ Lễ phép', '🌟 Giúp đỡ', '✨ Tự lập', '🎯 Tiết kiệm', '💡 Tư duy'];

        starsRef.current.push({
          x: Math.random() * (logicalWidth - 60) + 30,
          y: -20,
          radius: isBad ? 16 : 15,
          speed: 2.2 + Math.random() * 1.8,
          color: randomColor,
          type: isBad ? 'bad' : 'good',
          label: labels[Math.floor(Math.random() * labels.length)],
        });
      }

      // Draw and update stars
      for (let i = starsRef.current.length - 1; i >= 0; i--) {
        const star = starsRef.current[i];
        star.y += star.speed;

        // Draw Star or Obstacle Circle
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(star.label, star.x, star.y + star.radius + 14);

        // Collision check with player
        const dx = playerPosRef.current.x - star.x;
        const dy = playerPosRef.current.y - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < star.radius + 24) {
          if (star.type === 'good') {
            interactionService.playCoin();
            setScore(s => s + 10);
          } else {
            interactionService.playError();
            setScore(s => Math.max(0, s - 10));
          }
          starsRef.current.splice(i, 1);
          continue;
        }

        // Remove if off screen
        if (star.y > logicalHeight + 30) {
          starsRef.current.splice(i, 1);
        }
      }

      // Draw Player Spaceship (Nova Rocket)
      const px = playerPosRef.current.x;
      const py = playerPosRef.current.y;

      ctx.save();
      ctx.translate(px, py);

      // Rocket Wings
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(-18, 12);
      ctx.lineTo(-24, 20);
      ctx.lineTo(-12, 18);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(18, 12);
      ctx.lineTo(24, 20);
      ctx.lineTo(12, 18);
      ctx.closePath();
      ctx.fill();

      // Rocket Body
      ctx.fillStyle = '#6366f1';
      ctx.beginPath();
      ctx.moveTo(0, -24);
      ctx.lineTo(16, 16);
      ctx.lineTo(-16, 16);
      ctx.closePath();
      ctx.fill();

      // Rocket Cockpit
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();

      // Rocket Thruster Flame
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(-7, 16);
      ctx.lineTo(0, 24 + Math.sin(frameCount * 0.45) * 5);
      ctx.lineTo(7, 16);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('mousemove', onMouseMove);
    };
  }, [isPlaying, updatePlayerX]);

  return (
    <div className="space-y-3 pb-8 animate-fadeIn flex flex-col items-center">
      {/* Header Title */}
      <div className="w-full text-center">
        <h2 className="text-lg sm:text-xl font-black text-white flex items-center justify-center gap-2">
          <span>🚀</span> Thử Thách Phi Thuyền Nova
        </h2>
        <p className="text-xs text-slate-300 mt-0.5">
          Dùng thanh trượt ngón cái bên dưới để nhặt sao tốt, né thói quen xấu!
        </p>
      </div>

      {/* Game Card Container */}
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-slate-800 overflow-hidden shadow-2xl p-3 flex flex-col items-center">
        
        {/* HUD (Score & Time) */}
        <div className="w-full flex items-center justify-between px-3 py-2 bg-slate-950/90 border border-slate-800 rounded-2xl mb-2.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-300">Điểm:</span>
            <span className="text-base font-black text-amber-400 font-mono">{score}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400">Thời gian:</span>
            <span className={`text-base font-black font-mono ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-cyan-300'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Canvas Display Viewport */}
        <div className="w-full relative rounded-2xl overflow-hidden border border-slate-800 flex justify-center bg-slate-950">
          <canvas
            ref={canvasRef}
            className="touch-none cursor-pointer w-full h-[360px]"
          />

          {/* Start Screen Overlay */}
          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 bg-[#080c14]/85 backdrop-blur-sm flex flex-col items-center justify-center p-5 text-center space-y-3.5">
              <div className="w-16 h-16 rounded-3xl bg-indigo-600/30 border border-indigo-400/50 flex items-center justify-center text-3xl animate-bounce-slow">
                🚀
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Sẵn Sàng Du Hành?</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xs leading-relaxed">
                  Lướt ngón cái trên thanh điều khiển bên dưới để phi thuyền né chướng ngại vật nhé!
                </p>
              </div>
              <button
                onClick={startMiniGame}
                className="w-full max-w-[220px] py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-sm shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all ns-btn-3d ns-btn-primary"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Bắt Đầu Bay!</span>
              </button>
            </div>
          )}

          {/* Game Over Modal */}
          {gameOver && (
            <div className="absolute inset-0 bg-[#080c14]/90 backdrop-blur-md flex flex-col items-center justify-center p-5 text-center space-y-3.5 animate-slide-up-fade">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl">
                🏆
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Hoàn Thành Xuất Sắc!</h3>
                <p className="text-xs font-bold text-slate-300 mt-1">
                  Bé đã thu thập được <span className="font-extrabold text-amber-400">{score} Điểm Sao</span>
                </p>
              </div>

              <div className="flex items-center gap-3 bg-slate-900 border-2 border-slate-700 px-4 py-2 rounded-2xl">
                <span className="text-xs font-black text-amber-300">+{Math.round(score * 2)} XP ⚡</span>
                <span className="text-xs font-black text-cyan-300">+{Math.max(1, Math.round(score / 10))} 💎</span>
              </div>

              <button
                onClick={startMiniGame}
                className="w-full max-w-[220px] py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all ns-btn-3d ns-btn-green"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi Lại Ván Mới</span>
              </button>
            </div>
          )}
        </div>

        {/* Dedicated Thumb Controller Zone (Never obscures the game canvas) */}
        {isPlaying && (
          <div className="w-full mt-3 space-y-2 select-none touch-none animate-fadeIn">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
              <span className="flex items-center gap-1">
                <Sliders className="w-3 h-3 text-indigo-400" />
                <span>VÙNG ĐIỀU KHIỂN NGÓN CÁI</span>
              </span>
              <span className="text-indigo-300">Kéo hoặc Bấm</span>
            </div>

            {/* Thumb Touch Slider Bar */}
            <div
              ref={sliderBarRef}
              onTouchStart={(e) => handleSliderTouch(e.touches[0].clientX)}
              onTouchMove={(e) => handleSliderTouch(e.touches[0].clientX)}
              onMouseDown={(e) => handleSliderTouch(e.clientX)}
              className="w-full h-12 bg-slate-950 border-2 border-indigo-500/50 rounded-2xl relative flex items-center px-2 cursor-pointer active:border-indigo-400 shadow-inner"
            >
              <div className="w-full h-2 bg-slate-800 rounded-full" />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 border-2 border-white shadow-lg flex items-center justify-center text-sm font-bold text-white pointer-events-none transition-all duration-75"
                style={{
                  left: `calc(${Math.min(100, Math.max(0, (playerPosRef.current.x / (canvasRef.current?.clientWidth || 340)) * 100))}% - 20px)`
                }}
              >
                🚀
              </div>
            </div>

            {/* Large D-Pad Touch Buttons (52px height for instant thumb response) */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onTouchStart={() => { isMovingLeftRef.current = true; interactionService.playSelect(); }}
                onTouchEnd={() => { isMovingLeftRef.current = false; }}
                onMouseDown={() => { isMovingLeftRef.current = true; interactionService.playSelect(); }}
                onMouseUp={() => { isMovingLeftRef.current = false; }}
                className="h-13 py-3 rounded-2xl bg-slate-800 border-2 border-slate-700 active:bg-indigo-600 active:border-indigo-400 text-white font-black text-sm flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <ChevronLeft className="w-5 h-5 text-indigo-400" />
                <span>Sang Trái</span>
              </button>

              <button
                onTouchStart={() => { isMovingRightRef.current = true; interactionService.playSelect(); }}
                onTouchEnd={() => { isMovingRightRef.current = false; }}
                onMouseDown={() => { isMovingRightRef.current = true; interactionService.playSelect(); }}
                onMouseUp={() => { isMovingRightRef.current = false; }}
                className="h-13 py-3 rounded-2xl bg-slate-800 border-2 border-slate-700 active:bg-indigo-600 active:border-indigo-400 text-white font-black text-sm flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <span>Sang Phải</span>
                <ChevronRight className="w-5 h-5 text-indigo-400" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

