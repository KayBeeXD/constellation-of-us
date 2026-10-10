import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LoveLetterContent } from '../types';
import { X } from 'lucide-react';
import heartImg from '../assets/Heart.png';

interface FinalLetterModalProps {
  letter: LoveLetterContent;
  onReplay: () => void;
  onOpenCustomizer?: () => void;
  onClose: () => void;
}

type ModalStage = 'SEALED' | 'EXTRACTING' | 'WRITING' | 'COMPLETE';

export const FinalLetterModal: React.FC<FinalLetterModalProps> = ({
  letter,
  onReplay,
  onClose,
}) => {
  const [stage, setStage] = useState<ModalStage>('SEALED');
  const [visibleParagraphs, setVisibleParagraphs] = useState<number>(0);
  const [isSignatureWritten, setIsSignatureWritten] = useState(false);

  // Trigger letter extraction animation
  const handleTouchHeart = () => {
    setStage('EXTRACTING');
    setTimeout(() => {
      setStage('WRITING');
    }, 1300);
  };

  // Progressive feather pen writing sequence
  useEffect(() => {
    if (stage !== 'WRITING') return;

    setVisibleParagraphs(0);
    setIsSignatureWritten(false);

    // Ink in paragraphs sequentially
    const totalParas = letter.bodyParagraphs.length;
    let currentPara = 0;

    const interval = setInterval(() => {
      currentPara += 1;
      setVisibleParagraphs(currentPara);

      if (currentPara >= totalParas) {
        clearInterval(interval);
        // After all paragraphs inked, sign the letter with the feather pen
        setTimeout(() => {
          setIsSignatureWritten(true);
          setTimeout(() => {
            setStage('COMPLETE');
          }, 900);
        }, 500);
      }
    }, 900);

    return () => clearInterval(interval);
  }, [stage, letter.bodyParagraphs.length]);

  // Click to skip inking and reveal full letter immediately
  const handleSkipWriting = () => {
    if (stage === 'WRITING') {
      setVisibleParagraphs(letter.bodyParagraphs.length);
      setIsSignatureWritten(true);
      setStage('COMPLETE');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-2.5 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden">
        
        {/* STAGE 1: SEALED HEART PROMPT */}
        {stage === 'SEALED' && (
          <motion.div
            key="sealed-modal"
            initial={{ opacity: 0, scale: 0.85, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="relative w-full max-w-sm sm:max-w-md glass-card rounded-2xl p-6 sm:p-8 text-center text-white border border-amber-300/40 shadow-[0_0_50px_rgba(243,229,171,0.2)] flex flex-col items-center cursor-pointer select-none group my-auto"
            onClick={handleTouchHeart}
          >
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 rounded-full text-slate-400 hover:text-amber-200 hover:bg-white/10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-playfair text-xl sm:text-2xl md:text-3xl text-amber-200 mb-4 sm:mb-6 drop-shadow-md">
              Constellation Complete!
            </h2>

            {/* Interactive Heart to unfold the letter */}
            <motion.div
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.94 }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center justify-center my-2 sm:my-3 cursor-pointer group/heart"
            >
              <img
                src={heartImg}
                alt="Heart"
                className="w-20 h-20 sm:w-28 sm:h-28 object-contain drop-shadow-[0_0_35px_rgba(255,40,70,0.85)] group-hover/heart:drop-shadow-[0_0_50px_rgba(255,40,70,1)] transition-all pointer-events-none"
              />
              <span className="mt-3 sm:mt-4 font-cormorant italic text-xl sm:text-2xl text-amber-100 tracking-wider group-hover/heart:text-amber-300 transition-colors drop-shadow-sm">
                Touch my heart...
              </span>
            </motion.div>
          </motion.div>
        )}

        {/* STAGE 2: ENVELOPE UNSEALING & LETTER DRAWN OUT ANIMATION */}
        {stage === 'EXTRACTING' && (
          <motion.div
            key="extracting-animation"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="relative flex flex-col items-center justify-center w-full max-w-sm h-96 select-none my-auto"
          >
            {/* Envelope Container */}
            <div className="relative w-64 h-44 sm:w-72 sm:h-48 bg-[#D8C7B0] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] border-2 border-[#C4AF92] overflow-visible flex items-center justify-center">
              
              {/* Back panel */}
              <div className="absolute inset-0 bg-[#CBB8A0] rounded-xl z-10" />

              {/* Envelope Flap Opening Upwards in 3D (Folds back behind the letter) */}
              <motion.div
                initial={{ rotateX: 0, zIndex: 35 }}
                animate={{ rotateX: 180, zIndex: 15 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ transformOrigin: 'top' }}
                className="absolute top-0 inset-x-0 h-24 sm:h-28 pointer-events-none"
              >
                <svg viewBox="0 0 288 112" className="w-full h-full drop-shadow-md">
                  <polygon points="0,0 144,112 288,0" fill="#E2D3BE" stroke="#C4AF92" strokeWidth="1" />
                </svg>
              </motion.div>

              {/* Letter sliding upwards out of envelope pocket (In FRONT of opened flap) */}
              <motion.div
                initial={{ y: 20, scale: 0.75, opacity: 0.8 }}
                animate={{ y: -90, scale: 1.02, opacity: 1 }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
                className="absolute z-40 w-56 h-40 sm:w-64 sm:h-48 bg-[#FAF7ED] rounded-lg shadow-2xl border-2 border-[#D4AF37] p-3 sm:p-4 flex flex-col items-center justify-center text-center"
              >
                <div className="w-10 sm:w-12 h-1 bg-amber-400/50 rounded-full mb-1.5 sm:mb-2" />
                <span className="font-playfair text-amber-950 font-bold text-xs sm:text-sm">
                  {letter.salutation}
                </span>
                <div className="space-y-1 sm:space-y-1.5 w-full mt-2 sm:mt-3 opacity-60">
                  <div className="h-1 bg-amber-900/30 rounded w-full" />
                  <div className="h-1 bg-amber-900/30 rounded w-5/6 mx-auto" />
                  <div className="h-1 bg-amber-900/30 rounded w-4/6 mx-auto" />
                </div>
              </motion.div>

              {/* Envelope Front Pocket (V-shape) */}
              <div className="absolute inset-0 z-30 pointer-events-none">
                <svg viewBox="0 0 288 192" className="w-full h-full">
                  {/* Left & Right Fold */}
                  <polygon points="0,0 144,110 0,192" fill="#DFD0BC" />
                  <polygon points="288,0 144,110 288,192" fill="#D7C6B0" />
                  {/* Bottom Fold */}
                  <polygon points="0,192 144,110 288,192" fill="#E6D8C6" stroke="#C4AF92" strokeWidth="1" />
                </svg>
              </div>
            </div>
          </motion.div>
        )}

        {/* STAGE 3 & 4: UNFOLDED PARCHMENT WITH FEATHER QUILL PEN WRITING */}
        {(stage === 'WRITING' || stage === 'COMPLETE') && (
          <motion.div
            key="parchment-modal"
            initial={{ opacity: 0, scale: 0.9, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative w-full max-w-2xl max-h-[92dvh] sm:max-h-[88vh] bg-[#FAF7ED] text-slate-900 rounded-2xl p-4 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.85)] border-2 sm:border-4 border-double border-[#D4AF37] flex flex-col overflow-hidden my-auto"
            onClick={handleSkipWriting}
            title={stage === 'WRITING' ? "Click to finish inking instantly" : ""}
          >
            {/* Background Parchment Watermark */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-200/30 to-transparent rounded-bl-full pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-30 p-1.5 sm:p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* FLOATING FEATHER QUILL PEN (Visible while actively writing) */}
            {stage === 'WRITING' && (
              <motion.div
                animate={{
                  x: [0, 45, -20, 30, 0],
                  y: [0, 10, -5, 8, 0],
                  rotate: [20, 28, 16, 25, 20],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute top-6 right-6 sm:top-12 sm:right-12 z-30 pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)] scale-75 sm:scale-100 origin-top-right"
              >
                {/* Vintage Feather Quill Pen SVG */}
                <svg width="65" height="95" viewBox="0 0 65 95" fill="none">
                  {/* Iridescent White & Gold Feather Plume */}
                  <path
                    d="M 52 8 C 58 22 55 45 42 62 C 34 72 26 78 18 84 C 20 72 26 58 35 44 C 44 30 48 18 52 8 Z"
                    fill="url(#featherGrad)"
                    stroke="#D4AF37"
                    strokeWidth="1.2"
                  />
                  {/* Left feather barbs */}
                  <path
                    d="M 42 25 C 32 32 26 42 22 56 C 28 50 34 44 40 38 Z"
                    fill="#F7F1E5"
                    opacity="0.85"
                  />
                  {/* Central Quill Shaft (Rachis) */}
                  <line
                    x1="52"
                    y1="8"
                    x2="10"
                    y2="92"
                    stroke="#C5A059"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                  {/* Golden Metallic Nib Tip */}
                  <polygon points="10,92 6,86 14,84" fill="#D4AF37" stroke="#99772B" strokeWidth="1" />
                  {/* Ink tip drop */}
                  <circle cx="9" cy="93" r="2" fill="#4A2810" />

                  {/* Gradient definitions */}
                  <defs>
                    <linearGradient id="featherGrad" x1="55" y1="5" x2="15" y2="85" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFFDF7" />
                      <stop offset="45%" stopColor="#F5EDDE" />
                      <stop offset="100%" stopColor="#E3CEAA" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Sparkling ink particle */}
                <span className="absolute bottom-0 left-0 w-2 h-2 rounded-full bg-amber-400 animate-ping opacity-75" />
              </motion.div>
            )}

            {/* Letter Header (Always visible at top) */}
            <div className="text-center mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-amber-900/15 shrink-0 px-6 sm:px-8">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-amber-800 font-semibold block mb-0.5">
                {letter.title}
              </span>
              <h2 className="font-playfair text-lg sm:text-2xl md:text-3xl font-bold text-amber-950">
                {letter.salutation}
              </h2>
            </div>

            {/* Scrollable Letter Body & Signature (Smooth inking flow) */}
            <div className="flex-1 overflow-y-auto pr-1.5 sm:pr-3 space-y-3 sm:space-y-4 font-cormorant text-sm sm:text-lg md:text-xl text-slate-800 leading-relaxed italic select-text">
              {letter.bodyParagraphs.map((para, i) => {
                const isRevealed = stage === 'COMPLETE' || i < visibleParagraphs;
                return (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: isRevealed ? 1 : 0.08, y: isRevealed ? 0 : 6 }}
                    transition={{ duration: 0.65, ease: 'easeOut' }}
                    className={`transition-opacity duration-500 ${isRevealed ? 'text-slate-900' : 'text-amber-900/15 select-none'}`}
                  >
                    {para}
                  </motion.p>
                );
              })}

              {/* Closing & Cursive Signature written by feather pen */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: stage === 'COMPLETE' || isSignatureWritten ? 1 : 0,
                  y: stage === 'COMPLETE' || isSignatureWritten ? 0 : 8,
                }}
                transition={{ duration: 0.7 }}
                className="pt-2.5 sm:pt-3 pb-1 flex flex-col items-end border-t border-amber-900/10"
              >
                <span className="font-cormorant text-xs sm:text-base text-slate-700 font-semibold">
                  {letter.closing}
                </span>
                <span className="font-script text-2xl sm:text-4xl text-amber-900 mt-0.5 drop-shadow-sm">
                  {letter.signature}
                </span>
              </motion.div>
            </div>

            {/* Action Bar Footer (Fades in when writing completes) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: stage === 'COMPLETE' ? 1 : 0.4 }}
              transition={{ duration: 0.5 }}
              className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-amber-900/20 flex items-center justify-center shrink-0"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReplay();
                }}
                className="px-4 py-2 sm:px-5 sm:py-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-medium text-xs transition-colors border border-amber-300 shadow-sm active:scale-95 cursor-pointer"
              >
                Watch the stars again
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};
