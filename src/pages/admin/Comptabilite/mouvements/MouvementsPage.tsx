// src/pages/admin/comptabilite/mouvements/MouvementsPage.tsx
import { useState, useMemo } from "react";
import { 
  Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useMouvementsStock from "../../../../hooks/mouvementsStock/useMouvementsStock";
import useMateriels from "../../../../hooks/materiels/useMateriels";
import MouvementsList from "../../../../components/admin/lists/MouvementsList";

export default function MouvementsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  
  const { mouvements, loading } = useMouvementsStock();
  const { materiels } = useMateriels();

  const materielsDict = useMemo(() => {
    return materiels.reduce((acc, m) => {
      acc[m.id] = m.nom;
      return acc;
    }, {} as Record<string, string>);
  }, [materiels]);

  const filteredMouvements = useMemo(() => {
    return mouvements.filter(m => {
      const matchesSearch = 
        (materielsDict[m.materielId] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.motif.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.referenceId?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === "all" || m.type === typeFilter;
      
      const matchesDate = (!dateDebut || m.date >= dateDebut) && 
                         (!dateFin || m.date <= dateFin);
      
      return matchesSearch && matchesType && matchesDate;
    });
  }, [mouvements, materielsDict, searchTerm, typeFilter, dateDebut, dateFin]);

  const stats = useMemo(() => ({
    total: filteredMouvements.length,
    entree: filteredMouvements.filter(m => m.type === 'entree').length,
    sortie: filteredMouvements.filter(m => m.type === 'sortie').length,
    correction: filteredMouvements.filter(m => m.type === 'correction').length,
    inventaire: filteredMouvements.filter(m => m.type === 'inventaire').length
  }), [filteredMouvements]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleRowClick = (mouvement: any) => {
    navigate(`/admin/comptabilite/mouvements/details`, { state: mouvement });
  };

  return (
    <div className="space-y-6">
     
      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">Tous les types</option>
            <option value="entree">Entrées</option>
            <option value="sortie">Sorties</option>
            <option value="correction">Corrections</option>
            <option value="inventaire">Inventaires</option>
          </select>

          <input
            type="date"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Date début"
          />

          <input
            type="date"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Date fin"
          />
        </div>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Entrées</p>
          <p className="text-2xl font-bold text-green-600">{stats.entree}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Sorties</p>
          <p className="text-2xl font-bold text-red-600">{stats.sortie}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Corrections</p>
          <p className="text-2xl font-bold text-orange-600">{stats.correction}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Inventaires</p>
          <p className="text-2xl font-bold text-blue-600">{stats.inventaire}</p>
        </div>
      </div>

      {/* Liste */}
      <MouvementsList
        mouvements={filteredMouvements}
        materielsDict={materielsDict}
        onRowClick={handleRowClick}
      />
    </div>
  );
}