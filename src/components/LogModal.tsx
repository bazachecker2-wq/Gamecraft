import React from 'react';
import { X } from 'lucide-react';

interface LogEntry {
  prompt: string;
  response: string;
  timestamp: string;
}

interface LogModalProps {
  logs: LogEntry[];
  onClose: () => void;
}

export default function LogModal({ logs, onClose }: LogModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-8 z-50">
      <div className="bg-[#141414] border border-white/10 rounded-lg w-full h-full flex flex-col">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-sm font-bold text-gray-100">Логи запросов ИИ</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={16}/></button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto space-y-4 font-mono text-xs text-gray-300">
          {logs.map((log, i) => (
            <div key={i} className="border-b border-white/5 pb-4">
              <div className="text-indigo-400 mb-1">[{log.timestamp}] Вы: {log.prompt}</div>
              <div className="text-gray-400">Агент: {log.response}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
