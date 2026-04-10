// src/pages/admin/comptabilite/mouvements/MouvementsPage.tsx
import { useState, useMemo } from "react";
import { 
  Search, TrendingUp, TrendingDown, 
  FileText, Calendar, Filter, Package,
  ArrowUpCircle, ArrowDownCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useMouvementsStock from "../../../../hooks/mouvementsStock/useMouvementsStock";
import useMateriels from "../../../../hooks/materiels/useMateriels";
import MouvementsList from "../../../../components/admin/lists/MouvementsList";

const StatCard = ({ label, value, icon, color, delay = 0 }: any) => {
  const colors: any = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
    green: "from-green-50 to-green-100 border-green-200 text-green-700",
    red: "from-red-50 to-red-100 border-red-200 text-red-700",
    orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-700",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-700",
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl border p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in-up`} style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-3 bg-white/50 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

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
    <div className="space-y-6 pb-8">
      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Mouvements de stock</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Package size={14} />
            Suivi des entrées, sorties, corrections et inventaires
          </p>
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard 
          label="Total" 
          value={stats.total} 
          icon={<Package size={20} />} 
          color="blue" 
          delay={100}
        />
        <StatCard 
          label="Entrées" 
          value={stats.entree} 
          icon={<ArrowUpCircle size={20} />} 
          color="green" 
          delay={200}
        />
        <StatCard 
          label="Sorties" 
          value={stats.sortie} 
          icon={<ArrowDownCircle size={20} />} 
          color="red" 
          delay={300}
        />
        <StatCard 
          label="Corrections" 
          value={stats.correction} 
          icon={<FileText size={20} />} 
          color="orange" 
          delay={400}
        />
        <StatCard 
          label="Inventaires" 
          value={stats.inventaire} 
          icon={<Calendar size={20} />} 
          color="purple" 
          delay={500}
        />
      </div>

      {/* Filtres avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Filter size={16} className="text-primary" />
          </div>
          <h2 className="font-semibold text-gray-800">Filtres</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <span className="text-xs">✕</span>
              </button>
            )}
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200 bg-white"
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
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200"
            placeholder="Date début"
          />

          <input
            type="date"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200"
            placeholder="Date fin"
          />
        </div>
      </div>

      {/* Liste des mouvements avec animation */}
      <div className="animate-fade-in-up" style={{ animationDelay: '700ms' }}>
        <MouvementsList
          mouvements={filteredMouvements}
          materielsDict={materielsDict}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Message si aucun résultat */}
      {filteredMouvements.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl animate-fade-in-up" style={{ animationDelay: '800ms' }}>
          <Package size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Aucun mouvement trouvé</p>
          {(searchTerm || typeFilter !== "all" || dateDebut || dateFin) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setTypeFilter("all");
                setDateDebut("");
                setDateFin("");
              }}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}