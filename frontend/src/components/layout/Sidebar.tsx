import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Video, 
  Code, 
  ClipboardList,
  Shield,
  X
} from 'lucide-react';
import { useAuth } from '../../stores/authStore';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const getMenuItems = () => {
    const baseItems = [
      { id: '/dashboard', label: 'Dashboard', icon: Home },
      { id: '/courses', label: 'Courses', icon: BookOpen },
      { id: '/assignments', label: 'Assignments', icon: ClipboardList },
      { id: '/classes', label: 'Live Classes', icon: Video },
      { id: '/playground', label: 'Code Playground', icon: Code },
      { id: '/analytics', label: 'Analytics', icon: TrendingUp },
    ];

    if (user.role === 'TEACHER' || user.role === 'ADMIN') {
      baseItems.splice(2, 0, { id: '/students', label: 'Students', icon: Users });
    }

    if (user.role === 'ADMIN') {
      baseItems.unshift({ id: '/admin', label: 'Admin Panel', icon: Shield });
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  const handleMenuClick = (path: string) => {
    navigate(path);
    onClose();
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: -320,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isOpen ? "open" : "closed"}
        className="fixed left-0 top-0 h-full w-64 glass border-r border-white/10 z-50 lg:translate-x-0 lg:static lg:z-auto"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">F</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">FutureCorp</h2>
                  <p className="text-xs text-gray-400">Learning Platform</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
                </motion.button>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-6 border-t border-white/10">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user.role === 'TEACHER' ? 'T' : user.role === 'ADMIN' ? 'A' : 'S'}
                  </span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium capitalize">
                    {user.role.toLowerCase()}
                  </p>
                  <p className="text-gray-400 text-xs">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;