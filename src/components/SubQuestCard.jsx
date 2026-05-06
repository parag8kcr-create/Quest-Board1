import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, CheckCircle, Trash2, Lock, RotateCcw } from 'lucide-react';
import { soundManager } from '../lib/sounds';

export const SubQuestCard = ({ subQuest, onCompleteToken, onUndoToken, onDelete, onUpdateDuration, onUpdateTitle }) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState((subQuest.tokenDuration || 10) * 60); 
  const [showUndo, setShowUndo] = useState(false);
  const timerRef = useRef(null);
  const undoTimerRef = useRef(null);

  const durations = [2, 5, 10, 15, 20];

  useEffect(() => {
    setTimeLeft((subQuest.tokenDuration || 10) * 60);
    setIsActive(false);
  }, [subQuest.completedTokens, subQuest.tokenDuration]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    setTimeLeft((subQuest.tokenDuration || 10) * 60);
    soundManager.play('token');
    onCompleteToken();

    // Show undo button for 5 seconds
    setShowUndo(true);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => {
      setShowUndo(false);
    }, 5000);
  };

  const handleUndo = () => {
    setShowUndo(false);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    onUndoToken();
  };

  const handleManualComplete = () => {
    if (subQuest.completedTokens >= subQuest.totalTokens) return;
    if (confirm('MANUALLY SYNC THIS TOKEN? This bypasses standard extraction protocols.')) {
      handleComplete();
    }
  };

  const handleRename = () => {
    const newTitle = prompt('RENAME OBJECTIVE:', subQuest.title);
    if (newTitle && newTitle.trim()) {
      onUpdateTitle?.(newTitle.trim());
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`relative p-6 rounded-3xl border-2 transition-all duration-500 overflow-hidden ${
        isActive 
        ? 'bg-cyber-blue/5 border-cyber-blue/40 shadow-[0_0_30px_rgba(0,255,255,0.1)]' 
        : subQuest.completedTokens >= subQuest.totalTokens 
          ? 'bg-cyber-green/5 border-cyber-green/40 text-cyber-green'
          : 'bg-bg-secondary border-border-primary'
      }`}
    >
       {/* Background completion effect */}
       {subQuest.completedTokens >= subQuest.totalTokens && (
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-green/5 to-transparent pointer-events-none" />
       )}

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex-1">
          <h4 
            onClick={handleRename}
            className="text-xl font-display font-black text-text-primary italic uppercase tracking-tighter cursor-pointer hover:text-cyber-blue transition-colors"
          >
            {subQuest.title}
          </h4>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-[10px] font-mono font-black text-text-secondary uppercase tracking-[0.2em]">{subQuest.completedTokens}/{subQuest.totalTokens} Tokens Secured</span>
             <div className="w-1 h-1 rounded-full bg-border-primary" />
             {!isActive && subQuest.completedTokens < subQuest.totalTokens ? (
               <div className="flex items-center gap-1.5">
                  {durations.map(d => (
                    <button
                      key={d}
                      onClick={() => onUpdateDuration?.(d)}
                      className={`px-1.5 py-0.5 rounded-md text-[8px] font-black transition-all ${
                        (subQuest.tokenDuration || 10) === d 
                        ? 'bg-cyber-blue text-black' 
                        : 'bg-glass-bg text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {d}M
                    </button>
                  ))}
               </div>
             ) : (
               <span className="text-[10px] font-mono font-black text-text-secondary uppercase tracking-[0.2em] italic">{subQuest.tokenDuration || 10}m each</span>
             )}
             <div className="w-1 h-1 rounded-full bg-border-primary" />
             <span className="text-[10px] font-mono font-bold text-cyber-blue/60 italic uppercase">Uplink Active</span>
          </div>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }} 
          className="p-3 bg-glass-bg rounded-xl text-text-secondary hover:text-red-500 transition-all hover:bg-red-500/10"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 mb-6 relative z-10">
        {Array.from({ length: subQuest.totalTokens }).map((_, i) => {
          const isDone = i < subQuest.completedTokens;
          return (
            <motion.div
              key={i}
              initial={false}
              animate={isDone ? { 
                scale: [1, 1.2, 1],
                backgroundColor: ['#1a1a1a', '#00ffff', '#00ffc8'] 
              } : {}}
              className={`aspect-square rounded-xl flex items-center justify-center font-mono text-[10px] font-black transition-all relative overflow-hidden ${
                isDone 
                ? 'bg-cyber-green text-black shadow-[0_0_15px_rgba(0,255,100,0.4)]' 
                : 'bg-glass-bg text-text-secondary border border-border-primary'
              }`}
            >
              {isDone ? (
                <>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"
                    animate={{ x: [-20, 40] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  />
                  <span className="relative z-10">{i + 1}</span>
                </>
              ) : (
                <Lock size={10} className="opacity-20" />
              )}
            </motion.div>
          );
        })}
      </div>

      {subQuest.completedTokens < subQuest.totalTokens && (
        <div className="flex items-center justify-between bg-bg-secondary p-4 rounded-2xl border border-border-primary relative z-10">
          <div className="flex items-center gap-4">
             <AnimatePresence mode="wait">
               {showUndo ? (
                 <motion.button
                   key="undo-btn"
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   onClick={handleUndo}
                   className="flex items-center gap-2 px-4 py-2 bg-cyber-pink text-white rounded-xl font-mono text-[10px] font-black uppercase tracking-widest italic shadow-[0_0_20px_#ff00ff44]"
                 >
                    <RotateCcw size={14} /> Undo Sync
                 </motion.button>
               ) : (
                 <motion.div 
                   key="timer-display"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   className="flex items-center gap-4"
                 >
                   <div className="text-3xl font-display font-black text-cyber-blue italic tracking-tighter w-20">{formatTime(timeLeft)}</div>
                   <div>
                      <p className="text-[10px] font-mono font-black text-text-secondary uppercase tracking-widest leading-none">Extraction</p>
                      <p className="text-xs font-display font-black text-text-primary/60 italic uppercase">System Sync</p>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
          <div className="flex gap-2">
            <button
               onClick={handleManualComplete}
               className="p-4 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5"
               title="Manual Sync"
            >
               <CheckCircle size={20} />
            </button>
            <button
              onClick={() => {
                soundManager.play('click');
                setIsActive(!isActive);
              }}
              className={`p-4 rounded-xl transition-all shadow-lg ${
                isActive 
                ? 'bg-text-primary/10 text-text-primary border border-border-primary' 
                : 'bg-cyber-blue text-black shadow-[0_0_20px_#00ffff44]'
              }`}
            >
              {isActive ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>
          </div>
        </div>
      )}

      {subQuest.completedTokens >= subQuest.totalTokens && (
        <div className="flex items-center gap-3 py-4 px-6 rounded-2xl bg-cyber-green/20 border border-cyber-green/30 text-cyber-green text-[10px] font-black uppercase tracking-[0.2em] italic relative z-10 animate-pulse">
          <CheckCircle size={18} /> MISSION ACCOMPLISHED: SECTOR SECURED
        </div>
      )}
    </motion.div>
  );
};
