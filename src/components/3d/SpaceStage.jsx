'use client';
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, PerspectiveCamera, Html, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const Tether = ({ start, end }) => {
  const lineRef = useRef();
  const v1 = useMemo(() => new THREE.Vector3(), []);
  const v2 = useMemo(() => new THREE.Vector3(), []);
  const v3 = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (lineRef.current) {
      v1.set(...start);
      v2.set((start[0] + end.x) / 2, (start[1] + end.y) / 2 + 1, (start[2] + end.z) / 2);
      v3.set(end.x, end.y, end.z);
      
      const curve = new THREE.QuadraticBezierCurve3(v1, v2, v3);
      lineRef.current.geometry.setFromPoints(curve.getPoints(50));
    }
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial color="#545456" linewidth={1} transparent opacity={0.6} />
    </line>
  );
};

// Astronaut with BUTTER-SMOOTH performance refactoring
const AnimatedAstronaut = ({ hovered, setHovered }) => {
  const groupRef = useRef();
  const bodyRef = useRef();
  const headRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();

  // PHYSICS REFS (Replacing state for 60fps smoothness)
  const posRef = useRef(new THREE.Vector3(0, 0, 0));
  const targetPosRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const actionRef = useRef('walk');
  const [status, setStatus] = useState('🚶 Thinking...');
  const boostRef = useRef(0);

  // Memoize Geometries & Materials to prevent GC pressure
  // ... (unchanged)
  const geo = useMemo(() => ({
    body: new THREE.CapsuleGeometry(0.3, 1, 4, 8),
    head: new THREE.SphereGeometry(0.35, 32, 32),
    visor: new THREE.SphereGeometry(0.2, 32, 32),
    limb: new THREE.CapsuleGeometry(0.15, 0.6, 4, 8),
    hand: new THREE.SphereGeometry(0.15, 32, 32),
    boot: new THREE.BoxGeometry(0.2, 0.2, 0.25),
    jetpack: new THREE.BoxGeometry(0.35, 0.7, 0.25),
    thruster: new THREE.SphereGeometry(0.12, 32, 32)
  }), []);

  const mat = useMemo(() => ({
    suit: new THREE.MeshStandardMaterial({ color: "#ff6b35", metalness: 0.4, roughness: 0.7 }),
    helmet: new THREE.MeshStandardMaterial({ color: "#cccccc", metalness: 0.6, roughness: 0.5 }),
    visor: new THREE.MeshStandardMaterial({ color: "#001a4d", emissive: "#0071E3", emissiveIntensity: 0.5 }),
    hand: new THREE.MeshStandardMaterial({ color: "#e5a700", metalness: 0.5, roughness: 0.6 }),
    boot: new THREE.MeshStandardMaterial({ color: "#1a1a1a", metalness: 0.7, roughness: 0.4 }),
    jetpack: new THREE.MeshStandardMaterial({ color: "#ff4757", metalness: 0.5, roughness: 0.6 }),
    thruster: new THREE.MeshStandardMaterial({ color: "#ff6b35", emissive: "#ff4500", emissiveIntensity: 0.8 })
  }), []);

  // Listen to AI brain commands
  useEffect(() => {
    const handleAutonomousAction = (e) => {
      const { action: newAction, target, status: newStatus } = e.detail;
      if (newAction) actionRef.current = newAction;
      if (target) targetPosRef.current = target;
      if (newStatus) setStatus(newStatus);
    };

    const handleBoost = () => { boostRef.current = 40; };

    window.addEventListener('astronaut-autonomous-action', handleAutonomousAction);
    window.addEventListener('astro-boost', handleBoost);

    return () => {
      window.removeEventListener('astronaut-autonomous-action', handleAutonomousAction);
      window.removeEventListener('astro-boost', handleBoost);
    };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) return;

    // 1. DELTA-BASED MOVEMENT (Ensures same speed regardless of FPS)
    const targetX = targetPosRef.current.x * 5;
    const targetY = targetPosRef.current.y * 3;

    // P-Control for smooth following
    velocityRef.current.x += (targetX - posRef.current.x) * (delta * 2);
    velocityRef.current.y += (targetY - posRef.current.y) * (delta * 2);

    // Damping
    velocityRef.current.x *= Math.pow(0.95, delta * 60);
    velocityRef.current.y *= Math.pow(0.95, delta * 60);

    posRef.current.x += velocityRef.current.x;
    posRef.current.y += velocityRef.current.y;

    groupRef.current.position.set(posRef.current.x, posRef.current.y, 0);

    // 2. ACTION-BASED ANIMATIONS
    const action = actionRef.current;

    if (action === 'walk') {
      const walkSpeed = 5;
      const phase = t * walkSpeed;

      if (leftLegRef.current) leftLegRef.current.rotation.z = Math.sin(phase) * 0.5;
      if (rightLegRef.current) rightLegRef.current.rotation.z = Math.sin(phase + Math.PI) * 0.5;
      if (leftArmRef.current) leftArmRef.current.rotation.z = Math.sin(phase + Math.PI) * 0.4;
      if (rightArmRef.current) rightArmRef.current.rotation.z = Math.sin(phase) * 0.4;
      
      bodyRef.current.position.y = Math.sin(phase * 2) * 0.1;
      headRef.current.position.y = 1 + Math.sin(phase * 2) * 0.05;
      groupRef.current.rotation.x = 0;
    } 
    else if (action === 'repair') {
      const phase = t * 3;
      bodyRef.current.position.y = -0.2;
      bodyRef.current.rotation.x = 0.5;
      
      leftArmRef.current.rotation.z = 1.2 + Math.sin(phase) * 0.5;
      rightArmRef.current.rotation.z = 1.2 + Math.sin(phase + Math.PI) * 0.5;
      
      leftLegRef.current.rotation.z = 0.6;
      rightLegRef.current.rotation.z = 0.6;
      
      headRef.current.rotation.x = 0.6;
      groupRef.current.rotation.x = 0.2;
    }
    else if (action === 'fly') {
      const phase = t * 2;
      groupRef.current.position.y = posRef.current.y + Math.sin(phase) * 0.4;
      groupRef.current.rotation.x = -0.3;
      
      leftArmRef.current.rotation.z = -1.2 + Math.sin(phase) * 0.2;
      rightArmRef.current.rotation.z = 1.2 + Math.sin(phase) * 0.2;
      
      leftLegRef.current.rotation.z = 0.2;
      rightLegRef.current.rotation.z = 0.2;
    }

    // 3. BOOST & ORIENTATION
    if (boostRef.current > 0) {
      groupRef.current.rotation.z += boostRef.current * (delta * 5);
      boostRef.current *= 0.95;
    } else {
      groupRef.current.rotation.z *= 0.9;
    }

    // Face direction
    const speed = Math.sqrt(velocityRef.current.x ** 2 + velocityRef.current.y ** 2);
    if (speed > 0.005) {
      const targetRY = velocityRef.current.x > 0 ? Math.PI/2 : -Math.PI/2;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRY, delta * 5);
    } else {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, Math.sin(t * 0.5) * 0.1, delta * 3);
    }
  });

  return (
    <>
      <Tether start={[-15, 10, -5]} end={posRef.current} />
      <group
        ref={groupRef}
        scale={hovered ? 0.35 : 0.3}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => { boostRef.current = 60; }}
      >
        {/* THOUGHT BUBBLE */}
        <Html position={[0, 2.2, 0]} center distanceFactor={10}>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={status}
            className="px-4 py-2 rounded-2xl bg-white/80 dark:bg-black/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-xl"
            style={{ width: 'max-content', pointerEvents: 'none' }}
          >
            <p className="text-xs font-bold text-gray-700 dark:text-gray-200 whitespace-nowrap">
              {status}
            </p>
          </motion.div>
          {/* Small tail dots */}
          <div className="flex flex-col items-center mt-[-4px]">
             <div className="w-2 h-2 rounded-full bg-white/60 dark:bg-black/60 mb-1" />
             <div className="w-1 h-1 rounded-full bg-white/40 dark:bg-black/40" />
          </div>
        </Html>

        <mesh ref={bodyRef} position={[0, 0.2, 0]} geometry={geo.body} material={mat.suit} />
        
        <mesh ref={headRef} position={[0, 1, 0]} geometry={geo.head} material={mat.helmet}>
          <mesh position={[0, 0.05, 0.25]} geometry={geo.visor} material={mat.visor} />
        </mesh>

        <group ref={leftArmRef} position={[-0.4, 0.5, 0]}>
          <mesh position={[0, -0.3, 0]} geometry={geo.limb} material={mat.suit} />
          <mesh position={[0, -0.65, 0]} geometry={geo.hand} material={mat.hand} />
        </group>

        <group ref={rightArmRef} position={[0.4, 0.5, 0]}>
          <mesh position={[0, -0.3, 0]} geometry={geo.limb} material={mat.suit} />
          <mesh position={[0, -0.65, 0]} geometry={geo.hand} material={mat.hand} />
        </group>

        <group ref={leftLegRef} position={[-0.15, -0.5, 0]}>
          <mesh position={[0, -0.3, 0]} geometry={geo.limb} material={mat.suit} />
          <mesh position={[0, -0.65, 0]} geometry={geo.boot} material={mat.boot} />
        </group>

        <group ref={rightLegRef} position={[0.15, -0.5, 0]}>
          <mesh position={[0, -0.3, 0]} geometry={geo.limb} material={mat.suit} />
          <mesh position={[0, -0.65, 0]} geometry={geo.boot} material={mat.boot} />
        </group>

        <mesh position={[0, 0.3, -0.4]} geometry={geo.jetpack} material={mat.jetpack} />
        <mesh position={[-0.2, -0.1, -0.5]} geometry={geo.thruster} material={mat.thruster} />
        <mesh position={[0.2, -0.1, -0.5]} geometry={geo.thruster} material={mat.thruster} />
      </group>
    </>
  );
};

const Debris = ({ count = 20 }) => {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < count; i++) {
      p.push({
        position: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10],
        size: Math.random() * 0.2 + 0.05,
      });
    }
    return p;
  }, [count]);

  return (
    <>
      {points.map((pt, i) => (
        <Float key={i}>
          <mesh position={pt.position}>
            <dodecahedronGeometry args={[pt.size, 0]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#E5E5EA" : "#0071E3"}
              opacity={0.5}
              transparent
            />
          </mesh>
        </Float>
      ))}
    </>
  );
};

export default function SpaceStage() {
  const [showAIBrain, setShowAIBrain] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        <AnimatedAstronaut hovered={hovered} setHovered={setHovered} boost={0} setBoost={() => { }} />
        <Debris count={15} />
      </Canvas>
    </div>
  );
}