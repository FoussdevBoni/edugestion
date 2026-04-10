// src/pages/admin/materiel/InventaireDetailsPage.tsx
import { useState } from "react";
import { 
  ArrowLeft, Edit, Trash2, Printer,
  Calendar, AlertTriangle,
  CheckCircle, TrendingDown,
  TrendingUp, Package, AlertCircle
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Inventaire } from "../../../../utils/types/data";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import { alertError, alertServerError, alertSuccess } from "../../../../helpers/alertError";
import useMateriels from "../../../../hooks/materiels/useMateriels";
import { inventaireService } from "../../../../services/inventaireService";

export default function InventaireDetailsPage() {
  const navigate = useNavigate();
  const { materiels: stockActuel } = useMateriels();
  const location = useLocation();
  const inventaire: Inventaire = location.state;
  const [inventaireToDelete, setInventaireToDelete] = useState<Inventaire | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!inventaireToDelete?.id) {
      alertError("Une erreur s'est produite");
      return;
    }
    setIsDeleting(true);
    try {
      await inventaireService.delete(inventaireToDelete.id);
      setInventaireToDelete(null);
      alertSuccess("Inventaire supprimé avec succès");
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      alertServerError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getEcart = (materielId: string) => {
    const invItem = inventaire?.materiels?.find(m => m.id === materielId);
    return invItem?.difference || 0;
  };

  const totalEcart = stockActuel.reduce((sum, m) => sum + Math.abs(getEcart(m.id)), 0);
  const pertes = stockActuel.filter(m => getEcart(m.id) < 0).reduce((sum, m) => sum + Math.abs(getEcart(m.id)), 0);
  const surplus = stockActuel.filter(m => getEcart(m.id) > 0).reduce((sum, m) => sum + getEcart(m.id), 0);

  if (!inventaire) {
    return (
      <div className="text-center py-12 animate-fade-in-up">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <p className="text-gray-500 text-center mb-4">Inventaire non trouvé</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8">
      {/* En-tête avec animation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
          >
            <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Détails de l'inventaire</h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <Package size={14} />
              {inventaire.periode}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/admin/comptabilite/inventaires/update`, { state: inventaire })}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <Edit size={16} />
            Modifier
          </button>
          <button
            onClick={() => setInventaireToDelete(inventaire)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <Trash2 size={16} />
            Supprimer
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
            <Printer size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Informations générales avec animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <p className="text-sm text-gray-500 mb-1">Date</p>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            <span className="font-medium text-gray-800">{formatDate(inventaire.date)}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <p className="text-sm text-gray-500 mb-1">Période</p>
          <p className="font-medium text-gray-800">{inventaire.periode}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <p className="text-sm text-gray-500 mb-1">Articles comptés</p>
          <p className="font-medium text-gray-800">{inventaire.materiels?.length || 0}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <p className="text-sm text-gray-500 mb-1">Écart total</p>
          <p className={`font-medium ${totalEcart > 0 ? 'text-orange-600' : 'text-green-600'}`}>
            {totalEcart} unités
          </p>
        </div>
      </div>

      {/* Résumé des écarts avec animations */}
      {(pertes > 0 || surplus > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pertes > 0 && (
            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-5 transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: '500ms' }}>
              <div className="flex items-center gap-2 text-red-700 mb-2">
                <TrendingDown size={18} />
                <span className="font-semibold">Pertes détectées</span>
              </div>
              <p className="text-3xl font-bold text-red-700">{pertes} unités</p>
              <p className="text-sm text-red-600 mt-1">Matériel manquant</p>
            </div>
          )}

          {surplus > 0 && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <TrendingUp size={18} />
                <span className="font-semibold">Surplus détectés</span>
              </div>
              <p className="text-3xl font-bold text-green-700">{surplus} unités</p>
              <p className="text-sm text-green-600 mt-1">Matériel en excédent</p>
            </div>
          )}
        </div>
      )}

      {/* Tableau de comparaison avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '700ms' }}>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Comparaison avec le stock actuel</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Matériel</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock compté</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock théorique</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Écart</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stockActuel.map((materiel, idx) => {
                const invItem = inventaire.materiels?.find(m => m.id === materiel.id);
                const ecart = invItem?.difference || 0;
                
                return (
                  <tr key={materiel.id} className={`${ecart !== 0 ? 'bg-orange-50/50' : 'hover:bg-gray-50'} transition-colors duration-200 animate-fade-in-up`} style={{ animationDelay: `${800 + idx * 20}ms` }}>
                    <td className="px-6 py-4 font-medium text-gray-800">{materiel.nom}</td>
                    <td className="px-6 py-4 text-right font-mono text-gray-700">{invItem?.quantiteReelle || 0}</td>
                    <td className="px-6 py-4 text-right font-mono text-gray-700">{materiel.quantite}</td>
                    <td className={`px-6 py-4 text-right font-mono font-bold ${
                      ecart < 0 ? 'text-red-600' : ecart > 0 ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {ecart !== 0 ? (ecart > 0 ? '+' : '') + ecart : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {ecart === 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <CheckCircle size={12} />
                          OK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                          <AlertTriangle size={12} />
                          Écart
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

      {/* Métadonnées avec animation */}
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-sm text-gray-500 animate-fade-in-up" style={{ animationDelay: '900ms' }}>
        <p>Créé le {new Date(inventaire.createdAt).toLocaleString('fr-FR')}</p>
        {inventaire.updatedAt !== inventaire.createdAt && (
          <p>Modifié le {new Date(inventaire.updatedAt).toLocaleString('fr-FR')}</p>
        )}
      </div>

      {/* Modal de confirmation suppression */}
      <DeleteConfirmationModal
        isOpen={!!inventaireToDelete}
        onClose={() => setInventaireToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer l'inventaire"
        message={`Voulez-vous vraiment supprimer l'inventaire de la période "${inventaireToDelete?.periode}" ? Cette action est irréversible.`}
        confirmText={isDeleting ? "Suppression..." : "Supprimer"}
        cancelText="Annuler"
      />

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