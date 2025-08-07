import React from 'react';
import { TrendingUp, Award, Target, Clock, BarChart3, Users } from 'lucide-react';

const Performance: React.FC = () => {
  const userRole: 'teacher' | 'student' = 'student'; // Default to student for now
  
  if (userRole === 'teacher') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Performance</h1>
          <p className="text-gray-600">Track student progress and course effectiveness.</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-gray-900">247</p>
                <p className="text-sm text-green-600">+12% this month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
                <p className="text-2xl font-bold text-gray-900">87%</p>
                <p className="text-sm text-green-600">+5% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Score</p>
                <p className="text-2xl font-bold text-gray-900">82%</p>
                <p className="text-sm text-red-600">-2% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Study Hours</p>
                <p className="text-2xl font-bold text-gray-900">1,240</p>
                <p className="text-sm text-green-600">+18% this month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Course Performance</h3>
            </div>
            <div className="p-6 space-y-4">
              {[
                { course: 'React Mastery', students: 89, completion: 92, avg_score: 88 },
                { course: 'JavaScript Fundamentals', students: 124, completion: 85, avg_score: 84 },
                { course: 'Web Design Principles', students: 67, completion: 78, avg_score: 86 },
                { course: 'Node.js Backend', students: 45, completion: 73, avg_score: 79 },
              ].map((course, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900">{course.course}</h4>
                    <span className="text-sm text-gray-600">{course.students} students</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="font-medium">{course.completion}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.completion}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Average Score</span>
                      <span className="font-medium">{course.avg_score}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Students</h3>
            </div>
            <div className="p-6 space-y-4">
              {[
                { name: 'Alice Johnson', course: 'React Mastery', score: 98, progress: 100 },
                { name: 'Bob Wilson', course: 'JavaScript Fundamentals', score: 95, progress: 92 },
                { name: 'Carol Davis', course: 'Web Design Principles', score: 94, progress: 88 },
                { name: 'David Brown', course: 'Node.js Backend', score: 91, progress: 85 },
                { name: 'Emma Taylor', course: 'React Mastery', score: 90, progress: 95 },
              ].map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.course}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{student.score}% avg</p>
                    <p className="text-sm text-gray-600">{student.progress}% complete</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Performance</h1>
        <p className="text-gray-600">Track your learning progress and achievements.</p>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overall Score</p>
              <p className="text-2xl font-bold text-gray-900">89%</p>
              <p className="text-sm text-green-600">+3% this week</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Courses Completed</p>
              <p className="text-2xl font-bold text-gray-900">3/5</p>
              <p className="text-sm text-blue-600">60% complete</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Study Hours</p>
              <p className="text-2xl font-bold text-gray-900">84</p>
              <p className="text-sm text-orange-600">12h this week</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Achievements</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-purple-600">2 new badges</p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Course Progress</h3>
          </div>
          <div className="p-6 space-y-4">
            {[
              { course: 'Advanced React Development', progress: 75, score: 92, status: 'In Progress' },
              { course: 'JavaScript ES6+', progress: 100, score: 88, status: 'Completed' },
              { course: 'UI/UX Design Fundamentals', progress: 43, score: 85, status: 'In Progress' },
              { course: 'Node.js & Express', progress: 100, score: 91, status: 'Completed' },
              { course: 'Database Design', progress: 25, score: 87, status: 'In Progress' },
            ].map((course, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{course.course}</h4>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      course.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{course.score}%</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        course.status === 'Completed' ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Achievements</h3>
          </div>
          <div className="p-6 space-y-4">
            {[
              { 
                title: 'React Master', 
                description: 'Completed Advanced React Development course', 
                date: '2024-01-15',
                badge: '🏆'
              },
              { 
                title: 'Perfect Score', 
                description: 'Achieved 100% on JavaScript ES6+ final exam', 
                date: '2024-01-10',
                badge: '⭐'
              },
              { 
                title: 'Fast Learner', 
                description: 'Completed 3 lessons in one day', 
                date: '2024-01-08',
                badge: '🚀'
              },
              { 
                title: 'Code Reviewer', 
                description: 'Helped 5 classmates with their projects', 
                date: '2024-01-05',
                badge: '🤝'
              },
              { 
                title: 'Consistent Student', 
                description: 'Maintained 7-day learning streak', 
                date: '2024-01-03',
                badge: '🔥'
              },
            ].map((achievement, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl">{achievement.badge}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(achievement.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;