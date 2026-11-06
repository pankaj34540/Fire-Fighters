
import React from 'react';
import { ChevronLeft, Wallet, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Page } from '../types';

interface HeaderProps {
  user: User;
  onPageChange?: (page: Page) => void;
}

export default function Header({ user, onPageChange }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/home';
  const totalBalance = (user.wallet?.deposit || 0) + (user.wallet?.winnings || 0) + (user.wallet?.bonus || 0);

  return (
    <header className="sticky top-0 z-40 bg-brand-dark/80 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 h-16">
        
        {/* Left Side: Back Button or Title */}
        <div className="flex items-center gap-3">
          {!isHome && (
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 bg-brand-card rounded-full text-white hover:bg-brand-border transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-sm font-black uppercase tracking-widest text-white">
              Fire <span className="text-brand-orange">Fighters</span>
            </h1>
          </div>
        </div>

        {/* Right Side: Wallet & Notifications */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onPageChange && onPageChange(Page.WALLET)}
            className="flex items-center gap-2 bg-brand-card border border-brand-border px-3 py-1.5 rounded-xl shadow-sm hover:border-brand-orange/50 transition-colors"
          >
            <Wallet size={16} className="text-brand-orange" />
            <span className="text-xs font-black text-white">₹{totalBalance.toLocaleString()}</span>
          </button>

          <button className="p-2 bg-brand-card rounded-full text-brand-muted hover:text-white transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full border border-brand-card" />
          </button>
        </div>

      </div>
    </header>
  );
}
