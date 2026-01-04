export enum MessageType {
  TEXT = 'TEXT',
  SYSTEM = 'SYSTEM',
  IMAGE = 'IMAGE'
}

export interface User {
  id: string;
  username: string;
  avatar: string; // Emoji
  isOnline: boolean;
  isInVoice: boolean;
  isVideoOn: boolean;
  isMuted: boolean;
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: MessageType;
  timestamp: number;
}

export interface Room {
  id: string;
  name: string; // The display name (can be same as ID)
  isPrivate: boolean;
  password?: string; // Stored in mock server, not sent to client usually, but here for simulation
  createdAt: number;
}

export enum ConnectionStatus {
  DISCONNECTED = '已断开',
  CONNECTING = '连接中...',
  CONNECTED = '已连接',
  ENCRYPTED = '加密通讯中'
}

export enum MediaState {
  IDLE = 'IDLE',
  VOICE = 'VOICE',
  VIDEO = 'VIDEO'
}