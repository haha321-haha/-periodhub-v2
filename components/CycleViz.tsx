import React from "react";
import { CurrentCycleInfo } from "../types/cycle";

interface CycleVizProps {
  cycleInfo?: CurrentCycleInfo;
}

const CycleViz: React.FC<CycleVizProps> = ({ cycleInfo }) => {
  // Fallback values if no data is provided (should be handled by parent, but safe to have)
  const currentDay = cycleInfo?.currentDay ?? 14;
  const currentPhaseName = cycleInfo?.currentPhase?.name ?? "Ovulation";
  const cycleProgress = cycleInfo?.cycleProgress ?? 50;
  // const phaseColor = cycleInfo?.currentPhase?.color ?? '#06b6d4'; // Unused

  // SVG Calculation
  // const width = 320; // Unused
  // const height = 320; // Unused
  const radius = 140;
  const circumference = 2 * Math.PI * radius;

  // Dash offset based on progress (starts from 12 o'clock because of rotation)
  // Progress 0% -> offset = circumference
  // Progress 100% -> offset = 0
  const strokeDashoffset =
    circumference - (cycleProgress / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      aria-label={`Menstrual Cycle Visualization: Day ${currentDay}, ${currentPhaseName} Phase`}
    >
      {/* Decorative Glow */}
      <div className="absolute inset-0 bg-purple-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      <div className="relative z-10 w-[320px] h-[320px]">
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          className="transform -rotate-90"
        >
          <defs>
            <linearGradient
              id="cycleGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="33%" stopColor="#a855f7" />
              <stop offset="66%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Background Ring */}
          <circle
            cx="160"
            cy="160"
            r={radius}
            fill="none"
            stroke="#f3f4f6" /* gray-100 */
            strokeWidth="20"
          />

          {/* Progress Ring */}
          <circle
            cx="160"
            cy="160"
            r={radius}
            fill="none"
            stroke="url(#cycleGradient)"
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />

          {/* Current Phase Indicator Dot (Optional: Position math would be needed) */}
        </svg>

        {/* Center Text (Not rotated) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-6xl font-bold text-purple-600 drop-shadow-sm">
            {currentDay}
          </div>
          <div className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-2">
            {currentPhaseName} <br /> Phase
          </div>
        </div>
      </div>
    </div>
  );
};

export default CycleViz;
