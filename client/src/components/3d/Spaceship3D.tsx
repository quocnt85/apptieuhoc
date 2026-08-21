import React, { useRef, useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../stores/useGameStore';
import { PlanetCoordinateNode } from '../../types';
import { AerodynamicShipRenderer } from './ships/AerodynamicShips';
import { soundService } from '../../services/audio';

interface Props {
  planetRadius: number;
  activeNode: PlanetCoordinateNode | null;
  onArrival: () => void;
  planetGroupRef?: React.RefObject<THREE.Group | null>;
}

export const Spaceship3D: React.FC<Props> = ({
  planetRadius,
  activeNode,
  onArrival,
  planetGroupRef,
}) => {
  const { user, isFlyingToNode } = useGameStore();
  const shipGroupRef = useRef<THREE.Group>(null);
  const [thrustPower, setThrustPower] = useState<number>(0.3);
  const renderedThrustRef = useRef(0.3);

  const sfxStateRef = useRef<{
    cruisingPlayed: boolean;
    deceleratePlayed: boolean;
  }>({
    cruisingPlayed: false,
    deceleratePlayed: false,
  });

  const shipColor = user.customization?.equippedColor || '#38bdf8';

  // Base dimensions (Reduced by 30% for realistic planetary scale)
  const BASE_SCALE = 0.15;
  const SCALE_AMPLITUDE = 0.14; // Peaks at ~0.29 mid-flight near camera
  const HOVER_RADIUS_OFFSET = 0.22;

  // Animation state
  const animState = useRef<{
    hasLaunched: boolean;
    currentPos: THREE.Vector3;
    startPos: THREE.Vector3;
    targetPos: THREE.Vector3;
    progress: number;
    flightDuration: number;
    dockedQuaternion: THREE.Quaternion;
  }>({
    hasLaunched: false,
    currentPos: new THREE.Vector3(0, -3.5, 1.8),
    startPos: new THREE.Vector3(0, -3.5, 1.8),
    targetPos: new THREE.Vector3(0, -3.5, 1.8),
    progress: 1,
    flightDuration: 5.2,
    dockedQuaternion: new THREE.Quaternion(),
  });

  // Calculate target 3D Cartesian position on spherical surface
  const getCartesianForNode = (node: PlanetCoordinateNode, radiusOffset = HOVER_RADIUS_OFFSET) => {
    const r = planetRadius + radiusOffset;
    const phi = node.lat;
    const theta = node.lon;
    return new THREE.Vector3(
      r * Math.cos(phi) * Math.sin(theta),
      r * Math.sin(phi),
      r * Math.cos(phi) * Math.cos(theta)
    );
  };

  // Setup flight trajectory when a new node is selected
  useEffect(() => {
    let accelerationTimer: number | undefined;
    if (activeNode && isFlyingToNode) {
      const target = getCartesianForNode(activeNode, HOVER_RADIUS_OFFSET);
      animState.current.targetPos.copy(target);

      // Reset flight SFX triggers
      sfxStateRef.current = {
        cruisingPlayed: false,
        deceleratePlayed: false,
      };

      // SFX 1 & 2: Khởi động động cơ & Phụt tăng tốc bứt phá quỹ đạo
      soundService.stopShipEngine(0.08);
      soundService.playEngineStart();
      accelerationTimer = window.setTimeout(() => {
        soundService.startShipEngine(0.18);
        soundService.playShipAccelerate();
      }, 380);

      // Compute level parallel docking quaternion (tangent to sphere surface)
      const surfaceNormal = target.clone().normalize();
      let tangent = new THREE.Vector3(0, 1, 0).cross(surfaceNormal).normalize();
      if (tangent.lengthSq() < 0.01) {
        tangent = new THREE.Vector3(1, 0, 0).cross(surfaceNormal).normalize();
      }
      const dockMatrix = new THREE.Matrix4();
      dockMatrix.lookAt(target, target.clone().add(tangent), surfaceNormal);
      animState.current.dockedQuaternion.setFromRotationMatrix(dockMatrix);

      if (!animState.current.hasLaunched) {
        // First launch: enter smoothly from bottom of screen
        const bottomWorldPos = new THREE.Vector3(0, -3.5, 1.8);
        if (planetGroupRef?.current) {
          const localStart = planetGroupRef.current.worldToLocal(bottomWorldPos.clone());
          animState.current.startPos.copy(localStart);
          animState.current.currentPos.copy(localStart);
        } else {
          animState.current.startPos.copy(bottomWorldPos);
          animState.current.currentPos.copy(bottomWorldPos);
        }
        animState.current.hasLaunched = true;
        animState.current.flightDuration = 5.2;
      } else {
        // Subsequent flights: launch from current parked position
        animState.current.startPos.copy(animState.current.currentPos);
        const v0 = animState.current.startPos.clone().normalize();
        const v1 = target.clone().normalize();
        const angle = Math.acos(THREE.MathUtils.clamp(v0.dot(v1), -1, 1));
        // Generous flight duration so students can enjoy the space journey
        const duration = 4.8 + (angle / Math.PI) * 2.2;
        animState.current.flightDuration = Math.max(4.6, Math.min(7.0, duration));
      }

      animState.current.progress = 0;
      setThrustPower(1.0);
    }
    return () => {
      if (accelerationTimer !== undefined) window.clearTimeout(accelerationTimer);
    };
  }, [activeNode, isFlyingToNode, planetRadius, planetGroupRef]);

  useEffect(() => () => soundService.stopShipEngine(0.2), []);

  useFrame((state, delta) => {
    if (!shipGroupRef.current) return;

    // If never launched and no active node, hide ship below screen
    if (!animState.current.hasLaunched && !activeNode) {
      shipGroupRef.current.visible = false;
      return;
    }
    shipGroupRef.current.visible = true;

    // Flight Interpolation with Spherical Slerp (100% Around Planet, never clipping through core)
    if (animState.current.progress < 1) {
      const step = delta / animState.current.flightDuration;
      animState.current.progress = Math.min(1, animState.current.progress + step);
      const t = animState.current.progress;

      // One continuous engine follows the same energy curve as the animation.
      // This removes audible gaps between the old one-shot SFX phases.
      const accelerate = THREE.MathUtils.smoothstep(t, 0.02, 0.22);
      const brake = 1 - THREE.MathUtils.smoothstep(t, 0.68, 0.98);
      const enginePower = 0.16 + 0.84 * accelerate * brake;
      soundService.setShipEnginePower(enginePower);
      if (Math.abs(enginePower - renderedThrustRef.current) > 0.06) {
        renderedThrustRef.current = enginePower;
        setThrustPower(enginePower);
      }

      // SFX 3: Tiếng di chuyển / du hành quỹ đạo (ở giữa chuyến bay t ~ 0.38)
      if (t > 0.35 && !sfxStateRef.current.cruisingPlayed) {
        sfxStateRef.current.cruisingPlayed = true;
        soundService.playShipCruising();
      }

      // SFX 4: Tiếng hãm phanh retro-rockets giảm tốc tiếp cận (t > 0.70)
      if (t > 0.70 && !sfxStateRef.current.deceleratePlayed) {
        sfxStateRef.current.deceleratePlayed = true;
        soundService.playShipDecelerate();
      }

      // Smoothstep ease-in-out curve
      const smoothT = t * t * (3 - 2 * t);

      // Spherical Slerp calculation between start and target vectors
      const v0 = animState.current.startPos.clone().normalize();
      const v1 = animState.current.targetPos.clone().normalize();
      const dotVal = THREE.MathUtils.clamp(v0.dot(v1), -1, 1);
      const omega = Math.acos(dotVal);

      let unitDir: THREE.Vector3;
      if (omega < 0.001) {
        unitDir = v0.clone();
      } else {
        const sinOmega = Math.sin(omega);
        unitDir = v0
          .clone()
          .multiplyScalar(Math.sin((1 - smoothT) * omega) / sinOmega)
          .add(v1.clone().multiplyScalar(Math.sin(smoothT * omega) / sinOmega))
          .normalize();
      }

      // Orbital Altitude Arc (Rises high above terrain, peaks at mid-flight t = 0.5)
      const r0 = animState.current.startPos.length();
      const r1 = animState.current.targetPos.length();
      const baseRadius = THREE.MathUtils.lerp(r0, r1, smoothT);
      const arcHeight = Math.sin(smoothT * Math.PI) * 0.75;
      const currentRadius = baseRadius + arcHeight;
      const currentPos = unitDir.clone().multiplyScalar(currentRadius);

      // Next point for computing forward orientation tangent
      const nextT = Math.min(1, t + 0.02);
      const nextSmooth = nextT * nextT * (3 - 2 * nextT);
      let nextUnitDir: THREE.Vector3;
      if (omega < 0.001) {
        nextUnitDir = v0.clone();
      } else {
        const sinOmega = Math.sin(omega);
        nextUnitDir = v0
          .clone()
          .multiplyScalar(Math.sin((1 - nextSmooth) * omega) / sinOmega)
          .add(v1.clone().multiplyScalar(Math.sin(nextSmooth * omega) / sinOmega))
          .normalize();
      }
      const nextRadius = THREE.MathUtils.lerp(r0, r1, nextSmooth) + Math.sin(nextSmooth * Math.PI) * 0.75;
      const nextPos = nextUnitDir.multiplyScalar(nextRadius);

      const flightDirection = nextPos.clone().sub(currentPos).normalize();
      const upNormal = unitDir.clone();

      // Dynamic Flight Orientation Matrix
      if (flightDirection.lengthSq() > 0.0001) {
        const flightMatrix = new THREE.Matrix4();
        flightMatrix.lookAt(currentPos, currentPos.clone().add(flightDirection), upNormal);
        const flightQuat = new THREE.Quaternion().setFromRotationMatrix(flightMatrix);

        // Smoothly blend into parallel docking orientation upon final approach (t: 0.68 -> 1.0)
        if (t > 0.68) {
          const blend = (t - 0.68) / 0.32;
          const smoothBlend = blend * blend * (3 - 2 * blend);
          flightQuat.slerp(animState.current.dockedQuaternion, smoothBlend);
        }

        shipGroupRef.current.quaternion.copy(flightQuat);
      }

      // Dynamic Scale: Increases up to ~0.29 near camera mid-flight, shrinks back to 0.15 on landing
      const currentScale = BASE_SCALE + Math.sin(smoothT * Math.PI) * SCALE_AMPLITUDE;
      shipGroupRef.current.scale.set(currentScale, currentScale, currentScale);

      animState.current.currentPos.copy(currentPos);
      shipGroupRef.current.position.copy(currentPos);

      // Check arrival
      if (t >= 1) {
        renderedThrustRef.current = 0.3;
        setThrustPower(0.3);
        soundService.stopShipEngine(0.7);
        onArrival();
      }
    } else {
      // Idle Hovering Animation when parked at coordinates (Base scale: 0.15)
      const time = state.clock.elapsedTime;
      const hoverOffset = Math.sin(time * 2.0) * 0.012;
      const surfaceNormal = animState.current.targetPos.clone().normalize();
      const dockedPos = animState.current.targetPos.clone().addScaledVector(surfaceNormal, hoverOffset);

      shipGroupRef.current.scale.set(BASE_SCALE, BASE_SCALE, BASE_SCALE);
      shipGroupRef.current.position.copy(dockedPos);
      shipGroupRef.current.quaternion.copy(animState.current.dockedQuaternion);
    }
  });

  return (
    <group ref={shipGroupRef} scale={[BASE_SCALE, BASE_SCALE, BASE_SCALE]}>
      <AerodynamicShipRenderer
        shipId={user.customization?.equippedShip || 'explorer_v1'}
        shipColor={shipColor}
        showStreamlines={false}
        thrustPower={thrustPower}
      />
    </group>
  );
};
