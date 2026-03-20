'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float, MeshWobbleMaterial, Text } from '@react-three/drei';
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function DataOrb({ mood }) {
  const mesh = useRef();
  
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.x = t * 0.2;
    mesh.current.rotation.y = t * 0.3;
  });

  const isChaos = mood === 'chaos';
  const isFluid = mood === 'fluid';

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={mesh} args={[1, 64, 64]} scale={1.5}>
        {isChaos ? (
          <MeshWobbleMaterial
            color="#ff00ff"
            factor={0.8}
            speed={8}
            roughness={0}
            metalness={1}
          />
        ) : (
          <MeshDistortMaterial
            color={isFluid ? "#fbbf24" : "#00f3ff"}
            speed={isFluid ? 5 : 2}
            distort={isFluid ? 0.6 : 0.3}
            radius={1}
            roughness={0.1}
            metalness={0.8}
          />
        )}
      </Sphere>
    </Float>
  );
}

export default function Scene3D({ mood, isLite }) {
  if (isLite) return null;

  return (
    <div className="absolute inset-0 -z-10 opacity-60">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-32 z-20 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-px h-12 bg-accent/30" />
          <p className="font-mono text-[8px] tracking-[0.4em] uppercase text-accent">Neural_Skill_Core_v2</p>
          <p className="font-mono text-[7px] text-foreground/40 max-w-[140px] text-center leading-tight">
            Distortion levels represent data complexity handled in current view.
          </p>
        </motion.div>
      </div>

      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
        <DataOrb mood={mood} />
      </Canvas>
    </div>
  );
}
