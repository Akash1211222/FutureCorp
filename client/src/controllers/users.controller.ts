import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { UsersService } from '../services/users.service';
import { AuthRequest } from '../middlewares/auth';

const updateRoleSchema = z.object({
  role: z.enum(['STUDENT', 'TEACHER', 'ADMIN'])
});

export class UsersController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UsersService.getAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await UsersService.getById(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateRole(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = updateRoleSchema.parse(req.body);
      const user = await UsersService.updateRole(id, validatedData.role);
      
      res.json({
        message: 'User role updated successfully',
        user
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await UsersService.delete(id);
      
      res.json({
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await UsersService.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}