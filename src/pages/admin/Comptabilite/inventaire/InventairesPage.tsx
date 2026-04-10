// src/pages/admin/materiel/InventairesPage.tsx
import { useState } from "react";
import { 
  Plus, Search, Eye,
  Calendar, AlertTriangle, Package, TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useInventaires from "../../../../hooks/inventaires/useInventaires";

export default function InventairesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { inventaires } = useInventaires();
  
  const filteredInventaires = inventaires.filter(inv => 
    inv.periode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.date.includes(searchTerm)
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* En-tête avec animation */}
      <div className="flex items-center justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventaires</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Package size={14} />
            Historique des états des lieux du matériel
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/comptabilite/inventaires/new")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
        >
          <Plus size={18} />
          Nouvel inventaire
        </button>
      </div>

      {/* Barre de recherche avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par période ou date..."
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
      </div>

      {/* Statistiques rapides avec animation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Total inventaires</p>
              <p className="text-2xl font-bold text-blue-800 mt-1">{inventaires.length}</p>
            </div>
            <div className="p-2 bg-white/50 rounded-xl">
              <Package size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-green-700 uppercase tracking-wider">Articles comptés</p>
              <p className="text-2xl font-bold text-green-800 mt-1">
                {inventaires.reduce((sum, inv) => sum + inv.materiels.reduce((s, m) => s + m.quantite, 0), 0)}
              </p>
            </div>
            <div className="p-2 bg-white/50 rounded-xl">
              <TrendingUp size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Dernier inventaire</p>
              <p className="text-lg font-bold text-purple-800 mt-1">
                {inventaires[0] ? new Date(inventaires[0].date).toLocaleDateString('fr-FR') : '-'}
              </p>
            </div>
            <div className="p-2 bg-white/50 rounded-xl">
              <Calendar size={20} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des inventaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInventaires.map((inventaire, idx) => {
          const totalArticles = inventaire.materiels.reduce((sum, m) => sum + m.quantite, 0);
          const stockBas = inventaire.materiels.filter(m => m.quantite < 30).length;
          
          return (
            <div 
              key={inventaire.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${300 + idx * 100}ms` }}
              onClick={() => navigate(`/admin/comptabilite/inventaires/details`, { state: inventaire })}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 px-3 py-1.5 rounded-full">
                    <Calendar size={14} className="text-primary" />
                    <span className="text-xs font-medium text-primary">{formatDate(inventaire.date)}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/admin/comptabilite/inventaires/details`, { state: inventaire });
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                  >
                    <Eye size={16} />
                  </button>
                </div>

                <h3 className="font-semibold text-gray-800 text-lg mb-3">{inventaire.periode}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Total articles</span>
                    <span className="font-semibold text-gray-800">{totalArticles} unités</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Types de matériel</span>
                    <span className="font-semibold text-gray-800">{inventaire.materiels.length}</span>
                  </div>
                  {stockBas > 0 && (
                    <div className="flex justify-between items-center text-sm bg-orange-50 p-2 rounded-lg">
                      <span className="flex items-center gap-1 text-orange-700">
                        <AlertTriangle size={14} />
                        Stock bas
                      </span>
                      <span className="font-semibold text-orange-700">{stockBas} articles</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Créé le {new Date(inventaire.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {filteredInventaires.length === 0 && (
          <div className="col-span-full text-center py-16 bg-gray-50 rounded-xl animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Aucun inventaire trouvé</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-3 text-sm text-primary hover:underline"
              >
                Effacer la recherche
              </button>
            )}
          </div>
        )}
      </div>

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