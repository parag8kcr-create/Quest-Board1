import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from './contexts/UserContext.jsx';
import { useSession } from './contexts/SessionContext.jsx';
import { soundManager } from './lib/sounds.js';
import { Sidebar } from './components/Sidebar.jsx';
import { QuestCard } from './components/QuestCard.jsx';
import { SubQuestCard } from './components/SubQuestCard.jsx';
import { RewardsView } from './components/RewardsView.jsx';
import { PerksView } from './components/PerksView.jsx';
import { StatsView } from './components/StatsView.jsx';
import { SettingsView } from './components/SettingsView.jsx';
import { DailyTasks } from './components/DailyTasks.jsx';
import { Leaderboard } from './components/Leaderboard.jsx';
import { NewQuestModal } from './components/NewQuestModal.jsx';
import { NewRewardModal } from './components/NewRewardModal.jsx';
import { NewSubQuestModal } from './components/NewSubQuestModal.jsx';
import { TriviaModal } from './components/TriviaModal.jsx';
import { Plus, ChevronLeft, Volume2, VolumeX, Sparkles, MessageSquare } from 'lucide-react';
import * as Icons from 'lucide-react';
import { STICKERS, PERKS } from './constants.js';

const App = () => {
  const { user, stats, loading, updateStats, addTokens, addXp, completeToken } = useUser();
  const { soundEnabled, setSoundEnabled } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    soundManager.setMuted(!soundEnabled);
  }, [soundEnabled]);

  const [quests, setQuests] = useState([]);
  const [tokenEvents, setTokenEvents] = useState([]);
  const [customRewards, setCustomRewards] = useState([]);
  const [activeQuestId, setActiveQuestId] = useState(null);
  const [isNewQuestModalOpen, setIsNewQuestModalOpen] = useState(false);
  const [isNewRewardModalOpen, setIsNewRewardModalOpen] = useState(false);
  const [isNewSubQuestModalOpen, setIsNewSubQuestModalOpen] = useState(false);
  const [isTriviaOpen, setIsTriviaOpen] = useState(false);
  const [triviaRewardType, setTriviaRewardType] = useState('coins');
  const [celebratingQuestId, setCelebratingQuestId] = useState(null);
  const [animatingTokenId, setAnimatingTokenId] = useState(null);
  const [quote, setQuote] = useState(null);

  // Persistence
  useEffect(() => {
    const savedQuests = localStorage.getItem('nexus_quests');
    const savedEvents = localStorage.getItem('nexus_events');
    const savedRewards = localStorage.getItem('nexus_custom_rewards');
    
    if (savedQuests) setQuests(JSON.parse(savedQuests));
    if (savedEvents) setTokenEvents(JSON.parse(savedEvents));
    if (savedRewards) setCustomRewards(JSON.parse(savedRewards));
  }, []);

  useEffect(() => {
    localStorage.setItem('nexus_quests', JSON.stringify(quests));
    localStorage.setItem('nexus_events', JSON.stringify(tokenEvents));
    localStorage.setItem('nexus_custom_rewards', JSON.stringify(customRewards));
  }, [quests, tokenEvents, customRewards]);

  // Quotes
  const fetchQuote = useCallback(async () => {
    const FALLBACK_QUOTES = [
      { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
      { q: "Focus is a matter of deciding what things you're not going to do.", a: "John Carmack" },
      { q: "Efficiency is doing things right; effectiveness is doing the right things.", a: "Peter Drucker" },
      { q: "The best way to predict the future is to invent it.", a: "Alan Kay" }
    ];

    try {
      // Using the user-requested API
      const response = await fetch('https://api.quotable.io/random');
      if (!response.ok) throw new Error('API offline');
      const data = await response.json();
      if (data && data.content) {
        setQuote({ q: data.content, a: data.author });
      } else {
        throw new Error('Invalid data');
      }
    } catch (err) {
      console.warn('Quotable API unstable, using fallback protocol', err);
      // Try dummyjson as second tier fallback
      try {
        const altResponse = await fetch('https://dummyjson.com/quotes/random');
        const altData = await altResponse.json();
        setQuote({ q: altData.quote, a: altData.author });
      } catch {
        const randomFallback = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
        setQuote(randomFallback);
      }
    }
  }, []);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  // Core Actions
  const handleAddQuest = (newQuest) => {
    setQuests(prev => [newQuest, ...prev]);
    setIsNewQuestModalOpen(false);
    soundManager.play('success');
  };

  const handleDeleteQuest = (questId) => {
    if (confirm('DESTRUCT SECTOR? All data in this realm will be lost.')) {
      setQuests(prev => prev.filter(q => q.id !== questId));
      if (activeQuestId === questId) setActiveQuestId(null);
      soundManager.play('click');
    }
  };

  const handleCompleteToken = (questId, subQuestId) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    const subQuest = quest.subQuests.find(sq => sq.id === subQuestId);
    if (!subQuest) return;

    if (subQuest.completedTokens >= subQuest.totalTokens) return;

    // Update Quests
    const updatedQuests = quests.map(q => {
      if (q.id === questId) {
        return {
          ...q,
          subQuests: q.subQuests.map(sq => {
            if (sq.id === subQuestId) {
              return { ...sq, completedTokens: sq.completedTokens + 1 };
            }
            return sq;
          })
        };
      }
      return q;
    });
    setQuests(updatedQuests);

    // Track Event
    const newEvent = {
        id: crypto.randomUUID(),
        questId,
        subQuestId,
        completedAt: Date.now(),
        duration: subQuest.tokenDuration || 10,
        type: 'token'
    };
    setTokenEvents(prev => [newEvent, ...prev]);

    // Rewards
    completeToken();

    // Check for level up or daily goal
    // ... logic would be here

    // Animation
    setAnimatingTokenId(subQuestId);
    setTimeout(() => setAnimatingTokenId(null), 1000);

    // Check if quest completed
    const updatedQuest = updatedQuests.find(q => q.id === questId);
    const isQuestFinished = updatedQuest.subQuests.every(sq => sq.completedTokens >= sq.totalTokens);
    if (isQuestFinished) {
        setCelebratingQuestId(questId);
        soundManager.play('success');
        setTimeout(() => setCelebratingQuestId(null), 3000);
    }
  };

  const handleUndoToken = (questId, subQuestId) => {
    const updatedQuests = quests.map(q => {
        if (q.id === questId) {
            return {
                ...q,
                subQuests: q.subQuests.map(sq => {
                    if (sq.id === subQuestId) {
                        return { ...sq, completedTokens: Math.max(0, sq.completedTokens - 1) };
                    }
                    return sq;
                })
            };
        }
        return q;
    });
    setQuests(updatedQuests);
    
    // Remove last event for this subquest
    const eventToRemove = tokenEvents.find(e => e.questId === questId && e.subQuestId === subQuestId);
    if (eventToRemove) {
        setTokenEvents(prev => prev.filter(e => e.id !== eventToRemove.id));
        updateStats({ 
          totalTokensEarned: Math.max(0, (stats.totalTokensEarned || 1) - 1),
          tokens: Math.max(0, (stats.tokens || 5) - 5),
          xp: Math.max(0, (stats.xp || 10) - 10),
          dailyTokensCompleted: Math.max(0, (stats.dailyTokensCompleted || 1) - 1)
        });
    }
  };

  const handleUpdateSubQuestTitle = (questId, subQuestId, newTitle) => {
    setQuests(prev => prev.map(q => {
        if (q.id === questId) {
            return {
                ...q,
                subQuests: q.subQuests.map(sq => {
                    if (sq.id === subQuestId) return { ...sq, title: newTitle };
                    return sq;
                })
            };
        }
        return q;
    }));
  };

  const handleAddSubQuest = (data) => {
    if (!activeQuest) return;
    const newSubQuest = {
      id: crypto.randomUUID(),
      ...data,
      completedTokens: 0
    };
    setQuests(prev => prev.map(q => q.id === activeQuest.id ? { ...q, subQuests: [...q.subQuests, newSubQuest] } : q));
    setIsNewSubQuestModalOpen(false);
    soundManager.play('click');
  };

  const handleUpdateSubQuestDuration = (questId, subQuestId, newDuration) => {
    setQuests(prev => prev.map(q => {
        if (q.id === questId) {
            return {
                ...q,
                subQuests: q.subQuests.map(sq => {
                    if (sq.id === subQuestId) return { ...sq, tokenDuration: newDuration };
                    return sq;
                })
            };
        }
        return q;
    }));
  };

  const handleDeleteSubQuest = (questId, subQuestId) => {
    if (confirm('ERASE UNIT? This action is irreversible.')) {
        setQuests(prev => prev.map(q => {
            if (q.id === questId) {
                return {
                    ...q,
                    subQuests: q.subQuests.filter(sq => sq.id !== subQuestId)
                };
            }
            return q;
        }));
        soundManager.play('click');
    }
  };

  const handleRedeemReward = (rewardId, cost, title) => {
    const hasDiscount = stats.activePerks?.some(p => p.perkId === 'discount_chip' && p.expiresAt > Date.now());
    const realCost = hasDiscount ? Math.round(cost * 0.8) : cost;
    
    if (stats.tokens >= realCost) {
        updateStats({ 
            tokens: stats.tokens - realCost,
            totalTokensSpent: (stats.totalTokensSpent || 0) + realCost
        });
        soundManager.play('success');
        alert(`ACCESS GRANTED: ${title} unlocked. Execution protocol engaged.`);
    } else {
        alert('INSUFFICIENT TOKENS. Access denied.');
    }
  };

  const handleAddReward = (newReward) => {
    setCustomRewards(prev => [newReward, ...prev]);
    setIsNewRewardModalOpen(false);
    soundManager.play('success');
  };

  const handleDeleteReward = (rewardId) => {
    setCustomRewards(prev => prev.filter(r => r.id !== rewardId));
  };

  const handleTriviaComplete = (correct) => {
    setIsTriviaOpen(false);
    if (correct) {
        const reward = triviaRewardType === 'daily' ? 50 : 20;
        addTokens(reward);
        addXp(reward);
        alert(`COGNITIVE UPLINK SUCCESSFUL. ${reward} TOKENS EXTRACTED.`);
    } else {
        alert('DATA CORRUPTION DETECTED. Extraction failed.');
    }
  };

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-black text-cyber-blue font-mono uppercase tracking-[0.5em] animate-pulse">Initializing Nexus...</div>;

  const activeQuest = quests.find(q => q.id === activeQuestId);

  return (
    <div 
      data-theme={stats.theme || 'dark'}
      className={`flex min-h-screen bg-bg-primary text-text-primary selection:bg-cyber-blue/30 transition-colors duration-1000 ${stats.theme || 'dark'}`}
    >
      <Sidebar 
        user={user} 
        stats={stats} 
        currentPath={location.pathname} 
        navigate={navigate}
        quote={quote}
        onRefreshQuote={fetchQuote}
      />

      <main className="flex-1 min-h-screen relative overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-20 lg:px-12">
          
          <Routes>
            <Route path="/" element={
              <div className="space-y-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/5 relative overflow-hidden">
                  <div className="space-y-3 relative z-10 transition-all duration-700">
                    <h2 className="text-6xl font-display font-black text-text-primary italic uppercase tracking-tighter leading-none">Nexus <span className="text-cyber-blue">Core</span></h2>
                    <p className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.6em] flex items-center gap-3">
                       <span className="w-2 h-2 rounded-full bg-cyber-blue shadow-[0_0_8px_cyan] animate-pulse" />
                       Operational Frequency: Optimized // Zone 7
                    </p>
                  </div>
                  
                  {quote && (
                    <motion.div 
                      key={quote.q}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={fetchQuote}
                      className="max-w-md p-6 bg-white/5 rounded-[2rem] border-l-4 border-cyber-pink relative overflow-hidden group shadow-2xl glass-card cursor-pointer hover:border-cyber-pink/50 transition-all"
                    >
                      <div className="absolute inset-0 bg-cyber-pink/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
                      <MessageSquare size={40} className="absolute -right-4 -top-4 text-cyber-pink/10 -rotate-12 group-hover:rotate-0 transition-transform" />
                      <p className="text-sm font-display font-bold text-text-primary italic relative z-10 leading-relaxed italic">"{quote.q}"</p>
                      <div className="flex items-center gap-3 mt-3 relative z-10">
                        <div className="h-[1px] w-4 bg-cyber-pink/40" />
                        <p className="text-[9px] font-mono text-cyber-pink uppercase tracking-widest">— {quote.author || quote.a}</p>
                      </div>
                    </motion.div>
                  )}
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                  <div className="xl:col-span-2 space-y-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="p-4 bg-cyber-blue/10 rounded-[1.5rem] border border-cyber-blue/20 shadow-inner overflow-hidden relative group/icon">
                           <div className="absolute inset-0 bg-cyber-blue/5 translate-y-full group-hover/icon:translate-y-0 transition-transform" />
                           <Icons.Target size={24} className="text-cyber-blue relative z-10" />
                        </div>
                        <div>
                           <h3 className="text-lg font-display font-black text-text-primary uppercase tracking-tighter italic">Active Realms</h3>
                           <p className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.2em]">{quests.length} SECTORS INITIALIZED</p>
                        </div>
                      </div>
                      
                      <motion.button 
                        whileHover={{ scale: 1.05, x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsNewQuestModalOpen(true)}
                        className="group relative px-8 py-4 bg-cyber-blue text-black rounded-2xl font-display font-black text-sm uppercase tracking-widest italic shadow-[0_10px_40px_rgba(0,255,255,0.2)] hover:shadow-[0_15px_50px_rgba(0,255,255,0.4)] transition-all overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative z-10 flex items-center gap-3">
                          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                          Initialize Realm
                        </span>
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <AnimatePresence mode="popLayout">
                        {quests.length > 0 ? (
                           quests.map(quest => (
                             <QuestCard 
                               key={quest.id} 
                               quest={quest}
                               isAnimating={animatingTokenId && quest.subQuests.some(sq => sq.id === animatingTokenId)}
                               isCelebrated={celebratingQuestId === quest.id}
                               onClick={() => setActiveQuestId(quest.id)}
                               onDelete={() => handleDeleteQuest(quest.id)}
                             />
                           ))
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-32 rounded-[4rem] border-4 border-dashed border-white/5 flex flex-col items-center justify-center space-y-8 bg-white/[0.02] relative overflow-hidden group"
                          >
                             <div className="absolute inset-0 grid-pattern opacity-[0.03]" />
                             <div className="relative z-10 w-24 h-24 rounded-[2.5rem] bg-glass-bg border border-white/5 flex items-center justify-center text-text-secondary group-hover:text-cyber-blue group-hover:border-cyber-blue group-hover:scale-110 transition-all shadow-2xl">
                                <Sparkles size={48} className="animate-pulse" />
                             </div>
                             <div className="relative z-10 text-center space-y-3">
                               <h3 className="text-2xl font-display font-black text-text-primary/40 italic uppercase tracking-tighter">No Realms Located</h3>
                               <p className="text-[10px] font-mono text-text-secondary/30 uppercase tracking-[0.4em] max-w-xs mx-auto leading-relaxed italic">System idle. deploy your first realm to begin neural extraction protocols.</p>
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <aside className="space-y-12">
                    <section className="space-y-6">
                       <div className="flex items-center gap-4 px-4 overflow-hidden relative">
                          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
                          <h3 className="text-[10px] font-mono font-black text-white/40 uppercase tracking-[0.5em] italic">Tactical Briefing</h3>
                          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
                       </div>
                       {/* Motivation Quote Display */}
                       <AnimatePresence mode="wait">
                         {quote && (
                           <motion.div
                             key={quote.q}
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: -10 }}
                             className="p-6 bg-glass-bg border border-border-primary rounded-[2rem] relative overflow-hidden group hover:border-cyber-blue/50 transition-all cursor-pointer"
                             onClick={fetchQuote}
                           >
                             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Icons.Quote size={40} />
                             </div>
                             <div className="absolute top-0 left-0 w-1 h-full bg-cyber-pink" />
                             <p className="text-sm font-display font-bold text-text-primary italic mb-2 leading-relaxed">"{quote.q}"</p>
                             <p className="text-[9px] font-mono text-text-secondary uppercase tracking-widest">— {quote.a || quote.author}</p>
                           </motion.div>
                         )}
                       </AnimatePresence>

                       <DailyTasks 
                         tasks={stats.dailyNeuralTasks || []} 
                         onComplete={(taskId) => {
                           const task = stats.dailyNeuralTasks.find(t => t.id === taskId);
                           if (!task) return;
                           updateStats({ 
                             dailyNeuralTasks: stats.dailyNeuralTasks.map(t => t.id === taskId ? { ...t, completed: true } : t)
                           });
                           addTokens(task.reward);
                           soundManager.play('success');
                         }}
                         onDismiss={(taskId) => {
                           updateStats({
                             dailyNeuralTasks: stats.dailyNeuralTasks.filter(t => t.id !== taskId)
                           });
                           soundManager.play('click');
                         }}
                       />
                    </section>
                    
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setTriviaRewardType('daily');
                        setIsTriviaOpen(true);
                      }}
                      className="p-8 rounded-[3rem] bg-gradient-to-br from-cyber-blue/10 via-bg-secondary to-cyber-pink/10 border-2 border-white/10 cursor-pointer relative overflow-hidden group shadow-2xl glass-card"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/5 to-cyber-pink/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute -left-12 -top-12 w-32 h-32 bg-cyber-blue/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                        <div className="p-5 rounded-3xl bg-glass-bg border border-white/10 group-hover:bg-cyber-blue group-hover:text-black group-hover:rotate-12 transition-all duration-500 shadow-xl">
                          <Icons.MessageSquare size={36} className="animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-2xl font-display font-black text-text-primary italic uppercase tracking-tighter">Neuro Rift</h4>
                          <p className="text-[9px] font-mono text-text-secondary uppercase tracking-[0.3em] italic">Cognitive Sync Protocol Available</p>
                        </div>
                        <div className="w-full py-4 bg-text-primary text-bg-primary rounded-2xl font-display font-black text-[11px] uppercase tracking-widest italic group-hover:bg-cyber-pink group-hover:text-white transition-colors flex items-center justify-center gap-3">
                          <Icons.Zap size={14} className="fill-current" />
                          Execute Sync (50T)
                        </div>
                      </div>
                    </motion.div>
                    
                    <Leaderboard />
                  </aside>
                </div>
              </div>
            } />

            <Route path="/rewards" element={
              <RewardsView 
                stats={stats} 
                customRewards={customRewards}
                onRedeem={handleRedeemReward}
                onAddReward={() => setIsNewRewardModalOpen(true)}
                onDeleteReward={handleDeleteReward}
              />
            } />

            <Route path="/perks" element={
              <PerksView 
                stats={stats}
                onPurchase={(perk) => {
                  const newPerk = {
                    perkId: perk.id,
                    expiresAt: Date.now() + (perk.durationDays * 24 * 60 * 60 * 1000) || (Date.now() + 24 * 60 * 60 * 1000)
                  };
                  updateStats({
                    tokens: stats.tokens - perk.cost,
                    activePerks: [...(stats.activePerks || []), newPerk]
                  });
                  soundManager.play('success');
                }}
              />
            } />

            <Route path="/intel" element={
              <StatsView 
                quests={quests}
                events={tokenEvents}
                stats={stats}
              />
            } />

            <Route path="/settings" element={
              <SettingsView 
                stats={stats}
                onUpdateTheme={(theme) => updateStats({ theme })}
                onUpdateStats={updateStats}
              />
            } />
          </Routes>
        </div>
      </main>

      {/* SubQuest Panel Overlay */}
      <AnimatePresence>
        {activeQuest && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="fixed top-0 right-0 w-full lg:w-[600px] h-screen bg-bg-secondary border-l border-border-primary z-[60] shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-8 border-b border-border-primary flex items-center justify-between bg-glass-bg">
               <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setActiveQuestId(null)}
                    className="p-3 bg-white/5 rounded-2xl text-text-secondary hover:text-text-primary transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div>
                    <h2 className="text-3xl font-display font-black text-text-primary italic uppercase tracking-tighter leading-none">{activeQuest.title}</h2>
                    <p className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.3em] mt-1">Sector Detail View</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-mono font-black text-cyber-blue uppercase tracking-widest px-3 py-1 bg-cyber-blue/10 rounded-full border border-cyber-blue/20">Phase 01</span>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar pb-32">
               <motion.button
                 whileHover={{ scale: 1.02, x: 5 }}
                 whileTap={{ scale: 0.98 }}
                onClick={() => setIsNewSubQuestModalOpen(true)}
                 className="w-full p-6 border-2 border-dashed border-border-primary rounded-3xl text-[10px] font-mono font-black text-text-secondary hover:text-cyber-blue hover:border-cyber-blue transition-all uppercase tracking-[0.4em] italic mb-8"
               >
                 + Initialize New Objective Unit
               </motion.button>

               <AnimatePresence initial={false}>
                  {activeQuest.subQuests.map((sq) => (
                    <SubQuestCard 
                      key={sq.id}
                      subQuest={sq}
                      onCompleteToken={() => handleCompleteToken(activeQuest.id, sq.id)}
                      onUndoToken={() => handleUndoToken(activeQuest.id, sq.id)}
                      onDelete={() => handleDeleteSubQuest(activeQuest.id, sq.id)}
                      onUpdateDuration={(d) => handleUpdateSubQuestDuration(activeQuest.id, sq.id, d)}
                      onUpdateTitle={(t) => handleUpdateSubQuestTitle(activeQuest.id, sq.id, t)}
                    />
                  ))}
               </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isNewQuestModalOpen && (
          <NewQuestModal 
            isOpen={isNewQuestModalOpen} 
            onClose={() => setIsNewQuestModalOpen(false)} 
            onSubmit={handleAddQuest} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isNewRewardModalOpen && (
          <NewRewardModal 
            isOpen={isNewRewardModalOpen} 
            onClose={() => setIsNewRewardModalOpen(false)} 
            onSubmit={handleAddReward} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isNewSubQuestModalOpen && (
          <NewSubQuestModal 
            isOpen={isNewSubQuestModalOpen} 
            onClose={() => setIsNewSubQuestModalOpen(false)} 
            onSubmit={handleAddSubQuest} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTriviaOpen && (
          <TriviaModal 
            isOpen={isTriviaOpen} 
            onClose={() => setIsTriviaOpen(false)} 
            onComplete={handleTriviaComplete}
            isDaily={triviaRewardType === 'daily'}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
