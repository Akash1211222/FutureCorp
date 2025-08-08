import React, { useState } from 'react';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Courses from './components/Courses';
import Students from './components/Students';
import Performance from './components/Performance';
import VideoUpload from './components/VideoUpload';
import OnlineClasses from './components/OnlineClasses';
import Playground from './components/Playground';
import Assignments from './components/Assignments';

interface User {
  name: string;
  email: string;
  role: 'teacher' | 'student';
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'courses':
        return <Courses />;
      case 'students':
        return user?.role === 'teacher' ? <Students /> : <Dashboard user={user} />;
      case 'performance':
        return <Performance />;
      case 'video-upload':
        return user?.role === 'teacher' ? <VideoUpload /> : <Dashboard user={user} />;
      case 'online-classes':
        return <OnlineClasses />;
      case 'playground':
        return <Playground />;
      case 'assignments':
        return <Assignments />;
      default:
        return <Dashboard user={user} />;
    }
  };

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-blue-600/20 rounded-full animate-blob animation-delay-4000"></div>
      </div>

      <Header user={user} onLogout={handleLogout} />
      
      <div className="flex">
        <Sidebar 
          userRole={user.role} 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />
        
        <main className="flex-1 ml-64 p-8 relative z-10">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;