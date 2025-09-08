import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Text } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Code, 
  Terminal, 
  Save, 
  Download, 
  Settings,
  Zap,
  Lightbulb,
  BookOpen,
  Share2,
  Copy,
  RotateCcw
} from 'lucide-react';

const Playground: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState(`// Welcome to the 3D Code Playground! 🚀
// Try writing some JavaScript code here

function greetUser(name) {
  return \`Hello, \${name}! Welcome to FutureCorp's 3D Learning Platform!\`;
}

console.log(greetUser("Future Developer"));

// Try some array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const sum = doubled.reduce((a, b) => a + b, 0);

console.log("Original numbers:", numbers);
console.log("Doubled numbers:", doubled);
console.log("Sum of doubled numbers:", sum);

// Object manipulation
const student = {
  name: "Alex",
  courses: ["React", "Node.js", "Python"],
  score: 95
};

console.log(\`\${student.name} is enrolled in \${student.courses.length} courses\`);
console.log(\`Current score: \${student.score}%\`);`);

  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState('dark');

  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: '🟨', color: 'from-yellow-500 to-orange-500' },
    { id: 'python', name: 'Python', icon: '🐍', color: 'from-green-500 to-blue-500' },
    { id: 'html', name: 'HTML', icon: '🌐', color: 'from-orange-500 to-red-500' },
    { id: 'css', name: 'CSS', icon: '🎨', color: 'from-blue-500 to-purple-500' },
    { id: 'typescript', name: 'TypeScript', icon: '🔷', color: 'from-blue-600 to-indigo-600' },
    { id: 'react', name: 'React', icon: '⚛️', color: 'from-cyan-500 to-blue-500' }
  ];

  const codeExamples = {
    javascript: [
      {
        title: 'Array Methods',
        code: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(x => x * 2);
const filtered = numbers.filter(x => x > 2);
console.log("Doubled:", doubled);
console.log("Filtered:", filtered);`,
        description: 'Working with array methods'
      },
      {
        title: 'Async/Await',
        code: `async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    console.log('Data:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}`,
        description: 'Asynchronous programming'
      },
      {
        title: 'Object Destructuring',
        code: `const user = { name: 'Alice', age: 25, city: 'NYC' };
const { name, age, ...rest } = user;
console.log(name, age, rest);

const [first, second, ...others] = [1, 2, 3, 4, 5];
console.log(first, second, others);`,
        description: 'ES6 destructuring syntax'
      }
    ],
    python: [
      {
        title: 'List Comprehension',
        code: `numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]
even_squares = [x**2 for x in numbers if x % 2 == 0]
print("Squared:", squared)
print("Even squares:", even_squares)`,
        description: 'Python list comprehensions'
      }
    ],
    react: [
      {
        title: 'Functional Component',
        code: `import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
        description: 'React hooks example'
      }
    ]
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput('Running code...\n');
    
    setTimeout(() => {
      if (selectedLanguage === 'javascript') {
        try {
          const logs: string[] = [];
          const mockConsole = {
            log: (...args: any[]) => {
              logs.push(args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
              ).join(' '));
            },
            error: (...args: any[]) => {
              logs.push('ERROR: ' + args.map(arg => String(arg)).join(' '));
            }
          };
          
          const func = new Function('console', code);
          func(mockConsole);
          
          setOutput(logs.join('\n') || '✅ Code executed successfully!');
        } catch (error) {
          setOutput(`❌ Error: ${error}`);
        }
      } else {
        setOutput(`✅ ${selectedLanguage} code execution simulated!\n\nYour code would run here in a real environment.\nThis is a demo of the ${selectedLanguage} playground.`);
      }
      setIsRunning(false);
    }, 1500);
  };

  const saveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `playground-code.${selectedLanguage === 'javascript' ? 'js' : selectedLanguage}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareCode = () => {
    navigator.clipboard.writeText(code);
    // In a real app, this would generate a shareable link
  };

  const resetCode = () => {
    setCode('// Start coding here...\n\n');
    setOutput('');
  };

  const currentExamples = codeExamples[selectedLanguage as keyof typeof codeExamples] || [];

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
              <Environment preset="studio" />
              
              <Float speed={2} rotationIntensity={0.5} floatIntensity={0.3}>
                <mesh position={[3, 1, -2]}>
                  <boxGeometry args={[0.8, 0.8, 0.8]} />
                  <meshStandardMaterial color="#10b981" emissive="#047857" emissiveIntensity={0.3} />
                </mesh>
              </Float>
              
              <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
                <mesh position={[-3, -1, -1]}>
                  <sphereGeometry args={[0.6, 32, 32]} />
                  <meshStandardMaterial color="#8b5cf6" emissive="#6d28d9" emissiveIntensity={0.3} />
                </mesh>
              </Float>
              
              <Float speed={1} rotationIntensity={0.2} floatIntensity={0.4}>
                <Text
                  position={[0, 0, 0]}
                  fontSize={0.8}
                  color="#ffffff"
                  anchorX="center"
                  anchorY="middle"
                >
                  PLAYGROUND
                </Text>
              </Float>
              
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
            </Canvas>
          </div>

          <div className="relative z-10 h-full flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-2">3D Code Playground</h1>
              <p className="text-gray-300 text-sm md:text-base">Practice coding in an immersive, interactive environment</p>
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span>Real-time execution</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Code className="h-4 w-4 text-blue-400" />
                  <span>Multi-language support</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={shareCode}
                className="flex items-center px-3 py-2 glass rounded-lg text-white hover:bg-white/20 transition-all duration-300"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
              <button
                onClick={saveCode}
                className="flex items-center px-3 py-2 glass rounded-lg text-white hover:bg-white/20 transition-all duration-300"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </button>
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Code
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Language Selector */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Code className="h-5 w-5 mr-2 text-blue-400" />
            Select Programming Language
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {languages.map((lang) => (
              <motion.button
                key={lang.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`p-4 rounded-xl transition-all duration-300 ${
                  selectedLanguage === lang.id
                    ? `bg-gradient-to-r ${lang.color} text-white shadow-lg`
                    : 'glass text-gray-300 hover:bg-white/10'
                }`}
              >
                <div className="text-2xl mb-2">{lang.icon}</div>
                <div className="text-sm font-medium">{lang.name}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Code Editor and Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Code className="h-5 w-5 mr-2 text-green-400" />
                Code Editor
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400 capitalize">{selectedLanguage}</span>
                <button
                  onClick={resetCode}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(code)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <Settings className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-96 p-4 bg-gray-900/50 text-gray-100 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder={`Write your ${selectedLanguage} code here...`}
                spellCheck={false}
              />
              <div className="absolute top-2 right-2 text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">
                Lines: {code.split('\n').length} | Chars: {code.length}
              </div>
            </div>
          </motion.div>

          {/* Output Console */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Terminal className="h-5 w-5 mr-2 text-orange-400" />
                Output Console
              </h3>
              <button
                onClick={() => setOutput('')}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="p-4">
              <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap h-80 overflow-y-auto bg-gray-900/30 p-3 rounded-lg border border-gray-700">
                {output || `🚀 Click "Run Code" to see output here...

💡 Tips:
- Use console.log() to print values
- Try different ${selectedLanguage} features
- Experiment with the examples below`}
              </pre>
            </div>
          </motion.div>
        </div>

        {/* Code Examples */}
        <AnimatePresence>
          {currentExamples.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-400" />
                {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)} Examples
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentExamples.map((example, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                    onClick={() => setCode(example.code)}
                  >
                    <h4 className="font-medium text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {example.title}
                    </h4>
                    <p className="text-sm text-gray-400 mb-3">{example.description}</p>
                    <div className="bg-gray-900/50 p-2 rounded text-xs text-green-400 font-mono overflow-hidden">
                      <div className="line-clamp-3">
                        {example.code}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to load in editor
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Learning Resources */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-purple-400" />
            Learning Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Documentation', description: 'Official language docs', icon: '📚', color: 'from-blue-500 to-cyan-500' },
              { title: 'Tutorials', description: 'Step-by-step guides', icon: '🎓', color: 'from-purple-500 to-pink-500' },
              { title: 'Best Practices', description: 'Industry standards', icon: '⭐', color: 'from-green-500 to-emerald-500' },
              { title: 'Community', description: 'Join discussions', icon: '👥', color: 'from-orange-500 to-red-500' }
            ].map((resource, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className={`p-4 bg-gradient-to-r ${resource.color} bg-opacity-10 rounded-xl cursor-pointer group`}
              >
                <div className="text-2xl mb-2">{resource.icon}</div>
                <h4 className="font-medium text-white mb-1 group-hover:text-blue-400 transition-colors">
                  {resource.title}
                </h4>
                <p className="text-sm text-gray-400">{resource.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;