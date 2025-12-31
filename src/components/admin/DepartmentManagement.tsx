import React, { useState } from 'react';
import { 
  Users, 
  Building, 
  Phone, 
  Mail,
  CheckCircle,
  XCircle,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  BarChart3
} from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';

interface Department {
  id: string;
  name: string;
  description: string;
  leader: string;
  leaderEmail: string;
  memberCount: number;
  active: boolean;
  color: string;
  createdAt: string;
  updatedAt: string;
}

interface DepartmentMember {
  id: string;
  name: string;
  email: string;
  role: 'leader' | 'member' | 'assistant';
  department: string;
  status: 'active' | 'inactive';
}

const DepartmentManagement: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: '1',
      name: 'Musique',
      description: 'Chorale et orchestre de l\'église',
      leader: 'Jean Dupont',
      leaderEmail: 'jean.musique@compassion.org',
      memberCount: 15,
      active: true,
      color: '#3B82F6',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Enfance',
      description: 'École du dimanche et activités pour enfants',
      leader: 'Marie Curie',
      leaderEmail: 'marie.enfance@compassion.org',
      memberCount: 12,
      active: true,
      color: '#10B981',
      createdAt: '2024-01-02',
      updatedAt: '2024-01-14'
    },
    {
      id: '3',
      name: 'Protocole',
      description: 'Accueil et organisation des événements',
      leader: 'Pierre Martin',
      leaderEmail: 'pierre.protocole@compassion.org',
      memberCount: 8,
      active: true,
      color: '#8B5CF6',
      createdAt: '2024-01-03',
      updatedAt: '2024-01-13'
    },
    {
      id: '4',
      name: 'Media',
      description: 'Audiovisuel et communication',
      leader: 'Sophie Bernard',
      leaderEmail: 'sophie.media@compassion.org',
      memberCount: 6,
      active: true,
      color: '#EF4444',
      createdAt: '2024-01-04',
      updatedAt: '2024-01-12'
    },
    {
      id: '5',
      name: 'Administration',
      description: 'Gestion administrative et comptable',
      leader: 'Thomas Petit',
      leaderEmail: 'thomas.admin@compassion.org',
      memberCount: 4,
      active: true,
      color: '#F59E0B',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-10'
    }
  ]);

  const [members, setMembers] = useState<DepartmentMember[]>([
    {
      id: '1',
      name: 'Jean Dupont',
      email: 'jean.musique@compassion.org',
      role: 'leader',
      department: 'Musique',
      status: 'active'
    },
    {
      id: '2',
      name: 'Alice Dubois',
      email: 'alice.musique@compassion.org',
      role: 'member',
      department: 'Musique',
      status: 'active'
    },
    {
      id: '3',
      name: 'Marie Curie',
      email: 'marie.enfance@compassion.org',
      role: 'leader',
      department: 'Enfance',
      status: 'active'
    },
    {
      id: '4',
      name: 'Pauline Leroy',
      email: 'pauline.enfance@compassion.org',
      role: 'assistant',
      department: 'Enfance',
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
    leader: '',
    leaderEmail: '',
    color: '#3B82F6'
  });

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.leader.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDepartment = () => {
    const newDept: Department = {
      id: (departments.length + 1).toString(),
      ...newDepartment,
      memberCount: 0,
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setDepartments([...departments, newDept]);
    setNewDepartment({
      name: '',
      description: '',
      leader: '',
      leaderEmail: '',
      color: '#3B82F6'
    });
    setShowAddModal(false);
  };

  const handleEditDepartment = () => {
    if (!selectedDepartment) return;
    
    setDepartments(departments.map(dept =>
      dept.id === selectedDepartment.id 
        ? { ...selectedDepartment, updatedAt: new Date().toISOString().split('T')[0] }
        : dept
    ));
    setShowEditModal(false);
  };

  const handleDeleteDepartment = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) {
      setDepartments(departments.filter(dept => dept.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setDepartments(departments.map(dept =>
      dept.id === id ? { ...dept, active: !dept.active } : dept
    ));
  };

  const getDepartmentMembers = (departmentName: string) => {
    return members.filter(member => member.department === departmentName);
  };

  const departmentStats = {
    totalDepartments: departments.length,
    activeDepartments: departments.filter(dept => dept.active).length,
    totalMembers: members.length,
    leaders: members.filter(member => member.role === 'leader').length
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* En-tête */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gestion des Départements</h2>
            <p className="text-gray-600">
              {departmentStats.totalDepartments} départements • {departmentStats.activeDepartments} actifs
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un département..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              Ajouter
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Building className="text-blue-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-800">{departmentStats.totalDepartments}</p>
                <p className="text-sm text-gray-600">Départements</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-800">{departmentStats.activeDepartments}</p>
                <p className="text-sm text-gray-600">Actifs</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Users className="text-purple-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-800">{departmentStats.totalMembers}</p>
                <p className="text-sm text-gray-600">Membres</p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <UserPlus className="text-amber-600" size={24} />
              <div>
                <p className="text-2xl font-bold text-gray-800">{departmentStats.leaders}</p>
                <p className="text-sm text-gray-600">Responsables</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des départements */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Département</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Responsable</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Membres</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Statut</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDepartments.map((dept) => (
              <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: dept.color }}
                    >
                      {dept.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{dept.name}</div>
                      <div className="text-sm text-gray-500">{dept.description}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium">{dept.leader}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Mail size={12} />
                      {dept.leaderEmail}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-400" />
                    <span className="font-medium">{dept.memberCount}</span>
                    <span className="text-gray-500">membres</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <StatusBadge
                    status={dept.active ? 'success' : 'error'}
                    label={dept.active ? 'Actif' : 'Inactif'}
                  />
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedDepartment(dept);
                        setShowMembersModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voir les membres"
                    >
                      <Users size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDepartment(dept);
                        setShowEditModal(true);
                      }}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(dept.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        dept.active
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={dept.active ? 'Désactiver' : 'Activer'}
                    >
                      {dept.active ? <XCircle size={16} /> : <CheckCircle size={16} />}
                    </button>
                    <button
                      onClick={() => handleDeleteDepartment(dept.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Ajout de département */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Ajouter un département</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du département *</label>
                  <input
                    type="text"
                    value={newDepartment.name}
                    onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Ex: Musique, Enfance..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newDepartment.description}
                    onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows={3}
                    placeholder="Description du département..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsable *</label>
                    <input
                      type="text"
                      value={newDepartment.leader}
                      onChange={(e) => setNewDepartment({...newDepartment, leader: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="Nom du responsable"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={newDepartment.leaderEmail}
                      onChange={(e) => setNewDepartment({...newDepartment, leaderEmail: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="email@compassion.org"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
                  <input
                    type="color"
                    value={newDepartment.color}
                    onChange={(e) => setNewDepartment({...newDepartment, color: e.target.value})}
                    className="w-full h-10 cursor-pointer"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddDepartment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={!newDepartment.name || !newDepartment.leader || !newDepartment.leaderEmail}
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Modification de département */}
      {showEditModal && selectedDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Modifier le département</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du département *</label>
                  <input
                    type="text"
                    value={selectedDepartment.name}
                    onChange={(e) => setSelectedDepartment({...selectedDepartment, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={selectedDepartment.description}
                    onChange={(e) => setSelectedDepartment({...selectedDepartment, description: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsable *</label>
                    <input
                      type="text"
                      value={selectedDepartment.leader}
                      onChange={(e) => setSelectedDepartment({...selectedDepartment, leader: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={selectedDepartment.leaderEmail}
                      onChange={(e) => setSelectedDepartment({...selectedDepartment, leaderEmail: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
                  <input
                    type="color"
                    value={selectedDepartment.color}
                    onChange={(e) => setSelectedDepartment({...selectedDepartment, color: e.target.value})}
                    className="w-full h-10 cursor-pointer"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={selectedDepartment.active}
                    onChange={(e) => setSelectedDepartment({...selectedDepartment, active: e.target.checked})}
                    className="h-4 w-4"
                  />
                  <label htmlFor="active" className="text-sm text-gray-700">
                    Département actif
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleEditDepartment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={!selectedDepartment.name || !selectedDepartment.leader || !selectedDepartment.leaderEmail}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Liste des membres */}
      {showMembersModal && selectedDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Membres du département {selectedDepartment.name}</h3>
                  <p className="text-gray-600">{getDepartmentMembers(selectedDepartment.name).length} membres</p>
                </div>
                <button
                  onClick={() => setShowMembersModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              {getDepartmentMembers(selectedDepartment.name).length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto text-gray-400 mb-4" size={48} />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun membre</h4>
                  <p className="text-gray-500">Aucun membre n'est encore assigné à ce département.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getDepartmentMembers(selectedDepartment.name).map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="text-gray-600" size={20} />
                        </div>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail size={12} />
                            {member.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge
                          status={member.status === 'active' ? 'success' : 'error'}
                          label={member.role === 'leader' ? 'Responsable' : member.role === 'assistant' ? 'Assistant' : 'Membre'}
                          size="sm"
                        />
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowMembersModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;