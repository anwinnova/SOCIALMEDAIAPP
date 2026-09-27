import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { audioEngine } from '../../utils/audioSynth';
import { X, Radio, Sparkles, Music, Users } from 'lucide-react';

export const AudioVisualizerModal = ({ onClose }) => {
  const { currentTrack, activePod, isPlaying, currentTime } = useApp();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      const data = audioEngine.getFrequencyData();
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background subtle gradient glow
      const bgGlow = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        width / 2
      );
      bgGlow.addColorStop(0, 'rgba(139, 92, 246, 0.15)');
      bgGlow.addColorStop(0.5, 'rgba(6, 182, 212, 0.08)');
      bgGlow.addColorStop(1, 'rgba(10, 12, 18, 0)');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // Render Spectrum Equalizer Bars
      const barWidth = (width / data.length) * 1.5;
      let x = 0;

      for (let i = 0; i < data.length; i++) {
        const barHeight = (data[i] / 255) * (height * 0.5);

        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, '#8b5cf6');
        gradient.addColorStop(0.5, '#06b6d4');
        gradient.addColorStop(1, '#ec4899');

        ctx.fillStyle = gradient;
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(139, 92, 246, 0.6)';
        ctx.fillRect(x, height - barHeight, barWidth - 4, barHeight);

        x += barWidth;
      }

      // Render Oscilloscope Pulse Ring
      const centerX = width / 2;
      const centerY = height / 2 - 20;
      const baseRadius = 80;
      const avgFreq = data.reduce((a, b) => a + b, 0) / data.length;
      const radius = baseRadius + (avgFreq / 255) * 40;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#06b6d4';
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Find active lyric line
  const activeLyric = currentTrack?.lyrics?.find(
    (l) => currentTime >= l.time && currentTime < l.time + 12
  );

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(7, 9, 14, 0.92)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '32px'
    }}>
      {/* Top Header */}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Radio size={20} color="var(--accent-purple)" />
          <span className="font-display" style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>
            HarmoniSync 60FPS Audio Spectrum
          </span>
          <span className="badge badge-purple">
            <Users size={12} /> {activePod?.members?.length || 5} Synced
          </span>
        </div>

        <button className="btn-icon" onClick={onClose} style={{ width: '42px', height: '42px', borderRadius: '50%' }}>
          <X size={20} />
        </button>
      </div>

      {/* Center Canvas & Dynamic Lyrics */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '900px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <canvas
          ref={canvasRef}
          width={900}
          height={400}
          style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-lg)' }}
        />

        {/* Dynamic Synced Lyrics Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          textAlign: 'center',
          padding: '12px 24px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-glow)'
        }}>
          <p className="font-display" style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-cyan)', margin: 0 }}>
            {activeLyric?.text || `🎵 ${currentTrack?.title} — ${currentTrack?.artist}`}
          </p>
        </div>
      </div>

      {/* Bottom Track Controls info */}
      <div style={{ textAlign: 'center' }}>
        <h3 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
          {currentTrack?.title}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {currentTrack?.artist} — Playing in {activePod?.name}
        </p>
      </div>
    </div>
  );
};
