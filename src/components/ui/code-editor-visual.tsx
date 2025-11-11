import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Search, Settings } from "lucide-react";

export const CodeEditorVisual = () => {
  const [displayedCode, setDisplayedCode] = useState<string[]>([]);
  const [cursorLine, setCursorLine] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  const codeLines = [
    'def analyze_workflow(data):',
    '    """Analyze and optimize business workflows"""',
    '    metrics = calculate_efficiency(data)',
    '    if metrics.manual_tasks > threshold:',
    '        automation = build_ai_solution(metrics)',
    '        return automation.deploy()',
    '    else:',
    '        return optimize_existing(metrics)',
    '',
    '# AI-driven automation engine',
    'result = analyze_workflow(business_data)',
    'deploy_smart_automation(result)',
  ];

  // Typewriter effect
  useEffect(() => {
    if (displayedCode.length < codeLines.length) {
      const timer = setTimeout(() => {
        setDisplayedCode([...displayedCode, codeLines[displayedCode.length]]);
        setCursorLine(displayedCode.length);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [displayedCode, codeLines]);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const highlightSyntax = (line: string) => {
    const keywords = ['def', 'if', 'else', 'return'];
    const strings = /(".*?"|'.*?')/g;
    const functions = /\b([a-z_]+)\(/g;
    const comments = /(#.*$)/;

    let highlighted = line;

    // Strings
    highlighted = highlighted.replace(strings, '<span class="text-emerald-600">$1</span>');
    
    // Keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="text-indigo-700 font-bold">${keyword}</span>`);
    });

    // Functions
    highlighted = highlighted.replace(functions, '<span class="text-blue-700">$1</span>(');

    // Comments
    highlighted = highlighted.replace(comments, '<span class="text-gray-500 italic">$1</span>');

    return highlighted;
  };

  return (
    <div className="relative h-full w-full flex bg-white/60 backdrop-blur-md border border-gray-300 rounded-xl overflow-hidden shadow-lg">
      {/* Sidebar - HIDDEN ON MOBILE */}
      <div className="hidden sm:flex w-8 md:w-10 lg:w-12 bg-white/20 border-r border-gray-200 flex-col items-center gap-4 py-4">
        <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer">
          <FileText className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer">
          <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer">
          <Settings className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
        </motion.div>
      </div>

      {/* Main editor area */}
      <div className="flex-1 flex flex-col">
        {/* Editor header */}
        <div className="flex items-center justify-between px-2 py-1.5 md:px-4 md:py-2 bg-white/30 border-b border-gray-200">
          {/* Window controls */}
          <div className="flex gap-1.5 md:gap-2">
            <motion.div whileHover={{ scale: 1.2 }} className="w-2 h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 rounded-full bg-red-400" />
            <motion.div whileHover={{ scale: 1.2 }} className="w-2 h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 rounded-full bg-yellow-400" />
            <motion.div whileHover={{ scale: 1.2 }} className="w-2 h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 rounded-full bg-green-400" />
          </div>

          {/* Filename */}
          <span className="text-xs md:text-sm font-medium text-gray-700">ai_system.py</span>

          {/* Line info - HIDDEN ON SMALL MOBILE */}
          <span className="hidden xs:inline text-xs text-gray-500">Line {cursorLine + 1}</span>
          <div className="xs:hidden w-2" /> {/* Spacer for mobile */}
        </div>

        {/* Code area - RESPONSIVE TEXT & SCROLL */}
        <div className="flex-1 p-1 md:p-2 lg:p-4 font-mono text-[13px] md:text-sm overflow-x-auto overflow-y-auto leading-normal">
          <div className="space-y-0.5">
            {displayedCode.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex gap-2 md:gap-3 whitespace-nowrap"
              >
                {/* Line number - HIDDEN ON VERY SMALL SCREENS */}
                <span className="hidden xs:inline text-gray-400 select-none w-6 text-right">{index + 1}</span>
                <span 
                  className="flex-1"
                  dangerouslySetInnerHTML={{ __html: highlightSyntax(line) }}
                />
                {index === cursorLine && cursorVisible && displayedCode.length === codeLines.length && (
                  <span className="inline-block w-2 h-3.5 bg-indigo-600" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-2 py-1 md:px-4 md:py-1.5 bg-white/30 border-t border-gray-200 text-xs text-gray-600">
          <span className="hidden sm:inline">Python 3.11</span>
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-green-500"
              animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="font-medium text-xs">AI Engine Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorVisual;
