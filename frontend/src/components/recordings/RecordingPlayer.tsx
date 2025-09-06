import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Download, 
  Share2,
  Clock,
  Calendar,
  User,
  BookOpen,
  Star,
  MessageSquare
} from 'lucide-react';

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

interface RecordingPlayerProps {
  recording: Recording;
  onClose: () => void;
}

const RecordingPlayer: React.FC<RecordingPlayerProps> = ({ recording, onClose }) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showChatLog, setShowChatLog] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const playerRef = useRef<ReactPlayer>(null);

  const handleProgress = (state: any) => {
    setPlayed(state.played);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTo = parseFloat(e.target.value);
    setPlayed(seekTo);
    if (playerRef.current) {
      playerRef.current.seekTo(seekTo);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadRecording = () => {
    // In a real implementation, this would trigger a download
    console.log('Downloading recording:', recording.id);
  };

  const shareRecording = () => {
    // In a real implementation, this would open share options
    console.log('Sharing recording:', recording.id);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-6xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{recording.title}</h2>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{recording.instructor}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{recording.course}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(recording.recordedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>{recording.rating}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowChatLog(!showChatLog)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <MessageSquare className="h-5 w-5" />
              </button>
              <button
                onClick={shareRecording}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button
                onClick={downloadRecording}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Video Player */}
          <div className={`flex-1 ${showChatLog ? 'pr-80' : ''} transition-all duration-300`}>
            <div className="relative bg-black">
              <ReactPlayer
                ref={playerRef}
                url={recording.videoUrl}
                width="100%"
                height="500px"
                playing={playing}
                volume={volume}
                muted={muted}
                playbackRate={playbackRate}
                onProgress={handleProgress}
                onDuration={handleDuration}
                controls={false}
              />
              
              {/* Custom Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                {/* Progress Bar */}
                <div className="mb-4">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={played}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-300 mt-1">
                    <span>{formatTime(played * duration)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setPlaying(!playing)}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                      {playing ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </button>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setMuted(!muted)}
                        className="p-2 text-white hover:bg-gray-700 rounded transition-colors"
                      >
                        {muted ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <select
                      value={playbackRate}
                      onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                      className="bg-gray-700 text-white text-sm rounded px-2 py-1 focus:outline-none"
                    >
                      <option value={0.5}>0.5x</option>
                      <option value={0.75}>0.75x</option>
                      <option value={1}>1x</option>
                      <option value={1.25}>1.25x</option>
                      <option value={1.5}>1.5x</option>
                      <option value={2}>2x</option>
                    </select>
                  </div>

                  <button className="p-2 text-white hover:bg-gray-700 rounded transition-colors">
                    <Maximize className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Recording Info */}
            <div className="p-6 bg-gray-800">
              <p className="text-gray-300 mb-4">{recording.description}</p>
              <div className="flex flex-wrap gap-2">
                {recording.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Log Sidebar */}
          {showChatLog && recording.chatLog && (
            <motion.div
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col"
            >
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-white font-semibold">Chat Log</h3>
                <p className="text-gray-400 text-sm">Messages from live session</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {recording.chatLog.map((chat, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-blue-400 font-medium">{chat.sender}</span>
                      <span className="text-gray-500 text-xs">
                        {formatTime(chat.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-300">{chat.message}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RecordingPlayer;