import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Zap,
  Coffee,
  Gamepad2,
  Headphones,
  Plus,
  Radio,
  Users,
  Volume2,
  Sparkles,
  ChevronRight,
  Music2,
  Lock,
  Layers
} from 'lucide-react';

const ICON_MAP = {
  MessageSquare: MessageSquare,
  Zap: Zap,
  Coffee: Coffee,
  Gamepad2: Gamepad2,
};

export const Sidebar = ({ onOpenPodModal }) => {
  const {
    channels,
    activeChannelId,
    setActiveChannelId,
    users,
    pods,
    activePodId,
    joinPod,
    rejoinMainSync,
    tracks
  } = useApp();

  return (
    <aside className="glass-panel" style={{
      width: '280px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid var(--border-subtle)',
      background: 'rgba(14, 17, 27, 0.85)',
      zIndex: 30,
      userSelect: 'none'
    }}>
      {/* 1. Channels Section */}
      <div style={{ padding: '20px 16px 12px 16px' }}>
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>Group Chat Channels</span>
          <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>
            {channels.length} Rooms
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {channels.map((channel) => {
            const IconComponent = ICON_MAP[channel.icon] || MessageSquare;
            const isActive = channel.id === activeChannelId;

            return (
              <div
                key={channel.id}
                onClick={() => setActiveChannelId(channel.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  background: isActive ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)' : 'transparent',
                  border: isActive ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <IconComponent size={18} color={isActive ? 'var(--accent-purple)' : 'var(--text-muted)'} />
                  <span style={{ fontWeight: isActive ? 600 : 400, fontSize: '0.9rem' }}>
                    {channel.name}
                  </span>
                </div>

                {channel.unreadCount > 0 && (
                  <span style={{
                    background: 'var(--accent-pink)',
                    color: '#fff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '99px'
                  }}>
                    {channel.unreadCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 16px' }} />

      {/* 2. Synchronized Music Listening Pods Section */}
      <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Radio size={14} color="var(--accent-purple)" />
            Music Sync Pods
          </span>
          <button
            onClick={onOpenPodModal}
            style={{
              background: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: 'var(--accent-purple)',
              borderRadius: '6px',
              padding: '2px 8px',
              fontSize: '0.7rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Plus size={12} /> Split Pod
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {pods.map((pod) => {
            const isCurrentPod = pod.id === activePodId;
            const podTrack = tracks.find((t) => t.id === pod.trackId);

            return (
              <div
                key={pod.id}
                onClick={() => joinPod(pod.id)}
                className="glass-card"
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  border: isCurrentPod ? '1px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                  background: isCurrentPod ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: pod.isMainGroup ? 'var(--text-primary)' : 'var(--accent-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    {pod.isMainGroup ? <Users size={14} color="var(--accent-purple)" /> : <Lock size={12} color="var(--accent-cyan)" />}
                    {pod.isMainGroup ? 'Group Broadcast (5/5)' : pod.name}
                  </span>

                  {isCurrentPod ? (
                    <span className="badge badge-purple" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                      Active
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Join ({pod.members?.length || 1})
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  🎵 {podTrack?.title || 'Unknown Track'}
                </div>

                {/* Member Avatars Stack */}
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', gap: '4px' }}>
                  <div style={{ display: 'flex', marginLeft: '4px' }}>
                    {pod.members?.slice(0, 4).map((memberId, idx) => {
                      const userObj = users.find((u) => u.id === memberId);
                      return (
                        <img
                          key={memberId}
                          src={userObj?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                          alt="avatar"
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1.5px solid var(--bg-primary)',
                            marginLeft: idx > 0 ? '-6px' : '0'
                          }}
                        />
                      );
                    })}
                  </div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                    {pod.members?.length} listening together
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Online Members List */}
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginTop: '24px',
          marginBottom: '12px'
        }}>
          Group Members ({users.length})
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {users.map((user) => {
            const userPod = pods.find(p => p.id === user.currentPod);
            return (
              <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{ width: '32px', height: '32px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: user.status === 'online' ? '#10b981' : '#f59e0b',
                    border: '2px solid var(--bg-primary)'
                  }} />
                </div>

                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.customStatus}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
