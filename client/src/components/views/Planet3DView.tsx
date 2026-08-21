import React, { useState } from 'react';
import { SpaceCanvas } from '../3d/SpaceCanvas';
import { PlanetMesh } from '../3d/PlanetMesh';
import { Spaceship3D } from '../3d/Spaceship3D';
import { SpaceshipCockpitDashboard } from './SpaceshipCockpitDashboard';
import { PLANETS_DATA } from '../../data/planetsData';
import { useGameStore } from '../../stores/useGameStore';
import { PlanetCoordinateNode } from '../../types';
import { Compass, Sparkles, ChevronLeft, ChevronRight, Lock, Rocket, AlertTriangle } from 'lucide-react';
import { soundService } from '../../services/audio';

interface Props {
  onStartLesson: (nodeId: string) => void;
}

const PLANET_META: Record<string, {
  icon: string;
  shortName: string;
  accentColor: string;
  bgActive: string;
  glowShadow: string;
  borderActive: string;
}> = {
  bravery_prime: {
    icon: '🪐',
    shortName: 'Dũng Khí',
    accentColor: '#f59e0b',
    bgActive: 'bg-gradient-to-r from-amber-500/30 to-orange-500/30',
    glowShadow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]',
    borderActive: 'border-amber-400',
  },
  aqua_nova: {
    icon: '🌊',
    shortName: 'Đại Dương',
    accentColor: '#0ea5e9',
    bgActive: 'bg-gradient-to-r from-sky-500/30 to-cyan-500/30',
    glowShadow: 'shadow-[0_0_15px_rgba(14,165,233,0.5)]',
    borderActive: 'border-cyan-400',
  },
  storm_giant: {
    icon: '⚡',
    shortName: 'Bão Táp',
    accentColor: '#c084fc',
    bgActive: 'bg-gradient-to-r from-purple-500/30 to-pink-500/30',
    glowShadow: 'shadow-[0_0_15px_rgba(192,132,252,0.5)]',
    borderActive: 'border-purple-400',
  },
  frost_aegis: {
    icon: '❄️',
    shortName: 'Băng Giá',
    accentColor: '#38bdf8',
    bgActive: 'bg-gradient-to-r from-sky-500/30 to-teal-500/30',
    glowShadow: 'shadow-[0_0_15px_rgba(56,189,248,0.5)]',
    borderActive: 'border-sky-300',
  },
  magma_ignis: {
    icon: '🌋',
    shortName: 'Dung Nham',
    accentColor: '#ef4444',
    bgActive: 'bg-gradient-to-r from-rose-500/30 to-orange-500/30',
    glowShadow: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]',
    borderActive: 'border-rose-400',
  },
};

