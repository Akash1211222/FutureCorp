import { prisma } from '../lib/prisma';
import { Role } from '@prisma/client';

export interface CreateAssignmentData {
  title: string;
  description: string;
  difficulty: string;
  category: string;
  examples?: any;
  constraints?: any;
  testCases?: any;
  hints?: any;
  points?: number;
  studentIds?: string[];
  dueDate?: Date;
}

export interface SubmitSolutionData {
  assignmentId: string;
  code: string;
  studentId: string;
}

export class AssignmentsService {
  static async createAssignment(data: CreateAssignmentData, createdById: string) {
    const {
      title,
      description,
      difficulty,
      category,
      examples,
      constraints,
      testCases,
      hints,
      points = 100,
      studentIds = [],
      dueDate
    } = data;

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        difficulty,
        category,
        examples: examples ? JSON.stringify(examples) : null,
        constraints: constraints ? JSON.stringify(constraints) : null,
        testCases: testCases ? JSON.stringify(testCases) : null,
        hints: hints ? JSON.stringify(hints) : null,
        points,
        createdById
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Assign to students if provided
    if (studentIds.length > 0) {
      await prisma.assignmentStudent.createMany({
        data: studentIds.map(studentId => ({
          assignmentId: assignment.id,
          studentId,
          dueDate
        }))
      });
    }

    return assignment;
  }

  static async getAssignments(userId: string, userRole: Role) {
    if (userRole === Role.TEACHER || userRole === Role.ADMIN) {
      // Teachers and admins see all assignments
      return await prisma.assignment.findMany({
        include: {
          createdBy: {
            select: { id: true, name: true, email: true }
          },
          assignedStudents: {
            include: {
              student: {
                select: { id: true, name: true, email: true }
              }
            }
          },
          submissions: {
            include: {
              student: {
                select: { id: true, name: true, email: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      // Students see only assigned assignments
      return await prisma.assignment.findMany({
        where: {
          assignedStudents: {
            some: {
              studentId: userId
            }
          }
        },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true }
          },
          submissions: {
            where: { studentId: userId },
            include: {
              student: {
                select: { id: true, name: true, email: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }
  }

  static async getAssignmentById(id: string, userId: string, userRole: Role) {
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        assignedStudents: {
          include: {
            student: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        submissions: {
          include: {
            student: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    if (!assignment) {
      throw new Error('Assignment not found');
    }

    // Check access permissions
    if (userRole === Role.STUDENT) {
      const isAssigned = assignment.assignedStudents.some(
        as => as.studentId === userId
      );
      if (!isAssigned) {
        throw new Error('Access denied to this assignment');
      }
    }

    return assignment;
  }

  static async submitSolution(data: SubmitSolutionData) {
    const { assignmentId, code, studentId } = data;

    // Check if assignment exists and student is assigned
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        assignedStudents: true
      }
    });

    if (!assignment) {
      throw new Error('Assignment not found');
    }

    const isAssigned = assignment.assignedStudents.some(
      as => as.studentId === studentId
    );

    if (!isAssigned) {
      throw new Error('Student not assigned to this assignment');
    }

    // Simulate code execution and testing
    const testResults = this.simulateCodeExecution(code, assignment);

    const submission = await prisma.submission.create({
      data: {
        assignmentId,
        studentId,
        code,
        result: JSON.stringify(testResults),
        score: testResults.score,
        passed: testResults.passed
      },
      include: {
        assignment: {
          select: { title: true, points: true }
        },
        student: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return submission;
  }

  private static simulateCodeExecution(code: string, assignment: any) {
    // Simple simulation - in real app, this would run actual tests
    const testCases = assignment.testCases ? JSON.parse(assignment.testCases) : [];
    const passedTests = Math.floor(Math.random() * testCases.length) + 1;
    const totalTests = testCases.length || 3;
    const passed = passedTests === totalTests;
    const score = Math.floor((passedTests / totalTests) * assignment.points);

    return {
      passed,
      score,
      totalTests,
      passedTests,
      results: testCases.map((tc: any, index: number) => ({
        input: tc.input,
        expected: tc.output,
        actual: index < passedTests ? tc.output : 'Wrong Answer',
        passed: index < passedTests
      }))
    };
  }
}