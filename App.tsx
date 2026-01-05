import React, { useState, useEffect } from 'react';
import { Room as RoomType, User } from './types';
import { getOrCreateCurrentUser, createNewRoom, joinExistingRoom } from './services/apiServer';
import Landing from './components/Landing';
import Room from './components/Room';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRoom, setCurrentRoom] = useState<RoomType | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Initialize user on mount
    const user = getOrCreateCurrentUser();
    setCurrentUser(user);
    
    // Check URL hash for room invite logic
    const hash = window.location.hash.replace('#', '');
    if (hash && hash.length > 0) {
       // Ideally trigger a join attempt or pre-fill input
    }
  }, []);

  const handleAction = async (mode: 'create' | 'join', roomId: string, password?: string) => {
    setErrorMsg(null);
    
    try {
      if (mode === 'create') {
          const result = await createNewRoom(roomId, !!password, password);
          if (result.success && result.room) {
              setCurrentRoom(result.room);
              setIsJoined(true);
              window.location.hash = roomId;
          } else {
              setErrorMsg(result.error || '创建失败');
          }
      } else {
          const result = await joinExistingRoom(roomId, password);
          if (result.success && result.room) {
              setCurrentRoom(result.room);
              setIsJoined(true);
              window.location.hash = roomId;
          } else {
              setErrorMsg(result.error || '加入失败');
          }
      }
    } catch (error) {
      console.error('操作失败:', error);
      setErrorMsg('连接服务器失败，请检查网络');
    }
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    setIsJoined(false);
    window.location.hash = '';
    setErrorMsg(null);
  };

  if (!currentUser) return <div className="min-h-screen bg-discord-dark flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-discord-dark font-sans text-discord-text antialiased selection:bg-discord-highlight selection:text-white">
      {isJoined && currentRoom ? (
        <Room 
          user={currentUser} 
          room={currentRoom} 
          onLeave={handleLeaveRoom} 
        />
      ) : (
        <Landing 
          user={currentUser} 
          onAction={handleAction}
          error={errorMsg}
        />
      )}
    </div>
  );
};

export default App;