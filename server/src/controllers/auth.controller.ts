import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService, RegisterData, LoginData } from '../services/auth.service.js';
import { AuthRequest } from '../middlewares/auth.js';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']).optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const registerData: RegisterData = {
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password,
        role: validatedData.role as any || 'STUDENT' as any
      };
      const result = await AuthService.register(registerData);
      res.status(201).json({ message: 'User registered successfully', ...result });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const loginData: LoginData = {
        email: validatedData.email,
        password: validatedData.password
      };
      const result = await AuthService.login(loginData);
      res.json({ message: 'Login successful', ...result });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      next(error);
    }
  }

  static async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      const user = await AuthService.getProfile(req.user.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}
