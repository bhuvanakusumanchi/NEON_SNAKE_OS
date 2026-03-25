import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from '../constants';
import { Point, Direction } from '../types';

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection('RIGHT');
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
        setSpeed(s => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isPaused, isGameOver, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, isGameOver, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00f3ff' : '#ff00ff';
      
      // Add a small gap between segments
      const padding = 1;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );

      // Glow effect for head
      if (isHead) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00f3ff';
        ctx.strokeRect(
          segment.x * cellSize + padding,
          segment.y * cellSize + padding,
          cellSize - padding * 2,
          cellSize - padding * 2
        );
        ctx.shadowBlur = 0;
      }
    });

    // Draw food
    ctx.fillStyle = '#f3ff00';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#f3ff00';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center gap-4 p-4 pixel-border bg-black/80 crt-screen">
      <div className="flex justify-between w-full px-4 font-display text-neon-magenta">
        <div className="flex flex-col">
          <span className="text-xs opacity-50">SCORE</span>
          <span className="text-2xl font-bold tracking-widest">{score.toString().padStart(6, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs opacity-50">STATUS</span>
          <span className={`text-sm ${isPaused ? 'text-neon-yellow' : 'text-neon-cyan'}`}>
            {isGameOver ? 'TERMINATED' : isPaused ? 'PAUSED' : 'ACTIVE'}
          </span>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-black border-2 border-neon-cyan/30 neon-shadow"
        />
        
        <AnimatePresence>
          {(isPaused || isGameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              {isGameOver ? (
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-neon-magenta mb-4 glitch-text" data-text="GAME OVER">GAME OVER</h2>
                  <button
                    onClick={resetGame}
                    className="px-6 py-2 bg-neon-magenta text-black font-bold hover:bg-neon-cyan transition-colors"
                  >
                    REBOOT_SYSTEM
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-neon-cyan mb-4">PAUSED</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="px-6 py-2 bg-neon-cyan text-black font-bold hover:bg-neon-magenta transition-colors"
                  >
                    RESUME_DATA_FLOW
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-[10px] text-neon-cyan/50 mt-2">
        [ARROW_KEYS] TO NAVIGATE | [SPACE] TO PAUSE
      </div>
    </div>
  );
};

export default SnakeGame;
