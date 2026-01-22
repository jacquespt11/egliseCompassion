// src/hooks/useAuth.ts
/**
 * Hook personnalisé pour gérer l'authentification avec l'API Symfony
 * Remplace la logique simulée par des appels API réels
 * @version 2.0.0 - Intégration API Symfony
 */

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import authService from '../services/api/auth.service';
import { SymfonyUser } from '../types/api/symfony/user';

/**
 * Interface pour l'état d'authentification
 */
interface AuthState {
  /** Utilisateur actuellement connecté */
  user: SymfonyUser | null;
  
  /** Indique si une opération est en cours */
  loading: boolean;
  
  /** Message d'erreur éventuel */
  error: string | null;
  
  /** Indique si l'utilisateur est authentifié */
  isAuthenticated: boolean;
}

/**
 * Interface pour le hook useAuth
 */
interface UseAuthReturn extends AuthState {
  /** Connecte un utilisateur */
  login: (identifier: string, password: string) => Promise<boolean>;
  
  /** Déconnecte l'utilisateur */
  logout: () => Promise<void>;
  
  /** Met à jour le profil utilisateur */
  updateProfile: (userData: Partial<SymfonyUser>) => Promise<void>;
  
  /** Rafraîchit le token d'accès */
  refreshToken: () => Promise<boolean>;
  
  /** Vérifie si l'utilisateur a un rôle spécifique */
  hasRole: (role: SymfonyUser['role']) => boolean;
  
  /** Vérifie si l'utilisateur peut approuver des réservations */
  canApproveReservations: () => boolean;
  
  /** Vérifie si l'utilisateur peut créer des réservations */
  canCreateReservations: () => boolean;
}

/**
 * Hook d'authentification avec l'API Symfony
 * @returns Fonctions et état d'authentification
 */
export const useAuth = (): UseAuthReturn => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  });

  /**
   * Initialise l'état d'authentification au chargement
   */
  useEffect(() => {
    const initializeAuth = async () => {
      setState(prev => ({ ...prev, loading: true }));
      
      try {
        // Vérifier si l'utilisateur est déjà connecté
        const storedUser = authService.getCurrentUser();
        const isAuthenticated = authService.isAuthenticated();
        
        if (storedUser && isAuthenticated) {
          setState({
            user: storedUser,
            loading: false,
            error: null,
            isAuthenticated: true,
          });
        } else {
          // Nettoyer les données invalides
          authService.clearAuthTokens();
          setState({
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error('Erreur d\'initialisation de l\'authentification:', error);
        setState({
          user: null,
          loading: false,
          error: 'Erreur d\'initialisation',
          isAuthenticated: false,
        });
      }
    };

    initializeAuth();
  }, []);

  /**
   * Connecte un utilisateur avec l'API Symfony
   */
  const login = useCallback(async (identifier: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authService.login({ identifier, password });
      
      if (response.success && response.data) {
        const user = response.data.user;
        
        setState({
          user,
          loading: false,
          error: null,
          isAuthenticated: true,
        });
        
        toast.success(`Bienvenue ${user.fullName} !`);
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error?.message || 'Échec de la connexion',
        }));
        
        toast.error(response.error?.message || 'Identifiants invalides');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message 
        || error.message 
        || 'Erreur de connexion';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      
      toast.error(errorMessage);
      return false;
    }
  }, []);

  /**
   * Déconnecte l'utilisateur
   */
  const logout = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      await authService.logout();
      
      setState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
      
      toast.info('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      
      // Forcer la déconnexion même en cas d'erreur
      authService.clearAuthTokens();
      setState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
      
      toast.info('Déconnecté');
    }
  }, []);

  /**
   * Met à jour le profil utilisateur
   */
  const updateProfile = useCallback(async (userData: Partial<SymfonyUser>): Promise<void> => {
    if (!state.user) {
      throw new Error('Aucun utilisateur connecté');
    }
    
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      // Mettre à jour localement immédiatement pour un feedback instantané
      const updatedUser = { ...state.user, ...userData };
      authService.updateUserData(updatedUser);
      
      setState(prev => ({
        ...prev,
        user: updatedUser,
        loading: false,
      }));
      
      toast.success('Profil mis à jour');
      
      // Note: Dans une version future, on ajoutera un appel API pour sauvegarder
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Erreur lors de la mise à jour',
      }));
      
      toast.error('Erreur lors de la mise à jour du profil');
      throw error;
    }
  }, [state.user]);

  /**
   * Rafraîchit le token d'accès
   */
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      // La logique de refresh est gérée par l'intercepteur axios
      // Cette fonction est principalement pour déclencher manuellement
      const refreshToken = localStorage.getItem('symfony_refresh_token');
      
      if (!refreshToken) {
        return false;
      }
      
      const response = await authService.refreshToken(refreshToken);
      return response.success;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      return false;
    }
  }, []);

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  const hasRole = useCallback((role: SymfonyUser['role']): boolean => {
    return state.user?.role === role;
  }, [state.user]);

  /**
   * Vérifie si l'utilisateur peut approuver des réservations
   */
  const canApproveReservations = useCallback((): boolean => {
    return authService.canApproveReservations();
  }, []);

  /**
   * Vérifie si l'utilisateur peut créer des réservations
   */
  const canCreateReservations = useCallback((): boolean => {
    return authService.canCreateReservations();
  }, []);

  return {
    ...state,
    login,
    logout,
    updateProfile,
    refreshToken,
    hasRole,
    canApproveReservations,
    canCreateReservations,
  };
};

export default useAuth;