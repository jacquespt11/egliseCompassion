// src/services/transformers/department.transformer.ts
/**
 * Transformateur pour les données de départements
 * Convertit entre les types frontend et Symfony
 * @version 1.0.0
 */

import { Department as FrontendDepartment } from '../../types/department';
import { SymfonyUser } from '../../types/api/symfony/user';

/**
 * Transforme les données utilisateur en département frontend
 * Note: L'API Symfony ne semble pas avoir d'entité Department dédiée
 * On utilise les utilisateurs pour générer la liste des départements
 */
export const transformUsersToDepartments = (
  users: SymfonyUser[]
): FrontendDepartment[] => {
  // Regrouper les utilisateurs par département
  const departmentsMap = new Map<string, FrontendDepartment>();

  users.forEach(user => {
    const departmentName = user.department || 'Non affecté';

    if (!departmentsMap.has(departmentName)) {
      departmentsMap.set(departmentName, {
        id: `dept_${departmentName.toLowerCase().replace(/\s+/g, '_')}`,
        name: departmentName,
        description: `Département ${departmentName}`,
        managerId: '',
        managerName: '',
        memberCount: 0,
        roomCount: 0,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        color: getDepartmentColor(departmentName),
        icon: 'Building2',
      });
    }

    // Mettre à jour le compteur
    const dept = departmentsMap.get(departmentName)!;
    dept.memberCount++;

    // Définir le manager (premier admin ou responsable trouvé)
    if ((!dept.managerId || dept.managerId === '') &&
      (user.role === 'Admin' || user.role === 'Pastor' || user.role === 'Responsible')) {
      dept.managerId = user.id.toString();
      dept.managerName = user.fullName;
    }
  });

  return Array.from(departmentsMap.values());
};

/**
 * Génère une couleur unique pour chaque département
 */
const getDepartmentColor = (departmentName: string): string => {
  const colors = [
    '#3B82F6', // Bleu
    '#10B981', // Vert
    '#8B5CF6', // Violet
    '#F59E0B', // Orange
    '#EF4444', // Rouge
    '#EC4899', // Rose
    '#06B6D4', // Cyan
    '#8B4513', // Marron
  ];

  let hash = 0;
  for (let i = 0; i < departmentName.length; i++) {
    hash = departmentName.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};