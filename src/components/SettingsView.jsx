import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, Sunrise, Bell, Smartphone } from 'lucide-react';

export const SettingsView = ({ stats, onUpdateTheme, onUpdateStats }) => {
   const themes = [
      { id: 'light', label: 'DAY MODE', icon: Sun, color: 'bg-white text-blue-600', desc: 'Solar optimization for high-light environments.' },
      { id: 'dark', label: 'NIGHT MODE', icon: Moon, color: 'bg-black text-cyber-blue', desc: 'Standard tactical dark interface.' },
      { id: 'warm', label: 'WARM MODE', icon: Sunrise, color: 'bg-[#ffedb5] text-orange-600', desc: 'Optical protection with blue light filter.' }
   ];

   return (
      <div className="space-y-10 pb-12">
         <header>
            <h2 className="text-4xl font-display font-black text-text-primary italic uppercase tracking-tighter mb-2">Protocol Settings</h2>
            <p className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.3em]">Configure your extraction environment</p>
         </header>

         <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
               <Smartphone size={16} className="text-cyber-blue" />
               <h3 className="text-xs font-mono font-black text-text-primary uppercase tracking-widest">Interface Synthesis</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
               {themes.map((t) => {
                  const Icon = t.icon;
                  return (
                    <motion.button
                       key={t.id}
                       whileHover={{ scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                       onClick={() => onUpdateTheme(t.id)}
                       className={`flex items-center gap-5 p-6 rounded-3xl border-2 transition-all text-left group ${
                          (stats.theme || 'dark') === t.id 
                             ? 'bg-glass-bg border-cyber-blue shadow-[0_0_20px_rgba(0,255,255,0.1)]' 
                             : 'bg-glass-bg border-border-primary opacity-50 grayscale hover:opacity-100 hover:grayscale-0'
                       }`}
                    >
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6 ${t.color}`}>
                          <Icon size={24} />
                       </div>
                       <div className="flex-1">
                          <h4 className="font-display font-black text-xl italic uppercase tracking-tight text-text-primary">
                             {t.label}
                             {(stats.theme || 'dark') === t.id && (
                                <span className="ml-3 text-[10px] font-mono text-cyber-blue tracking-widest align-middle">Active</span>
                             )}
                          </h4>
                          <p className="text-xs text-text-secondary mt-0.5">{t.desc}</p>
                       </div>
                    </motion.button>
                  );
               })}
            </div>
         </section>

         <section className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
               < Bell size={16} className="text-cyber-pink" />
               <h3 className="text-xs font-mono font-black text-text-primary uppercase tracking-widest">Neural Link Parameters</h3>
            </div>
            <div className="glass-card rounded-3xl p-8 space-y-8">
               <div className="flex items-center justify-between">
                  <div>
                     <h4 className="font-display font-black text-lg text-text-primary italic uppercase">Daily Quota</h4>
                     <p className="text-xs text-text-secondary">Tokens required for sector synchronization.</p>
                  </div>
                  <div className="flex items-center gap-4 bg-bg-primary/50 p-2 rounded-2xl border border-border-primary">
                     <button 
                        onClick={() => onUpdateStats({ dailyGoal: Math.max(1, (stats.dailyGoal || 10) - 1) })}
                        className="w-10 h-10 flex items-center justify-center text-text-primary hover:bg-white/10 rounded-xl font-black"
                     >-</button>
                     <span className="font-display font-black text-xl w-8 text-center">{stats.dailyGoal}</span>
                     <button 
                        onClick={() => onUpdateStats({ dailyGoal: (stats.dailyGoal || 10) + 1 })}
                        className="w-10 h-10 flex items-center justify-center text-text-primary hover:bg-white/10 rounded-xl font-black"
                     >+</button>
                  </div>
               </div>

               <div className="flex items-center justify-between">
                  <div>
                     <h4 className="font-display font-black text-lg text-text-primary italic uppercase">System Extractor</h4>
                     <p className="text-xs text-text-secondary">Default token duration protocol.</p>
                  </div>
                  <div className="flex gap-2">
                     {[2, 5, 10, 15, 20].map(d => (
                        <button
                           key={d}
                           onClick={() => onUpdateStats({ defaultTimerDuration: d })}
                           className={`px-3 py-2 rounded-xl text-[10px] font-black transition-all ${
                              (stats.defaultTimerDuration || 10) === d 
                              ? 'bg-cyber-blue text-black shadow-[0_0_15px_rgba(0,255,255,0.3)]' 
                              : 'bg-bg-primary/50 text-text-secondary hover:text-text-primary border border-border-primary'
                           }`}
                        >
                           {d}M
                        </button>
                     ))}
                  </div>
               </div>

               <div className="flex items-center justify-between opacity-50">
                  <div>
                     <h4 className="font-display font-black text-lg text-text-primary italic uppercase">Push Notifications</h4>
                     <p className="text-xs text-text-secondary">Encrypted mission alerts (Premium required).</p>
                  </div>
                  <div className="w-12 h-6 bg-white/10 rounded-full relative">
                     <div className="absolute left-1 top-1 w-4 h-4 bg-white/20 rounded-full" />
                  </div>
               </div>
            </div>
         </section>

         <div className="pt-6">
            <p className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.4em] text-center opacity-30">Nexus v2.4.0-Stable // Realm Sync Active</p>
         </div>
      </div>
   );
};
