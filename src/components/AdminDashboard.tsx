import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Video, TrendingUp, Shield, Settings, UserPlus, Database } from 'lucide-react';
import apiClient from '../utils/api';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalAssignments: 0,
    totalClasses: 0,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await apiClient.getUsers();
        setUsers(usersData);
        
        const totalUsers = usersData.length;
        const totalStudents = usersData.filter((u: any) => u.role === 'STUDENT').length;
        const totalTeachers = usersData.filter((u: any) => u.role === 'TEACHER').length;
        
        setStats({
          totalUsers,
          totalStudents,
          totalTeachers,
          totalAssignments: 25, // Mock data
          totalClasses: 12, // Mock data
        });
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold gradient-text">Admin Dashboard</h1>
            <p className="text-gray-300">Manage users, content, and system settings</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.totalUsers.toString()}
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={Users}
          label="Students"
          value={stats.totalStudents.toString()}
          color="from-green-500 to-emerald-500"
        />
        <StatCard
          icon={Users}
          label="Teachers"
          value={stats.totalTeachers.toString()}
          color="from-purple-500 to-pink-500"
        />
        <StatCard
          icon={BookOpen}
          label="Assignments"
          value={stats.totalAssignments.toString()}
          color="from-orange-500 to-red-500"
        />
        <StatCard
          icon={Video}
          label="Live Classes"
          value={stats.totalClasses.toString()}
          color="from-indigo-500 to-purple-500"
        />
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-400" />
              User Management
            </h2>
            <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </button>
          </div>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {users.slice(0, 5).map((user: any) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                    user.role === 'TEACHER' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                  <button className="p-1 text-gray-400 hover:text-white">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Overview */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Database className="w-5 h-5 mr-2 text-green-400" />
            System Overview
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-gray-300">Database Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-gray-300">Server Uptime</span>
              <span className="text-white font-medium">99.9%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-gray-300">Active Sessions</span>
              <span className="text-white font-medium">{stats.totalUsers}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <span className="text-gray-300">Storage Used</span>
              <span className="text-white font-medium">2.4 GB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActionButton
            icon={UserPlus}
            label="Add New User"
            description="Create teacher or student account"
            color="from-blue-500 to-cyan-500"
          />
          <ActionButton
            icon={BookOpen}
            label="Manage Content"
            description="Review assignments and courses"
            color="from-purple-500 to-pink-500"
          />
          <ActionButton
            icon={TrendingUp}
            label="View Analytics"
            description="System performance metrics"
            color="from-green-500 to-emerald-500"
          />
          <ActionButton
            icon={Settings}
            label="System Settings"
            description="Configure platform settings"
            color="from-orange-500 to-red-500"
          />
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}> = ({ icon: Icon, label, value, color }) => (
  <div className="glass rounded-2xl p-4 md:p-6 card-hover">
    <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center mb-3 md:mb-4`}>
      <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
    </div>
    <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{value}</h3>
    <p className="text-gray-400 text-sm">{label}</p>
  </div>
);

const ActionButton: React.FC<{
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
}> = ({ icon: Icon, label, description, color }) => (
  <button className="glass rounded-2xl p-4 card-hover group cursor-pointer text-left">
    <div className={`w-10 h-10 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <h3 className="text-white font-semibold mb-1">{label}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </button>
);

export default AdminDashboard;