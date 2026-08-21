import React, { useState } from 'react';
import { SpaceCanvas } from '../3d/SpaceCanvas';
import { PlanetMesh } from '../3d/PlanetMesh';
import { Spaceship3D } from '../3d/Spaceship3D';
import { SpaceshipCockpitDashboard } from './SpaceshipCockpitDashboard';
import { PLANETS_DATA } from '../../data/planetsData';
import { useGameStore } from '../../stores/useGameStore';
import { PlanetCoordinateNode } from '../../types';
import { Compass, Sparkles, ChevronRight, Lock } from 'lucide-react';
import { soundService } from '../../services/audio';

interface Props {
  onStartLesson: (nodeId: string) => void;
}

export const Planet3DView: React.FC<Props> = ({ onStartLesson }) => {
  const {
    activePlanetId,
    selectedCoordinateNode,
    startFlyingToCoordinate,
    finishFlyingToCoordinate,
    closeCoordinateModal,
    user,
  } = useGameStore();

  const [showModal, setShowModal] = useState(false);
  const currentPlanet = PLANETS_DATA.find((p) => p.id === activePlanetId) || PLANETS_DATA[0];

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
      {/* Top Planet Title Header Banner */}
      <div className="absolute top-3 inset-x-0 z-20 flex justify-center pointer-events-none px-4">
        <div className="bg-slate-950/80 backdrop-blur-xl border border-sky-400/50 text-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-[0_4px_20px_rgba(56,189,248,0.25)] flex items-center gap-2 pointer-events-auto">
          <span className="text-base">🪐</span>
          <span>{currentPlanet.titleVi}</span>
          <span className="text-slate-400 text-xs">({currentPlanet.name})</span>
        </div>
      </div>

      {/* 3D Three.js Interactive Space Canvas */}
      <div className="flex-1 w-full h-full relative">
        <SpaceCanvas>
          <PlanetMesh
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

      {/* Bottom Floating Exploration Hint */}
      {!showModal && (
        <div className="absolute bottom-4 inset-x-0 z-20 flex justify-center pointer-events-none px-4 transition-opacity">
          <div className="bg-slate-950/85 backdrop-blur-md border border-white/15 text-sky-200 text-[11px] sm:text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Vuốt màn hình xoay 360° • Chạm tọa độ để phi thuyền bay tới</span>
          </div>
        </div>
      )}

      {/* Spaceship Cockpit Bottom Dashboard */}
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
