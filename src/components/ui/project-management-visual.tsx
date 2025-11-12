"use client";

import { motion } from "framer-motion";
import { CheckSquare, Calendar, Info, Check } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
interface ProjectManagementVisualProps {
  className?: string;
}
export const ProjectManagementVisual: React.FC<ProjectManagementVisualProps> = ({
  className = ""
}) => {
  const isMobile = useIsMobile();
  const dates = ["Dec 22", "Dec 25", "Dec 27", "Dec 30"];
  const resources = [{
    label: "Development",
    percentage: 65
  }, {
    label: "Planning",
    percentage: 40
  }, {
    label: "Testing",
    percentage: 75
  }];
  return <div className={`h-auto min-h-[300px] md:h-[500px] w-full max-w-[900px] mx-auto bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-2xl shadow-lg p-6 md:p-8 ${className}`}>
      <div className="space-y-4">
        {/* New Details Header */}
        <motion.div initial={{
        opacity: 0,
        y: -10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }}>
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">New Details</h3>
        </motion.div>

        {/* Project Name Input */}
        

        {/* Ongoing Project Card */}
        <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.2
      }} className="bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-xl p-4 hover:bg-white/10 hover:shadow-md transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {/* Gradient Checkmark */}
              <motion.div initial={{
              scale: 0
            }} animate={{
              scale: 1
            }} transition={{
              duration: 0.3,
              delay: 0.4,
              type: "spring"
            }} className="w-5 h-5 bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </motion.div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Ongoing project</h4>
                <p className="text-xs text-gray-600 leading-tight">
                  Track progress and milestones in real-time
                </p>
              </div>
            </div>
            
            <Info className="size-4 text-foreground/75 flex-shrink-0" strokeWidth={1} aria-hidden />
          </div>
        </motion.div>

        {/* Schedule Timeline */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.3
      }} className="bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-xl p-4 hover:bg-white/10 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-900">Schedule</h4>
            <Calendar className="size-8 text-foreground/75" strokeWidth={1} aria-hidden />
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Dates */}
            <div className="flex justify-between mb-3">
              {dates.map((date, idx) => <motion.span key={date} initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              duration: 0.3,
              delay: 0.5 + idx * 0.1
            }} className="text-xs text-gray-600 font-medium">
                  {date}
                </motion.span>)}
            </div>

            {/* Timeline Line */}
            <div className="relative h-1 bg-gray-200 rounded-full">
              <motion.div className="absolute h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 rounded-full shadow-md" initial={{
              width: "0%"
            }} animate={{
              width: "75%"
            }} transition={{
              duration: 2,
              delay: 0.7,
              ease: "easeOut"
            }} />
              
              {/* Dots */}
              {dates.map((_, idx) => <motion.div key={idx} className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 md:w-3 md:h-3 bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-white rounded-full shadow-md" style={{
              left: `${idx / (dates.length - 1) * 100}%`,
              transform: 'translate(-50%, -50%)'
            }} initial={{
              scale: 0
            }} animate={{
              scale: 1
            }} transition={{
              duration: 0.3,
              delay: 0.8 + idx * 0.15,
              type: "spring"
            }} />)}
            </div>
          </div>
        </motion.div>

        {/* Resource Load */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.4
      }} className="bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-xl p-4 hover:bg-white/10 hover:shadow-md transition-all duration-300">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Resource load</h4>
          
          <div className="space-y-3">
            {resources.map((resource, idx) => <div key={resource.label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-gray-700 font-medium">{resource.label}</span>
                  <span className="text-xs font-mono font-bold text-gray-900">{resource.percentage}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 shadow-sm" initial={{
                scaleX: 0
              }} animate={{
                scaleX: resource.percentage / 100
              }} transition={{
                duration: 1.5,
                delay: 1 + idx * 0.3,
                ease: "easeOut"
              }} style={{
                transformOrigin: "left"
              }} />
                </div>
              </div>)}
          </div>
        </motion.div>
      </div>
    </div>;
};