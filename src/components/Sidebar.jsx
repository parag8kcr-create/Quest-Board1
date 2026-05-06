import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Sword, 
  Zap, 
  BarChart, 
  Settings as SettingsIcon,
  Coins,
  Flame,
  Quote as QuoteIcon
} from 'lucide-react';

export const Sidebar = ({ 
  user, 
  stats, 
  currentPath, 
  navigate, 
  quote,
  onRefreshQuote
}) => {
  const NavItem = ({ path, icon, label }) => {
    const active = currentPath === path;
    return (
      <button
        onClick={() => navigate(path)}
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group relative overflow-hidden ${
          active ? 'text-cyber-blue bg-cyber-blue/5' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
        }`}
      >
        {active && (
          <motion.div 
            layoutId="sidebar-active"
            className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-cyber-blue rounded-r-full shadow-[0_0_10px_#00ffff]"
          />
        )}
        <div className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
          {icon}
        </div>
        <span className="font-display font-black text-sm uppercase tracking-widest italic">{label}</span>
      </button>
    );
  };

  return (
    <aside className="hidden lg:flex flex-col w-[300px] h-screen sticky top-0 bg-bg-secondary border-r border-border-primary p-8 z-50">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/10 ring-4 ring-white/5">
          <img src={user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'} alt="Pilot" referrerPolicy="no-referrer" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-[9px] font-mono text-text-secondary uppercase tracking-[0.2em] font-black">Pilot Identified</p>
            <span className="px-1.5 py-0.5 rounded-md bg-cyber-blue/20 text-cyber-blue text-[8px] font-mono font-black border border-cyber-blue/30">LVL {stats.level}</span>
          </div>
          <h2 className="text-lg font-display font-black text-text-primary italic tracking-tight truncate max-w-[140px]">
             {user?.displayName?.split(' ')[0] || 'Guest'}
          </h2>
        </div>
      </div>

      <div className="space-y-4 mb-12">
        <div className="p-5 rounded-2xl bg-glass-bg border border-border-primary flex items-center justify-between">
           <div className="flex flex-col">
              <span className="text-[8px] font-mono text-text-secondary uppercase tracking-widest">Balance</span>
              <div className="flex items-center gap-2 text-cyber-yellow">
                <Zap size={16} />
                <span className="font-display font-black text-xl">{stats.tokens}</span>
              </div>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-mono text-text-secondary uppercase tracking-widest">Streak</span>
              <div className="flex items-center gap-1 text-cyber-pink">
                <Flame size={14} />
                <span className="font-display font-bold text-lg">{stats.streak}D</span>
              </div>
           </div>
        </div>

        {/* Daily Goal Progress */}
        <div className="px-5 space-y-2">
            <div className="flex justify-between items-end">
                <span className="text-[8px] font-mono text-text-secondary uppercase tracking-widest">Daily Target</span>
                <span className="text-[10px] font-mono font-black text-cyber-blue uppercase tracking-widest">{stats.dailyTokensCompleted || 0} / {stats.dailyGoal || 10}</span>
            </div>
            <div className="h-1.5 bg-bg-primary/50 rounded-full border border-border-primary overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, ((stats.dailyTokensCompleted || 0) / (stats.dailyGoal || 10)) * 100)}%` }}
                    className="h-full bg-cyber-blue shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                />
            </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem path="/" icon={<LayoutDashboard size={20} />} label="Realms" />
        <NavItem path="/rewards" icon={<Sword size={20} />} label="Armory" />
        <NavItem path="/perks" icon={<Zap size={20} />} label="Tactical" />
        <NavItem path="/intel" icon={<BarChart size={20} />} label="Intel" />
        <NavItem path="/settings" icon={<SettingsIcon size={20} />} label="Protocol" />
      </nav>
    </aside>
  );
};
