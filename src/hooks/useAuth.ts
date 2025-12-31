import { useState, useCallback } from 'react';
import type { User } from '../types/user'; //

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Logique de connexion simulée
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pour l'instant, simulons une connexion réussie avec un utilisateur de test
      const mockUser: User = {
        id: '1',
        firstName: 'Admin',
        email: email,
        department: 'Genius Hub',
        role: 'ADMIN',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        profileCompleted: true,
        phone: '',
        avatar: ''
      };
      
      // Stocker l'utilisateur dans l'état
      setUser(mockUser);
      
      // Stocker dans localStorage pour la persistance
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock-jwt-token');
      
      return mockUser;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const updateProfile = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  // On Vérifie si l'utilisateur est connecté au chargement
  useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erreur lors du parsing de l\'utilisateur:', error);
      }
    }
  });

  return {
    user,
    loading,
    login,
    logout,
    updateProfile
  };
};