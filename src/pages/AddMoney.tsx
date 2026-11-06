import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, ShieldCheck, Zap } from 'lucide-react';

export default function AddMoney() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  const quickAmounts = [100, 500, 1000, 2000];

  const handleAddMoney = async () => {
    if (!amount || amount < 10) {
      alert("Minimum deposit amount is ₹10");
      return;
    }
    
    setLoading(true);
    // Yahan hum baad mein Cashfree API call lagayenge
    setTimeout(() => {
      alert(`Payment Gateway is not connected yet. You tried to add ₹${amount}`);
      setLoading(false);
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
          <h1 className="text-sm font-black text-white uppercase tracking-wider">Add Money</h1>
          <p className="text-[10px] font-bold text-brand-muted uppercase">Secure Deposit</p>
        </div>
      </header>

      <div className="p-5 max-w-lg mx-auto">
        
        {/* Balance Banner */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-4 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Current Balance</p>
              <p className="text-sm font-black text-white">₹0</p>
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <div className="bg-brand-card border border-brand-border rounded-2xl p-6 mb-6">
          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-2 block text-center">
            Enter Amount (₹)
          </label>
          <div className="relative mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-brand-muted">₹</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0"
              className="w-full h-16 bg-brand-dark border border-brand-border rounded-xl pl-10 pr-4 text-3xl font-black text-white text-center focus:outline-none focus:border-brand-orange transition-colors"
            />
          </div>

          {/* Quick Amounts */}
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                className={`py-2 rounded-lg text-xs font-black transition-all border ${
                  amount === amt 
                    ? 'bg-brand-orange border-brand-orange text-white' 
                    : 'bg-brand-dark border-brand-border text-brand-muted hover:border-brand-orange/50'
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Security Info */}
        <div className="flex items-start gap-3 p-4 bg-green-500/5 border border-green-500/10 rounded-xl mb-6">
          <ShieldCheck size={20} className="text-green-500 shrink-0" />
          <p className="text-[10px] font-bold text-green-500/80 uppercase leading-relaxed tracking-wider">
            100% Secure Payments. Your money will be added instantly to your wallet after successful transaction.
          </p>
        </div>

        {/* Pay Button */}
        <button 
          onClick={handleAddMoney}
          disabled={loading || !amount}
          className="w-full h-14 bg-brand-orange text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-orange/30 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><CreditCard size={18} /> Proceed to Pay</>
          )}
        </button>

      </div>
    </div>
  );
}
