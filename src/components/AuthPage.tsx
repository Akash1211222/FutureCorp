import React, { useState } from 'react';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, Rocket, Star, Zap } from 'lucide-react';
import apiService from '../utils/api';

interface User {
  name: string;
  email: string;
  role: 'teacher' | 'student';
}

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as 'teacher' | 'student'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    handleAuth();
  };

  const handleAuth = async () => {
    try {
      // Simple validation
      if (!formData.email || !formData.password) {
        alert('Please fill in all required fields');
        return;
      }

      if (!isLogin && !formData.name) {
        alert('Please enter your name');
        return;
      }

      let response;
      if (isLogin) {
        response = await apiService.login({
          email: formData.email,
          password: formData.password
        });
      } else {
        response = await apiService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
      }

      onLogin(response.user);
    } catch (error: any) {
      alert(error.message || 'Authentication failed');
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
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-blue-600/20 rounded-full animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 animate-pulse3d">
            <Rocket className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            FutureCorp's
          </h1>
          <p className="text-gray-300 text-lg">Learning Management System</p>
          <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 animate-glow" />
              <span>Learn. Code. Create.</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
              <span>Future Ready</span>
            </div>
          </div>
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
                <div className="fade-in">
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
                </div>
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
                <div className="fade-in">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    I am a...
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 glass rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                  >
                    <option value="student" className="bg-gray-800">Student</option>
                    <option value="teacher" className="bg-gray-800">Teacher</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {isLogin && (
              <div className="mt-6 text-center">
                <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot your password?
                </a>
              </div>
            )}

            {/* Demo Accounts */}
            <div className="mt-8 p-4 bg-white/5 rounded-xl">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Quick Demo Access:</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setFormData({
                      name: 'Demo Student',
                      email: 'student@demo.com',
                      password: 'demo123',
                      role: 'student'
                    });
                  }}
                  className="p-2 text-xs bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  Demo Student
                </button>
                <button
                  onClick={() => {
                    setFormData({
                      name: 'Demo Teacher',
                      email: 'teacher@demo.com',
                      password: 'demo123',
                      role: 'teacher'
                    });
                  }}
                  className="p-2 text-xs bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
                >
                  Demo Teacher
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>© 2024 FutureCorp's Learning Platform. Empowering the next generation.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;