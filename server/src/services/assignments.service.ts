import { Role } from '@prisma/client';
import { db } from '../lib/supabase.js';

export interface CreateAssignmentData {
  title: string;
  description: string;
  difficulty: string;
  category: string;
  examples?: any;
  constraints?: any;
  testCases?: any;
  points?: number;
}

export interface SubmitSolutionData {
  assignmentId: string;
  code: string;
  studentId: string;
}

export class AssignmentsService {
  static async createAssignment(data: CreateAssignmentData) {
    const assignment = await db.createAssignment({
      ...data,
      examples: data.examples ? JSON.stringify(data.examples) : null,
      constraints: data.constraints ? JSON.stringify(data.constraints) : null,
      testCases: data.testCases ? JSON.stringify(data.testCases) : null,
      points: data.points || 100
    });

    return assignment;
  }

  static async getAssignments(userId: string, userRole: Role) {
    const assignments = await db.getAllAssignments();
    
    // Parse JSON fields
    return assignments.map(assignment => ({
      ...assignment,
      examples: assignment.examples ? JSON.parse(assignment.examples) : null,
      constraints: assignment.constraints ? JSON.parse(assignment.constraints) : null,
      testCases: assignment.testCases ? JSON.parse(assignment.testCases) : null
    }));
  }

  static async getAssignmentById(id: string) {
    const assignment = await db.getAssignmentById(id);
    
    // Parse JSON fields
    return {
      ...assignment,
      examples: assignment.examples ? JSON.parse(assignment.examples) : null,
      constraints: assignment.constraints ? JSON.parse(assignment.constraints) : null,
      testCases: assignment.testCases ? JSON.parse(assignment.testCases) : null
    };
  }

  static async submitSolution(data: SubmitSolutionData) {
    const { assignmentId, code, studentId } = data;

    // Check if assignment exists
    const assignment = await db.getAssignmentById(assignmentId);
    if (!assignment) {
      throw new Error('Assignment not found');
    }

    // Simulate code execution and testing
    const testResults = this.simulateCodeExecution(code);

    const submission = await db.createSubmission({
      assignment_id: assignmentId,
      student_id: studentId,
      code,
      result: JSON.stringify(testResults),
      score: testResults.score,
      status: testResults.passed ? 'passed' : 'failed'
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
      message: passed ? 'All tests passed!' : 'Some tests failed',
      executionTime: Math.floor(Math.random() * 1000) + 100 // ms
    };
  }

  static async getSubmissions(assignmentId: string) {
    return await db.getSubmissionsByAssignment(assignmentId);
  }
}