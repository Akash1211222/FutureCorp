import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Text3D, Center } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Rocket, Star, Zap } from 'lucide-react';
import { useAuth } from '../stores/authStore';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT' as 'STUDENT' | 'TEACHER' | 'ADMIN'
  });

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (!formData.email || !formData.password) {
        setError('Please fill in all required fields');
        return;
      }

      if (!isLogin && !formData.name) {
        setError('Please enter your name');
        return;
      }

      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
      }
      
      navigate(from, { replace: true });
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 3D Background Scene */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <Environment preset="night" />
            
            <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
              <Center>
                <Text3D
                  font="/fonts/helvetiker_regular.typeface.json"
                  size={1}
                  height={0.2}
                  curveSegments={12}
                  position={[0, 2, -5]}
                >
                  FutureCorp
                  <meshStandardMaterial color="#3b82f6" emissive="#1e40af" emissiveIntensity={0.3} />
                </Text3D>
              </Center>
            </Float>
            
            {/* Floating geometric shapes */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
              <mesh position={[5, 3, -3]}>
                <octahedronGeometry args={[0.5]} />
                <meshStandardMaterial color="#8b5cf6" emissive="#6d28d9" emissiveIntensity={0.2} />
              </mesh>
            </Float>
            
            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
              <mesh position={[-5, -2, -4]}>
                <tetrahedronGeometry args={[0.7]} />
                <meshStandardMaterial color="#10b981" emissive="#047857" emissiveIntensity={0.2} />
              </mesh>
            </Float>
            
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
          </Suspense>
        </Canvas>
      </div>

      {/* Auth Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4"
          >
            <Rocket className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold gradient-text mb-2">FutureCorp</h1>
          <p className="text-gray-300 text-lg">3D Learning Management System</p>
        </div>

        {/* Auth Form */}
        <div className="glass rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          
          <div className="relative z-10">
            {/* Toggle Buttons */}
            <div className="flex bg-white/10 rounded-2xl p-1 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 ${
                  isLogin
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 ${
                  !isLogin
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 glass rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your full name"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 glass rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 glass rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    I am a...
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 glass rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                  >
                    <option value="STUDENT" className="bg-gray-800">Student</option>
                    <option value="TEACHER" className="bg-gray-800">Teacher</option>
                  </select>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </motion.button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-8 p-4 bg-white/5 rounded-xl">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Quick Demo Access:</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setFormData({
                      name: 'Alice Johnson',
                      email: 'alice@futurecorp.test',
                      password: 'Student@123',
                      role: 'STUDENT'
                    });
                  }}
                  className="p-2 text-xs bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  Demo Student
                </button>
                <button
                  onClick={() => {
                    setFormData({
                      name: 'Dr. Sarah Johnson',
                      email: 'teacher@futurecorp.test',
                      password: 'Teacher@123',
                      role: 'TEACHER'
                    });
                  }}
                  className="p-2 text-xs bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
                >
                  Demo Teacher
                </button>
              </div>
              <button
                onClick={() => {
                  setFormData({
                    name: 'Admin User',
                    email: 'admin@futurecorp.test',
                    password: 'Admin@123',
                    role: 'ADMIN'
                  });
                }}
                className="w-full p-2 text-xs bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors mt-2"
              >
                Demo Admin
              </button>
            </div>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-red-900/20 border border-red-600/30 rounded-lg"
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>© 2024 FutureCorp Learning Platform. Empowering the next generation.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;