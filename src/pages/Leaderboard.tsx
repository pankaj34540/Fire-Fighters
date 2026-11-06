import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Crown } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { User } from '../types';

export default function Leaderboard() {
  const [topPlayers, setTopPlayers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch top 50 players sorted by total winnings
    const q = query(
      collection(db, 'users'), 
      orderBy('stats.totalWinnings', 'desc'), 
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const players = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setTopPlayers(players);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching leaderboard:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark pb-24">
      {/* Header */}
      <header className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-black text-white uppercase tracking-tight">Leaderboard</h1>
        <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-0.5">Top Esports Players</p>
      </header>

      <div className="px-5">
        {/* Top 3 Podium */}
        {!loading && topPlayers.length >= 3 && (
          <div className="flex items-end justify-center gap-2 mb-8 pt-6">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-brand-card border-2 border-slate-400 flex items-center justify-center mb-2 relative">
                <span className="text-lg font-black text-white">{topPlayers[1].username.charAt(0)}</span>
                <Medal size={16} className="absolute -bottom-2 text-slate-400" />
              </div>
              <p className="text-[10px] font-black text-white uppercase max-w-[60px] truncate text-center">{topPlayers[1].username}</p>
              <p className="text-[9px] font-bold text-green-500">₹{topPlayers[1].stats?.totalWinnings || 0}</p>
              <div className="w-16 h-20 bg-slate-800/50 border-t border-slate-600 rounded-t-lg mt-2 flex items-start justify-center pt-2">
                <span className="text-xl font-black text-slate-400">2</span>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-brand-card border-2 border-amber-400 flex items-center justify-center mb-2 relative shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                <span className="text-2xl font-black text-white">{topPlayers[0].username.charAt(0)}</span>
                <Crown size={20} className="absolute -top-4 text-amber-400" />
              </div>
              <p className="text-xs font-black text-white uppercase max-w-[80px] truncate text-center">{topPlayers[0].username}</p>
              <p className="text-[10px] font-bold text-green-500">₹{topPlayers[0].stats?.totalWinnings || 0}</p>
              <div className="w-20 h-28 bg-amber-500/20 border-t border-amber-500/50 rounded-t-lg mt-2 flex items-start justify-center pt-2">
                <span className="text-2xl font-black text-amber-400">1</span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-brand-card border-2 border-amber-700 flex items-center justify-center mb-2 relative">
                <span className="text-sm font-black text-white">{topPlayers[2].username.charAt(0)}</span>
                <Medal size={14} className="absolute -bottom-2 text-amber-700" />
              </div>
              <p className="text-[10px] font-black text-white uppercase max-w-[60px] truncate text-center">{topPlayers[2].username}</p>
              <p className="text-[9px] font-bold text-green-500">₹{topPlayers[2].stats?.totalWinnings || 0}</p>
              <div className="w-16 h-16 bg-amber-900/30 border-t border-amber-800 rounded-t-lg mt-2 flex items-start justify-center pt-2">
                <span className="text-xl font-black text-amber-700">3</span>
              </div>
            </div>
          </div>
        )}

        {/* List of Rest Players */}
        <div className="space-y-2">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            topPlayers.slice(3).map((player, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                key={player.id} 
                className="bg-brand-card border border-brand-border rounded-xl p-3 flex items-center gap-4"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-dark flex items-center justify-center text-xs font-black text-brand-muted">
                  #{index + 4}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black text-white uppercase">{player.username}</p>
                  <p className="text-[9px] font-bold text-brand-muted uppercase">Wins: {player.stats?.totalWins || 0}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-green-500">₹{player.stats?.totalWinnings || 0}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
