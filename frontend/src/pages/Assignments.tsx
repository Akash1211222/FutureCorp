import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Text } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../stores/authStore';
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
  Lightbulb,
  Clock,
  Award,
  Target,
  BookOpen,
  Zap,
  Trophy
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
  completionRate: number;
  averageTime: number;
}

const Assignments: React.FC = () => {
  const { user } = useAuth();
  const [selectedProblem, setSelectedProblem] = useState<DSAProblem | null>(null);
  const [showHints, setShowHints] = useState<number>(0);
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState<Array<{passed: boolean, input: string, expected: string, actual: string}>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRunning, setIsRunning] = useState(false);

  if (!user) return null;

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
      points: 100,
      completionRate: 85,
      averageTime: 15
    },
    {
      id: '2',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      category: 'Stack',
      description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
      examples: [
        { input: 's = "()"', output: 'true' },
        { input: 's = "()[]{}"', output: 'true' },
        { input: 's = "(]"', output: 'false' }
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
      points: 100,
      completionRate: 78,
      averageTime: 12
    },
    {
      id: '3',
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
      points: 150,
      completionRate: 62,
      averageTime: 25
    }
  ];

  const filteredProblems = dsaProblems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || problem.category === selectedCategory;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const runCode = async () => {
    if (!selectedProblem) return;
    
    setIsRunning(true);
    
    // Simulate code execution
    setTimeout(() => {
      const results = selectedProblem.testCases.map(testCase => ({
        passed: Math.random() > 0.3,
        input: testCase.input,
        expected: testCase.output,
        actual: Math.random() > 0.5 ? testCase.output : 'Wrong Answer'
      }));
      
      setTestResults(results);
      setIsRunning(false);
    }, 2000);
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
          {/* 3D Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 mb-6 h-32 relative overflow-hidden"
          >
            <div className="absolute inset-0">
              <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={0.8} />
                <Environment preset="studio" />
                
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.3}>
                  <mesh position={[2, 0, -1]}>
                    <boxGeometry args={[0.5, 0.5, 0.5]} />
                    <meshStandardMaterial color="#10b981" emissive="#047857" emissiveIntensity={0.2} />
                  </mesh>
                </Float>
                
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
              </Canvas>
            </div>

            <div className="relative z-10 h-full flex items-center justify-between">
              <div>
                <button
                  onClick={() => setSelectedProblem(null)}
                  className="text-blue-400 hover:text-blue-300 mb-2 text-sm"
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
              <div className="text-right">
                <div className="text-sm text-gray-400">Success Rate</div>
                <div className="text-lg font-bold text-green-400">{selectedProblem.completionRate}%</div>
              </div>
            </div>
          </motion.div>

          {/* Problem Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Problem Description */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl p-6 space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-400" />
                  Problem Description
                </h3>
                <p className="text-gray-300 leading-relaxed">{selectedProblem.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Examples</h3>
                {selectedProblem.examples.map((example, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-lg p-4 mb-3">
                    <div className="text-sm space-y-2">
                      <div>
                        <span className="text-gray-400">Input:</span>
                        <div className="text-green-400 font-mono bg-gray-900/50 p-2 rounded mt-1">{example.input}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Output:</span>
                        <div className="text-blue-400 font-mono bg-gray-900/50 p-2 rounded mt-1">{example.output}</div>
                      </div>
                      {example.explanation && (
                        <div>
                          <span className="text-gray-400">Explanation:</span>
                          <div className="text-gray-300 mt-1">{example.explanation}</div>
                        </div>
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
                      <span className="font-mono">{constraint}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hints Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-400" />
                    Hints
                  </h3>
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
                  <AnimatePresence>
                    {selectedProblem.hints.slice(0, showHints).map((hint, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3"
                      >
                        <div className="flex items-start">
                          <Lightbulb className="h-4 w-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-yellow-200 text-sm">{hint}</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Code Editor and Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Code Editor */}
              <div className="glass rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Code className="h-5 w-5 mr-2 text-green-400" />
                    Code Editor
                  </h3>
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
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
                  className="w-full h-80 p-4 bg-gray-900/50 text-gray-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="// Write your solution here...
function twoSum(nums, target) {
    // Your code here
}"
                />
              </div>

              {/* Test Results */}
              <AnimatePresence>
                {testResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-2xl p-6"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Target className="h-5 w-5 mr-2 text-blue-400" />
                      Test Results
                    </h3>
                    <div className="space-y-3">
                      {testResults.map((result, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-lg border ${
                            result.passed 
                              ? 'bg-green-900/20 border-green-600/30' 
                              : 'bg-red-900/20 border-red-600/30'
                          }`}
                        >
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
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 3D Header Scene */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 h-48 relative overflow-hidden"
        >
          <div className="absolute inset-0">
            <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={0.8} />
              <Environment preset="studio" />
              
              <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
                <mesh position={[3, 1, -2]}>
                  <octahedronGeometry args={[0.5]} />
                  <meshStandardMaterial color="#3b82f6" emissive="#1e40af" emissiveIntensity={0.3} />
                </mesh>
              </Float>
              
              <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
                <Text
                  position={[0, 0, 0]}
                  fontSize={0.8}
                  color="#ffffff"
                  anchorX="center"
                  anchorY="middle"
                >
                  CODE
                </Text>
              </Float>
              
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
            </Canvas>
          </div>

          <div className="relative z-10 h-full flex flex-col justify-center">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-2">
                  {user.role === 'TEACHER' || user.role === 'ADMIN' ? 'Assignment Management' : 'Coding Challenges'}
                </h1>
                <p className="text-gray-300 text-sm md:text-base">
                  {user.role === 'TEACHER' || user.role === 'ADMIN'
                    ? 'Create and manage coding assignments for your students' 
                    : 'Practice coding problems and improve your skills'
                  }
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  <span>Total Points: {dsaProblems.reduce((sum, p) => sum + p.points, 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <div className="glass rounded-2xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 glass rounded-lg text-white focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 glass rounded-lg text-white focus:ring-2 focus:ring-blue-500/50"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((problem, index) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedProblem(problem)}
              className="glass rounded-2xl p-6 cursor-pointer group hover:scale-105 transition-all duration-300"
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
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Target className="h-4 w-4" />
                    <span>{problem.completionRate}% success</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>~{problem.averageTime}min</span>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${problem.completionRate}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Assignments;