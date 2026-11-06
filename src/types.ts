export enum Page {
  LOGIN = 'login',
  SIGNUP = 'signup',
  HOME = 'home',
  TOURNAMENTS = 'tournaments',
  JOIN_MATCH = 'join_match',
  WALLET = 'wallet',
  ADD_MONEY = 'add_money',
  WITHDRAW = 'withdraw',
  PROFILE = 'profile',
  ADMIN = 'admin',
  LEADERBOARD = 'leaderboard',
  MATCH_DETAILS = 'match_details'
}

export interface Game {
  id: string;
  title: string;
  image: string;
  players: number;
}

export interface Tournament {
  id: string;
  gameId: string;
  title: string;
  entryFee: number;
  prize: string;
  totalSlots: number;
  playersCount: number;
  players: { userId: string; username: string; ign?: string; slot?: number }[];
  mode: string;
  map: string;
  time: string;
  status?: 'upcoming' | 'ongoing' | 'completed';
}

export interface UserStats {
  matchesPlayed: number;
  totalWins: number;
  totalKills: number;
  totalWinnings: number;
}

export interface Wallet {
  deposit: number;
  winnings: number;
  bonus: number;
}

export interface User {
  id?: string;
  username: string;
  email: string;
  phone: string;
  wallet: Wallet;
  isKycVerified: boolean;
  isAdmin?: boolean;
  stats: UserStats;
}

export interface Transaction {
  id?: string;
  userId: string;
  type: 'deposit' | 'withdraw' | 'win' | 'entry' | 'refund' | 'bonus';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  title?: string;
  createdAt: any;
}
