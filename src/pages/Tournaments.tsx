import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Clock, Users, ArrowRight, Gamepad2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { Tournament } from '../types';

export default function Tournaments() {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'completed'>('live');

  // Dummy data for testing (Agar Firebase connect nahi hai tabhi dikhega)
  const dummyTournaments: Tournament[] = [
    {
      id: '1',
      gameId: 'freefire',
      title: 'Free Fire Solo Showdown',
      entryFee: 50,
      prize: '₹1,000',
      totalSlots: 48,
      playersCount: 32,
      players: [],
      mode: 'Solo',
      map: 'Bermuda',
      time: 'Today, 8:00 PM',
      status: 'upcoming'
    },
    {
      id: '2',
      gameId: 'freefire',
      title: 'Squad Clash',
      entryFee: 100,
      prize: '₹2,500',
      totalSlots: 12,
      playersCount: 12,
      players: [],
      mode: 'Squad',
      map: 'Purgatory',
      time: 'Today, 9:30 PM',
      status: 'live'
    }
  ];

  useEffect(() => {
    // Database se matches fetch karna
    const q = query(collection(db, 'matches'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tournament));
        setTournaments(fetched);
      } else {
        setTournaments(dummyTournaments);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching matches: ", error);
      setTournaments(dummyTournaments);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredTournaments = tournaments.filter(t => {
    if (activeTab === 'completed') return t.status === 'completed';
    if (activeTab === 'live') return t.status === 'ongoing' || t.status === 'live';
    return t.status === 'upcoming';
  });

  return (
    <div className="min-h-screen bg-brand-dark pb-24">
      
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 bg-brand-dark/90 backdrop-blur-md px-5 pt-6 pb-4 border-b border-brand-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tight">Tournaments</h1>
            <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-0.5">Choose your battle</p>
          </div>
          <div className="w-10 h-10 bg-brand-card border border-brand-border rounded-xl flex items-center justify-center text-brand-orange">
            <Gamepad2 size={20} />
          </div>
        </div>

        {/* Search Bar (Optional for now) */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-3 text-brand-muted" />
          <input 
            type="text" 
            placeholder="Search tournaments..." 
            className="w-full h-10 bg-brand-card border border-brand-border rounded-xl pl-10 pr-4 text-xs text-white focus:outline-none focus:border-brand-orange transition-colors"
          />
        </div>

        {/* Tabs */}
        <div className="flex bg-brand-card p-1 rounded-xl border border-brand-border">
          {['live', 'upcoming', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                activeTab === tab ? 'bg-brand-orange text-white shadow-lg' : 'text-brand-muted hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* ================= MATCHES LIST ================= */}
      <div className="px-5 mt-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredTournaments.length === 0 ? (
          <div className="text-center py-20 bg-brand-card border border-brand-border rounded-2xl">
            <Trophy size={40} className="mx-auto text-brand-muted mb-3 opacity-50" />
            <h3 className="text-sm font-black text-white uppercase">No Matches Found</h3>
            <p className="text-xs text-brand-muted mt-1">Check back later for new tournaments.</p>
          </div>
        ) : (
          filteredTournaments.map((match) => {
            const isFull = match.playersCount >= match.totalSlots;
            const fillPercentage = (match.playersCount / match.totalSlots) * 100;

            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={match.id}
                className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-lg group"
              >
                {/* Card Header */}
                <div className="p-4 border-b border-brand-border flex items-start justify-between bg-gradient-to-r from-brand-card to-brand-dark">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase leading-tight mb-1">{match.title}</h3>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-brand-muted uppercase">
                      <span className="flex items-center gap-1"><Gamepad2 size={12} /> {match.mode}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {match.time}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-brand-muted uppercase">Prize Pool</p>
                    <p className="text-base font-black text-brand-orange">{match.prize}</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  {/* Slots Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-[10px] font-bold uppercase mb-1.5">
                      <span className="text-brand-muted">Slots Filled</span>
                      <span className={isFull ? 'text-red-500' : 'text-brand-orange'}>
                        {match.playersCount} / {match.totalSlots}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-brand-dark rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-brand-orange'}`}
                        style={{ width: `${fillPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer: Price and Join Button */}
                  <div className="flex items-center justify-between mt-5">
                    <div>
                      <p className="text-[9px] font-bold text-brand-muted uppercase mb-0.5">Entry Fee</p>
                      <p className="text-sm font-black text-white">₹{match.entryFee}</p>
                    </div>
                    
                    <button
                      onClick={() => navigate(`/join-match/${match.id}`)}
                      disabled={isFull}
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                        isFull 
                          ? 'bg-brand-dark text-brand-muted border border-brand-border cursor-not-allowed'
                          : 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20 active:scale-95 hover:bg-brand-orange/90'
                      }`}
                    >
                      {isFull ? 'Full' : 'Join Match'} <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
