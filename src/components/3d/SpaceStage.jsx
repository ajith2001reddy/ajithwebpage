'use client';
/**
 * SpaceStage.jsx  –  NASA-grade astronaut scene
 *
 * Features:
 *  • Real .glb astronaut model via useGLTF + auto-scale & NASA-white material override
 *  • useAnimations clip cross-fading  (walk / idle / float)
 *  • Physics-based P-controller movement with damping
 *  • Particle thruster flames  (additive blended Points, emits on 'fly')
 *  • Welding arc sparks        (additive blended Points, emits on 'repair')
 *  • Procedural wrench prop    (appears in hand during repair, fades in/out)
 *  • Dynamic point lights      (visor glow + thruster heat + weld arc)
 *  • Quadratic Bézier tether cable from anchor to astronaut
 *  • Slowly-tumbling debris field
 *  • AnimatePresence thought bubble with per-status fade transitions
 *  • Astronaut placeholder sphere while GLB is loading
 */

import React, {
  useRef, useState, useMemo, useEffect, Suspense, useCallback,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Stars, PerspectiveCamera, Html, useGLTF, useAnimations,
} from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════════════
   TETHER  –  safety cable from anchor to astronaut
═══════════════════════════════════════════════════════════════════════════ */
function Tether({ worldPosRef }) {
  const lineRef = useRef();
  const ANCHOR = useMemo(() => new THREE.Vector3(-14, 9, -4), []);
  const mid = useMemo(() => new THREE.Vector3(), []);
  const end = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!lineRef.current) return;
    end.set(worldPosRef.current.x, worldPosRef.current.y, 0);
    mid.set(
      (ANCHOR.x + end.x) * 0.5,
      (ANCHOR.y + end.y) * 0.5 + 1.8,
      (ANCHOR.z + end.z) * 0.5,
    );
    lineRef.current.geometry.setFromPoints(
      new THREE.QuadraticBezierCurve3(ANCHOR, mid, end).getPoints(60)
    );
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial color="#777777" transparent opacity={0.38} linewidth={1} />
    </line>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   THRUSTER PARTICLES  –  hot exhaust plumes when flying
