'use client';
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Safety tether from anchor point to astronaut
const Tether = ({ start, end }) => {
  const lineRef = useRef();
  const v1 = useMemo(() => new THREE.Vector3(), []);
  const v2 = useMemo(() => new THREE.Vector3(), []);
  const v3 = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!lineRef.current) return;
    v1.set(...start);
    v2.set(
      (start[0] + end.x) / 2,
      (start[1] + end.y) / 2 + 1.2,
      (start[2] + end.z) / 2
    );
    v3.set(end.x, end.y, end.z);
    const curve = new THREE.QuadraticBezierCurve3(v1, v2, v3);
    lineRef.current.geometry.setFromPoints(curve.getPoints(50));
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial color="#545456" linewidth={1} transparent opacity={0.5} />
    </line>
  );
};

// ─── ASTRONAUT ────────────────────────────────────────────────────────────────
const AnimatedAstronaut = ({ hovered, setHovered }) => {
  const groupRef = useRef();
  const bodyRef = useRef();
  const headRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();

  // Physics refs – never cause React re-renders
  const posRef = useRef(new THREE.Vector3(0, 0, 0));
  const targetPosRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ x: 0, y: 0 });
  const actionRef = useRef('walk');
  const boostRef = useRef(0);

  // Status text shown in thought bubble (minimal re-renders)
  const [status, setStatus] = useState('👨‍🚀 On patrol...');

  // ── Geometry & Materials (memoised – never re-created) ─────────────────────
  const geo = useMemo(() => ({
    body: new THREE.CapsuleGeometry(0.3, 1, 4, 8),
    head: new THREE.SphereGeometry(0.35, 32, 32),
    visor: new THREE.SphereGeometry(0.21, 32, 32),
    limb: new THREE.CapsuleGeometry(0.13, 0.6, 4, 8),
    hand: new THREE.SphereGeometry(0.13, 16, 16),
    boot: new THREE.BoxGeometry(0.22, 0.18, 0.28),
    jetpack: new THREE.BoxGeometry(0.35, 0.7, 0.22),
    thruster: new THREE.SphereGeometry(0.11, 16, 16),
  }), []);

  const mat = useMemo(() => ({
    suit: new THREE.MeshStandardMaterial({ color: '#e8e8e8', metalness: 0.3, roughness: 0.8 }),
    helmet: new THREE.MeshStandardMaterial({ color: '#d4d4d4', metalness: 0.6, roughness: 0.4 }),
    visor: new THREE.MeshStandardMaterial({ color: '#001a4d', emissive: '#0071E3', emissiveIntensity: 0.6, transparent: true, opacity: 0.85 }),
    glove: new THREE.MeshStandardMaterial({ color: '#e5a700', metalness: 0.5, roughness: 0.6 }),
    boot: new THREE.MeshStandardMaterial({ color: '#1a1a1a', metalness: 0.7, roughness: 0.3 }),
    jetpack: new THREE.MeshStandardMaterial({ color: '#2a2a2a', metalness: 0.6, roughness: 0.5 }),
    thruster: new THREE.MeshStandardMaterial({ color: '#ff6b35', emissive: '#ff4500', emissiveIntensity: 0.7 }),
  }), []);

  // ── Event listeners ──────────────────────────────────────────────────────
  useEffect(() => {
    const onAutonomous = (e) => {
      const { action, target, status: s } = e.detail;
      if (action) actionRef.current = action;
      if (target) targetPosRef.current = target;
      if (s) setStatus(s);
    };
    const onBoost = () => { boostRef.current = 1; };

    window.addEventListener('astronaut-autonomous-action', onAutonomous);
    window.addEventListener('astro-boost', onBoost);
    return () => {
      window.removeEventListener('astronaut-autonomous-action', onAutonomous);
      window.removeEventListener('astro-boost', onBoost);
    };
  }, []);

  // ── Frame loop ────────────────────────────────────────────────────────────
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) return;

    // Clamp delta so a tab-switch doesn't cause a huge jump
    const dt = Math.min(delta, 0.05);

    // ── 1. SMOOTH POSITIONAL MOVEMENT ──────────────────────────────────────
    const txWorld = targetPosRef.current.x * 5;
    const tyWorld = targetPosRef.current.y * 3;

    velRef.current.x += (txWorld - posRef.current.x) * dt * 1.8;
    velRef.current.y += (tyWorld - posRef.current.y) * dt * 1.8;
    velRef.current.x *= Math.pow(0.90, dt * 60);
    velRef.current.y *= Math.pow(0.90, dt * 60);
    posRef.current.x += velRef.current.x;
    posRef.current.y += velRef.current.y;

    // ── 2. BASE LAYER: breathing (always present, barely visible) ──────────
    const breathe = Math.sin(t * 0.9) * 0.012;   // ~54 breaths/min – realistic

    // ── 3. ACTION ANIMATIONS ───────────────────────────────────────────────
    const action = actionRef.current;

    // Shorthand lerp helper
    const lr = (cur, tgt, spd) =>
      THREE.MathUtils.lerp(cur, tgt, dt * spd);

    if (action === 'walk') {
      // ── REALISTIC BIPEDAL WALK ────────────────────────────────────────
      // Use X-axis rotation so limbs swing FORWARD/BACKWARD (depth-wise)
      const walkHz = 2.0;   // comfortable pace
      const phase = t * walkHz;

      // Legs: alternate forward/back like a real stride
      leftLegRef.current.rotation.x = lr(leftLegRef.current.rotation.x, Math.sin(phase) * 0.38, 14);
      rightLegRef.current.rotation.x = lr(rightLegRef.current.rotation.x, -Math.sin(phase) * 0.38, 14);
      leftLegRef.current.rotation.z = lr(leftLegRef.current.rotation.z, 0, 5);
      rightLegRef.current.rotation.z = lr(rightLegRef.current.rotation.z, 0, 5);

      // Arms swing opposite to same-side leg
      leftArmRef.current.rotation.x = lr(leftArmRef.current.rotation.x, -Math.sin(phase) * 0.28, 12);
      rightArmRef.current.rotation.x = lr(rightArmRef.current.rotation.x, Math.sin(phase) * 0.28, 12);
      // Arms hang close to body
      leftArmRef.current.rotation.z = lr(leftArmRef.current.rotation.z, 0.08, 5);
      rightArmRef.current.rotation.z = lr(rightArmRef.current.rotation.z, -0.08, 5);

      // Torso: very slight hip sway + gentle forward lean
      bodyRef.current.rotation.x = lr(bodyRef.current.rotation.x, 0.06, 4);
      bodyRef.current.rotation.z = Math.sin(phase) * 0.025;  // hip sway
      // Micro-rise on each footfall (CG rises as leg straightens)
      bodyRef.current.position.y = 0.2 + Math.abs(Math.sin(phase)) * 0.025 + breathe;

      // Head stays level, very slight bob
      headRef.current.rotation.x = lr(headRef.current.rotation.x, 0.05, 3);
      headRef.current.rotation.y = lr(headRef.current.rotation.y, Math.sin(t * 0.4) * 0.07, 2);
      headRef.current.position.y = 1 + breathe * 0.6;

      groupRef.current.rotation.x = lr(groupRef.current.rotation.x, 0, 4);

    } else if (action === 'repair') {
      // ── MULTI-PHASE MECHANIC REPAIR ───────────────────────────────────
      // Full realistic cycle: approach → examine → wrench work → inspect → wipe → back to work
      const CYCLE = 16;   // seconds for one full repair loop
      const ct = t % CYCLE;

      // PHASE 0 (0–2.5s): Walk up, crouch slightly, lean in to examine
      if (ct < 2.5) {
        bodyRef.current.rotation.x = lr(bodyRef.current.rotation.x, 0.42, 3);
        bodyRef.current.rotation.z = lr(bodyRef.current.rotation.z, 0, 5);
        bodyRef.current.position.y = lr(bodyRef.current.position.y, -0.15 + breathe, 3);

        // Right hand reaches forward-down to the component
        rightArmRef.current.rotation.x = lr(rightArmRef.current.rotation.x, -1.1, 3);
        rightArmRef.current.rotation.z = lr(rightArmRef.current.rotation.z, -0.2, 3);
        // Left hand braces on knee / hovers near
        leftArmRef.current.rotation.x = lr(leftArmRef.current.rotation.x, 0.2, 3);
        leftArmRef.current.rotation.z = lr(leftArmRef.current.rotation.z, 0.25, 3);

        // Head down, looking at the repair site
        headRef.current.rotation.x = lr(headRef.current.rotation.x, 0.58, 3);
        headRef.current.rotation.y = lr(headRef.current.rotation.y, 0, 3);
        headRef.current.position.y = 1 + breathe;

        // Legs slightly spread for stable stance
        leftLegRef.current.rotation.x = lr(leftLegRef.current.rotation.x, 0.12, 3);
        rightLegRef.current.rotation.x = lr(rightLegRef.current.rotation.x, -0.12, 3);
        leftLegRef.current.rotation.z = lr(leftLegRef.current.rotation.z, 0.08, 3);
        rightLegRef.current.rotation.z = lr(rightLegRef.current.rotation.z, 0.08, 3);

        groupRef.current.rotation.x = lr(groupRef.current.rotation.x, 0.1, 2);

        // PHASE 1 (2.5–8s): Active wrench / tool work
        // Right arm makes small precise turning motions (like tightening bolts)
      } else if (ct < 8) {
        const wp = (ct - 2.5) * 3.5;  // local work phase

        bodyRef.current.rotation.x = lr(bodyRef.current.rotation.x, 0.45, 2);
        bodyRef.current.position.y = lr(bodyRef.current.position.y, -0.15 + breathe, 3);
        // Very slight body push as force applied
        bodyRef.current.rotation.z = Math.sin(wp * 2.1) * 0.018;

        // Right arm: small tight oscillation – like turning a bolt with a wrench
        const boltTurn = Math.sin(wp * 2.8) * 0.12;
        const boltPush = Math.sin(wp * 1.4) * 0.06;
        rightArmRef.current.rotation.x = lr(rightArmRef.current.rotation.x, -1.2 + boltPush, 10);
        rightArmRef.current.rotation.z = lr(rightArmRef.current.rotation.z, -0.18 + boltTurn, 10);

        // Left arm holds steady / braces – slight micro-tremor from force
        leftArmRef.current.rotation.x = lr(leftArmRef.current.rotation.x, -0.75 + Math.sin(wp * 4) * 0.03, 7);
        leftArmRef.current.rotation.z = lr(leftArmRef.current.rotation.z, 0.38, 4);

        // Head mostly down, small look-up check every few seconds
        const headLook = Math.max(0, Math.sin(wp * 0.6) * 0.18);
        headRef.current.rotation.x = lr(headRef.current.rotation.x, 0.42 - headLook, 2);
        headRef.current.rotation.y = lr(headRef.current.rotation.y, 0, 2);
        headRef.current.position.y = 1 + breathe;

        groupRef.current.rotation.x = lr(groupRef.current.rotation.x, 0.12, 2);

        // PHASE 2 (8–11s): Stand back up, inspect the work
      } else if (ct < 11) {
        const ip = ct - 8;  // 0→3

        bodyRef.current.rotation.x = lr(bodyRef.current.rotation.x, 0.02, 2);
        bodyRef.current.rotation.z = lr(bodyRef.current.rotation.z, 0, 4);
        bodyRef.current.position.y = lr(bodyRef.current.position.y, 0.2 + breathe, 3);

        // Arms drop naturally to sides – like a mechanic stepping back
        rightArmRef.current.rotation.x = lr(rightArmRef.current.rotation.x, 0.05, 2);
        rightArmRef.current.rotation.z = lr(rightArmRef.current.rotation.z, -0.22, 2);
        leftArmRef.current.rotation.x = lr(leftArmRef.current.rotation.x, 0.05, 2);
        leftArmRef.current.rotation.z = lr(leftArmRef.current.rotation.z, 0.22, 2);

        // Head tilts and slowly turns left-right – visually inspecting
        headRef.current.rotation.x = lr(headRef.current.rotation.x, -0.05, 2);
        headRef.current.rotation.y = Math.sin(ip * 0.9) * 0.22;  // head pans to inspect
        headRef.current.position.y = 1 + breathe;

        // Weight shift: slight lean to one side while thinking
        groupRef.current.rotation.z = lr(groupRef.current.rotation.z, Math.sin(ip * 0.7) * 0.03, 1.5);
        groupRef.current.rotation.x = lr(groupRef.current.rotation.x, 0, 2);

        leftLegRef.current.rotation.x = lr(leftLegRef.current.rotation.x, 0.05, 2);
        rightLegRef.current.rotation.x = lr(rightLegRef.current.rotation.x, -0.05, 2);
        leftLegRef.current.rotation.z = lr(leftLegRef.current.rotation.z, 0, 3);
        rightLegRef.current.rotation.z = lr(rightLegRef.current.rotation.z, 0, 3);

        // PHASE 3 (11–13.5s): Wipe visor / glance at wrist display – human moment
      } else if (ct < 13.5) {
        const wp2 = ct - 11;  // 0→2.5

        bodyRef.current.rotation.x = lr(bodyRef.current.rotation.x, 0.05, 2);
        bodyRef.current.rotation.z = lr(bodyRef.current.rotation.z, 0, 4);
        bodyRef.current.position.y = lr(bodyRef.current.position.y, 0.2 + breathe, 3);

        // Right arm rises to visor – wipe / tap gesture
        const wipe = Math.sin(wp2 * 1.8) * 0.15;
        rightArmRef.current.rotation.x = lr(rightArmRef.current.rotation.x, -1.65 + wipe, 4);
        rightArmRef.current.rotation.z = lr(rightArmRef.current.rotation.z, 0.45, 4);

        // Left arm check wrist (diagnostic display)
        leftArmRef.current.rotation.x = lr(leftArmRef.current.rotation.x, -0.8, 3);
        leftArmRef.current.rotation.z = lr(leftArmRef.current.rotation.z, 0.55, 3);

        // Head glances at wrist display, then back forward
        headRef.current.rotation.x = lr(headRef.current.rotation.x, wp2 < 1.2 ? 0.25 : 0.05, 2);
        headRef.current.rotation.y = lr(headRef.current.rotation.y, 0, 2);
        headRef.current.position.y = 1 + breathe;

        groupRef.current.rotation.z = lr(groupRef.current.rotation.z, 0, 3);

        // PHASE 4 (13.5–16s): Lean back in, get to work again
      } else {
        const rp = ct - 13.5;  // 0→2.5

        bodyRef.current.rotation.x = lr(bodyRef.current.rotation.x, 0.38, 3);
        bodyRef.current.position.y = lr(bodyRef.current.position.y, -0.1 + breathe, 3);

        rightArmRef.current.rotation.x = lr(rightArmRef.current.rotation.x, -1.0, 3);
        rightArmRef.current.rotation.z = lr(rightArmRef.current.rotation.z, -0.18, 3);
        leftArmRef.current.rotation.x = lr(leftArmRef.current.rotation.x, -0.65, 3);
        leftArmRef.current.rotation.z = lr(leftArmRef.current.rotation.z, 0.35, 3);

        headRef.current.rotation.x = lr(headRef.current.rotation.x, 0.5, 3);
        headRef.current.rotation.y = lr(headRef.current.rotation.y, 0, 3);
        headRef.current.position.y = 1 + breathe;

        groupRef.current.rotation.x = lr(groupRef.current.rotation.x, 0.1, 2);
      }

    } else if (action === 'fly') {
      // ── ZERO-G DRIFT: weightless, not bouncing ────────────────────────
      const dp = t * 0.35;   // very slow drift frequency

      // Tiny positional drift (astronaut micro-adjusts thrusters)
      groupRef.current.position.y =
        posRef.current.y + Math.sin(dp) * 0.06 + Math.sin(dp * 1.7) * 0.03;
      // Gentle slow roll – zero-g rotation
      groupRef.current.rotation.z = lr(groupRef.current.rotation.z, Math.sin(dp * 0.8) * 0.05, 1);
      groupRef.current.rotation.x = lr(groupRef.current.rotation.x, -0.12, 2);

      // Arms spread wide for balance / checking instruments
      leftArmRef.current.rotation.x = lr(leftArmRef.current.rotation.x, 0.1 + Math.sin(dp * 1.2) * 0.04, 2);
      leftArmRef.current.rotation.z = lr(leftArmRef.current.rotation.z, 0.55 + Math.sin(dp * 0.9) * 0.04, 2);
      rightArmRef.current.rotation.x = lr(rightArmRef.current.rotation.x, 0.1 + Math.sin(dp * 1.1) * 0.04, 2);
      rightArmRef.current.rotation.z = lr(rightArmRef.current.rotation.z, -(0.55 + Math.sin(dp * 0.8) * 0.04), 2);

      // Legs loosely together – they drift slightly, no rigid hold
      leftLegRef.current.rotation.x = lr(leftLegRef.current.rotation.x, 0.04 + Math.sin(dp * 1.3) * 0.03, 1.5);
      rightLegRef.current.rotation.x = lr(rightLegRef.current.rotation.x, 0.04 + Math.sin(dp * 0.9) * 0.03, 1.5);
      leftLegRef.current.rotation.z = lr(leftLegRef.current.rotation.z, 0, 2);
      rightLegRef.current.rotation.z = lr(rightLegRef.current.rotation.z, 0, 2);

      // Head slowly looks around – curious, alert
      headRef.current.rotation.x = lr(headRef.current.rotation.x, -0.08, 1.5);
      headRef.current.rotation.y = Math.sin(dp * 0.5) * 0.18;
      headRef.current.position.y = 1 + breathe;

      // Body breathes
      bodyRef.current.rotation.x = lr(bodyRef.current.rotation.x, 0, 2);
      bodyRef.current.position.y = lr(bodyRef.current.position.y, 0.2 + breathe, 2);
    }

    // ── 4. POSITION (non-fly actions) ──────────────────────────────────────
    if (action !== 'fly') {
      groupRef.current.position.set(posRef.current.x, posRef.current.y, 0);
    } else {
      groupRef.current.position.x = lr(groupRef.current.position.x, posRef.current.x, 2);
      // y is set above for fly
    }

    // ── 5. BOOST: excited shimmy (replaces wild spin) ─────────────────────
    if (boostRef.current > 0) {
      const shimmy = Math.sin(t * 18) * boostRef.current * 0.04;
      groupRef.current.rotation.z += shimmy;
      boostRef.current = Math.max(0, boostRef.current - dt * 3);
    } else if (action !== 'fly') {
      groupRef.current.rotation.z = lr(groupRef.current.rotation.z, 0, 5);
    }

    // ── 6. FACING DIRECTION ───────────────────────────────────────────────
    const spd = Math.sqrt(velRef.current.x ** 2 + velRef.current.y ** 2);
    if (spd > 0.004) {
      const targetRY = velRef.current.x > 0 ? Math.PI / 2 : -Math.PI / 2;
      groupRef.current.rotation.y = lr(groupRef.current.rotation.y, targetRY, 4);
    } else {
      // Idle: gently look left/right
      groupRef.current.rotation.y = lr(
        groupRef.current.rotation.y,
        Math.sin(t * 0.25) * 0.12,
        2
      );
    }
  });

  // ── JSX ──────────────────────────────────────────────────────────────────
  return (
    <>
      <Tether start={[-15, 10, -5]} end={posRef.current} />

      <group
        ref={groupRef}
        scale={hovered ? 0.33 : 0.29}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => { boostRef.current = 1; }}
      >
        {/* THOUGHT BUBBLE */}
        <Html position={[0, 2.4, 0]} center distanceFactor={10}>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{
              padding: '6px 14px',
              borderRadius: '18px',
              background: 'rgba(255,255,255,0.82)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
              {status}
            </p>
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-3px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', marginBottom: 2 }} />
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
          </div>
        </Html>

        {/* Body */}
        <mesh ref={bodyRef} position={[0, 0.2, 0]} geometry={geo.body} material={mat.suit} />

        {/* Head + Visor */}
        <mesh ref={headRef} position={[0, 1, 0]} geometry={geo.head} material={mat.helmet}>
          <mesh position={[0, 0.04, 0.26]} geometry={geo.visor} material={mat.visor} />
        </mesh>

        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.42, 0.52, 0]}>
          <mesh position={[0, -0.3, 0]} geometry={geo.limb} material={mat.suit} />
          <mesh position={[0, -0.64, 0]} geometry={geo.hand} material={mat.glove} />
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.42, 0.52, 0]}>
          <mesh position={[0, -0.3, 0]} geometry={geo.limb} material={mat.suit} />
          <mesh position={[0, -0.64, 0]} geometry={geo.hand} material={mat.glove} />
        </group>

        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.16, -0.52, 0]}>
          <mesh position={[0, -0.3, 0]} geometry={geo.limb} material={mat.suit} />
          <mesh position={[0, -0.64, 0]} geometry={geo.boot} material={mat.boot} />
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.16, -0.52, 0]}>
          <mesh position={[0, -0.3, 0]} geometry={geo.limb} material={mat.suit} />
          <mesh position={[0, -0.64, 0]} geometry={geo.boot} material={mat.boot} />
        </group>

        {/* Jetpack */}
        <mesh position={[0, 0.3, -0.38]} geometry={geo.jetpack} material={mat.jetpack} />
        <mesh position={[-0.12, -0.05, -0.48]} geometry={geo.thruster} material={mat.thruster} />
        <mesh position={[0.12, -0.05, -0.48]} geometry={geo.thruster} material={mat.thruster} />
      </group>
    </>
  );
};

// ─── FLOATING DEBRIS ──────────────────────────────────────────────────────────
const Debris = ({ count = 14 }) => {
  const items = useMemo(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push({
        pos: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 18, (Math.random() - 0.5) * 8],
        size: Math.random() * 0.18 + 0.04,
        rx: Math.random() * 0.4,
        ry: Math.random() * 0.3,
      });
    }
    return list;
  }, [count]);

  return (
    <>
      {items.map((d, i) => (
        <mesh key={i} position={d.pos} rotation={[d.rx, d.ry, 0]}>
          <dodecahedronGeometry args={[d.size, 0]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? '#E5E5EA' : i % 3 === 1 ? '#0071E3' : '#555555'}
            opacity={0.45}
            transparent
          />
        </mesh>
      ))}
    </>
  );
};

// ─── SCENE ROOT ───────────────────────────────────────────────────────────────
export default function SpaceStage() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.4} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={0.9} />

        <Stars radius={100} depth={50} count={4500} factor={4} saturation={0} fade speed={0.8} />

        <AnimatedAstronaut hovered={hovered} setHovered={setHovered} />
        <Debris count={14} />
      </Canvas>
    </div>
  );
}