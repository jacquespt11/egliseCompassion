// components/auth/DepartmentSelector.tsx
import { useState, useEffect } from 'react';

export function DepartmentSelector({ onSelect }: { onSelect: (id: string) => void }) {
  const [departments, setDepartments] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    // Simulation de l'appel API vers le "Members Module" [cite: 31]
    // fetch('/api/departments').then(...)
    setDepartments([
      { id: '1', name: 'Genius hub' },
      { id: '2', name: 'Protocole' },
      { id: '3', name: 'Intercession' },
      { id: '4', name: 'Sécurité' },
      { id: '5', name: 'Jeunesse' },
      { id: '6', name: 'Ecole des ouvriers' },
      { id: '7', name: 'Ecole de bapteme' },
      { id: '8', name: 'Affermissement' },
      { id: '9', name: 'Ecole des adolescences' },
      { id: '10', name: 'Suivi des ames' },
      { id: '11', name: 'Salibrité' },
      { id: '12', name: 'Evangelisation' },
      { id: '13', name: 'Technique' },
      { id: '14', name: 'Chorale1' },
      { id: '15', name: 'Chorale2' },        
    ]);
  }, []);

  return (
    <select 
      onChange={(e) => onSelect(e.target.value)}
      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#3B82F6]"
      required
    >
      <option value="">Sélectionnez votre département</option>
      {departments.map(dept => (
        <option key={dept.id} value={dept.id} className="bg-[#0F1A2F] text-white">
          {dept.name}
        </option>
      ))}
    </select>
  );
}