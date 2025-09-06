import { prisma } from '../lib/prisma.js';
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
      where: { id: userId },
      include: {
        submissions: {
          include: {
            assignment: {
              select: { title: true }
            }
          }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const totalSubmissions = user.submissions.length;
    const recentSubmissions = user.submissions.slice(-5);

    return {
      totalSubmissions,
      recentSubmissions
    };
  }
}