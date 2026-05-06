import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { STICKERS } from '../constants';
import * as Icons from 'lucide-react';

export const NewQuestModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [selectedSticker, setSelectedSticker] = useState(STICKERS[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        sticker: selectedSticker,
        subQuests: [],
        color: '#00ffff'
      });
    } catch (err) {
      console.error('Submit error:', err);
      setIsSubmitting(false);
    }
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
        className="w-full max-w-sm bg-bg-card border-2 border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-2xl font-display font-black text-white italic tracking-tighter">CREATE <span className="text-cyber-blue">REALM</span></h3>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} className="text-white/60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-3">
            <label className="text-[10px] font-mono font-black tracking-[0.3em] text-white/30 uppercase">Realm Name</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. UNIVERSITY"
              className="w-full bg-white/5 border-2 border-white/5 rounded-2xl px-6 py-4 text-xl font-display font-bold text-white focus:outline-none focus:border-cyber-blue transition-all placeholder:text-white/10"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-mono font-black tracking-[0.3em] text-white/30 uppercase">Seal</label>
            <div className="grid grid-cols-4 gap-4">
              {STICKERS.map((sticker) => {
                const Icon = Icons[sticker.icon];
                return (
                  <button
                    key={sticker.id}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setSelectedSticker(sticker.id)}
                    className={`p-4 rounded-2xl border-2 transition-all group ${
                      selectedSticker === sticker.id 
                      ? 'bg-cyber-blue border-cyber-blue shadow-[0_0_20px_rgba(0,255,255,0.4)]' 
                      : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <Icon size={24} className={selectedSticker === sticker.id ? 'text-black' : 'text-white group-hover:scale-110 transition-transform'} />
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-5 font-black text-lg rounded-2xl shadow-[0_0_30px_rgba(255,0,255,0.3)] transition-all flex items-center justify-center gap-3 uppercase tracking-widest italic ${
              isSubmitting 
              ? 'bg-gray-600 cursor-not-allowed opacity-50' 
              : 'bg-cyber-pink text-white hover:scale-[1.02] active:scale-95'
            }`}
          >
            {isSubmitting ? 'Invocating...' : 'Invocate Realm'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};
