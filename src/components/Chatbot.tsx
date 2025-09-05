import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Lightbulb, BookOpen, Code, Video } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'suggestion';
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  userRole: 'teacher' | 'student';
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onToggle, userRole }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! I'm your FutureCorp's Learning Assistant. I'm here to help you with course-related questions, assignments, and learning guidance. How can I assist you today?`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const courseKnowledgeBase = {
    'react': {
      keywords: ['react', 'jsx', 'hooks', 'component', 'state', 'props', 'useeffect', 'usestate'],
      responses: [
        "React is a JavaScript library for building user interfaces. Key concepts include components, JSX, state, and props.",
        "React Hooks like useState and useEffect allow you to use state and lifecycle methods in functional components.",
        "Components are reusable pieces of UI that can accept props and manage their own state."
      ]
    },
    'javascript': {
      keywords: ['javascript', 'js', 'function', 'variable', 'array', 'object', 'loop', 'async'],
      responses: [
        "JavaScript is a versatile programming language used for web development. It supports functions, objects, arrays, and asynchronous programming.",
        "Key JavaScript concepts include variables (let, const, var), functions, objects, arrays, and control structures like loops and conditionals.",
        "Modern JavaScript features include arrow functions, destructuring, async/await, and ES6+ syntax."
      ]
    },
    'css': {
      keywords: ['css', 'style', 'flexbox', 'grid', 'responsive', 'design', 'layout'],
      responses: [
        "CSS is used for styling web pages. Key concepts include selectors, properties, flexbox, grid, and responsive design.",
        "Flexbox and CSS Grid are powerful layout systems for creating responsive designs.",
        "Responsive design uses media queries to adapt layouts for different screen sizes."
      ]
    },
    'assignments': {
      keywords: ['assignment', 'homework', 'dsa', 'algorithm', 'problem', 'coding', 'solution'],
      responses: [
        "For DSA problems, start by understanding the problem statement, then think about the algorithm approach before coding.",
        "Use the hint system progressively - try to solve on your own first, then use hints if you're stuck.",
        "Practice regularly with different difficulty levels to improve your problem-solving skills."
      ]
    },
    'general': {
      keywords: ['help', 'course', 'learn', 'study', 'progress', 'schedule'],
      responses: [
        "I can help you with course content, assignments, study tips, and technical questions.",
        "For the best learning experience, maintain a consistent study schedule and practice coding regularly.",
        "Don't hesitate to ask specific questions about any topic you're studying!"
      ]
    }
  };

  const quickSuggestions = [
    "How do I solve DSA problems?",
    "Explain React hooks",
    "What is JavaScript closure?",
    "CSS flexbox tutorial",
    "How to join live classes?",
    "Assignment submission help"
  ];

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Check for specific topics
    for (const [topic, data] of Object.entries(courseKnowledgeBase)) {
      if (data.keywords.some(keyword => message.includes(keyword))) {
        const responses = data.responses;
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }

    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! I'm here to help you with your learning journey. What would you like to know about?";
    }

    // Default responses
    const defaultResponses = [
      "That's an interesting question! Could you provide more specific details about what you'd like to learn?",
      "I'd be happy to help! Can you tell me more about the specific topic or problem you're working on?",
      "For detailed technical questions, I recommend checking the course materials or asking during live classes. Is there a specific concept I can explain?",
      "I can help with course content, assignments, and study guidance. What specific area would you like assistance with?"
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const sendSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={onToggle}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 ${
          isOpen ? 'rotate-180' : ''
        }`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] glass rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Learning Assistant</h3>
                <p className="text-xs opacity-90">Course & Assignment Help</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <Bot className="h-4 w-4 mt-0.5 text-blue-400 flex-shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User className="h-4 w-4 mt-0.5 text-white flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-gray-200 p-3 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-blue-400" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 1 && (
            <div className="p-4 border-t border-white/10">
              <p className="text-xs text-gray-400 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.slice(0, 3).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => sendSuggestion(suggestion)}
                    className="text-xs px-2 py-1 bg-white/10 text-gray-300 rounded-full hover:bg-white/20 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about courses..."
                className="flex-1 px-3 py-2 bg-white/10 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;