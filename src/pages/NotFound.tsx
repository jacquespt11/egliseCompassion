//pages/NotFound.tsx
import React from 'react';
import { CardTitle } from '../components/shared/Card';
import { useNavigation } from '../contexts/NavigationContext';
import { ArrowLeft } from 'lucide-react';
import  Card  from '../components/shared/Card';

const NotFound: React.FC = () => {
  const { navigate } = useNavigation();
    return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="max-w-md w-full text-center">
        <CardTitle className="text-2xl mb-4">404 - Page Not Found</CardTitle>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Oops! The page you are looking for does not exist.
        </p>
        <button
          onClick={() => navigate('' as any)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour en arriere
        </button>
      </Card>
    </div>
  );
}
export default NotFound;