import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAsync } from '../hooks/useAsync';
import { useDebounce } from '../hooks/useDebounce';
import SearchableList from './SearchableList';
import LoadingSpinner from './LoadingSpinner';
import apiClient from '../utils/api';
import { logger } from '../utils/logger';
import { 
  ClipboardList, 
  Plus, 
  Filter, 
  Calendar, 
  Award,
  Target,
  BookOpen,
  Code,
  Play,
  CheckCircle,
  XCircle,
  Lightbulb
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

const OptimizedAssignments: React.FC = () => {
  const { user } = useAuth();
  const [selectedProblem, setSelectedProblem] = useState<DSAProblem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [code, setCode] = useState('');
  const [showHints, setShowHints] = useState(0);
  const [testResults, setTestResults] = useState<Array<{passed: boolean, input: string, expected: string, actual: string}>>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch assignments with caching
  const { data: assignments, loading, error, refetch } = useAsync(
    () => apiClient.getAssignments(),
    []
  );

  // Memoized filtered problems for performance
  const filteredProblems = useMemo(() => {
    if (!assignments) return [];

    return assignments.filter((problem: DSAProblem) => {
      const matchesSearch = problem.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                           problem.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty;
      const matchesCategory = selectedCategory === 'all' || problem.category === selectedCategory;
      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [assignments, debouncedSearchTerm, selectedDifficulty, selectedCategory]);

  const categories = useMemo(() => {
    if (!assignments) return [];
    return [...new Set(assignments.map((p: DSAProblem) => p.category))];
  }, [assignments]);

  const runCode = async () => {
    if (!selectedProblem) return;
    
    logger.info('Running code for problem', { problemId: selectedProblem.id });
    
    try {
      // Simulate test case execution with better logic
      const results = selectedProblem.testCases.map(testCase => {
        const passed = Math.random() > 0.3; // 70% pass rate for demo
        return {
          passed,
          input: testCase.input,
          expected: testCase.output,
          actual: passed ? testCase.output : 'Wrong Answer'
        };
      });
      
      setTestResults(results);
      
      const passedCount = results.filter(r => r.passed).length;
      logger.info('Code execution completed', { 
        problemId: selectedProblem.id,
        passedTests: `${passedCount}/${results.length}`
      });
    } catch (error) {
      logger.error('Code execution failed', { error, problemId: selectedProblem.id });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading assignments..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Failed to Load Assignments</h2>
          <p className="text-gray-300 mb-4">{error.message}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
              {user?.role === 'TEACHER' || user?.role === 'ADMIN' ? 'Assignment Management' : 'My Assignments'}
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              {user?.role === 'TEACHER' || user?.role === 'ADMIN'
                ? 'Create and manage coding assignments for your students.' 
                : 'Practice coding problems and complete your assignments.'
              }
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass rounded-2xl p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
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
          {filteredProblems.map((problem: DSAProblem) => (
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
      </div>
    </div>
  );
};

export default OptimizedAssignments;