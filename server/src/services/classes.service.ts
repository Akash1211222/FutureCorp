import { prisma } from '../lib/prisma.js';
import { Role } from '@prisma/client';

export interface CreateClassData {
  title: string;
  description?: string;
  course?: string;
  schedule: Date;
  duration?: number;
}

export class ClassesService {
  static async createClass(data: CreateClassData) {
    const {
      title,
      description,
      course,
      schedule,
      duration = 60
    } = data;

    const liveClass = await prisma.liveClass.create({
      data: {
        title,
        schedule
      }
    });

    return liveClass;
  }

  static async getClasses(userId: string, userRole: Role) {
    return await prisma.liveClass.findMany({
      orderBy: { schedule: 'desc' }
    });
  }

  static async getClassById(id: string) {
    const liveClass = await prisma.liveClass.findUnique({
      where: { id }
    });

    if (!liveClass) {
      throw new Error('Class not found');
    }

    return liveClass;
  }

  static async startClass(id: string, userId: string) {
    const liveClass = await prisma.liveClass.findUnique({
      where: { id }
    });

    if (!liveClass) {
      throw new Error('Class not found');
    }

    return liveClass;
  }

  static async joinClass(id: string, userId: string) {
    const liveClass = await prisma.liveClass.findUnique({
      where: { id }
    });

    if (!liveClass) {
      throw new Error('Class not found');
    }

    return liveClass;
  }
}