export const Planet3DView: React.FC<Props> = ({ onStartLesson }) => {
  const {
    activePlanetId,
    selectPlanet,
    isPlanetUnlocked,
    selectedCoordinateNode,
    startFlyingToCoordinate,
    finishFlyingToCoordinate,
    closeCoordinateModal,
  } = useGameStore();

  const [showModal, setShowModal] = useState(false);
  const [isWarping, setIsWarping] = useState(false);

  const currentPlanet = PLANETS_DATA.find((p) => p.id === activePlanetId) || PLANETS_DATA[0];
  const currentIndex = PLANETS_DATA.findIndex((p) => p.id === currentPlanet.id);
  const currentUnlocked = isPlanetUnlocked(currentPlanet.id);
  const currentMeta = PLANET_META[currentPlanet.id] || PLANET_META['bravery_prime'];

  const handleSwitchPlanet = (planetId: string) => {
    if (planetId === activePlanetId) return;

    soundService.playVictory();
    setIsWarping(true);
    setShowModal(false);
    closeCoordinateModal();
    selectPlanet(planetId);

    setTimeout(() => {
      setIsWarping(false);
    }, 600);
  };

  const handlePrevPlanet = () => {
    const prevIdx = (currentIndex - 1 + PLANETS_DATA.length) % PLANETS_DATA.length;
    handleSwitchPlanet(PLANETS_DATA[prevIdx].id);
  };

  const handleNextPlanet = () => {
    const nextIdx = (currentIndex + 1) % PLANETS_DATA.length;
    handleSwitchPlanet(PLANETS_DATA[nextIdx].id);
  };

  const handleSelectCoordinate = (node: PlanetCoordinateNode) => {
    // Hide any previous modal and trigger ship flight animation
    setShowModal(false);
    startFlyingToCoordinate(node);
  };

  const handleShipArrival = () => {
    finishFlyingToCoordinate();
    soundService.playVictory();
    // Reveal spaceship cockpit dashboard ONLY after ship has arrived
    setShowModal(true);
  };

  const handleLaunchLesson = (node: PlanetCoordinateNode) => {
    setShowModal(false);
    closeCoordinateModal();
    onStartLesson(node.id);
  };

  return (
    <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col bg-[#050814] select-none text-white animate-fadeIn">
      {/* 1. TOP 5-PLANET ORBITAL TRAVEL SELECTOR */}
      <div className="absolute top-2 inset-x-0 z-30 flex flex-col items-center px-2 sm:px-4 pointer-events-none gap-1.5">
        
        {/* Planet Navigation Pills Strip */}
        <div className="bg-slate-950/85 backdrop-blur-xl border border-sky-500/30 p-1.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex items-center gap-1 sm:gap-1.5 pointer-events-auto max-w-full overflow-x-auto scrollbar-none">
          {/* Previous Planet Quick Arrow */}
          <button
            type="button"
            data-testid="planet-nav-prev-btn"
            onClick={handlePrevPlanet}
            className="w-8 h-8 rounded-full bg-slate-900/90 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 active:scale-90 transition-all shrink-0"
            title="Tinh cầu trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* 5 Planet Navigation Buttons */}
          {PLANETS_DATA.map((planet) => {
            const isActive = planet.id === currentPlanet.id;
            const isUnlocked = isPlanetUnlocked(planet.id);
            const meta = PLANET_META[planet.id] || PLANET_META['bravery_prime'];

            return (
              <button
                key={planet.id}
                type="button"
                data-testid={`planet-nav-item-${planet.id}`}
                onClick={() => handleSwitchPlanet(planet.id)}
                className={`px-2.5 sm:px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-black transition-all shrink-0 active:scale-95 ${
                  isActive
                    ? `${meta.bgActive} border-2 ${meta.borderActive} text-white ${meta.glowShadow} scale-105`
                    : 'bg-slate-900/60 border border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-500'
                }`}
                title={`${planet.titleVi} (${isUnlocked ? 'Đã mở khóa' : 'Đang khóa - Có thể bay tới thám hiểm'})`}
              >
                <span className="text-sm sm:text-base">{meta.icon}</span>
                <span className="tracking-tight whitespace-nowrap text-[11px] sm:text-xs">
                  {meta.shortName}
                </span>

                {/* Status Indicator Icon */}
                {isUnlocked ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                ) : (
                  <Lock className="w-3 h-3 text-amber-400/90 shrink-0" />
                )}
              </button>
            );
          })}

          {/* Next Planet Quick Arrow */}
          <button
            type="button"
            data-testid="planet-nav-next-btn"
            onClick={handleNextPlanet}
            className="w-8 h-8 rounded-full bg-slate-900/90 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 active:scale-90 transition-all shrink-0"
            title="Tinh cầu tiếp theo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Planet Status & Info Sub-banner */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-slate-950/80 backdrop-blur-md border border-white/15 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-black flex items-center gap-2 shadow-md">
            <span style={{ color: currentMeta.accentColor }}>{currentMeta.icon}</span>
            <span className="text-white font-extrabold">{currentPlanet.titleVi}</span>
            
            <span className="text-slate-500">•</span>

            {/* Lock / Exploration Badge */}
            {currentUnlocked ? (
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Đang Khai Phá</span>
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1 font-bold" data-testid="planet-status-badge">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Chưa Mở Khóa • Thám Hiểm 3D</span>
              </span>
            )}
          </div>
        </div>

        {/* Unlock Requirement Hint for Locked Planets */}
        {!currentUnlocked && currentPlanet.unlockRequirement && (
          <div className="pointer-events-auto bg-amber-950/85 backdrop-blur-md border border-amber-500/50 px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold text-amber-200 flex items-center gap-1.5 shadow-lg max-w-sm text-center animate-fadeIn">
            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">{currentPlanet.unlockRequirement.descriptionVi}</span>
          </div>
        )}
      </div>

      {/* 2. 3D THREE.JS INTERACTIVE SPACE CANVAS */}
      <div className="flex-1 w-full h-full relative">
        <SpaceCanvas>
          <PlanetMesh
            key={currentPlanet.id}
            planet={currentPlanet}
            radius={1.0}
            onSelectNode={handleSelectCoordinate}
          />
          <Spaceship3D
            planetRadius={1.0}
            activeNode={selectedCoordinateNode}
            onArrival={handleShipArrival}
          />
        </SpaceCanvas>
      </div>

      {/* 3. WARP SPEED HYPER-JUMP COSMIC TRAVEL OVERLAY */}
      {isWarping && (
        <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center animate-fadeIn pointer-events-none">
          <div className="relative flex flex-col items-center">
            {/* Warp Light Streaks */}
            <div className="w-36 h-36 rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 blur-2xl opacity-60 animate-ping" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Rocket className="w-12 h-12 text-yellow-300 animate-bounce" />
            </div>
            <div className="mt-6 text-center">
              <p className="font-black text-sm sm:text-base text-yellow-300 tracking-wider flex items-center gap-2 justify-center">
                <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                <span>DU HÀNH KHÔNG GIAN...</span>
              </p>
              <p className="text-xs font-bold text-sky-200 mt-0.5">
                Đang tiến vào quỹ đạo {currentPlanet.titleVi}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. BOTTOM FLOATING EXPLORATION HINT */}
      {!showModal && (
        <div className="absolute bottom-4 inset-x-0 z-20 flex justify-center pointer-events-none px-4 transition-opacity">
          <div className="bg-slate-950/85 backdrop-blur-md border border-white/15 text-sky-200 text-[11px] sm:text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>
              {currentUnlocked
                ? 'Vuốt màn hình xoay 360° • Chạm tọa độ để phi thuyền bay tới'
                : '🔒 Tinh cầu đang khóa • Phi thuyền vẫn có thể bay tới thám hiểm 3D'}
            </span>
          </div>
        </div>
      )}

      {/* 5. SPACESHIP COCKPIT BOTTOM DASHBOARD */}
      {showModal && selectedCoordinateNode && (
        <SpaceshipCockpitDashboard
          node={selectedCoordinateNode}
          planet={currentPlanet}
          onStartLesson={handleLaunchLesson}
          onClose={() => {
            setShowModal(false);
            closeCoordinateModal();
          }}
        />
      )}
    </div>
  );
};
