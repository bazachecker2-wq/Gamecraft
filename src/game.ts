import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';

export function initGame(app: PIXI.Application) {
  // Настройка сетки для футбола-шахмат
  const gridSize = 40;
  const gridWidth = 10;
  const gridHeight = 15;
  const worldContainer = new PIXI.Container();
  app.stage.addChild(worldContainer);
 
  // Рисуем поле
  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      const cell = new PIXI.Graphics();
      cell.rect(x * gridSize, y * gridSize, gridSize, gridSize);
      cell.stroke({ width: 1, color: 0x333333 });
      worldContainer.addChild(cell);
    }
  }

  // Настройка Matter.js
  const engine = Matter.Engine.create();
  engine.gravity.y = 0; // Top-down view
  
  // Игрок (футболист)
  const playerBody = Matter.Bodies.circle(2 * gridSize, 7 * gridSize, 15, { friction: 0.1 });
  Matter.World.add(engine.world, playerBody);
  const player = new PIXI.Graphics();
  player.circle(0, 0, 15);
  player.fill(0x3B82F6);
  worldContainer.addChild(player);
  
  // ИИ Соперник
  const enemyBody = Matter.Bodies.circle(7 * gridSize, 7 * gridSize, 15, { frictionAir: 0.1 });
  Matter.World.add(engine.world, enemyBody);
  const enemy = new PIXI.Graphics();
  enemy.circle(0, 0, 15);
  enemy.fill(0xEF4444);
  worldContainer.addChild(enemy);
  
  // Визуализация предсказанного пути
  const pathGraphics = new PIXI.Graphics();
  worldContainer.addChild(pathGraphics);
  
  // Текст для отладки
  const debugText = new PIXI.Text({ text: 'ИИ: Ищу цель...', style: { fontSize: 12, fill: 0xffffff } });
  debugText.x = 10;
  debugText.y = 10;
  app.stage.addChild(debugText);
  
  // Управление
  window.addEventListener('keydown', (e) => {
    const force = 0.05;
    if (e.key === 'ArrowUp') Matter.Body.applyForce(playerBody, playerBody.position, { x: 0, y: -force });
    if (e.key === 'ArrowDown') Matter.Body.applyForce(playerBody, playerBody.position, { x: 0, y: force });
    if (e.key === 'ArrowLeft') Matter.Body.applyForce(playerBody, playerBody.position, { x: -force, y: 0 });
    if (e.key === 'ArrowRight') Matter.Body.applyForce(playerBody, playerBody.position, { x: force, y: 0 });
  });

  app.ticker.add((ticker) => {
    Matter.Engine.update(engine, ticker.deltaTime * (1000/60));

    // Синхронизация спрайтов
    player.x = playerBody.position.x;
    player.y = playerBody.position.y;
    enemy.x = enemyBody.position.x;
    enemy.y = enemyBody.position.y;
    
    // ИИ логика (сила к игроку)
    const dx = playerBody.position.x - enemyBody.position.x;
    const dy = playerBody.position.y - enemyBody.position.y;
    const distSq = dx * dx + dy * dy;
    
    let aiState = 'Chasing';
    let forceMultiplier = 0.002;
    
    if (distSq < 150 * 150) {
        aiState = 'Defending';
        forceMultiplier = 0.001; // Slower when defending
    }
    
    Matter.Body.applyForce(enemyBody, enemyBody.position, { x: dx * forceMultiplier, y: dy * forceMultiplier });
    
    // Визуализация пути
    pathGraphics.clear();
    const color = aiState === 'Chasing' ? 0xFF4444 : 0x44FF44;
    
    // Line
    pathGraphics.moveTo(enemyBody.position.x, enemyBody.position.y);
    pathGraphics.lineTo(playerBody.position.x, playerBody.position.y);
    pathGraphics.stroke({ width: 2, color: color, alpha: 0.5 });
    
    // Waypoints
    pathGraphics.circle(enemyBody.position.x, enemyBody.position.y, 5);
    pathGraphics.circle(playerBody.position.x, playerBody.position.y, 5);
    pathGraphics.fill(color);
    
    debugText.text = `ИИState: ${aiState}`;
  });

}
