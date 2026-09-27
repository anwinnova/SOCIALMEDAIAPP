import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/GroupChat/ChatArea';
import { MessageInput } from './components/GroupChat/MessageInput';
import { VideoGrid } from './components/MediaCalls/VideoGrid';
import { MusicPlayerBar } from './components/MusicEngine/MusicPlayerBar';
import { AudioVisualizerModal } from './components/MusicEngine/AudioVisualizerModal';
import { PodManagerModal } from './components/MusicEngine/PodManagerModal';

const AppContent = () => {
  const { isCallActive, showVisualizer, setShowVisualizer } = useApp();
  const [showPodModal, setShowPodModal] = useState(false);

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Workspace Layout */}
      <div className="app-main">
        {/* Left Sidebar */}
        <Sidebar onOpenPodModal={() => setShowPodModal(true)} />

        {/* Center Workspace: Chat & Call Split Screen */}
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          background: 'rgba(10, 12, 18, 0.6)'
        }}>
          {/* Active HD Audio / Video Call Suite Panel */}
          {isCallActive && (
            <div style={{ height: '48%', borderBottom: '1px solid var(--border-subtle)', position: 'relative' }}>
              <VideoGrid />
            </div>
          )}

          {/* Group Chat Section */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <ChatArea />
            <MessageInput />
          </div>
        </main>
      </div>

      {/* Sticky Synchronized Music Player Bar */}
      <MusicPlayerBar onOpenPodModal={() => setShowPodModal(true)} />

      {/* Audio Spectrum Visualizer Full-screen Modal */}
      {showVisualizer && (
        <AudioVisualizerModal onClose={() => setShowVisualizer(false)} />
      )}

      {/* Pod Manager Modal */}
      {showPodModal && (
        <PodManagerModal onClose={() => setShowPodModal(false)} />
      )}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
