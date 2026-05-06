import React from 'react';
import { motion } from 'motion/react';
import { REWARDS } from '../constants';
import * as Icons from 'lucide-react';

export const RewardsView = ({ stats, customRewards, onRedeem, onAddReward, onDeleteReward }) => {
  const allRewards = [...REWARDS, ...customRewards];
  return (
    <div className="space-y-10 pb-12">
      <header>
        <h2 className="text-4xl font-display font-black text-text-primary italic uppercase tracking-tighter mb-2">The Armory</h2>
        <p className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.3em]">Convert extraction tokens into real-world rewards</p>
      </header>

      {/* HUD Currency Display */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 rounded-[2.5rem] bg-cyber-yellow/5 border-2 border-cyber-yellow/20 relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-[10px] font-mono text-cyber-yellow uppercase tracking-[0.2em] mb-2 font-black italic">Nexus Tokens</h2>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-display font-black text-text-primary italic">{stats.tokens}</span>
              <Icons.Zap size={24} className="text-cyber-yellow animate-pulse" />
            </div>
            <p className="text-[8px] font-mono text-text-secondary mt-2">5 XP + 5 TOKENS / COMPLETION</p>
          </div>
          <Icons.Zap size={80} className="absolute -right-4 -bottom-4 text-cyber-yellow/10 rotate-12 group-hover:scale-110 transition-transform" />
        </div>
        <div className="p-6 rounded-[2.5rem] bg-cyber-blue/5 border-2 border-cyber-blue/20 relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-[10px] font-mono text-cyber-blue uppercase tracking-[0.2em] mb-2 font-black italic">Rank Progress</h2>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-display font-black text-text-primary italic">{stats.totalTokensEarned}</span>
              <span className="text-xs font-mono font-bold text-cyber-blue/40 mt-3 italic">TOKENS</span>
            </div>
          </div>
          <Icons.Shield size={80} className="absolute -right-4 -bottom-4 text-cyber-blue/10 -rotate-12 group-hover:rotate-0 transition-transform" />
        </div>
      </div>

      <div className="flex items-center justify-between">
         <h2 className="text-xs font-mono font-black text-text-secondary uppercase tracking-[0.5em] italic">The Armory</h2>
         <motion.button 
           whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 191, 0, 0.3)" }}
           whileTap={{ scale: 0.95 }}
           onClick={onAddReward}
           className="relative flex items-center gap-2 px-6 py-2.5 bg-cyber-yellow/10 border-2 border-cyber-yellow/50 rounded-full text-[10px] font-black text-cyber-yellow transition-all uppercase italic overflow-hidden group/forge"
         >
           <div className="absolute inset-0 bg-cyber-yellow/20 translate-y-full group-hover/forge:translate-y-0 transition-transform duration-300" />
           <Icons.Plus size={14} className="relative z-10" />
           <span className="relative z-10 tracking-widest">+ Forge New Prototype</span>
           <motion.div 
             animate={{ opacity: [0.1, 0.3, 0.1] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="absolute inset-0 bg-cyber-yellow/10"
           />
         </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {allRewards.map((reward, i) => {
          const Icon = Icons[reward.icon] || Icons.Gift;
          const hasDiscount = stats.activePerks?.some(p => p.perkId === 'discount_chip' && p.expiresAt > Date.now());
          const displayCost = hasDiscount ? Math.round(reward.cost * 0.8) : reward.cost;
          const canAfford = stats.tokens >= displayCost; 

          return (
            <motion.div
              key={`${reward.id}-${i}`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={canAfford ? { 
                scale: 1.02, 
                x: 8,
                backgroundColor: "rgba(255, 255, 255, 0.08)"
              } : {}}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-between p-6 rounded-[2rem] glass-card border-2 transition-all group relative overflow-hidden ${
                canAfford 
                ? 'border-cyber-yellow/10 hover:border-cyber-yellow/60 cursor-pointer shadow-[0_10px_40px_rgba(0,0,0,0.5)]' 
                : 'border-white/5 opacity-40 grayscale cursor-not-allowed contrast-75'
              }`}
              onClick={() => canAfford && onRedeem(reward.id, reward.cost, reward.title)}
            >
              {canAfford && (
                <>
                  <div className="absolute -left-20 -top-20 w-40 h-40 bg-cyber-yellow/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyber-yellow/[0.03] to-transparent" />
                </>
              )}
              
              <div className="flex items-center gap-6 relative z-10">
                <div className={`p-4 rounded-2xl ${reward.color || 'bg-glass-bg'} shadow-[0_15px_35px_rgba(0,0,0,0.4)] relative group-hover:scale-110 transition-transform duration-500`}>
                  <Icon size={24} className="text-white" />
                  {canAfford && (
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 bg-white/20 blur-md rounded-2xl"
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-display font-black text-text-primary italic uppercase tracking-tighter mb-0.5 group-hover:text-cyber-yellow transition-colors">
                    {reward.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md ${canAfford ? 'text-cyber-blue bg-cyber-blue/5' : 'text-text-secondary bg-white/5'}`}>
                      {reward.type}
                    </span>
                    {hasDiscount && (
                       <span className="flex items-center gap-1 text-[8px] font-mono font-black text-cyber-pink uppercase tracking-widest italic animate-pulse">
                         <div className="w-1 h-1 rounded-full bg-cyber-pink" />
                         Tactical Discount Chip Active
                       </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 relative z-10">
                <div className="text-right">
                  <div className="flex flex-col items-end">
                     {hasDiscount && (
                        <span className="text-[10px] font-mono font-black text-text-secondary line-through tracking-tighter decoration-cyber-pink opacity-60">{reward.cost}</span>
                     )}
                     <div className="flex items-center gap-1.5 leading-none">
                       <p className={`text-3xl font-display font-black italic transition-all duration-300 ${
                         canAfford 
                         ? 'text-text-primary group-hover:text-cyber-yellow scale-110' 
                         : 'text-text-secondary'
                       }`}>
                         {displayCost}
                       </p>
                       {!canAfford && (
                         <Icons.Lock size={12} className="text-text-secondary mb-1" />
                       )}
                     </div>
                  </div>
                  <span className="text-[9px] font-mono font-black text-text-secondary uppercase tracking-[0.3em] leading-none opacity-50">Archive Tokens</span>
                </div>

                {reward.userId && onDeleteReward && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteReward(reward.id);
                    }}
                    className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20"
                    title="Delete Reward"
                  >
                    <Icons.Trash2 size={16} />
                  </button>
                )}
              </div>

              {canAfford && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-cyber-yellow transform translate-x-1 group-hover:translate-x-0 transition-transform" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
