import React, { createContext, useContext, ReactNode } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import io, { Socket } from 'socket.io-client';

interface Participant {
  id: string;
  name: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  isAudioMuted: boolean;
  isVideoOff: boolean;
  isHandRaised: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system';
}

interface LiveClassState {
  // Connection state
  socket: Socket | null;
  isConnected: boolean;
  
  // Class state
  currentClass: any | null;
  isInClass: boolean;
  isTeacher: boolean;
  
  // Media state
  isAudioMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
  
  // Participants
  participants: Participant[];
  
  // Chat
  messages: ChatMessage[];
  
  // Actions
  connectToClass: (classId: string, userId: string, userRole: string) => void;
  leaveClass: () => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  sendMessage: (message: string) => void;
  raiseHand: () => void;
  updateParticipant: (participantId: string, updates: Partial<Participant>) => void;
}

export const useLiveClassStore = create<LiveClassState>((set, get) => ({
  // Initial state
  socket: null,
  isConnected: false,
  currentClass: null,
  isInClass: false,
  isTeacher: false,
  isAudioMuted: true,
  isVideoOff: true,
  isScreenSharing: false,
  isRecording: false,
  participants: [],
  messages: [],

  // Actions
  connectToClass: (classId: string, userId: string, userRole: string) => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    
    socket.on('connect', () => {
      set({ isConnected: true, socket });
      socket.emit('join-class', { classId, userId, userRole });
    });

    socket.on('participant-joined', (participant: Participant) => {
      set(state => ({
        participants: [...state.participants, participant]
      }));
    });

    socket.on('participant-left', (participantId: string) => {
      set(state => ({
        participants: state.participants.filter(p => p.id !== participantId)
      }));
    });

    socket.on('chat-message', (message: ChatMessage) => {
      set(state => ({
        messages: [...state.messages, message]
      }));
    });

    socket.on('participant-updated', (participantId: string, updates: Partial<Participant>) => {
      set(state => ({
        participants: state.participants.map(p => 
          p.id === participantId ? { ...p, ...updates } : p
        )
      }));
    });

    set({ 
      isInClass: true, 
      isTeacher: userRole === 'TEACHER' || userRole === 'ADMIN',
      currentClass: { id: classId }
    });
  },

  leaveClass: () => {
    const { socket } = get();
    if (socket) {
      socket.emit('leave-class');
      socket.disconnect();
    }
    set({
      socket: null,
      isConnected: false,
      isInClass: false,
      currentClass: null,
      participants: [],
      messages: [],
      isAudioMuted: true,
      isVideoOff: true,
      isScreenSharing: false,
      isRecording: false
    });
  },

  toggleAudio: () => {
    const { socket, isAudioMuted } = get();
    const newState = !isAudioMuted;
    set({ isAudioMuted: newState });
    
    if (socket) {
      socket.emit('toggle-audio', { muted: newState });
    }
  },

  toggleVideo: () => {
    const { socket, isVideoOff } = get();
    const newState = !isVideoOff;
    set({ isVideoOff: newState });
    
    if (socket) {
      socket.emit('toggle-video', { off: newState });
    }
  },

  toggleScreenShare: () => {
    const { socket, isScreenSharing } = get();
    const newState = !isScreenSharing;
    set({ isScreenSharing: newState });
    
    if (socket) {
      socket.emit('toggle-screen-share', { sharing: newState });
    }
  },

  startRecording: () => {
    const { socket } = get();
    set({ isRecording: true });
    
    if (socket) {
      socket.emit('start-recording');
    }
  },

  stopRecording: () => {
    const { socket } = get();
    set({ isRecording: false });
    
    if (socket) {
      socket.emit('stop-recording');
    }
  },

  sendMessage: (message: string) => {
    const { socket } = get();
    if (socket && message.trim()) {
      const chatMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'current-user', // This would be actual user ID
        senderName: 'Current User', // This would be actual user name
        message: message.trim(),
        timestamp: new Date(),
        type: 'text'
      };
      
      socket.emit('chat-message', chatMessage);
    }
  },

  raiseHand: () => {
    const { socket } = get();
    if (socket) {
      socket.emit('raise-hand');
    }
  },

  updateParticipant: (participantId: string, updates: Partial<Participant>) => {
    set(state => ({
      participants: state.participants.map(p => 
        p.id === participantId ? { ...p, ...updates } : p
      )
    }));
  }
}));

// React Context for live classes
const LiveClassContext = createContext<LiveClassState | null>(null);

export const LiveClassProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const liveClassState = useLiveClassStore();

  return (
    <LiveClassContext.Provider value={liveClassState}>
      {children}
    </LiveClassContext.Provider>
  );
};

export const useLiveClass = () => {
  const context = useContext(LiveClassContext);
  if (!context) {
    return useLiveClassStore();
  }
  return context;
};