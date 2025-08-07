import React, { useState } from 'react';
import { BookOpen, Users, Clock, Star, Play, Plus, Settings } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  students: number;
  duration: string;
  rating: number;
  progress?: number;
  thumbnail: string;
  status: 'active' | 'completed' | 'draft';
  lessons: number;
}

const Courses: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userRole] = useState<'teacher' | 'student'>('student'); // Default to student for now
  const [courses] = useState<Course[]>([
    {
      id: '1',
      title: 'Advanced React Development',
      description: 'Master advanced React concepts including hooks, context, and performance optimization.',
      instructor: 'Dr. Sarah Johnson',
      students: 89,
      duration: '12 weeks',
      rating: 4.8,
      progress: userRole === 'student' ? 75 : undefined,
      thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'active',
      lessons: 24
    },
    {
      id: '2',
      title: 'JavaScript Fundamentals',
      description: 'Learn the core concepts of JavaScript from basics to advanced topics.',
      instructor: 'Prof. Mike Chen',
      students: 124,
      duration: '8 weeks',
      rating: 4.6,
      progress: userRole === 'student' ? 100 : undefined,
      thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: userRole === 'student' ? 'completed' : 'active',
      lessons: 18
    },
    {
      id: '3',
      title: 'UI/UX Design Principles',
      description: 'Design beautiful and functional user interfaces with modern design principles.',
      instructor: 'Lisa Anderson',
      students: 67,
      duration: '10 weeks',
      rating: 4.9,
      progress: userRole === 'student' ? 43 : undefined,
      thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      status: 'active',
      lessons: 20
    }
  ]);

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      draft: 'bg-gray-100 text-gray-800'
    };
    return badges[status as keyof typeof badges] || badges.active;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {userRole === 'teacher' ? 'My Courses' : 'Enrolled Courses'}
          </h1>
          <p className="text-gray-600">
            {userRole === 'teacher' 
              ? 'Create and manage your courses.' 
              : 'Continue your learning journey.'
            }
          </p>
        </div>
        {userRole === 'teacher' && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Course
          </button>
        )}
      </div>

      {showCreateForm && userRole === 'teacher' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Course</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter course title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 8 weeks"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter course description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Select Category</option>
                  <option>Programming</option>
                  <option>Design</option>
                  <option>Business</option>
                  <option>Marketing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Course
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(course.status)}`}>
                  {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                </span>
              </div>
              {userRole === 'teacher' && (
                <div className="absolute top-4 right-4">
                  <button className="p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100 transition-all">
                    <Settings className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <div className="flex items-center mr-4">
                  <Users className="h-4 w-4 mr-1" />
                  {course.students} students
                </div>
                <div className="flex items-center mr-4">
                  <Clock className="h-4 w-4 mr-1" />
                  {course.duration}
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                  {course.rating}
                </div>
              </div>

              {userRole === 'student' && course.progress !== undefined && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        course.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {userRole === 'teacher' ? `${course.lessons} lessons` : `by ${course.instructor}`}
                </div>
                <button className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  {userRole === 'teacher' ? (
                    <>
                      <Settings className="h-4 w-4 mr-1" />
                      Manage
                    </>
                  ) : course.status === 'completed' ? (
                    <>
                      <BookOpen className="h-4 w-4 mr-1" />
                      Review
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Continue
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;