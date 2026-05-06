import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Zap, Brain, Wind, Code, Book, ChevronRight, Trash2 } from 'lucide-react';

export const DailyTasks = ({ tasks, onComplete, onDismiss }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'walking': return <Zap size={20} />;
      case 'speaking': return <Brain size={20} />;
      case 'meditation': return <Wind size={20} />;
      case 'coding': return <Code size={20} />;
      case 'reading': return <Book size={20} />;
      default: return <Zap size={20} />;
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display font-black text-xs text-text-secondary uppercase tracking-[0.3em] italic">Daily Neural Tasks</h3>
        <span className="text-[10px] font-mono font-black text-cyber-pink bg-cyber-pink/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
          {completedCount}/3 SYNCED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            whileHover={!task.completed ? { scale: 1.02, x: 5 } : {}}
            whileTap={!task.completed ? { scale: 0.98 } : {}}
            onClick={!task.completed ? () => onComplete(task.id) : undefined}
            role="button"
            tabIndex={!task.completed ? 0 : -1}
            className={`w-full flex items-center justify-between p-4 rounded-[1.5rem] border-2 transition-all relative overflow-hidden group ${
              task.completed 
                ? 'bg-emerald-500/10 border-emerald-500/30 opacity-60 cursor-default' 
                : 'bg-glass-bg border-border-primary hover:border-cyber-blue shadow-lg hover:shadow-cyber-blue/10 cursor-pointer'
            }`}
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                task.completed ? 'bg-emerald-500/20 text-emerald-500' : 'bg-bg-secondary text-text-secondary group-hover:text-cyber-blue'
              }`}>
                {task.completed ? <CheckCircle2 size={22} /> : getIcon(task.type)}
              </div>
              <div className="text-left">
                <h4 className={`font-display font-black text-sm italic uppercase leading-none ${
                    task.completed ? 'text-emerald-500 line-through' : 'text-text-primary'
                }`}>
                    {task.title}
                </h4>
                <p className="text-[10px] font-mono text-text-secondary mt-1 max-w-[200px] truncate">{task.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 relative z-10">
              {!task.completed && (
                <span className="text-sm font-display font-black text-cyber-blue italic">+{task.reward}</span>
              )}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(task.id);
                  }}
                  className="p-3 text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all border border-red-500/20 group/trash"
                  title="Dismiss Task"
                >
                  <Trash2 size={16} className="group-hover/trash:text-red-500" />
                </motion.button>
                {!task.completed && (
                  <ChevronRight size={16} className="text-text-secondary group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </div>
            
            {!task.completed && (
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
