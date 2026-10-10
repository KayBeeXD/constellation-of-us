import React, { useEffect, useRef, useState } from 'react';

interface NorthernLightsProps {
  className?: string;
}

export const NorthernLightsBackground: React.FC<NorthernLightsProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [auroraPreset, setAuroraPreset] = useState<'EMERALD' | 'VIOLET' | 'COSMIC'>('EMERALD');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Stars within the aurora
    const stars: { x: number; y: number; r: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < 90; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * (window.innerHeight * 0.75),
        r: 0.6 + Math.random() * 1.4,
        alpha: 0.3 + Math.random() * 0.7,
        speed: 0.01 + Math.random() * 0.03,
      });
    }

    const render = () => {
      time += 0.007;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // 1. Deep Nordic Night Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#030712');
      skyGrad.addColorStop(0.4, '#061024');
      skyGrad.addColorStop(0.75, '#071A2E');
      skyGrad.addColorStop(1, '#020617');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Stars shining through the atmosphere
      stars.forEach(s => {
        const flicker = Math.sin(time * 6 + s.x) * 0.25;
        ctx.save();
        ctx.globalAlpha = Math.max(0.15, Math.min(1, s.alpha + flicker));
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 3. Draw Undulating Aurora Borealis Curtains
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      const drawCurtain = (
        yBaseRatio: number,
        amplitude: number,
        freq: number,
        speedMult: number,
        colorTop: string,
        colorMid: string,
        colorBot: string,
        verticalHeight: number,
        rayDensity: number
      ) => {
        const yBase = h * yBaseRatio;
        const segmentWidth = 6;
        const count = Math.ceil(w / segmentWidth);

        for (let i = 0; i < count; i++) {
          const x = i * segmentWidth;
          // Complex harmonic wave equation
          const wave1 = Math.sin(x * freq + time * speedMult);
          const wave2 = Math.cos(x * freq * 0.5 - time * speedMult * 0.8) * 0.5;
          const wave3 = Math.sin(x * freq * 1.8 + time * speedMult * 1.2) * 0.25;
          const offsetY = (wave1 + wave2 + wave3) * amplitude;

          const startY = yBase + offsetY;
          const curtainHeight = verticalHeight + Math.sin(x * 0.01 + time) * 35;

          // Ray pulsation
          const rayIntensity = 0.6 + Math.sin(x * rayDensity + time * 3) * 0.4;

          const grad = ctx.createLinearGradient(x, startY - curtainHeight, x, startY + 40);
          grad.addColorStop(0, 'rgba(0,0,0,0)');
          grad.addColorStop(0.2, colorTop);
          grad.addColorStop(0.55, colorMid);
          grad.addColorStop(0.95, colorBot);
          grad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = grad;
          ctx.globalAlpha = 0.55 * rayIntensity;
          ctx.fillRect(x, startY - curtainHeight, segmentWidth + 1, curtainHeight + 50);
        }
      };

      if (auroraPreset === 'EMERALD') {
        // Emerald Green & Cyan Aurora
        drawCurtain(0.48, 55, 0.0035, 1.2, 'rgba(168, 85, 247, 0.35)', 'rgba(6, 214, 160, 0.55)', 'rgba(5, 255, 161, 0.7)', 180, 0.03);
        drawCurtain(0.42, 65, 0.0028, 0.9, 'rgba(59, 130, 246, 0.25)', 'rgba(0, 245, 212, 0.6)', 'rgba(0, 255, 136, 0.75)', 220, 0.025);
        drawCurtain(0.36, 75, 0.002, 0.7, 'rgba(236, 72, 153, 0.3)', 'rgba(16, 185, 129, 0.5)', 'rgba(52, 211, 153, 0.6)', 260, 0.02);
      } else if (auroraPreset === 'VIOLET') {
        // Deep Violet & Magenta Aurora
        drawCurtain(0.48, 60, 0.0032, 1.1, 'rgba(236, 72, 153, 0.5)', 'rgba(192, 132, 252, 0.65)', 'rgba(147, 51, 234, 0.7)', 200, 0.03);
        drawCurtain(0.40, 70, 0.0025, 0.85, 'rgba(129, 140, 248, 0.4)', 'rgba(217, 70, 239, 0.6)', 'rgba(59, 130, 246, 0.6)', 240, 0.025);
        drawCurtain(0.34, 80, 0.0018, 0.65, 'rgba(244, 63, 94, 0.3)', 'rgba(168, 85, 247, 0.45)', 'rgba(0, 245, 212, 0.45)', 280, 0.02);
      } else {
        // Cosmic Multi-Spectral Aurora
        drawCurtain(0.50, 50, 0.004, 1.3, 'rgba(236, 72, 153, 0.4)', 'rgba(0, 245, 212, 0.6)', 'rgba(0, 255, 136, 0.75)', 170, 0.035);
        drawCurtain(0.42, 65, 0.0028, 1.0, 'rgba(168, 85, 247, 0.45)', 'rgba(59, 130, 246, 0.6)', 'rgba(5, 255, 161, 0.65)', 220, 0.025);
        drawCurtain(0.35, 80, 0.0022, 0.7, 'rgba(251, 191, 36, 0.25)', 'rgba(236, 72, 153, 0.45)', 'rgba(99, 102, 241, 0.5)', 270, 0.02);
      }

      ctx.restore();

      // 4. Ethereal Drifting Horizontal Glow Clouds
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const glowGrad = ctx.createRadialGradient(
        w * (0.5 + Math.sin(time * 0.8) * 0.15),
        h * 0.45,
        20,
        w * 0.5,
        h * 0.45,
        w * 0.45
      );
      glowGrad.addColorStop(0, 'rgba(5, 255, 161, 0.08)');
      glowGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.04)');
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [auroraPreset]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Canvas Layer for 60fps Northern Lights simulation */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Atmospheric Aurora Video layer (loops seamlessly, blend mode screen) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setVideoLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover mix-blend-screen transition-opacity duration-1000 ${
          videoLoaded ? 'opacity-40' : 'opacity-0'
        }`}
        src="https://upload.wikimedia.org/wikipedia/commons/transcoded/d/df/Aurora_borealis_timelapse.webm/Aurora_borealis_timelapse.webm.720p.vp9.webm"
      />

      {/* Realistic Mountain & Pine Forest Horizon Silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-44 md:h-56 pointer-events-none z-10">
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="w-full h-full fill-[#020510]/95 filter drop-shadow-[0_-15px_30px_rgba(0,255,136,0.06)]"
        >
          {/* Distant majestic mountain ridges */}
          <path
            d="M0,220 L120,180 L260,230 L390,160 L540,240 L690,150 L840,225 L980,140 L1120,210 L1260,170 L1360,200 L1440,165 L1440,320 L0,320 Z"
            className="fill-[#040A18]/80"
          />
          {/* Closer rugged mountain ridges with pine tree silhouettes */}
          <path
            d="M0,260 L80,240 L150,270 L210,235 L290,265 L360,220 L440,275 L520,230 L610,270 L720,215 L810,260 L900,225 L1010,270 L1110,230 L1220,265 L1320,225 L1440,255 L1440,320 L0,320 Z"
            className="fill-[#02050E]"
          />
        </svg>

        {/* Ambient Lake / Snow reflection sheen at the very base */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#02040A] via-[#020510]/80 to-transparent" />
      </div>

      {/* Preset selector pill in top left corner of landing screen */}
      <div className="absolute top-4 left-4 z-20 pointer-events-auto flex items-center gap-1.5 p-1 rounded-full glass-panel text-[11px] font-medium text-emerald-200 border border-emerald-400/20 backdrop-blur-md">
        <span className="px-2 py-0.5 text-emerald-300 font-semibold tracking-wide">
          Aurora Lights:
        </span>
        <button
          onClick={() => setAuroraPreset('EMERALD')}
          className={`px-2.5 py-1 rounded-full transition-all ${
            auroraPreset === 'EMERALD'
              ? 'bg-emerald-500/30 text-emerald-100 border border-emerald-400/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Emerald ✨
        </button>
        <button
          onClick={() => setAuroraPreset('VIOLET')}
          className={`px-2.5 py-1 rounded-full transition-all ${
            auroraPreset === 'VIOLET'
              ? 'bg-purple-500/30 text-purple-100 border border-purple-400/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Violet 💜
        </button>
        <button
          onClick={() => setAuroraPreset('COSMIC')}
          className={`px-2.5 py-1 rounded-full transition-all ${
            auroraPreset === 'COSMIC'
              ? 'bg-teal-500/30 text-teal-100 border border-teal-400/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Cosmic 🌌
        </button>
      </div>
    </div>
  );
};
