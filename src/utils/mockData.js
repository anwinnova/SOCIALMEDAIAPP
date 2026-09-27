// Initial Mock Data for HarmoniSync Social & Music Platform

export const CURRENT_USER = {
  id: 'user_self',
  name: 'Alex Rivera (You)',
  tag: '@alex_sync',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  status: 'online',
  customStatus: 'Coding & Vibing 🎧',
  isHost: true,
};

export const MOCK_USERS = [
  CURRENT_USER,
  {
    id: 'user_aria',
    name: 'Aria Chen',
    tag: '@ariachen',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    status: 'online',
    customStatus: 'Listening to Lofi 🌙',
    currentPod: 'pod_main',
  },
  {
    id: 'user_kaelen',
    name: 'Kaelen Vance',
    tag: '@kaelen_v',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    status: 'online',
    customStatus: 'In Synthwave Pod ⚡',
    currentPod: 'pod_synth',
  },
  {
    id: 'user_zoe',
    name: 'Zoe Miller',
    tag: '@zoe_m',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    status: 'online',
    customStatus: 'In Synthwave Pod ⚡',
    currentPod: 'pod_synth',
  },
  {
    id: 'user_devon',
    name: 'Devon Brooks',
    tag: '@devon_b',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    status: 'idle',
    customStatus: 'Working on Beats 🎹',
    currentPod: 'pod_main',
  },
  {
    id: 'user_elena',
    name: 'Elena Rostova',
    tag: '@elena_r',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    status: 'online',
    customStatus: 'Main Lounge DJ 🎧',
    currentPod: 'pod_main',
  },
];

export const MOCK_CHANNELS = [
  {
    id: 'chan_lounge',
    name: 'main-cyber-lounge',
    description: 'The core hub for group chat, live calls & group sync music.',
    icon: 'MessageSquare',
    unreadCount: 0,
    isVoiceActive: true,
    activeCallCount: 3,
  },
  {
    id: 'chan_synthwave',
    name: 'synthwave-retro',
    description: '80s arcade vibes, dark synthwave and neon beats.',
    icon: 'Zap',
    unreadCount: 2,
    isVoiceActive: false,
    activeCallCount: 0,
  },
  {
    id: 'chan_lofi',
    name: 'lofi-study-room',
    description: 'Relaxing lofi hip-hop for deep focus & chill chatter.',
    icon: 'Coffee',
    unreadCount: 0,
    isVoiceActive: false,
    activeCallCount: 0,
  },
  {
    id: 'chan_gaming',
    name: 'gaming-beats',
    description: 'High energy gaming soundtracks and party voice chat.',
    icon: 'Gamepad2',
    unreadCount: 5,
    isVoiceActive: false,
    activeCallCount: 0,
  },
];

export const INITIAL_TRACKS = [
  {
    id: 'track_midnight_lofi',
    title: 'Midnight Lofi Chill',
    artist: 'Aria & The Neon Dreamers',
    duration: 184,
    genre: 'lofi',
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=400&q=80',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    lyrics: [
      { time: 5, text: 'Neon lights reflect on rain-slicked glass...' },
      { time: 15, text: 'Coffee steams, seconds softly pass.' },
      { time: 28, text: 'We tune into the frequency tonight...' },
      { time: 42, text: '5 voices synced in neon purple light.' },
      { time: 60, text: 'Drifting away... drifting away...' },
    ]
  },
  {
    id: 'track_cyber_drive',
    title: 'Cyberpunk Highway 2088',
    artist: 'Kaelen Vance & SynthCorp',
    duration: 210,
    genre: 'synthwave',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73155.mp3?filename=synthwave-80s-110045.mp3',
    lyrics: [
      { time: 8, text: 'Cruising through grid line zero...' },
      { time: 20, text: 'Analog synthesizer roaring low.' },
      { time: 35, text: 'Private pod active, two minds aligned.' },
      { time: 50, text: 'Leaving the digital noise behind.' },
    ]
  },
  {
    id: 'track_starlight_ambient',
    title: 'Starlight Orbit (Ambient Chill)',
    artist: 'Elena Rostova',
    duration: 195,
    genre: 'chill',
    cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f76d4d.mp3?filename=ambient-space-122976.mp3',
    lyrics: [
      { time: 10, text: 'Zero gravity, floating in the dark...' },
      { time: 25, text: 'Every constellation leaves a spark.' },
      { time: 45, text: 'HarmoniSync floating in space...' },
    ]
  },
  {
    id: 'track_coffee_breeze',
    title: 'Rainy Afternoon Coffee',
    artist: 'Devon Brooks Trio',
    duration: 165,
    genre: 'lofi',
    cover: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
    url: '',
    lyrics: [
      { time: 5, text: 'Soft piano chords gently chime.' },
      { time: 18, text: 'Lost in conversation and time.' },
    ]
  }
];

export const INITIAL_PODS = [
  {
    id: 'pod_main',
    name: 'Main Lounge Broadcast (5 Members)',
    trackId: 'track_midnight_lofi',
    isMainGroup: true,
    members: ['user_self', 'user_aria', 'user_devon', 'user_elena'],
    isSynced: true,
  },
  {
    id: 'pod_synth',
    name: 'Private Breakout Pod ⚡ (2 Members)',
    trackId: 'track_cyber_drive',
    isMainGroup: false,
    members: ['user_kaelen', 'user_zoe'],
    isSynced: true,
  }
];

export const INITIAL_MESSAGES = [
  {
    id: 'msg_1',
    channelId: 'chan_lounge',
    userId: 'user_aria',
    text: 'Hey everyone! Welcome to HarmoniSync! 🚀 Did you hear the new Lofi track on the Main Lounge broadcast?',
    timestamp: '12:42 PM',
    reactions: { '🔥': ['user_self', 'user_kaelen'], '🎵': ['user_devon'] }
  },
  {
    id: 'msg_2',
    channelId: 'chan_lounge',
    userId: 'user_elena',
    text: 'I just queued "Midnight Lofi Chill" for the main group broadcast! All 5 of us in the lounge are synced right now! 🎧',
    timestamp: '12:43 PM',
    reactions: { '💜': ['user_self', 'user_aria'] },
    isSyncAlert: true,
  },
  {
    id: 'msg_3',
    channelId: 'chan_lounge',
    userId: 'user_kaelen',
    text: 'Awesome! Zoe and I are splitting into Private Pod #1 to listen to Cyberpunk Highway 2088 alone for a bit! We are still here in chat though! ⚡',
    timestamp: '12:45 PM',
    reactions: { '🙌': ['user_self'] }
  },
  {
    id: 'msg_4',
    channelId: 'chan_lounge',
    userId: 'user_devon',
    text: 'Voice call is live too! Join whenever you guys want to test out video screen share.',
    timestamp: '12:46 PM',
    reactions: { '🎥': ['user_aria', 'user_elena'] }
  }
];
