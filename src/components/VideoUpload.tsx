import React, { useState } from 'react';
import { Upload, Video, Plus, Edit, Trash2, Play, Eye } from 'lucide-react';

interface VideoContent {
  id: string;
  title: string;
  description: string;
  course: string;
  duration: string;
  uploadDate: string;
  views: number;
  thumbnail: string;
}

const VideoUpload: React.FC = () => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [videos] = useState<VideoContent[]>([
    {
      id: '1',
      title: 'Introduction to React Hooks',
      description: 'Learn the fundamentals of React Hooks including useState and useEffect.',
      course: 'React Mastery',
      duration: '24:15',
      uploadDate: '2024-01-15',
      views: 156,
      thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '2',
      title: 'Advanced Component Patterns',
      description: 'Explore advanced React patterns like render props and compound components.',
      course: 'React Mastery',
      duration: '31:42',
      uploadDate: '2024-01-10',
      views: 89,
      thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '3',
      title: 'State Management with Redux',
      description: 'Deep dive into Redux for managing application state in React applications.',
      course: 'React Mastery',
      duration: '45:30',
      uploadDate: '2024-01-05',
      views: 203,
      thumbnail: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Video Content</h1>
          <p className="text-gray-600">Upload and manage your educational videos.</p>
        </div>
        <button
          onClick={() => setShowUploadForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Upload Video
        </button>
      </div>

      {showUploadForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Video</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter video title"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter video description"
              />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Drop your video file here</p>
              <p className="text-gray-600 mb-4">or click to browse</p>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Choose File
              </button>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload Video
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Video List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Videos</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {videos.map((video) => (
            <div key={video.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-24 h-16 rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="h-6 w-6 text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                    {video.duration}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-1">{video.title}</h4>
                      <p className="text-gray-600 mb-2">{video.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{video.course}</span>
                        <span>•</span>
                        <span>Uploaded {new Date(video.uploadDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {video.views} views
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;