import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Star, Gift, Coffee, Gamepad2, Tv, Zap } from 'lucide-react';

const ICONS = [
  { id: 'Coffee', icon: Coffee },
  { id: 'Gamepad2', icon: Gamepad2 },
  { id: 'Tv', icon: Tv },
  { id: 'Gift', icon: Gift },
  { id: 'Star', icon: Star },
  { id: 'Zap', icon: Zap },
];

export const NewRewardModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(60); // minutes
  const [selectedIcon, setSelectedIcon] = useState('Gift');

  if (!isOpen) return null;

  const calculatedCost = Math.round((duration / 60) * 80);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    onSubmit({
      title,
      cost: calculatedCost,
      icon: selectedIcon,
      type: `${duration} MIN Session`,
      color: 'bg-cyber-pink'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-sm bg-bg-card border-2 border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-2xl font-display font-black text-white italic tracking-tighter">FORGE <span className="text-cyber-yellow">REWARD</span></h3>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} className="text-white/60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-mono font-black tracking-[0.3em] text-white/30 uppercase">Reward Name</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Holodeck Access"
              className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 text-xl font-display font-bold text-white focus:outline-none focus:border-cyber-yellow transition-all placeholder:text-white/10"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-mono font-black tracking-[0.3em] text-white/30 uppercase">Duration (Minutes)</label>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-24 bg-white/5 border-2 border-white/5 rounded-2xl px-4 py-4 text-xl font-display font-bold text-white focus:outline-none focus:border-cyber-yellow transition-all"
                />
                <div className="flex-1 px-4 py-4 rounded-2xl bg-white/5 border-2 border-white/5 flex items-center justify-between">
                   <span className="text-xs font-mono font-black text-cyber-yellow italic">Price:</span>
                   <span className="text-2xl font-display font-black text-white italic">{calculatedCost} <span className="text-xs text-white/20">CREDITS</span></span>
                </div>
              </div>
              <input 
                type="range" 
                min="5" 
                max="240" 
                step="5" 
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-cyber-yellow cursor-pointer"
              />
              <div className="flex justify-between text-[8px] font-mono font-black text-white/20 uppercase tracking-widest">
                <span>5m</span>
                <span>4 Hours</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-mono font-black tracking-[0.3em] text-white/30 uppercase">Icon</label>
             <div className="grid grid-cols-6 gap-2">
                {ICONS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedIcon(item.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        selectedIcon === item.id ? 'bg-cyber-yellow border-cyber-yellow text-black' : 'bg-white/5 border-white/5 text-white/40'
                      }`}
                    >
                      <Icon size={20} />
                    </button>
                  );
                })}
             </div>
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-cyber-yellow text-black font-black text-lg rounded-2xl shadow-[0_0_30px_rgba(255,255,0,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest italic"
          >
            Manifest Reward
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};
