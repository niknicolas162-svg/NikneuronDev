import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { useAppStore, CUBE_CATEGORIES } from '../../store/useAppStore';
import { createFaceCanvasTexture } from './faceTextures';
import { soundEngine } from '../../lib/audio';

// GLSL Vertex & Fragment Shaders from Spec Section 5.2
const plasmaVertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const plasmaFragmentShader = `
uniform float uTime;
uniform vec3 uColorCore;  // #e8fbff
uniform vec3 uColorRim;   // #4fd8ff
uniform vec3 uColorDeep;  // #0a3cff
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // 1. Fresnel Rim Glancing Calculation
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.2);

  // 2. Multi-Harmonic Simplex-Style Wave Turbulence
  float wave = sin(vPosition.x * 4.0 + uTime * 2.5) * cos(vPosition.y * 4.0 + uTime * 2.0);
  wave += sin(vPosition.z * 5.0 - uTime * 3.0) * 0.5;

  // 3. Three-Tier Chromatic Interpolation
  vec3 color = mix(uColorDeep, uColorRim, abs(wave));
  color = mix(color, uColorCore, fresnel * 0.85);

  gl_FragColor = vec4(color, 0.45 + fresnel * 0.4);
}
`;

// Face orientations matching BoxGeometry materials [+X, -X, +Y, -Y, +Z, -Z]
const FACE_EULERS: [number, number, number][] = [
  [0, -Math.PI / 2, 0], // Face 0: Web Tools (+X)
  [0, Math.PI / 2, 0],  // Face 1: Mobile Apps (-X)
  [Math.PI / 2, 0, 0],  // Face 2: Desktop & Linux (+Y)
  [-Math.PI / 2, 0, 0], // Face 3: Security & Dev (-Y)
  [0, 0, 0],            // Face 4: Hardware & IoT (+Z Front)
  [0, Math.PI, 0],      // Face 5: AI & Automation (-Z Back)
];

// Unit normal vector for each face in local coordinates
const FACE_NORMALS: THREE.Vector3[] = [
  new THREE.Vector3(1, 0, 0),  // Face 0: +X
  new THREE.Vector3(-1, 0, 0), // Face 1: -X
  new THREE.Vector3(0, 1, 0),  // Face 2: +Y
  new THREE.Vector3(0, -1, 0), // Face 3: -Y
  new THREE.Vector3(0, 0, 1),  // Face 4: +Z
  new THREE.Vector3(0, 0, -1), // Face 5: -Z
];

interface EnergyCubeGroupProps {
  isDragging: boolean;
  setIsDragging: (val: boolean) => void;
  pointerDelta: React.MutableRefObject<{ dx: number; dy: number }>;
  pointerPos: React.MutableRefObject<{ x: number; y: number }>;
  hasInteracted: React.MutableRefObject<boolean>;
  autoOrbit: boolean;
  zoomLevel: number;
  onFrontFaceChange: (index: number) => void;
  onRotationAnglesChange: (az: number, el: number) => void;
}

