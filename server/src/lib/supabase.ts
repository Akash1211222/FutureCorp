import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if Supabase is configured
const isSupabaseConfigured = !!(supabaseUrl && supabaseServiceKey);

if (!isSupabaseConfigured) {
  console.warn('⚠️  Supabase environment variables not configured');
  console.warn('SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.warn('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Missing');
  console.warn('Server will start but database operations will fail until Supabase is configured.');
} else {
  console.log('✅ Supabase client initialized');
}

// Create Supabase client (or mock if not configured)
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseServiceKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : createMockSupabaseClient();

// Mock client for when Supabase is not configured
function createMockSupabaseClient() {
  const mockError = new Error('Supabase not configured');
  
  return {
    from: () => ({
      select: () => ({ 
        eq: () => ({ 
          single: () => Promise.resolve({ data: null, error: mockError }) 
        }),
        order: () => Promise.resolve({ data: [], error: mockError })
      }),
      insert: () => ({ 
        select: () => ({ 
          single: () => Promise.resolve({ data: null, error: mockError }) 
        }) 
      }),
      update: () => ({ 
        select: () => ({ 
          single: () => Promise.resolve({ data: null, error: mockError }) 
        }) 
      }),
      delete: () => Promise.resolve({ data: null, error: mockError })
    })
  };
}

// Database helper functions
export const db = {
  // Users
  async createUser(userData: any) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserByEmail(email: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async getUserById(id: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAllUsers() {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Assignments
  async createAssignment(assignmentData: any) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('assignments')
      .insert(assignmentData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAllAssignments() {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getAssignmentById(id: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Submissions
  async createSubmission(submissionData: any) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('submissions')
      .insert(submissionData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getSubmissionsByAssignment(assignmentId: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        student:users(id, name, email)
      `)
      .eq('assignment_id', assignmentId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Live Classes
  async createLiveClass(classData: any) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('live_classes')
      .insert(classData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAllLiveClasses() {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('live_classes')
      .select('*')
      .order('schedule', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getLiveClassById(id: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('live_classes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
};