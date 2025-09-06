import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Upload, 
  Video, 
  Code, 
  ClipboardList,
  Menu,
  X,
  Shield
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  if (!user) return null;

  const teacherMenuItems = [
    { id: '/dashboard', label: 'Dashboard', icon: Home },
    { id: '/courses', label: 'Courses', icon: BookOpen },
    { id: '/students', label: 'Students', icon: Users },
    { id: '/assignments', label: 'Assignments', icon: ClipboardList },
    { id: '/analytics', label: 'Analytics', icon: TrendingUp },
    { id: '/videos', label: 'Video Content', icon: Upload },
    { id: '/classes', label: 'Live Classes', icon: Video },
  ];

  const studentMenuItems = [
    { id: '/dashboard', label: 'Dashboard', icon: Home },
    { id: '/courses', label: 'My Courses', icon: BookOpen },
    { id: '/assignments', label: 'Assignments', icon: ClipboardList },
    { id: '/analytics', label: 'Progress', icon: TrendingUp },
    { id: '/classes', label: 'Live Classes', icon: Video },
    { id: '/playground', label: 'Code Playground', icon: Code },
  ];

  const adminMenuItems = [
    { id: '/admin', label: 'Admin Panel', icon: Shield },
    { id: '/dashboard', label: 'Dashboard', icon: Home },
    { id: '/courses', label: 'All Courses', icon: BookOpen },
    { id: '/students', label: 'All Users', icon: Users },
    { id: '/assignments', label: 'All Assignments', icon: ClipboardList },
    { id: '/analytics', label: 'System Analytics', icon: TrendingUp },
    { id: '/classes', label: 'All Classes', icon: Video },
  ];

  const getMenuItems = () => {
    switch (user.role) {
      case 'ADMIN':
        return adminMenuItems;
      case 'TEACHER':
        return teacherMenuItems;
      default:
        return studentMenuItems;
    }
  };

  const menuItems = getMenuItems();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white/10 backdrop-blur-sm rounded-lg text-white"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 glass border-r border-white/10 z-40 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 sidebar-fixed
      `}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">FutureCorp's</h2>
              <p className="text-xs text-gray-400">Learning Platform</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Role Badge */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user.role === 'TEACHER' ? 'T' : user.role === 'ADMIN' ? 'A' : 'S'}
                </span>
              </div>
              <div>
                <p className="text-white text-sm font-medium capitalize">{user.role.toLowerCase()}</p>
                <p className="text-gray-400 text-xs">Active</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;