import React from 'react';
import { motion } from 'framer-motion';
import type { StarNode } from '../types';
import { Sparkles } from 'lucide-react';

interface ConstellationStarsProps {
  stars: StarNode[];
  visitedStarIds: number[];
  activeTargetId: number | null;
  onStarClick: (star: StarNode, event: React.MouseEvent | React.TouchEvent) => void;
}

export const ConstellationStars: React.FC<ConstellationStarsProps> = ({
  stars,
  visitedStarIds,
  activeTargetId,
  onStarClick,
}) => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-auto">
      {stars.map((star, idx) => {
        const isVisited = visitedStarIds.includes(star.id);
        const isNextTarget = activeTargetId === star.id;

        return (
          <div
            key={star.id}
            style={{
              left: `${star.xPct}%`,
              top: `${star.yPct}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute flex flex-col items-center justify-center cursor-pointer group p-3 -m-3 touch-manipulation select-none"
            onClick={(e) => onStarClick(star, e)}
            onTouchEnd={(e) => {
              e.preventDefault();
              onStarClick(star, e);
            }}
          >
            {/* Beacon Ring for the Target Star to guide user gracefully */}
            {isNextTarget && !isVisited && (
              <div className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-amber-300/60 animate-beacon pointer-events-none" />
            )}

            {/* Glowing Star Halo */}
            <motion.div
              whileHover={{ scale: 1.35 }}
              whileTap={{ scale: 0.9 }}
              className={`relative flex items-center justify-center rounded-full transition-all duration-500 ${
                isVisited
                  ? 'w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 shadow-[0_0_30px_rgba(255,223,0,0.9)] ring-2 ring-amber-100'
                  : isNextTarget
                  ? 'w-8 h-8 sm:w-9 sm:h-9 bg-amber-300/80 shadow-[0_0_25px_rgba(243,229,171,0.8)] animate-star-pulse'
                  : 'w-6 h-6 sm:w-7 sm:h-7 bg-amber-100/40 shadow-[0_0_15px_rgba(243,229,171,0.4)] hover:bg-amber-200/80 hover:shadow-[0_0_22px_rgba(243,229,171,0.7)]'
              }`}
            >
              {/* Star Core Icon */}
              {isVisited ? (
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-950 animate-spin-slow" />
              ) : (
                <div
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
                    isNextTarget ? 'bg-amber-100' : 'bg-white/80'
                  }`}
                />
              )}

              {/* Number Badge */}
              <div
                className={`absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-bold ${
                  isVisited
                    ? 'bg-amber-300 text-amber-950 shadow-sm'
                    : 'bg-slate-900/80 text-amber-200 border border-amber-300/40'
                }`}
              >
                {idx + 1}
              </div>
            </motion.div>

            {/* Star Title Label (On mobile, only visited & active target stars show label to eliminate clutter) */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-1.5 sm:mt-2 text-center pointer-events-none ${
                isVisited || isNextTarget ? 'block' : 'hidden sm:block'
              }`}
            >
              <span
                className={`text-[10px] sm:text-xs md:text-sm font-medium tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full transition-all duration-300 max-w-[110px] sm:max-w-none truncate sm:overflow-visible inline-block ${
                  isVisited
                    ? 'text-amber-200 bg-slate-900/70 border border-amber-400/40 shadow-sm backdrop-blur-md'
                    : isNextTarget
                    ? 'text-amber-100 bg-amber-950/50 border border-amber-300/40 font-semibold'
                    : 'text-slate-300/70 opacity-75 group-hover:opacity-100 group-hover:text-amber-100'
                }`}
              >
                {star.name}
              </span>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};
