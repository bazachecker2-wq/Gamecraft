/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { generateGameContent } from './services/geminiService';
import { File, MessageSquare, Terminal, MonitorPlay, FolderOpen, Plus, Image as ImageIcon, Music, Box } from 'lucide-react';
import PixiPreview from './components/PixiPreview';
import LogModal from './components/LogModal';
import AssetGeneratorModal from './components/AssetGeneratorModal';
import FloatingAICommandBar from './components/FloatingAICommandBar';

export default function App() {
  const [gameRunning, setGameRunning] = useState(false);
  const [messages, setMessages] = useState("Разработчик AI Агент готов к работе...");
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<{prompt: string, response: string, timestamp: string}[]>([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showAssetGeneratorModal, setShowAssetGeneratorModal] = useState(false);

  const startNewProject = () => {
    setGameRunning(true);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userPrompt = input;
    setMessages(prev => prev + `\n\nВы: ${userPrompt}`);
    setInput("");
    
    setMessages(prev => prev + `\n\nАгент: ...`);
    try {
      const response = await generateGameContent(userPrompt, (text) => {
        setMessages(prev => prev.replace(/Агент: \.\.\.$/, `Агент: ${text}`));
      });
      setMessages(prev => prev.replace(/Агент: \.\.\.$/, `Агент: ${response}`));
      setLogs(prev => [...prev, { prompt: userPrompt, response, timestamp: new Date().toLocaleTimeString() }]);
    } catch {
      setMessages(prev => prev.replace(/Агент: \.\.\.$/, `Агент: Ошибка связи.`));
    }
  };

  const handleAssetGeneration = async (prompt: string, type: string) => {
    setShowAssetGeneratorModal(false);
    setMessages(prev => prev + `\n\nВы [Ассет]: Генерация ${type}: ${prompt}`);
    setMessages(prev => prev + `\n\nАгент: ...`);
    try {
        const response = await generateGameContent(`Сгенерируй описание и параметры для ${type} ассета: ${prompt}`, (text) => {
            setMessages(prev => prev.replace(/Агент: \.\.\.$/, `Агент: ${text}`));
        });
        setMessages(prev => prev.replace(/Агент: \.\.\.$/, `Агент: Готово! Параметры: ${response}`));
        setLogs(prev => [...prev, { prompt: `[${type}] ${prompt}`, response, timestamp: new Date().toLocaleTimeString() }]);
    } catch {
        setMessages(prev => prev.replace(/Агент: \.\.\.$/, `Агент: Ошибка генерации ассета.`));
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#0A0A0A] text-gray-300 overflow-hidden font-sans flex-col">
      {/* Шапка */}
      <header className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-[#141414]">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white">G</div>
          <span className="font-medium text-sm text-gray-100">GameCraft Studio v1.2</span>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={() => setShowLogModal(true)} className="text-[10px] text-gray-400 hover:text-white">Логи</button>
            <button onClick={() => setMessages("Разработчик AI Агент готов к работе...") + setLogs([])} className="text-[10px] text-gray-400 hover:text-white">Рестарт</button>
            <button onClick={startNewProject} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded border border-emerald-500/30 hover:bg-emerald-500/20">RUN</button>
          </div>
      </header>

      {/* Основная рабочая область */}
      <div className="flex-1 flex overflow-hidden">
        {/* Проводник */}
        <div className="w-52 border-r border-white/10 bg-[#0F0F0F] p-4 flex flex-col">
          <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <FolderOpen size={14}/> Проводник
          </h2>
          <div className="text-xs space-y-1 text-gray-400 flex-1 overflow-y-auto">
            <p className="hover:bg-white/5 px-2 py-1 cursor-pointer">src/App.tsx</p>
            <p className="hover:bg-white/5 px-2 py-1 cursor-pointer">src/game.ts</p>
            <p className="hover:bg-white/5 px-2 py-1 cursor-pointer">assets/</p>
          </div>
        </div>

        {/* Центральная часть */}
        <div className="flex-[2] flex flex-col min-w-0">
          <div className="flex-1 bg-[#121212] flex flex-col">
            <div className="flex-1 p-2 flex flex-col">
              {/* Предпросмотр в центре */}
              <div className="flex-1 w-full bg-black rounded-md border border-white/10 flex items-center justify-center text-gray-500 text-xs overflow-hidden relative">
                <PixiPreview isRunning={gameRunning} />
                {!gameRunning && (
                    <button onClick={startNewProject} className="absolute flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-bold transition-all">
                      <MonitorPlay size={16}/> Запустить проект
                    </button>
                )}
              </div>
            </div>
            
            {/* Панель инструментов игры */}
            <div className="h-16 border-t border-white/10 flex items-center p-2 gap-2">
                <button onClick={startNewProject} className="p-2 bg-white/5 hover:bg-white/10 rounded"><MonitorPlay size={16}/></button>
                <div className="text-xs text-gray-500 font-mono">Captain Split: {gameRunning ? "Running" : "Idle"}</div>
            </div>
          </div>
        </div>

        {/* Правая панель (Чат + Ассеты) */}
        <div className="w-96 border-l border-white/10 bg-[#0F0F0F] p-4 flex flex-col gap-4">
          {/* Чат */}
          <div className="flex-1 flex flex-col">
              <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <MessageSquare size={14}/> ИИ Агент
              </h2>
              <div className="bg-white/5 p-4 rounded-md border border-white/5 flex-1 flex flex-col justify-end overflow-y-auto">
                <div className="text-xs text-gray-400 whitespace-pre-wrap flex-1">{messages}</div>
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  type="text" 
                  placeholder="Ввести команду для ИИ..." 
                  className="w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 text-xs focus:outline-none focus:border-indigo-500/50 mt-2"/>
              </div>
          </div>
          
          {/* Ассеты */}
          <div className="h-40">
             <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <ImageIcon size={14}/> Проектные Ассеты
              </h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 p-2 rounded border border-white/5 flex items-center gap-2 text-xs cursor-pointer hover:bg-white/10" onClick={() => setShowAssetGeneratorModal(true)}><ImageIcon size={14}/> Генератор</div>
                <div className="bg-white/5 p-2 rounded border border-white/5 flex items-center gap-2 text-xs cursor-pointer hover:bg-white/10" onClick={() => alert("Добавление скилла...")}><Plus size={14}/> Add Skill</div>
              </div>
          </div>
        </div>
        {showLogModal && <LogModal logs={logs} onClose={() => setShowLogModal(false)} />}
        {showAssetGeneratorModal && <AssetGeneratorModal onClose={() => setShowAssetGeneratorModal(false)} onGenerate={handleAssetGeneration} />}
        <FloatingAICommandBar 
          onToggleGame={() => setGameRunning(!gameRunning)}
          gameRunning={gameRunning}
          onOpenLogs={() => setShowLogModal(true)}
          onOpenAssetGenerator={() => setShowAssetGeneratorModal(true)}
        />
      </div>
    </div>
  );
}
