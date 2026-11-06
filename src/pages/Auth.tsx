import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User as UserIcon, Phone, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthProps {
  onLogin: () => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  
  // Error/Message State
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login Flow
        await signInWithEmailAndPassword(auth, email, password);
        onLogin();
      } else {
        // Signup Flow
        if (!username || !phone) throw new Error("Please fill all fields");
        if (phone.length !== 10) throw new Error("Phone number must be 10 digits");

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Create default profile in Firestore
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          username,
          email,
          phone,
          wallet: { deposit: 0, winnings: 0, bonus: 0 },
          isKycVerified: false,
          stats: { matchesPlayed: 0, totalWins: 0, totalKills: 0, totalWinnings: 0 },
          isAdmin: false, // Admin will be set manually via backend/custom claims
          createdAt: serverTimestamp(),
        });

        setSuccessMsg('Account created successfully!');
        onLogin();
      }
    } catch (err: any) {
      // Error Handler
      if (err.code === 'auth/email-already-in-use') setError('Email is already registered.');
      else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') setError('Invalid email or password.');
      else if (err.code === 'auth/weak-password') setError('Password should be at least 6 characters.');
      else setError(err.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onLogin();
    } catch (err: any) {
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-center px-4 py-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[40%] bg-brand-orange/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-sm mx-auto relative z-10">
        
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-20 h-20 bg-brand-card border border-brand-border rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(255,87,34,0.15)] mb-4">
            <span className="text-3xl font-black text-brand-orange">FF</span>
          </motion.div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">
            Fire <span className="text-brand-orange">Fighters</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted mt-1">Enter the Arena</p>
        </div>

        {/* Form Card */}
        <div className="bg-brand-card border border-brand-border rounded-3xl p-6 shadow-2xl">
          
          {/* Toggle Tabs */}
          <div className="flex bg-brand-dark p-1 rounded-xl mb-6">
            <button onClick={() => { setIsLogin(true); setError(''); }} className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${isLogin ? 'bg-brand-orange text-white shadow-lg' : 'text-brand-muted'}`}>Login</button>
            <button onClick={() => { setIsLogin(false); setError(''); }} className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${!isLogin ? 'bg-brand-orange text-white shadow-lg' : 'text-brand-muted'}`}>Register</button>
          </div>

          {/* Error / Success Messages */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-wider">
                <AlertCircle size={14} /> {error}
              </motion.div>
            )}
            {successMsg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2 text-green-500 text-[10px] font-bold uppercase tracking-wider">
                <CheckCircle2 size={14} /> {successMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Inputs */}
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-brand-muted ml-1">Username</label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3 top-3 text-brand-muted" />
                  <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="ProGamer123" className="w-full h-11 bg-brand-dark border border-brand-border rounded-xl pl-10 pr-4 text-xs text-white focus:outline-none focus:border-brand-orange transition-colors" />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-widest text-brand-muted ml-1">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-brand-muted" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="gamer@email.com" className="w-full h-11 bg-brand-dark border border-brand-border rounded-xl pl-10 pr-4 text-xs text-white focus:outline-none focus:border-brand-orange transition-colors" />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-widest text-brand-muted ml-1">Phone (10 Digits)</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-3 text-brand-muted" />
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="9876543210" className="w-full h-11 bg-brand-dark border border-brand-border rounded-xl pl-10 pr-4 text-xs text-white focus:outline-none focus:border-brand-orange transition-colors" />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-widest text-brand-muted ml-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-brand-muted" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full h-11 bg-brand-dark border border-brand-border rounded-xl pl-10 pr-4 text-xs text-white focus:outline-none focus:border-brand-orange transition-colors" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full h-12 bg-brand-orange text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-orange/30 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{isLogin ? 'Login to Arena' : 'Create Account'} <ArrowRight size={16} /></>}
            </button>
          </form>

          {/* Google Login Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px flex-1 bg-brand-border" />
            <span className="text-[9px] font-black uppercase tracking-widest text-brand-muted">OR</span>
            <div className="h-px flex-1 bg-brand-border" />
          </div>

          <button onClick={handleGoogleLogin} disabled={loading} className="w-full h-12 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
            Continue with Google
          </button>

        </div>
      </div>
    </div>
  );
}
