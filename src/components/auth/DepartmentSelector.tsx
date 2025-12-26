// components/auth/DepartmentSelector.tsx
import { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';

interface DepartmentSelectorProps {
  value: string;
  onSelect: (id: string) => void;
  label?: string;
  required?: boolean;
  showIcon?: boolean;
  className?: string;
}

export function DepartmentSelector({ 
  value, 
  onSelect,
  label = "Département",
  required = true,
  showIcon = true,
  className = ""
}: DepartmentSelectorProps) {
  const [departments, setDepartments] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulation de l'appel API vers le "Members Module" [cite: 31]
    // fetch('/api/departments').then(...)
    const timer = setTimeout(() => {
      setDepartments([
        { id: '1', name: 'Genius hub' },
        { id: '2', name: 'Protocole' },
        { id: '3', name: 'Intercession' },
        { id: '4', name: 'Sécurité' },
        { id: '5', name: 'Jeunesse' },
        { id: '6', name: 'Ecole des ouvriers' },
        { id: '7', name: 'Ecole de baptême' },
        { id: '8', name: 'Affermissement' },
        { id: '9', name: 'Ecole des adolescents' },
        { id: '10', name: 'Suivi des âmes' },
        { id: '11', name: 'Salubrité' },
        { id: '12', name: 'Évangélisation' },
        { id: '13', name: 'Technique' },
        { id: '14', name: 'Chorale 1' },
        { id: '15', name: 'Chorale 2' },        
      ]);
      setIsLoading(false);
    }, 500); // Simulation d'un délai de chargement

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect(e.target.value);
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-sm font-medium text-white/80 ml-1 flex items-center gap-2">
          {label}
          {required && <span className="text-red-400">*</span>}
        </label>
      )}
      
      <div className="relative group">
        {showIcon && (
          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
        )}
        
        {isLoading ? (
          <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-white/60">Chargement des départements...</span>
            </div>
          </div>
        ) : (
          <select 
            value={value}
            onChange={handleChange}
            className={`w-full bg-white/5 border border-white/10 rounded-xl text-white appearance-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/30 outline-none transition-all hover:border-white/20 cursor-pointer ${className} ${showIcon ? 'px-12 py-4' : 'px-4 py-4'}`}
            required={required}
          >
            <option value="" className="bg-[#1E293B] text-white/70">
              Sélectionnez votre département
            </option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id} className="bg-[#1E293B] text-white">
                {dept.name}
              </option>
            ))}
          </select>
        )}
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
          ▼
        </div>
      </div>
    </div>
  );
}