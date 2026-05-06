import React from 'react';
import { motion } from 'motion/react';
import { Trash2 } from 'lucide-react';
import { STICKERS } from '../constants';
import * as Icons from 'lucide-react';

export const QuestCard = ({ quest, onClick, onDelete, isAnimating, isCelebrated }) => {
  const totalTokens = quest.subQuests.reduce((acc, sq) => acc + sq.totalTokens, 0);
  const completedTokens = quest.subQuests.reduce((acc, sq) => acc + sq.completedTokens, 0);
  const progress = totalTokens > 0 ? (completedTokens / totalTokens) * 100 : 0;

  const getProgressStyles = (p) => {
    if (p === 0) return 'bg-red-950/40 border-red-900/50 text-red-500 shadow-[inset_0_0_20px_rgba(255,0,0,0.1)]';
    if (p <= 25) return 'bg-red-900/20 border-red-700/40 text-red-400';
    if (p <= 50) return 'bg-orange-900/20 border-orange-600/40 text-orange-400';
    if (p <= 75) return 'bg-lime-900/20 border-lime-600/40 text-lime-400';
    return 'bg-green-900/20 border-green-500/40 text-green-400 shadow-[inset_0_0_20px_rgba(0,255,0,0.1)]';
  };

  const stickObj = STICKERS.find(s => s.id === quest.sticker);
  const IconComponent = Icons[stickObj?.icon || 'Target'];

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={isCelebrated ? {
        scale: [1, 1.1, 0.95, 1.05, 1],
        boxShadow: [
          "0 0 0px rgba(0, 255, 0, 0)",
          "0 0 50px rgba(0, 255, 0, 0.6)",
          "0 0 20px rgba(0, 255, 0, 0.3)",
          "0 0 0px rgba(0, 255, 0, 0)"
        ],
        filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"]
      } : isAnimating ? {
        scale: [1, 1.05, 1],
        boxShadow: [
          "0 0 0px rgba(0, 255, 255, 0)",
          "0 0 30px rgba(0, 255, 255, 0.4)",
          "0 0 0px rgba(0, 255, 255, 0)"
        ]
      } : {}}
      transition={{ 
        duration: isCelebrated ? 1.2 : 0.5,
        times: isCelebrated ? [0, 0.2, 0.4, 0.6, 1] : [0, 0.5, 1]
      }}
      onClick={onClick}
      className={`relative p-5 lg:p-6 rounded-3xl border-2 transition-all duration-700 glass-card neon-border overflow-hidden cursor-pointer group/card ${getProgressStyles(progress)}`}
    >
      <div className="absolute inset-0 hex-grid opacity-20 pointer-events-none" />
      
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-glass-bg border border-border-primary">
            <IconComponent size={24} />
          </div>
          <div>
            <h3 className="text-xl font-display font-black text-text-primary leading-tight">{quest.title}</h3>
            <p className="text-[10px] text-text-secondary font-mono uppercase tracking-widest mt-0.5">
              {quest.subQuests.length} Units • {completedTokens}/{totalTokens} TKNS
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between w-full sm:w-auto gap-4 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2.5 bg-red-500/10 text-red-500 rounded-xl transition-all hover:bg-red-500/20 border border-red-500/20 shadow-lg"
            title="Delete Realm"
          >
            <Trash2 size={16} />
          </button>
          <div className="text-right">
            <div className="text-2xl font-display font-black text-text-primary leading-none">{Math.round(progress)}%</div>
            <div className="w-20 h-1 bg-glass-bg rounded-full mt-2 overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${progress}%` }}
                 className={`h-full transition-colors duration-700 ${progress === 100 ? 'bg-cyber-green shadow-[0_0_10px_#00ff00]' : 'bg-cyber-blue shadow-[0_0_10px_#00ffff]'}`}
               />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
