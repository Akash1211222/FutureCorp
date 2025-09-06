import { prisma } from '../lib/prisma';

export class UsersService {
  static async getAll() {
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

  static async getById(id: string) {
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

  static async updateRole(id: string, role: 'STUDENT' | 'TEACHER' | 'ADMIN') {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
  }

  static async delete(id: string) {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return await prisma.user.delete({
      where: { id }
    });
  }

  static async getStats() {
    const totalUsers = await prisma.user.count();
    const students = await prisma.user.count({ where: { role: 'STUDENT' } });
    const teachers = await prisma.user.count({ where: { role: 'TEACHER' } });
    const admins = await prisma.user.count({ where: { role: 'ADMIN' } });

    return {
      totalUsers,
      students,
      teachers,
      admins
    };
  }
}