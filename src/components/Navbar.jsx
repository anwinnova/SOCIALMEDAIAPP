import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Radio,
  PhoneCall,
  Video,
  Users,
  Sparkles,
  Music,
  Headphones,
  SlidersHorizontal,
  Zap
} from 'lucide-react';

export const Navbar = () => {
  const {
    channels,
    activeChannelId,
    isCallActive,
    startCall,
    callParticipants,
    currentTrack,
    activePod,
    isPlaying,
    setShowVisualizer,
    currentUser
  } = useApp();

  const currentChannel = channels.find((c) => c.id === activeChannelId);

  return (
    <header className="glass-panel" style={{
      height: '64px',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-subtle)',
      zIndex: 40
    }}>
      {/* Brand & Active Channel Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-cyan) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px var(--accent-purple-glow)'
          }}>
            <Radio size={22} color="#ffffff" />
          </div>
          <div>
            <h1 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
              Harmoni<span style={{ color: 'var(--accent-purple)' }}>Sync</span>
            </h1>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '-2px' }}>
              Group Chat & Synced Music Engine
            </span>
          </div>
        </div>

        <div style={{ height: '24px', width: '1px', background: 'var(--border-subtle)', margin: '0 8px' }} />

        {/* Current Channel Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '1.1rem' }}>#</span>
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{currentChannel?.name || 'lounge'}</span>
          <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
            <Users size={12} /> {activePod?.members?.length || 4} Listening
          </span>
        </div>
      </div>

      {/* Center Live Ticker: Synced Music Broadcast */}
      <div className="glass-card" style={{
        padding: '6px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '400px',
        cursor: 'pointer'
      }} onClick={() => setShowVisualizer(true)}>
        <div className={`eq-container ${isPlaying ? 'active' : ''}`}>
          <div className="eq-bar"></div>
          <div className="eq-bar"></div>
          <div className="eq-bar"></div>
          <div className="eq-bar"></div>
        </div>
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Headphones size={12} /> SYNCED: {activePod?.name}
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentTrack?.title} — <span style={{ color: 'var(--text-secondary)' }}>{currentTrack?.artist}</span>
          </div>
        </div>
        <Sparkles size={16} color="var(--accent-cyan)" className="animate-pulse-glow" />
      </div>

      {/* Right Controls: Video/Audio Call Trigger & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {!isCallActive ? (
          <button className="btn btn-primary" onClick={startCall}>
            <Video size={18} />
            <span>Join HD Video Call ({callParticipants.length})</span>
          </button>
        ) : (
          <div className="badge badge-emerald" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            In Active Call ({callParticipants.length})
          </div>
        )}

        <div style={{ height: '24px', width: '1px', background: 'var(--border-subtle)' }} />

        {/* Current User Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: '38px', height: '38px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border-glow)' }}
            />
            <span style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#10b981',
              border: '2px solid var(--bg-primary)'
            }} />
          </div>
        </div>
      </div>
    </header>
  );
};
