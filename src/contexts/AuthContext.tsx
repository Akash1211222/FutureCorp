import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';
import { SecurityUtils } from '../utils/security';
import { useToast } from '../components/Toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
  }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      try {
        logger.info('Initializing authentication');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          logger.info('Found existing session', { userId: session.user.id });
          // Get user profile from our users table
          const { data: userData, error } = await supabase
            .from('users')
            .select('id, name, email, role')
            .eq('id', session.user.id)
            .single();

          if (userData && !error) {
            setUser(userData);
            logger.info('User profile loaded', { userId: userData.id, role: userData.role });
          }
        }
      } catch (error) {
        logger.error('Auth initialization failed', { error });
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      logger.info('Auth state changed', { event });
      
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('id, name, email, role')
          .eq('id', session.user.id)
          .single();

        if (userData) {
          setUser(userData);
          showToast({
            type: 'success',
            title: 'Welcome back!',
            message: `Signed in as ${userData.name}`
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        SecurityUtils.clearSecureToken();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // Rate limiting
    if (SecurityUtils.isRateLimited('login', 5, 15 * 60 * 1000)) {
      throw new Error('Too many login attempts. Please try again in 15 minutes.');
    }

    // Input validation
    if (!SecurityUtils.validateInput(email, 'email')) {
      throw new Error('Please enter a valid email address');
    }

    try {
      logger.info('Attempting login', { email });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, name, email, role')
          .eq('email', email)
          .single();

        if (userError) throw userError;
        if (userData) {
          setUser(userData);
          logger.info('Login successful', { userId: userData.id, role: userData.role });
        }
      }
    } catch (error: any) {
      logger.error('Login failed', { email, error: error.message });
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
  }) => {
    // Input validation
    if (!SecurityUtils.validateInput(userData.email, 'email')) {
      throw new Error('Please enter a valid email address');
    }
    if (!SecurityUtils.validateInput(userData.name, 'name')) {
      throw new Error('Please enter a valid name (letters and spaces only)');
    }
    if (!SecurityUtils.validateInput(userData.password, 'password')) {
      throw new Error('Password must be at least 8 characters with uppercase, lowercase, and number');
    }

    try {
      logger.info('Attempting registration', { email: userData.email, role: userData.role });
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Then create the user profile in our users table
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            name: userData.name,
            email: userData.email,
            password: '', // We don't store password in our table since Supabase handles auth
            role: userData.role || 'STUDENT',
          })
          .select('id, name, email, role')
          .single();

        if (profileError) throw profileError;
        if (profileData) {
          setUser(profileData);
          logger.info('Registration successful', { userId: profileData.id, role: profileData.role });
          showToast({
            type: 'success',
            title: 'Account created!',
            message: `Welcome to FutureCorp's Learning Platform, ${profileData.name}!`
          });
        }
      }
    } catch (error: any) {
      logger.error('Registration failed', { email: userData.email, error: error.message });
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      logger.info('User logging out', { userId: user?.id });
      await supabase.auth.signOut();
      setUser(null);
      showToast({
        type: 'info',
        title: 'Signed out',
        message: 'You have been successfully signed out'
      });
    } catch (error) {
      logger.error('Logout failed', { error });
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};