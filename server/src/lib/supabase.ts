import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Database helper functions
export const db = {
  // Users
  async createUser(userData: any) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Assignments
  async createAssignment(assignmentData: any) {
    const { data, error } = await supabase
      .from('assignments')
      .insert(assignmentData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAllAssignments() {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getAssignmentById(id: string) {
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
    const { data, error } = await supabase
      .from('submissions')
      .insert(submissionData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getSubmissionsByAssignment(assignmentId: string) {
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
    const { data, error } = await supabase
      .from('live_classes')
      .insert(classData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAllLiveClasses() {
    const { data, error } = await supabase
      .from('live_classes')
      .select('*')
      .order('schedule', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async getLiveClassById(id: string) {
    const { data, error } = await supabase
      .from('live_classes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
};