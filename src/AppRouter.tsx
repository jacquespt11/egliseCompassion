// src/AppRouter.tsx
import React, { useCallback } from 'react';
import { toast } from 'sonner';
import { useNavigation } from './contexts/NavigationContext';
import { useAuth } from './contexts/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';

// Import des pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { DashboardPage } from './pages/DashboardPage';
import { PlaningPage } from './pages/PlaningPage';
import { RoomGalleryPage } from './pages/RoomGalleryPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUsersPage from './pages/AdminUsersPage';
import { AdminApprovalPage } from './pages/AdminApprovalPage';
import AdminDepartmentsPage from './pages/AdminDepartmentsPage';
import AdminAuditPage from './pages/AdminAuditPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import { ReservationForm } from './components/reservations/ReservationForm';
import { ReservationList } from './components/reservations/ReservationList';
import NotFound from './pages/NotFound';
import { useRooms } from './hooks/useRooms';
import type { Reservation } from './types/reservation';

const AppRouter: React.FC = () => {
  const { currentPage, navigate } = useNavigation();
  const { user, isAuthenticated, login: authLogin, register: authRegister } = useAuth();
  const { rooms } = useRooms();

  // ===============================================================
  // GESTIONNAIRES D'ÉVÉNEMENTS POUR LES RÉSERVATIONS
  // ===============================================================
  
  const handleViewDetails = useCallback((reservation: Reservation) => {
    console.log('Voir détails de la réservation:', reservation.id);
    toast.info(`Affichage des détails de la réservation: ${reservation.title || reservation.id}`);
    // TODO: Implémenter la navigation vers la page de détails de la réservation
  }, []);

  const handleCancelReservation = useCallback((reservation: Reservation) => {
    console.log('Demande d\'annulation de la réservation:', reservation.id);
    toast.warning(`Voulez-vous vraiment annuler la réservation "${reservation.title || reservation.id}" ?`, {
      action: {
        label: 'Confirmer',
        onClick: () => {
          toast.success('Réservation annulée avec succès');
          // TODO: Implémenter la logique d'annulation avec l'API
        }
      },
      cancel: {
        label: 'Annuler'
      }
    });
  }, []);

  const handleEditReservation = useCallback((reservation: Reservation) => {
    console.log('Édition de la réservation:', reservation.id);
    toast.info(`Édition de la réservation: ${reservation.title || reservation.id}`);
    navigate('reservation_form');
    // TODO: Passer la réservation à éditer via un contexte ou état
  }, [navigate]);

  const handleReservationSuccess = useCallback(() => {
    toast.success('Réservation créée avec succès !');
    navigate('my_reservations');
  }, [navigate]);

  const handleReservationCancel = useCallback(() => {
    navigate('planing');
  }, [navigate]);

  // ===============================================================
  // GESTIONNAIRES D'AUTHENTIFICATION
  // ===============================================================
  
  const handleLogin = useCallback(async (email: string, password: string) => {
    try {
      await authLogin(email, password);
      // Redirection automatique basée sur le rôle
      if (user?.role === 'ADMIN') {
        navigate(user?.profileCompleted ? 'admin_dashboard' : 'admin_profile_edit');
      } else {
        navigate('dashboard');
      }
    } catch (error) {
      toast.error('Échec de la connexion');
    }
  }, [authLogin, navigate, user?.role, user?.profileCompleted]);

  const handleNavigateToRegister = useCallback(() => {
    navigate('register');
  }, [navigate]);

  const handleRegister = useCallback(async (data: any) => {
    try {
      await authRegister(data);
      toast.success("Compte créé avec succès ! En attente d'approbation.");
      navigate('login');
    } catch (error) {
      toast.error('Échec de l\'inscription');
    }
  }, [authRegister, navigate]);

  const handleBackToLogin = useCallback(() => {
    navigate('login');
  }, [navigate]);

  // ===============================================================
  // VÉRIFICATIONS DE PERMISSIONS ET D'AUTHENTIFICATION
  // ===============================================================
  
  const checkPermission = useCallback((page: string) => {
    if (page.startsWith('admin_') && user?.role !== 'ADMIN') {
      toast.error('Accès non autorisé. Réservé aux administrateurs.');
      return false;
    }
    return true;
  }, [user?.role]);

  // Si non authentifié, rediriger vers login pour les pages protégées
  if (!isAuthenticated && currentPage !== 'login' && currentPage !== 'register') {
    // Afficher la page de login si non authentifié
    return (
      <Login 
        onLogin={handleLogin}
        onNavigateToRegister={handleNavigateToRegister}
      />
    );
  }

  // Vérifier les permissions pour les pages admin
  if (!checkPermission(currentPage)) {
    return <NotFound />;
  }

  // ===============================================================
  // RENDU DES PAGES PUBLIQUES
  // ===============================================================
  
  if (currentPage === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
        <Login 
          onLogin={handleLogin}
          onNavigateToRegister={handleNavigateToRegister}
        />
      </div>
    );
  }

  if (currentPage === 'register') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
        <Register 
          onRegister={handleRegister}
          onBackToLogin={handleBackToLogin}
        />
      </div>
    );
  }

  // ===============================================================
  // PAGES PROTÉGÉES AVEC LAYOUT
  // ===============================================================
  
  const renderWithLayout = (content: React.ReactNode) => (
    <DashboardLayout>{content}</DashboardLayout>
  );

  // Vérifier que l'utilisateur est défini pour les pages protégées
  if (!user) {
    return <NotFound />;
  }

  switch (currentPage) {
    case 'dashboard':
      return renderWithLayout(<DashboardPage user={user} />);
    
    case 'planing':
      return renderWithLayout(
        <PlaningPage 
          user={user} 
          onNavigate={navigate} 
        />
      );
    
    case 'room_gallery':
      return renderWithLayout(
        <RoomGalleryPage 
          user={user} 
          onNavigate={navigate} 
        />
      );
    
    case 'my_reservations':
      return renderWithLayout(
        <ReservationList
          userId={user.id}
          departmentId={user.departmentId || ''}
          userRole={user.role}
          onViewDetails={handleViewDetails}
          onCancelReservation={handleCancelReservation}
          onEditReservation={handleEditReservation}
        />
      );
    
    case 'admin_dashboard':
      return renderWithLayout(
        <AdminDashboardPage 
          user={user} 
          onNavigate={navigate} 
        />
      );
    
    case 'admin_approvals':
      return renderWithLayout(
        <AdminApprovalPage 
          onNavigate={navigate} 
        />
      );
    
    case 'admin_users':
      return renderWithLayout(<AdminUsersPage onNavigate={navigate} />);
    
    case 'admin_departments':
      return renderWithLayout(
        <AdminDepartmentsPage 
          user={user} 
          onNavigate={navigate} 
        />
      );
    
    case 'admin_audit':
      return renderWithLayout(
        <AdminAuditPage 
          user={user} 
          onNavigate={navigate} 
        />
      );
    
    case 'admin_settings':
      return renderWithLayout(
        <AdminSettingsPage 
          user={user} 
          onNavigate={navigate} 
        />
      );
    
    case 'reservation_form':
      return renderWithLayout(
        <ReservationForm
          rooms={rooms}
          currentDepartmentId={user.departmentId}
          onSuccess={handleReservationSuccess}
          onCancel={handleReservationCancel}
        />
      );
    
    default:
      return <NotFound />;
  }
};

export default AppRouter;