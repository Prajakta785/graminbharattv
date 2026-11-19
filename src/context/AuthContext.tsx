'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  userRole: UserRole;
  login: (email: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (newRole: UserRole) => void;
  activateSubscription: (planId: 'annual_premium' | 'mobile_monthly', paymentId: string) => Promise<void>;
  toggleWatchlist: (contentId: string) => void;
  addToHistory: (item: {
    contentId: string;
    contentType: 'movie' | 'episode';
    title: string;
    posterUrl: string;
    progressSeconds: number;
    durationSeconds: number;
  }) => void;
  isInWatchlist: (contentId: string) => boolean;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-demo-1',
  name: 'सचिन कदम (नागरिक सदस्य)',
  email: 'sachin.kadam@graminbharat.in',
  phone: '9822123456',
  role: 'super_admin', // Default to super_admin for evaluation, easily toggleable
  subscription: {
    planId: 'annual_premium',
    planName: 'वार्षिक प्रीमियम प्लॅन (Annual Premium)',
    status: 'active',
    startDate: '2026-01-01',
    expiryDate: '2027-01-01',
    amount: 399,
    paymentId: 'pay_demo_init_809137',
    autoRenew: true,
  },
  watchlist: ['m-1', 'ws-1'],
  watchHistory: [
    {
      contentId: 'm-1',
      contentType: 'movie',
      title: 'मातीचे पाश',
      posterUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
      progressSeconds: 2450,
      durationSeconds: 8280,
      lastWatchedAt: '2026-11-18T20:15:00Z',
    },
  ],
  createdAt: '2026-01-01T00:00:00Z',
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  userRole: 'user',
  login: async () => {},
  logout: async () => {},
  switchRole: () => {},
  activateSubscription: async () => {},
  toggleWatchlist: () => {},
  addToHistory: () => {},
  isInWatchlist: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER);

  useEffect(() => {
    // Check local storage for persistent user session
    const saved = localStorage.getItem('gbtv_current_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        setUser(DEFAULT_USER);
      }
    } else {
      localStorage.setItem('gbtv_current_user', JSON.stringify(DEFAULT_USER));
    }

    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, fbUser => {
        if (!fbUser && !saved) {
          // keep demo user
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const saveUser = (u: UserProfile | null) => {
    setUser(u);
    if (typeof window !== 'undefined') {
      if (u) localStorage.setItem('gbtv_current_user', JSON.stringify(u));
      else localStorage.removeItem('gbtv_current_user');
    }
  };

  const login = async (email: string, role: UserRole = 'user') => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      watchlist: [],
      watchHistory: [],
      createdAt: new Date().toISOString(),
    };
    saveUser(newUser);
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await fbSignOut(auth);
      } catch (e) {
        console.error(e);
      }
    }
    saveUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    saveUser(updated);
  };

  const activateSubscription = async (planId: 'annual_premium' | 'mobile_monthly', paymentId: string) => {
    if (!user) return;
    const now = new Date();
    const expiry = new Date();
    if (planId === 'annual_premium') {
      expiry.setFullYear(now.getFullYear() + 1);
    } else {
      expiry.setMonth(now.getMonth() + 1);
    }

    const updated: UserProfile = {
      ...user,
      subscription: {
        planId,
        planName: planId === 'annual_premium' ? 'वार्षिक प्रीमियम प्लॅन' : 'मोबाईल मासिक प्लॅन',
        status: 'active',
        startDate: now.toISOString().split('T')[0],
        expiryDate: expiry.toISOString().split('T')[0],
        amount: planId === 'annual_premium' ? 399 : 149,
        paymentId,
        autoRenew: true,
      },
    };
    saveUser(updated);
  };

  const toggleWatchlist = (contentId: string) => {
    if (!user) return;
    const exists = user.watchlist.includes(contentId);
    const updatedList = exists
      ? user.watchlist.filter(id => id !== contentId)
      : [...user.watchlist, contentId];
    saveUser({ ...user, watchlist: updatedList });
  };

  const isInWatchlist = (contentId: string): boolean => {
    return Boolean(user?.watchlist?.includes(contentId));
  };

  const addToHistory = (item: {
    contentId: string;
    contentType: 'movie' | 'episode';
    title: string;
    posterUrl: string;
    progressSeconds: number;
    durationSeconds: number;
  }) => {
    if (!user) return;
    const history = user.watchHistory || [];
    const filtered = history.filter(h => h.contentId !== item.contentId);
    const updated = [
      {
        ...item,
        lastWatchedAt: new Date().toISOString(),
      },
      ...filtered,
    ].slice(0, 20); // Keep last 20

    saveUser({ ...user, watchHistory: updated });
  };

  const isAdmin = Boolean(
    user &&
    [
      'super_admin',
      'news_editor',
      'content_manager',
      'video_manager',
      'reporter',
      'ad_manager',
      'finance_manager',
    ].includes(user.role)
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin,
        userRole: user?.role || 'user',
        login,
        logout,
        switchRole,
        activateSubscription,
        toggleWatchlist,
        addToHistory,
        isInWatchlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
