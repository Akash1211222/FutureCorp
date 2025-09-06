import { prisma } from '../lib/prisma';
import { Role, ClassStatus } from '@prisma/client';

export interface CreateClassData {
  title: string;
  description?: string;
  course?: string;
  schedule: Date;
  duration?: number;
  studentIds?: string[];
}

export class ClassesService {
  static async createClass(data: CreateClassData, createdById: string) {
    const {
      title,
      description,
      course,
      schedule,
      duration = 60,
      studentIds = []
    } = data;

    const liveClass = await prisma.liveClass.create({
      data: {
        title,
        description,
        course,
        schedule,
        duration,
        createdById,
        meetingUrl: `https://meet.futurecorp.com/${Math.random().toString(36).substring(7)}`
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Enroll students if provided
    if (studentIds.length > 0) {
      await prisma.classEnrollment.createMany({
        data: studentIds.map(studentId => ({
          classId: liveClass.id,
          studentId
        }))
      });
    }

    return liveClass;
  }

  static async getClasses(userId: string, userRole: Role) {
    if (userRole === Role.TEACHER || userRole === Role.ADMIN) {
      // Teachers and admins see all classes
      return await prisma.liveClass.findMany({
        include: {
          createdBy: {
            select: { id: true, name: true, email: true }
          },
          enrollments: {
            include: {
              student: {
                select: { id: true, name: true, email: true }
              }
            }
          }
        },
        orderBy: { schedule: 'desc' }
      });
    } else {
      // Students see only enrolled classes
      return await prisma.liveClass.findMany({
        where: {
          enrollments: {
            some: {
              studentId: userId
            }
          }
        },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true }
          },
          enrollments: {
            where: { studentId: userId },
            include: {
              student: {
                select: { id: true, name: true, email: true }
              }
            }
          }
        },
        orderBy: { schedule: 'desc' }
      });
    }
  }

  static async getClassById(id: string, userId: string, userRole: Role) {
    const liveClass = await prisma.liveClass.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        enrollments: {
          include: {
            student: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });

    if (!liveClass) {
      throw new Error('Class not found');
    }

    // Check access permissions
    if (userRole === Role.STUDENT) {
      const isEnrolled = liveClass.enrollments.some(
        enrollment => enrollment.studentId === userId
      );
      if (!isEnrolled) {
        throw new Error('Access denied to this class');
      }
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

    if (liveClass.createdById !== userId) {
      throw new Error('Only the class creator can start the class');
    }

    return await prisma.liveClass.update({
      where: { id },
      data: { status: ClassStatus.LIVE },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        enrollments: {
          include: {
            student: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });
  }

  static async joinClass(id: string, userId: string) {
    const enrollment = await prisma.classEnrollment.findUnique({
      where: {
        classId_studentId: {
          classId: id,
          studentId: userId
        }
      }
    });

    if (!enrollment) {
      throw new Error('Not enrolled in this class');
    }

    return await prisma.classEnrollment.update({
      where: {
        classId_studentId: {
          classId: id,
          studentId: userId
        }
      },
      data: { joinedAt: new Date() },
      include: {
        class: {
          include: {
            createdBy: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });
  }
}