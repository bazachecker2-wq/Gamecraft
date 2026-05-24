import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { initGame } from '../game';

interface PixiPreviewProps {
  isRunning: boolean;
}

export default function PixiPreview({ isRunning }: PixiPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !isRunning) return;

    const container = containerRef.current;
    let app: PIXI.Application | null = null;

    async function initApp() {
      app = new PIXI.Application();
      await app.init({
        background: '#1a1a1a',
        resizeTo: container,
      });

      if (containerRef.current) {
        containerRef.current.appendChild(app.canvas);
        initGame(app);
      }
    }

    initApp().catch(console.error);

    return () => {
      if (app) {
        app.destroy(true, { children: true, texture: true, textureSource: true, context: true });
        app = null;
      }
      if (container) {
          while (container.firstChild) {
              container.removeChild(container.firstChild);
          }
      }
    };
  }, [isRunning]);

  return isRunning ? <div ref={containerRef} className="w-full h-full" /> : 
    <div className="w-full h-full flex items-center justify-center text-gray-500">Нажмите "Старт" для запуска</div>;
}
