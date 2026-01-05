// 简单的内存存储（Vercel 函数会在一段时间内保持热启动）
const rooms = new Map();
const messages = new Map();

// 清理超过 24 小时的房间
const ROOM_EXPIRY = 24 * 60 * 60 * 1000;

function cleanupOldRooms() {
  const now = Date.now();
  for (const [roomId, room] of rooms.entries()) {
    if (now - room.createdAt > ROOM_EXPIRY) {
      rooms.delete(roomId);
      messages.delete(roomId);
    }
  }
}

export default function handler(req, res) {
  // CORS 设置
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  cleanupOldRooms();

  const { method, query, body } = req;
  const { roomId } = query;

  // GET /api/rooms?roomId=xxx - 获取房间信息
  if (method === 'GET' && roomId) {
    const room = rooms.get(roomId);
    if (!room) {
      // 房间不存在，不自动创建
      return res.status(404).json({
        error: 'Room not found',
        message: '房间不存在'
      });
    }
    
    // 转换用户数据为完整的 User 对象
    const formattedUsers = room.users.map(u => ({
      id: u.id,
      username: u.name,
      avatar: u.avatar,
      isOnline: true,
      isInVoice: u.isInVoice || false,
      isVideoOn: u.isVideoOn || false,
      isMuted: u.isMuted || false
    }));
    
    return res.status(200).json({
      room: {
        ...room,
        users: formattedUsers
      },
      messages: messages.get(roomId) || []
    });
  }

  // POST /api/rooms?roomId=xxx&action=create - 创建房间
  if (method === 'POST' && roomId && body.action === 'create') {
    // 检查房间是否已存在
    if (rooms.has(roomId)) {
      return res.status(409).json({
        error: 'Room already exists',
        message: '房间已存在，请直接加入或更换房间ID'
      });
    }

    const room = {
      id: roomId,
      name: roomId,
      users: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    rooms.set(roomId, room);
    messages.set(roomId, []);

    const { userId, userName, userAvatar } = body;
    
    room.users.push({
      id: userId,
      name: userName,
      avatar: userAvatar,
      joinedAt: Date.now(),
      isInVoice: false,
      isVideoOn: false,
      isMuted: false
    });
    room.updatedAt = Date.now();

    return res.status(200).json({ room });
  }

  // POST /api/rooms?roomId=xxx&action=join - 加入房间
  if (method === 'POST' && roomId && body.action === 'join') {
    const room = rooms.get(roomId);
    if (!room) {
      return res.status(404).json({
        error: 'Room not found',
        message: '房间不存在，请先创建房间'
      });
    }

    const { userId, userName, userAvatar } = body;
    
    // 检查用户是否已在房间中
    const existingUser = room.users.find(u => u.id === userId);
    if (!existingUser) {
      room.users.push({
        id: userId,
        name: userName,
        avatar: userAvatar,
        joinedAt: Date.now(),
        isInVoice: false,
        isVideoOn: false,
        isMuted: false
      });
      room.updatedAt = Date.now();
    }

    return res.status(200).json({ room });
  }
  
  // POST /api/rooms - 更新媒体状态
  if (method === 'POST' && body.action === 'updateMedia') {
    const room = rooms.get(body.roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    const user = room.users.find(u => u.id === body.userId);
    if (user) {
      user.isInVoice = body.mediaState === 'VOICE' || body.mediaState === 'VIDEO';
      user.isVideoOn = body.mediaState === 'VIDEO';
      user.isMuted = body.isMuted;
      room.updatedAt = Date.now();
    }
    
    return res.status(200).json({ success: true });
  }

  // POST /api/rooms?roomId=xxx - 发送消息
  if (method === 'POST' && roomId && body.action === 'message') {
    const roomMessages = messages.get(roomId) || [];
    const newMessage = {
      id: body.id || `msg-${Date.now()}-${Math.random()}`,
      roomId,
      senderId: body.senderId,
      senderName: body.senderName,
      senderAvatar: body.senderAvatar,
      content: body.content,
      type: body.type || 'TEXT',
      timestamp: new Date().toISOString()
    };
    
    roomMessages.push(newMessage);
    
    // 只保留最近 100 条消息
    if (roomMessages.length > 100) {
      roomMessages.splice(0, roomMessages.length - 100);
    }
    
    messages.set(roomId, roomMessages);
    
    const room = rooms.get(roomId);
    if (room) {
      room.updatedAt = Date.now();
    }

    return res.status(200).json({ message: newMessage });
  }

  // DELETE /api/rooms?roomId=xxx - 清空房间消息
  if (method === 'DELETE' && roomId) {
    messages.set(roomId, []);
    const room = rooms.get(roomId);
    if (room) {
      room.updatedAt = Date.now();
    }
    return res.status(200).json({ success: true });
  }

  return res.status(404).json({ error: 'Not found' });
}
