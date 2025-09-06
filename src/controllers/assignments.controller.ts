import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AssignmentsService } from '../services/assignments.service';
import { AuthRequest } from '../middlewares/auth';

const createAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.string().min(1, 'Difficulty is required'),
  category: z.string().min(1, 'Category is required'),
  examples: z.any().optional(),
  constraints: z.any().optional(),
  testCases: z.any().optional()
});

const submitSolutionSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  result: z.any().optional()
});

export class AssignmentsController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const assignments = await AssignmentsService.getAll();
      res.json(assignments);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const assignment = await AssignmentsService.getById(id);
      res.json(assignment);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = createAssignmentSchema.parse(req.body);
      const assignment = await AssignmentsService.create(validatedData);
      
      res.status(201).json({
        message: 'Assignment created successfully',
        assignment
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = createAssignmentSchema.partial().parse(req.body);
      const assignment = await AssignmentsService.update(id, validatedData);
      
      res.json({
        message: 'Assignment updated successfully',
        assignment
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await AssignmentsService.delete(id);
      
      res.json({
        message: 'Assignment deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async submitSolution(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = submitSolutionSchema.parse(req.body);
      
      if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const submission = await AssignmentsService.submitSolution(
        id,
        req.user.id,
        validatedData.code,
        validatedData.result
      );
      
      res.status(201).json({
        message: 'Solution submitted successfully',
        submission
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSubmissions(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const submissions = await AssignmentsService.getSubmissions(id);
      res.json(submissions);
    } catch (error) {
      next(error);
    }
  }
}