// src/utils/api-error-handler.ts
/**
 * Gestionnaire centralisé des erreurs API
 * @version 1.0.0
 */

import { toast } from 'sonner';

/**
 * Types d'erreurs API courantes
 */
export const ApiErrorCode = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ApiErrorCode = typeof ApiErrorCode[keyof typeof ApiErrorCode];

/**
 * Structure standardisée des erreurs
 */
export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, any>;
  status?: number;
}

/**
 * Transforme une erreur Axios en erreur API standardisée
 */
export const transformAxiosError = (error: any): ApiError => {
  // Erreur réseau
  if (!error.response) {
    return {
      code: ApiErrorCode.NETWORK_ERROR,
      message: 'Erreur de connexion au serveur. Vérifiez votre connexion internet.',
      status: 0,
    };
  }

  const { status, data } = error.response;
  let code: ApiErrorCode = ApiErrorCode.UNKNOWN_ERROR;
  let message = 'Une erreur inattendue est survenue';

  switch (status) {
    case 400:
      code = ApiErrorCode.VALIDATION_ERROR;
      message = data?.error?.message || 'Données invalides';
      break;
    case 401:
      code = ApiErrorCode.UNAUTHORIZED;
      message = 'Session expirée. Veuillez vous reconnecter.';
      break;
    case 403:
      code = ApiErrorCode.FORBIDDEN;
      message = 'Accès non autorisé';
      break;
    case 404:
      code = ApiErrorCode.NOT_FOUND;
      message = 'Ressource non trouvée';
      break;
    case 500:
      code = ApiErrorCode.SERVER_ERROR;
      message = 'Erreur serveur. Veuillez réessayer plus tard.';
      break;
  }

  return {
    code,
    message,
    details: data?.error?.details,
    status,
  };
};

/**
 * Affiche une notification d'erreur adaptée
 */
export const showErrorNotification = (error: ApiError): void => {
  const { code, message } = error;

  const config = {
    duration: code === ApiErrorCode.UNAUTHORIZED ? 8000 : 5000,
    action: code === ApiErrorCode.UNAUTHORIZED ? {
      label: 'Se reconnecter',
      onClick: () => window.location.href = '/login',
    } : undefined,
  };

  switch (code) {
    case ApiErrorCode.UNAUTHORIZED:
      toast.error('Session expirée', {
        ...config,
        description: 'Votre session a expiré. Veuillez vous reconnecter.',
      });
      break;

    case ApiErrorCode.FORBIDDEN:
      toast.error('Accès refusé', {
        description: 'Vous n\'avez pas les permissions nécessaires.',
      });
      break;

    case ApiErrorCode.VALIDATION_ERROR:
      toast.error('Erreur de validation', {
        description: message,
      });
      break;

    case ApiErrorCode.NETWORK_ERROR:
      toast.error('Connexion impossible', {
        description: 'Vérifiez votre connexion internet.',
        duration: 8000,
      });
      break;

    default:
      toast.error('Erreur', {
        description: message,
      });
  }
};

/**
 * Logge les erreurs en développement
 */
export const logError = (error: ApiError, context?: string): void => {
  if (import.meta.env.VITE_APP_ENV === 'development') {
    console.group(context || 'Erreur API');
    console.error('Code:', error.code);
    console.error('Message:', error.message);
    console.error('Status:', error.status);
    console.error('Details:', error.details);
    console.groupEnd();
  }
};

/**
 * Gestionnaire d'erreurs complet
 */
export const handleApiError = (error: any, context?: string): ApiError => {
  const apiError = transformAxiosError(error);
  logError(apiError, context);
  showErrorNotification(apiError);
  return apiError;
};

/**
 * Vérifie si une erreur est récupérable
 */
export const isRecoverableError = (error: ApiError): boolean => {
  const nonRecoverable: ApiErrorCode[] = [
    ApiErrorCode.UNAUTHORIZED,
    ApiErrorCode.FORBIDDEN,
    ApiErrorCode.NOT_FOUND,
  ];
  return !nonRecoverable.includes(error.code);
};