═══════════════════════════════════════════════════════════════════════════ */
function ThrusterParticles({ active, localOffset }) {
  const ref = useRef();
  const N = 90;
  const ages = useRef(new Float32Array(N).map(() => Math.random()));
  const vels = useRef(new Float32Array(N * 3));

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(N * 3).fill(9999);
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  const mat = useMemo(() => new THREE.PointsMaterial({
    color: '#ffaa44',
    size: 0.042,
    transparent: true,
    opacity: 0.88,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.visible = active;
    if (!active) return;

    const pos = geo.attributes.position.array;
    const v = vels.current;
    const [ox, oy, oz] = localOffset;

    for (let i = 0; i < N; i++) {
      ages.current[i] -= dt * 3;
      if (ages.current[i] <= 0) {
        pos[i * 3] = ox + (Math.random() - 0.5) * 0.06;
        pos[i * 3 + 1] = oy;
        pos[i * 3 + 2] = oz + (Math.random() - 0.5) * 0.06;
        v[i * 3] = (Math.random() - 0.5) * 0.02;
        v[i * 3 + 1] = -(Math.random() * 0.07 + 0.03);
        v[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
        ages.current[i] = Math.random() * 0.35 + 0.15;
      }
      pos[i * 3] += v[i * 3];
      pos[i * 3 + 1] += v[i * 3 + 1];
      pos[i * 3 + 2] += v[i * 3 + 2];
    }
    geo.attributes.position.needsUpdate = true;
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   WELDING SPARKS  –  white-hot sparks during repair
═══════════════════════════════════════════════════════════════════════════ */
function WeldingSparks({ active }) {
  const ref = useRef();
  const N = 55;
  const ages = useRef(new Float32Array(N).map(() => Math.random()));
  const vels = useRef(new Float32Array(N * 3));

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(N * 3).fill(9999);
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  const mat = useMemo(() => new THREE.PointsMaterial({
    color: '#ffffff',
    size: 0.023,
    transparent: true,
    opacity: 0.95,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.visible = active;
    if (!active) return;

    const pos = geo.attributes.position.array;
    const v = vels.current;

    for (let i = 0; i < N; i++) {
      ages.current[i] -= dt * 5;
      if (ages.current[i] <= 0) {
        pos[i * 3] = 0.42 + (Math.random() - 0.5) * 0.04;
        pos[i * 3 + 1] = 0.25 + (Math.random() - 0.5) * 0.04;
        pos[i * 3 + 2] = 0.22;
        const a = Math.random() * Math.PI * 2;
        const s = Math.random() * 0.09 + 0.03;
        v[i * 3] = Math.cos(a) * s;
        v[i * 3 + 1] = Math.sin(a) * s * 0.5 + 0.03;
        v[i * 3 + 2] = Math.random() * 0.05;
        ages.current[i] = Math.random() * 0.2 + 0.08;
      }
      pos[i * 3] += v[i * 3] * 0.25;
      pos[i * 3 + 1] += v[i * 3 + 1] * 0.25 - 0.0015;
      pos[i * 3 + 2] += v[i * 3 + 2] * 0.25;
    }
    geo.attributes.position.needsUpdate = true;
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   WRENCH PROP  –  procedural hand-tool
═══════════════════════════════════════════════════════════════════════════ */
const WRENCH_MAT = new THREE.MeshStandardMaterial({
  color: '#8a8a8a', metalness: 0.92, roughness: 0.22,
});

function Wrench() {
  return (
    <group position={[0.42, 0.28, 0.18]} rotation={[0.4, 0, -0.5]}>
      <mesh material={WRENCH_MAT}>
        <cylinderGeometry args={[0.016, 0.019, 0.3, 8]} />
      </mesh>
      <mesh position={[0, 0.175, 0]} material={WRENCH_MAT}>
        <boxGeometry args={[0.072, 0.038, 0.02]} />
      </mesh>
      <mesh position={[0.018, 0.148, 0]} material={WRENCH_MAT}>
        <boxGeometry args={[0.04, 0.024, 0.018]} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ASTRONAUT GLB  –  main character
═══════════════════════════════════════════════════════════════════════════ */
function AstronautGLB({ hovered, setHovered }) {
  const groupRef = useRef();

  const { scene, animations } = useGLTF('/models/astronaut.glb');
  const { actions, names } = useAnimations(animations, groupRef);

  const worldPos = useRef(new THREE.Vector3(0, 0, 0));
  const targetPos = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const actionRef = useRef('walk');
  const boostRef = useRef(0);
  const lastClip = useRef(null);

  const [status, setStatus] = useState('👨‍🚀 On patrol...');
  const [isRepairing, setIsRepairing] = useState(false);
  const [isFlying, setIsFlying] = useState(false);

  /* ── NASA-white material override ──────────────────────────────────── */
  useEffect(() => {
    if (!scene) return;

    // Auto-scale to ~2.4 world units
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) scene.scale.setScalar(2.4 / maxDim);

    // Re-centre
    const box2 = new THREE.Box3().setFromObject(scene);
    const ctr = box2.getCenter(new THREE.Vector3());
    scene.position.set(-ctr.x, -box2.min.y, -ctr.z);

    scene.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = child.receiveShadow = true;
      const n = child.name.toLowerCase();

      if (/visor|glass|faceplate|lens|shield/.test(n)) {
        child.material = new THREE.MeshStandardMaterial({
          color: '#c8a020', metalness: 0.98, roughness: 0.02, envMapIntensity: 2.5,
        });
      } else if (/boot|shoe|foot/.test(n)) {
        child.material = new THREE.MeshStandardMaterial({
          color: '#d8d8d8', metalness: 0.08, roughness: 0.92,
        });
      } else if (/glove|hand|palm/.test(n)) {
        child.material = new THREE.MeshStandardMaterial({
          color: '#dedede', metalness: 0.05, roughness: 0.88,
        });
      } else if (/pack|backpack|mmu|plss|tank|thruster/.test(n)) {
        child.material = new THREE.MeshStandardMaterial({
          color: '#cccccc', metalness: 0.55, roughness: 0.52,
        });
      } else if (/badge|patch|label|insignia/.test(n)) {
        child.material = new THREE.MeshStandardMaterial({
          color: '#c8a020', emissive: '#906010', emissiveIntensity: 0.4,
          metalness: 0.7, roughness: 0.3,
        });
      } else {
        // Main EMU suit fabric – off-white, fabric-rough
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0.93, 0.93, 0.93),
          metalness: 0.0,
          roughness: 0.86,
        });
      }
    });
  }, [scene]);

  /* ── Clip crossfade ────────────────────────────────────────────────── */
  const playClip = useCallback((keywords, fade = 0.4) => {
    if (!names.length) return;
    const found =
      keywords.flatMap(kw => names.filter(n => n.toLowerCase().includes(kw))).find(Boolean)
      ?? names[0];

    if (found === lastClip.current) return;

    if (lastClip.current && actions[lastClip.current]) {
      actions[lastClip.current].fadeOut(fade);
    }
    if (actions[found]) {
      actions[found].reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(fade).play();
    }
    lastClip.current = found;
  }, [actions, names]);

  /* ── Events from Brain ──────────────────────────────────────────────── */
  useEffect(() => {
    const onAction = ({ detail }) => {
      const { action, target, status: s } = detail;
      if (action) {
        actionRef.current = action;
        setIsRepairing(action === 'repair');
        setIsFlying(action === 'fly');
      }
      if (target) targetPos.current = target;
      if (s) setStatus(s);
    };
    const onBoost = () => { boostRef.current = 1; };

    window.addEventListener('astronaut-autonomous-action', onAction);
    window.addEventListener('astro-boost', onBoost);
    return () => {
      window.removeEventListener('astronaut-autonomous-action', onAction);
      window.removeEventListener('astro-boost', onBoost);
    };
  }, []);

  /* ── Frame loop ─────────────────────────────────────────────────────── */
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) return;

    const action = actionRef.current;

    // Animation clip selection
    if (action === 'walk') playClip(['walk', 'run', 'move', 'locomotion']);
    if (action === 'repair') playClip(['idle', 'stand', 'repair', 'work']);
    if (action === 'fly') playClip(['fly', 'float', 'hover', 'idle', 'swim']);

    // Physics
    const txW = targetPos.current.x * 5;
    const tyW = targetPos.current.y * 3;
    vel.current.x += (txW - worldPos.current.x) * dt * 1.9;
    vel.current.y += (tyW - worldPos.current.y) * dt * 1.9;
    vel.current.x *= Math.pow(0.87, dt * 60);
    vel.current.y *= Math.pow(0.87, dt * 60);
    worldPos.current.x += vel.current.x;
    worldPos.current.y += vel.current.y;

    const breathe = Math.sin(t * 0.88) * 0.013;
    const lr = (cur, tgt, spd) => THREE.MathUtils.lerp(cur, tgt, dt * spd);

    if (action === 'fly') {
      const dp = t * 0.3;
      groupRef.current.position.set(
        worldPos.current.x,
        worldPos.current.y + Math.sin(dp) * 0.065 + Math.sin(dp * 1.7) * 0.022,
        0,
      );
      groupRef.current.rotation.z = lr(groupRef.current.rotation.z, Math.sin(dp * 0.6) * 0.035, 1.2);
      groupRef.current.rotation.x = lr(groupRef.current.rotation.x, -0.07, 2);
    } else if (action === 'repair') {
      groupRef.current.position.set(worldPos.current.x, worldPos.current.y + breathe, 0);
      groupRef.current.rotation.x = lr(groupRef.current.rotation.x, 0.06, 2);
      groupRef.current.rotation.z = lr(groupRef.current.rotation.z, 0, 3);
    } else {
      const bob = Math.abs(Math.sin(t * 2.05)) * 0.022;
      groupRef.current.position.set(worldPos.current.x, worldPos.current.y + bob + breathe, 0);
      groupRef.current.rotation.x = lr(groupRef.current.rotation.x, 0, 3);
      groupRef.current.rotation.z = lr(groupRef.current.rotation.z, 0, 4);
    }

    // Boost shimmy
    if (boostRef.current > 0) {
      groupRef.current.position.x += Math.sin(t * 22) * boostRef.current * 0.025;
      boostRef.current = Math.max(0, boostRef.current - dt * 2.8);
    }

    // Facing direction
    const spd = Math.hypot(vel.current.x, vel.current.y);
    if (spd > 0.005) {
      groupRef.current.rotation.y = lr(
        groupRef.current.rotation.y,
        vel.current.x > 0 ? Math.PI / 2 : -Math.PI / 2,
        5,
      );
    } else {
      groupRef.current.rotation.y = lr(
        groupRef.current.rotation.y,
        Math.sin(t * 0.21) * 0.11,
        1.5,
      );
    }

    // Hover scale
    const ts = hovered ? 0.34 : 0.3;
    groupRef.current.scale.setScalar(lr(groupRef.current.scale.x, ts, 10));
  });

  /* ── JSX ────────────────────────────────────────────────────────────── */
  return (
    <>
      <Tether worldPosRef={worldPos} />

      <group
        ref={groupRef}
        scale={0.3}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => { boostRef.current = 1; }}
      >
        {/* Dynamic lights */}
        <pointLight position={[0, 1.55, 0.35]} color="#3a7fff" intensity={hovered ? 1.4 : 0.7} distance={3.5} decay={2} />
        <pointLight position={[0, -0.7, -0.4]} color="#ff7b00" intensity={isFlying ? 2.2 : 0.18} distance={2.5} decay={2} />
        <pointLight position={[0.42, 0.28, 0.3]} color="#aaddff" intensity={isRepairing ? 1.8 : 0} distance={2} decay={2} />

        {/* Model */}
        <primitive object={scene} />

        {/* Tool */}
        {isRepairing && <Wrench />}

        {/* Particles */}
        <WeldingSparks active={isRepairing} />
        <ThrusterParticles active={isFlying} localOffset={[-0.13, -0.85, -0.38]} />
        <ThrusterParticles active={isFlying} localOffset={[0.13, -0.85, -0.38]} />

        {/* Thought bubble */}
        <Html position={[0, 3.0, 0]} center distanceFactor={13}>
          <AnimatePresence mode="wait">
            <motion.div
              key={status}
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -4 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              style={{
                padding: '7px 16px',
                borderRadius: '22px',
                background: 'rgba(255,255,255,0.91)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              <p style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#111',
                margin: 0,
                letterSpacing: '0.01em',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              }}>
                {status}
              </p>
            </motion.div>
          </AnimatePresence>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-2px' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.82)', marginBottom: 2 }} />
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.55)', marginBottom: 2 }} />
            <div style={{ width: 2, height: 2, borderRadius: '50%', background: 'rgba(255,255,255,0.35)' }} />
          </div>
        </Html>
      </group>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DEBRIS FIELD
