import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Radio,
  Users,
  Sparkles,
  Maximize2,
  Upload,
  FileText,
  ListMusic,
  Plus
} from 'lucide-react';

export const MusicPlayerBar = ({ onOpenPodModal }) => {
  const {
    currentTrack,
    activePod,
    isPlaying,
    togglePlayPause,
    currentTime,
    duration,
    seekTo,
    volume,
    setVolume,
    showLyrics,
    setShowLyrics,
    showVisualizer,
    setShowVisualizer,
    uploadCustomTrack,
    rejoinMainSync
  } = useApp();

  const fileInputRef = useRef(null);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadCustomTrack(file);
    }
  };

  return (
    <footer className="glass-panel" style={{
      height: '80px',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTop: '1px solid var(--border-subtle)',
      background: 'rgba(10, 12, 18, 0.95)',
      zIndex: 50
    }}>
      {/* 1. Album Art & Track Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '280px' }}>
        <div style={{ position: 'relative', width: '48px', height: '48px' }}>
          <img
            src={currentTrack?.cover || 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b'}
            alt="cover"
            className={isPlaying ? 'animate-spin-slow' : 'animate-spin-slow-paused'}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--accent-purple)'
            }}
          />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: 'var(--bg-primary)',
            border: '1px solid var(--accent-purple)'
          }} />
        </div>

        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {currentTrack?.title}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {currentTrack?.artist}
          </div>
        </div>
      </div>

      {/* 2. Central Synchronized Playback Controls & Progress Bar */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        maxWidth: '520px',
        width: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button className="btn-icon" style={{ border: 'none', background: 'transparent' }}>
            <SkipBack size={18} />
          </button>

          <button
            onClick={togglePlayPause}
            className="btn btn-primary"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              padding: 0,
              boxShadow: '0 0 16px var(--accent-purple-glow)'
            }}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
          </button>

          <button className="btn-icon" style={{ border: 'none', background: 'transparent' }}>
            <SkipForward size={18} />
          </button>
        </div>

        {/* Scrub Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', width: '32px', textAlign: 'right' }}>
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seekTo(Number(e.target.value))}
            style={{
              flex: 1,
              height: '4px',
              accentColor: 'var(--accent-purple)',
              cursor: 'pointer'
            }}
          />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', width: '32px' }}>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* 3. Pod Switcher & Utility Triggers */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '280px', justifyContent: 'flex-end' }}>
        {/* Pod Status Pill */}
        <button
          onClick={onOpenPodModal}
          className="glass-card"
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            border: activePod?.isMainGroup ? '1px solid var(--accent-purple)' : '1px solid var(--accent-cyan)',
            background: activePod?.isMainGroup ? 'rgba(139, 92, 246, 0.15)' : 'rgba(6, 182, 212, 0.15)'
          }}
        >
          <Radio size={14} color={activePod?.isMainGroup ? 'var(--accent-purple)' : 'var(--accent-cyan)'} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
            {activePod?.isMainGroup ? 'Group 5/5' : 'Private Pod'}
          </span>
        </button>

        {/* Lyrics Button */}
        <button
          className={`btn-icon ${showLyrics ? 'active' : ''}`}
          onClick={() => setShowLyrics((prev) => !prev)}
          title="Toggle Lyrics"
        >
          <FileText size={18} />
        </button>

        {/* Audio Spectrum Visualizer Button */}
        <button
          className={`btn-icon ${showVisualizer ? 'active' : ''}`}
          onClick={() => setShowVisualizer((prev) => !prev)}
          title="Audio Spectrum Visualizer"
        >
          <Maximize2 size={18} />
        </button>

        {/* Custom Upload Track Button */}
        <input
          type="file"
          ref={fileInputRef}
          accept="audio/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <button
          className="btn-icon"
          onClick={() => fileInputRef.current?.click()}
          title="Upload Custom Track"
        >
          <Upload size={18} />
        </button>

        {/* Volume Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Volume2 size={16} color="var(--text-muted)" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{ width: '60px', height: '4px', accentColor: 'var(--accent-cyan)' }}
          />
        </div>
      </div>
    </footer>
  );
};
