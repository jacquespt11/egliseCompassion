// src/components/SimpleTest.tsx
export const SimpleTest = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Test Tailwind v3.4.19
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test des couleurs primaires */}
        <div className="p-6 bg-primary-500 text-white rounded-lg shadow">
          <h2 className="text-xl font-semibold">Primary 500</h2>
          <p className="mt-2">Cette carte utilise la couleur primary-500</p>
        </div>
        
        {/* Test du dark mode */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Carte adaptative
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Changement automatique light/dark
          </p>
        </div>
        
        {/* Test des boutons */}
        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition">
          Bouton normal
        </button>
        
        <button className="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded hover:opacity-90 transition">
          Bouton dark
        </button>
      </div>
      
      {/* Test des marges et padding */}
      <div className="mt-8 p-4 border border-gray-300 dark:border-gray-700 rounded">
        <p className="text-lg">Test des utilitaires Tailwind :</p>
        <div className="mt-4 flex flex-wrap gap-4">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">mt-4</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">p-4</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">flex</span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">rounded</span>
        </div>
      </div>
    </div>
  );
};