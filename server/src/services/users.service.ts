import { prisma } from '../lib/prisma';
import { Role } from '@prisma/client';

export class UsersService {
  static async getAllUsers(requestingUserRole: Role) {
    if (requestingUserRole !== Role.ADMIN && requestingUserRole !== Role.TEACHER) {
      throw new Error('Access denied');
    }

    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getStudents() {
    return await prisma.user.findMany({
      where: { role: Role.STUDENT },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { name: 'asc' }
    });
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  static async getUserStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        submissions: {
          include: {
            assignment: {
              select: { title: true, points: true }
            }
          }
        },
        assignmentAssigned: {
          include: {
            assignment: {
              select: { title: true, points: true }
            }
          }
        },
        classEnrollments: {
          include: {
            class: {
              select: { title: true, schedule: true }
            }
          }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const totalAssignments = user.assignmentAssigned.length;
    const completedAssignments = user.submissions.filter(s => s.passed).length;
    const totalScore = user.submissions.reduce((sum, s) => sum + (s.score || 0), 0);
    const averageScore = user.submissions.length > 0 
      ? Math.round(totalScore / user.submissions.length) 
      : 0;

    return {
      totalAssignments,
      completedAssignments,
      totalScore,
      averageScore,
      enrolledClasses: user.classEnrollments.length,
      recentSubmissions: user.submissions.slice(-5)
    };
  }
}