import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Target, Clock, Hash } from 'lucide-react';

export const NewSubQuestModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [totalTokens, setTotalTokens] = useState(10);
  const [tokenDuration, setTokenDuration] = useState(10);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      totalTokens: Number(totalTokens),
      tokenDuration: Number(tokenDuration)
    });
    setTitle('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-bg-secondary border-2 border-border-primary rounded-[3rem] p-8 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4">
          <button onClick={onClose} className="p-2 text-text-secondary hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-cyber-blue/10 rounded-2xl text-cyber-blue">
            <Target size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-display font-black text-text-primary italic uppercase tracking-tighter">New Objective</h2>
            <p className="text-[10px] font-mono text-text-secondary uppercase tracking-widest leading-none mt-1">Configure Mission Unit</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono font-black text-text-secondary uppercase tracking-[0.2em] ml-2">Objective Name</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., NEURAL MAPPING PHASE 1"
              className="w-full bg-white/5 border-2 border-border-primary rounded-2xl p-4 text-text-primary focus:border-cyber-blue outline-none transition-all placeholder:text-white/10 italic font-display font-bold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-black text-text-secondary uppercase tracking-[0.2em] ml-2">Token Count</label>
              <div className="relative">
                <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={totalTokens}
                  onChange={(e) => setTotalTokens(e.target.value)}
                  className="w-full bg-white/5 border-2 border-border-primary rounded-2xl p-4 pl-12 text-text-primary focus:border-cyber-blue outline-none transition-all font-mono font-bold"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-black text-text-secondary uppercase tracking-[0.2em] ml-2">Time (Mins)</label>
              <div className="relative">
                <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={tokenDuration}
                  onChange={(e) => setTokenDuration(e.target.value)}
                  className="w-full bg-white/5 border-2 border-border-primary rounded-2xl p-4 pl-12 text-text-primary focus:border-cyber-blue outline-none transition-all font-mono font-bold"
                  required
                />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-5 bg-cyber-blue text-black rounded-[2rem] font-display font-black text-sm uppercase tracking-widest italic shadow-xl shadow-cyber-blue/20 mt-4"
          >
            Deploy Objective
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};
