import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Send,
  Smile,
  Mic,
  Music,
  Paperclip,
  Sparkles,
  Radio
} from 'lucide-react';

export const MessageInput = () => {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { sendMessage, currentTrack, activePod } = useApp();

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const shareTrack = () => {
    if (currentTrack) {
      sendMessage(`🎧 Now Listening Together in ${activePod.name}: "${currentTrack.title}" by ${currentTrack.artist}! Join the vibe!`);
    }
  };

  const addEmoji = (emoji) => {
    setInputText((prev) => prev + emoji);
  };

  const EMOJI_LIST = ['🔥', '🎵', '💜', '⚡', '🚀', '🎧', '✨', '🙌', '😎', '🎹', '☕', '🎉'];

  return (
    <div style={{
      padding: '16px 24px',
      borderTop: '1px solid var(--border-subtle)',
      background: 'rgba(14, 17, 27, 0.95)',
      position: 'relative'
    }}>
      {/* Emoji Picker Popup */}
      {showEmojiPicker && (
        <div className="glass-card" style={{
          position: 'absolute',
          bottom: '80px',
          left: '24px',
          padding: '12px',
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '8px',
          zIndex: 50,
          boxShadow: 'var(--shadow-main)'
        }}>
          {EMOJI_LIST.map((emoji) => (
            <button
              key={emoji}
              onClick={() => addEmoji(emoji)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '1.4rem',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '6px',
                transition: 'transform 0.1s'
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSend} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="glass-card" style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 16px',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(25, 30, 48, 0.7)',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            type="button"
            className="btn-icon"
            style={{ width: '32px', height: '32px', border: 'none', background: 'transparent' }}
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            <Smile size={20} color="var(--accent-purple)" />
          </button>

          <input
            type="text"
            placeholder="Type a message or vibe with the group..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.92rem',
              fontFamily: 'var(--font-family-sans)'
            }}
          />

          <button
            type="button"
            className="btn-icon"
            title="Share Active Music Track into Chat"
            style={{ width: '32px', height: '32px', border: 'none', background: 'transparent' }}
            onClick={shareTrack}
          >
            <Music size={18} color="var(--accent-cyan)" />
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{
            height: '46px',
            padding: '0 20px',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <Send size={18} />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
