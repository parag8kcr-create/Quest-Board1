import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { 
  format,
  eachDayOfInterval,
  subDays,
  subHours,
  subMonths,
  eachMonthOfInterval,
  isAfter
} from 'date-fns';

export const StatsView = ({ quests, events, stats }) => {
  const [period, setPeriod] = useState('week');

  const getFilteredEvents = (p) => {
    const now = new Date();
    let start;
    switch (p) {
      case 'day': start = subHours(now, 24); break;
      case 'week': start = subDays(now, 7); break;
      case 'month': start = subDays(now, 30); break;
      case 'year': start = subMonths(now, 12); break;
      default: start = subDays(now, 7);
    }
    return events.filter(e => isAfter(new Date(e.completedAt), start));
  };

  const filteredEvents = getFilteredEvents(period);
  
  const getChartData = () => {
    const now = new Date();
    switch (period) {
      case 'day': {
        const last24Hours = Array.from({ length: 24 }).map((_, i) => subHours(now, 23 - i));
        return last24Hours.map(date => {
          const hourEvents = events.filter(e => 
            format(new Date(e.completedAt), 'yyyy-MM-dd HH') === format(date, 'yyyy-MM-dd HH')
          );
          const mins = hourEvents.reduce((acc, e) => acc + (e.duration || 10), 0);
          return { label: format(date, 'HH:00'), value: mins };
        });
      }
      case 'week': {
        const last7Days = eachDayOfInterval({
          start: subDays(now, 6),
          end: now
        });
        return last7Days.map(date => {
          const dayEvents = events.filter(e => 
            format(new Date(e.completedAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
          );
          const mins = dayEvents.reduce((acc, e) => acc + (e.duration || 10), 0);
          return { label: format(date, 'EEE'), value: mins };
        });
      }
      case 'month': {
        const last30Days = eachDayOfInterval({
          start: subDays(now, 29),
          end: now
        });
        return last30Days.map((date, i) => {
          const dayEvents = events.filter(e => 
            format(new Date(e.completedAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
          );
          const mins = dayEvents.reduce((acc, e) => acc + (e.duration || 10), 0);
          return { 
            label: i % 5 === 0 ? format(date, 'MMM d') : '', 
            value: mins 
          };
        });
      }
      case 'year': {
        const last12Months = eachMonthOfInterval({
          start: subMonths(now, 11),
          end: now
        });
        return last12Months.map(date => {
          const monthEvents = events.filter(e => 
            format(new Date(e.completedAt), 'yyyy-MM') === format(date, 'yyyy-MM')
          );
          const totalMins = monthEvents.reduce((acc, e) => acc + (e.duration || 10), 0);
          return { label: format(date, 'MMM'), value: Math.round(totalMins / 60) };
        });
      }
      default: return [];
    }
  };

  const chartData = getChartData();

  const categoryMap = filteredEvents.reduce((acc, e) => {
    const quest = quests.find(q => q.id === e.questId);
    const title = quest?.title || 'Unknown';
    acc[title] = (acc[title] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  const COLORS = ['#00ffff', '#ff00ff', '#00ff00', '#ffff00', '#ff4e00', '#7000ff'];

  const totalMinutes = filteredEvents.reduce((acc, e) => acc + (e.duration || 10), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <div className="space-y-10 pb-32">
      <header>
        <h2 className="text-4xl font-display font-black text-text-primary italic uppercase tracking-tighter mb-2">Neural Intel</h2>
        <p className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.3em]">Operational performance and data synchronization</p>
      </header>

      <div className="p-8 lg:p-12 rounded-[3.5rem] bg-glass-bg border-4 border-cyber-blue shadow-[0_0_50px_rgba(0,255,255,0.1)] relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
            <h1 className="text-9xl font-display font-black italic">{stats.level}</h1>
         </div>
         <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex-1">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-cyber-blue flex items-center justify-center text-black shadow-[0_0_20px_rgba(0,255,255,0.4)]">
                     <h2 className="text-2xl font-display font-black italic">{stats.level}</h2>
                  </div>
                  <div>
                     <p className="text-xs font-mono font-black text-cyber-blue uppercase tracking-[0.3em]">Neural Archetype Level</p>
                     <h3 className="text-3xl font-display font-black text-text-primary italic uppercase tracking-tighter">Level {stats.level} Operator</h3>
                  </div>
               </div>
               
               <div className="space-y-3">
                  <div className="flex justify-between items-end">
                     <p className="text-[10px] font-mono font-black text-text-secondary uppercase tracking-widest">Neural Link Sync: {stats.xp} / {stats.level * 100} XP</p>
                     <p className="text-[10px] font-mono font-black text-cyber-blue uppercase tracking-widest">{Math.round((stats.xp / (stats.level * 100)) * 100)}%</p>
                  </div>
                  <div className="h-4 bg-bg-primary/50 rounded-full p-1 border border-border-primary overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(stats.xp / (stats.level * 100)) * 100}%` }}
                        className="h-full bg-gradient-to-r from-cyber-blue to-cyber-pink rounded-full shadow-[0_0_15px_rgba(255,0,255,0.3)]"
                     />
                  </div>
               </div>
            </div>

            <div className="flex gap-8 px-8 py-6 rounded-[2.5rem] bg-white/5 border border-white/5 backdrop-blur-md">
               <div className="text-center">
                  <p className="text-[9px] font-mono font-black text-cyber-pink uppercase mb-1">Max Combo</p>
                  <p className="text-3xl font-display font-black text-text-primary italic">x{stats.maxCombo || 0}</p>
               </div>
               <div className="w-[2px] h-12 bg-white/10" />
               <div className="text-center">
                  <p className="text-[9px] font-mono font-black text-cyber-yellow uppercase mb-1">Total Tokens</p>
                  <p className="text-3xl font-display font-black text-text-primary italic">{stats.tokens}</p>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-6 rounded-[2.5rem] bg-glass-bg border-2 border-border-primary glass-card">
           <p className="text-[8px] font-mono font-black text-cyber-blue uppercase tracking-[0.2em] mb-2 opacity-50">Active Period</p>
           <h3 className="text-xl font-display font-black text-text-primary italic">{totalHours}<span className="text-xs ml-1 text-text-secondary">HRS</span></h3>
        </div>
        <div className="p-6 rounded-[2.5rem] bg-glass-bg border-2 border-border-primary glass-card">
           <p className="text-[8px] font-mono font-black text-cyber-pink uppercase tracking-[0.2em] mb-2 opacity-50">Tokens Secured</p>
           <h3 className="text-xl font-display font-black text-text-primary italic">{filteredEvents.length}<span className="text-xs ml-1 text-text-secondary">TKNS</span></h3>
        </div>
        <div className="p-6 rounded-[2.5rem] bg-glass-bg border-2 border-border-primary glass-card">
           <p className="text-[8px] font-mono font-black text-cyber-green uppercase tracking-[0.2em] mb-2 opacity-50">Peak Intensity</p>
           <h3 className="text-xl font-display font-black text-text-primary italic">{Math.max(0, ...chartData.map(d => d.value))}<span className="text-xs ml-1 text-text-secondary">MIN</span></h3>
        </div>
        <div className="p-6 rounded-[2.5rem] bg-glass-bg border-2 border-border-primary glass-card">
           <p className="text-[8px] font-mono font-black text-cyber-yellow uppercase tracking-[0.2em] mb-2 opacity-50">Avg Intensity</p>
           <h3 className="text-xl font-display font-black text-text-primary italic">{(totalMinutes / (chartData.length || 1)).toFixed(0)}<span className="text-xs ml-1 text-text-secondary">MIN</span></h3>
        </div>
        <div className="p-6 rounded-[2.5rem] bg-glass-bg border-2 border-border-primary glass-card">
           <p className="text-[8px] font-mono font-black text-cyber-pink uppercase tracking-[0.2em] mb-2 opacity-50">Neural Streak</p>
           <h3 className="text-xl font-display font-black text-text-primary italic">{stats.streak}<span className="text-xs ml-1 text-text-secondary">DAYS</span></h3>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex gap-4 p-2 bg-bg-secondary rounded-full border-2 border-border-primary backdrop-blur-xl">
          {['day', 'week', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic transition-all ${
                period === p 
                ? 'bg-text-primary text-bg-primary shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 rounded-[3rem] bg-white/5 border-2 border-white/5 glass-card relative overflow-hidden">
          <h3 className="text-[10px] font-mono font-black text-white/30 uppercase tracking-[0.4em] mb-12 italic">Performance Analytics</h3>
          <div className="h-64 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: '900' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                     backgroundColor: 'rgba(0,0,0,0.9)', 
                     border: '2px solid rgba(255,255,255,0.1)', 
                     borderRadius: '24px',
                     padding: '16px',
                     backdropFilter: 'blur(10px)'
                  }}
                  itemStyle={{ color: '#00ffff', fontWeight: 'bold' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 10 }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {chartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#00ffff' : 'var(--glass-bg)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-8 rounded-[3rem] bg-white/5 border-2 border-white/5 glass-card">
          <h3 className="text-[10px] font-mono font-black text-white/30 uppercase tracking-[0.4em] mb-10 italic">Realm Dominance</h3>
          <div className="flex flex-col items-center gap-10">
             <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData.length > 0 ? categoryData : [{ name: 'Empty', value: 1 }]}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {(categoryData.length > 0 ? categoryData : [{ name: 'Empty', value: 1 }]).map((entry, index) => (
                      <Cell 
                         key={`cell-${index}`} 
                         fill={categoryData.length > 0 ? COLORS[index % COLORS.length] : 'rgba(255,255,255,0.05)'} 
                         className="drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {categoryData.slice(0, 9).map((c, i) => (
           <div key={c.name} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" style={{ color: COLORS[i % COLORS.length], backgroundColor: 'currentColor' }} />
                <span className="text-xs font-black text-text-primary uppercase italic tracking-tighter truncate max-w-[120px]">{c.name}</span>
              </div>
              <span className="text-sm font-mono text-cyber-blue font-black">{c.value} TKNS</span>
           </div>
         ))}
      </div>
      {categoryData.length === 0 && (
         <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border-2 border-dashed border-white/5">
            <p className="text-sm font-mono text-text-secondary italic font-black uppercase tracking-widest">No Intelligence Acquired Yet</p>
         </div>
      )}
    </div>
  );
};
