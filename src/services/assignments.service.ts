import { prisma } from '../lib/prisma';

export interface CreateAssignmentData {
  title: string;
  description: string;
  difficulty: string;
  category: string;
  examples?: any;
  constraints?: any;
  testCases?: any;
}

export class AssignmentsService {
  static async getAll() {
    return await prisma.assignment.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getById(id: string) {
    const assignment = await prisma.assignment.findUnique({
      where: { id }
    });

    if (!assignment) {
      throw new Error('Assignment not found');
    }

    return assignment;
  }

  static async create(data: CreateAssignmentData) {
    return await prisma.assignment.create({
      data
    });
  }

  static async update(id: string, data: Partial<CreateAssignmentData>) {
    const assignment = await prisma.assignment.findUnique({
      where: { id }
    });

    if (!assignment) {
      throw new Error('Assignment not found');
    }

    return await prisma.assignment.update({
      where: { id },
      data
    });
  }

  static async delete(id: string) {
    const assignment = await prisma.assignment.findUnique({
      where: { id }
    });

    if (!assignment) {
      throw new Error('Assignment not found');
    }

    return await prisma.assignment.delete({
      where: { id }
    });
  }

  static async submitSolution(assignmentId: string, studentId: string, code: string, result?: any) {
    return await prisma.submission.create({
      data: {
        assignmentId,
        studentId,
        code,
        result
      }
    });
  }

  static async getSubmissions(assignmentId: string) {
    return await prisma.submission.findMany({
      where: { assignmentId },
      include: {
        student: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}