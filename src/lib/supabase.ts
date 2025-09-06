import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          password: string;
          role: 'STUDENT' | 'TEACHER' | 'ADMIN';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          password: string;
          role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          password?: string;
          role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
          updated_at?: string;
        };
      };
      assignments: {
        Row: {
          id: string;
          title: string;
          description: string;
          difficulty: string;
          category: string;
          examples: any;
          constraints: any;
          test_cases: any;
          points: number;
          created_at: string;
          updated_at: string;
        };
      };
      live_classes: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          schedule: string;
          duration: number;
          meeting_url: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
      };
      submissions: {
        Row: {
          id: string;
          assignment_id: string;
          student_id: string;
          code: string;
          result: any;
          score: number | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}