import React from 'react';
import { 
  Home, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Upload, 
  Video,
  Code,
  Zap,
  Rocket
} from 'lucide-react';

interface SidebarProps {
  userRole: 'teacher' | 'student';
  currentView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole, currentView, onViewChange }) => {
  const teacherMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'video-upload', label: 'Upload Content', icon: Upload },
    { id: 'online-classes', label: 'Online Classes', icon: Video },
    { id: 'playground', label: 'Code Playground', icon: Code },
  ];

  const studentMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'performance', label: 'My Progress', icon: TrendingUp },
    { id: 'online-classes', label: 'Live Classes', icon: Video },
    { id: 'playground', label: 'Code Playground', icon: Code },
  ];

  const menuItems = userRole === 'teacher' ? teacherMenuItems : studentMenuItems;

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 glass border-r border-white/10 z-40">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-4 w-16 h-16 bg-gradient-to-r from-blue-400/10 to-purple-600/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 left-4 w-20 h-20 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-xl animate-float animation-delay-2000"></div>
      </div>

      <div className="p-6 relative z-10">
        {/* Logo Section */}
        <div className="flex items-center space-x-3 mb-8 p-4 rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-pulse3d">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold gradient-text">FutureCorp's</h2>
            <p className="text-xs text-gray-400 capitalize">{userRole} Portal</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                currentView === item.id
                  ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-white border border-blue-500/30 animate-glow'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 flex items-center space-x-3 w-full">
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  currentView === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 animate-rotate3d'
                    : 'bg-white/10 group-hover:bg-white/20'
                }`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
            </button>
          ))}
        </nav>

        {/* Motivational Section */}
        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-5 h-5 text-green-400 animate-glow" />
            <span className="text-green-400 font-semibold text-sm">Daily Motivation</span>
          </div>
          <p className="text-gray-300 text-xs leading-relaxed">
            "The future belongs to those who learn more skills and combine them in creative ways." 
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-green-400 text-xs font-medium">Keep Learning! 🚀</span>
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-pulse3d">
              <Rocket className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Progress Indicator for Students */}
        {userRole === 'student' && (
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-400 font-semibold text-sm">Weekly Progress</span>
              <span className="text-white text-sm font-bold">75%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mb-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full progress-animate" style={{ width: '75%' }}></div>
            </div>
            <p className="text-gray-400 text-xs">3 of 4 goals completed this week!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;