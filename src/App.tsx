import { useState, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import type { StarNode, AppStage, LoveLetterContent } from './types';
import { getStoredStars, getStoredLetter } from './data/quotes';
import { cosmicAudio } from './utils/audioSynth';
import { SkyCanvas } from './components/SkyCanvas';
import type { SkyCanvasRef } from './components/SkyCanvas';
import { ConstellationStars } from './components/ConstellationStars';
import { QuoteModal } from './components/QuoteModal';
import { EntranceCurtain } from './components/EntranceCurtain';
import { FinalLetterModal } from './components/FinalLetterModal';
import { AudioControls } from './components/AudioControls';
import { CustomizeDrawer } from './components/CustomizeDrawer';
import { Heart, Sparkles } from 'lucide-react';

export function App() {
  const [stage, setStage] = useState<AppStage>('WELCOME');
  const [stars, setStars] = useState<StarNode[]>(getStoredStars());
  const [letter, setLetter] = useState<LoveLetterContent>(getStoredLetter());
  const [visitedStarIds, setVisitedStarIds] = useState<number[]>([]);
  const [activeStar, setActiveStar] = useState<StarNode | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [showFinalLetterModal, setShowFinalLetterModal] = useState(false);

  const canvasRef = useRef<SkyCanvasRef | null>(null);

  // Compute next target star ID to guide the user naturally
  const nextTargetId = useMemo(() => {
    if (visitedStarIds.length === 0) return stars[0]?.id || 1;
    if (visitedStarIds.length >= stars.length) return null;
    return stars[visitedStarIds.length]?.id || null;
  }, [visitedStarIds, stars]);

  // Entrance curtain handler
  const handleEnterUniverse = () => {
    cosmicAudio.startAmbientAudio();
    setStage('EXPLORING');
  };

  // Star Click Handler
  const handleStarClick = (star: StarNode, e: React.MouseEvent | React.TouchEvent) => {
    // Determine click position for canvas burst
    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight / 2;

    if ('clientX' in e && typeof e.clientX === 'number') {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if ('changedTouches' in e && e.changedTouches && e.changedTouches[0]) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      clientX = (star.xPct / 100) * window.innerWidth;
      clientY = (star.yPct / 100) * window.innerHeight;
    }

    // Trigger canvas particle burst around clicked star
    canvasRef.current?.triggerBurst(clientX, clientY);

    // Play celestial chime audio FX
    const clickedIdx = stars.findIndex(s => s.id === star.id);
    cosmicAudio.playStarChime(clickedIdx >= 0 ? clickedIdx : 0);

    // Add star to visited list if not already included
    if (!visitedStarIds.includes(star.id)) {
      const nextVisited = [...visitedStarIds, star.id];
      setVisitedStarIds(nextVisited);

      // Check if all stars connected (Climax!)
      if (nextVisited.length === stars.length) {
        setTimeout(() => {
          handleConstellationCompletion();
        }, 800);
      }
    }

    // Open Quote Modal
    setActiveStar(star);
  };

  // Constellation Completion Climax
  const handleConstellationCompletion = () => {
    setStage('COMPLETED');
    cosmicAudio.playCompletionFanfare();
    canvasRef.current?.triggerCompletionShimmer();

    // Canvas Confetti Celestial Stardust Burst
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#F3E5AB', '#D4AF37', '#E6E6FA', '#FFFFFF', '#FFDF00'],
      shapes: ['star', 'circle'],
      scalar: 1.2,
    });
  };

  // Handle "Next Star ✨" from Modal
  const handleModalNext = () => {
    if (!activeStar) return;
    const currentIdx = stars.findIndex(s => s.id === activeStar.id);

    if (currentIdx < stars.length - 1) {
      const nextStar = stars[currentIdx + 1];
      // Automatically navigate to next star
      setActiveStar(nextStar);
      if (!visitedStarIds.includes(nextStar.id)) {
        const nextVisited = [...visitedStarIds, nextStar.id];
        setVisitedStarIds(nextVisited);

        // Calculate next star center coordinates for burst
        const nx = (nextStar.xPct / 100) * window.innerWidth;
        const ny = (nextStar.yPct / 100) * window.innerHeight;
        canvasRef.current?.triggerBurst(nx, ny);
        cosmicAudio.playStarChime(currentIdx + 1);

        if (nextVisited.length === stars.length) {
          setTimeout(() => {
            handleConstellationCompletion();
          }, 800);
        }
      }
    } else {
      // Reached final star
      setActiveStar(null);
      setShowFinalLetterModal(true);
    }
  };

  // Replay Function ("Watch the stars again 🌌")
  const handleReplay = () => {
    setVisitedStarIds([]);
    setActiveStar(null);
    setShowFinalLetterModal(false);
    setStage('EXPLORING');
  };

  // Customizer Save Callback
  const handleSaveCustomization = (newStars: StarNode[], newLetter: LoveLetterContent) => {
    setStars(newStars);
    setLetter(newLetter);
    setVisitedStarIds([]);
    setActiveStar(null);
    setStage('EXPLORING');
  };

  return (
    <main className="relative w-screen h-screen h-[100dvh] overflow-hidden bg-[#070B19] select-none font-outfit">
      {/* 1. Canvas Layer (Twinkling background stars, particles, dynamic lines) */}
      <SkyCanvas
        ref={canvasRef}
        stars={stars}
        visitedStarIds={visitedStarIds}
        isCompleted={stage === 'COMPLETED'}
      />

      {/* 2. Entrance Curtain Overlay */}
      {stage === 'WELCOME' && (
        <EntranceCurtain onEnter={handleEnterUniverse} />
      )}

      {/* 3. Main Sky Interactive Constellation Stars */}
      {stage !== 'WELCOME' && (
        <>
          {/* Header Title Pill */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 pointer-events-none">
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full glass-panel text-amber-200 border border-amber-300/30 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 animate-pulse" />
              <h1 className="font-playfair text-xs sm:text-sm md:text-base font-semibold tracking-wide whitespace-nowrap">
                Constellation of Us
              </h1>
            </div>
          </div>

          {/* Floating Audio & Controls Bar */}
          <AudioControls
            visitedCount={visitedStarIds.length}
            totalCount={stars.length}
            onResetConstellation={() => setVisitedStarIds([])}
            onOpenCustomizer={() => setIsCustomizerOpen(true)}
          />

          {/* Primary Anchor Stars */}
          <ConstellationStars
            stars={stars}
            visitedStarIds={visitedStarIds}
            activeTargetId={nextTargetId}
            onStarClick={handleStarClick}
          />

          {/* Completion Banner Trigger */}
          {stage === 'COMPLETED' && !showFinalLetterModal && !activeStar && (
            <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-auto w-max max-w-[92vw]">
              <button
                onClick={() => setShowFinalLetterModal(true)}
                className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_30px_rgba(243,229,171,0.7)] animate-bounce"
              >
                <Heart className="w-4 h-4 fill-slate-950" />
                <span>A letter for you awaits! 💌</span>
              </button>
            </div>
          )}

          {/* Quote Card Modal */}
          {activeStar && (
            <QuoteModal
              star={activeStar}
              totalStars={stars.length}
              currentIndex={stars.findIndex(s => s.id === activeStar.id)}
              onClose={() => setActiveStar(null)}
              onNext={handleModalNext}
              isLastStar={stars.findIndex(s => s.id === activeStar.id) === stars.length - 1}
            />
          )}

          {/* Final Love Letter Modal */}
          {showFinalLetterModal && (
            <FinalLetterModal
              letter={letter}
              onReplay={handleReplay}
              onOpenCustomizer={() => {
                setShowFinalLetterModal(false);
                setIsCustomizerOpen(true);
              }}
              onClose={() => setShowFinalLetterModal(false)}
            />
          )}

          {/* Live Customizer Drawer */}
          <CustomizeDrawer
            stars={stars}
            letter={letter}
            isOpen={isCustomizerOpen}
            onClose={() => setIsCustomizerOpen(false)}
            onSave={handleSaveCustomization}
          />
        </>
      )}
    </main>
  );
}

export default App;
