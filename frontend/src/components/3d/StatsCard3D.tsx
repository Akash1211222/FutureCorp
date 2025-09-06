import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Box, RoundedBox } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import * as THREE from 'three';

interface StatsCard3DProps {
  position: [number, number, number];
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}

const StatsCard3D: React.FC<StatsCard3DProps> = ({ position, label, value, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={[1.5, 1, 0.1]}
        radius={0.05}
        smoothness={4}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          transparent
          opacity={0.8}
        />
      </RoundedBox>
      
      {/* Value text */}
      <Text
        position={[0, 0.2, 0.06]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {value}
      </Text>
      
      {/* Label text */}
      <Text
        position={[0, -0.2, 0.06]}
        fontSize={0.12}
        color="#e2e8f0"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Regular.woff"
      >
        {label}
      </Text>
    </group>
  );
};

export default StatsCard3D;