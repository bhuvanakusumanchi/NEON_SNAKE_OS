import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Cpu, Zap, Activity, Shield, Wifi, Battery, Clock } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isBooting, setIsBooting] = useState(true);
  const [bootLines, setBootLines] = useState<string[]>([]);

  const bootSequence = [
    'INITIALIZING NEON_SNAKE_OS v2.5.0...',
    'CHECKING SYSTEM INTEGRITY...',
    'LOADING SONIC_DATA_STREAMS...',
    'ESTABLISHING NEURAL_LINK...',
    'SYNCING KINETIC_ENGINE...',
    'ACCESS_GRANTED. WELCOME_USER.',
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    let lineIndex = 0;
    const bootInterval = setInterval(() => {
      if (lineIndex < bootSequence.length) {
        setBootLines(prev => [...prev, bootSequence[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(bootInterval);
        setTimeout(() => setIsBooting(false), 1000);
      }
    }, 400);

    return () => {
      clearInterval(timer);
      clearInterval(bootInterval);
    };
  }, []);

  if (isBooting) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-8 font-mono text-neon-cyan overflow-hidden crt-screen">
        <div className="w-full max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <Cpu className="w-12 h-12 animate-pulse" />
            <h1 className="text-4xl font-bold tracking-tighter glitch-text" data-text="NEON_SNAKE_OS">NEON_SNAKE_OS</h1>
          </div>
          <div className="space-y-2">
            {bootLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <span className="text-neon-magenta opacity-50">{'>'}</span>
                <span>{line}</span>
              </motion.div>
            ))}
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-3 h-6 bg-neon-cyan inline-block ml-2"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-neon-cyan selection:bg-neon-magenta selection:text-black p-4 md:p-8 flex flex-col gap-8 relative overflow-x-hidden">
      {/* Background Grid & Scanlines handled in index.css */}
      
      {/* Top Navigation Bar */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 border-b-2 border-neon-cyan/20 pb-4 crt-screen">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-neon-cyan/10 border border-neon-cyan/30 neon-shadow">
            <Zap className="w-6 h-6 text-neon-yellow" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-widest font-display glitch-text" data-text="NEON_SNAKE_OS">
              NEON_SNAKE_OS
            </h1>
            <div className="flex items-center gap-2 text-[10px] opacity-50 uppercase tracking-tighter">
              <Activity size={10} className="text-neon-magenta" />
              <span>SYSTEM_STABLE</span>
              <span className="mx-1">|</span>
              <Shield size={10} className="text-neon-cyan" />
              <span>ENCRYPTION_ACTIVE</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-[10px] font-display">
          <div className="flex flex-col items-end">
            <span className="opacity-40">NETWORK_STATUS</span>
            <div className="flex items-center gap-1 text-neon-cyan">
              <Wifi size={12} />
              <span>CONNECTED_X86</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="opacity-40">POWER_CORE</span>
            <div className="flex items-center gap-1 text-neon-yellow">
              <Battery size={12} />
              <span>98%_STABLE</span>
            </div>
          </div>
          <div className="flex flex-col items-end border-l border-neon-cyan/20 pl-6">
            <span className="opacity-40">LOCAL_TIME</span>
            <div className="flex items-center gap-1 text-neon-magenta">
              <Clock size={12} />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Left Panel - System Info */}
        <aside className="hidden xl:flex flex-col gap-4 w-64">
          <div className="p-4 pixel-border bg-black/40 text-[10px] space-y-4">
            <div className="flex items-center gap-2 text-neon-magenta border-b border-neon-magenta/20 pb-2">
              <Terminal size={14} />
              <span className="font-bold">SYSTEM_LOG</span>
            </div>
            <div className="space-y-1 opacity-60 font-mono">
              <p>[05:02:21] KERNEL_LOADED</p>
              <p>[05:02:22] AUDIO_DRIVER_OK</p>
              <p>[05:02:22] INPUT_MAP_SYNCED</p>
              <p>[05:02:23] MEMORY_ALLOC_0xFF</p>
              <p className="text-neon-yellow animate-pulse">{'>'} LISTENING_FOR_INPUT...</p>
            </div>
          </div>

          <div className="p-4 pixel-border bg-black/40 space-y-4">
            <div className="flex items-center justify-between text-[10px]">
              <span className="opacity-50 uppercase">CPU_LOAD</span>
              <span className="text-neon-cyan">24%</span>
            </div>
            <div className="w-full h-1 bg-neon-cyan/10">
              <motion.div 
                animate={{ width: ['24%', '32%', '28%', '45%', '24%'] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="h-full bg-neon-cyan neon-shadow" 
              />
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="opacity-50 uppercase">MEM_USAGE</span>
              <span className="text-neon-magenta">1.2GB</span>
            </div>
            <div className="w-full h-1 bg-neon-magenta/10">
              <motion.div 
                animate={{ width: ['45%', '48%', '46%', '52%', '45%'] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="h-full bg-neon-magenta neon-shadow" 
              />
            </div>
          </div>
        </aside>

        {/* Center Panel - Snake Game */}
        <section className="flex-1 flex flex-col items-center justify-center gap-4 w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[450px]"
          >
            <SnakeGame />
          </motion.div>
        </section>

        {/* Right Panel - Music Player */}
        <section className="w-full lg:w-auto flex justify-center">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md"
          >
            <MusicPlayer />
          </motion.div>
        </section>
      </main>

      {/* Footer Status Bar */}
      <footer className="mt-auto flex justify-between items-center text-[8px] opacity-30 tracking-[0.2em] font-display border-t border-neon-cyan/10 pt-4">
        <div className="flex gap-4">
          <span>OS_VERSION: 2.5.0-STABLE</span>
          <span>BUILD_ID: 0xDEADBEEF</span>
        </div>
        <div className="flex gap-4">
          <span>© 2026 NEON_SNAKE_CORP</span>
          <span>ALL_DATA_ENCRYPTED</span>
        </div>
      </footer>

      {/* Random Glitch Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-5">
        <motion.div
          animate={{ 
            y: ['0%', '100%', '0%'],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-full h-px bg-neon-cyan shadow-[0_0_10px_#00f3ff]"
        />
      </div>
    </div>
  );
};

export default App;
