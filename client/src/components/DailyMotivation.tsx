import React, { useState, useEffect } from 'react';
import { Lightbulb, Star, Target, Zap, Heart, Trophy, Rocket, BookOpen } from 'lucide-react';

const DailyMotivation: React.FC = () => {
  const [currentMotivation, setCurrentMotivation] = useState(0);

  const motivations = [
    {
      quote: "The expert in anything was once a beginner.",
      author: "Helen Hayes",
      icon: Lightbulb,
      color: "from-yellow-500 to-orange-500"
    },
    {
      quote: "Code is like humor. When you have to explain it, it's bad.",
      author: "Cory House",
      icon: Star,
      color: "from-blue-500 to-purple-500"
    },
    {
      quote: "Learning never exhausts the mind.",
      author: "Leonardo da Vinci",
      icon: BookOpen,
      color: "from-green-500 to-teal-500"
    },
    {
      quote: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      icon: Heart,
      color: "from-pink-500 to-red-500"
    },
    {
      quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill",
      icon: Trophy,
      color: "from-purple-500 to-indigo-500"
    },
    {
      quote: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs",
      icon: Rocket,
      color: "from-orange-500 to-red-500"
    },
    {
      quote: "The future belongs to those who learn more skills and combine them in creative ways.",
      author: "Robert Greene",
      icon: Target,
      color: "from-cyan-500 to-blue-500"
    },
    {
      quote: "Programming isn't about what you know; it's about what you can figure out.",
      author: "Chris Pine",
      icon: Zap,
      color: "from-emerald-500 to-green-500"
    }
  ];

  useEffect(() => {
    // Change motivation daily based on date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    setCurrentMotivation(dayOfYear % motivations.length);
  }, []);

  const motivation = motivations[currentMotivation];
  const Icon = motivation.icon;

  return (
    <div className="mb-6">
      <div className="glass rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
        <div className={`absolute inset-0 bg-gradient-to-r ${motivation.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
        
        <div className="relative z-10 flex items-start space-x-4">
          <div className={`p-3 bg-gradient-to-r ${motivation.color} rounded-xl animate-pulse3d`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-white">Daily Motivation</h3>
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 text-yellow-400 animate-glow" />
                ))}
              </div>
            </div>
            
            <blockquote className="text-gray-200 text-lg italic mb-3 leading-relaxed">
              "{motivation.quote}"
            </blockquote>
            
            <div className="flex items-center justify-between">
              <cite className="text-gray-400 text-sm">— {motivation.author}</cite>
              <div className="text-xs text-gray-500 bg-white/10 px-2 py-1 rounded-full">
                Day {new Date().getDate()} Inspiration
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 opacity-20">
          <div className="w-16 h-16 border-2 border-white rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
        </div>
        <div className="absolute bottom-4 right-8 opacity-10">
          <div className="w-8 h-8 bg-white rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default DailyMotivation;