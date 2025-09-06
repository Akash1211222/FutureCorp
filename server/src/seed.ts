import bcrypt from 'bcryptjs';
import { prisma } from './lib/prisma';
import { Role, AssignmentStatus, ClassStatus } from '@prisma/client';

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.submission.deleteMany();
  await prisma.assignmentStudent.deleteMany();
  await prisma.classEnrollment.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.liveClass.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('Admin@123', 12);
  const studentPassword = await bcrypt.hash('Student@123', 12);
  const teacherPassword = await bcrypt.hash('Teacher@123', 12);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@futurecorp.test',
      password: hashedPassword,
      role: Role.ADMIN
    }
  });

  const teacher = await prisma.user.create({
    data: {
      name: 'Dr. Sarah Johnson',
      email: 'teacher@futurecorp.test',
      password: teacherPassword,
      role: Role.TEACHER
    }
  });

  const students = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Alice Johnson',
        email: 'alice@futurecorp.test',
        password: studentPassword,
        role: Role.STUDENT
      }
    }),
    prisma.user.create({
      data: {
        name: 'Bob Wilson',
        email: 'bob@futurecorp.test',
        password: studentPassword,
        role: Role.STUDENT
      }
    }),
    prisma.user.create({
      data: {
        name: 'Carol Davis',
        email: 'carol@futurecorp.test',
        password: studentPassword,
        role: Role.STUDENT
      }
    })
  ]);

  // Create sample assignments
  const assignments = await Promise.all([
    prisma.assignment.create({
      data: {
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        difficulty: 'Easy',
        category: 'Array',
        examples: JSON.stringify([
          {
            input: 'nums = [2,7,11,15], target = 9',
            output: '[0,1]',
            explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
          }
        ]),
        constraints: JSON.stringify([
          '2 <= nums.length <= 10^4',
          '-10^9 <= nums[i] <= 10^9',
          '-10^9 <= target <= 10^9'
        ]),
        testCases: JSON.stringify([
          { input: '[2,7,11,15], 9', output: '[0,1]', isPublic: true },
          { input: '[3,2,4], 6', output: '[1,2]', isPublic: true },
          { input: '[3,3], 6', output: '[0,1]', isPublic: false }
        ]),
        hints: JSON.stringify([
          'Think about using a hash map to store numbers you\'ve seen',
          'For each number, check if target - number exists in the hash map',
          'Store the index along with the number in the hash map'
        ]),
        points: 100,
        createdById: teacher.id
      }
    }),
    prisma.assignment.create({
      data: {
        title: 'Valid Parentheses',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
        difficulty: 'Easy',
        category: 'Stack',
        examples: JSON.stringify([
          { input: 's = "()"', output: 'true' },
          { input: 's = "()[]{}"', output: 'true' },
          { input: 's = "(]"', output: 'false' }
        ]),
        constraints: JSON.stringify([
          '1 <= s.length <= 10^4',
          's consists of parentheses only \'()[]{}\''
        ]),
        testCases: JSON.stringify([
          { input: '"()"', output: 'true', isPublic: true },
          { input: '"()[]{}"', output: 'true', isPublic: true },
          { input: '"(]"', output: 'false', isPublic: false }
        ]),
        hints: JSON.stringify([
          'Use a stack data structure',
          'Push opening brackets onto the stack',
          'When you see a closing bracket, check if it matches the top of the stack'
        ]),
        points: 100,
        createdById: teacher.id
      }
    })
  ]);

  // Assign assignments to students
  for (const assignment of assignments) {
    for (const student of students) {
      await prisma.assignmentStudent.create({
        data: {
          assignmentId: assignment.id,
          studentId: student.id,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        }
      });
    }
  }

  // Create sample live classes
  const liveClass = await prisma.liveClass.create({
    data: {
      title: 'Advanced React Hooks',
      description: 'Deep dive into React hooks and their practical applications',
      course: 'React Mastery',
      schedule: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      duration: 90,
      status: ClassStatus.SCHEDULED,
      meetingUrl: 'https://meet.futurecorp.com/react-hooks-advanced',
      createdById: teacher.id
    }
  });

  // Enroll students in the class
  for (const student of students) {
    await prisma.classEnrollment.create({
      data: {
        classId: liveClass.id,
        studentId: student.id
      }
    });
  }

  // Create some sample submissions
  await prisma.submission.create({
    data: {
      assignmentId: assignments[0].id,
      studentId: students[0].id,
      code: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
      result: JSON.stringify({
        passed: true,
        score: 100,
        totalTests: 3,
        passedTests: 3
      }),
      score: 100,
      passed: true
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📋 Default credentials:');
  console.log('Admin: admin@futurecorp.test / Admin@123');
  console.log('Teacher: teacher@futurecorp.test / Teacher@123');
  console.log('Student: alice@futurecorp.test / Student@123');
  console.log('Student: bob@futurecorp.test / Student@123');
  console.log('Student: carol@futurecorp.test / Student@123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });