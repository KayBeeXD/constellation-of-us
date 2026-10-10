import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import type { StarNode } from '../types';

export interface SkyCanvasRef {
  triggerBurst: (x: number, y: number) => void;
  triggerCompletionShimmer: () => void;
}

interface SkyCanvasProps {
  stars: StarNode[];
  visitedStarIds: number[];
  isCompleted: boolean;
}

interface StarParticle {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

interface ShimmerParticle {
  x: number;
  y: number;
  vy: number;
  vx: number;
  size: number;
  alpha: number;
  spin: number;
  color: string;
}

export const SkyCanvas = forwardRef<SkyCanvasRef, SkyCanvasProps>(({ stars, visitedStarIds, isCompleted }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Particle systems
  const ambientStarsRef = useRef<StarParticle[]>([]);
  const sparkParticlesRef = useRef<SparkParticle[]>([]);
  const shimmerParticlesRef = useRef<ShimmerParticle[]>([]);
  const lineProgressRef = useRef<{ [key: string]: number }>({});
  const animationFrameRef = useRef<number | null>(null);

  // Expose trigger methods via ref
  useImperativeHandle(ref, () => ({
    triggerBurst: (x: number, y: number) => {
      const colors = ['#F3E5AB', '#D4AF37', '#FFFFFF', '#E6E6FA', '#FFDF00', '#B76E79'];
      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 5.5;
        sparkParticlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.5 + Math.random() * 3.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1.0,
          decay: 0.015 + Math.random() * 0.02,
        });
      }
    },
    triggerCompletionShimmer: () => {
      const colors = ['#F3E5AB', '#D4AF37', '#FFFFFF', '#E6E6FA', '#FFD700'];
      for (let i = 0; i < 120; i++) {
        shimmerParticlesRef.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight * 0.8,
          vx: (Math.random() - 0.5) * 0.8,
          vy: 0.4 + Math.random() * 1.5,
          size: 1 + Math.random() * 3,
          alpha: 0.8 + Math.random() * 0.2,
          spin: Math.random() * Math.PI,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }
  }));

