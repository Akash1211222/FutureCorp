import { prisma } from '../lib/prisma';

export interface CreateClassData {
  title: string;
  schedule: Date;
}

export class ClassesService {
  static async getAll() {
    return await prisma.liveClass.findMany({
      orderBy: { schedule: 'asc' }
    });
  }

  static async getById(id: string) {
    const liveClass = await prisma.liveClass.findUnique({
      where: { id }
    });

    if (!liveClass) {
      throw new Error('Class not found');
    }

    return liveClass;
  }

  static async create(data: CreateClassData) {
    return await prisma.liveClass.create({
      data
    });
  }

  static async update(id: string, data: Partial<CreateClassData>) {
    const liveClass = await prisma.liveClass.findUnique({
      where: { id }
    });

    if (!liveClass) {
      throw new Error('Class not found');
    }

    return await prisma.liveClass.update({
      where: { id },
      data
    });
  }

  static async delete(id: string) {
    const liveClass = await prisma.liveClass.findUnique({
      where: { id }
    });

    if (!liveClass) {
      throw new Error('Class not found');
    }

    return await prisma.liveClass.delete({
      where: { id }
    });
  }
}