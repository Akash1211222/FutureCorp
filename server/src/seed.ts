import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from './lib/prisma.js';

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
      name: 'Dr. Sarah Johnson',
      email: 'teacher@futurecorp.test',
      password: teacherPassword,
      role: 'TEACHER'
    }
  });

  const students = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Alice Johnson',
        email: 'alice@futurecorp.test',
        password: studentPassword,
        role: 'STUDENT'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Bob Wilson',
        email: 'bob@futurecorp.test',
        password: studentPassword,
        role: 'STUDENT'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Carol Davis',
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
          { input: [2, 7, 11, 15], target: 9, output: [0, 1] },
          { input: [3, 2, 4], target: 6, output: [1, 2] },
          { input: [3, 3], target: 6, output: [0, 1] }
        ])
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
          { input: "()", output: true },
          { input: "()[]{}", output: true },
          { input: "(]", output: false }
        ])
      }
    })
  ]);

  // Create live classes
  await Promise.all([
    prisma.liveClass.create({
      data: {
        title: 'Introduction to React Hooks',
        schedule: new Date('2024-01-25T10:00:00Z')
      }
    }),
    prisma.liveClass.create({
      data: {
        title: 'Advanced JavaScript Concepts',
        schedule: new Date('2024-01-26T14:00:00Z')
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