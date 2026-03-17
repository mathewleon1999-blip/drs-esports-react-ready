'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text, Billboard } from '@react-three/drei';
import { useGLTF, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense } from 'react';

function PlayerModel({ position, name, role, color = '#00d4ff' }) {
  // Simplified player model - capsule for body + sphere for head
  return (
    <Float floatIntensity={0.8} rotationIntensity={0.3}>
      <mesh position={position}>
        {/* Body */}
        <capsuleGeometry args={[0.15, 0.6]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.3} 
          roughness={0.2}
          emissive="#001122"
        />
        
        {/* Head */}
        <mesh position={[0, 0.45, 0]}>
          <sphereGeometry args={[0.12]} />
          <meshStandardMaterial 
            color="#f0f8ff" 
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>

        {/* Name tag */}
        <Billboard position={[0, 0.8, 0]}>
          <Text
            fontSize={0.08}
            anchorX="center"
            anchorY="middle"
            maxWidth={1.5}
            letterSpacing={0.02}
          >
            {name}
            <meshStandardMaterial color="white" />
          </Text>
          <Text
            position={[0, -0.08, 0]}
            fontSize={0.05}
            anchorX="center"
            anchorY="middle"
          >
            {role}
            <meshStandardMaterial color="#00d4ff" emissive="#001133" />
          </Text>
        </Billboard>
      </mesh>
    </Float>
  );
}

function TeamLogo() {
  return (
    <mesh position={[0, 0, 0]} scale={0.8}>
      <torusKnotGeometry args={[0.5, 0.15, 128, 32]} />
      <meshStandardMaterial 
        color="#00d4ff"
        metalness={0.8}
        roughness={0.2}
        emissive="#001144"
      />
      <Text
        position={[0, 0, 0.6]}
        fontSize={0.3}
        anchorX="center"
        anchorY="middle"
        rotation={[0, 0, 0]}
      >
        DRS
        <meshStandardMaterial color="white" emissive="#ffffff11" />
      </Text>
    </mesh>
  );
}

export default function TeamFloaters3D({ bottomFixed = false }) {
  const teamMembers = [
    { name: 'Zen', role: 'IGL', color: '#00d4ff', position: [0, 0, 0] },
    { name: 'Shakkir', role: 'Fragger', color: '#ff006e', position: [0, 0, 0] },
    { name: 'Akos', role: 'Support', color: '#ffd700', position: [0, 0, 0] },
    { name: 'Noisy', role: 'Rifler', color: '#4ade80', position: [0, 0, 0] },
    { name: 'Mechanic', role: 'Entry', color: '#8b5cf6', position: [0, 0, 0] },
  ];

  return (
    <div className={`team-floaters-3d ${bottomFixed ? 'bottom-fixed' : ''}`}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          {/* Scene Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[1, 1, 1]} 
            intensity={1} 
          />
          <pointLight 
            position={[-1, -1, -1]} 
            intensity={0.3} 
          />

          {/* Stars Background */}
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
          />

          {/* Central DRS Logo */}
          <TeamLogo />

          {/* Orbiting Team Members */}
          {teamMembers.map((member, index) => {
            const radius = 1.8;
            const angle = (index / teamMembers.length) * Math.PI * 2;
            const height = Math.sin(Date.now() * 0.001 + index) * 0.3;
            
            return (
              <PlayerModel
                key={member.name}
                {...member}
                position={[
                  Math.cos(angle + Date.now() * 0.0008) * radius,
                  height,
                  Math.sin(angle + Date.now() * 0.0008) * radius * 0.7
                ]}
              />
            );
          })}

          {/* Orbit Path */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.8, 0.02, 8, 64]} />
            <meshStandardMaterial 
              color="#00d4ff" 
              transparent 
              opacity={0.3}
              emissive="#001144"
            />
          </mesh>

          {/* Effects */}
          <EffectComposer>
            <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} height={300} />
          </EffectComposer>

          {/* Controls for desktop */}
          {!bottomFixed && <OrbitControls enableZoom={false} enablePan={false} />}
        </Suspense>
      </Canvas>
    </div>
  );
}

