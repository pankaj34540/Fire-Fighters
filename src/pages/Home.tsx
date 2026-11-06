import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Trophy, ChevronRight, Zap, Target } from 'lucide-react';
import { User, Game } from '../types';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  user: User;
}

export default function Home({ user }: HomeProps) {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  // Dummy games agar database khali ho (Testing ke liye)
  const dummyGames: Game[] = [
    { id: 'freefire', title: 'Free Fire', image: 'https://i.ibb.co/6P8Y7y2/freefire.png', players: 1200 },
    { id: 'bgmi', title: 'BGMI', image: 'https://i.ibb.co/8Y4y5Z3/bgmi.png', players: 850 },
    { id: 'cod', title: 'Call of Duty', image: 'https://i.ibb.co/6P8Y7y2/freefire.png', players: 400 },
  ];

  useEffect(() => {
    // Database se games fetch karna
    const q = query(collection(db, 'games'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const fetchedGames = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game));
        setGames(fetchedGames);
      } else {
        setGames(dummyGames); // Agar DB khali hai toh dummy dikhao
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching games: ", error);
      setGames(dummyGames);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark pb-24">
      {/* ================= HEADER ================= */}
      <header className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-1">Welcome Back,</p>
          <h1 className="text-xl font-black text-white">{user.username || 'Gamer'}</h1>
        </div>
        
        {/* Wallet Balance Shortcut */}
        <div 
          onClick={() => navigate('/wallet')}
          className="flex items-center gap-2 bg-brand-card border border-brand-border px-3 py-2 rounded-xl cursor-pointer hover:border-brand-orange/50 transition-colors"
        >
          <Zap size={16} className="text-brand-orange" />
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-brand-muted uppercase leading-none">Balance</span>
            <span className="text-sm font-black text-white leading-tight">₹{user.wallet?.deposit || 0}</span>
          </div>
        </div>
      </header>

      {/* ================= BANNER ================= */}
      <div className="px-5 mb-6">
        <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-brand-border shadow-lg group">
          <img 
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop" 
            alt="Banner" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-transparent flex flex-col justify-center p-5">
            <span className="bg-brand-orange text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded w-max mb-2">Live Now</span>
            <h2 className="text-xl font-black text-white leading-tight mb-1">Free Fire <br/> Pro Series</h2>
            <p className="text-xs text-brand-muted font-medium mb-3">Prize Pool: ₹5,000</p>
            <button 
              onClick={() => navigate('/tournaments')}
              className="w-max px-4 py-1.5 bg-white text-black text-[10px] font-black uppercase tracking-wider rounded-lg active:scale-95 transition-transform"
            >
              Join Now
            </button>
          </div>
        </div>
      </div>

      {/* ================= QUICK STATS ================= */}
      <div className="px-5 grid grid-cols-2 gap-3 mb-8">
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
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
            <Target size={18} />
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase text-brand-muted">Total Kills</p>
            <p className="text-sm font-black text-white">{user.stats?.totalKills || 0}</p>
          </div>
        </div>
      </div>

      {/* ================= GAMES GRID ================= */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-white">Select Game</h3>
          <button className="text-[10px] font-bold text-brand-orange uppercase tracking-wider flex items-center">
            See All <ChevronRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {games.map((game) => (
              <motion.div
                whileHover={{ y: -4 }}
                key={game.id}
                onClick={() => navigate(`/tournaments/${game.id}`)}
                className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden cursor-pointer group"
              >
                <div className="h-28 relative overflow-hidden bg-brand-dark">
                  <img 
                    src={game.image} 
                    alt={game.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" 
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[8px] font-bold text-white">{game.players} Playing</span>
                  </div>
                </div>
                <div className="p-3 border-t border-brand-border flex items-center justify-between">
                  <h4 className="text-xs font-black text-white uppercase tracking-wide">{game.title}</h4>
                  <Gamepad2 size={14} className="text-brand-orange" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
