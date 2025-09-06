import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../lib/supabase.js';

// Define the Role enum locally since we're using Supabase
export enum Role {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  static async register(data: RegisterData) {
    const { name, email, password, role = Role.STUDENT } = data;

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await db.createUser({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    );

    return { user: userWithoutPassword, accessToken: token };
  }

  static async login(data: LoginData) {
    const { email, password } = data;

    // Find user
    const user = await db.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, accessToken: token };
  }

  static async getProfile(userId: string) {
    const user = await db.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}