// src/services/api/client.ts
/**
 * Client HTTP configuré pour communiquer avec l'API Symfony
 * Gère l'authentification, les tokens JWT, et les erreurs communes
 * @version 1.0.0
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { toast } from 'sonner';
import { SymfonyApiResponse } from '../../types/api/symfony/entities';

// Configuration de base
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.mycompassionspace.com/api';
const AUTH_TOKEN_KEY = 'symfony_access_token';
const REFRESH_TOKEN_KEY = 'symfony_refresh_token';
const USER_DATA_KEY = 'symfony_user_data';

/**
 * Interface pour la configuration du client API
 */
interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  withCredentials?: boolean;
}

/**
 * Classe client API pour Symfony avec gestion de tokens JWT
 */
class SymfonyApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor(config: ApiClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      withCredentials: config.withCredentials || false,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Configure les intercepteurs pour gérer les tokens et erreurs
   */
  private setupInterceptors(): void {
    // Intercepteur de requête : ajoute le token JWT
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepteur de réponse : gère les tokens expirés et extrait les données Symfony
    this.client.interceptors.response.use(
      (response: AxiosResponse<SymfonyApiResponse>) => {
        // Extraire automatiquement le champ 'data' des réponses Symfony
        if (response.data && typeof response.data === 'object' && 'success' in response.data) {
          // Conserver meta pour la pagination si présent
          const meta = response.data.meta;
          const unwrappedData = response.data.data;

          // Retourner les données unwrapped avec meta attaché si disponible
          return {
            ...response,
            data: unwrappedData,
            meta: meta, // Accessible via response.meta
          } as any;
        }
        return response;
      },
      async (error: AxiosError<SymfonyApiResponse>) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Si l'erreur est 401 et pas encore retentée
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAccessToken();
            if (newToken) {
              originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${newToken}`,
              };
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.handleAuthError();
            return Promise.reject(refreshError);
          }
        }

        // Gestion des autres erreurs
        return this.handleApiError(error);
      }
    );
  }

  /**
   * Récupère le token d'accès depuis le localStorage
   */
  private getAccessToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  /**
   * Rafraîchit le token d'accès avec le refresh token
   */
  private async refreshAccessToken(): Promise<string | null> {
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.refreshSubscribers.push((token) => resolve(token));
      });
    }

    this.isRefreshing = true;
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      this.handleAuthError();
      return null;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
        refreshToken,
      });

      if (response.data.success) {
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
        if (newRefreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
        }

        // Notifier tous les abonnés
        this.refreshSubscribers.forEach((callback) => callback(accessToken));
        this.refreshSubscribers = [];

        return accessToken;
      }
      return null;
    } catch (error) {
      this.handleAuthError();
      return null;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Gère les erreurs d'authentification
   */
  private handleAuthError(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);

    toast.error('Session expirée. Veuillez vous reconnecter.');

    // Redirection vers la page de connexion
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  /**
   * Gère les erreurs API communes
   */
  private handleApiError(error: AxiosError<SymfonyApiResponse>): Promise<never> {
    const status = error.response?.status;
    const data = error.response?.data;

    // Extraire le message d'erreur du format Symfony
    const errorMessage = data?.error?.message || data?.message;

    switch (status) {
      case 400:
        toast.error(errorMessage || 'Requête invalide');
        break;
      case 403:
        toast.error(errorMessage || 'Accès non autorisé');
        break;
      case 404:
        toast.error(errorMessage || 'Ressource non trouvée');
        break;
      case 409:
        toast.error(errorMessage || 'Conflit de données');
        break;
      case 422:
        toast.error(errorMessage || 'Données invalides');
        break;
      case 500:
        toast.error('Erreur serveur. Veuillez réessayer plus tard.');
        break;
      default:
        toast.error(errorMessage || 'Une erreur est survenue');
    }

    return Promise.reject(error);
  }

  /**
   * Méthodes HTTP publiques
   * Note: Les réponses sont automatiquement unwrapped par l'intercepteur
   */
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /**
   * Méthodes utilitaires
   */
  public setAuthTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  public clearAuthTokens(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  }

  public isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// Instance unique du client API
export const apiClient = new SymfonyApiClient({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export default apiClient;