import { prisma } from '../lib/prisma.js';
import { Role } from '@prisma/client';

export interface CreateAssignmentData {
  title: string;
  description: string;
  difficulty: string;
  category: string;
  examples?: any;
  constraints?: any;
  testCases?: any;
}

export interface SubmitSolutionData {
  assignmentId: string;
  code: string;
  studentId: string;
}

export class AssignmentsService {
  static async createAssignment(data: CreateAssignmentData) {
    const {
      title,
      description,
      difficulty,
      category,
      examples,
      constraints,
      testCases
    } = data;

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        difficulty,
        category,
        examples: examples ? JSON.stringify(examples) : null,
        constraints: constraints ? JSON.stringify(constraints) : null,
        testCases: testCases ? JSON.stringify(testCases) : null
      }
    });

    return assignment;
  }

  static async getAssignments(userId: string, userRole: Role) {
    return await prisma.assignment.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getAssignmentById(id: string) {
    const assignment = await prisma.assignment.findUnique({
      where: { id }
    });

    if (!assignment) {
      throw new Error('Assignment not found');
    }

    return assignment;
  }

  static async submitSolution(data: SubmitSolutionData) {
    const { assignmentId, code, studentId } = data;

    // Check if assignment exists
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId }
    });

    if (!assignment) {
      throw new Error('Assignment not found');
    }

    // Simulate code execution and testing
    const testResults = this.simulateCodeExecution(code);

    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        studentId,
        code,
        result: JSON.stringify(testResults)
      }
    });

    return submission;
  }

  private static simulateCodeExecution(code: string) {
    // Simple simulation - in real app, this would run actual tests
    const passed = Math.random() > 0.3; // 70% pass rate for demo
    const score = passed ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 60);

    return {
      passed,
      score,
      message: passed ? 'All tests passed!' : 'Some tests failed'
    };
  }
}