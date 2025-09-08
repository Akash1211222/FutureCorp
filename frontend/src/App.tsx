import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { ErrorBoundary } from 'react-error-boundary';

// Store providers
import { AuthProvider } from './stores/authStore';
import { LiveClassProvider } from './stores/liveClassStore';
import { LiveClassProvider } from './stores/liveClassStore';
import { ThemeProvider } from './stores/themeStore';

// Layout components
import Layout from './components/layout/Layout';
import LoadingScreen from './components/ui/LoadingScreen';
import ErrorFallback from './components/ui/ErrorFallback';

// Page components (lazy loaded for performance)
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Assignments = React.lazy(() => import('./pages/Assignments'));
const Courses = React.lazy(() => import('./pages/Courses'));
const Students = React.lazy(() => import('./pages/Students'));
const LiveClasses = React.lazy(() => import('./pages/LiveClasses'));
const Playground = React.lazy(() => import('./pages/Playground'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));

// Protected route wrapper
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider>
        <AuthProvider>
          <LiveClassProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <Suspense fallback={<LoadingScreen />}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/auth" element={<AuthPage />} />
                    
                    {/* Protected routes */}
                    <Route
                      path="/*"
                      element={
                        <ProtectedRoute>
                          <Layout>
                            <Routes>
                              <Route path="/" element={<Navigate to="/dashboard" replace />} />
                              <Route path="/dashboard" element={<Dashboard />} />
                              <Route path="/assignments" element={<Assignments />} />
                              <Route path="/courses" element={<Courses />} />
                              <Route path="/playground" element={<Playground />} />
                              <Route path="/classes" element={<LiveClasses />} />
                              <Route path="/analytics" element={<Analytics />} />
                              
                              {/* Teacher/Admin routes */}
                              <Route
                                path="/students"
                                element={
                                  <ProtectedRoute requiredRoles={['TEACHER', 'ADMIN']}>
                                    <Students />
                                  </ProtectedRoute>
                                }
                              />
                              
                              {/* Admin only routes */}
                              <Route
                                path="/admin"
                                element={
                                  <ProtectedRoute requiredRoles={['ADMIN']}>
                                    <AdminPanel />
                                  </ProtectedRoute>
                                }
                              />
                            </Routes>
                          </Layout>
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </Suspense>
              </div>
            </Router>
          </LiveClassProvider>
            </Router>
          </LiveClassProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;