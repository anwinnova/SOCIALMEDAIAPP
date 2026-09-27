import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  CURRENT_USER,
  MOCK_USERS,
  MOCK_CHANNELS,
  INITIAL_TRACKS,
  INITIAL_PODS,
  INITIAL_MESSAGES
} from '../utils/mockData';
import { audioEngine } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Navigation & Channels
  const [activeChannelId, setActiveChannelId] = useState('chan_lounge');
  const [channels, setChannels] = useState(MOCK_CHANNELS);
  const [users, setUsers] = useState(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState(CURRENT_USER);

  // Chat Messages
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [typingUser, setTypingUser] = useState(null);

  // Audio / Video Call Suite
  const [isCallActive, setIsCallActive] = useState(false);
  const [callParticipants, setCallParticipants] = useState(['user_self', 'user_aria', 'user_devon']);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeSpeakerId, setActiveSpeakerId] = useState('user_aria');
  const [callLayout, setCallLayout] = useState('grid'); // 'grid' | 'focus'

  // Music Engine & Pods
  const [tracks, setTracks] = useState(INITIAL_TRACKS);
  const [pods, setPods] = useState(INITIAL_PODS);
  const [activePodId, setActivePodId] = useState('pod_main');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(184);
  const [volume, setVolume] = useState(0.7);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);

  const activePod = pods.find(p => p.id === activePodId) || pods[0];
  const currentTrack = tracks.find(t => t.id === activePod?.trackId) || tracks[0];

  // Sync Audio Engine state changes
  useEffect(() => {
    audioEngine.setVolume(volume);
  }, [volume]);

  // Track playback time update interval
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentTrack.duration) {
            // Loop track or play next
            audioEngine.stop();
            audioEngine.playSyntheticTrack(currentTrack);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  // Active Speaker Simulation in Calls
  useEffect(() => {
    if (!isCallActive) return;
    const speakerInterval = setInterval(() => {
      const candidates = callParticipants.filter(id => id !== activeSpeakerId);
      if (candidates.length > 0) {
        const nextSpeaker = candidates[Math.floor(Math.random() * candidates.length)];
        setActiveSpeakerId(nextSpeaker);
      }
    }, 4000);
    return () => clearInterval(speakerInterval);
  }, [isCallActive, callParticipants, activeSpeakerId]);

  // Chat Actions
  const sendMessage = (text, attachments = []) => {
    if (!text.trim() && attachments.length === 0) return;
    const newMsg = {
      id: `msg_${Date.now()}`,
      channelId: activeChannelId,
      userId: currentUser.id,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments,
      reactions: {},
    };
    setMessages((prev) => [...prev, newMsg]);

    // Simulate bot response after 2.5s
    setTimeout(() => {
      triggerBotReply(text);
    }, 2500);
  };

  const addReaction = (messageId, emoji) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const currentList = msg.reactions?.[emoji] || [];
          const hasReacted = currentList.includes(currentUser.id);
          const updated = hasReacted
            ? currentList.filter((id) => id !== currentUser.id)
            : [...currentList, currentUser.id];
          
          if (!hasReacted) {
            confetti({
              particleCount: 30,
              spread: 60,
              origin: { y: 0.7 }
            });
          }

          return {
            ...msg,
            reactions: {
              ...msg.reactions,
              [emoji]: updated
            }
          };
        }
        return msg;
      })
    );
  };

  const triggerBotReply = (userText) => {
    const bots = ['user_aria', 'user_elena', 'user_devon', 'user_kaelen'];
    const randomBotId = bots[Math.floor(Math.random() * bots.length)];
    const bot = users.find(u => u.id === randomBotId);

    setTypingUser(bot?.name || 'Aria Chen');

    setTimeout(() => {
      setTypingUser(null);
      const responses = [
        `That sounds awesome! I am loving the current music sync vibe! 🎵`,
        `Totally agree with you! Should we start another listening pod or jump on video call? 🚀`,
        `This song slaps so hard on HarmoniSync! 🎧✨`,
        `Checking out the audio spectrum visualizer right now, it looks incredible! 🔥`,
      ];
      const botMsg = {
        id: `msg_${Date.now()}`,
        channelId: activeChannelId,
        userId: randomBotId,
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactions: {},
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1500);
  };

  // Music Sync Actions
  const playTrack = (track, podId = activePodId) => {
    audioEngine.playSyntheticTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(track.duration || 180);

    // Update pod's track
    setPods((prev) =>
      prev.map((pod) =>
        pod.id === podId ? { ...pod, trackId: track.id } : pod
      )
    );

    // Broadcast system chat notification
    const trackMsg = {
      id: `msg_sync_${Date.now()}`,
      channelId: activeChannelId,
      userId: currentUser.id,
      text: `🎵 Changed music track to "${track.title}" by ${track.artist} in ${activePod.name}!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSyncAlert: true,
      reactions: { '🎧': ['user_aria', 'user_elena'] }
    };
    setMessages((prev) => [...prev, trackMsg]);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.resume();
      setIsPlaying(true);
    }
  };

  const seekTo = (seconds) => {
    setCurrentTime(seconds);
  };

  // Split into a Private Listening Pod (e.g. 2 members listening alone)
  const createPrivatePod = (podName, trackId, selectedUserIds) => {
    const newPodId = `pod_custom_${Date.now()}`;
    const allMembers = Array.from(new Set([...selectedUserIds, currentUser.id]));
    const newPod = {
      id: newPodId,
      name: podName || `Private Listening Pod (${allMembers.length} Members)`,
      trackId,
      isMainGroup: false,
      members: allMembers,
      isSynced: true,
    };

    setPods((prev) => [...prev, newPod]);
    setActivePodId(newPodId);

    // Update member pod associations
    setUsers((prev) =>
      prev.map((u) =>
        allMembers.includes(u.id) ? { ...u, currentPod: newPodId } : u
      )
    );

    const targetTrack = tracks.find((t) => t.id === trackId) || tracks[0];
    playTrack(targetTrack, newPodId);

    // Send group chat notification
    const alertMsg = {
      id: `msg_pod_${Date.now()}`,
      channelId: activeChannelId,
      userId: currentUser.id,
      text: `⚡ Created Private Breakout Pod "${newPod.name}"! ${allMembers.length} members are now listening alone to "${targetTrack.title}".`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSyncAlert: true,
      reactions: { '⚡': ['user_kaelen', 'user_zoe'] }
    };
    setMessages((prev) => [...prev, alertMsg]);
  };

  const joinPod = (podId) => {
    setActivePodId(podId);
    setPods((prev) =>
      prev.map((pod) => {
        if (pod.id === podId) {
          return {
            ...pod,
            members: Array.from(new Set([...pod.members, currentUser.id])),
          };
        } else {
          return {
            ...pod,
            members: pod.members.filter((id) => id !== currentUser.id),
          };
        }
      })
    );

    const targetPod = pods.find((p) => p.id === podId);
    if (targetPod) {
      const targetTrack = tracks.find((t) => t.id === targetPod.trackId) || tracks[0];
      playTrack(targetTrack, podId);
    }
  };

  const rejoinMainSync = () => {
    joinPod('pod_main');
  };

  const uploadCustomTrack = (file) => {
    const url = URL.createObjectURL(file);
    const newTrack = {
      id: `track_upload_${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: 'Uploaded by You',
      duration: 200,
      genre: 'custom',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
      url,
      lyrics: [{ time: 5, text: 'Custom uploaded audio track playing...' }]
    };

    setTracks((prev) => [newTrack, ...prev]);
    playTrack(newTrack, activePodId);
  };

  // Call Actions
  const startCall = () => {
    setIsCallActive(true);
    if (!callParticipants.includes(currentUser.id)) {
      setCallParticipants((prev) => [...prev, currentUser.id]);
    }
  };

  const leaveCall = () => {
    setIsCallActive(false);
  };

  const toggleMic = () => setIsMicMuted((prev) => !prev);
  const toggleVideo = () => setIsVideoOff((prev) => !prev);
  const toggleScreenShare = () => setIsScreenSharing((prev) => !prev);

  return (
    <AppContext.Provider
      value={{
        // Navigation & Channels
        activeChannelId,
        setActiveChannelId,
        channels,
        users,
        currentUser,
        setCurrentUser,

        // Messages & Typing
        messages,
        sendMessage,
        addReaction,
        typingUser,

        // Calls
        isCallActive,
        startCall,
        leaveCall,
        callParticipants,
        isMicMuted,
        isVideoOff,
        isScreenSharing,
        toggleMic,
        toggleVideo,
        toggleScreenShare,
        activeSpeakerId,
        callLayout,
        setCallLayout,

        // Music & Pods
        tracks,
        pods,
        activePodId,
        activePod,
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        setVolume,
        playTrack,
        togglePlayPause,
        seekTo,
        createPrivatePod,
        joinPod,
        rejoinMainSync,
        uploadCustomTrack,
        showLyrics,
        setShowLyrics,
        showVisualizer,
        setShowVisualizer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
