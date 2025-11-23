import React from "react";
import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const circumference = 2 * Math.PI * 45; // Radius 45
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "text-green-500";
    if (s >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative h-48 w-48">
        {/* Background Circle */}
        <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            className="text-gray-200 dark:text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          {/* Progress Circle */}
          <motion.circle
            className={getColor(score)}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={circumference} // Start empty
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
        </svg>
        {/* Score Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold ${getColor(score)}`}>
            {score}
          </span>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            / 100
          </span>
        </div>
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">
        Overall Score
      </p>
    </div>
  );
}
