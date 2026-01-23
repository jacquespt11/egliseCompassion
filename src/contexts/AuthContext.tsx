// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';
import { User, UserRole } from '../types/user';
import { PageId } from '../types/routes';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('symfony_access_token');
    return (savedUser && token) ? JSON.parse(savedUser) : null;
  });

  const login = useCallback(async (email: string, password: string) => {
    try {
      // Appel à l'API Symfony réelle
      const authService = await import('../services/api/symfony-auth.service');
      const transformer = await import('../services/transformers/symfony.transformer');

      const authResponse = await authService.login({ email, password });

      // Transformer l'utilisateur API en utilisateur frontend
      const frontendUser = transformer.transformApiUserToUser(authResponse.user);

      setUser(frontendUser);
      localStorage.setItem('user', JSON.stringify(frontendUser));

      toast.success(`Bienvenue ${frontendUser.firstName || frontendUser.email}`);
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error?.message || error.message || 'Erreur de connexion';
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const authService = await import('../services/api/symfony-auth.service');
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      toast.info('Déconnexion réussie');
    }
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      updateUser,
      isAuthenticated: !!user,
      hasRole: (role) => user?.role === role,
    }}>
      {children}
    </AuthContext.Provider>
  );
};