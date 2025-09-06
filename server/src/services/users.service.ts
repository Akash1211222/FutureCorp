import { Role } from './auth.service.js';
import { db } from '../lib/supabase.js';

export class UsersService {
  static async getAllUsers(requestingUserRole: Role) {
    if (requestingUserRole !== Role.ADMIN && requestingUserRole !== Role.TEACHER) {
      throw new Error('Access denied');
    }

    return await db.getAllUsers();
  }

  static async getStudents() {
    const users = await db.getAllUsers();
    return users.filter(user => user.role === Role.STUDENT);
  }

  static async getUserById(id: string) {
    return await db.getUserById(id);
  }

  static async getUserStats(userId: string) {
    const user = await db.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get user submissions (simplified for now)
    const totalSubmissions = 0; // Would query submissions table
    const recentSubmissions = []; // Would query recent submissions

    return {
      totalSubmissions,
      recentSubmissions
    };
  }
}