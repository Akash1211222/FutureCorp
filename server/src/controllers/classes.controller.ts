import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { ClassesService } from '../services/classes.service.js';
import { AuthRequest } from '../middlewares/auth.js';

const createClassSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  course: z.string().optional(),
  schedule: z.string().datetime('Invalid schedule format'),
  duration: z.number().positive().optional()
});

export class ClassesController {
  static async createClass(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = createClassSchema.parse(req.body);
      const schedule = new Date(validatedData.schedule);
      
      const liveClass = await ClassesService.createClass({
        ...validatedData,
        schedule
      });
      
      res.status(201).json({
        message: 'Class created successfully',
        class: liveClass
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          errors: error.errors
        });
      }
      next(error);
    }
  }

  static async getClasses(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const classes = await ClassesService.getClasses(
        req.user!.id,
        req.user!.role
      );
      
      res.json(classes);
    } catch (error) {
      next(error);
    }
  }

  static async getClassById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const liveClass = await ClassesService.getClassById(id);
      
      res.json(liveClass);
    } catch (error) {
      next(error);
    }
  }

  static async startClass(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const liveClass = await ClassesService.startClass(id, req.user!.id);
      
      res.json({
        message: 'Class started successfully',
        class: liveClass
      });
    } catch (error) {
      next(error);
    }
  }

  static async joinClass(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const liveClass = await ClassesService.joinClass(id, req.user!.id);
      
      res.json({
        message: 'Joined class successfully',
        class: liveClass
      });
    } catch (error) {
      next(error);
    }
  }
}