═══════════════════════════════════════════════════════════════════════════ */
function DebrisField() {
  const debris = useMemo(() =>
    Array.from({ length: 16 }, (_, i) => ({
      pos: [(Math.random() - 0.5) * 22, (Math.random() - 0.5) * 16, (Math.random() - 0.5) * 9],
      size: Math.random() * 0.17 + 0.04,
      rspd: [(Math.random() - 0.5) * 0.005, (Math.random() - 0.5) * 0.004, (Math.random() - 0.5) * 0.003],
      col: i % 3 === 0 ? '#e4e4e4' : i % 3 === 1 ? '#1a6fdb' : '#5a5a5a',
    })),
    []);

  const refs = useRef([]);

  useFrame(() => {
    refs.current.forEach((m, i) => {
      if (!m) return;
      m.rotation.x += debris[i].rspd[0];
      m.rotation.y += debris[i].rspd[1];
      m.rotation.z += debris[i].rspd[2];
    });
  });

  return (
    <>
      {debris.map((d, i) => (
        <mesh key={i} ref={el => { refs.current[i] = el; }} position={d.pos}>
          <dodecahedronGeometry args={[d.size, 0]} />
          <meshStandardMaterial color={d.col} metalness={0.45} roughness={0.55} transparent opacity={0.46} />
        </mesh>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LOADING PLACEHOLDER
═══════════════════════════════════════════════════════════════════════════ */
function Placeholder() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.5;
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.35, 16, 16]} />
      <meshStandardMaterial color="#e0e0e0" metalness={0.3} roughness={0.7} transparent opacity={0.45} />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCENE ROOT
═══════════════════════════════════════════════════════════════════════════ */
export default function SpaceStage() {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        style={{ pointerEvents: 'auto' }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        shadows
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />

        {/* Scene lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[8, 12, 6]}
          intensity={2.2}
          color="#fff8f0"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-8, 5, 4]} color="#aaccff" intensity={0.85} distance={25} />
        <pointLight position={[0, -6, -8]} color="#334466" intensity={0.35} distance={20} />

        <Stars radius={100} depth={50} count={5500} factor={4} saturation={0.1} fade speed={0.6} />

        <Suspense fallback={<Placeholder />}>
          <AstronautGLB hovered={hovered} setHovered={setHovered} />
        </Suspense>

        <DebrisField />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/astronaut.glb');