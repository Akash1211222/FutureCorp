import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text3D, Center } from '@react-three/drei';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50">
      {/* 3D Loading Animation */}
      <div className="w-full h-full relative">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
          
          <Center>
            <Text3D
              font="/fonts/helvetiker_regular.typeface.json"
              size={0.5}
              height={0.1}
              curveSegments={12}
            >
              FutureCorp
              <meshStandardMaterial color="#3b82f6" />
            </Text3D>
          </Center>
        </Canvas>

        {/* Overlay UI */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="mb-8">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-white mb-2">Loading FutureCorp LMS</h2>
              <p className="text-gray-300">Preparing your 3D learning experience...</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;