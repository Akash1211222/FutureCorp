import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Text } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MonitorOff,
  Phone,
  PhoneOff,
  MessageSquare,
  Hand,
  Users,
  Settings,
  Record,
  Square,
  Send,
  Maximize,
  Minimize
} from 'lucide-react';
import { useLiveClass } from '../../stores/liveClassStore';
import { useAuth } from '../../stores/authStore';

interface LiveClassroomProps {
  classId: string;
  onLeave: () => void;
}

const LiveClassroom: React.FC<LiveClassroomProps> = ({ classId, onLeave }) => {
  const { user } = useAuth();
  const {
    participants,
    messages,
    isAudioMuted,
    isVideoOff,
    isScreenSharing,
    isRecording,
    isTeacher,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    startRecording,
    stopRecording,
    sendMessage,
    raiseHand,
    leaveClass
  } = useLiveClass();

  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleLeaveClass = () => {
    leaveClass();
    onLeave();
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700"
      >
        <div className="flex items-center space-x-4">
          <h1 className="text-white font-semibold text-lg">Live Class Session</h1>
          {isRecording && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-red-600 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">Recording</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-gray-300 text-sm">
            <Users className="h-4 w-4" />
            <span>{participants.length} participants</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
          <button
            onClick={handleLeaveClass}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <PhoneOff className="h-4 w-4" />
            <span>Leave</span>
          </button>
        </div>
      </motion.div>

      <div className="flex-1 flex">
        {/* Main Video Area */}
        <div className={`flex-1 flex flex-col ${showChat ? 'mr-80' : ''} transition-all duration-300`}>
          {/* 3D Background Scene */}
          <div className="absolute inset-0 opacity-20">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={0.5} />
              <Environment preset="night" />
              
              <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
                <mesh position={[3, 2, -5]}>
                  <sphereGeometry args={[0.5, 32, 32]} />
                  <meshStandardMaterial color="#3b82f6" transparent opacity={0.6} />
                </mesh>
              </Float>
              
              <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.3}>
                <mesh position={[-3, -1, -4]}>
                  <boxGeometry args={[0.8, 0.8, 0.8]} />
                  <meshStandardMaterial color="#8b5cf6" transparent opacity={0.6} />
                </mesh>
              </Float>
              
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.2} />
            </Canvas>
          </div>

          {/* Video Grid */}
          <div className="flex-1 p-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-full">
              {/* Teacher's main video (larger) */}
              {isTeacher && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="md:col-span-2 lg:col-span-2 relative bg-gray-800 rounded-xl overflow-hidden shadow-2xl"
                >
                  {!isVideoOff ? (
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      className="w-full h-full object-cover"
                      mirrored
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Video className="h-10 w-10 text-white" />
                        </div>
                        <p className="text-white text-lg font-medium">{user?.name} (You)</p>
                        <p className="text-gray-300 text-sm">Teacher</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Teacher controls overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {isAudioMuted && (
                          <div className="bg-red-600 p-2 rounded-full">
                            <MicOff className="h-4 w-4 text-white" />
                          </div>
                        )}
                        {isVideoOff && (
                          <div className="bg-gray-600 p-2 rounded-full">
                            <VideoOff className="h-4 w-4 text-white" />
                          </div>
                        )}
                        {isScreenSharing && (
                          <div className="bg-blue-600 p-2 rounded-full">
                            <Monitor className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="bg-black/50 px-3 py-1 rounded-full">
                        <p className="text-white text-sm font-medium">Teacher</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Participants */}
              {participants.map((participant, index) => (
                <motion.div
                  key={participant.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg"
                >
                  {!participant.isVideoOff ? (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Video className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-white font-medium">{participant.name}</p>
                      </div>
                    </div>
                  ) : (
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
                  )}
                  
                  {/* Participant status indicators */}
                  <div className="absolute top-2 left-2 flex space-x-1">
                    {participant.isAudioMuted && (
                      <div className="bg-red-600 p-1 rounded">
                        <MicOff className="h-3 w-3 text-white" />
                      </div>
                    )}
                    {participant.isVideoOff && (
                      <div className="bg-gray-600 p-1 rounded">
                        <VideoOff className="h-3 w-3 text-white" />
                      </div>
                    )}
                    {participant.isHandRaised && (
                      <div className="bg-yellow-600 p-1 rounded animate-bounce">
                        <Hand className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute bottom-2 right-2">
                    <div className="bg-black/50 px-2 py-1 rounded">
                      <p className="text-white text-xs">{participant.name}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Add empty slots for better grid layout */}
              {Array.from({ length: Math.max(0, 6 - participants.length) }).map((_, index) => (
                <div key={`empty-${index}`} className="bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Waiting for participants...</p>
                </div>
              ))}
            </div>
          </div>

          {/* Controls Bar */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gray-800 px-6 py-4 border-t border-gray-700"
          >
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={toggleAudio}
                className={`p-3 rounded-full transition-all duration-300 ${
                  isAudioMuted 
                    ? 'bg-red-600 hover:bg-red-700 scale-110' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isAudioMuted ? (
                  <MicOff className="h-5 w-5 text-white" />
                ) : (
                  <Mic className="h-5 w-5 text-white" />
                )}
              </button>

              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full transition-all duration-300 ${
                  isVideoOff 
                    ? 'bg-red-600 hover:bg-red-700 scale-110' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isVideoOff ? (
                  <VideoOff className="h-5 w-5 text-white" />
                ) : (
                  <Video className="h-5 w-5 text-white" />
                )}
              </button>

              {isTeacher && (
                <>
                  <button
                    onClick={toggleScreenShare}
                    className={`p-3 rounded-full transition-all duration-300 ${
                      isScreenSharing 
                        ? 'bg-blue-600 hover:bg-blue-700 scale-110' 
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    {isScreenSharing ? (
                      <MonitorOff className="h-5 w-5 text-white" />
                    ) : (
                      <Monitor className="h-5 w-5 text-white" />
                    )}
                  </button>

                  <button
                    onClick={toggleRecording}
                    className={`p-3 rounded-full transition-all duration-300 ${
                      isRecording 
                        ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    {isRecording ? (
                      <Square className="h-5 w-5 text-white" />
                    ) : (
                      <Record className="h-5 w-5 text-white" />
                    )}
                  </button>
                </>
              )}

              {!isTeacher && (
                <button
                  onClick={raiseHand}
                  className="p-3 rounded-full bg-yellow-600 hover:bg-yellow-700 transition-all duration-300"
                >
                  <Hand className="h-5 w-5 text-white" />
                </button>
              )}

              <button className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors">
                <Settings className="h-5 w-5 text-white" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Chat Sidebar */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col"
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Live Chat
                  </h3>
                  <button
                    onClick={() => setShowChat(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm"
                    >
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs">
                            {message.senderName.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-blue-400 font-medium">{message.senderName}</span>
                            <span className="text-gray-500 text-xs">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-gray-300">{message.message}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LiveClassroom;