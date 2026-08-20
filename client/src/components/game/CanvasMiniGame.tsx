import React, { useRef, useEffect, useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { Play, RotateCcw, Award, Sparkles, Volume2 } from 'lucide-react';
import { soundService } from '../../services/audio';

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
  const { addXP, addGems, user } = useGameStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  const playerPosRef = useRef({ x: 150, y: 380 });
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number>(0);

  const startMiniGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(30);
    starsRef.current = [];
    soundService.playClick();
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          setIsPlaying(false);
          soundService.playLevelUp();
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
      const earnedGems = Math.round(score / 10);
      addXP(earnedXp);
      if (earnedGems > 0) addGems(earnedGems);
    }
  }, [gameOver]);

  // Canvas Game Loop
  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.parentElement?.clientWidth || 340;
    canvas.height = 420;
    playerPosRef.current.x = canvas.width / 2;
    playerPosRef.current.y = canvas.height - 40;

    // Handle touch & mouse input
    const handleMove = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      playerPosRef.current.x = Math.max(30, Math.min(canvas.width - 30, relativeX));
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background stars gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(1, '#080c14');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spawn falling stars/obstacles
      if (frameCount % 40 === 0) {
        const isBad = Math.random() < 0.25;
        const colors = ['#fbbf24', '#f43f5e', '#8b5cf6', '#06b6d4', '#10b981'];
        const randomColor = isBad ? '#ef4444' : colors[Math.floor(Math.random() * colors.length)];
        const labels = isBad ? ['⚡ Quên học', '⚠️ Xung đột', '❌ Xem TV quá giờ'] : ['⭐ Tiết kiệm', '🌟 Thấu cảm', '✨ Tư duy', '🎯 Tự lập'];

        starsRef.current.push({
          x: Math.random() * (canvas.width - 60) + 30,
          y: -20,
          radius: isBad ? 16 : 14,
          speed: 2 + Math.random() * 2,
          color: randomColor,
          type: isBad ? 'bad' : 'good',
          label: labels[Math.floor(Math.random() * labels.length)],
        });
      }

      // Draw and update stars
      for (let i = starsRef.current.length - 1; i >= 0; i--) {
        const star = starsRef.current[i];
        star.y += star.speed;

        // Draw Star or Obstacle
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(star.label, star.x, star.y + star.radius + 12);

        // Collision check with player
        const dx = playerPosRef.current.x - star.x;
        const dy = playerPosRef.current.y - star.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < star.radius + 24) {
          if (star.type === 'good') {
            soundService.playCoin();
            setScore(s => s + 10);
          } else {
            soundService.playWrong();
            setScore(s => Math.max(0, s - 10));
          }
          starsRef.current.splice(i, 1);
          continue;
        }

        // Remove if off screen
        if (star.y > canvas.height + 30) {
          starsRef.current.splice(i, 1);
        }
      }

      // Draw Player Spaceship (Nova Rocket)
      const px = playerPosRef.current.x;
      const py = playerPosRef.current.y;

      ctx.save();
      ctx.translate(px, py);

      // Rocket Body
      ctx.fillStyle = '#6366f1';
      ctx.beginPath();
      ctx.moveTo(0, -22);
      ctx.lineTo(16, 16);
      ctx.lineTo(-16, 16);
      ctx.closePath();
      ctx.fill();

      // Rocket Cockpit
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();

      // Rocket Thruster Flame
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(-8, 16);
      ctx.lineTo(0, 24 + Math.sin(frameCount * 0.4) * 4);
      ctx.lineTo(8, 16);
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
  }, [isPlaying]);

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            <span>🎮</span> Thử Thách Phi Thuyền Nova (HTML5 Canvas)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Di chuyển phi thuyền nhặt sao kỹ năng tốt, né các thói quen xấu!
          </p>
        </div>
      </div>

      {/* Game Card Container */}
      <div className="relative rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl p-4 flex flex-col items-center">
        {/* HUD (Score & Time) */}
        <div className="w-full flex items-center justify-between px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-2xl mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-300">Điểm:</span>
            <span className="text-sm font-extrabold text-amber-400 font-mono">{score}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Thời gian:</span>
            <span className={`text-sm font-extrabold font-mono ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-cyan-300'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="w-full relative rounded-2xl overflow-hidden border border-slate-800 flex justify-center bg-slate-950">
          <canvas
            ref={canvasRef}
            className="touch-none cursor-pointer w-full max-w-sm h-[400px]"
          />

          {/* Start Screen Overlay */}
          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 bg-[#080c14]/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-3xl animate-bounce-slow">
                🚀
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">Sẵn Sàng Bay Vào Vũ Trụ?</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Chạm hoặc di chuột qua lại để điều khiển phi thuyền nhặt thật nhiều sao nhé!
                </p>
              </div>
              <button
                onClick={startMiniGame}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 btn-kid-3d"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Bắt đầu chơi ngay</span>
              </button>
            </div>
          )}

          {/* Game Over Modal */}
          {gameOver && (
            <div className="absolute inset-0 bg-[#080c14]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 animate-scaleUp">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl">
                🏆
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Hoàn Thành Thử Thách!</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Bé đã xuất sắc thu thập được <span className="font-bold text-amber-400">{score} điểm</span>.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl">
                <span className="text-xs font-bold text-amber-300">+{Math.round(score * 2)} XP</span>
                <span className="text-xs font-bold text-cyan-300">+{Math.round(score / 10)} 💎</span>
              </div>

              <button
                onClick={startMiniGame}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center gap-2 btn-kid-3d"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại ván mới</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
