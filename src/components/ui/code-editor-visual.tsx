import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const CodeEditorVisual = () => {
  const [showCursor, setShowCursor] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[280px] w-full bg-white/60 backdrop-blur-md border border-gray-200 rounded-xl overflow-hidden shadow-lg">
      {/* Editor Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-white/40">
        {/* Window controls */}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
          <div className="w-3 h-3 rounded-full bg-green-400/60" />
        </div>
        
        {/* Filename */}
        <span className="ml-2 text-xs font-mono text-gray-600">ai_system.py</span>
      </div>

      {/* Code Area */}
      <div className="p-4 font-mono text-sm leading-relaxed">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Line 1 */}
          <div className="flex">
            <span className="text-gray-400 select-none mr-4">1</span>
            <span className="text-indigo-600 font-semibold">def</span>
            <span className="text-gray-900 ml-1">analyze_workflow</span>
            <span className="text-gray-600">(</span>
            <span className="text-gray-900">data</span>
            <span className="text-gray-600">):</span>
          </div>

          {/* Line 2 */}
          <div className="flex mt-1">
            <span className="text-gray-400 select-none mr-4">2</span>
            <span className="ml-6 text-indigo-600 font-semibold">if</span>
            <span className="text-gray-900 ml-1">data.status</span>
            <span className="text-gray-600 ml-1">==</span>
            <span className="text-green-600 ml-1">"inefficient"</span>
            <span className="text-gray-600">:</span>
          </div>

          {/* Line 3 */}
          <div className="flex mt-1">
            <span className="text-gray-400 select-none mr-4">3</span>
            <span className="ml-12 text-indigo-600 font-semibold">return</span>
            <span className="text-blue-600 ml-1">optimize_process</span>
            <span className="text-gray-600">()</span>
          </div>

          {/* Line 4 */}
          <div className="flex mt-1">
            <span className="text-gray-400 select-none mr-4">4</span>
            <span className="ml-6 text-indigo-600 font-semibold">else</span>
            <span className="text-gray-600">:</span>
          </div>

          {/* Line 5 */}
          <div className="flex mt-1">
            <span className="text-gray-400 select-none mr-4">5</span>
            <span className="ml-12 text-indigo-600 font-semibold">return</span>
            <span className="text-green-600 ml-1">"No action needed"</span>
          </div>

          {/* Line 6 - empty */}
          <div className="flex mt-1">
            <span className="text-gray-400 select-none mr-4">6</span>
          </div>

          {/* Line 7 */}
          <div className="flex mt-1">
            <span className="text-gray-400 select-none mr-4">7</span>
            <span className="text-gray-400 italic"># AI-driven automation</span>
          </div>

          {/* Line 8 with blinking cursor */}
          <div className="flex mt-1">
            <span className="text-gray-400 select-none mr-4">8</span>
            <span className="text-blue-600">run_automation</span>
            <span className="text-gray-600">(</span>
            <span className="text-gray-900">workflow_data</span>
            <span className="text-gray-600">)</span>
            {showCursor && (
              <motion.span
                className="inline-block w-[2px] h-4 bg-indigo-600 ml-0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom status bar */}
      <div className="absolute bottom-0 left-0 right-0 px-4 py-2 border-t border-gray-200 bg-white/40 flex items-center justify-between">
        <span className="text-xs text-gray-500 font-mono">Python 3.11</span>
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 bg-green-500 rounded-full"
            animate={{
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
          <span className="text-xs text-gray-500">AI Engine Active</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorVisual;
