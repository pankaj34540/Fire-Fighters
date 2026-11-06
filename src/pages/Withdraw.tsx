import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRightFromLine, AlertCircle, Landmark } from 'lucide-react';

export default function Withdraw() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number | ''>('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount < 50) {
      alert("Minimum withdrawal amount is ₹50");
      return;
    }
    if (!upiId || !upiId.includes('@')) {
      alert("Please enter a valid UPI ID");
      return;
    }

    setLoading(true);
    // Yahan hum baad mein Withdraw API call lagayenge
    setTimeout(() => {
      alert(`Withdrawal request for ₹${amount} to ${upiId} is under process.`);
      setLoading(false);
      navigate('/wallet');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-brand-dark pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-brand-dark/90 backdrop-blur-md px-5 h-16 flex items-center border-b border-brand-border">
        <button onClick={() => navigate(-1)} className="p-2 bg-brand-card rounded-full text-white mr-3">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-sm font-black text-white uppercase tracking-wider">Withdraw Money</h1>
          <p className="text-[10px] font-bold text-brand-muted uppercase">Transfer to Bank/UPI</p>
        </div>
      </header>

      <div className="p-5 max-w-lg mx-auto">
        
        {/* Warning Banner */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 mb-6">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-black text-red-500 uppercase tracking-wider mb-1">Important</p>
            <p className="text-[10px] font-bold text-red-500/80 leading-relaxed uppercase tracking-wide">
              Only Winnings can be withdrawn. Bonus and Deposit amounts are strictly for playing matches.
            </p>
          </div>
        </div>

        <form onSubmit={handleWithdraw} className="space-y-4">
          {/* Amount Input */}
          <div className="bg-brand-card border border-brand-border rounded-2xl p-5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2 block">
              Withdrawal Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-brand-muted">₹</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Min ₹50"
                className="w-full h-14 bg-brand-dark border border-brand-border rounded-xl pl-10 pr-4 text-xl font-black text-white focus:outline-none focus:border-brand-orange transition-colors"
              />
            </div>
          </div>

          {/* UPI Input */}
          <div className="bg-brand-card border border-brand-border rounded-2xl p-5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2 block">
              UPI ID / Bank Details
            </label>
            <div className="relative">
              <Landmark size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input 
                type="text" 
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                className="w-full h-14 bg-brand-dark border border-brand-border rounded-xl pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-brand-orange transition-colors"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !amount || !upiId}
            className="w-full h-14 bg-white text-black rounded-xl font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <><ArrowRightFromLine size={18} /> Request Withdrawal</>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
