import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { NorthernLightsBackground } from './NorthernLightsBackground';
import { cosmicAudio } from '../utils/audioSynth';
import heartImg from '../assets/Heart.png';

interface EntranceCurtainProps {
  onEnter: () => void;
}

export const EntranceCurtain: React.FC<EntranceCurtainProps> = ({ onEnter }) => {
  // Shooting state: 'IDLE' | 'AIMING' | 'SHOOTING' | 'POPPED'
  const [shootState, setShootState] = useState<'IDLE' | 'SHOOTING' | 'POPPED'>('IDLE');

  const handleShoot = () => {
    if (shootState !== 'IDLE') return;

    setShootState('SHOOTING');
    cosmicAudio.playArrowShoot();

    // Flight time to hit the heart: 650ms
    setTimeout(() => {
      setShootState('POPPED');
      cosmicAudio.playHeartPop();

      // Launch heart and star confetti burst right at the heart's impact position
      confetti({
        particleCount: 65,
        spread: 90,
        origin: { x: 0.5, y: 0.38 },
        colors: ['#FF1493', '#FF69B4', '#F3E5AB', '#FFD700', '#FFFFFF', '#FF4500'],
        shapes: ['circle', 'star'],
        scalar: 1.3,
        startVelocity: 35,
      });

      // Smoothly enter the constellation sky after the heart pop burst
      setTimeout(() => {
        onEnter();
      }, 550);
    }, 650);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 1.2, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between text-white p-4 sm:p-6 select-none overflow-hidden"
    >
      {/* 1. Northern Lights Dynamic Aurora Animation & Video Background (100% visible) */}
      <NorthernLightsBackground />

      {/* 2. Top Header - Completely transparent background with glowing text */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="relative z-10 flex flex-col items-center text-center mt-2 sm:mt-6 md:mt-10 pointer-events-none"
      >
        {/* Subtle pill tag without star icon */}
        <div className="flex items-center px-3.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-400/30 text-[10px] sm:text-[11px] text-emerald-200 uppercase tracking-widest font-semibold mb-2 sm:mb-3 backdrop-blur-sm shadow-[0_0_20px_rgba(5,255,161,0.2)]">
          <span>Under the Northern Lights</span>
        </div>

        {/* Ethereal Title without text clipping */}
        <div className="overflow-visible px-2 sm:px-4 py-1 max-w-[96vw]">
          <h1 className="font-script text-4xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-100 via-amber-100 to-amber-200 drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)] px-3 sm:px-6 py-2 sm:py-4 leading-[1.25] sm:leading-[1.35] tracking-wide inline-block overflow-visible select-none">
            Constellation of Us
          </h1>
        </div>

        {/* Subtitle */}
        <p className="font-cormorant italic text-base sm:text-xl md:text-2xl text-amber-100/95 drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] tracking-wide">
          "A little universe made just for you ✨"
        </p>
      </motion.div>

      {/* 3. Center Target & Bow Interaction Area */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-lg my-auto">
        
        {/* THE USER'S 3D GLOSSY RED HEART (Bigger than bow, no ring border) */}
        <div className="relative flex flex-col items-center justify-center h-32 sm:h-44 md:h-48 mb-6 sm:mb-10">
          <AnimatePresence>
            {shootState !== 'POPPED' ? (
              <motion.div
                key="heart-target"
                animate={{
                  scale: [1, 1.1, 1],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2.0,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative flex items-center justify-center cursor-default select-none"
              >
                {/* 3D Glossy Red Heart Asset */}
                <img
                  src={heartImg}
                  alt="3D Red Heart"
                  className="w-28 h-28 sm:w-44 sm:h-44 md:w-48 md:h-48 object-contain drop-shadow-[0_0_40px_rgba(255,40,70,0.85)] filter pointer-events-none select-none"
                />
              </motion.div>
            ) : (
              /* Heart Popping Burst */
              <motion.div
                key="heart-pop"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: [1, 2.5], opacity: [1, 0] }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative flex items-center justify-center"
              >
                <div className="w-44 h-44 rounded-full bg-gradient-to-r from-rose-500 via-amber-300 to-yellow-400 blur-xl" />
                <Sparkles className="absolute w-20 h-20 text-amber-200 animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FLYING ARROW (Renders and animates straight up into the heart center) */}
        {shootState === 'SHOOTING' && (
          <motion.div
            initial={{ y: 70, scale: 0.95, opacity: 1 }}
            animate={{ y: -90, scale: 1.15, opacity: 1 }}
            transition={{ duration: 0.65, ease: 'easeIn' }}
            className="absolute z-30 flex flex-col items-center pointer-events-none"
          >
            {/* Glowing Golden Arrow */}
            <svg width="24" height="70" viewBox="0 0 24 70" fill="none" className="drop-shadow-[0_0_20px_rgba(255,215,0,0.95)]">
              {/* Arrow Head */}
              <polygon points="12,0 3,18 21,18" fill="#FFF" stroke="#FFD700" strokeWidth="2" />
              {/* Arrow Shaft */}
              <line x1="12" y1="18" x2="12" y2="60" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
              {/* Fletching (feathers) */}
              <line x1="12" y1="52" x2="5" y2="64" stroke="#F3E5AB" strokeWidth="2.5" />
              <line x1="12" y1="52" x2="19" y2="64" stroke="#F3E5AB" strokeWidth="2.5" />
              <line x1="12" y1="46" x2="6" y2="58" stroke="#F3E5AB" strokeWidth="2.5" />
              <line x1="12" y1="46" x2="18" y2="58" stroke="#F3E5AB" strokeWidth="2.5" />
            </svg>

            {/* Glowing Particle Trail behind the flying arrow */}
            <div className="w-1.5 h-16 bg-gradient-to-t from-transparent via-amber-300/80 to-white blur-[1px] -mt-2 animate-pulse" />
          </motion.div>
        )}

        {/* THE CELESTIAL CUPID'S BOW (With circular border and ping animation) */}
        <div className="relative flex flex-col items-center">
          <motion.button
            animate={shootState === 'IDLE' ? { scale: [1, 1.08, 1], y: [0, -4, 0] } : {}}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleShoot}
            disabled={shootState !== 'IDLE'}
            className="group relative p-3.5 sm:p-5 rounded-full bg-gradient-to-tr from-amber-400/20 via-slate-900/50 to-yellow-400/20 border-2 border-amber-300/60 backdrop-blur-md cursor-pointer shadow-[0_0_35px_rgba(243,229,171,0.4)] hover:shadow-[0_0_55px_rgba(255,215,0,0.8)] transition-all duration-300 flex items-center justify-center outline-none select-none"
            aria-label="Shoot Arrow at Heart"
          >
            {/* Circular Border Ping Animation urging click */}
            {shootState === 'IDLE' && (
              <div className="absolute inset-0 rounded-full border-2 border-amber-300/60 animate-ping pointer-events-none" />
            )}

            {/* Celestial Golden Bow & Nocked Arrow SVG (Aiming Upwards at the Heart) */}
            <svg
              viewBox="0 0 100 100"
              fill="none"
              className="w-[66px] h-[66px] sm:w-[82px] sm:h-[82px] drop-shadow-[0_0_25px_rgba(255,223,0,0.9)] group-hover:drop-shadow-[0_0_35px_rgba(255,215,0,1)] transition-all"
            >
              {/* Bow Limbs (Arching upwards towards the target heart) */}
              <path
                d="M 18 68 Q 50 18 82 68"
                stroke="url(#bowGrad)"
                strokeWidth="5.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Bowstring */}
              <line
                x1="18"
                y1="68"
                x2="50"
                y2={shootState === 'SHOOTING' ? '35' : '72'}
                stroke="#FFFFFF"
                strokeWidth="2"
                opacity="0.9"
              />
              <line
                x1="82"
                y1="68"
                x2="50"
                y2={shootState === 'SHOOTING' ? '35' : '72'}
                stroke="#FFFFFF"
                strokeWidth="2"
                opacity="0.9"
              />

              {/* Nocked Arrow (aiming upwards at heart) */}
              {shootState === 'IDLE' && (
                <g>
                  {/* Shaft */}
                  <line x1="50" y1="74" x2="50" y2="18" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
                  {/* Glowing Arrow Head */}
                  <polygon points="50,8 42,24 58,24" fill="#FFFFFF" stroke="#FFD700" strokeWidth="2" />
                  {/* Heart on tip */}
                  <circle cx="50" cy="18" r="3.5" fill="#FF1493" />
                  {/* Feather fletchings at base */}
                  <line x1="50" y1="68" x2="42" y2="76" stroke="#FFF" strokeWidth="2.5" />
                  <line x1="50" y1="68" x2="58" y2="76" stroke="#FFF" strokeWidth="2.5" />
                  <line x1="50" y1="62" x2="43" y2="70" stroke="#FFF" strokeWidth="2" />
                  <line x1="50" y1="62" x2="57" y2="70" stroke="#FFF" strokeWidth="2" />
                </g>
              )}

              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="bowGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#F3E5AB" />
                  <stop offset="50%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>
              </defs>
            </svg>
          </motion.button>
        </div>
      </div>

      {/* 4. Bottom Footer Note */}
      <div className="relative z-10 text-[11px] sm:text-xs text-slate-300/80 font-inter mb-2 sm:mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
        Use Headphones 🎧
      </div>
    </motion.div>
  );
};
