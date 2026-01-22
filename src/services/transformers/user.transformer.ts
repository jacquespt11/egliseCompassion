// src/services/transformers/user.transformer.ts
/**
 * Transformateur pour les données utilisateur
 * Convertit entre les types frontend et Symfony
 * @version 1.0.0
 */

import { User as FrontendUser } from '../../types/user';
import {
  SymfonyUser,
  SymfonyUserRole
} from '../../types/api/symfony/user';

/**
 * Transforme un utilisateur Symfony en utilisateur frontend
 * @param symfonyUser - Utilisateur de l'API Symfony
 * @returns Utilisateur frontend compatible avec l'existant
 */
export const transformSymfonyUserToFrontend = (symfonyUser: SymfonyUser): FrontendUser => {
  // Mapping des rôles Symfony -> Frontend
  const roleMap: Record<string, FrontendUser['role']> = {
    'Member': 'USER',
    'Responsible': 'RESPONSABLE',
    'Pastor': 'ADMIN',
    'Admin': 'ADMIN',
  };

  // Extraction prénom/nom depuis fullName
  const nameParts = symfonyUser.fullName?.split(' ') || [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return {
    // Champs obligatoires
    id: symfonyUser.id.toString(),
    email: symfonyUser.email,
    role: roleMap[symfonyUser.role] || 'USER',

    // Champs optionnels avec valeurs par défaut
    firstName,
    lastName,
    phone: symfonyUser.phoneNumber || '',
    avatar: symfonyUser.avatarUrl || '',
    department: symfonyUser.department || '',
    departmentId: '', // À récupérer si disponible
    status: symfonyUser.isActive ? 'active' : 'inactive',
    isActive: symfonyUser.isActive,
    profileCompleted: true, // Toujours vrai avec Symfony
    approvalStatus: 'APPROVED', // Par défaut approuvé
    createdAt: symfonyUser.createdAt,
    updatedAt: symfonyUser.updatedAt || symfonyUser.createdAt,
    lastLogin: symfonyUser.lastLogin,

    // Champs pour compatibilité (optionnels)
    position: '',
    bio: '',
  };
};

/**
 * Transforme un utilisateur frontend en utilisateur Symfony
 * @param frontendUser - Utilisateur frontend
 * @returns Données utilisateur au format Symfony
 */
export const transformFrontendUserToSymfony = (
  frontendUser: Partial<FrontendUser>
): Partial<SymfonyUser> => {
  // Mapping inverse des rôles
  const roleMap: Record<FrontendUser['role'], string> = {
    'ADMIN': 'Admin',
    'RESPONSABLE': 'Responsible',
    'USER': 'Member',
  };

  const result: Partial<SymfonyUser> = {};

  // Conversion des champs avec validation
  if (frontendUser.email !== undefined) {
    result.email = frontendUser.email;
  }

  if (frontendUser.firstName || frontendUser.lastName) {
    // Reconstruction du fullName depuis firstName et lastName
    result.fullName = `${frontendUser.firstName || ''} ${frontendUser.lastName || ''}`.trim();
  }

  if (frontendUser.phone !== undefined) {
    result.phoneNumber = frontendUser.phone;
  }

  if (frontendUser.avatar !== undefined) {
    result.avatarUrl = frontendUser.avatar;
  }

  if (frontendUser.department !== undefined) {
    result.department = frontendUser.department;
  }

  if (frontendUser.role !== undefined) {
    result.role = roleMap[frontendUser.role] as SymfonyUserRole || 'Member' as SymfonyUserRole;
  }

  if (frontendUser.isActive !== undefined) {
    result.isActive = frontendUser.isActive;
  }

  return result;
};

/**
 * Transforme les identifiants de connexion au format Symfony
 * @param email - Email de connexion
 * @param password - Mot de passe
 * @returns Données de connexion Symfony
 */
export const transformLoginDataToSymfony = (
  email: string,
  password: string
): { identifier: string; password: string } => {
  return {
    identifier: email,
    password,
  };
};