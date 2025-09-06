import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  Plus, 
  Settings, 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff,
  Monitor,
  MessageSquare,
  Phone,
  PhoneOff,
  Hand,
  Share
} from 'lucide-react';

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
  meetingUrl?: string;
  participants?: string[];
}

interface LiveClassState {
  isInClass: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  participants: Array<{
    id: string;
    name: string;
    isMuted: boolean;
    isCameraOff: boolean;
  }>;
  messages: Array<{
    id: string;
    sender: string;
    message: string;
    timestamp: Date;
  }>;
}

const OnlineClasses: React.FC = () => {
  const { user } = useAuth();
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState<OnlineClass | null>(null);
  const [newMessage, setNewMessage] = useState('');
  
  if (!user) return null;
  
  const [liveClassState, setLiveClassState] = useState<LiveClassState>({
    isInClass: false,
    isMuted: false,
    isCameraOff: false,
    isScreenSharing: false,
    participants: [
      { id: '1', name: 'Dr. Sarah Johnson', isMuted: false, isCameraOff: false },
      { id: '2', name: 'Alice Johnson', isMuted: true, isCameraOff: false },
      { id: '3', name: 'Bob Wilson', isMuted: true, isCameraOff: true },
      { id: '4', name: 'Carol Davis', isMuted: false, isCameraOff: false },
    ],
    messages: [
      { id: '1', sender: 'Dr. Sarah Johnson', message: 'Welcome everyone to today\'s React Hooks session!', timestamp: new Date() },
      { id: '2', sender: 'Alice Johnson', message: 'Thank you! Excited to learn about useEffect', timestamp: new Date() },
      { id: '3', sender: 'Bob Wilson', message: 'Can you share the slides?', timestamp: new Date() },
    ]
  });

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
      instructor: 'Dr. Sarah Johnson',
      meetingUrl: 'https://meet.futurecorp.com/react-hooks-101'
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
      instructor: 'Dr. Sarah Johnson',
      meetingUrl: 'https://meet.futurecorp.com/state-management-live'
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

  const joinClass = (classItem: OnlineClass) => {
    setSelectedClass(classItem);
    setLiveClassState(prev => ({ ...prev, isInClass: true }));
  };

  const leaveClass = () => {
    setLiveClassState(prev => ({ ...prev, isInClass: false }));
    setSelectedClass(null);
  };

  const toggleMute = () => {
    setLiveClassState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const toggleCamera = () => {
    setLiveClassState(prev => ({ ...prev, isCameraOff: !prev.isCameraOff }));
  };

  const toggleScreenShare = () => {
    setLiveClassState(prev => ({ ...prev, isScreenSharing: !prev.isScreenSharing }));
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        sender: user.role === 'TEACHER' || user.role === 'ADMIN' ? 'Dr. Sarah Johnson' : 'You',
        message: newMessage,
        timestamp: new Date()
      };
      setLiveClassState(prev => ({
        ...prev,
        messages: [...prev.messages, message]
      }));
      setNewMessage('');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      upcoming: 'bg-blue-100 text-blue-800',
      live: 'bg-red-100 text-red-800 animate-pulse',
      completed: 'bg-green-100 text-green-800'
    };
    return badges[status as keyof typeof badges] || badges.upcoming;
  };

  // Live Class Interface
  if (liveClassState.isInClass && selectedClass) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-white font-semibold text-lg">{selectedClass.title}</h1>
            <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full animate-pulse">
              LIVE
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-300 text-sm">
              {liveClassState.participants.length} participants
            </span>
            <button
              onClick={leaveClass}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <PhoneOff className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Main Video Area */}
          <div className="flex-1 flex flex-col">
            {/* Video Grid */}
            <div className="flex-1 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
                {liveClassState.participants.map((participant) => (
                  <div key={participant.id} className="relative bg-gray-800 rounded-lg overflow-hidden">
                    {participant.isCameraOff ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-700">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-white font-semibold text-lg">
                              {participant.name.charAt(0)}
                            </span>
                          </div>
                          <p className="text-white text-sm">{participant.name}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Camera className="h-8 w-8 text-white" />
                          </div>
                          <p className="text-white">{participant.name}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Participant Controls */}
                    <div className="absolute bottom-2 left-2 flex space-x-1">
                      {participant.isMuted && (
                        <div className="bg-red-600 p-1 rounded">
                          <MicOff className="h-3 w-3 text-white" />
                        </div>
                      )}
                      {participant.isCameraOff && (
                        <div className="bg-gray-600 p-1 rounded">
                          <CameraOff className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute bottom-2 right-2">
                      <p className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                        {participant.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-800 px-6 py-4">
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={toggleMute}
                  className={`p-3 rounded-full transition-colors ${
                    liveClassState.isMuted 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {liveClassState.isMuted ? (
                    <MicOff className="h-5 w-5 text-white" />
                  ) : (
                    <Mic className="h-5 w-5 text-white" />
                  )}
                </button>

                <button
                  onClick={toggleCamera}
                  className={`p-3 rounded-full transition-colors ${
                    liveClassState.isCameraOff 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {liveClassState.isCameraOff ? (
                    <CameraOff className="h-5 w-5 text-white" />
                  ) : (
                    <Camera className="h-5 w-5 text-white" />
                  )}
                </button>

                {(user.role === 'TEACHER' || user.role === 'ADMIN') && (
                  <button
                    onClick={toggleScreenShare}
                    className={`p-3 rounded-full transition-colors ${
                      liveClassState.isScreenSharing 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    <Monitor className="h-5 w-5 text-white" />
                  </button>
                )}

                <button className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors">
                  <Hand className="h-5 w-5 text-white" />
                </button>

                <button className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors">
                  <Share className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {liveClassState.messages.map((message) => (
                <div key={message.id} className="text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">
                        {message.sender.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-blue-400 font-medium">{message.sender}</span>
                        <span className="text-gray-500 text-xs">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-300">{message.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send
                </button>
              </div>
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
              {user.role === 'TEACHER' || user.role === 'ADMIN' ? 'Online Classes' : 'My Classes'}
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              {user.role === 'TEACHER' || user.role === 'ADMIN'
                ? 'Schedule and manage your live classes.' 
                : 'Join your scheduled classes and view recordings.'
              }
            </p>
          </div>
          {(user.role === 'TEACHER' || user.role === 'ADMIN') && (
            <button
              onClick={() => setShowScheduleForm(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              <Plus className="h-4 w-5 mr-2" />
              Schedule Class
            </button>
          )}
        </div>

        {showScheduleForm && (user.role === 'TEACHER' || user.role === 'ADMIN') && (
          <div className="glass rounded-2xl p-4 md:p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Schedule New Class</h3>
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
                    <option>React Mastery</option>
                    <option>JavaScript Fundamentals</option>
                    <option>Web Design Principles</option>
                  </select>
                </div>
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

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  type="button"
                  onClick={() => setShowScheduleForm(false)}
                  className="px-4 py-2 text-gray-300 glass rounded-lg hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  Schedule Class
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Classes List */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-4 md:p-6 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">
              {user.role === 'TEACHER' || user.role === 'ADMIN' ? 'Scheduled Classes' : 'Your Classes'}
            </h3>
          </div>
          <div className="divide-y divide-white/10">
            {classes.map((class_) => (
              <div key={class_.id} className="p-4 md:p-6 hover:bg-white/5 transition-colors">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-3 bg-blue-600/20 rounded-lg">
                      <Video className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h4 className="text-lg font-medium text-white">{class_.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(class_.status)}`}>
                          {class_.status.charAt(0).toUpperCase() + class_.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">{class_.course}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
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
                        {user.role === 'STUDENT' && class_.instructor && (
                          <span>• {class_.instructor}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {class_.status === 'live' && (
                      <button
                        onClick={() => joinClass(class_)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Join Live
                      </button>
                    )}
                    {class_.status === 'upcoming' && (
                      <button
                        onClick={() => joinClass(class_)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {user.role === 'TEACHER' || user.role === 'ADMIN' ? 'Start Class' : 'Join Class'}
                      </button>
                    )}
                    {class_.status === 'completed' && (
                      <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                        View Recording
                      </button>
                    )}
                    {(user.role === 'TEACHER' || user.role === 'ADMIN') && (
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
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
    </div>
  );
};

export default OnlineClasses;