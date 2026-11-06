import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Page, User } from './types';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { AnimatePresence, motion } from 'motion/react';

// Components (Inhe hum agle step me banayenge)
import BottomNav from './components/BottomNav';
import Header from './components/Header';

// Pages
import Auth from './pages/Auth';
import Home from './pages/Home';
import Tournaments from './pages/Tournaments';
import WalletPage from './pages/Wallet';
import ProfilePage from './pages/Profile';
import AdminPage from './pages/Admin';
import Leaderboard from './pages/Leaderboard';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            // Check if user is admin via Custom Claims (SECURE)
            const tokenResult = await firebaseUser.getIdTokenResult();
            const isAdmin = tokenResult.claims.admin === true;

            setUser({ id: userDoc.id, ...data, isAdmin } as User);
          } else {
            // Create default profile if it doesn't exist
            const newUser: User = {
              username: firebaseUser.displayName || `Player_${firebaseUser.uid.slice(0, 5)}`,
              email: firebaseUser.email || '',
              phone: firebaseUser.phoneNumber || '',
              wallet: { deposit: 0, winnings: 0, bonus: 0 },
              isKycVerified: false,
              stats: { matchesPlayed: 0, totalWins: 0, totalKills: 0, totalWinnings: 0 },
              isAdmin: false
            };
            await setDoc(userDocRef, { ...newUser, createdAt: serverTimestamp() });
            setUser(newUser);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        setUser(null);
        if (!['/login', '/signup'].includes(location.pathname)) {
          navigate('/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, [navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-xs font-black uppercase tracking-widest text-brand-orange">Loading Fire Fighters...</p>
      </div>
    );
  }

  // Derive current page for BottomNav
  let currentPage = Page.HOME;
  if (location.pathname.includes('tournaments')) currentPage = Page.TOURNAMENTS;
  if (location.pathname.includes('wallet')) currentPage = Page.WALLET;
  if (location.pathname.includes('profile')) currentPage = Page.PROFILE;

  const showChrome = user && !['/login', '/signup'].includes(location.pathname);
  const showHeader = showChrome && !['/home', '/tournaments', '/wallet'].includes(location.pathname);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) return <Navigate to="/login" replace />;
    return <>{children}</>;
  };

  return (
    <div className="min-h-screen bg-brand-dark relative selection:bg-brand-orange/20">
      <ScrollToTop />
      
      {showHeader && <Header user={user} onPageChange={(page) => navigate(`/${page}`)} />}
      
      <main className="mx-auto max-w-lg min-h-screen bg-brand-dark overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname.split('/')[1]}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <Routes location={location}>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/login" element={<Auth onLogin={() => navigate('/home')} />} />
              <Route path="/signup" element={<Auth onLogin={() => navigate('/home')} />} />
              
              <Route path="/home" element={<ProtectedRoute><Home user={user!} /></ProtectedRoute>} />
              <Route path="/tournaments" element={<ProtectedRoute><Tournaments /></ProtectedRoute>} />
              <Route path="/wallet" element={<ProtectedRoute><WalletPage user={user!} /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage user={user!} /></ProtectedRoute>} />
              <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
              
              {/* Admin Route - Protected via Custom Claims */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  {user?.isAdmin ? <AdminPage /> : <Navigate to="/home" replace />}
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {showChrome && (
        <BottomNav 
          currentPage={currentPage} 
          onPageChange={(page) => navigate(`/${page}`)} 
        />
      )}
    </div>
  );
}
