"use client";

import { motion } from "framer-motion";
import { CheckSquare, Calendar, Info } from "lucide-react";
interface ProjectManagementVisualProps {
  className?: string;
}
export const ProjectManagementVisual: React.FC<ProjectManagementVisualProps> = ({
  className = ""
}) => {
  const dates = ["Dec 22", "Dec 25", "Dec 27", "Dec 30"];
  const resources = [{
    label: "Development",
    percentage: 65,
    color: "indigo"
  }, {
    label: "Planning",
    percentage: 40,
    color: "blue"
  }, {
    label: "Testing",
    percentage: 75,
    color: "purple"
  }];
  return <div className={`h-[500px] w-full max-w-[900px] mx-auto bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-lg p-8 ${className}`}>
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{
        opacity: 0,
        y: -10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }}>
          
          <div className="relative">
            
          </div>
        </motion.div>

        {/* Ongoing Project Card */}
        

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
      }} className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-base font-semibold text-gray-900">Schedule</h4>
            <Calendar className="size-8 md:size-10 text-foreground/75" strokeWidth={1} aria-hidden />
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Dates */}
            <div className="flex justify-between mb-4">
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
              <motion.div className="absolute h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 rounded-full" initial={{
              width: "0%"
            }} animate={{
              width: "75%"
            }} transition={{
              duration: 2,
              delay: 0.7,
              ease: "easeOut"
            }} />
              
              {/* Dots */}
              {dates.map((_, idx) => <motion.div key={idx} className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-white rounded-full shadow-md" style={{
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
      }} className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl p-6">
          <h4 className="text-base font-semibold text-gray-900 mb-5">Resource load</h4>
          
          <div className="space-y-5">
            {resources.map((resource, idx) => <div key={resource.label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-700 font-medium">{resource.label}</span>
                  <span className="text-sm font-mono font-bold text-gray-900">{resource.percentage}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600" initial={{
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