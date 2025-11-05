"use client";

import React from "react";
import { motion } from "framer-motion";
import { Folder, HeartHandshakeIcon, SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
  lightColor,
}: DatabaseWithRestApiProps) => {
  const Icon1 = badgeIcons?.first;
  const Icon2 = badgeIcons?.second;
  const Icon3 = badgeIcons?.third;
  const Icon4 = badgeIcons?.fourth;
  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full max-w-[900px] flex-col items-center",
        className
      )}
    >
      {/* SVG Paths  */}
      <svg
        className="h-full sm:w-full text-primary/40"
        width="100%"
        height="100%"
        viewBox="0 0 200 100"
      >
        <g
          stroke="currentColor"
          fill="none"
          strokeWidth="0.4"
          strokeDasharray="100 100"
          pathLength="100"
        >
          <path d="M 31 10 v 15 q 0 5 5 5 h 59 q 5 0 5 5 v 10" />
          <path d="M 77 10 v 10 q 0 5 5 5 h 13 q 5 0 5 5 v 10" />
          <path d="M 124 10 v 10 q 0 5 -5 5 h -14 q -5 0 -5 5 v 10" />
          <path d="M 170 10 v 15 q 0 5 -5 5 h -60 q -5 0 -5 5 v 10" />
          {/* Animation For Path Starting */}
          <animate
            attributeName="stroke-dashoffset"
            from="100"
            to="0"
            dur="1s"
            fill="freeze"
            calcMode="spline"
            keySplines="0.25,0.1,0.5,1"
            keyTimes="0; 1"
          />
        </g>
        {/* Blue Lights */}
        <g mask="url(#db-mask-1)">
          <circle
            className="database db-light-1"
            cx="0"
            cy="0"
            r="12"
            fill="url(#db-blue-grad)"
          />
        </g>
        <g mask="url(#db-mask-2)">
          <circle
            className="database db-light-2"
            cx="0"
            cy="0"
            r="12"
            fill="url(#db-blue-grad)"
          />
        </g>
        <g mask="url(#db-mask-3)">
          <circle
            className="database db-light-3"
            cx="0"
            cy="0"
            r="12"
            fill="url(#db-blue-grad)"
          />
        </g>
        <g mask="url(#db-mask-4)">
          <circle
            className="database db-light-4"
            cx="0"
            cy="0"
            r="12"
            fill="url(#db-blue-grad)"
          />
        </g>
        {/* Buttons */}
        <g stroke="currentColor" fill="none" strokeWidth="0.4">
          {/* First Button */}
          <g>
            <rect
              fill="hsl(var(--primary))"
              x="14"
              y="5"
              width="34"
              height="10"
              rx="5"
            ></rect>
            {Icon1 && (
              <foreignObject x="18" y="7.5" width="5" height="5">
                <Icon1 className="size-full text-white" strokeWidth={2.5} />
              </foreignObject>
            )}
            <text
              x="28"
              y="12"
              fill="white"
              stroke="none"
              fontSize="5"
              fontWeight="600"
            >
              {badgeTexts?.first || "GET"}
            </text>
          </g>
          {/* Second Button */}
          <g>
            <rect
              fill="hsl(var(--primary))"
              x="60"
              y="5"
              width="34"
              height="10"
              rx="5"
            ></rect>
            {Icon2 && (
              <foreignObject x="64" y="7.5" width="5" height="5">
                <Icon2 className="size-full text-white" strokeWidth={2.5} />
              </foreignObject>
            )}
            <text
              x="74"
              y="12"
              fill="white"
              stroke="none"
              fontSize="5"
              fontWeight="600"
            >
              {badgeTexts?.second || "POST"}
            </text>
          </g>
          {/* Third Button */}
          <g>
            <rect
              fill="hsl(var(--primary))"
              x="108"
              y="5"
              width="34"
              height="10"
              rx="5"
            ></rect>
            {Icon3 && (
              <foreignObject x="112" y="7.5" width="5" height="5">
                <Icon3 className="size-full text-white" strokeWidth={2.5} />
              </foreignObject>
            )}
            <text
              x="122"
              y="12"
              fill="white"
              stroke="none"
              fontSize="5"
              fontWeight="600"
            >
              {badgeTexts?.third || "PUT"}
            </text>
          </g>
          {/* Fourth Button */}
          <g>
            <rect
              fill="hsl(var(--primary))"
              x="150"
              y="5"
              width="40"
              height="10"
              rx="5"
            ></rect>
            {Icon4 && (
              <foreignObject x="154" y="7.5" width="5" height="5">
                <Icon4 className="size-full text-white" strokeWidth={2.5} />
              </foreignObject>
            )}
            <text
              x="165"
              y="12"
              fill="white"
              stroke="none"
              fontSize="5"
              fontWeight="600"
            >
              {badgeTexts?.fourth || "DELETE"}
            </text>
          </g>
        </g>
        <defs>
          {/* 1 -  user list */}
          <mask id="db-mask-1">
            <path
              d="M 31 10 v 15 q 0 5 5 5 h 59 q 5 0 5 5 v 10"
              strokeWidth="0.5"
              stroke="white"
            />
          </mask>
          {/* 2 - task list */}
          <mask id="db-mask-2">
            <path
              d="M 77 10 v 10 q 0 5 5 5 h 13 q 5 0 5 5 v 10"
              strokeWidth="0.5"
              stroke="white"
            />
          </mask>
          {/* 3 - backlogs */}
          <mask id="db-mask-3">
            <path
              d="M 124 10 v 10 q 0 5 -5 5 h -14 q -5 0 -5 5 v 10"
              strokeWidth="0.5"
              stroke="white"
            />
          </mask>
          {/* 4 - misc */}
          <mask id="db-mask-4">
            <path
              d="M 170 10 v 15 q 0 5 -5 5 h -60 q -5 0 -5 5 v 10"
              strokeWidth="0.5"
              stroke="white"
            />
          </mask>
          {/* Blue Grad */}
          <radialGradient id="db-blue-grad" fx="1">
            <stop offset="0%" stopColor={lightColor || "#00A6F5"} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
      </svg>
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
        <div className="absolute -bottom-8 z-30 grid h-[70px] w-[70px] place-items-center rounded-full border-2 border-primary/40 bg-primary/20 backdrop-blur font-bold text-sm text-foreground">
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
          <motion.div
            className="absolute -bottom-14 h-[130px] w-[130px] rounded-full border-t border-primary/20 bg-primary/5"
            animate={{
              scale: [0.98, 1.02, 0.98, 1, 1, 1, 1, 1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 h-[185px] w-[185px] rounded-full border-t border-primary/20 bg-primary/5"
            animate={{
              scale: [1, 1, 1, 0.98, 1.02, 0.98, 1, 1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-[100px] h-[240px] w-[240px] rounded-full border-t border-primary/20 bg-primary/5"
            animate={{
              scale: [1, 1, 1, 1, 1, 0.98, 1.02, 0.98, 1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-[130px] h-[300px] w-[300px] rounded-full border-t border-primary/20 bg-primary/5"
            animate={{
              scale: [1, 1, 1, 1, 1, 1, 0.98, 1.02, 0.98, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>
    </div>
  );
};

export default DatabaseWithRestApi;

const DatabaseIcon = ({ x = "0", y = "0" }: { x: string; y: string }) => {
  return (
    <svg
      x={x}
      y={y}
      xmlns="http://www.w3.org/2000/svg"
      width="5"
      height="5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
};
