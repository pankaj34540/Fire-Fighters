import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wallet as WalletIcon, Plus, ArrowRightFromLine, History, ArrowDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { User, Transaction } from '../types';

interface WalletProps {
  user: User;
}

export default function WalletPage({ user }: WalletProps) {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
      setTransactions(txs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'transactions');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const totalBalance = (user.wallet?.deposit || 0) + (user.wallet?.winnings || 0) + (user.wallet?.bonus || 0);

  const isCredit = (tx: Transaction) => {
    return tx.type === 'deposit' || tx.type === 'win' || tx.type === 'refund' || tx.type === 'bonus';
  };

  const formatDate = (createdAt: any) => {
    if (!createdAt) return 'RECENT';
    try {
      const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
      return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'RECENT';
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark pb-24">
      
      {/* ================= HEADER ================= */}
      <header className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-black text-white uppercase tracking-tight">My Wallet</h1>
        <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest mt-0.5">Manage your funds</p>
      </header>

      <div className="px-5 space-y-5">
        
        {/* ================= TOTAL BALANCE CARD ================= */}
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-card to-brand-dark border border-brand-border rounded-3xl p-6 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 blur-3xl rounded-full" />
          
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-1">Total Balance</p>
          <h2 className="text-4xl font-black text-white tracking-tight mb-6">₹{totalBalance.toLocaleString()}</h2>

          <div className="grid grid-cols-3 divide-x divide-brand-border/50 text-center">
            <div className="px-1">
              <span className="block text-[9px] font-bold uppercase tracking-wider text-brand-muted mb-1">Deposit</span>
              <span className="text-sm font-black text-blue-400">₹{(user.wallet?.deposit || 0).toLocaleString()}</span>
            </div>
            <div className="px-1">
              <span className="block text-[9px] font-bold uppercase tracking-wider text-brand-muted mb-1">Winnings</span>
              <span className="text-sm font-black text-green-400">₹{(user.wallet?.winnings || 0).toLocaleString()}</span>
            </div>
            <div className="px-1">
              <span className="block text-[9px] font-bold uppercase tracking-wider text-brand-muted mb-1">Bonus</span>
              <span className="text-sm font-black text-brand-orange">₹{(user.wallet?.bonus || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* ================= ACTION BUTTONS ================= */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => navigate('/wallet/add')}
            className="h-14 bg-brand-orange text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 uppercase tracking-widest shadow-lg shadow-brand-orange/20 active:scale-95 transition-all"
          >
            <Plus size={18} className="stroke-[3]" /> Add Money
          </button>
          <button 
            onClick={() => navigate('/wallet/withdraw')}
            className="h-14 bg-brand-card border border-brand-border text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 uppercase tracking-widest hover:bg-brand-border active:scale-95 transition-all"
          >
            <ArrowRightFromLine size={18} /> Withdraw
          </button>
        </div>

        {/* ================= TRANSACTIONS LIST ================= */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Recent Transactions</h3>
            <button className="text-[10px] font-bold text-brand-orange uppercase tracking-wider flex items-center">
              View All <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="py-12 bg-brand-card border border-brand-border rounded-2xl text-center shadow-sm">
                <History size={32} className="mx-auto text-brand-muted mb-3 opacity-40" />
                <p className="text-xs font-black uppercase tracking-wider text-white">No Transactions Yet</p>
                <p className="text-[10px] text-brand-muted mt-1">Your deposits and winnings will appear here.</p>
              </div>
            ) : (
              transactions.map((tx) => {
                const credit = isCredit(tx);
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={tx.id} 
                    className="bg-brand-card border border-brand-border rounded-2xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        credit ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {credit ? '₹' : <ArrowDown size={18} className="stroke-[2.5]" />}
                      </div>
                      <div>
                        <p className="text-xs font-black text-white uppercase tracking-tight truncate max-w-[150px]">
                          {tx.title || tx.type}
                        </p>
                        <p className="text-[9px] font-bold text-brand-muted uppercase tracking-wider mt-0.5">
                          {formatDate(tx.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-black ${credit ? 'text-green-500' : 'text-white'}`}>
                        {credit ? '+' : '-'}₹{tx.amount}
                      </p>
                      <p className="text-[8px] font-black uppercase tracking-wider text-brand-muted mt-0.5">
                        {tx.status}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
