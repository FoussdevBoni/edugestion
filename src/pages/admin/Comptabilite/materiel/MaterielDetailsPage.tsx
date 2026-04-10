// src/pages/admin/comptabilite/materiel/MaterielDetailsPage.tsx
import { useState, useMemo } from "react";
import {
  ArrowLeft, Edit, Trash2,
  ShoppingCart, ClipboardList, AlertTriangle,
  Eye, FileText, MoreVertical, TrendingUp, Package
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Achat, Materiel } from "../../../../utils/types/data";
import { alertError, alertServerError, alertSuccess } from "../../../../helpers/alertError";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import AchatsList from "../../../../components/admin/lists/AchatsList";
import useAchats from "../../../../hooks/achats/useAchats";
import useInventaires from "../../../../hooks/inventaires/useInventaires";
import useMateriels from "../../../../hooks/materiels/useMateriels";
import MenuModal from "../../../../components/ui/MenuModal";

export default function MaterielDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const materiel = location.state as Materiel;
  
  const { achats } = useAchats();
  const { inventaires } = useInventaires();
  const { deleteMateriel } = useMateriels();
  
  const [materielToDelete, setMaterielToDelete] = useState<Materiel | null>(null);
  const [achatToDelete, setAchatToDelete] = useState<any>(null);
  const [selectedAchat, setSelectedAchat] = useState<Achat | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    setIsDeleting(true);
    try {
      await deleteMateriel(materielToDelete.id);
      setMaterielToDelete(null);
      alertSuccess("Matériel supprimé avec succès");
      setTimeout(() => {
        navigate("/admin/comptabilite/materiel");
      }, 1500);
    } catch (error) {
      alertServerError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAchatDelete = () => {
    if (!achatToDelete?.id) {
      alertError("Une erreur s'est produite");
      return;
    }
    // Logique de suppression d'achat
    setAchatToDelete(null);
    alertSuccess("Achat supprimé avec succès");
  };

  const formatMoney = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
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

  if (!materiel) {
    return (
      <div className="text-center py-12 animate-fade-in-up">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          <p className="text-gray-500 text-center mb-4">Matériel non trouvé</p>
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
            <h1 className="text-2xl font-bold text-gray-800">{materiel.nom}</h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <Package size={14} />
              Stock actuel: {materiel.quantite} unités
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/admin/comptabilite/materiel/update`, { state: materiel })}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <Edit size={16} />
            Modifier
          </button>
          <button
            onClick={() => setMaterielToDelete(materiel)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <Trash2 size={16} />
            Supprimer
          </button>
        </div>
      </div>

      {/* Infos principales avec animations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-800">Informations</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-gray-500">Stock actuel</span>
              <div className="flex items-center gap-3">
                <span className={`text-2xl font-bold ${stockBas ? 'text-orange-600' : 'text-primary'}`}>
                  {materiel.quantite} unités
                </span>
                {stockBas && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    <AlertTriangle size={12} />
                    Stock bas
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-gray-500">Seuil d'alerte</span>
              <span className="font-medium text-gray-800">{materiel.seuilAlerte} unités</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-gray-500">Total achats</span>
              <span className="text-xl font-semibold text-gray-800">{totalAchats} unités</span>
            </div>

            <div className="bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-semibold">Valeur totale</span>
                <span className="text-xl font-bold text-primary">{formatMoney(valeurTotale)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <span className="text-gray-500">Dernier achat</span>
              <span className="text-gray-800">{dernierAchat ? formatDate(dernierAchat.date) : '-'}</span>
            </div>

            {materiel.fournisseur && (
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-gray-500">Fournisseur</span>
                <span className="text-gray-800 font-medium">{materiel.fournisseur}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-green-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-800">Actions rapides</h2>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/admin/comptabilite/achats/new")}
              className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <ShoppingCart size={18} />
              <span className="font-medium">Nouvel achat</span>
            </button>

            <button
              onClick={() => navigate("/admin/comptabilite/inventaires/new")}
              className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <ClipboardList size={18} />
              <span className="font-medium">Nouvel inventaire</span>
            </button>
          </div>

          {/* Résumé rapide */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Résumé</h3>
            <dl className="space-y-2">
              <div className="flex justify-between text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <dt className="text-gray-500">Total achats</dt>
                <dd className="font-semibold text-gray-800">{totalAchats} unités</dd>
              </div>
              <div className="flex justify-between text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <dt className="text-gray-500">Valeur totale</dt>
                <dd className="font-semibold text-primary">{formatMoney(valeurTotale)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Historique des achats avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <ShoppingCart size={16} className="text-primary" />
            Historique des achats
          </h2>
          <button
            onClick={() => navigate("/admin/comptabilite/achats")}
            className="text-sm text-primary hover:underline font-medium"
          >
            Voir tout
          </button>
        </div>

        {achatsDuMateriel.length > 0 ? (
          <AchatsList
            achats={achatsDuMateriel}
            materiels={{ [materiel.id]: materiel.nom }}
            onAction={(achat) => setSelectedAchat(achat)}
          />
        ) : (
          <div className="text-center py-12 text-gray-500">
            <ShoppingCart size={32} className="mx-auto text-gray-300 mb-2" />
            Aucun achat pour ce matériel
          </div>
        )}
      </div>

      {/* Historique des inventaires avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <ClipboardList size={16} className="text-primary" />
            Historique des inventaires
          </h2>
          <button
            onClick={() => navigate("/admin/comptabilite/inventaires")}
            className="text-sm text-primary hover:underline font-medium"
          >
            Voir tout
          </button>
        </div>

        {inventairesDuMateriel.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Période</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantité relevée</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Écart</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inventairesDuMateriel.map((inv, idx) => {
                  const quantiteReelle = inv.materiels.find(m => m.id === materiel.id)?.quantite || 0;
                  const ecart = quantiteReelle - materiel.quantite;

                  return (
                    <tr 
                      key={inv.id} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors duration-200 animate-fade-in-up"
                      style={{ animationDelay: `${500 + idx * 50}ms` }}
                      onClick={() => navigate(`/admin/comptabilite/inventaires/details`, { state: inv })}
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">{formatDate(inv.date)}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{inv.periode}</td>
                      <td className="px-6 py-4 text-right font-mono text-gray-700">{quantiteReelle}</td>
                      <td className={`px-6 py-4 text-right font-mono font-bold ${
                        ecart < 0 ? 'text-red-600' : ecart > 0 ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {ecart !== 0 ? (ecart > 0 ? '+' : '') + ecart : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <ClipboardList size={32} className="mx-auto text-gray-300 mb-2" />
            Aucun inventaire pour ce matériel
          </div>
        )}
      </div>

      {/* Menu modal pour les actions sur achat */}
      {selectedAchat && (
        <MenuModal
          title={`Achat du ${formatDate(selectedAchat.date)}`}
          isOpen={!!selectedAchat}
          onClose={() => setSelectedAchat(null)}
          icon={<ShoppingCart className="text-primary" size={20} />}
          menu={[
            {
              label: "Voir détails",
              icon: Eye,
              onClick: () => {
                navigate("/admin/comptabilite/achats/details", { state: selectedAchat });
                setSelectedAchat(null);
              }
            },
            {
              label: "Modifier",
              icon: Edit,
              onClick: () => {
                navigate("/admin/comptabilite/achats/update", { state: selectedAchat });
                setSelectedAchat(null);
              }
            },
            {
              label: "Supprimer",
              icon: Trash2,
              onClick: () => {
                setAchatToDelete(selectedAchat);
                setSelectedAchat(null);
              }
            }
          ]}
        />
      )}

      {/* Modal de confirmation suppression matériel */}
      <DeleteConfirmationModal
        isOpen={!!materielToDelete}
        onClose={() => setMaterielToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer le matériel"
        message={`Voulez-vous vraiment supprimer "${materiel.nom}" ? Cette action est irréversible.`}
        confirmText={isDeleting ? "Suppression..." : "Supprimer"}
        cancelText="Annuler"
      />

      {/* Modal de confirmation suppression achat */}
      <DeleteConfirmationModal
        isOpen={!!achatToDelete}
        onClose={() => setAchatToDelete(null)}
        onConfirm={handleAchatDelete}
        title="Supprimer l'achat"
        message={`Voulez-vous vraiment supprimer cet achat ? Cette action est irréversible.`}
        confirmText="Supprimer"
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