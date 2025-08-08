import React, { useState } from 'react';
import { 
  BookOpen, 
  Code, 
  Play, 
  CheckCircle, 
  Clock, 
  Trophy, 
  Lightbulb,
  Plus,
  Filter,
  Search,
  Target,
  Award,
  Users
} from 'lucide-react';

interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

interface DSAProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  testCases: TestCase[];
  hints: string[];
  timeLimit: number; // in seconds
  memoryLimit: string;
  solved?: boolean;
  attempts?: number;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  problems: string[]; // problem IDs
  totalPoints: number;
  assignedStudents?: string[]; // student IDs
  createdDate?: string;
  submitted?: boolean;
  score?: number;
}

const Assignments: React.FC = () => {
  const [userRole] = useState<'teacher' | 'student'>('teacher'); // Can be changed based on actual user
  const [selectedProblem, setSelectedProblem] = useState<DSAProblem | null>(null);
  const [code, setCode] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    selectedStudents: [] as string[],
    problems: [] as string[]
  });

  // Mock student data for assignment
  const [students] = useState([
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
    { id: '2', name: 'Bob Wilson', email: 'bob@example.com' },
    { id: '3', name: 'Carol Davis', email: 'carol@example.com' },
    { id: '4', name: 'David Brown', email: 'david@example.com' },
    { id: '5', name: 'Emma Taylor', email: 'emma@example.com' },
  ]);

  const [teacherAssignments, setTeacherAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Basic Data Structures',
      description: 'Practice fundamental data structure problems including arrays, stacks, and basic algorithms.',
      dueDate: '2024-01-25',
      problems: ['1', '2', '3'],
      totalPoints: 300,
      assignedStudents: ['1', '2', '3', '4', '5'],
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'Advanced Algorithms',
      description: 'Solve complex algorithmic problems involving dynamic programming and tree traversals.',
      dueDate: '2024-01-30',
      problems: ['4', '5'],
      totalPoints: 200,
      assignedStudents: ['1', '3', '5'],
      createdDate: '2024-01-18'
    }
  ]);

  const dsaProblems: DSAProblem[] = [
    {
      id: '1',
      title: 'Two Sum',
      difficulty: 'Easy',
      category: 'Array',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      constraints: [
        '2 ≤ nums.length ≤ 10⁴',
        '-10⁹ ≤ nums[i] ≤ 10⁹',
        '-10⁹ ≤ target ≤ 10⁹',
        'Only one valid answer exists.'
      ],
      examples: [
        {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0,1]',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
        }
      ],
      testCases: [
        { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
        { input: '[3,2,4]\n6', expectedOutput: '[1,2]' },
        { input: '[3,3]\n6', expectedOutput: '[0,1]', isHidden: true }
      ],
      hints: [
        'Try using a hash map to store the numbers you\'ve seen.',
        'For each number, check if target - number exists in the hash map.',
        'Don\'t forget to return the indices, not the values!'
      ],
      timeLimit: 60,
      memoryLimit: '256 MB',
      solved: true,
      attempts: 3
    },
    {
      id: '2',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      category: 'Stack',
      description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
      constraints: [
        '1 ≤ s.length ≤ 10⁴',
        's consists of parentheses only \'()[]{}\''
      ],
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
      testCases: [
        { input: '()', expectedOutput: 'true' },
        { input: '()[]{]', expectedOutput: 'true' },
        { input: '(]', expectedOutput: 'false' },
        { input: '([)]', expectedOutput: 'false', isHidden: true }
      ],
      hints: [
        'Use a stack data structure to keep track of opening brackets.',
        'When you encounter a closing bracket, check if it matches the most recent opening bracket.',
        'The string is valid if the stack is empty at the end.'
      ],
      timeLimit: 45,
      memoryLimit: '256 MB'
    },
    {
      id: '3',
      title: 'Merge Two Sorted Lists',
      difficulty: 'Easy',
      category: 'Linked List',
      description: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list.',
      constraints: [
        'The number of nodes in both lists is in the range [0, 50]',
        '-100 ≤ Node.val ≤ 100',
        'Both list1 and list2 are sorted in non-decreasing order'
      ],
      examples: [
        {
          input: 'list1 = [1,2,4], list2 = [1,3,4]',
          output: '[1,1,2,3,4,4]'
        }
      ],
      testCases: [
        { input: '[1,2,4]\n[1,3,4]', expectedOutput: '[1,1,2,3,4,4]' },
        { input: '[]\n[]', expectedOutput: '[]' },
        { input: '[]\n[0]', expectedOutput: '[0]', isHidden: true }
      ],
      hints: [
        'Use two pointers to traverse both lists simultaneously.',
        'Compare the values and add the smaller one to the result.',
        'Don\'t forget to handle the case when one list is exhausted.'
      ],
      timeLimit: 90,
      memoryLimit: '256 MB'
    },
    {
      id: '4',
      title: 'Maximum Subarray',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      description: 'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
      constraints: [
        '1 ≤ nums.length ≤ 10⁵',
        '-10⁴ ≤ nums[i] ≤ 10⁴'
      ],
      examples: [
        {
          input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
          output: '6',
          explanation: '[4,-1,2,1] has the largest sum = 6'
        }
      ],
      testCases: [
        { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
        { input: '[1]', expectedOutput: '1' },
        { input: '[5,4,-1,7,8]', expectedOutput: '23', isHidden: true }
      ],
      hints: [
        'This is a classic dynamic programming problem (Kadane\'s Algorithm).',
        'Keep track of the maximum sum ending at the current position.',
        'Update the global maximum as you iterate through the array.'
      ],
      timeLimit: 120,
      memoryLimit: '512 MB'
    },
    {
      id: '5',
      title: 'Binary Tree Inorder Traversal',
      difficulty: 'Easy',
      category: 'Tree',
      description: 'Given the root of a binary tree, return the inorder traversal of its nodes\' values.',
      constraints: [
        'The number of nodes in the tree is in the range [0, 100]',
        '-100 ≤ Node.val ≤ 100'
      ],
      examples: [
        {
          input: 'root = [1,null,2,3]',
          output: '[1,3,2]'
        }
      ],
      testCases: [
        { input: '[1,null,2,3]', expectedOutput: '[1,3,2]' },
        { input: '[]', expectedOutput: '[]' },
        { input: '[1]', expectedOutput: '[1]', isHidden: true }
      ],
      hints: [
        'Inorder traversal visits nodes in the order: left, root, right.',
        'You can solve this recursively or iteratively using a stack.',
        'For recursive solution, the base case is when the node is null.'
      ],
      timeLimit: 60,
      memoryLimit: '256 MB'
    }
  ];

  const assignments: Assignment[] = [
    {
      id: '1',
      title: 'Basic Data Structures',
      description: 'Practice fundamental data structure problems including arrays, stacks, and basic algorithms.',
      dueDate: '2024-01-25',
      problems: ['1', '2', '3'],
      totalPoints: 300,
      submitted: true,
      score: 250
    },
    {
      id: '2',
      title: 'Advanced Algorithms',
      description: 'Solve complex algorithmic problems involving dynamic programming and tree traversals.',
      dueDate: '2024-01-30',
      problems: ['4', '5'],
      totalPoints: 200
    }
  ];

  const filteredProblems = dsaProblems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'All' || problem.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const runCode = () => {
    setIsRunning(true);
    setTestResults([]);
    
    setTimeout(() => {
      if (selectedProblem) {
        const results = selectedProblem.testCases.map((testCase, index) => ({
          testCase: index + 1,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: testCase.expectedOutput, // Simulate correct output for demo
          passed: Math.random() > 0.3, // Random pass/fail for demo
          isHidden: testCase.isHidden
        }));
        setTestResults(results);
      }
      setIsRunning(false);
    }, 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-orange-600 bg-orange-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const newAssignment: Assignment = {
      id: Date.now().toString(),
      title: assignmentForm.title,
      description: assignmentForm.description,
      dueDate: assignmentForm.dueDate,
      problems: selectedProblems,
      totalPoints: selectedProblems.length * 100,
      assignedStudents: assignmentForm.selectedStudents,
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    setTeacherAssignments([...teacherAssignments, newAssignment]);
    setShowCreateForm(false);
    setAssignmentForm({
      title: '',
      description: '',
      dueDate: '',
      selectedStudents: [],
      problems: []
    });
    setSelectedProblems([]);
  };

  const toggleProblemSelection = (problemId: string) => {
    setSelectedProblems(prev => 
      prev.includes(problemId) 
        ? prev.filter(id => id !== problemId)
        : [...prev, problemId]
    );
  };

  const toggleStudentSelection = (studentId: string) => {
    setAssignmentForm(prev => ({
      ...prev,
      selectedStudents: prev.selectedStudents.includes(studentId)
        ? prev.selectedStudents.filter(id => id !== studentId)
        : [...prev.selectedStudents, studentId]
    }));
  };

  if (selectedProblem) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedProblem(null)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Problems
          </button>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedProblem.difficulty)}`}>
              {selectedProblem.difficulty}
            </span>
            <span className="text-gray-600">{selectedProblem.category}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedProblem.title}</h1>
              <p className="text-gray-700 mb-6">{selectedProblem.description}</p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Examples:</h3>
                  {selectedProblem.examples.map((example, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3">
                      <div className="mb-2">
                        <strong>Input:</strong> <code className="bg-gray-200 px-2 py-1 rounded">{example.input}</code>
                      </div>
                      <div className="mb-2">
                        <strong>Output:</strong> <code className="bg-gray-200 px-2 py-1 rounded">{example.output}</code>
                      </div>
                      {example.explanation && (
                        <div className="text-sm text-gray-600">
                          <strong>Explanation:</strong> {example.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Constraints:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {selectedProblem.constraints.map((constraint, index) => (
                      <li key={index} className="text-sm">{constraint}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Time: {selectedProblem.timeLimit}s
                  </div>
                  <div>Memory: {selectedProblem.memoryLimit}</div>
                </div>
              </div>
            </div>

            {/* Hints Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                  Hints
                </h3>
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {showHints ? 'Hide Hints' : 'Show Hints'}
                </button>
              </div>
              
              {showHints && (
                <div className="space-y-3">
                  {selectedProblem.hints.slice(0, currentHint + 1).map((hint, index) => (
                    <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                      <p className="text-sm text-gray-700">
                        <strong>Hint {index + 1}:</strong> {hint}
                      </p>
                    </div>
                  ))}
                  {currentHint < selectedProblem.hints.length - 1 && (
                    <button
                      onClick={() => setCurrentHint(currentHint + 1)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Show Next Hint →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Code Editor and Results */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Code Editor
                </h3>
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Code
                    </>
                  )}
                </button>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 p-4 font-mono text-sm resize-none focus:outline-none"
                placeholder="// Write your solution here
function twoSum(nums, target) {
    // Your code here
}"
              />
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Test Results</h3>
                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        result.passed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">
                          Test Case {result.testCase} {result.isHidden && '(Hidden)'}
                        </span>
                        <span className={`flex items-center ${
                          result.passed ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {result.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                      {!result.isHidden && (
                        <div className="text-sm text-gray-600">
                          <div>Input: {result.input}</div>
                          <div>Expected: {result.expectedOutput}</div>
                          <div>Got: {result.actualOutput}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600">
            {userRole === 'teacher' 
              ? 'Create and manage coding assignments for your students.' 
              : 'Complete your coding assignments and practice DSA problems.'
            }
          </p>
        </div>
        {userRole === 'teacher' && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Assignment
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Problems</p>
              <p className="text-2xl font-bold text-gray-900">{dsaProblems.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Solved</p>
              <p className="text-2xl font-bold text-gray-900">
                {dsaProblems.filter(p => p.solved).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">78%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Trophy className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rank</p>
              <p className="text-2xl font-bold text-gray-900">#42</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      {userRole === 'student' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Your Assignments</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">{assignment.title}</h4>
                    <p className="text-gray-600 mb-3">{assignment.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Code className="h-4 w-4 mr-1" />
                        {assignment.problems.length} problems
                      </div>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        {assignment.totalPoints} points
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {assignment.submitted ? (
                      <div>
                        <span className="inline-flex px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full mb-2">
                          Submitted
                        </span>
                        <p className="text-lg font-bold text-gray-900">
                          {assignment.score}/{assignment.totalPoints}
                        </p>
                      </div>
                    ) : (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Start Assignment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          Create New Assignment
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">DSA Problems</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredProblems.map((problem) => (
            <div
              key={problem.id}
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setSelectedProblem(problem)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    problem.solved ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 hover:text-blue-600">
                      {problem.title}
                    </h4>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                      <span className="text-sm text-gray-600">{problem.category}</span>
                      {problem.attempts && (
                        <span className="text-sm text-gray-500">
                          {problem.attempts} attempts
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {problem.solved && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  <span className="text-gray-400">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
    {/* Teacher's Created Assignments */}
    {userRole === 'teacher' && (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Created Assignments</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {teacherAssignments.map((assignment) => (
            <div key={assignment.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">{assignment.title}</h4>
                  <p className="text-gray-600 mb-3">{assignment.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Code className="h-4 w-4 mr-1" />
                      {assignment.problems.length} problems
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {assignment.assignedStudents?.length || 0} students
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      {assignment.totalPoints} points
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    View Submissions
                  </button>
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Student's Assignments List */}
    {userRole === 'student' && (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Assignment</h3>
        <form onSubmit={handleCreateAssignment} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Title
              </label>
              <input
                type="text"
                value={assignmentForm.title}
                onChange={(e) => setAssignmentForm({...assignmentForm, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter assignment title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={assignmentForm.dueDate}
                onChange={(e) => setAssignmentForm({...assignmentForm, dueDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={assignmentForm.description}
              onChange={(e) => setAssignmentForm({...assignmentForm, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter assignment description"
              required
            />
          </div>

          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to Students ({assignmentForm.selectedStudents.length} selected)
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={assignmentForm.selectedStudents.length === students.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAssignmentForm({...assignmentForm, selectedStudents: students.map(s => s.id)});
                      } else {
                        setAssignmentForm({...assignmentForm, selectedStudents: []});
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-900">Select All Students</span>
                </label>
                {students.map((student) => (
                  <label key={student.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={assignmentForm.selectedStudents.includes(student.id)}
                      onChange={() => toggleStudentSelection(student.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{student.name} ({student.email})</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Problem Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Problems ({selectedProblems.length} selected)
            </label>
            <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-3">
              <div className="space-y-2">
                {dsaProblems.map((problem) => (
                  <label key={problem.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedProblems.includes(problem.id)}
                        onChange={() => toggleProblemSelection(problem.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-medium text-gray-900">{problem.title}</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                          <span className="text-xs text-gray-500">{problem.category}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">100 pts</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(false);
                setSelectedProblems([]);
                setAssignmentForm({
                  title: '',
                  description: '',
                  dueDate: '',
                  selectedStudents: [],
                  problems: []
                });
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedProblems.length === 0 || assignmentForm.selectedStudents.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Assignment ({selectedProblems.length * 100} points)
            </button>
          </div>
        </form>
      </div>
    )}

};

export default Assignments;