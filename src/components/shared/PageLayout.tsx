// src/components/shared/PageLayout.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  backTo?: string;
  actions?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  showBackButton = false,
  backTo,
  actions,
  maxWidth = 'xl'
}) => {
  const { navigate, goBack } = useNavigation();
  const maxWidthClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className={`mx-auto ${maxWidthClasses[maxWidth]} p-4 md:p-6 lg:p-8`}>
        {/* En-tête de page */}
        {(title || showBackButton || actions) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {showBackButton && (
                  <button
                    onClick={() => backTo ? navigate(backTo as any) : goBack()}
                    className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Retour"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                
                {title && (
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                    {title}
                  </h1>
                )}
              </div>
              
              {actions && (
                <div className="flex items-center gap-2">
                  {actions}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Contenu principal */}
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default PageLayout;