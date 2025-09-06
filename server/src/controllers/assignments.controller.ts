import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AssignmentsService } from '../services/assignments.service.js';
import { AuthRequest } from '../middlewares/auth.js';

const createAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  category: z.string().min(1, 'Category is required'),
  examples: z.any().optional(),
  constraints: z.any().optional(),
  testCases: z.any().optional()
});

const submitSolutionSchema = z.object({
  assignmentId: z.string().min(1, 'Assignment ID is required'),
  code: z.string().min(1, 'Code is required')
});

export class AssignmentsController {
  static async createAssignment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = createAssignmentSchema.parse(req.body);
      const assignment = await AssignmentsService.createAssignment(validatedData);
      
      res.status(201).json({
        message: 'Assignment created successfully',
        assignment
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

  static async getAssignments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const assignments = await AssignmentsService.getAssignments(
        req.user!.id,
        req.user!.role
      );
      
      res.json(assignments);
    } catch (error) {
      next(error);
    }
  }

  static async getAssignmentById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const assignment = await AssignmentsService.getAssignmentById(id);
      
      res.json(assignment);
    } catch (error) {
      next(error);
    }
  }

  static async submitSolution(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validatedData = submitSolutionSchema.parse(req.body);
      const submission = await AssignmentsService.submitSolution({
        ...validatedData,
        studentId: req.user!.id
      });
      
      res.status(201).json({
        message: 'Solution submitted successfully',
        submission
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
}