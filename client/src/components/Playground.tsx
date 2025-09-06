import React, { useState } from 'react';
import { Play, Code, Terminal, Save, Download, Settings } from 'lucide-react';

const Playground: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState(`// Welcome to the Code Playground!
// Try writing some JavaScript code here

function greetUser(name) {
  return \`Hello, \${name}! Welcome to FutureCorp's Learning Platform!\`;
}

console.log(greetUser("Student"));

// Try some array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled numbers:", doubled);`);

  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: '🟨' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'html', name: 'HTML', icon: '🌐' },
    { id: 'css', name: 'CSS', icon: '🎨' },
  ];

  const runCode = () => {
    setIsRunning(true);
    setOutput('Running code...\n');
    
    // Simulate code execution
    setTimeout(() => {
      if (selectedLanguage === 'javascript') {
        try {
          // Create a safe execution context
          const logs: string[] = [];
          const mockConsole = {
            log: (...args: any[]) => {
              logs.push(args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
              ).join(' '));
            }
          };
          
          // Simple evaluation for demo purposes
          const func = new Function('console', code);
          func(mockConsole);
          
          setOutput(logs.join('\n') || 'Code executed successfully!');
        } catch (error) {
          setOutput(`Error: ${error}`);
        }
      } else {
        setOutput(`${selectedLanguage} code execution simulated!\nYour code would run here in a real environment.`);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white gradient-text">Code Playground</h1>
          <p className="text-gray-300">Practice coding in a safe, interactive environment.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={saveCode}
            className="inline-flex items-center px-4 py-2 glass rounded-lg text-white hover:bg-white/20 transition-all duration-300"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </button>
          <button
            onClick={runCode}
            disabled={isRunning}
            className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50"
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

      {/* Language Selector */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Code className="h-5 w-5 mr-2 text-blue-400" />
          Select Language
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id)}
              className={`p-3 rounded-xl transition-all duration-300 ${
                selectedLanguage === lang.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'glass text-gray-300 hover:bg-white/10'
              }`}
            >
              <div className="text-2xl mb-1">{lang.icon}</div>
              <div className="text-sm font-medium">{lang.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Code Editor and Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Code className="h-5 w-5 mr-2 text-green-400" />
              Code Editor
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400 capitalize">{selectedLanguage}</span>
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
            <div className="absolute top-2 right-2 text-xs text-gray-500">
              Lines: {code.split('\n').length}
            </div>
          </div>
        </div>

        {/* Output Console */}
        <div className="glass rounded-2xl overflow-hidden">
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
            <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap h-80 overflow-y-auto bg-gray-900/30 p-3 rounded-lg">
              {output || 'Click "Run Code" to see output here...'}
            </pre>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Hello World',
              code: 'console.log("Hello, World!");',
              description: 'Basic output example'
            },
            {
              title: 'Array Methods',
              code: 'const arr = [1,2,3];\nconsole.log(arr.map(x => x * 2));',
              description: 'Working with arrays'
            },
            {
              title: 'Functions',
              code: 'function add(a, b) {\n  return a + b;\n}\nconsole.log(add(5, 3));',
              description: 'Function declaration'
            }
          ].map((example, index) => (
            <div
              key={index}
              className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer"
              onClick={() => setCode(example.code)}
            >
              <h4 className="font-medium text-white mb-2">{example.title}</h4>
              <p className="text-sm text-gray-400 mb-3">{example.description}</p>
              <code className="text-xs text-green-400 font-mono block bg-gray-900/50 p-2 rounded">
                {example.code.split('\n')[0]}...
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Playground;