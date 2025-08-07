import React, { useState } from 'react';
import { Calendar, Clock, Users, Video, Plus, Settings } from 'lucide-react';

interface OnlineClass {
  id: string;
  title: string;
  course: string;
  date: string;
  time: string;
  duration: number;
  students: number;
  status: 'upcoming' | 'live' | 'completed';
  instructor?: string;
}

const OnlineClasses: React.FC = () => {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [userRole] = useState<'teacher' | 'student'>('student'); // Default to student for now
  const [classes] = useState<OnlineClass[]>([
    {
      id: '1',
      title: 'Advanced React Hooks',
      course: 'React Mastery',
      date: '2024-01-20',
      time: '10:00',
      duration: 90,
      students: 24,
      status: 'upcoming',
      instructor: 'Dr. Sarah Johnson'
    },
    {
      id: '2',
      title: 'State Management Patterns',
      course: 'React Mastery',
      date: '2024-01-18',
      time: '14:00',
      duration: 60,
      students: 18,
      status: 'live',
      instructor: 'Dr. Sarah Johnson'
    },
    {
      id: '3',
      title: 'Component Architecture',
      course: 'React Mastery',
      date: '2024-01-15',
      time: '16:00',
      duration: 75,
      students: 22,
      status: 'completed',
      instructor: 'Dr. Sarah Johnson'
    }
  ]);

  const getStatusBadge = (status: string) => {
    const badges = {
      upcoming: 'bg-blue-100 text-blue-800',
      live: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800'
    };
    return badges[status as keyof typeof badges] || badges.upcoming;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {userRole === 'teacher' ? 'Online Classes' : 'My Classes'}
          </h1>
          <p className="text-gray-600">
            {userRole === 'teacher' 
              ? 'Schedule and manage your live classes.' 
              : 'Join your scheduled classes and view recordings.'
            }
          </p>
        </div>
        {userRole === 'teacher' && (
          <button
            onClick={() => setShowScheduleForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Schedule Class
          </button>
        )}
      </div>

      {showScheduleForm && userRole === 'teacher' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule New Class</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter class title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Select Course</option>
                  <option>React Mastery</option>
                  <option>JavaScript Fundamentals</option>
                  <option>Web Design Principles</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="90"
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
                placeholder="Class description and agenda"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowScheduleForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Schedule Class
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Classes List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {userRole === 'teacher' ? 'Scheduled Classes' : 'Your Classes'}
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {classes.map((class_) => (
            <div key={class_.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Video className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{class_.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(class_.status)}`}>
                        {class_.status.charAt(0).toUpperCase() + class_.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{class_.course}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(class_.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {class_.time} ({class_.duration} min)
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {class_.students} students
                      </div>
                      {userRole === 'student' && class_.instructor && (
                        <span>• {class_.instructor}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {class_.status === 'live' && (
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      Join Live
                    </button>
                  )}
                  {class_.status === 'upcoming' && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      {userRole === 'teacher' ? 'Start Class' : 'Join Class'}
                    </button>
                  )}
                  {class_.status === 'completed' && (
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                      View Recording
                    </button>
                  )}
                  {userRole === 'teacher' && (
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <Settings className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnlineClasses;