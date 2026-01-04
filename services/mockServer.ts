import { Room, Message, MessageType, User } from '../types';

// API 基础路径
const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : '/api';

// Storage Keys
const USERS_KEY = 'wl_users';

// Helpers
const getStorage = <T>(key: string, defaultVal: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const setStorage = (key: string, val: any) => {
  localStorage.setItem(key, JSON.stringify(val));
};

// --- User Logic ---
export const getOrCreateCurrentUser = (): User => {
  let user = getStorage<User | null>(USERS_KEY, null);
  if (!user) {
    user = {
      id: crypto.randomUUID(),
      username: `User-${Math.floor(Math.random() * 1000)}`,
      avatar: ['🦊', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸'][Math.floor(Math.random() * 8)],
      isOnline: true,
      isInVoice: false,
      isVideoOn: false,
      isMuted: false,
    };
    setStorage(USERS_KEY, user);
  }
  return user;
};

// --- Room Logic ---

// Check if room exists without returning sensitive data
export const doesRoomExist = (roomId: string): boolean => {
    const rooms = getStorage<Room[]>(ROOMS_KEY, []);
    return rooms.some(r => r.id === roomId);
};

export const getRoom = (roomId: string): Room | null => {
  const rooms = getStorage<Room[]>(ROOMS_KEY, []);
  return rooms.find(r => r.id === roomId) || null;
};

// Specifically for "Create" mode
export const createNewRoom = (roomId: string, isPrivate: boolean, password?: string): { success: boolean, room?: Room, error?: string } => {
  const rooms = getStorage<Room[]>(ROOMS_KEY, []);
  if (rooms.some(r => r.id === roomId)) {
      return { success: false, error: '该房间 ID 已被占用，请更换或直接加入。' };
  }

  const newRoom: Room = {
    id: roomId,
    name: roomId,
    isPrivate,
    password, // In a real app, this should be hashed!
    createdAt: Date.now()
  };
  
  rooms.push(newRoom);
  setStorage(ROOMS_KEY, rooms);
  
  // Add initial system message
  addMessage(roomId, {
    id: crypto.randomUUID(),
    roomId,
    senderId: 'system',
    senderName: 'System',
    senderAvatar: '🛡️',
    content: `房间 "${roomId}" 已创建。${isPrivate ? '此房间已加密保护。' : '当前为公开房间。'}`,
    type: MessageType.SYSTEM,
    timestamp: Date.now()
  });

  return { success: true, room: newRoom };
};

// Specifically for "Join" mode
export const joinExistingRoom = (roomId: string, inputPass?: string): { success: boolean, room?: Room, error?: string } => {
    const room = getRoom(roomId);
    
    if (!room) {
        return { success: false, error: '房间不存在，请检查 ID 或切换到“创建房间”。' };
    }

    if (room.isPrivate) {
        if (!inputPass) {
            return { success: false, error: '此房间是私密的，请输入访问密码。' };
        }
        if (room.password !== inputPass) {
            return { success: false, error: '访问密码错误。' };
        }
    }

    return { success: true, room };
};

export const verifyRoomPassword = (roomId: string, inputPass: string): boolean => {
  const room = getRoom(roomId);
  if (!room) return false;
  if (!room.isPrivate) return true;
  return room.password === inputPass;
};

// --- Message Logic ---
export const getMessages = (roomId: string): Message[] => {
  const allMessages = getStorage<Message[]>(MESSAGES_KEY, []);
  return allMessages.filter(m => m.roomId === roomId).sort((a, b) => a.timestamp - b.timestamp);
};

export const addMessage = (roomId: string, message: Message) => {
  const allMessages = getStorage<Message[]>(MESSAGES_KEY, []);
  allMessages.push(message);
  setStorage(MESSAGES_KEY, allMessages);
};

export const clearRoomHistory = (roomId: string) => {
    let allMessages = getStorage<Message[]>(MESSAGES_KEY, []);
    allMessages = allMessages.filter(m => m.roomId !== roomId);
    setStorage(MESSAGES_KEY, allMessages);
    
    addMessage(roomId, {
        id: crypto.randomUUID(),
        roomId,
        senderId: 'system',
        senderName: 'System',
        senderAvatar: '🧹',
        content: `聊天记录已被清除。`,
        type: MessageType.SYSTEM,
        timestamp: Date.now()
      });
};