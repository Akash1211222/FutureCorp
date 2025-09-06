import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Award, 
  Clock, 
  Target,
  Zap,
  Star,
  Trophy,
  Rocket
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const teacherStats = [
    { icon: Users, label: 'Total Students', value: '156', color: 'from-blue-500 to-cyan-500' },
    { icon: BookOpen, label: 'Active Courses', value: '12', color: 'from-purple-500 to-pink-500' },
    { icon: TrendingUp, label: 'Avg. Performance', value: '87%', color: 'from-green-500 to-emerald-500' },
    { icon: Award, label: 'Achievements', value: '24', color: 'from-orange-500 to-red-500' },
  ];

  const studentStats = [
    { icon: BookOpen, label: 'Enrolled Courses', value: '8', color: 'from-blue-500 to-cyan-500' },
    { icon: Target, label: 'Completed', value: '5', color: 'from-green-500 to-emerald-500' },
    { icon: Clock, label: 'Study Hours', value: '124', color: 'from-purple-500 to-pink-500' },
    { icon: Trophy, label: 'Achievements', value: '15', color: 'from-orange-500 to-red-500' },
  ];

  const getStats = () => {
    switch (user.role) {
      case 'TEACHER':
      case 'ADMIN':
        return teacherStats;
      default:
        return studentStats;
    }
  };

  const stats = getStats();

  return (
    <div className="space-y-6 relative">
      {/* Floating 3D background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-purple-600/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-xl animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-gradient-to-r from-indigo-400/10 to-blue-600/10 rounded-full blur-xl animate-float animation-delay-4000"></div>
      </div>

      {/* Welcome Section */}
      <div className="glass rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse3d">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold gradient-text">
                Welcome back, {user?.name}! 🚀
              </h1>
              <p className="text-gray-300 text-base md:text-lg">
                {user.role === 'TEACHER' || user.role === 'ADMIN'
                  ? 'Ready to inspire minds and shape the future?' 
                  : 'Ready to learn something amazing today?'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400 animate-glow" />
              <span>Learn. Code. Create.</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-400 animate-pulse" />
              <span>Powered by FutureCorp's</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="desktop-grid">
        {stats.map((stat, index) => (
          <div 
            key={stat.label} 
            className="glass rounded-2xl p-6 card-hover relative overflow-hidden group desktop-card"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            <div className="relative z-10">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 animate-rotate3d`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Target className="w-6 h-6 mr-3 text-blue-400 animate-pulse3d" />
          Quick Actions
        </h2>
        
        <div className="desktop-grid">
          {user.role === 'TEACHER' || user.role === 'ADMIN' ? (
            <>
              <ActionCard 
                icon={BookOpen} 
                title="Create Course" 
                description="Design new learning experiences"
                color="from-blue-500 to-cyan-500"
              />
              <ActionCard 
                icon={Users} 
                title="Manage Students" 
                description="Track student progress"
                color="from-purple-500 to-pink-500"
              />
              <ActionCard 
                icon={TrendingUp} 
                title="View Analytics" 
                description="Analyze performance data"
                color="from-green-500 to-emerald-500"
              />
            </>
          ) : (
            <>
              <ActionCard 
                icon={BookOpen} 
                title="Browse Courses" 
                description="Discover new subjects"
                color="from-blue-500 to-cyan-500"
              />
              <ActionCard 
                icon={Target} 
                title="Practice Coding" 
                description="Sharpen your skills"
                color="from-purple-500 to-pink-500"
              />
              <ActionCard 
                icon={Trophy} 
                title="View Progress" 
                description="Track your achievements"
                color="from-green-500 to-emerald-500"
              />
            </>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Clock className="w-6 h-6 mr-3 text-green-400 animate-glow" />
          Recent Activity
        </h2>
        
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center space-x-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 card-hover">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse3d">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">
                  {user.role === 'TEACHER' || user.role === 'ADMIN'
                    ? `Student completed "Advanced React Concepts"` 
                    : `Completed lesson: "JavaScript Fundamentals"`
                  }
                </p>
                <p className="text-gray-400 text-sm">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ActionCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}> = ({ icon: Icon, title, description, color }) => (
  <div className="glass rounded-2xl p-6 card-hover group cursor-pointer relative overflow-hidden">
    <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
    <div className="relative z-10">
      <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center mb-4 group-hover:animate-rotate3d`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  </div>
);

export default Dashboard;