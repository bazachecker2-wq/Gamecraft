import React, { useState } from 'react';
import { X, Wand2 } from 'lucide-react';

interface AssetGeneratorModalProps {
  onClose: () => void;
  onGenerate: (prompt: string, type: string) => void;
}

export default function AssetGeneratorModal({ onClose, onGenerate }: AssetGeneratorModalProps) {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState("sprite");

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-8 z-50">
      <div className="bg-[#141414] border border-white/10 rounded-lg w-[400px] flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-gray-100 flex items-center gap-2"><Wand2 size={16}/> Генератор ассетов</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={16}/></button>
        </div>
        
        <select value={type} onChange={(e) => setType(e.target.value)} className="bg-white/5 border border-white/10 rounded p-2 mb-4 text-xs">
          <option value="sprite">Спрайт игрока</option>
          <option value="environment">Окружение (Платформа)</option>
          <option value="ui">Интерфейс</option>
        </select>
        
        <textarea 
          placeholder="Опиши ассет (например: 'ретро робот, 8-bit, синий')..." 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded p-2 mb-4 text-xs h-24"
        />
        
        <button onClick={() => onGenerate(prompt, type)} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold transition-all">
          Сгенерировать AI-Ассет
        </button>
      </div>
    </div>
  );
}
