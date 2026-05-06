import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Shield, Crown } from 'lucide-react';

const MOCK_FRIENDS = [
  { id: '1', displayName: 'Xenon_Pilot', totalTokens: 450, weeklyTokens: 120 },
  { id: '2', displayName: 'Cyber_Ghost', totalTokens: 380, weeklyTokens: 95 },
  { id: '3', displayName: 'Neon_Rider', totalTokens: 310, weeklyTokens: 80 },
  { id: '4', displayName: 'Void_Walker', totalTokens: 290, weeklyTokens: 110 },
];

export const Leaderboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-display font-black italic uppercase tracking-tighter text-white">Global Ranking</h3>
        <span className="text-[10px] font-mono font-black text-cyber-blue uppercase tracking-[0.2em] italic">Active Squadron</span>
      </div>

      <div className="space-y-3">
        {MOCK_FRIENDS.sort((a, b) => b.totalTokens - a.totalTokens).map((friend, i) => (
          <motion.div
            key={friend.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center justify-between p-5 rounded-[2rem] border-2 transition-all ${
              i === 0 ? 'bg-cyber-yellow/10 border-cyber-yellow/40 shadow-[0_0_20px_rgba(255,255,0,0.1)]' : 'bg-white/5 border-white/5'
            }`}
          >
            <div className="flex items-center gap-4">
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-lg ${
                 i === 0 ? 'bg-cyber-yellow text-black' : 'bg-white/10 text-white/40'
               }`}>
                 {i + 1}
               </div>
               <div>
                  <h4 className="font-display font-black text-white italic uppercase tracking-tight flex items-center gap-2">
                    {friend.displayName}
                    {i === 0 && <Crown size={14} className="text-cyber-yellow" />}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] font-mono font-black text-white/20 uppercase tracking-widest">
                     <Shield size={10} />
                     Master Rank
                  </div>
               </div>
            </div>
            <div className="text-right">
               <p className="text-lg font-display font-black text-white italic">{friend.totalTokens}</p>
               <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Units Sync</p>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full py-5 rounded-2xl border-2 border-dashed border-white/5 text-white/20 hover:text-white/40 hover:border-white/10 transition-all font-display font-black uppercase tracking-[0.2em] italic">
        + Recruit Friends
      </button>
    </div>
  );
};
