// src/pages/admin/comptabilite/materiel/MaterielDetailsPage.tsx
import { useState, useMemo } from "react";
import {
  ArrowLeft, Edit, Trash2,
  ShoppingCart, ClipboardList, AlertTriangle,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Materiel } from "../../../../utils/types/data";
import { alertError, alertServerError } from "../../../../helpers/alertError";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import AchatsList from "../../../../components/admin/lists/AchatsList";
import useAchats from "../../../../hooks/achats/useAchats";
import useInventaires from "../../../../hooks/inventaires/useInventaires";
import useMateriels from "../../../../hooks/materiels/useMateriels";


export default function MaterielDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const materiel = location.state as Materiel;
  
  const { achats } = useAchats();
  const { inventaires } = useInventaires();
  const { deleteMateriel } = useMateriels();
  
  const [materielToDelete, setMaterielToDelete] = useState<Materiel | null>(null);
  const [achatToDelete, setAchatToDelete] = useState<any>(null);

  // Filtrer les achats pour ce matériel
  const achatsDuMateriel = useMemo(() => {
    return achats
      .filter(a => a.materielId === materiel.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [achats, materiel.id]);

  // Filtrer les inventaires pour ce matériel
  const inventairesDuMateriel = useMemo(() => {
    return inventaires
      .filter(inv => inv.materiels?.some(m => m.id === materiel.id))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [inventaires, materiel.id]);

  const handleDelete = async () => {
    if (!materielToDelete?.id) {
      alertError("Une erreur s'est produite");
      return;
    }
    try {
      await deleteMateriel(materielToDelete.id);
      navigate("/admin/comptabilite/materiel");
    } catch (error) {
      alertServerError(error);
    }
  };

  const handleAchatDelete = () => {
    if (!achatToDelete?.id) {
      alertError("Une erreur s'est produite");
      return;
    }
    // Logique de suppression d'achat
    setAchatToDelete(null);
  };

  const formatMoney = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  const stockBas = materiel.quantite < materiel.seuilAlerte;

  const totalAchats = useMemo(() => {
    return achatsDuMateriel.reduce((sum, a) => sum + a.quantite, 0);
  }, [achatsDuMateriel]);

  const valeurTotale = useMemo(() => {
    return achatsDuMateriel.reduce((sum, a) => sum + (a.total || a.quantite * a.prixUnitaire), 0);
  }, [achatsDuMateriel]);

  const dernierAchat = useMemo(() => {
    return achatsDuMateriel.length > 0 ? achatsDuMateriel[0] : null;
  }, [achatsDuMateriel]);

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
            <h1 className="text-2xl font-bold text-gray-800">{materiel.nom}</h1>
            <p className="text-sm text-gray-500 mt-1">Stock actuel: {materiel.quantite}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/admin/comptabilite/materiel/update`, { state: materiel })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit size={16} />
            Modifier
          </button>
          <button
            onClick={() => setMaterielToDelete(materiel)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 size={16} />
            Supprimer
          </button>
        </div>
      </div>

      {/* Infos principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-500">Stock actuel</span>
              <div className="flex items-center gap-3">
                <span className={`text-2xl font-bold ${stockBas ? 'text-orange-600' : 'text-primary'}`}>
                  {materiel.quantite} unités
                </span>
                {stockBas && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                    <AlertTriangle size={12} />
                    Stock bas
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-500">Total achats</span>
              <span className="text-xl font-semibold">
                {totalAchats} unités
              </span>
            </div>

            <div className="flex items-center justify-between pb-4 border-b">
              <span className="text-gray-500">Valeur totale</span>
              <span className="text-xl font-semibold text-primary">
                {formatMoney(valeurTotale)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Dernier achat</span>
              <span className="text-gray-800">
                {dernierAchat ? formatDate(dernierAchat.date) : '-'}
              </span>
            </div>

            {materiel.fournisseur && (
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-gray-500">Fournisseur</span>
                <span className="text-gray-800">{materiel.fournisseur}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Actions rapides</h2>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/admin/comptabilite/achats/new")}
              className="w-full flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
            >
              <ShoppingCart size={18} />
              <span className="font-medium">Nouvel achat</span>
            </button>

            <button
              onClick={() => navigate("/admin/comptabilite/inventaires/new")}
              className="w-full flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
            >
              <ClipboardList size={18} />
              <span className="font-medium">Nouvel inventaire</span>
            </button>
          </div>
        </div>
      </div>

      {/* Historique des achats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <ShoppingCart size={16} className="text-primary" />
            Historique des achats
          </h2>
          <button
            onClick={() => navigate("/admin/comptabilite/achats")}
            className="text-sm text-primary hover:underline"
          >
            Voir tout
          </button>
        </div>

        {achatsDuMateriel.length > 0 ? (
          <AchatsList
            achats={achatsDuMateriel}
            materiels={{ [materiel.id]: materiel.nom }}
            onDelete={setAchatToDelete}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucun achat pour ce matériel
          </div>
        )}
      </div>

      {/* Historique des inventaires */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <ClipboardList size={16} className="text-primary" />
            Historique des inventaires
          </h2>
          <button
            onClick={() => navigate("/admin/comptabilite/inventaires")}
            className="text-sm text-primary hover:underline"
          >
            Voir tout
          </button>
        </div>

        {inventairesDuMateriel.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Période</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantité relevée</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Écart</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventairesDuMateriel.map((inv) => {
                const quantiteReelle = inv.materiels.find(m => m.id === materiel.id)?.quantite || 0;
                const ecart = quantiteReelle - materiel.quantite;

                return (
                  <tr 
                    key={inv.id} 
                    className="hover:bg-gray-50 cursor-pointer" 
                    onClick={() => navigate(`/admin/comptabilite/inventaires/${inv.id}`, { state: inv })}
                  >
                    <td className="px-6 py-3 text-sm">{formatDate(inv.date)}</td>
                    <td className="px-6 py-3 text-sm">{inv.periode}</td>
                    <td className="px-6 py-3 text-right font-mono">{quantiteReelle}</td>
                    <td className={`px-6 py-3 text-right font-mono ${
                      ecart < 0 ? 'text-red-600' : ecart > 0 ? 'text-green-600' : ''
                    }`}>
                      {ecart !== 0 ? (ecart > 0 ? '+' : '') + ecart : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucun inventaire pour ce matériel
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={!!materielToDelete}
        onClose={() => setMaterielToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer le matériel"
        message={`Voulez-vous vraiment supprimer ${materiel.nom} ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />

      <DeleteConfirmationModal
        isOpen={!!achatToDelete}
        onClose={() => setAchatToDelete(null)}
        onConfirm={handleAchatDelete}
        title="Supprimer l'achat"
        message={`Voulez-vous vraiment supprimer cet achat ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}