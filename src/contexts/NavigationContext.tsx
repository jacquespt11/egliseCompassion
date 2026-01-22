// src/contexts/NavigationContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { PageId } from '../types/routes';

interface NavigationContextType {
  currentPage: PageId;
  navigate: (page: PageId) => void;
  goBack: () => void;
  history: PageId[];
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
  initialPage?: PageId;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ 
  children, 
  initialPage = 'transition' 
}) => {
  const [history, setHistory] = useState<PageId[]>([initialPage]);
  const currentPage = history[history.length - 1];

  const navigate = useCallback((page: PageId) => {
    setHistory(prev => [...prev, page]);
  }, []);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    }
  }, [history]);

  return (
    <NavigationContext.Provider value={{ currentPage, navigate, goBack, history }}>
      {children}
    </NavigationContext.Provider>
  );
};