import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import DailyMotivation from './DailyMotivation';
import Chatbot from './Chatbot';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const [showChatbot, setShowChatbot] = useState(false);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-blue-600/20 rounded-full animate-blob animation-delay-4000"></div>
      </div>

      <Header />
      
      <div className="flex relative">
        <Sidebar />
        
        <main className="flex-1 main-content relative z-10 content-with-sidebar">
          <DailyMotivation />
          {children}
        </main>
      </div>
      
      {/* Chatbot */}
      <Chatbot 
        isOpen={showChatbot} 
        onToggle={() => setShowChatbot(!showChatbot)} 
        userRole={user.role}
      />
    </div>
  );
};

export default Layout;