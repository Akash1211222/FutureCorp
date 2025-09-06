import { Response, NextFunction } from 'express';
import { UsersService } from '../services/users.service.js';
import { AuthRequest } from '../middlewares/auth.js';

export class UsersController {
  static async getAllUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const users = await UsersService.getAllUsers(req.user!.role);
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  static async getStudents(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const students = await UsersService.getStudents();
      res.json(students);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await UsersService.getUserById(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  static async getUserStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const stats = await UsersService.getUserStats(id);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}