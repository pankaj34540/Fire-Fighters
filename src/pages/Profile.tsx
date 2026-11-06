import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, LogOut, Shield, Trophy, Target, Settings, ChevronRight, Award } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { User } from '../types';

interface ProfileProps {
  user: User;
}

export default function ProfilePage({ user }: ProfileProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark pb-24">
      {/* Header */}
      <header className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-black text-white uppercase tracking-tight">My Profile</h1>
        <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-0.5">Manage your account</p>
      </header>

      <div className="px-5 space-y-5">
        
        {/* User Info Card */}
        <div className="bg-brand-card border border-brand-border rounded-3xl p-6 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 blur-3xl rounded-full" />
          
          <div className="w-16 h-16 rounded-2xl bg-brand-dark border border-brand-border flex items-center justify-center text-brand-orange">
            <UserIcon size={32} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase">{user.username}</h2>
            <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">{user.email}</p>
            <div className="flex items-center gap-1 mt-1 text-[9px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md w-max uppercase">
              <Shield size={10} /> {user.isKycVerified ? 'KYC Verified' : 'Unverified'}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-white mb-3 px-1">My Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-brand-card p-4 rounded-2xl border border-brand-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                <Trophy size={18} />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase text-brand-muted">Total Wins</p>
                <p className="text-sm font-black text-white">{user.stats?.totalWins || 0}</p>
              </div>
            </div>
            <div className="bg-brand-card p-4 rounded-2xl border border-brand-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                <Target size={18} />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase text-brand-muted">Total Kills</p>
                <p className="text-sm font-black text-white">{user.stats?.totalKills || 0}</p>
              </div>
            </div>
            <div className="bg-brand-card p-4 rounded-2xl border border-brand-border flex items-center gap-3 col-span-2">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                <Award size={18} />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase text-brand-muted">Total Winnings</p>
                <p className="text-sm font-black text-green-500">₹{user.stats?.totalWinnings || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-white mb-3 px-1">Settings</h3>
          <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
            
            <button className="w-full flex items-center justify-between p-4 border-b border-brand-border hover:bg-brand-dark/50 transition-colors">
              <div className="flex items-center gap-3">
                <Settings size={18} className="text-brand-muted" />
                <span className="text-xs font-bold text-white uppercase tracking-wide">Account Settings</span>
              </div>
              <ChevronRight size={16} className="text-brand-muted" />
            </button>

            <button className="w-full flex items-center justify-between p-4 border-b border-brand-border hover:bg-brand-dark/50 transition-colors">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-brand-muted" />
                <span className="text-xs font-bold text-white uppercase tracking-wide">KYC Verification</span>
              </div>
              <ChevronRight size={16} className="text-brand-muted" />
            </button>

            {user.isAdmin && (
              <button 
                onClick={() => navigate('/admin')}
                className="w-full flex items-center justify-between p-4 border-b border-brand-border bg-brand-orange/5 hover:bg-brand-orange/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Shield size={18} className="text-brand-orange" />
                  <span className="text-xs font-bold text-brand-orange uppercase tracking-wide">Admin Panel</span>
                </div>
                <ChevronRight size={16} className="text-brand-orange" />
              </button>
            )}

            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 hover:bg-red-500/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <LogOut size={18} className="text-red-500" />
                <span className="text-xs font-bold text-red-500 uppercase tracking-wide group-hover:text-red-400">Logout</span>
              </div>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
