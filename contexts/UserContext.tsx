import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRICING_PLANS, type PlanId } from '../config/pricing';
import { auth } from '../services/authService';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface User {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  photoURL?: string;
  subscription: {
    planId: PlanId;
    status: 'active' | 'trialing' | 'canceled' | 'past_due';
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
  };
  usage: {
    postsThisMonth: number;
    lastResetDate: Date;
  };
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateSubscription: (planId: PlanId) => void;
  incrementPostCount: () => void;
  canUseFeature: (feature: keyof typeof PRICING_PLANS.free.limits) => boolean;
  getRemainingPosts: () => number;
  isProUser: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || undefined,
          photoURL: firebaseUser.photoURL || undefined,
          displayName: firebaseUser.displayName || undefined,
          subscription: {
            planId: 'free', // Default to free, update from database
            status: 'active'
          },
          usage: {
            postsThisMonth: 0,
            lastResetDate: new Date()
          }
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        // User is signed out
        const storedUser = localStorage.getItem('user');
        if (storedUser && JSON.parse(storedUser).id !== 'guest') {
          // Clear user data on sign out
          setUser(null);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Reset monthly usage if needed
    if (user && user.usage.lastResetDate) {
      const lastReset = new Date(user.usage.lastResetDate);
      const now = new Date();
      if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
        setUser(prev => prev ? {
          ...prev,
          usage: {
            postsThisMonth: 0,
            lastResetDate: now
          }
        } : null);
      }
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // In a real app, this would call your backend API
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const loggedInUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        subscription: {
          planId: 'free',
          status: 'active'
        },
        usage: {
          postsThisMonth: 0,
          lastResetDate: new Date()
        }
      };
      
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateSubscription = (planId: PlanId) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      subscription: {
        ...user.subscription,
        planId,
        status: 'active' as const
      }
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const incrementPostCount = () => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      usage: {
        ...user.usage,
        postsThisMonth: user.usage.postsThisMonth + 1
      }
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const canUseFeature = (feature: keyof typeof PRICING_PLANS.free.limits): boolean => {
    if (!user) return false;
    
    const userPlan = PRICING_PLANS[user.subscription.planId];
    const featureValue = userPlan.limits[feature];
    
    // For boolean features
    if (typeof featureValue === 'boolean') {
      return featureValue;
    }
    
    // For numeric limits (-1 means unlimited)
    if (typeof featureValue === 'number') {
      return featureValue === -1 || featureValue > 0;
    }
    
    // For array features (platforms, contentTypes)
    if (Array.isArray(featureValue)) {
      return featureValue.includes('all') || featureValue.length > 0;
    }
    
    return false;
  };

  const getRemainingPosts = (): number => {
    if (!user) return 0;
    
    const plan = PRICING_PLANS[user.subscription.planId];
    if (plan.limits.postsPerMonth === -1) return -1; // Unlimited
    
    return Math.max(0, plan.limits.postsPerMonth - user.usage.postsThisMonth);
  };

  const isProUser = (): boolean => {
    return user?.subscription.planId === 'pro';
  };

  return (
    <UserContext.Provider value={{
      user,
      loading,
      login,
      logout,
      updateSubscription,
      incrementPostCount,
      canUseFeature,
      getRemainingPosts,
      isProUser
    }}>
      {children}
    </UserContext.Provider>
  );
};