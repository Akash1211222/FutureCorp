import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ClassesService } from '../services/classes.service';
import { AuthRequest } from '../middlewares/auth';

const createClassSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  schedule: z.string().transform((str) => new Date(str))
});

export class ClassesController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const classes = await ClassesService.getAll();
      res.json(classes);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const liveClass = await ClassesService.getById(id);
      res.json(liveClass);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = createClassSchema.parse(req.body);
      const liveClass = await ClassesService.create(validatedData);
      
      res.status(201).json({
        message: 'Class created successfully',
        class: liveClass
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = createClassSchema.partial().parse(req.body);
      const liveClass = await ClassesService.update(id, validatedData);
      
      res.json({
        message: 'Class updated successfully',
        class: liveClass
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ClassesService.delete(id);
      
      res.json({
        message: 'Class deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}