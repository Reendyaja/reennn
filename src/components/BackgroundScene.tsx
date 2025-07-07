import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Generate random points in a 3D space
function generatePoints(count: number) {
  const points = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    points[i3] = (Math.random() - 0.5) * 10;
    points[i3 + 1] = (Math.random() - 0.5) * 10;
    points[i3 + 2] = (Math.random() - 0.5) * 10;
    
    // Colors - mostly blue and cyan with some variation
    colors[i3] = 0.1 + Math.random() * 0.2; // R
    colors[i3 + 1] = 0.3 + Math.random() * 0.4; // G
    colors[i3 + 2] = 0.7 + Math.random() * 0.3; // B
  }
  
  return { positions: points, colors };
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const { positions, colors } = generatePoints(2500);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    
    const elapsedTime = clock.getElapsedTime();
    
    // Rotate the points
    pointsRef.current.rotation.x = elapsedTime * 0.05;
    pointsRef.current.rotation.y = elapsedTime * 0.08;
    
    // Pulse the points
    const scale = 1 + Math.sin(elapsedTime * 0.3) * 0.1;
    pointsRef.current.scale.set(scale, scale, scale);
  });

  return (
    <Points
      ref={pointsRef}
      positions={positions}
      colors={colors}
      stride={3}
    >
      <PointMaterial
        transparent
        vertexColors
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function BackgroundScene() {
  return (
    <div className="fixed inset-0 -z-10 opacity-70">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ParticleField />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-dark-500/30 to-dark-500/90" />
    </div>
  );
}

export default BackgroundScene;