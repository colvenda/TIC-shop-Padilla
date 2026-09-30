'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { AuthService } from '@/services/firebase/auth.service';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange(async (nextFirebaseUser) => {
      setFirebaseUser(nextFirebaseUser);

      if (nextFirebaseUser) {
        try {
          const userData = await AuthService.getUserById(nextFirebaseUser.uid);
          setUser(userData);
        } catch (error) {
          console.error('Error al cargar el usuario:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    const newUser = await AuthService.register(email, password, name, role);
    setUser(newUser);
  };

  const login = async (email: string, password: string) => {
    await AuthService.login(email, password);
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
    setFirebaseUser(null);
  };

  const value = useMemo(
    () => ({ user, firebaseUser, loading, register, login, logout }),
    [user, firebaseUser, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
