import React, { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Smile,
  Radio,
  Sparkles,
  Play,
  Heart,
  Flame,
  ThumbsUp,
  Volume2,
  Mic,
  Music,
  Share2
} from 'lucide-react';

export const ChatArea = () => {
  const {
    messages,
    users,
    currentUser,
    activeChannelId,
    channels,
    addReaction,
    typingUser,
    playTrack,
    tracks,
    activePod
  } = useApp();

  const messagesEndRef = useRef(null);
  const currentChannel = channels.find((c) => c.id === activeChannelId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  const channelMessages = messages.filter(
    (m) => !m.channelId || m.channelId === activeChannelId
  );

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflowY: 'auto',
      padding: '24px 28px',
      gap: '16px'
    }}>
      {/* Channel Header Banner */}
      <div className="glass-card" style={{ padding: '20px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)' }}>
            <Radio size={24} />
          </div>
          <div>
            <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              Welcome to #{currentChannel?.name || 'lounge'}!
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              {currentChannel?.description || 'Synchronized group chat and real-time audio vibes.'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      {channelMessages.map((msg) => {
        const author = users.find((u) => u.id === msg.userId) || currentUser;
        const isSelf = msg.userId === currentUser.id;

        // System Sync Alert (Track change, Pod creation, etc.)
        if (msg.isSyncAlert) {
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '8px 0',
              }}
            >
              <div
                className="badge badge-purple"
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(139, 92, 246, 0.15)'
                }}
              >
                <Sparkles size={14} color="var(--accent-cyan)" />
                <span>{msg.text}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{msg.timestamp}</span>
              </div>
            </div>
          );
        }

        return (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start',
              flexDirection: isSelf ? 'row-reverse' : 'row',
            }}
          >
            {/* User Avatar */}
            <img
              src={author.avatar}
              alt={author.name}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                objectFit: 'cover',
                border: '1px solid var(--border-subtle)'
              }}
            />

            {/* Message Bubble Content */}
            <div style={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: isSelf ? 'flex-end' : 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {author.name}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {msg.timestamp}
                </span>
              </div>

              <div
                className="glass-card"
                style={{
                  padding: '12px 16px',
                  borderRadius: isSelf ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                  background: isSelf
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.35) 0%, rgba(124, 58, 237, 0.45) 100%)'
                    : 'rgba(25, 30, 48, 0.8)',
                  border: isSelf ? '1px solid rgba(139, 92, 246, 0.5)' : '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  lineHeight: 1.5
                }}
              >
                {msg.text}

                {/* Optional Voice Note Simulation */}
                {msg.isVoiceNote && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(0, 0, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <button className="btn-icon" style={{ width: '30px', height: '30px' }}>
                      <Play size={14} />
                    </button>
                    <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
                      <div style={{ width: '40%', height: '100%', background: 'var(--accent-cyan)', borderRadius: '2px' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>0:14</span>
                  </div>
                )}
              </div>

              {/* Emoji Reactions Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                {Object.entries(msg.reactions || {}).map(([emoji, userIds]) => {
                  if (userIds.length === 0) return null;
                  const hasUserReacted = userIds.includes(currentUser.id);
                  return (
                    <button
                      key={emoji}
                      onClick={() => addReaction(msg.id, emoji)}
                      style={{
                        background: hasUserReacted ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        border: hasUserReacted ? '1px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                        borderRadius: '12px',
                        padding: '2px 8px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>{emoji}</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>{userIds.length}</span>
                    </button>
                  );
                })}

                {/* Quick Add Reaction Picker */}
                {['🔥', '🎵', '💜', '🙌'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addReaction(msg.id, emoji)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      opacity: 0.4,
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.4)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* Typing Indicator */}
      {typingUser && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
          <div className="eq-container active">
            <div className="eq-bar" />
            <div className="eq-bar" />
            <div className="eq-bar" />
          </div>
          <span>{typingUser} is typing...</span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
