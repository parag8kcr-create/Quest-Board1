/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const REWARDS = [
  { id: 'coffee', title: 'Caffeine Surge', type: 'Leisure', cost: 20, icon: 'Coffee', color: 'bg-[#FF4E00]' },
  { id: 'movie', title: 'Cinema Protocol', type: 'Leisure', cost: 160, icon: 'Tv', color: 'bg-cyber-pink' },
  { id: 'gaming', title: 'Arena Access', type: 'Leisure', cost: 80, icon: 'Gamepad2', color: 'bg-cyber-blue' },
];

export const PERKS = [
  { id: 'xp_boost', title: 'Neural Overclock', description: '1.5x Credits on all token completions.', cost: 300, icon: 'Zap', durationDays: 3, multiplier: 1.5, type: 'multiplier' },
  { id: 'streak_save', title: 'Temporal Shield', description: 'Protects your streak if you miss a day.', cost: 500, icon: 'Shield', durationDays: 7, type: 'protection' },
  { id: 'discount_chip', title: 'Data Scrambler', description: '20% off all rewards in the Armory.', cost: 400, icon: 'Hash', durationDays: 1, type: 'discount', minLevel: 3 },
  { id: 'double_xp', title: 'Symmetry Overdrive', description: '2x XP earned for 24 hours.', cost: 800, icon: 'Cpu', durationDays: 1, multiplier: 2, type: 'multiplier', minLevel: 5 },
  { id: 'auto_token', title: 'Ghost Protocol', description: 'Instantly completes a random sub-quest.', cost: 1500, icon: 'Ghost', durationDays: 0, type: 'special', minLevel: 10 },
];

export const STICKERS = [
  { id: 'gym', icon: 'Dumbbell', label: 'Gym' },
  { id: 'music', icon: 'Music', label: 'Music' },
  { id: 'study', icon: 'Book', label: 'Study' },
  { id: 'math', icon: 'Atom', label: 'Math' },
  { id: 'code', icon: 'Code', label: 'Coding' },
  { id: 'meditate', icon: 'Wind', label: 'Meditate' },
  { id: 'run', icon: 'Zap', label: 'Run' },
  { id: 'pizza', icon: 'Pizza', label: 'Cheat Meal' },
];

export const PROGRESS_COLORS = {
  0: 'text-red-500',
  20: 'text-orange-500',
  40: 'text-yellow-500',
  60: 'text-lime-500',
  80: 'text-green-500',
  100: 'text-emerald-500',
};
