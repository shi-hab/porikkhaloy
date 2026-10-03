// File: src/features/GamificationLeaderboard/tierIconStyles.js
import { Award, Crown, Flame, Gem, Medal, Shield, Star, Trophy, Zap } from 'lucide-react';

export const TIER_ICON_STYLES = {
  medal: {
    Icon: Medal,
    badge: 'bg-gradient-to-br from-amber-400 to-amber-600',
    ring: 'ring-amber-100 dark:ring-amber-900/60',
    bar: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
  },
  shield: {
    Icon: Shield,
    badge: 'bg-gradient-to-br from-slate-500 to-slate-700',
    ring: 'ring-slate-100 dark:ring-slate-800',
    bar: 'bg-slate-500',
    text: 'text-slate-600 dark:text-slate-300',
  },
  trophy: {
    Icon: Trophy,
    badge: 'bg-gradient-to-br from-yellow-400 to-amber-500',
    ring: 'ring-yellow-100 dark:ring-yellow-900/60',
    bar: 'bg-yellow-500',
    text: 'text-yellow-600 dark:text-yellow-400',
  },
  crown: {
    Icon: Crown,
    badge: 'bg-gradient-to-br from-violet-500 to-purple-600',
    ring: 'ring-violet-100 dark:ring-violet-900/60',
    bar: 'bg-violet-500',
    text: 'text-violet-600 dark:text-violet-400',
  },
  gem: {
    Icon: Gem,
    badge: 'bg-gradient-to-br from-cyan-400 to-teal-500',
    ring: 'ring-cyan-100 dark:ring-cyan-900/60',
    bar: 'bg-cyan-500',
    text: 'text-cyan-600 dark:text-cyan-400',
  },
  star: {
    Icon: Star,
    badge: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
    ring: 'ring-indigo-100 dark:ring-indigo-900/60',
    bar: 'bg-indigo-500',
    text: 'text-indigo-600 dark:text-indigo-400',
  },
  flame: {
    Icon: Flame,
    badge: 'bg-gradient-to-br from-orange-400 to-red-500',
    ring: 'ring-orange-100 dark:ring-orange-900/60',
    bar: 'bg-orange-500',
    text: 'text-orange-600 dark:text-orange-400',
  },
  zap: {
    Icon: Zap,
    badge: 'bg-gradient-to-br from-lime-400 to-yellow-500',
    ring: 'ring-lime-100 dark:ring-lime-900/60',
    bar: 'bg-lime-500',
    text: 'text-lime-600 dark:text-lime-400',
  },
  award: {
    Icon: Award,
    badge: 'bg-gradient-to-br from-rose-400 to-pink-500',
    ring: 'ring-rose-100 dark:ring-rose-900/60',
    bar: 'bg-rose-500',
    text: 'text-rose-600 dark:text-rose-400',
  },
};

export function getTierIconStyle(key) {
  return TIER_ICON_STYLES[key] || TIER_ICON_STYLES.trophy;
}