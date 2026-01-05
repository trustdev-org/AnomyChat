import React, { useState, useEffect, useRef } from 'react';
import { Room as RoomType, User, Message, MessageType, MediaState } from '../types';
import { getMessages, addMessage, clearRoomHistory, getRoom } from '../services/apiServer';
import { 
  Mic, MicOff, Video, PhoneOff, 
  Users, Hash, Menu, X, Send, Trash2, Shield, Signal, MonitorUp,
  LogOut, Copy, Check, Circle
} from 'lucide-react';

const Avatar = ({ char, size = 'md' }: { char: string, size?: 'sm'|'md'|'lg'|'xl' }) => {
  const sizeClass = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-10 h-10 text-lg',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-full h-full text-4xl'
  }[size];
  return (
    <div className={`${sizeClass} rounded-full bg-indigo-500 flex items-center justify-center text-white select-none shadow-sm`}>
      {char}
    </div>
  );
};

const VideoTile = ({ user, isSelf }: { user: User, isSelf?: boolean }) => {
    return (
        <div className="relative bg-discord-darker rounded-lg overflow-hidden aspect-video border border-discord-light flex items-center justify-center group">
            <div className="absolute inset-0 flex items-center justify-center">
                <Avatar char={user.avatar} size="lg" />
            </div>
            <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                {user.isMuted ? <MicOff size={12} className="text-red-400"/> : <Mic size={12} className="text-green-400"/>}
                <span>{user.username} {isSelf && '(我)'}</span>
            </div>
            {isSelf && (
                 <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white">
                    HD 30ms
                </div>
            )}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-discord-light transition-colors pointer-events-none rounded-lg"></div>
        </div>
    )
}

interface RoomProps {
  user: User;
  room: RoomType;
  onLeave: () => void;
}

