import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundManager } from '../lib/sounds';

const NEURAL_TASKS_POOL = [
  { id: 'walk_15', title: 'Confidence Walk', description: 'Complete a 15-minute posture-focused walking session.', icon: 'Zap', reward: 50, type: 'walking' },
  { id: 'speak_15', title: 'Linguistic Sync', description: '15 minutes of active English speaking practice.', icon: 'Brain', reward: 50, type: 'speaking' },
  { id: 'meditate_10', title: 'Void Meditation', description: '10 minutes of complete mental silencing.', icon: 'Wind', reward: 50, type: 'meditation' },
  { id: 'code_30', title: 'Neural Scripting', description: '30 minutes of deep focus coding/development.', icon: 'Code', reward: 50, type: 'coding' },
  { id: 'read_20', title: 'Data Absorption', description: '20 minutes of technical or growth-focused reading.', icon: 'Book', reward: 50, type: 'reading' },
];

const generateDailyTasks = () => {
  const shuffled = [...NEURAL_TASKS_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3).map(t => ({ ...t, completed: false }));
};

const defaultStats = {
  tokens: 0,
  xp: 0,
  level: 1,
  streak: 0,
  totalTokensEarned: 0,
  totalTokensSpent: 0,
  dailyTokensCompleted: 0,
  dailyGoal: 10,
  streakGoalMet: false,
  defaultTimerDuration: 10,
  premium: false,
  lastActive: Date.now(),
  theme: 'dark',
  activePerks: []
};

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock user login
    const guestUser = {
      uid: 'nexus-explorer-guest',
      isAnonymous: true,
      displayName: 'Guest Explorer',
      email: 'guest@nexus.dev',
      photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'
    };
    setUser(guestUser);

    // Initialize stats from localStorage
    const savedStats = localStorage.getItem('nexus_user_stats');
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        // Migration: rename coins to tokens if needed
        if (parsed.coins !== undefined && parsed.tokens === undefined) {
          parsed.tokens = parsed.coins;
          delete parsed.coins;
        }
        setStats({ ...defaultStats, ...parsed });
      } catch (e) {
        console.error('Failed to parse saved stats', e);
        setStats(defaultStats);
      }
    } else {
      const initialStats = {
        ...defaultStats,
        tokens: 1000,
        streak: 1,
        dailyNeuralTasks: generateDailyTasks()
      };
      setStats(initialStats);
      localStorage.setItem('nexus_user_stats', JSON.stringify(initialStats));
    }
    
    setLoading(false);
  }, []);

  const checkAndSyncStreak = (currentStats) => {
    const now = new Date();
    const lastActiveDate = new Date(currentStats.lastActive || 0);
    
    const isSameDay = now.toDateString() === lastActiveDate.toDateString();
    if (isSameDay) return currentStats;

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const wasActiveYesterday = lastActiveDate.toDateString() === yesterday.toDateString();

    let newStreak = currentStats.streak;
    let newActivePerks = [...(currentStats.activePerks || [])].filter(p => p.expiresAt > Date.now());
    let newDailyTasks = currentStats.dailyNeuralTasks;

    // If new day, reset daily tracking
    const newDailyTokensCompleted = 0;
    const newStreakGoalMet = false;

    if (!newDailyTasks || newDailyTasks.length === 0 || !isSameDay) {
      newDailyTasks = generateDailyTasks();
    }

    if (!wasActiveYesterday && !isSameDay) {
      const ghostPerk = newActivePerks.find(p => p.perkId === 'streak_save');
      if (ghostPerk) {
        newActivePerks = newActivePerks.filter(p => p.perkId !== 'streak_save');
        // Perk saves the streak
        soundManager.play('success');
      } else if (currentStats.streakGoalMet) {
          // If they met yesterday's goal, streak continues? 
          // Usually streak increments when goal is met TODAY.
      } else {
        newStreak = 0;
      }
    }

    return {
      ...currentStats,
      streak: newStreak,
      dailyTokensCompleted: newDailyTokensCompleted,
      streakGoalMet: newStreakGoalMet,
      lastActive: Date.now(),
      activePerks: newActivePerks,
      dailyNeuralTasks: newDailyTasks
    };
  };

  useEffect(() => {
    if (stats.lastActive) {
      const syncedStats = checkAndSyncStreak(stats);
      if (syncedStats !== stats) {
        setStats(syncedStats);
        localStorage.setItem('nexus_user_stats', JSON.stringify(syncedStats));
      }
    }
  }, [stats.lastActive]);

  useEffect(() => {
    // Apply theme
    const theme = stats.theme || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  }, [stats.theme]);

  const updateStats = async (updates) => {
    setStats(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('nexus_user_stats', JSON.stringify(next));
      return next;
    });
  };

  const addTokens = (amount) => {
    soundManager.play('click');
    setStats(prev => {
      const next = { ...prev, tokens: (prev.tokens || 0) + amount };
      localStorage.setItem('nexus_user_stats', JSON.stringify(next));
      return next;
    });
  };

  const completeToken = () => {
    setStats(prev => {
      const newDailyCount = (prev.dailyTokensCompleted || 0) + 1;
      let newStreak = prev.streak;
      let newStreakGoalMet = prev.streakGoalMet;

      if (newDailyCount >= (prev.dailyGoal || 10) && !prev.streakGoalMet) {
        newStreak += 1;
        newStreakGoalMet = true;
        soundManager.play('success');
      }

      const next = {
        ...prev,
        tokens: (prev.tokens || 0) + 5,
        xp: (prev.xp || 0) + 10,
        dailyTokensCompleted: newDailyCount,
        totalTokensEarned: (prev.totalTokensEarned || 0) + 1,
        streak: newStreak,
        streakGoalMet: newStreakGoalMet,
        lastActive: Date.now()
      };
      localStorage.setItem('nexus_user_stats', JSON.stringify(next));
      return next;
    });
  };

  const addXp = (amount) => {
    if (!user) return;
    
    setStats(prev => {
      let newXp = (prev.xp || 0) + amount;
      let newLevel = prev.level || 1;
      let leveledUp = false;

      while (newXp >= newLevel * 100) {
        newXp -= newLevel * 100;
        newLevel++;
        leveledUp = true;
      }

      if (leveledUp) {
        soundManager.play('success');
      }

      const next = { ...prev, xp: newXp, level: newLevel };
      localStorage.setItem('nexus_user_stats', JSON.stringify(next));
      return next;
    });
  };

  return (
    <UserContext.Provider value={{ user, stats, loading, updateStats, addTokens, addXp, completeToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
