"use client"

import { motion } from "framer-motion";
import { Mail, Search, CheckCircle, TrendingUp, MapPin, Phone } from "lucide-react";
import { useState, useEffect } from "react";

interface EmailBriefingVisualProps {
  className?: string;
}

export const EmailBriefingVisual: React.FC<EmailBriefingVisualProps> = ({ className = "" }) => {
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
    <div className={`h-[500px] w-full max-w-[900px] mx-auto bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mail className="size-8 md:size-10 text-foreground/75" strokeWidth={1} aria-hidden />
          <h3 className="text-xl font-display font-normal text-gray-900">E-mail briefing</h3>
        </div>
        <Search className="size-8 text-foreground/75" strokeWidth={1} aria-hidden />
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200 px-8 py-3 flex gap-6">
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
      <div className="p-10 space-y-8">
        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl p-6 hover:bg-white/95 hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-start gap-4">
            {/* Avatar with SiriOrb gradient */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-display text-xl flex-shrink-0 shadow-md"
            >
              JD
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-base font-semibold text-gray-900">John Doe</h4>
                <CheckCircle className="size-5 text-foreground/75 flex-shrink-0" strokeWidth={1} aria-hidden />
              </div>
              <p className="text-sm text-gray-600 mb-1">john.doe@company.com</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Phone className="size-4 text-foreground/75" strokeWidth={1} aria-hidden />
                  <span>+46 70 123 4567</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-foreground/75" strokeWidth={1} aria-hidden />
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
          className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl p-6 hover:bg-white/95 hover:shadow-md transition-all duration-300"
        >
          <h5 className="text-base font-semibold text-gray-900 mb-6">Campaign Performance</h5>
          
          {/* Stats Grid with subtle background */}
          <div className="grid grid-cols-2 gap-4 mb-6 bg-white/60 backdrop-blur-sm border border-gray-100 rounded-lg p-4">
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
                  <Icon className="size-6 text-foreground/75 mx-auto mb-2" strokeWidth={1} aria-hidden />
                  <motion.p
                    className="text-2xl font-mono font-bold text-gray-900 mb-1"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Engagement Progress Bar with percentage on bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700 font-medium">Engagement Rate</span>
              <span className="text-sm font-mono font-bold text-gray-900">72%</span>
            </div>
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 rounded-full shadow-sm relative"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 0.72 }}
                transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                style={{ transformOrigin: "left" }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2 }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-white"
                >
                  72%
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
