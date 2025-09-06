/*
  # Initial Schema Setup for FutureCorp's Learning Management System

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `password` (text)
      - `role` (enum: STUDENT, TEACHER, ADMIN)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `assignments`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `difficulty` (text)
      - `category` (text)
      - `examples` (jsonb)
      - `constraints` (jsonb)
      - `test_cases` (jsonb)
      - `points` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `live_classes`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text, nullable)
      - `schedule` (timestamp)
      - `duration` (integer)
      - `meeting_url` (text, nullable)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `submissions`
      - `id` (uuid, primary key)
      - `assignment_id` (uuid, foreign key)
      - `student_id` (uuid, foreign key)
      - `code` (text)
      - `result` (jsonb)
      - `score` (integer, nullable)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles
*/

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  role user_role DEFAULT 'STUDENT',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL,
  category text NOT NULL,
  examples jsonb,
  constraints jsonb,
  test_cases jsonb,
  points integer DEFAULT 100,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create live_classes table
CREATE TABLE IF NOT EXISTS live_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  schedule timestamptz NOT NULL,
  duration integer DEFAULT 60,
  meeting_url text,
  status text DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code text NOT NULL,
  result jsonb,
  score integer,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(assignment_id, student_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Admins and teachers can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('ADMIN', 'TEACHER')
    )
  );

-- Create policies for assignments table
CREATE POLICY "Everyone can read assignments"
  ON assignments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Teachers and admins can create assignments"
  ON assignments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('TEACHER', 'ADMIN')
    )
  );

CREATE POLICY "Teachers and admins can update assignments"
  ON assignments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('TEACHER', 'ADMIN')
    )
  );

-- Create policies for live_classes table
CREATE POLICY "Everyone can read live classes"
  ON live_classes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Teachers and admins can manage live classes"
  ON live_classes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('TEACHER', 'ADMIN')
    )
  );

-- Create policies for submissions table
CREATE POLICY "Students can read own submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (student_id::text = auth.uid()::text);

CREATE POLICY "Teachers and admins can read all submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('TEACHER', 'ADMIN')
    )
  );

CREATE POLICY "Students can create own submissions"
  ON submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (student_id::text = auth.uid()::text);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_assignments_category ON assignments(category);
CREATE INDEX IF NOT EXISTS idx_assignments_difficulty ON assignments(difficulty);
CREATE INDEX IF NOT EXISTS idx_live_classes_schedule ON live_classes(schedule);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment_id ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student_id ON submissions(student_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_live_classes_updated_at BEFORE UPDATE ON live_classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();