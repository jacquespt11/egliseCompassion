// src/services/api/symfony-auth.service.ts
/**
 * Service d'authentification utilisant l'API Symfony
 */

import { apiClient } from './client';
import { LoginCredentials, AuthResponse, ApiUser } from '../../types/api/symfony/entities';

/**
 * Connexion avec email et mot de passe
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

    // Stocker les tokens
    if (response.token) {
        apiClient.setAuthTokens(response.token, response.refreshToken || '');

        // Stocker les données utilisateur
        localStorage.setItem('symfony_user_data', JSON.stringify(response.user));
    }

    return response;
}

/**
 * Rafraîchir le token d'accès
 */
export async function refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('symfony_refresh_token');

    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    const response = await apiClient.post<AuthResponse>('/auth/refresh-token', {
        refreshToken,
    });

    // Mettre à jour les tokens
    if (response.token) {
        apiClient.setAuthTokens(response.token, response.refreshToken || refreshToken);
    }

    return response;
}

/**
 * Déconnexion
 */
export async function logout(): Promise<void> {
    try {
        await apiClient.post('/auth/logout');
    } catch (error) {
        // Continuer même si l'appel échoue
        console.error('Logout API call failed:', error);
    } finally {
        // Nettoyer les tokens et données locales
        apiClient.clearAuthTokens();
    }
}

/**
 * Récupérer l'utilisateur actuellement connecté
 */
export async function getCurrentUser(): Promise<ApiUser> {
    return await apiClient.get<ApiUser>('/auth/me');
}

/**
 * Vérifier si l'utilisateur est authentifié
 */
export function isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
}

/**
 * Récupérer les données utilisateur stockées localement
 */
export function getStoredUser(): ApiUser | null {
    const userData = localStorage.getItem('symfony_user_data');
    return userData ? JSON.parse(userData) : null;
}
