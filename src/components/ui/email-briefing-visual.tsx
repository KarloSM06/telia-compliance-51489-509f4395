"use client"

import { motion } from "framer-motion";
import { Mail, Search, CheckCircle } from "lucide-react";

interface EmailBriefingVisualProps {
  className?: string;
}

export const EmailBriefingVisual: React.FC<EmailBriefingVisualProps> = ({ className = "" }) => {
  const tabs = ["LinkedIn", "Timeline", "Contact"];
  const activeTab = "Contact";

  const stats = [
    { label: "Sent", value: "1,234" },
    { label: "Opened", value: "892" },
    { label: "Clicked", value: "456" },
    { label: "Replied", value: "123" }
  ];

  return (
    <div className={`h-[500px] w-full max-w-[900px] mx-auto bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-indigo-600" />
          <h3 className="text-xl font-display font-normal text-gray-900">E-mail briefing</h3>
        </div>
        <Search className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-200 px-8 py-3 flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`text-sm font-medium pb-2 transition-all ${
              tab === activeTab 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl p-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                JD
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-lg font-semibold text-gray-900">Jack Daniels</h4>
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Contact</p>
                <p className="text-sm text-gray-500">Email: jack@techcorp.com</p>
                <p className="text-sm text-gray-500">Company: Tech Corp</p>
              </div>
            </div>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
              +More info
            </button>
          </div>
        </motion.div>

        {/* Campaign Metrics Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl p-6"
        >
          <h5 className="text-base font-semibold text-gray-900 mb-4">Campaign: Q1 Outreach</h5>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
                className="text-center"
              >
                <p className="text-2xl font-mono font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Engagement Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700 font-medium">Engagement Rate</span>
              <span className="text-sm font-mono font-bold text-indigo-600">72%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-full"
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
