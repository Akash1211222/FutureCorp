import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useAuth } from '../stores/authStore';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Award, 
  Clock, 
  Target,
  Zap,
  Star,
  Trophy,
  Rocket
} from 'lucide-react';
import StatsCard3D from '../components/3d/StatsCard3D';
import LoadingScreen from '../components/ui/LoadingScreen';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const getStatsData = () => {
    switch (user.role) {
      case 'TEACHER':
      case 'ADMIN':
        return [
          { icon: Users, label: 'Total Students', value: '156', color: '#3b82f6', position: [-2, 0, 0] },
          { icon: BookOpen, label: 'Active Courses', value: '12', color: '#8b5cf6', position: [0, 0, 0] },
          { icon: TrendingUp, label: 'Avg. Performance', value: '87%', color: '#10b981', position: [2, 0, 0] },
          { icon: Award, label: 'Achievements', value: '24', color: '#f59e0b', position: [0, -1.5, 0] },
        ];
      default:
        return [
          { icon: BookOpen, label: 'Enrolled Courses', value: '8', color: '#3b82f6', position: [-2, 0, 0] },
          { icon: Target, label: 'Completed', value: '5', color: '#10b981', position: [0, 0, 0] },
          { icon: Clock, label: 'Study Hours', value: '124', color: '#8b5cf6', position: [2, 0, 0] },
          { icon: Trophy, label: 'Achievements', value: '15', color: '#f59e0b', position: [0, -1.5, 0] },
        ];
    }
  };

  const statsData = getStatsData();

  return (
    <div className="space-y-6 relative">
      {/* Welcome Section with 3D Background */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass rounded-2xl p-6 relative overflow-hidden h-64 sm:h-80"
      >
        {/* 3D Background Scene */}
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={0.8} />
              <Environment preset="night" />
              
              <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh position={[2, 1, -2]}>
                  <sphereGeometry args={[0.5, 32, 32]} />
                  <meshStandardMaterial color="#3b82f6" emissive="#1e40af" emissiveIntensity={0.2} />
                </mesh>
              </Float>
              
              <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
                <mesh position={[-2, -1, -1]}>
                  <boxGeometry args={[0.8, 0.8, 0.8]} />
                  <meshStandardMaterial color="#8b5cf6" emissive="#6d28d9" emissiveIntensity={0.2} />
                </mesh>
              </Float>
              
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Suspense>
          </Canvas>
        </div>

        {/* Content overlay */}
        <div className="relative z-10 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-2">
              Welcome back, {user.name}! 🚀
            </h1>
            <p className="text-gray-300 text-base sm:text-lg lg:text-xl">
              {user.role === 'TEACHER' || user.role === 'ADMIN'
                ? 'Ready to inspire minds and shape the future?' 
                : 'Ready to learn something amazing today?'
              }
            </p>
            <div className="flex items-center space-x-6 mt-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
                <span>Learn. Code. Create.</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
                <span>Future Ready</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 3D Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="glass rounded-2xl p-6 h-96"
      >
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-blue-400" />
          Performance Overview
        </h2>
        
        <div className="h-80">
          <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <Environment preset="studio" />
              
              {statsData.map((stat, index) => (
                <StatsCard3D
                  key={index}
                  position={stat.position as [number, number, number]}
                  icon={stat.icon}
                  label={stat.label}
                  value={stat.value}
                  color={stat.color}
                />
              ))}
              
              <OrbitControls 
                enableZoom={true} 
                enablePan={true} 
                maxDistance={15}
                minDistance={5}
                autoRotate 
                autoRotateSpeed={1}
              />
            </Suspense>
          </Canvas>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        {user.role === 'TEACHER' || user.role === 'ADMIN' ? (
          <>
            <ActionCard 
              icon={BookOpen} 
              title="Create Course" 
              description="Design new learning experiences"
              color="from-blue-500 to-cyan-500"
              onClick={() => navigate('/courses')}
            />
            <ActionCard 
              icon={Users} 
              title="Manage Students" 
              description="Track student progress"
              color="from-purple-500 to-pink-500"
              onClick={() => navigate('/students')}
            />
            <ActionCard 
              icon={TrendingUp} 
              title="View Analytics" 
              description="Analyze performance data"
              color="from-green-500 to-emerald-500"
              onClick={() => navigate('/analytics')}
            />
          </>
        ) : (
          <>
            <ActionCard 
              icon={BookOpen} 
              title="Browse Courses" 
              description="Discover new subjects"
              color="from-blue-500 to-cyan-500"
              onClick={() => navigate('/courses')}
            />
            <ActionCard 
              icon={Target} 
              title="Practice Coding" 
              description="Sharpen your skills"
              color="from-purple-500 to-pink-500"
              onClick={() => navigate('/playground')}
            />
            <ActionCard 
              icon={Trophy} 
              title="View Progress" 
              description="Track your achievements"
              color="from-green-500 to-emerald-500"
              onClick={() => navigate('/analytics')}
            />
          </>
        )}
      </motion.div>
    </div>
  );
};

interface ActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon: Icon, title, description, color, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="glass rounded-2xl p-6 cursor-pointer group relative overflow-hidden"
  >
    <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
    <div className="relative z-10">
      <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  </motion.div>
);

export default Dashboard;