const EnergyCubeGroup: React.FC<EnergyCubeGroupProps> = ({
  isDragging,
  setIsDragging,
  pointerDelta,
  pointerPos,
  hasInteracted,
  autoOrbit,
  zoomLevel,
  onFrontFaceChange,
  onRotationAnglesChange,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const plasmaMeshRef = useRef<THREE.Mesh>(null);
  const latticeMeshRef = useRef<THREE.Mesh>(null);

  const targetQuaternion = useRef(new THREE.Quaternion());
  const currentQuaternion = useRef(new THREE.Quaternion());
  const isSlerpingToFace = useRef(true);

  const velocity = useRef({ x: 0, y: 0 });
  const lastFaceAnnounced = useRef<number>(-1);

  const frontFaceIndex = useAppStore((s) => s.frontFaceIndex);

  useEffect(() => {
    const euler = FACE_EULERS[frontFaceIndex] || [0, 0, 0];
    const e = new THREE.Euler(euler[0], euler[1], euler[2], 'XYZ');
    targetQuaternion.current.setFromEuler(e);
    isSlerpingToFace.current = true;
    velocity.current = { x: 0, y: 0 };
  }, [frontFaceIndex]);

  const plasmaUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorCore: { value: new THREE.Color('#e8fbff') },
      uColorRim: { value: new THREE.Color('#4fd8ff') },
      uColorDeep: { value: new THREE.Color('#0a3cff') },
    }),
    []
  );

  const materials = useMemo(() => {
    return [0, 1, 2, 3, 4, 5].map((idx) => {
      const texture = createFaceCanvasTexture(idx);
      return new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.92,
        side: THREE.FrontSide,
      });
    });
  }, []);

  const edgesGeometry = useMemo(() => {
    const boxGeo = new THREE.BoxGeometry(2.404, 2.404, 2.404);
    return new THREE.EdgesGeometry(boxGeo);
  }, []);

  const calculateFrontFacingIndex = useCallback(() => {
    let maxDot = -Infinity;
    let closestIndex = 0;
    const worldNormal = new THREE.Vector3();
    const cameraForward = new THREE.Vector3(0, 0, 1);

    for (let i = 0; i < 6; i++) {
      worldNormal.copy(FACE_NORMALS[i]).applyQuaternion(currentQuaternion.current);
      const dot = worldNormal.dot(cameraForward);
      if (dot > maxDot) {
        maxDot = dot;
        closestIndex = i;
      }
    }
    return closestIndex;
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (plasmaMeshRef.current) {
      plasmaUniforms.uTime.value = time;
    }

    if (latticeMeshRef.current) {
      latticeMeshRef.current.rotation.y = time * 0.4;
      latticeMeshRef.current.rotation.z = time * 0.25;
    }

    if (!groupRef.current) return;

    groupRef.current.position.y = Math.sin(time * 1.5) * 0.08;
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, zoomLevel, 0.1);

    if (isDragging) {
      isSlerpingToFace.current = false;
      const dx = pointerDelta.current.dx;
      const dy = pointerDelta.current.dy;

      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0.001) {
        const sensitivity = 0.007;
        const axis = new THREE.Vector3(dy, dx, 0).normalize();
        const deltaQ = new THREE.Quaternion().setFromAxisAngle(axis, dist * sensitivity);
        currentQuaternion.current.premultiply(deltaQ);

        velocity.current = { x: dx * 0.5, y: dy * 0.5 };

        const currentFront = calculateFrontFacingIndex();
        if (currentFront !== lastFaceAnnounced.current) {
          lastFaceAnnounced.current = currentFront;
          onFrontFaceChange(currentFront);
          soundEngine.playTone(600 + currentFront * 40, 0.02, 'sine', 0.02);
        }
      }

      pointerDelta.current = { dx: 0, dy: 0 };
      groupRef.current.quaternion.copy(currentQuaternion.current);
    } else if (autoOrbit) {
      isSlerpingToFace.current = false;
      const deltaQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), delta * 0.4);
      currentQuaternion.current.premultiply(deltaQ);
      groupRef.current.quaternion.copy(currentQuaternion.current);

      const currentFront = calculateFrontFacingIndex();
      if (currentFront !== lastFaceAnnounced.current) {
        lastFaceAnnounced.current = currentFront;
        onFrontFaceChange(currentFront);
      }
    } else {
      const speed = Math.sqrt(
        velocity.current.x * velocity.current.x + velocity.current.y * velocity.current.y
      );

      if (speed > 0.08) {
        const axis = new THREE.Vector3(velocity.current.y, velocity.current.x, 0).normalize();
        const deltaQ = new THREE.Quaternion().setFromAxisAngle(axis, speed * 0.007);
        currentQuaternion.current.premultiply(deltaQ);

        velocity.current.x *= 0.92;
        velocity.current.y *= 0.92;
        groupRef.current.quaternion.copy(currentQuaternion.current);

        const currentFront = calculateFrontFacingIndex();
        if (currentFront !== lastFaceAnnounced.current) {
          lastFaceAnnounced.current = currentFront;
          onFrontFaceChange(currentFront);
        }
      } else if (isSlerpingToFace.current) {
        const lambda = 7.5;
        const alpha = 1.0 - Math.exp(-lambda * Math.min(delta, 0.1));
        currentQuaternion.current.slerp(targetQuaternion.current, alpha);
        groupRef.current.quaternion.copy(currentQuaternion.current);
      } else {
        const targetTiltX = pointerPos.current.y * 0.12;
        const targetTiltY = pointerPos.current.x * 0.12;

        groupRef.current.rotation.x += (targetTiltX - groupRef.current.rotation.x) * 0.05;
        groupRef.current.rotation.y += (targetTiltY - groupRef.current.rotation.y) * 0.05;
      }
    }

    const euler = new THREE.Euler().setFromQuaternion(currentQuaternion.current);
    onRotationAnglesChange(
      Math.round(THREE.MathUtils.radToDeg(euler.y)),
      Math.round(THREE.MathUtils.radToDeg(euler.x))
    );
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    hasInteracted.current = true;
    setIsDragging(true);
    isSlerpingToFace.current = false;
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh ref={plasmaMeshRef}>
        <boxGeometry args={[1.7, 1.7, 1.7]} />
        <shaderMaterial
          vertexShader={plasmaVertexShader}
          fragmentShader={plasmaFragmentShader}
          uniforms={plasmaUniforms}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={latticeMeshRef}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshBasicMaterial
          color="#ff5aa5"
          wireframe={true}
          transparent={true}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh material={materials} onPointerDown={handlePointerDown}>
        <boxGeometry args={[2.4, 2.4, 2.4]} />
      </mesh>

      <lineSegments geometry={edgesGeometry}>
        <lineBasicMaterial
          color="#4fd8ff"
          linewidth={2}
          transparent={true}
          opacity={0.9}
        />
      </lineSegments>
    </group>
  );
};

