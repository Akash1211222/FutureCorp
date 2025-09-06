import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import Courses from './components/Courses';
import Students from './components/Students';
import Performance from './components/Performance';
import VideoUpload from './components/VideoUpload';
import OnlineClasses from './components/OnlineClasses';
import Playground from './components/Playground';
import Assignments from './components/Assignments';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/courses" element={<Courses />} />
                      <Route path="/students" element={<Students />} />
                      <Route path="/assignments" element={<Assignments />} />
                      <Route path="/classes" element={<OnlineClasses />} />
                      <Route path="/analytics" element={<Performance />} />
                      <Route path="/videos" element={<VideoUpload />} />
                      <Route path="/playground" element={<Playground />} />
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute requiredRole="ADMIN">
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;