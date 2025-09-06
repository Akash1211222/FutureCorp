import { Role } from '@prisma/client';
import { db } from '../lib/supabase.js';

export interface CreateClassData {
  title: string;
  description?: string;
  schedule: Date;
  duration?: number;
  meetingUrl?: string;
}

export class ClassesService {
  static async createClass(data: CreateClassData) {
    const liveClass = await db.createLiveClass({
      title: data.title,
      description: data.description || null,
      schedule: data.schedule.toISOString(),
      duration: data.duration || 60,
      meeting_url: data.meetingUrl || null,
      status: 'scheduled'
    });

    return liveClass;
  }

  static async getClasses(userId: string, userRole: Role) {
    return await db.getAllLiveClasses();
  }

  static async getClassById(id: string) {
    return await db.getLiveClassById(id);
  }

  static async startClass(id: string, userId: string) {
    const liveClass = await db.getLiveClassById(id);
    if (!liveClass) {
      throw new Error('Class not found');
    }

    // In a real implementation, you would update the class status
    // For now, just return the class
    return liveClass;
  }

  static async joinClass(id: string, userId: string) {
    const liveClass = await db.getLiveClassById(id);
    if (!liveClass) {
      throw new Error('Class not found');
    }

    return liveClass;
  }
}