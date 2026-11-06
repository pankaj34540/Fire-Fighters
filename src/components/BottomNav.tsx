import React from 'react';
import { Home, Trophy, Wallet, User, BarChart3 } from 'lucide-react';
import { Page } from '../types';

interface BottomNavProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export default function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  const navItems = [
    { id: Page.HOME, icon: Home, label: 'Home' },
    { id: Page.TOURNAMENTS, icon: Trophy, label: 'Play' },
    { id: Page.LEADERBOARD, icon: BarChart3, label: 'Ranks' },
    { id: Page.WALLET, icon: Wallet, label: 'Wallet' },
    { id: Page.PROFILE, icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-brand-card border-t border-brand-border pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 h-16">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 relative ${
                isActive ? 'text-brand-orange' : 'text-brand-muted hover:text-white'
              }`}
            >
              {/* Active Indicator Glow */}
              {isActive && (
                <div className="absolute top-0 w-8 h-1 bg-brand-orange rounded-b-full shadow-[0_0_10px_rgba(255,87,34,0.5)]" />
              )}
              
              <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
              <span className={`text-[10px] font-bold tracking-wider ${isActive ? 'text-brand-orange' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