const SpaceHalo: React.FC = () => {
  const haloTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
      grad.addColorStop(0, 'rgba(79, 216, 255, 0.45)');
      grad.addColorStop(0.35, 'rgba(10, 60, 255, 0.22)');
      grad.addColorStop(0.7, 'rgba(255, 90, 165, 0.08)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  return (
    <mesh position={[0, 0, -0.6]}>
      <planeGeometry args={[6.5, 6.5]} />
      <meshBasicMaterial
        map={haloTexture}
        transparent={true}
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
};

export const CubeScene: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [autoOrbit, setAutoOrbit] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(5.2);
  const [facingIndex, setFacingIndex] = useState(0);
  const [angles, setAngles] = useState({ az: 0, el: 0 });

  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pointerDelta = useRef<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const pointerPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasInteracted = useRef(false);
  const dragDistance = useRef(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const frontFaceIndex = useAppStore((s) => s.frontFaceIndex);
  const rotateToFace = useAppStore((s) => s.rotateToFace);

  const currentCategory = CUBE_CATEGORIES[facingIndex] || CUBE_CATEGORIES[frontFaceIndex];

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    hasInteracted.current = true;
    dragDistance.current = 0;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    soundEngine.playTone(500, 0.03, 'sine', 0.03);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      pointerPos.current = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -(((e.clientY - rect.top) / rect.height) * 2 - 1),
      };
    }

    if (!isDragging) return;

    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    dragDistance.current += Math.abs(dx) + Math.abs(dy);
    pointerDelta.current.dx += dx;
    pointerDelta.current.dy += dy;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);

    if (dragDistance.current < 6) {
      soundEngine.playSnapHolo();
      rotateToFace((frontFaceIndex + 1) % 6);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoomLevel((prev) => {
      const next = prev + (e.deltaY > 0 ? 0.3 : -0.3);
      return Math.min(Math.max(next, 3.6), 7.2);
    });
  };

  const toggleAutoOrbit = () => {
    soundEngine.playLaserShoot();
    setAutoOrbit(!autoOrbit);
  };

  const resetView = () => {
    soundEngine.playSnapHolo();
    rotateToFace(0);
    setZoomLevel(5.2);
    setAutoOrbit(false);
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative w-full h-[430px] sm:h-[500px] md:h-[580px] select-none touch-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      } ${className}`}
      title="Click and drag to rotate in full 3D. Scroll mouse wheel to zoom."
    >
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <pointLight position={[-4, -4, -2]} intensity={0.8} color="#ff5aa5" />

        <SpaceHalo />
        <EnergyCubeGroup
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          pointerDelta={pointerDelta}
          pointerPos={pointerPos}
          hasInteracted={hasInteracted}
          autoOrbit={autoOrbit}
          zoomLevel={zoomLevel}
          onFrontFaceChange={setFacingIndex}
          onRotationAnglesChange={(az, el) => setAngles({ az, el })}
        />
      </Canvas>

      {/* Top HUD Telemetry Pill */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-void-surface/90 border border-cyan-electric/40 backdrop-blur-xl shadow-cyan-glow-sm">
        <span
          className={`w-2 h-2 rounded-full ${
            isDragging
              ? 'bg-pink-accent animate-ping'
              : autoOrbit
              ? 'bg-green-400 animate-pulse'
              : 'bg-cyan-electric animate-pulse'
          }`}
        />
        <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-cyan-electric">
          {isDragging
            ? '3D SPATIAL ORBIT ACTIVE'
            : autoOrbit
            ? 'CINEMATIC AUTO-ORBIT'
            : 'ENERGY CUBE // DRAG TO ROTATE'}
        </span>
        <span className="text-[9px] font-mono text-text-dim border border-white/10 px-1 py-0.2 rounded">
          KEY [1-6]
        </span>
      </div>

      {/* Top-Right Telemetry HUD */}
      <div className="absolute top-4 right-4 pointer-events-none hidden sm:flex flex-col items-end gap-1 font-mono text-[10px] text-text-dim bg-void-surface/70 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <span className="text-white font-bold">NODE:</span>
          <span style={{ color: currentCategory.accentColor }}>
            {currentCategory.name.toUpperCase()} [0{currentCategory.index + 1}]
          </span>
        </div>
        <div className="text-[9px] text-text-dim">
          AZ: {angles.az}° | EL: {angles.el}° | ZOOM: {((5.2 / zoomLevel) * 100).toFixed(0)}%
        </div>
      </div>

      {/* Viewport Control Bar */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-void-surface/90 border border-white/15 p-1 rounded-2xl backdrop-blur-xl shadow-lg">
        <button
          type="button"
          onClick={toggleAutoOrbit}
          className={`p-2 rounded-xl text-xs transition-all cursor-pointer ${
            autoOrbit
              ? 'bg-cyan-electric/25 text-cyan-electric border border-cyan-electric/50 shadow-cyan-glow-sm'
              : 'text-text-dim hover:text-white hover:bg-white/10'
          }`}
          title={autoOrbit ? 'Stop Auto-Orbit' : 'Start Cinematic 360 Spin'}
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoOrbit ? 'animate-spin' : ''}`} />
        </button>

        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.max(z - 0.5, 3.6))}
          className="p-2 rounded-xl text-text-dim hover:text-white hover:bg-white/10 text-xs transition-all cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.min(z + 0.5, 7.2))}
          className="p-2 rounded-xl text-text-dim hover:text-white hover:bg-white/10 text-xs transition-all cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={resetView}
          className="p-2 rounded-xl text-text-dim hover:text-white hover:bg-white/10 text-xs transition-all cursor-pointer"
          title="Reset Cube Orientation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Corner Cyber Calipers */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-electric/30 pointer-events-none" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-electric/30 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-electric/30 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-electric/30 pointer-events-none" />
    </div>
  );
};
