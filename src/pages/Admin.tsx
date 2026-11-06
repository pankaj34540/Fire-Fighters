import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, Users, Trophy, Settings, ShieldAlert } from 'lucide-react';

export default function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'matches' | 'users'>('matches');

  return (
    <div className="min-h-screen bg-brand-dark pb-24">
      
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 bg-brand-dark/90 backdrop-blur-md px-5 h-16 flex items-center justify-between border-b border-brand-border">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="p-2 bg-brand-card rounded-full text-white mr-3">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              Admin Panel <ShieldAlert size={14} className="text-brand-orange" />
            </h1>
            <p className="text-[10px] font-bold text-brand-muted uppercase">Control Center</p>
          </div>
        </div>
      </header>

      <div className="p-5 max-w-lg mx-auto">
        
        {/* ================= QUICK ACTIONS ================= */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button 
            onClick={() => alert('Create Match Modal will open here')}
            className="bg-brand-orange/10 border border-brand-orange/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-brand-orange/20 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlusCircle size={20} />
            </div>
            <span className="text-[10px] font-black text-brand-orange uppercase tracking-wider text-center">Create Match</span>
          </button>

          <button 
            onClick={() => alert('User Management Modal will open here')}
            className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-blue-500/20 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-wider text-center">Manage Users</span>
          </button>
        </div>

        {/* ================= TABS ================= */}
        <div className="flex bg-brand-card p-1 rounded-xl border border-brand-border mb-6">
          <button 
            onClick={() => setActiveTab('matches')}
            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'matches' ? 'bg-brand-dark text-white shadow-sm' : 'text-brand-muted hover:text-white'
            }`}
          >
            <Trophy size={14} /> Active Matches
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'users' ? 'bg-brand-dark text-white shadow-sm' : 'text-brand-muted hover:text-white'
            }`}
          >
            <Users size={14} /> All Users
          </button>
        </div>

        {/* ================= CONTENT AREA ================= */}
        <div className="space-y-3">
          {activeTab === 'matches' && (
            <div className="text-center py-10 bg-brand-card border border-brand-border rounded-2xl">
              <Trophy size={32} className="mx-auto text-brand-muted mb-2 opacity-50" />
              <h3 className="text-xs font-black text-white uppercase">No Matches Created</h3>
              <p className="text-[10px] text-brand-muted mt-1">Click on "Create Match" to host a new tournament.</p>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="text-center py-10 bg-brand-card border border-brand-border rounded-2xl">
              <Users size={32} className="mx-auto text-brand-muted mb-2 opacity-50" />
              <h3 className="text-xs font-black text-white uppercase">No Users Loaded</h3>
              <p className="text-[10px] text-brand-muted mt-1">User management will be available after Firebase connection.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
