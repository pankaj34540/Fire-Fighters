import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, runTransaction, serverTimestamp, collection } from 'firebase/firestore';
import { Tournament, User } from '../types';

export default function JoinMatch() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [match, setMatch] = useState<Tournament | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form State
  const [ign, setIgn] = useState('');
  const [uid, setUid] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // Fetch Match
        const matchDoc = await getDoc(doc(db, 'matches', id));
        if (matchDoc.exists()) {
          setMatch({ id: matchDoc.id, ...matchDoc.data() } as Tournament);
        }

        // Fetch User
        if (auth.currentUser) {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            setUser({ id: userDoc.id, ...userDoc.data() } as User);
          }
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `matches/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!match || !user || !id) return;
    if (!ign || !uid) {
      setError('Please enter your In-Game Name and UID');
      return;
    }

    setJoining(true);
    setError('');

    try {
      // Atomic Transaction for secure wallet deduction & slot booking
      await runTransaction(db, async (transaction) => {
        const matchRef = doc(db, 'matches', id);
        const userRef = doc(db, 'users', user.id!);
        
        // 1. Read latest match & user data
        const matchDoc = await transaction.get(matchRef);
        const userDoc = await transaction.get(userRef);

        if (!matchDoc.exists() || !userDoc.exists()) {
          throw new Error("Data not found");
        }

        const matchData = matchDoc.data() as Tournament;
        const userData = userDoc.data() as User;

        // 2. Validations
        if (matchData.playersCount >= matchData.totalSlots) {
          throw new Error("Match is already full!");
        }
        if (matchData.players?.some(p => p.userId === user.id)) {
          throw new Error("You have already joined this match.");
        }
        const totalBalance = (userData.wallet?.deposit || 0) + (userData.wallet?.winnings || 0) + (userData.wallet?.bonus || 0);
        if (totalBalance < matchData.entryFee) {
          throw new Error("Insufficient wallet balance.");
        }

        // 3. Wallet Deduction Logic (Pehle Bonus katna hai, phir Deposit, phir Winnings)
        let remainingFee = matchData.entryFee;
        let newBonus = userData.wallet?.bonus || 0;
        let newDeposit = userData.wallet?.deposit || 0;
        let newWinnings = userData.wallet?.winnings || 0;

        if (newBonus >= remainingFee) {
          newBonus -= remainingFee;
        } else {
          remainingFee -= newBonus;
          newBonus = 0;
          
          if (newDeposit >= remainingFee) {
            newDeposit -= remainingFee;
          } else {
            remainingFee -= newDeposit;
            newDeposit = 0;
            newWinnings -= remainingFee;
          }
        }

        // 4. Update Match (Add player, increment count)
        const newPlayer = { userId: user.id, username: user.username, ign, uid, slot: matchData.playersCount + 1 };
        transaction.update(matchRef, {
          players: [...(matchData.players || []), newPlayer],
          playersCount: matchData.playersCount + 1
        });

        // 5. Update User Wallet
        transaction.update(userRef, {
          'wallet.bonus': newBonus,
          'wallet.deposit': newDeposit,
          'wallet.winnings': newWinnings
        });

        // 6. Create Transaction Record
        const txRef = doc(collection(db, 'transactions'));
        transaction.set(txRef, {
          userId: user.id,
          type: 'entry',
          amount: matchData.entryFee,
          status: 'completed',
          title: `Joined: ${matchData.title}`,
          matchId: match.id,
          createdAt: serverTimestamp()
        });
      });

      setSuccess(true);
      setTimeout(() => navigate('/tournaments'), 2000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to join match.');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-brand-dark flex items-center justify-center"><Loader2 className="animate-spin text-brand-orange" size={32} /></div>;
  }

  if (!match) {
    return <div className="min-h-screen bg-brand-dark flex items-center justify-center text-white">Match not found</div>;
  }

  return (
    <div className="min-h-screen bg-brand-dark pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-brand-dark/90 backdrop-blur-md px-5 h-16 flex items-center border-b border-brand-border">
        <button onClick={() => navigate(-1)} className="p-2 bg-brand-card rounded-full text-white mr-3">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-sm font-black text-white uppercase tracking-wider">Join Match</h1>
          <p className="text-[10px] font-bold text-brand-muted uppercase">{match.title}</p>
        </div>
      </header>

      <div className="p-5 max-w-lg mx-auto">
        {/* Match Summary Card */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-[10px] font-bold text-brand-muted uppercase mb-1">Entry Fee</p>
              <p className="text-xl font-black text-brand-orange">₹{match.entryFee}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-brand-muted uppercase mb-1">Prize Pool</p>
              <p className="text-xl font-black text-white">{match.prize}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-muted bg-brand-dark p-3 rounded-xl">
            <Shield size={16} className="text-green-500" />
            Secure Transaction & Instant Slot Booking
          </div>
        </div>

        {/* Error / Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-500">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="text-xs font-bold uppercase tracking-wide leading-relaxed">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-500">
            <CheckCircle2 size={18} className="shrink-0" />
            <p className="text-xs font-bold uppercase tracking-wide">Successfully Joined! Redirecting...</p>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleJoin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted ml-1">In-Game Name (IGN)</label>
            <input 
              type="text" 
              value={ign} 
              onChange={(e) => setIgn(e.target.value)} 
              placeholder="e.g. ProGamerFF" 
              className="w-full h-12 bg-brand-card border border-brand-border rounded-xl px-4 text-sm text-white focus:outline-none focus:border-brand-orange transition-colors" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted ml-1">Game UID</label>
            <input 
              type="text" 
              value={uid} 
              onChange={(e) => setUid(e.target.value.replace(/\D/g, ''))} 
              placeholder="e.g. 123456789" 
              className="w-full h-12 bg-brand-card border border-brand-border rounded-xl px-4 text-sm text-white focus:outline-none focus:border-brand-orange transition-colors" 
            />
          </div>

          <button 
            type="submit" 
            disabled={joining || success}
            className="w-full h-14 bg-brand-orange text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-orange/30 active:scale-95 transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
          >
            {joining ? (
              <><Loader2 size={18} className="animate-spin" /> Processing...</>
            ) : (
              `Pay ₹${match.entryFee} & Join`
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
