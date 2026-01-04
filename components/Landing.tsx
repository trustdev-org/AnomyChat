import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { generateRoomMnemonic } from '../services/geminiService';
import { ShieldCheck, Video, Mic, Zap, Terminal, AlertCircle } from 'lucide-react';

interface LandingProps {
  user: User;
  onAction: (mode: 'create'|'join', roomId: string, password?: string) => void;
  error: string | null;
}

const Landing: React.FC<LandingProps> = ({ user, onAction, error }) => {
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [generatedId, setGeneratedId] = useState('');

  // Auto-generate a suggestion for Create mode only
  useEffect(() => {
    setGeneratedId(generateRoomMnemonic());
  }, []);

  // When switching modes, clear or restore inputs appropriately
  useEffect(() => {
      setRoomId('');
      setPassword('');
      if (mode === 'create' && !roomId) {
          // Optional: could pre-fill generated ID, but placeholder is cleaner
      }
  }, [mode]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const mnemonic = generateRoomMnemonic();
    setGeneratedId(mnemonic);
    setRoomId(mnemonic);
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let targetId = roomId.trim();
    
    // In Create mode, if empty, use the generated placeholder
    if (mode === 'create' && !targetId) {
        targetId = generatedId;
    }

    if (!targetId) return;
    onAction(mode, targetId, password);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

      <div className="w-full max-w-md bg-discord-darker p-8 rounded-xl shadow-2xl border border-discord-light transition-all">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-discord-highlight rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <Terminal size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">WhisperLink</h1>
          <p className="text-discord-muted">匿名、加密、极速连接</p>
        </div>

        <div className="flex bg-discord-dark rounded-lg p-1 mb-6 relative">
            <button 
                onClick={() => setMode('create')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all relative z-10 ${mode === 'create' ? 'text-white shadow' : 'text-discord-muted hover:text-discord-text'}`}
            >
                创建房间
            </button>
            <button 
                onClick={() => setMode('join')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all relative z-10 ${mode === 'join' ? 'text-white shadow' : 'text-discord-muted hover:text-discord-text'}`}
            >
                加入房间
            </button>
            {/* Sliding background */}
            <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-discord-light rounded-md transition-all duration-300 ease-in-out ${mode === 'join' ? 'left-[calc(50%+2px)]' : 'left-1'}`}
            ></div>
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded flex items-center gap-2 text-red-200 text-sm">
                <AlertCircle size={16} className="shrink-0" />
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input 
              label={mode === 'create' ? "新房间 ID (可随机)" : "目标房间 ID"}
              placeholder={mode === 'create' ? generatedId : "请输入房间号..."}
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              autoFocus
            />
            {mode === 'create' && (
                <button 
                    type="button" 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="absolute right-0 top-6 text-xs text-discord-highlight hover:underline p-2"
                >
                    {isGenerating ? '生成中...' : '随机生成'}
                </button>
            )}
          </div>
          
          <div>
            <Input 
              label="访问密码 (可选)" 
              type="password"
              placeholder={mode === 'create' ? "设置密码 (可选)" : "如已加密，请输入密码"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" fullWidth size="lg">
            {mode === 'create' ? '建立安全连接' : '进入房间'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-discord-light">
            <div className="grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-discord-dark flex items-center justify-center text-green-400"><ShieldCheck size={16} /></div>
                    <span className="text-[10px] text-discord-muted">端到端加密</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-discord-dark flex items-center justify-center text-yellow-400"><Zap size={16} /></div>
                    <span className="text-[10px] text-discord-muted">低延迟 P2P</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-discord-dark flex items-center justify-center text-blue-400"><div className="flex"><Video size={10} /><Mic size={10}/></div></div>
                    <span className="text-[10px] text-discord-muted">音视频通讯</span>
                </div>
            </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-discord-muted">
         用户 ID: {user.username} {user.avatar} (本地存储)
      </div>
    </div>
  );
};

export default Landing;