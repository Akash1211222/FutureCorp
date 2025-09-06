import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  Code, 
  Play, 
  CheckCircle, 
  XCircle,
  Eye,
  Lightbulb,
  Clock,
  Award,
  Target,
  BookOpen
} from 'lucide-react';

interface DSAProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  testCases: Array<{
    input: string;
    output: string;
    isPublic: boolean;
  }>;
  hints: string[];
  points: number;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  problems: string[];
  assignedTo: string[];
  dueDate: string;
  createdBy: string;
  totalPoints: number;
  status: 'active' | 'completed' | 'draft';
}

interface Student {
  id: string;
  name: string;
  email: string;
}

const Assignments: React.FC = () => {
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<DSAProblem | null>(null);
  const [showHints, setShowHints] = useState<number>(0);
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState<Array<{passed: boolean, input: string, expected: string, actual: string}>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!user) return null;

  // Mock data
  const [students] = useState<Student[]>([
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
    { id: '2', name: 'Bob Wilson', email: 'bob@example.com' },
    { id: '3', name: 'Carol Davis', email: 'carol@example.com' },
    { id: '4', name: 'David Brown', email: 'david@example.com' },
    { id: '5', name: 'Emma Taylor', email: 'emma@example.com' },
  ]);

  const [assignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Array Fundamentals',
      description: 'Basic array manipulation problems',
      problems: ['1', '4'],
      assignedTo: ['1', '2', '3'],
      dueDate: '2024-01-25',
      createdBy: 'teacher',
      totalPoints: 200,
      status: 'active'
    },
    {
      id: '2',
      title: 'Data Structures Practice',
      description: 'Stack and linked list problems',
      problems: ['2', '3'],
      assignedTo: ['1', '2', '3', '4', '5'],
      dueDate: '2024-01-30',
      createdBy: 'teacher',
      totalPoints: 200,
      status: 'active'
    }
  ]);

  const dsaProblems: DSAProblem[] = [
    {
      id: '1',
      title: 'Two Sum',
      difficulty: 'Easy',
      category: 'Array',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
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
        '-10^9 <= target <= 10^9'
      ],
      testCases: [
        { input: '[2,7,11,15], 9', output: '[0,1]', isPublic: true },
        { input: '[3,2,4], 6', output: '[1,2]', isPublic: true },
        { input: '[3,3], 6', output: '[0,1]', isPublic: false }
      ],
      hints: [
        'Think about using a hash map to store numbers you\'ve seen',
        'For each number, check if target - number exists in the hash map',
        'Store the index along with the number in the hash map'
      ],
      points: 100
    },
    {
      id: '2',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      category: 'Stack',
      description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
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
        { input: '"()"', output: 'true', isPublic: true },
        { input: '"()[]{}"', output: 'true', isPublic: true },
        { input: '"(]"', output: 'false', isPublic: false }
      ],
      hints: [
        'Use a stack data structure',
        'Push opening brackets onto the stack',
        'When you see a closing bracket, check if it matches the top of the stack'
      ],
      points: 100
    },
    {
      id: '3',
      title: 'Merge Two Sorted Lists',
      difficulty: 'Easy',
      category: 'Linked List',
      description: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a sorted order.',
      examples: [
        {
          input: 'list1 = [1,2,4], list2 = [1,3,4]',
          output: '[1,1,2,3,4,4]'
        }
      ],
      constraints: [
        'The number of nodes in both lists is in the range [0, 50]',
        '-100 <= Node.val <= 100'
      ],
      testCases: [
        { input: '[1,2,4], [1,3,4]', output: '[1,1,2,3,4,4]', isPublic: true },
        { input: '[], []', output: '[]', isPublic: true },
        { input: '[], [0]', output: '[0]', isPublic: false }
      ],
      hints: [
        'Use two pointers, one for each list',
        'Compare the values and add the smaller one to the result',
        'Don\'t forget to handle the remaining nodes'
      ],
      points: 100
    },
    {
      id: '4',
      title: 'Maximum Subarray',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      description: 'Given an integer array nums, find the contiguous subarray with the largest sum, and return its sum.',
      examples: [
        {
          input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
          output: '6',
          explanation: '[4,-1,2,1] has the largest sum = 6'
        }
      ],
      constraints: [
        '1 <= nums.length <= 10^5',
        '-10^4 <= nums[i] <= 10^4'
      ],
      testCases: [
        { input: '[-2,1,-3,4,-1,2,1,-5,4]', output: '6', isPublic: true },
        { input: '[1]', output: '1', isPublic: true },
        { input: '[5,4,-1,7,8]', output: '23', isPublic: false }
      ],
      hints: [
        'Think about Kadane\'s algorithm',
        'Keep track of the maximum sum ending at each position',
        'Update the global maximum as you go'
      ],
      points: 100
    },
    {
      id: '5',
      title: 'Binary Tree Inorder Traversal',
      difficulty: 'Easy',
      category: 'Tree',
      description: 'Given the root of a binary tree, return the inorder traversal of its nodes\' values.',
      examples: [
        {
          input: 'root = [1,null,2,3]',
          output: '[1,3,2]'
        }
      ],
      constraints: [
        'The number of nodes in the tree is in the range [0, 100]',
        '-100 <= Node.val <= 100'
      ],
      testCases: [
        { input: '[1,null,2,3]', output: '[1,3,2]', isPublic: true },
        { input: '[]', output: '[]', isPublic: true },
        { input: '[1]', output: '[1]', isPublic: false }
      ],
      hints: [
        'Inorder traversal: left, root, right',
        'You can use recursion or an iterative approach with a stack',
        'For iterative: go left as much as possible, then process node, then go right'
      ],
      points: 100
    }
  ];

  const filteredProblems = dsaProblems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || problem.category === selectedCategory;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const runCode = () => {
    if (!selectedProblem) return;
    
    // Simulate test case execution
    const results = selectedProblem.testCases.map(testCase => ({
      passed: Math.random() > 0.3, // 70% pass rate for demo
      input: testCase.input,
      expected: testCase.output,
      actual: Math.random() > 0.5 ? testCase.output : 'Wrong Answer'
    }));
    
    setTestResults(results);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = [...new Set(dsaProblems.map(p => p.category))];

  if (selectedProblem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <div>
              <button
                onClick={() => setSelectedProblem(null)}
                className="text-blue-400 hover:text-blue-300 mb-2 text-sm md:text-base"
              >
                ← Back to Problems
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-white">{selectedProblem.title}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(selectedProblem.difficulty)}`}>
                  {selectedProblem.difficulty}
                </span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {selectedProblem.category}
                </span>
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                  {selectedProblem.points} points
                </span>
              </div>
            </div>
          </div>

          {/* Problem Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Problem Description */}
            <div className="glass rounded-2xl p-4 md:p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Problem Description</h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">{selectedProblem.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Examples</h3>
                {selectedProblem.examples.map((example, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-3 md:p-4 mb-3">
                    <div className="text-sm">
                      <div className="text-gray-400 mb-1">Input:</div>
                      <div className="text-green-400 font-mono text-xs md:text-sm mb-2">{example.input}</div>
                      <div className="text-gray-400 mb-1">Output:</div>
                      <div className="text-blue-400 font-mono text-xs md:text-sm">{example.output}</div>
                      {example.explanation && (
                        <>
                          <div className="text-gray-400 mb-1 mt-2">Explanation:</div>
                          <div className="text-gray-300 text-xs md:text-sm">{example.explanation}</div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Constraints</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  {selectedProblem.constraints.map((constraint, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span className="font-mono text-xs md:text-sm">{constraint}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hints Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">Hints</h3>
                  <button
                    onClick={() => setShowHints(prev => Math.min(prev + 1, selectedProblem.hints.length))}
                    className="flex items-center px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-lg hover:bg-yellow-600/30 transition-colors text-sm"
                    disabled={showHints >= selectedProblem.hints.length}
                  >
                    <Lightbulb className="h-4 w-4 mr-1" />
                    Show Hint ({showHints}/{selectedProblem.hints.length})
                  </button>
                </div>
                <div className="space-y-2">
                  {selectedProblem.hints.slice(0, showHints).map((hint, index) => (
                    <div key={index} className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
                      <div className="flex items-start">
                        <Lightbulb className="h-4 w-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-yellow-200 text-sm">{hint}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Code Editor and Results */}
            <div className="space-y-6">
              {/* Code Editor */}
              <div className="glass rounded-2xl overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white flex items-center mb-2 md:mb-0">
                    <Code className="h-5 w-5 mr-2 text-green-400" />
                    Code Editor
                  </h3>
                  <button
                    onClick={runCode}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Run Code
                  </button>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-64 md:h-80 p-4 bg-gray-900/50 text-gray-100 font-mono text-sm resize-none focus:outline-none"
                  placeholder="// Write your solution here..."
                />
              </div>

              {/* Test Results */}
              {testResults.length > 0 && (
                <div className="glass rounded-2xl p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Test Results</h3>
                  <div className="space-y-3">
                    {testResults.map((result, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${
                        result.passed 
                          ? 'bg-green-900/20 border-green-600/30' 
                          : 'bg-red-900/20 border-red-600/30'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-300">Test Case {index + 1}</span>
                          <div className="flex items-center">
                            {result.passed ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400" />
                            )}
                            <span className={`ml-2 text-sm font-medium ${
                              result.passed ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {result.passed ? 'Passed' : 'Failed'}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs space-y-1">
                          <div><span className="text-gray-400">Input:</span> <span className="text-blue-300 font-mono">{result.input}</span></div>
                          <div><span className="text-gray-400">Expected:</span> <span className="text-green-300 font-mono">{result.expected}</span></div>
                          <div><span className="text-gray-400">Actual:</span> <span className="text-yellow-300 font-mono">{result.actual}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold gradient-text">
              {user.role === 'TEACHER' || user.role === 'ADMIN' ? 'Assignment Management' : 'My Assignments'}
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              {user.role === 'TEACHER' || user.role === 'ADMIN'
                ? 'Create and manage coding assignments for your students.' 
                : 'Practice coding problems and complete your assignments.'
              }
            </p>
          </div>
          {(user.role === 'TEACHER' || user.role === 'ADMIN') && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm md:text-base"
            >
              <Plus className="h-4 w-5 mr-2" />
              Create Assignment
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="glass rounded-2xl p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 text-sm md:text-base"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 glass rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 text-sm"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 glass rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 text-sm"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Problems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredProblems.map((problem) => (
            <div
              key={problem.id}
              onClick={() => setSelectedProblem(problem)}
              className="glass rounded-2xl p-4 md:p-6 card-hover cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {problem.title}
                </h3>
                <div className="flex items-center space-x-1">
                  <Award className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400 text-sm font-medium">{problem.points}</span>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{problem.description}</p>
              
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {problem.category}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center">
                  <Lightbulb className="h-4 w-4 mr-1" />
                  {problem.hints.length} hints
                </div>
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-1" />
                  {problem.testCases.length} tests
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Assignments Section for Students */}
        {user.role === 'STUDENT' && (
          <div className="glass rounded-2xl p-4 md:p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <ClipboardList className="h-5 w-6 mr-2 text-blue-400" />
              My Assignments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-white">{assignment.title}</h3>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      {assignment.status}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{assignment.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {assignment.problems.length} problems
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      {assignment.totalPoints} points
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Start Assignment
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;