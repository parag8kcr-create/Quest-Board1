import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Target, Coins, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../lib/sounds';

export const TriviaModal = ({ isOpen, onClose, onComplete, isDaily }) => {
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=1&type=multiple');
      if (!response.ok) throw new Error('Trivia API offline');
      const data = await response.json();
      if (data.results && data.results[0]) {
        const q = data.results[0];
        setQuestion(q);
        // Shuffle correct answer with incorrect ones
        const allOptions = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
        setOptions(allOptions);
      } else {
        throw new Error('Invalid trivia data');
      }
    } catch (err) {
      console.warn('Fallback trivia protocol engaged', err);
      const fallbacks = [
        {
          category: "System Intel",
          question: "What is the primary currency used in the Nexus system?",
          correct_answer: "Empire Credits",
          incorrect_answers: ["Gold Coins", "Neural Tokens", "Space Bits"]
        },
        {
          category: "Technical",
          question: "In computer science, what does 'UI' stand for?",
          correct_answer: "User Interface",
          incorrect_answers: ["User Internal", "Universal Interface", "Unit Identifier"]
        },
        {
          category: "Performance",
          question: "Which of these contributes to your extraction streak?",
          correct_answer: "Daily synchronization",
          incorrect_answers: ["Buying perks", "Deleting realms", "Opening settings"]
        }
      ];
      const q = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      setQuestion(q);
      const allOptions = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
      setOptions(allOptions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchQuestion();
      setSelected(null);
      setIsCorrect(null);
    }
  }, [isOpen]);

  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const handleSelect = (option) => {
    if (selected) return;
    setSelected(option);
    const correct = option === question?.correct_answer;
    setIsCorrect(correct);
    
    if (correct) {
      soundManager.play('success');
    } else {
      soundManager.play('click');
    }

    setTimeout(() => {
      onComplete(correct);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-lg glass-card border-2 border-cyber-blue shadow-[0_0_50px_rgba(0,255,255,0.2)] rounded-[2.5rem] overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 pt-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-cyber-blue/10 rounded-2xl flex items-center justify-center text-cyber-blue">
               {isDaily ? <Target size={32} /> : <Brain size={32} />}
            </div>
          </div>

          <h2 className="text-2xl font-display font-black text-text-primary italic uppercase tracking-tighter mb-2">
            {isDaily ? 'Motivational Sync' : 'Data Verification'}
          </h2>
          <p className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.3em] mb-8">
            {isDaily ? 'Daily synchronization challenge' : 'Complete to extract tokens'}
          </p>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12"
              >
                <div className="w-8 h-8 border-4 border-cyber-blue/20 border-t-cyber-blue rounded-full animate-spin mx-auto" />
              </motion.div>
            ) : question ? (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-left">
                  <span className="text-[8px] font-mono font-black text-cyber-blue uppercase tracking-widest block mb-2">{decodeHTML(question.category)}</span>
                  <h3 className="text-lg font-display font-bold text-text-primary leading-tight">
                    {decodeHTML(question.question)}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {options.map((option, i) => {
                    const isSelected = selected === option;
                    const isSelectedCorrect = isCorrect !== null && option === question.correct_answer;
                    const isSelectedWrong = isCorrect === false && isSelected;

                    return (
                      <motion.button
                        key={i}
                        whileHover={!selected ? { scale: 1.02, x: 5 } : {}}
                        whileTap={!selected ? { scale: 0.98 } : {}}
                        onClick={() => handleSelect(option)}
                        disabled={!!selected}
                        className={`p-4 rounded-2xl text-left border-2 transition-all font-medium text-sm flex justify-between items-center ${
                          isSelectedCorrect 
                            ? 'bg-cyber-green/10 border-cyber-green text-cyber-green' 
                            : isSelectedWrong 
                            ? 'bg-cyber-pink/10 border-cyber-pink text-cyber-pink' 
                            : isSelected
                            ? 'bg-white/10 border-white text-text-primary'
                            : 'bg-glass-bg border-white/5 text-text-secondary hover:border-white/20'
                        }`}
                      >
                        <span>{decodeHTML(option)}</span>
                        {isSelectedCorrect && <CheckCircle2 size={16} />}
                        {isSelectedWrong && <AlertCircle size={16} />}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="mt-8 pt-6 border-t border-white/5">
             <div className="flex items-center justify-center gap-2 text-cyber-yellow">
                <Coins size={16} />
                <span className="text-xl font-display font-black italic">{isDaily ? 50 : 20}</span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-60">Reward Tokens</span>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
