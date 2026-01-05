import { Room, Message, MessageType, User } from '../types';

// API 基础路径
const API_BASE = '/api';

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
      isVideoOn: false,
      isMuted: false,
    };
    setStorage(USERS_KEY, user);
  }
  return user;
};

// --- Room Logic ---

// 从服务器获取或创建房间
export const getOrJoinRoom = async (roomId: string): Promise<{ room: Room, messages: Message[] }> => {
  const user = getOrCreateCurrentUser();
  
  try {
    // 先获取房间数据
    const getRoomResponse = await fetch(`${API_BASE}/rooms?roomId=${encodeURIComponent(roomId)}`);
    const roomData = await getRoomResponse.json();
    
    // 加入房间
    await fetch(`${API_BASE}/rooms?roomId=${encodeURIComponent(roomId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'join',
        userId: user.id,
        userName: user.username,
        userAvatar: user.avatar
      })
    });
    
    // 转换消息格式
    const messages = (roomData.messages || []).map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp).getTime()
    }));
    
    return {
      room: roomData.room,
      messages
    };
  } catch (error) {
    console.error('获取房间失败:', error);
    throw error;
  }
};

// 兼容旧接口
export const doesRoomExist = (roomId: string): boolean => {
  return true; // 服务端会自动创建房间
};

export const getRoom = async (roomId: string): Promise<Room | null> => {
  try {
    const response = await fetch(`${API_BASE}/rooms?roomId=${encodeURIComponent(roomId)}`);
    const data = await response.json();
    return data.room;
  } catch {
    return null;
  }
};

export const createNewRoom = async (roomId: string, isPrivate: boolean, password?: string): Promise<{ success: boolean, room?: Room, error?: string }> => {
  try {
    const user = getOrCreateCurrentUser();
    const response = await fetch(`${API_BASE}/rooms?roomId=${encodeURIComponent(roomId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create',
        userId: user.id,
        userName: user.username,
        userAvatar: user.avatar
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.message || '创建房间失败' };
    }
    
    return { success: true, room: data.room };
  } catch (error) {
    return { success: false, error: '网络错误，创建房间失败' };
  }
};

export const joinExistingRoom = async (roomId: string, inputPass?: string): Promise<{ success: boolean, room?: Room, error?: string }> => {
  try {
    const user = getOrCreateCurrentUser();
    const response = await fetch(`${API_BASE}/rooms?roomId=${encodeURIComponent(roomId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'join',
        userId: user.id,
        userName: user.username,
        userAvatar: user.avatar
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.message || '加入房间失败' };
    }
    
    return { success: true, room: data.room };
  } catch (error) {
    return { success: false, error: '网络错误，加入房间失败' };
  }
};

export const verifyRoomPassword = (roomId: string, inputPass: string): boolean => {
  return true; // 暂时禁用密码功能
};

// --- Message Logic ---
let messageCache = new Map<string, Message[]>();
let lastFetchTime = new Map<string, number>();

export const getMessages = async (roomId: string, forceRefresh = false): Promise<Message[]> => {
  const now = Date.now();
  const lastFetch = lastFetchTime.get(roomId) || 0;
  
  // 如果不是强制刷新且距离上次获取不到2秒，返回缓存
  if (!forceRefresh && now - lastFetch < 2000 && messageCache.has(roomId)) {
    return messageCache.get(roomId)!;
  }
  
  try {
    const response = await fetch(`${API_BASE}/rooms?roomId=${encodeURIComponent(roomId)}`);
    const data = await response.json();
    const messages = (data.messages || []).map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp).getTime()
    }));
    
    messageCache.set(roomId, messages);
    lastFetchTime.set(roomId, now);
    
    return messages;
  } catch (error) {
    console.error('获取消息失败:', error);
    return messageCache.get(roomId) || [];
  }
};

export const addMessage = async (roomId: string, message: Message): Promise<void> => {
  try {
    await fetch(`${API_BASE}/rooms?roomId=${encodeURIComponent(roomId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'message',
        ...message
      })
    });
    
    // 立即刷新消息列表
    await getMessages(roomId, true);
  } catch (error) {
    console.error('发送消息失败:', error);
  }
};

export const clearRoomHistory = async (roomId: string): Promise<void> => {
  try {
    await fetch(`${API_BASE}/rooms?roomId=${encodeURIComponent(roomId)}`, {
      method: 'DELETE'
    });
    
    // 清空本地缓存
    messageCache.delete(roomId);
    lastFetchTime.delete(roomId);
  } catch (error) {
    console.error('清空历史失败:', error);
  }
};
