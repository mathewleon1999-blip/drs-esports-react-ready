'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text, Billboard } from '@react-three/drei';
import { useGLTF, useTexture } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense } from 'react';

function PlayerModel({ position, name, role, color = '#00d4ff' }) {
  const playerImages = {
    'Zen': '/DRS ESPORTS/DRS ZEN (1).jpg',
    'Shakkir': '/DRS ESPORTS/SHAKKIR).jpg',
    'Akos': '/DRS ESPORTS/AKOS (3).png',
    'Noisy': '/DRS ESPORTS/noisy n (3).png',
    'Mechanic': '/DRS ESPORTS/DRS MECHANIC.jpeg'
  };

  const playerTexture = useTexture(playerImages[name] || '/DRS ESPORTS/Dream.jpg');
  
  return (
    <Float floatIntensity={0.8} rotationIntensity={0.3}>
      <group position={position}>
        {/* Player Image Plane */}
        <mesh rotation={[-Math.PI / 4, 0, 0]}>
          <planeGeometry args={[0.4, 0.6]} />
          <meshStandardMaterial 
            map={playerTexture}
            transparent
          />
        </mesh>
        
        {/* Hologram Ring */}
        <mesh scale={0.8}>
          <torusGeometry args={[0.25, 0.02, 8, 32]} />
          <meshStandardMaterial 
            color={color}
            emissive={`${color}33`}
            transparent 
            opacity={0.7}
          />
        </mesh>

        {/* Name & Role Billboard */}
        <Billboard position={[0, 0.4, 0]}>
          <Text
            fontSize={0.06}
            anchorX="center"
            anchorY="middle"
            maxWidth={1.2}
          >
            {name}
            <meshStandardMaterial color={color} emissive="#ffffff22" />
          </Text>
          <Text
            position={[0, -0.08, 0]}
            fontSize={0.04}
            anchorX="center"
            anchorY="middle"
          >
            {role}
            <meshStandardMaterial color="#888888" />
          </Text>
        </Billboard>
      </group>
    </Float>
  );
}

function TeamLogo() {
  const logoTexture = useTexture('/DRSLOGO.jpg');
  
  return (
    <group position={[0, 0, 0]} scale={0.6}>
      {/* 3D Logo Plane */}
      <mesh>
        <planeGeometry args={[2, 1.5]} />
        <meshStandardMaterial 
          map={logoTexture}
          transparent
          alphaTest={0.1}
        />
      </mesh>
      
      {/* Logo Glow Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.05, 8, 64]} />
        <meshStandardMaterial 
          color="#00d4ff" 
          emissive="#001144"
          transparent 
          opacity={0.8}
        />
      </mesh>
      
      {/* DRS Text */}
      <Text
        position={[0, 0, 0.8]}
        fontSize={0.25}
        anchorX="center"
        anchorY="middle"
      >
        DRS ESPORTS
        <meshStandardMaterial color="#00d4ff" emissive="#004488" />
      </Text>
    </group>
  );
}

export default function TeamFloaters3D({ bottomFixed = false }) {
  const teamMembers = [
    { name: 'Zen', role: 'IGL', color: '#00d4ff', position: [0, 0, 0] },
    { name: 'Shakkir', role: 'Fragger', color: '#ff006e', position: [0, 0, 0] },
    { name: 'Akos', role: 'Support', color: '#ffd700', position: [0, 0, 0] },
    { name: 'Noisy', role: 'Rifler', color: '#4ade80', position: [0, 0, 0] },
    { name: 'Dream', role: 'Entry', color: '#8b5cf6', position: [0, 0, 0] },
  ];

  const playerImages = {
    'Zen': '/DRS ESPORTS/DRS ZEN (1).jpg',
    'Shakkir': '/DRS ESPORTS/SHAKKIR).jpg',
    'Akos': '/DRS ESPORTS/AKOS (3).png',
    'Noisy': '/DRS ESPORTS/noisy n (3).png',
    'Dream': '/DRS ESPORTS/Dream.jpg'
  };

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