  // Initialize background ambient stars
  useEffect(() => {
    const generateAmbientStars = (w: number, h: number) => {
      const starsArr: StarParticle[] = [];
      const colors = ['#FFFFFF', '#F3E5AB', '#E6E6FA', '#D4AF37', '#B9E3DE'];
      const starCount = Math.floor((w * h) / 4500);

      for (let i = 0; i < Math.max(160, starCount); i++) {
        starsArr.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: Math.random() < 0.15 ? 1.8 + Math.random() * 1.2 : 0.6 + Math.random() * 1.0,
          baseAlpha: 0.2 + Math.random() * 0.6,
          twinkleSpeed: 0.008 + Math.random() * 0.03,
          twinklePhase: Math.random() * Math.PI * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      ambientStarsRef.current = starsArr;
    };

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        generateAmbientStars(window.innerWidth, window.innerHeight);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.016;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // 1. Draw Deep Space Background Gradient
      const grad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, Math.max(w, h));
      grad.addColorStop(0, '#0F172A');
      grad.addColorStop(0.5, '#070B19');
      grad.addColorStop(1, '#03050C');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // 2. Draw Soft Drifting Nebula Clouds
      ctx.save();
      const nGrad1 = ctx.createRadialGradient(w * 0.35, h * 0.45, 10, w * 0.35, h * 0.45, w * 0.45);
      nGrad1.addColorStop(0, 'rgba(139, 92, 246, 0.08)');
      nGrad1.addColorStop(0.5, 'rgba(217, 70, 239, 0.04)');
      nGrad1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nGrad1;
      ctx.fillRect(0, 0, w, h);

      const nGrad2 = ctx.createRadialGradient(w * 0.68, h * 0.6, 20, w * 0.68, h * 0.6, w * 0.4);
      nGrad2.addColorStop(0, 'rgba(243, 229, 171, 0.06)');
      nGrad2.addColorStop(0.6, 'rgba(183, 110, 121, 0.03)');
      nGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nGrad2;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // 3. Draw Ambient Twinkling Stars
      ambientStarsRef.current.forEach(star => {
        star.twinklePhase += star.twinkleSpeed;
        const currentAlpha = Math.max(0.1, star.baseAlpha + Math.sin(star.twinklePhase) * 0.35);

        ctx.save();
        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        // Extra glow for brighter stars
        if (star.radius > 1.8) {
          ctx.shadowColor = star.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // 4. Render Dynamic Constellation Lines Connecting Visited Stars
      if (visitedStarIds.length >= 2) {
        for (let i = 0; i < visitedStarIds.length - 1; i++) {
          const fromStar = stars.find(s => s.id === visitedStarIds[i]);
          const toStar = stars.find(s => s.id === visitedStarIds[i + 1]);

          if (fromStar && toStar) {
            const x1 = (fromStar.xPct / 100) * w;
            const y1 = (fromStar.yPct / 100) * h;
            const x2 = (toStar.xPct / 100) * w;
            const y2 = (toStar.yPct / 100) * h;

            const lineKey = `${fromStar.id}-${toStar.id}`;
            let prog = lineProgressRef.current[lineKey] || 0;
            if (prog < 1) {
              prog = Math.min(1, prog + 0.04);
              lineProgressRef.current[lineKey] = prog;
            }

            const currentX = x1 + (x2 - x1) * prog;
            const currentY = y1 + (y2 - y1) * prog;

            // Outer Starlight Aura Glow Line
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(currentX, currentY);
            ctx.strokeStyle = isCompleted ? 'rgba(255, 223, 0, 0.7)' : 'rgba(243, 229, 171, 0.55)';
            ctx.lineWidth = 3.5;
            ctx.shadowColor = '#F3E5AB';
            ctx.shadowBlur = 15;
            ctx.stroke();

            // Inner Bright Starlight Core Line
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(currentX, currentY);
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1.2;
            ctx.shadowBlur = 0;
            ctx.stroke();
            ctx.restore();

            // Drifting stardust sparks along the beam line
            if (Math.random() < 0.3) {
              const rPos = Math.random() * prog;
              const spX = x1 + (x2 - x1) * rPos + (Math.random() - 0.5) * 6;
              const spY = y1 + (y2 - y1) * rPos + (Math.random() - 0.5) * 6;
              ctx.save();
              ctx.fillStyle = '#FFF';
              ctx.globalAlpha = 0.6;
              ctx.beginPath();
              ctx.arc(spX, spY, 1, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          }
        }
      }

      // If constellation is completed, draw glowing loop back line from last star to first star if not already connected
      if (isCompleted && visitedStarIds.length === stars.length) {
        const firstStar = stars.find(s => s.id === visitedStarIds[0]);
        const lastStar = stars.find(s => s.id === visitedStarIds[visitedStarIds.length - 1]);
        if (firstStar && lastStar) {
          const x1 = (lastStar.xPct / 100) * w;
          const y1 = (lastStar.yPct / 100) * h;
          const x2 = (firstStar.xPct / 100) * w;
          const y2 = (firstStar.yPct / 100) * h;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
          ctx.lineWidth = 3.5;
          ctx.shadowColor = '#FFD700';
          ctx.shadowBlur = 20;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }
      }

      // 5. Update and Render Spark Particles
      for (let i = sparkParticlesRef.current.length - 1; i >= 0; i--) {
        const p = sparkParticlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          sparkParticlesRef.current.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // 6. Update and Render Shimmer Particles (Completion Effect)
      for (let i = shimmerParticlesRef.current.length - 1; i >= 0; i--) {
        const sp = shimmerParticlesRef.current[i];
        sp.y += sp.vy;
        sp.x += Math.sin(time + sp.spin) * 0.5;
        sp.alpha -= 0.002;

        if (sp.y > h || sp.alpha <= 0) {
          if (isCompleted) {
            // Respawn for continuous stardust during completion
            sp.y = -10;
            sp.x = Math.random() * w;
            sp.alpha = 0.8;
          } else {
            shimmerParticlesRef.current.splice(i, 1);
          }
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, sp.alpha);
        ctx.fillStyle = sp.color;
        ctx.shadowColor = sp.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [stars, visitedStarIds, isCompleted]);

  // Reset line animation state when visited stars are cleared (Replay)
  useEffect(() => {
    if (visitedStarIds.length <= 1) {
      lineProgressRef.current = {};
    }
  }, [visitedStarIds]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
});

SkyCanvas.displayName = 'SkyCanvas';
