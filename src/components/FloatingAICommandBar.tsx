import React from 'react';
import { Bot, Play, Pause, Terminal, Wand2 } from 'lucide-react';

interface FloatingAICommandBarProps {
  onToggleGame: () => void;
  gameRunning: boolean;
  onOpenLogs: () => void;
  onOpenAssetGenerator: () => void;
}

export default function FloatingAICommandBar({ onToggleGame, gameRunning, onOpenLogs, onOpenAssetGenerator }: FloatingAICommandBarProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] bg-[#1A1A1A] border border-white/10 rounded-full p-2 flex items-center gap-2 shadow-2xl backdrop-blur-md">
      <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-full">
        <Bot size={20} />
      </div>
      
      <div className="h-6 w-px bg-white/10 mx-1"></div>
      
      <button onClick={onToggleGame} className="p-2 hover:bg-white/10 rounded-full text-gray-400">
        {gameRunning ? <Pause size={18} /> : <Play size={18} />}
      </button>

      <button onClick={onOpenAssetGenerator} className="p-2 hover:bg-white/10 rounded-full text-gray-400">
        <Wand2 size={18} />
      </button>

      <button onClick={onOpenLogs} className="p-2 hover:bg-white/10 rounded-full text-gray-400">
        <Terminal size={18} />
      </button>
    </div>
  );
}
