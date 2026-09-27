import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  PhoneOff,
  Grid,
  Maximize2,
  Volume2,
  Sparkles,
  Users,
  Radio
} from 'lucide-react';

export const VideoGrid = () => {
  const {
    users,
    callParticipants,
    leaveCall,
    isMicMuted,
    isVideoOff,
    isScreenSharing,
    toggleMic,
    toggleVideo,
    toggleScreenShare,
    activeSpeakerId,
    callLayout,
    setCallLayout,
    currentUser
  } = useApp();

  const localVideoRef = useRef(null);
  const [hasCameraStream, setHasCameraStream] = useState(false);

  // Request actual user webcam stream if camera is on
  useEffect(() => {
    let stream = null;
    if (!isVideoOff) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
        .then((s) => {
          stream = s;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = s;
          }
          setHasCameraStream(true);
        })
        .catch(() => {
          setHasCameraStream(false);
        });
    } else {
      setHasCameraStream(false);
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isVideoOff]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: '#07090e',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      gap: '16px'
    }}>
      {/* Top Call Info Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(255, 255, 255, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} className="animate-pulse-glow" />
          <span className="font-display" style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
            HarmoniSync HD Call Suite
          </span>
          <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
            <Users size={12} /> {callParticipants.length} Connected
          </span>
        </div>

        <button
          className="btn btn-secondary"
          style={{ padding: '4px 12px', fontSize: '0.8rem' }}
          onClick={() => setCallLayout(callLayout === 'grid' ? 'focus' : 'grid')}
        >
          <Grid size={14} /> {callLayout === 'grid' ? 'Focus View' : 'Grid View'}
        </button>
      </div>

      {/* Screen Share Mode Banner */}
      {isScreenSharing && (
        <div className="glass-card" style={{
          height: '240px',
          borderRadius: 'var(--radius-lg)',
          background: 'radial-gradient(circle at center, #1e1b4b 0%, #0f172a 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--accent-purple)',
          boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '12px', left: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Monitor size={16} color="var(--accent-cyan)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
              Screen Share Live — Alex's Music DAW Studio
            </span>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Sparkles size={36} color="var(--accent-purple)" className="animate-pulse-glow" />
            <p style={{ marginTop: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Broadcasting 4K 60fps Audio & Video DAW Screen
            </p>
          </div>
        </div>
      )}

      {/* Video Participants Grid */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: callParticipants.length <= 2 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: '16px',
        overflowY: 'auto'
      }}>
        {callParticipants.map((participantId) => {
          const userObj = users.find((u) => u.id === participantId) || currentUser;
          const isSelf = participantId === currentUser.id;
          const isSpeaking = activeSpeakerId === participantId;

          return (
            <div
              key={participantId}
              className="glass-card"
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#111524',
                border: isSpeaking ? '2px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                boxShadow: isSpeaking ? '0 0 25px var(--accent-purple-glow)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              {/* If Local User with Active Camera Stream */}
              {isSelf && !isVideoOff && hasCameraStream ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                /* Avatar with Animated Audio Visualizer Glow */
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ position: 'relative' }}>
                    <img
                      src={userObj.avatar}
                      alt={userObj.name}
                      style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: isSpeaking ? '3px solid var(--accent-purple)' : '2px solid var(--border-subtle)'
                      }}
                    />
                    {isSpeaking && (
                      <div style={{
                        position: 'absolute',
                        top: -6,
                        left: -6,
                        right: -6,
                        bottom: -6,
                        borderRadius: '50%',
                        border: '2px solid var(--accent-cyan)',
                        animation: 'pulseGlow 1.5s infinite ease-in-out'
                      }} />
                    )}
                  </div>
                </div>
              )}

              {/* Bottom Label Badge */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(8px)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.78rem',
                color: '#fff',
                fontWeight: 600
              }}>
                {isSelf && isMicMuted ? (
                  <MicOff size={14} color="#ef4444" />
                ) : (
                  <Mic size={14} color={isSpeaking ? 'var(--accent-purple)' : '#10b981'} />
                )}
                <span>{userObj.name} {isSelf ? '(You)' : ''}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Call Controls Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '12px 24px',
        borderRadius: 'var(--radius-full)',
        background: 'rgba(18, 21, 34, 0.9)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-subtle)',
        width: 'fit-content',
        margin: '0 auto'
      }}>
        <button
          className={`btn-icon ${isMicMuted ? '' : 'active'}`}
          onClick={toggleMic}
          title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
          style={{ width: '44px', height: '44px', borderRadius: '50%' }}
        >
          {isMicMuted ? <MicOff size={20} color="#ef4444" /> : <Mic size={20} />}
        </button>

        <button
          className={`btn-icon ${isVideoOff ? '' : 'active'}`}
          onClick={toggleVideo}
          title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
          style={{ width: '44px', height: '44px', borderRadius: '50%' }}
        >
          {isVideoOff ? <VideoOff size={20} color="#ef4444" /> : <Video size={20} />}
        </button>

        <button
          className={`btn-icon ${isScreenSharing ? 'active' : ''}`}
          onClick={toggleScreenShare}
          title="Toggle Screen Share"
          style={{ width: '44px', height: '44px', borderRadius: '50%' }}
        >
          <Monitor size={20} />
        </button>

        <button
          className="btn btn-danger"
          onClick={leaveCall}
          style={{ width: '44px', height: '44px', borderRadius: '50%', padding: 0 }}
          title="Leave Call"
        >
          <PhoneOff size={20} />
        </button>
      </div>
    </div>
  );
};
