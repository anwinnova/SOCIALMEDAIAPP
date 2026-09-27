import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Radio,
  Plus,
  Users,
  Lock,
  Music,
  Check,
  Sparkles,
  Zap,
  Volume2
} from 'lucide-react';

export const PodManagerModal = ({ onClose }) => {
  const {
    pods,
    activePodId,
    tracks,
    users,
    currentUser,
    joinPod,
    rejoinMainSync,
    createPrivatePod
  } = useApp();

  const [isCreating, setIsCreating] = useState(false);
  const [podName, setPodName] = useState('');
  const [selectedTrackId, setSelectedTrackId] = useState(tracks[0]?.id);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const handleCreatePod = (e) => {
    e.preventDefault();
    createPrivatePod(
      podName || 'Private Breakout Pod',
      selectedTrackId,
      selectedUserIds
    );
    setIsCreating(false);
    onClose();
  };

  const toggleUserSelection = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 110,
      background: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '560px',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        background: '#121624',
        border: '1px solid var(--border-glow)',
        boxShadow: 'var(--shadow-main)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Radio size={22} color="var(--accent-purple)" />
            <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              Synchronized Music Pods
            </h2>
          </div>

          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {!isCreating ? (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Listen together with the full group (5/5) or split off into a private listening pod with selected friends.
            </p>

            {/* List of Pods */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {pods.map((pod) => {
                const isCurrent = pod.id === activePodId;
                const podTrack = tracks.find((t) => t.id === pod.trackId);

                return (
                  <div
                    key={pod.id}
                    className="glass-card"
                    style={{
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: isCurrent ? '1px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                      background: isCurrent ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: pod.isMainGroup ? '#fff' : 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {pod.isMainGroup ? <Users size={16} color="var(--accent-purple)" /> : <Lock size={14} color="var(--accent-cyan)" />}
                        {pod.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        🎵 Track: {podTrack?.title} • {pod.members?.length} Members Synced
                      </div>
                    </div>

                    {isCurrent ? (
                      <span className="badge badge-purple">Active Pod</span>
                    ) : (
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                        onClick={() => {
                          joinPod(pod.id);
                          onClose();
                        }}
                      >
                        Tune In
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => setIsCreating(true)}
              >
                <Plus size={18} />
                <span>Split & Create Private Listening Pod</span>
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => {
                  rejoinMainSync();
                  onClose();
                }}
              >
                Rejoin Main Group (5/5)
              </button>
            </div>
          </div>
        ) : (
          /* Form: Create Private Pod */
          <form onSubmit={handleCreatePod} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                POD NAME
              </label>
              <input
                type="text"
                placeholder="e.g. Late Night Synthwave Chill"
                value={podName}
                onChange={(e) => setPodName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                SELECT SYNC TRACK
              </label>
              <select
                value={selectedTrackId}
                onChange={(e) => setSelectedTrackId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: '#191e30',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  outline: 'none'
                }}
              >
                {tracks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} — {t.artist} ({t.genre})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                SELECT FRIENDS TO LISTEN ALONE WITH
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
                {users.filter(u => u.id !== currentUser.id).map((user) => {
                  const isSelected = selectedUserIds.includes(user.id);
                  return (
                    <div
                      key={user.id}
                      onClick={() => toggleUserSelection(user.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={user.avatar} alt="avatar" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</span>
                      </div>
                      {isSelected && <Check size={16} color="var(--accent-cyan)" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setIsCreating(false)}
              >
                Back
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Launch Private Pod
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
