import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StarNode } from '../types';
import { Sparkles, X, ChevronRight, Heart } from 'lucide-react';

interface QuoteModalProps {
  star: StarNode | null;
  totalStars: number;
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  isLastStar: boolean;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  star,
  totalStars,
  currentIndex,
  onClose,
  onNext,
  isLastStar,
}) => {
  const [displayedQuote, setDisplayedQuote] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Reliable typewriter effect without dropped or missing letters
  useEffect(() => {
    if (!star) return;
    const fullText = star.quote;
    setDisplayedQuote('');
    setIsTyping(true);

    let charCount = 0;
    const timer = setInterval(() => {
      charCount += 1;
      if (charCount <= fullText.length) {
        setDisplayedQuote(fullText.slice(0, charCount));
      } else {
        setDisplayedQuote(fullText);
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 22);

    return () => clearInterval(timer);
  }, [star?.id, star?.quote]);

  // Click to reveal full quote instantly
  const handleSkipTyping = () => {
    if (isTyping && star) {
      setDisplayedQuote(star.quote);
      setIsTyping(false);
    }
  };

  if (!star) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-slate-950/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg glass-card rounded-2xl p-5 sm:p-8 text-white shadow-2xl border border-amber-300/30 overflow-hidden max-h-[92dvh] flex flex-col justify-between my-auto"
        >
          {/* Subtle Ambient Background Sparkle Glow */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-full text-slate-400 hover:text-amber-200 hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs uppercase tracking-widest text-amber-300 font-semibold mb-3 sm:mb-4 pr-6 flex-wrap">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 animate-pulse" />
            <span>Star {currentIndex + 1} of {totalStars}</span>
            <span className="text-amber-400/40">•</span>
            <span className="text-amber-200 truncate">{star.name}</span>
          </div>

          {/* Quote Container (tap to skip typing if desired) */}
          <div
            className="my-3 sm:my-4 min-h-[75px] sm:min-h-[90px] flex flex-col justify-center cursor-pointer select-none"
            onClick={handleSkipTyping}
            title={isTyping ? "Click to show full note" : ""}
          >
            <blockquote className="font-playfair text-lg sm:text-xl md:text-2xl leading-relaxed text-amber-100/95 italic whitespace-pre-line">
              "{displayedQuote || star.quote}"
              {isTyping && <span className="inline-block w-1.5 h-4 sm:h-5 bg-amber-300 ml-1 animate-pulse" />}
            </blockquote>
          </div>


          {/* Action Footer */}
          <div className="mt-5 sm:mt-6 flex flex-col-reverse sm:flex-row items-center sm:justify-between gap-3 pt-2 w-full">
            <div className="flex items-center gap-2 text-xs font-inter self-center sm:self-auto">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/60 animate-pulse" />
              <span className="font-semibold tracking-wide text-amber-200">From Mr. Interest</span>
            </div>

            <button
              onClick={onNext}
              className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(243,229,171,0.4)] transition-all duration-300 hover:shadow-[0_0_28px_rgba(243,229,171,0.7)] active:scale-95"
            >
              <span>{isLastStar ? "Reveal Something Special ✨" : "Next Star ✨"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
