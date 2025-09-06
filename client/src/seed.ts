import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.liveClass.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('Admin@123', 12);
  const teacherPassword = await bcrypt.hash('Teacher@123', 12);
  const studentPassword = await bcrypt.hash('Student@123', 12);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@futurecorp.test',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  const teacher = await prisma.user.create({
    data: {
      name: 'John Teacher',
      email: 'teacher@futurecorp.test',
      password: teacherPassword,
      role: 'TEACHER'
    }
  });

  const students = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Alice Student',
        email: 'alice@futurecorp.test',
        password: studentPassword,
        role: 'STUDENT'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Bob Student',
        email: 'bob@futurecorp.test',
        password: studentPassword,
        role: 'STUDENT'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Carol Student',
        email: 'carol@futurecorp.test',
        password: studentPassword,
        role: 'STUDENT'
      }
    })
  ]);

  // Create assignments
  const assignments = await Promise.all([
    prisma.assignment.create({
      data: {
        title: 'Two Sum',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        difficulty: 'Easy',
        category: 'Array',
        examples: [
          {
            input: 'nums = [2,7,11,15], target = 9',
            output: '[0,1]',
            explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
          }
        ],
        constraints: [
          '2 <= nums.length <= 10^4',
          '-10^9 <= nums[i] <= 10^9',
          '-10^9 <= target <= 10^9',
          'Only one valid answer exists.'
        ],
        testCases: [
          { input: { nums: [2, 7, 11, 15], target: 9 }, output: [0, 1] },
          { input: { nums: [3, 2, 4], target: 6 }, output: [1, 2] },
          { input: { nums: [3, 3], target: 6 }, output: [0, 1] }
        ]
      }
    }),
    prisma.assignment.create({
      data: {
        title: 'Valid Parentheses',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
        difficulty: 'Easy',
        category: 'Stack',
        examples: [
          {
            input: 's = "()"',
            output: 'true'
          },
          {
            input: 's = "()[]{}"',
            output: 'true'
          },
          {
            input: 's = "(]"',
            output: 'false'
          }
        ],
        constraints: [
          '1 <= s.length <= 10^4',
          's consists of parentheses only \'()[]{}\''
        ],
        testCases: [
          { input: { s: "()" }, output: true },
          { input: { s: "()[]{}" }, output: true },
          { input: { s: "(]" }, output: false }
        ]
      }
    }),
    prisma.assignment.create({
      data: {
        title: 'Merge Two Sorted Lists',
        description: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list.',
        difficulty: 'Easy',
        category: 'Linked List',
        examples: [
          {
            input: 'list1 = [1,2,4], list2 = [1,3,4]',
            output: '[1,1,2,3,4,4]'
          }
        ],
        constraints: [
          'The number of nodes in both lists is in the range [0, 50]',
          '-100 <= Node.val <= 100',
          'Both list1 and list2 are sorted in non-decreasing order'
        ],
        testCases: [
          { input: { list1: [1, 2, 4], list2: [1, 3, 4] }, output: [1, 1, 2, 3, 4, 4] }
        ]
      }
    })
  ]);

  // Create live classes
  const liveClasses = await Promise.all([
    prisma.liveClass.create({
      data: {
        title: 'Introduction to Data Structures',
        schedule: new Date('2024-01-15T10:00:00Z')
      }
    }),
    prisma.liveClass.create({
      data: {
        title: 'Advanced Algorithms',
        schedule: new Date('2024-01-16T14:00:00Z')
      }
    }),
    prisma.liveClass.create({
      data: {
        title: 'System Design Basics',
        schedule: new Date('2024-01-17T16:00:00Z')
      }
    })
  ]);

  // Create some sample submissions
  await Promise.all([
    prisma.submission.create({
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
        result: { status: 'accepted', runtime: '68ms', memory: '44.1MB' }
      }
    }),
    prisma.submission.create({
      data: {
        assignmentId: assignments[1].id,
        studentId: students[1].id,
        code: `function isValid(s) {
    const stack = [];
    const pairs = { ')': '(', '}': '{', ']': '[' };
    
    for (let char of s) {
        if (char in pairs) {
            if (stack.pop() !== pairs[char]) {
                return false;
            }
        } else {
            stack.push(char);
        }
    }
    
    return stack.length === 0;
}`,
        result: { status: 'accepted', runtime: '72ms', memory: '42.3MB' }
      }
    })
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('\n📧 Default credentials:');
  console.log('Admin: admin@futurecorp.test / Admin@123');
  console.log('Teacher: teacher@futurecorp.test / Teacher@123');
  console.log('Students: alice@futurecorp.test / Student@123');
  console.log('         bob@futurecorp.test / Student@123');
  console.log('         carol@futurecorp.test / Student@123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });