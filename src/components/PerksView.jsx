import React from 'react';
import { motion } from 'motion/react';
import { PERKS } from '../constants';
import * as Icons from 'lucide-react';

export const PerksView = ({ stats, onPurchase }) => {
  return (
    <div className="space-y-10 pb-12">
      <header>
        <h2 className="text-4xl font-display font-black text-text-primary italic uppercase tracking-tighter mb-2">Tactical Perks</h2>
        <p className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.3em]">Enhance your extraction capabilities with neural buffs</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {PERKS.map((perk, i) => {
          const Icon = Icons[perk.icon] || Icons.Zap;
          const isActive = stats.activePerks?.some(ap => ap.perkId === perk.id && ap.expiresAt > Date.now());
          const canAfford = stats.tokens >= perk.cost;
          const levelUnlocked = !perk.minLevel || stats.level >= perk.minLevel;

          return (
            <motion.div
              key={perk.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-[2.5rem] border-2 transition-all relative overflow-hidden glass-card ${
                isActive 
                ? 'border-cyber-green/40 bg-cyber-green/5' 
                : levelUnlocked && canAfford
                  ? 'border-white/5 hover:border-cyber-yellow/40 cursor-pointer' 
                  : 'border-white/5 opacity-50 grayscale'
              }`}
              onClick={() => !isActive && levelUnlocked && canAfford && onPurchase(perk)}
            >
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-2xl ${isActive ? 'bg-cyber-green text-black' : levelUnlocked ? 'bg-white/5 text-cyber-yellow' : 'bg-white/5 text-text-secondary'} shadow-xl`}>
                  {levelUnlocked ? <Icon size={24} /> : <Icons.Lock size={24} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-display font-black text-white italic uppercase tracking-tight">{perk.title}</h3>
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-cyber-green/20 text-cyber-green text-[8px] font-black uppercase tracking-widest">Active</span>
                    )}
                    {!levelUnlocked && (
                      <span className="px-2 py-0.5 rounded-full bg-cyber-pink/20 text-cyber-pink text-[8px] font-black uppercase tracking-widest">LVL {perk.minLevel} REQUIRED</span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 mt-1 font-medium leading-relaxed">{perk.description}</p>
                </div>
                <div className="text-right">
                  {isActive ? (
                    <div className="text-[10px] font-mono font-black text-cyber-green uppercase tracking-widest">Unlocked</div>
                  ) : !levelUnlocked ? (
                    <div className="text-[10px] font-mono font-black text-cyber-pink uppercase tracking-widest">Locked</div>
                  ) : (
                    <>
                      <p className="text-xl font-display font-black text-white italic">{perk.cost}</p>
                      <span className="text-[8px] font-mono font-black text-white/20 uppercase tracking-widest">Tokens</span>
                    </>
                  )}
                </div>
              </div>

              {isActive && (
                 <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[8px] font-mono font-black text-white/20 uppercase tracking-widest">Efficiency Status</span>
                    <div className="flex gap-1">
                       {[1,2,3,4,5].map(j => (
                          <div key={j} className="w-4 h-1 rounded-full bg-cyber-green animate-pulse" style={{ animationDelay: `${j*0.2}s` }} />
                       ))}
                    </div>
                 </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
