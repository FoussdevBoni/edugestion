// src/pages/admin/materiel/InventairesPage.tsx
import { useState } from "react";
import { 
  Plus, Search, Eye,
  Calendar, AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useInventaires from "../../../../hooks/inventaires/useInventaires";

// Données fictives



export default function InventairesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const {inventaires} = useInventaires();
  
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
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
       
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Inventaires</h1>
          <p className="text-sm text-gray-500 mt-1">
            Historique des états des lieux du matériel
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/comptabilite/inventaires/new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          <Plus size={18} />
          Nouvel inventaire
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par période ou date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Liste des inventaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventaires.map((inventaire) => {
          const totalArticles = inventaire.materiels.reduce((sum, m) => sum + m.quantite, 0);
          const stockBas = inventaire.materiels.filter(m => m.quantite < 30).length;
          
          return (
            <div 
              key={inventaire.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/admin/comptabilite/inventaires/details` , {state: inventaire})}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1 rounded-full">
                    <Calendar size={14} />
                    <span className="text-xs font-medium">{formatDate(inventaire.date)}</span>
                  </div>
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Eye size={16} />
                  </button>
                </div>

                <h3 className="font-semibold text-gray-800 mb-2">{inventaire.periode}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total articles</span>
                    <span className="font-medium">{totalArticles} unités</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Types de matériel</span>
                    <span className="font-medium">{inventaire.materiels.length}</span>
                  </div>
                  {stockBas > 0 && (
                    <div className="flex justify-between text-sm text-orange-600">
                      <span className="flex items-center gap-1">
                        <AlertTriangle size={14} />
                        Stock bas
                      </span>
                      <span className="font-medium">{stockBas} articles</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Créé le {new Date(inventaire.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {filteredInventaires.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Aucun inventaire trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}