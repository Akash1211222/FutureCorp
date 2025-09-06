import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Text } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  Plus, 
  Play,
  Eye,
  Download,
  Search,
  Filter,
  Star,
  BookOpen,
  Mic,
  Monitor
} from 'lucide-react';
import { useAuth } from '../stores/authStore';
import { useLiveClass } from '../stores/liveClassStore';
import LiveClassroom from '../components/live/LiveClassroom';
import RecordingPlayer from '../components/recordings/RecordingPlayer';

interface LiveClass {
  id: string;
  title: string;
  description: string;
  course: string;
  instructor: string;
  schedule: string;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  status: 'scheduled' | 'live' | 'completed';
  meetingUrl?: string;
  recordingUrl?: string;
  tags: string[];
}

interface Recording {
  id: string;
  title: string;
  description: string;
  instructor: string;
  course: string;
  duration: number;
  recordedAt: string;
  videoUrl: string;
  thumbnailUrl: string;
  views: number;
  rating: number;
  tags: string[];
  chatLog?: Array<{
    timestamp: number;
    sender: string;
    message: string;
  }>;
}

const LiveClasses: React.FC = () => {
  const { user } = useAuth();
  const { connectToClass, isInClass } = useLiveClass();
  const [activeTab, setActiveTab] = useState<'live' | 'recordings'>('live');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState<LiveClass | null>(null);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');

  if (!user) return null;

  // Mock data for live classes
  const [liveClasses] = useState<LiveClass[]>([
    {
      id: '1',
      title: 'Advanced React Hooks & Performance',
      description: 'Deep dive into React hooks optimization and performance best practices',
      course: 'React Mastery',
      instructor: 'Dr. Sarah Johnson',
      schedule: '2024-01-25T10:00:00Z',
      duration: 90,
      maxParticipants: 50,
      currentParticipants: 24,
      status: 'scheduled',
      tags: ['React', 'Performance', 'Hooks']
    },
    {
      id: '2',
      title: 'Real-time State Management',
      description: 'Building reactive applications with modern state management',
      course: 'React Mastery',
      instructor: 'Dr. Sarah Johnson',
      schedule: '2024-01-24T14:00:00Z',
      duration: 60,
      maxParticipants: 30,
      currentParticipants: 18,
      status: 'live',
      tags: ['State Management', 'Real-time']
    },
    {
      id: '3',
      title: 'Component Architecture Patterns',
      description: 'Design patterns for scalable React component architecture',
      course: 'React Mastery',
      instructor: 'Dr. Sarah Johnson',
      schedule: '2024-01-22T16:00:00Z',
      duration: 75,
      maxParticipants: 40,
      currentParticipants: 35,
      status: 'completed',
      tags: ['Architecture', 'Components']
    }
  ]);

  // Mock data for recordings
  const [recordings] = useState<Recording[]>([
    {
      id: '1',
      title: 'Introduction to React Hooks',
      description: 'Complete guide to useState, useEffect, and custom hooks',
      instructor: 'Dr. Sarah Johnson',
      course: 'React Mastery',
      duration: 3600, // 1 hour in seconds
      recordedAt: '2024-01-20T10:00:00Z',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
      views: 156,
      rating: 4.8,
      tags: ['React', 'Hooks', 'Beginner'],
      chatLog: [
        { timestamp: 300, sender: 'Alice Johnson', message: 'Great explanation of useState!' },
        { timestamp: 600, sender: 'Bob Wilson', message: 'Can you show useEffect example?' },
        { timestamp: 900, sender: 'Dr. Sarah Johnson', message: 'Sure! Let me demonstrate...' }
      ]
    },
    {
      id: '2',
      title: 'Advanced Component Patterns',
      description: 'Render props, HOCs, and compound components explained',
      instructor: 'Dr. Sarah Johnson',
      course: 'React Mastery',
      duration: 2700, // 45 minutes
      recordedAt: '2024-01-18T14:00:00Z',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnailUrl: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400',
      views: 89,
      rating: 4.9,
      tags: ['React', 'Patterns', 'Advanced']
    },
    {
      id: '3',
      title: 'State Management Deep Dive',
      description: 'Redux, Zustand, and Context API comparison and best practices',
      instructor: 'Dr. Sarah Johnson',
      course: 'React Mastery',
      duration: 4200, // 70 minutes
      recordedAt: '2024-01-15T16:00:00Z',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=400',
      views: 203,
      rating: 4.7,
      tags: ['State Management', 'Redux', 'Zustand']
    }
  ]);

  const joinClass = (classItem: LiveClass) => {
    if (user) {
      connectToClass(classItem.id, user.id, user.role);
      setSelectedClass(classItem);
    }
  };

  const handleLeaveClass = () => {
    setSelectedClass(null);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      scheduled: 'bg-blue-100 text-blue-800',
      live: 'bg-red-100 text-red-800 animate-pulse',
      completed: 'bg-green-100 text-green-800'
    };
    return badges[status as keyof typeof badges] || badges.scheduled;
  };

  const filteredClasses = liveClasses.filter(cls => {
    const matchesSearch = cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === 'all' || cls.course === filterCourse;
    return matchesSearch && matchesCourse;
  });

  const filteredRecordings = recordings.filter(rec => {
    const matchesSearch = rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rec.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === 'all' || rec.course === filterCourse;
    return matchesSearch && matchesCourse;
  });

  const courses = [...new Set([...liveClasses.map(c => c.course), ...recordings.map(r => r.course)])];

  // If in live class, show classroom interface
  if (isInClass && selectedClass) {
    return <LiveClassroom classId={selectedClass.id} onLeave={handleLeaveClass} />;
  }

  // If viewing recording, show player
  if (selectedRecording) {
    return (
      <RecordingPlayer 
        recording={selectedRecording} 
        onClose={() => setSelectedRecording(null)} 
      />
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
              <Environment preset="night" />
              
              <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
                <mesh position={[3, 1, -2]}>
                  <sphereGeometry args={[0.5, 32, 32]} />
                  <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.3} />
                </mesh>
              </Float>
              
              <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
                <Text
                  position={[0, 0, 0]}
                  fontSize={1}
                  color="#ffffff"
                  anchorX="center"
                  anchorY="middle"
                >
                  LIVE
                </Text>
              </Float>
              
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
            </Canvas>
          </div>

          <div className="relative z-10 h-full flex flex-col justify-center">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-2">
                  {user.role === 'TEACHER' || user.role === 'ADMIN' ? 'Live Teaching Studio' : 'Live Classes & Recordings'}
                </h1>
                <p className="text-gray-300 text-sm md:text-base">
                  {user.role === 'TEACHER' || user.role === 'ADMIN'
                    ? 'Conduct interactive live sessions and manage recordings' 
                    : 'Join live classes and access recorded sessions'
                  }
                </p>
              </div>
              {(user.role === 'TEACHER' || user.role === 'ADMIN') && (
                <button
                  onClick={() => setShowScheduleForm(true)}
                  className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Live Class
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="glass rounded-2xl p-1">
          <div className="flex">
            <button
              onClick={() => setActiveTab('live')}
              className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                activeTab === 'live'
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Video className="h-5 w-5" />
              <span className="font-medium">Live Classes</span>
            </button>
            <button
              onClick={() => setActiveTab('recordings')}
              className={`flex-1 py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                activeTab === 'recordings'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Play className="h-5 w-5" />
              <span className="font-medium">Recordings</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass rounded-2xl p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'live' ? 'live classes' : 'recordings'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="px-3 py-2 glass rounded-lg text-white focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="all">All Courses</option>
                {courses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Schedule Form */}
        <AnimatePresence>
          {showScheduleForm && (user.role === 'TEACHER' || user.role === 'ADMIN') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Schedule New Live Class</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Class Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 glass rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50"
                      placeholder="Enter class title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Course
                    </label>
                    <select className="w-full px-3 py-2 glass rounded-lg text-white focus:ring-2 focus:ring-blue-500/50">
                      <option>Select Course</option>
                      {courses.map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 glass rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Class description and agenda"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 glass rounded-lg text-white focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 glass rounded-lg text-white focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 glass rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50"
                      placeholder="90"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowScheduleForm(false)}
                    className="px-4 py-2 text-gray-300 glass rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300"
                  >
                    Schedule Class
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'live' ? (
            <motion.div
              key="live-classes"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {filteredClasses.map((classItem, index) => (
                <motion.div
                  key={classItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6 hover:bg-white/5 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-3 bg-red-600/20 rounded-xl">
                        <Video className="h-6 w-6 text-red-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h4 className="text-lg font-medium text-white">{classItem.title}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(classItem.status)}`}>
                            {classItem.status.charAt(0).toUpperCase() + classItem.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-3">{classItem.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{classItem.course}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(classItem.schedule).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(classItem.schedule).toLocaleTimeString()} ({classItem.duration} min)</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{classItem.currentParticipants}/{classItem.maxParticipants}</span>
                          </div>
                          {user.role === 'STUDENT' && (
                            <span>• {classItem.instructor}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {classItem.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {classItem.status === 'live' && (
                        <button
                          onClick={() => joinClass(classItem)}
                          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 animate-pulse"
                        >
                          <Video className="h-4 w-4" />
                          <span>Join Live</span>
                        </button>
                      )}
                      {classItem.status === 'scheduled' && (
                        <button
                          onClick={() => joinClass(classItem)}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                          <Video className="h-4 w-4" />
                          <span>{user.role === 'TEACHER' || user.role === 'ADMIN' ? 'Start Class' : 'Join Class'}</span>
                        </button>
                      )}
                      {classItem.status === 'completed' && classItem.recordingUrl && (
                        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                          <Play className="h-4 w-4" />
                          <span>View Recording</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="recordings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredRecordings.map((recording, index) => (
                <motion.div
                  key={recording.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedRecording(recording)}
                  className="glass rounded-2xl overflow-hidden cursor-pointer group hover:scale-105 transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={recording.thumbnailUrl}
                      alt={recording.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        <Play className="h-8 w-8 text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                      {Math.floor(recording.duration / 60)}:{(recording.duration % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      Recording
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="text-lg font-medium text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {recording.title}
                    </h4>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">{recording.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{recording.instructor}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{recording.views} views</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm">{recording.rating}</span>
                      </div>
                      <span className="text-gray-400 text-xs">
                        {new Date(recording.recordedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {recording.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-600/20 rounded-lg">
                <Video className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Live Classes</p>
                <p className="text-2xl font-bold text-white">
                  {liveClasses.filter(c => c.status === 'live').length}
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Play className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Recordings</p>
                <p className="text-2xl font-bold text-white">{recordings.length}</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <Users className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Participants</p>
                <p className="text-2xl font-bold text-white">
                  {liveClasses.reduce((sum, c) => sum + c.currentParticipants, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Clock className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Hours</p>
                <p className="text-2xl font-bold text-white">
                  {Math.floor(recordings.reduce((sum, r) => sum + r.duration, 0) / 3600)}h
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClasses;