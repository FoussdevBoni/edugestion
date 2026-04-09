// src/pages/admin/materiel/InventaireDetailsPage.tsx
import { useState } from "react";
import { 
  ArrowLeft, Edit, Trash2, Printer,
  Calendar, AlertTriangle,
  CheckCircle, TrendingDown,
  TrendingUp
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Inventaire } from "../../../../utils/types/data";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import { alertError, alertServerError } from "../../../../helpers/alertError";
import useMateriels from "../../../../hooks/materiels/useMateriels";
import { inventaireService } from "../../../../services/inventaireService";




export default function InventaireDetailsPage() {
  const navigate = useNavigate();
  const {materiels: stockActuel} = useMateriels()
  const location = useLocation()
  const inventaire: Inventaire = location.state
  const [inventaireToDelete , setInventaireToDelete] = useState<Inventaire | null>(null)

   const handleDelete = async () => {
      if (!inventaireToDelete?.id) {
        alertError("Une erreur s'est produite")
        return
      }
      try {
        await inventaireService.delete(inventaireToDelete?.id)
        navigate(-1)
        setInventaireToDelete(null)
      } catch (error) {
        alertServerError(error)
      }
    }
   


  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

const getEcart = (materielId: string) => {
  const invItem = inventaire.materiels.find(m => m.id === materielId);
  return invItem?.difference || 0;
};

  const totalEcart = stockActuel.reduce((sum, m) => sum + Math.abs(getEcart(m.id)), 0);
  const pertes = stockActuel.filter(m => getEcart(m.id) < 0).reduce((sum, m) => sum + Math.abs(getEcart(m.id)), 0);
  const surplus = stockActuel.filter(m => getEcart(m.id) > 0).reduce((sum, m) => sum + getEcart(m.id), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Détails de l'inventaire</h1>
            <p className="text-sm text-gray-500 mt-1">{inventaire.periode}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/admin/comptabilite/inventaires/update` , {state: inventaire})}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit size={16} />
            Modifier
          </button>
          <button 
          
          onClick={()=>{
            setInventaireToDelete(inventaire)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            <Trash2 size={16} />
            Supprimer
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            <Printer size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Informations générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Date</p>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            <span className="font-medium">{formatDate(inventaire.date)}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Période</p>
          <p className="font-medium">{inventaire.periode}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Articles comptés</p>
          <p className="font-medium">{inventaire.materiels.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500 mb-1">Écart total</p>
          <p className="font-medium">{totalEcart} unités</p>
        </div>
      </div>

      {/* Résumé des écarts */}
      {(pertes > 0 || surplus > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pertes > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-700 mb-2">
                <TrendingDown size={18} />
                <span className="font-medium">Pertes détectées</span>
              </div>
              <p className="text-2xl font-bold text-red-700">{pertes} unités</p>
              <p className="text-sm text-red-600 mt-1">Matériel manquant</p>
            </div>
          )}

          {surplus > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <TrendingUp size={18} />
                <span className="font-medium">Surplus détectés</span>
              </div>
              <p className="text-2xl font-bold text-green-700">{surplus} unités</p>
              <p className="text-sm text-green-600 mt-1">Matériel en excédent</p>
            </div>
          )}
        </div>
      )}

      {/* Tableau de comparaison */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Comparaison avec le stock actuel</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matériel</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stock compté</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stock théorique</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Écart</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stockActuel.map((materiel) => {
                const invItem = inventaire.materiels.find(m => m.id === materiel.id);
                const ecart =  invItem?.difference || 0;
                
                return (
                  <tr key={materiel.id} className={ecart !== 0 ? 'bg-orange-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 font-medium">{materiel.nom}</td>
                    <td className="px-6 py-4 text-right font-mono">{invItem?.quantiteReelle || 0}</td>
                    <td className="px-6 py-4 text-right font-mono">{materiel.quantite}</td>
                    <td className={`px-6 py-4 text-right font-mono font-bold ${
                      ecart < 0 ? 'text-red-600' : ecart > 0 ? 'text-green-600' : ''
                    }`}>
                      {ecart !== 0 ? (ecart > 0 ? '+' : '') + ecart : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {ecart === 0 ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle size={14} />
                          <span className="text-xs">OK</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-orange-600">
                          <AlertTriangle size={14} />
                          <span className="text-xs">Écart</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Métadonnées */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-sm text-gray-500">
        <p>Créé le {new Date(inventaire.createdAt).toLocaleString('fr-FR')}</p>
        {inventaire.updatedAt !== inventaire.createdAt && (
          <p>Modifié le {new Date(inventaire.updatedAt).toLocaleString('fr-FR')}</p>
        )}
      </div>

   


      
      <DeleteConfirmationModal
        isOpen={!!inventaireToDelete}
        onClose={() => setInventaireToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer l'inventaire "
        message={`Voulez-vous vraiment supprimer cet inventare ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}