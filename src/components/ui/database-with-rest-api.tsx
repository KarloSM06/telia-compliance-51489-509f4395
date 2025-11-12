"use client";

import React from "react";
import { motion } from "framer-motion";
import { Folder, HeartHandshakeIcon, SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
interface DatabaseWithRestApiProps {
  className?: string;
  circleText?: string;
  badgeTexts?: {
    first: string;
    second: string;
    third: string;
    fourth: string;
  };
  badgeIcons?: {
    first: any;
    second: any;
    third: any;
    fourth: any;
  };
  buttonTexts?: {
    first: string;
    second: string;
  };
  title?: string;
  lightColor?: string;
}
const DatabaseWithRestApi = ({
  className,
  circleText,
  badgeTexts,
  badgeIcons,
  buttonTexts,
  title,
  lightColor
}: DatabaseWithRestApiProps) => {
  const isMobile = useIsMobile();
  const Icon1 = badgeIcons?.first;
  const Icon2 = badgeIcons?.second;
  const Icon3 = badgeIcons?.third;
  const Icon4 = badgeIcons?.fourth;
  return <div className={cn("relative flex h-auto min-h-[300px] md:h-[500px] w-full max-w-[900px] flex-col items-center px-4 md:px-0", className)}>
      {/* SVG Paths  */}
      
      {/* Main Box */}
      <div className="absolute bottom-10 flex w-full flex-col items-center">
        {/* bottom shadow */}
        <div className="absolute -bottom-4 h-[100px] w-[62%] rounded-lg bg-accent/30" />
        {/* box title */}
        <div className="absolute -top-3 z-20 flex items-center justify-center rounded-lg border border-primary/20 bg-primary/10 backdrop-blur px-3 py-2 sm:-top-4 sm:py-2.5">
          <SparklesIcon className="size-4 text-primary" />
          <span className="ml-2 text-xs font-semibold text-foreground">
            {title ? title : "Data exchange using a customized REST API"}
          </span>
        </div>
        {/* box outter circle */}
        <div className="absolute -bottom-8 z-30 grid h-[70px] w-[70px] place-items-center rounded-full border-2 border-primary/40 bg-primary/20 backdrop-blur font-bold text-xs md:text-sm text-foreground">
          {circleText ? circleText : "API"}
        </div>
        {/* box content */}
        <div className="relative z-10 flex h-[200px] w-full items-center justify-center overflow-hidden rounded-lg border border-primary/20 bg-card/50 backdrop-blur shadow-glow">
          {/* Badges */}
          <div className="absolute bottom-8 left-12 z-10 h-8 rounded-full bg-primary/20 backdrop-blur px-4 text-sm border border-primary/30 flex items-center gap-2">
            <HeartHandshakeIcon className="size-5 text-primary" />
            <span className="font-semibold text-foreground">{buttonTexts?.first || "Hiems"}</span>
          </div>
          <div className="absolute right-16 z-10 hidden h-8 rounded-full bg-primary/20 backdrop-blur px-4 text-sm sm:flex border border-primary/30 items-center gap-2">
            <Folder className="size-5 text-primary" />
            <span className="font-semibold text-foreground">{buttonTexts?.second || "Dashboard"}</span>
          </div>
          {/* Circles */}
          <motion.div className="absolute -bottom-14 h-[130px] w-[130px] rounded-full border-t border-primary/20 bg-primary/5" animate={{
          scale: [0.98, 1.02, 0.98, 1, 1, 1, 1, 1, 1]
        }} transition={{
          duration: 2,
          repeat: Infinity
        }} />
          <motion.div className="absolute -bottom-20 h-[185px] w-[185px] rounded-full border-t border-primary/20 bg-primary/5" animate={{
          scale: [1, 1, 1, 0.98, 1.02, 0.98, 1, 1, 1]
        }} transition={{
          duration: 2,
          repeat: Infinity
        }} />
          <motion.div className="absolute -bottom-[100px] h-[240px] w-[240px] rounded-full border-t border-primary/20 bg-primary/5" animate={{
          scale: [1, 1, 1, 1, 1, 0.98, 1.02, 0.98, 1, 1]
        }} transition={{
          duration: 2,
          repeat: Infinity
        }} />
          <motion.div className="absolute -bottom-[130px] h-[300px] w-[300px] rounded-full border-t border-primary/20 bg-primary/5" animate={{
          scale: [1, 1, 1, 1, 1, 1, 0.98, 1.02, 0.98, 1]
        }} transition={{
          duration: 2,
          repeat: Infinity
        }} />
        </div>
      </div>
    </div>;
};
export default DatabaseWithRestApi;
const DatabaseIcon = ({
  x = "0",
  y = "0"
}: {
  x: string;
  y: string;
}) => {
  return <svg x={x} y={y} xmlns="http://www.w3.org/2000/svg" width="5" height="5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>;
};