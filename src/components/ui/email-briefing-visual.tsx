"use client"

import { motion } from "framer-motion";
import { Mail, Search, CheckCircle, TrendingUp, MapPin, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface EmailBriefingVisualProps {
  className?: string;
}

export const EmailBriefingVisual: React.FC<EmailBriefingVisualProps> = ({ className = "" }) => {
  const isMobile = useIsMobile();
  const tabs = ["LinkedIn", "Timeline", "Contact"];
  const activeTab = "Contact";

  const [animatedStats, setAnimatedStats] = useState({
    sent: 0,
    opened: 0,
    clicked: 0,
    replied: 0
  });

  const finalStats = {
    sent: 2543,
    opened: 1847,
    clicked: 892,
    replied: 324
  };

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedStats({
        sent: Math.floor(finalStats.sent * progress),
        opened: Math.floor(finalStats.opened * progress),
        clicked: Math.floor(finalStats.clicked * progress),
        replied: Math.floor(finalStats.replied * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(finalStats);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: "Sent", value: animatedStats.sent.toLocaleString(), icon: Mail },
    { label: "Opened", value: animatedStats.opened.toLocaleString(), icon: CheckCircle },
    { label: "Clicked", value: animatedStats.clicked.toLocaleString(), icon: TrendingUp },
    { label: "Replied", value: animatedStats.replied.toLocaleString(), icon: Mail }
  ];

  return (
    <div className={`h-auto min-h-[300px] md:h-[500px] w-full max-w-[900px] mx-auto bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b-2 border-white/10 px-4 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mail className="size-8 text-foreground/75" strokeWidth={1} aria-hidden />
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">E-mail briefing</h3>
        </div>
        <Search className="size-6 text-foreground/75" strokeWidth={1} aria-hidden />
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/5 backdrop-blur-sm border-b-2 border-white/10 px-4 md:px-8 py-2 flex gap-4 md:gap-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`text-sm font-medium pb-2 transition-all ${
              tab === activeTab 
                ? 'text-gray-900 border-b-2 border-gray-900' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 md:p-8 space-y-4">
        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-xl p-4 hover:bg-white/10 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-start gap-3">
            {/* Avatar with SiriOrb gradient */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
              className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-display text-sm md:text-base flex-shrink-0 shadow-md"
            >
              JD
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-semibold text-gray-900">John Doe</h4>
                <CheckCircle className="size-4 text-foreground/75 flex-shrink-0" strokeWidth={1} aria-hidden />
              </div>
              <p className="text-xs text-gray-600 mb-1">john.doe@company.com</p>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Phone className="size-3 text-foreground/75" strokeWidth={1} aria-hidden />
                  <span>+46 70 123 4567</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="size-3 text-foreground/75" strokeWidth={1} aria-hidden />
                  <span>Stockholm</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Campaign Metrics Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-xl p-4 hover:bg-white/10 hover:shadow-md transition-all duration-300"
        >
          <h5 className="text-sm font-semibold text-gray-900 mb-3">Campaign Performance</h5>
          
          {/* Stats Grid with subtle background */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-lg p-3">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
                  className="text-center"
                >
                  <Icon className="size-5 text-foreground/75 mx-auto mb-1" strokeWidth={1} aria-hidden />
                  <motion.p
                    className="text-base md:text-lg font-mono font-bold text-gray-900 mb-0.5"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-xs md:text-sm text-gray-600 uppercase tracking-wide">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Engagement Progress Bar with percentage on bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-700 font-medium">Engagement Rate</span>
              <span className="text-xs font-mono font-bold text-gray-900">72%</span>
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 rounded-full shadow-sm"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 0.72 }}
                transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