const Room: React.FC<RoomProps> = ({ user, room, onLeave }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [mediaState, setMediaState] = useState<MediaState>(MediaState.IDLE);
  const [micOn, setMicOn] = useState(false);
  const [copied, setCopied] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Load messages & room info & setup polling
  useEffect(() => {
    const fetchData = async () => {
        try {
          const msgs = await getMessages(room.id);
          setMessages(msgs);
          
          // 获取房间信息（包括在线用户）
          const roomData = await getRoom(room.id);
          if (roomData && roomData.users) {
            setOnlineUsers(roomData.users);
          }
        } catch (error) {
          console.error('加载数据失败:', error);
        }
    };
    fetchData();
    const interval = setInterval(fetchData, 3000); // 每3秒刷新一次
    return () => clearInterval(interval);
  }, [room.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      roomId: room.id,
      senderId: user.id,
      senderName: user.username,
      senderAvatar: user.avatar,
      content: inputText,
      type: MessageType.TEXT,
      timestamp: Date.now()
    };

    setInputText('');
    await addMessage(room.id, newMessage);
    
    // 立即刷新消息列表
    const msgs = await getMessages(room.id, true);
    setMessages(msgs);
  };

  const handleClear = () => {
      if(confirm('确定要清除本房间的所有历史记录吗？这对所有人不可逆。')) {
          clearRoomHistory(room.id);
          setSidebarOpen(false);
      }
  };

  const toggleMedia = (type: 'voice' | 'video') => {
      if (mediaState === MediaState.IDLE) {
          setMediaState(type === 'voice' ? MediaState.VOICE : MediaState.VIDEO);
          setMicOn(true);
      } else {
          setMediaState(MediaState.IDLE);
          setMicOn(false);
      }
  };

  const copyRoomId = () => {
      navigator.clipboard.writeText(room.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-discord-dark relative">
      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 w-full h-14 bg-discord-darker border-b border-discord-dark flex items-center justify-between px-4 z-50 shadow-md">
        <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)} 
            className="text-discord-text p-1 hover:bg-discord-light rounded active:scale-95 transition-transform"
        >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="font-bold text-white flex items-center gap-2 max-w-[50%] truncate">
            <Hash size={16} className="text-discord-muted shrink-0"/>
            <span className="truncate">{room.name}</span>
        </span>
        <div className="flex items-center gap-3">
             {mediaState !== MediaState.IDLE && (
                 <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
             )}
             <Users size={24} className="text-discord-text" />
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 top-14 bg-black/60 z-30 md:hidden animate-fade-in backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar (Desktop + Mobile Drawer) */}
      {/* Key Fix: md:translate-x-0 ensures it's always visible on desktop */}
      <div className={`
        fixed top-14 bottom-0 left-0 z-40 w-72 bg-discord-darker flex flex-col transition-transform duration-300 transform shadow-xl
        md:relative md:top-0 md:h-auto md:shadow-none border-r border-discord-dark md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Desktop Sidebar Header: Shows Room Name */}
        <div className="hidden md:flex h-14 shadow-sm items-center px-4 justify-between border-b border-discord-dark shrink-0 hover:bg-discord-light/20 cursor-pointer transition-colors">
             <div className="font-bold text-white truncate w-48">{room.name}</div>
             {room.isPrivate && <Shield size={16} className="text-green-500"/>}
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
            
            {/* Section 1: Actions */}
            <div className="space-y-2">
                <button 
                    onClick={copyRoomId} 
                    className="w-full flex items-center px-3 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-200 rounded transition-colors group border border-indigo-500/20"
                >
                    {copied ? <Check size={18} className="mr-3 text-green-400" /> : <Copy size={18} className="mr-3 text-indigo-400" />}
                    <div className="flex flex-col items-start overflow-hidden">
                        <span className="font-medium text-sm">{copied ? '已复制' : '邀请朋友'}</span>
                        {!copied && <span className="text-[10px] text-discord-muted truncate w-40 opacity-70">点击复制房间口令</span>}
                    </div>
                </button>
            </div>

            {/* Section 2: Members */}
            <div>
                 <h3 className="text-xs font-bold text-discord-muted uppercase mb-2 px-2 flex items-center justify-between">
                    <span>在线成员</span>
                    <span className="text-[10px] bg-discord-dark px-1.5 rounded-full">{onlineUsers.length}</span>
                 </h3>
                 <div className="space-y-1">
                    {onlineUsers.length > 0 ? (
                      onlineUsers.map((member) => {
                        const isSelf = member.id === user.id;
                        return (
                          <div key={member.id} className="flex items-center px-2 py-1.5 hover:bg-discord-light/40 rounded cursor-pointer group">
                            <div className="relative">
                                <Avatar char={member.avatar} size="sm" />
                                <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${member.isOnline ? 'bg-green-500' : 'bg-gray-500'} rounded-full border-2 border-discord-darker`}></div>
                            </div>
                            <div className="ml-2 flex flex-col">
                                <span className="text-sm text-discord-text group-hover:text-white font-medium">
                                  {member.username} {isSelf && <span className="text-[10px] text-discord-muted">(我)</span>}
                                </span>
                                {member.isInVoice && <span className="text-[10px] text-green-400">正在通话中</span>}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-xs text-discord-muted text-center py-4">暂无在线成员</div>
                    )}
                 </div>
            </div>

            {/* Section 3: Room Management */}
            <div>
                 <h3 className="text-xs font-bold text-discord-muted uppercase mb-2 px-2">设置</h3>
                 <button onClick={handleClear} className="w-full flex items-center px-2 py-1.5 text-discord-muted hover:text-red-400 hover:bg-discord-light/30 rounded text-sm transition-colors">
                    <Trash2 size={16} className="mr-2" /> 清除聊天记录
                 </button>
                 <button onClick={onLeave} className="w-full flex items-center px-2 py-1.5 text-discord-muted hover:text-white hover:bg-discord-light/30 rounded text-sm transition-colors">
                    <LogOut size={16} className="mr-2" /> 离开房间
                 </button>
            </div>
        </div>

        {/* User Footer */}
        <div className="bg-discord-darker p-2 flex items-center justify-between border-t border-discord-dark shrink-0 pb-safe">
            <div className="flex items-center gap-2 overflow-hidden">
                <Avatar char={user.avatar} />
                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-white truncate">{user.username}</span>
                    <span className="text-xs text-discord-muted truncate">#{user.id.substring(0,4)}</span>
                </div>
            </div>
            <div className="flex items-center">
                 <button onClick={() => setMicOn(!micOn)} className="p-2 hover:bg-discord-light rounded transition-colors" disabled={mediaState === MediaState.IDLE}>
                    {micOn ? <Mic size={18} className={mediaState === MediaState.IDLE ? 'text-discord-muted' : 'text-white'}/> : <MicOff size={18} className="text-red-400"/>}
                 </button>
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-discord-light relative pt-14 md:pt-0">
        
        {/* Desktop Header: Shows Channel Name & Controls */}
        <div className="hidden md:flex h-14 bg-discord-light shadow-sm items-center px-4 border-b border-discord-dark z-10 justify-between shrink-0">
             <div className="flex items-center text-white">
                <Hash size={24} className="text-discord-muted mr-2"/>
                <span className="font-bold">chat</span>
                <span className="mx-2 text-discord-light/50">|</span>
                <span className="text-sm text-discord-muted">{room.isPrivate ? '加密连接' : '公开频道'}</span>
             </div>

             <div className="flex items-center space-x-3">
                 {/* Desktop Media Controls */}
                 <div className="flex bg-discord-darker rounded p-1 gap-1">
                    <button 
                        onClick={() => toggleMedia('voice')}
                        className={`flex items-center px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                            mediaState === MediaState.VOICE 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'text-discord-muted hover:bg-discord-light hover:text-white'
                        }`}
                    >
                        {mediaState === MediaState.VOICE ? '正在通话' : '语音'}
                    </button>
                    <button 
                        onClick={() => toggleMedia('video')}
                        className={`flex items-center px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                            mediaState === MediaState.VIDEO 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'text-discord-muted hover:bg-discord-light hover:text-white'
                        }`}
                    >
                         {mediaState === MediaState.VIDEO ? '视频中' : '视频'}
                    </button>
                    {(mediaState !== MediaState.IDLE) && (
                         <button 
                            onClick={() => setMediaState(MediaState.IDLE)}
                            className="flex items-center px-2 py-1.5 rounded text-sm font-medium text-red-400 hover:bg-discord-light hover:text-red-300"
                            title="挂断"
                         >
                             <PhoneOff size={16} />
                         </button>
                    )}
                 </div>
                 <div className="w-px h-6 bg-discord-darker mx-1"></div>
                 <div className="text-discord-muted hover:text-white cursor-pointer" title="成员列表"><Users size={24}/></div>
             </div>
        </div>

        {/* Active Media Stage (Video Grid) */}
        {mediaState === MediaState.VIDEO && (
            <div className="h-64 md:h-80 bg-black flex items-center justify-center p-4 border-b border-discord-darker shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-full">
                     <VideoTile user={{...user, isMuted: !micOn}} isSelf />
                     <div className="bg-discord-darker rounded-lg border border-dashed border-discord-muted flex items-center justify-center text-discord-muted flex-col">
                        <Users size={32} className="mb-2"/>
                        <span>等待他人加入...</span>
                     </div>
                </div>
            </div>
        )}

        {/* Voice Active Indicator (Banner) */}
        {mediaState === MediaState.VOICE && (
            <div className="bg-discord-darker border-b border-green-600/30 px-4 py-2 flex items-center justify-between animate-fade-in">
                 <div className="flex items-center gap-3">
                    <div className="bg-green-600/20 p-1.5 rounded-full text-green-500">
                        <Signal size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-green-500 uppercase">语音已连接</span>
                        <span className="text-xs text-discord-muted">安全加密通道 | 低延迟</span>
                    </div>
                 </div>
                 <button onClick={() => setMediaState(MediaState.IDLE)} className="text-discord-muted hover:text-white md:hidden">
                    <PhoneOff size={20} />
                 </button>
            </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
            <div className="flex-1"></div>
            
            <div className="mt-4 mb-8 select-none">
                 <div className="w-16 h-16 bg-discord-light rounded-[24px] flex items-center justify-center mb-4">
                    <Hash size={40} className="text-white"/>
                 </div>
                 <h2 className="text-3xl font-bold text-white">欢迎来到 #{room.name}</h2>
                 <p className="text-discord-muted mt-2">
                    {room.isPrivate ? '这是一个私密加密房间。' : '这是一个公开加密房间。'} 
                    <button onClick={copyRoomId} className="ml-2 text-discord-highlight hover:underline focus:outline-none">复制ID</button>
                 </p>
            </div>

            {messages.map((msg) => {
                const isSystem = msg.type === MessageType.SYSTEM;
                if (isSystem) {
                    return (
                        <div key={msg.id} className="flex justify-center my-4">
                             <span className="px-3 py-1 rounded bg-discord-light border border-white/5 text-xs text-discord-muted flex items-center gap-2 shadow-sm">
                                {msg.senderAvatar} {msg.content}
                             </span>
                        </div>
                    )
                }
                return (
                    <div key={msg.id} className="group flex items-start space-x-4 px-2 py-1 hover:bg-black/5 -mx-2 rounded transition-colors">
                        <Avatar char={msg.senderAvatar} />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-white cursor-pointer hover:underline">{msg.senderName}</span>
                                <span className="text-[10px] text-discord-muted opacity-70">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-discord-text whitespace-pre-wrap break-words leading-relaxed">
                                {msg.content}
                            </p>
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-discord-light border-t border-discord-darker pb-safe">
            <form onSubmit={handleSendMessage} className="relative">
                <div className="absolute left-3 top-3 text-discord-muted hover:text-white transition-colors cursor-pointer">
                    <MonitorUp size={24} />
                </div>
                <input 
                    className="w-full bg-discord-light text-discord-text placeholder-discord-muted rounded-lg pl-12 pr-12 py-3 outline-none focus:ring-1 focus:ring-discord-highlight transition-shadow"
                    placeholder={`发送消息到 #${room.name}`}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <button 
                    type="submit" 
                    className={`absolute right-3 top-3 transition-colors ${!inputText.trim() ? 'text-discord-muted cursor-not-allowed' : 'text-discord-highlight hover:text-white'}`}
                    disabled={!inputText.trim()}
                >
                    <Send size={20} />
                </button>
            </form>
            
            {/* Quick Media Controls (Mobile Only) */}
            <div className="md:hidden mt-3 flex justify-around border-t border-white/5 pt-2">
                 <button onClick={() => toggleMedia('voice')} className={`p-2 rounded-full transition-colors ${mediaState === MediaState.VOICE ? 'bg-green-600 text-white shadow-lg' : 'text-discord-muted hover:bg-discord-dark'}`}>
                    <Mic size={20} />
                 </button>
                 <button onClick={() => toggleMedia('video')} className={`p-2 rounded-full transition-colors ${mediaState === MediaState.VIDEO ? 'bg-green-600 text-white shadow-lg' : 'text-discord-muted hover:bg-discord-dark'}`}>
                    <Video size={20} />
                 </button>
            </div>
        </div>
      </div>
      
      {/* Version Number */}
      <div className="fixed bottom-4 right-4 text-xs text-discord-muted/50 pointer-events-none">
        v1.0.0
      </div>
    </div>
  );
};

export default Room;