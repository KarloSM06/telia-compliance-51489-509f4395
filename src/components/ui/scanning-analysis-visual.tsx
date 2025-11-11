import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface WorkflowNode {
  id: number;
  x: number; // percentage
  y: number; // percentage
  size: number; // 8, 10, or 12 (for w-8 = 32px, w-10 = 40px, w-12 = 48px)
  status: "inefficient" | "partial" | "optimized";
}

const workflowNodes: WorkflowNode[] = [
  { id: 1, x: 15, y: 20, size: 10, status: "inefficient" },
  { id: 2, x: 35, y: 15, size: 8, status: "inefficient" },
  { id: 3, x: 25, y: 45, size: 12, status: "inefficient" },
  { id: 4, x: 50, y: 30, size: 10, status: "partial" },
  { id: 5, x: 45, y: 65, size: 8, status: "partial" },
  { id: 6, x: 65, y: 20, size: 10, status: "optimized" },
  { id: 7, x: 75, y: 50, size: 12, status: "optimized" },
  { id: 8, x: 85, y: 35, size: 8, status: "optimized" },
  { id: 9, x: 70, y: 75, size: 10, status: "partial" },
];

const nodeConnections = [
  [1, 2], [1, 4], [2, 4], [3, 4], [3, 5],
  [4, 6], [4, 7], [5, 9], [6, 7], [7, 8], [7, 9]
];

const getNodeStyle = (status: WorkflowNode["status"]) => {
  switch (status) {
    case "inefficient":
      return "bg-red-400/20 border-red-500";
    case "partial":
      return "bg-yellow-400/20 border-yellow-500";
    case "optimized":
      return "bg-green-400/20 border-green-500";
  }
};

const getNodeOpacity = (status: WorkflowNode["status"]) => {
  switch (status) {
    case "inefficient":
      return "opacity-60";
    case "partial":
      return "opacity-50";
    case "optimized":
      return "opacity-40";
  }
};

export const ScanningAnalysisVisual = () => {
  const [scannedNodes, setScannedNodes] = useState<number[]>([]);
  const [beamPosition, setBeamPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBeamPosition((prev) => {
        const newPos = (prev + 0.5) % 120; // Loop from -20 to 120
        
        // Check which nodes are being scanned (beam is at their x position ±5%)
        const currentlyScanned = workflowNodes
          .filter(node => Math.abs(node.x - (newPos - 20)) < 8)
          .map(node => node.id);
        
        if (currentlyScanned.length > 0) {
          setScannedNodes(currentlyScanned);
          setTimeout(() => setScannedNodes([]), 800);
        }
        
        return newPos;
      });
    }, 30); // Update every 30ms for smooth animation

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[280px] w-full bg-white/40 backdrop-blur-sm border border-gray-200 rounded-xl overflow-hidden">
      {/* SVG Connecting Lines */}
      <svg className="absolute inset-0 w-full h-full z-0" style={{ pointerEvents: 'none' }}>
        {nodeConnections.map(([from, to], idx) => {
          const fromNode = workflowNodes.find(n => n.id === from);
          const toNode = workflowNodes.find(n => n.id === to);
          if (!fromNode || !toNode) return null;
          
          return (
            <line
              key={idx}
              x1={`${fromNode.x}%`}
              y1={`${fromNode.y}%`}
              x2={`${toNode.x}%`}
              y2={`${toNode.y}%`}
              stroke="rgb(209, 213, 219)"
              strokeWidth="1"
              strokeOpacity="0.3"
              strokeDasharray="4 4"
            />
          );
        })}
      </svg>

      {/* Workflow Nodes */}
      {workflowNodes.map((node, index) => {
        const isScanned = scannedNodes.includes(node.id);
        const sizeClass = node.size === 8 ? 'w-8 h-8' : node.size === 10 ? 'w-10 h-10' : 'w-12 h-12';
        
        return (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: isScanned ? 1.1 : 1,
            }}
            transition={{ 
              delay: index * 0.1,
              scale: { duration: 0.3 }
            }}
            className={`absolute ${sizeClass} rounded-full border-2 ${getNodeStyle(node.status)} ${getNodeOpacity(node.status)} z-10 transition-all duration-300`}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(-50%, -50%)',
              boxShadow: isScanned ? '0 0 20px rgba(59, 130, 246, 0.5)' : 'none'
            }}
          >
            {/* Warning Ring for Inefficient Nodes */}
            {node.status === "inefficient" && isScanned && (
              <motion.div
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 1.8] }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 rounded-full border-2 border-red-400"
              />
            )}
          </motion.div>
        );
      })}

      {/* Scanning Beam */}
      <motion.div
        className="absolute top-0 bottom-0 w-[100px] z-20 pointer-events-none"
        style={{
          left: `${beamPosition - 20}%`,
          background: 'linear-gradient(to right, transparent, rgba(59, 130, 246, 0.4), transparent)',
          boxShadow: '0 0 40px rgba(59, 130, 246, 0.3)',
        }}
      />

      {/* AI Analysis Indicator */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-purple-500/30 border-2 border-purple-500 z-30"
        style={{
          boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
        }}
      />
    </div>
  );
};
