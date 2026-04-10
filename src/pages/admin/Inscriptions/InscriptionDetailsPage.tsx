import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Edit, Trash2, CreditCard, Phone, MapPin,
  Award, MoreVertical, Printer, FileText, User, Calendar,
  School, AlertCircle
} from "lucide-react";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";
import PaiementsList from "../../../components/admin/lists/PaiementsList";
import { Paiement } from "../../../utils/types/data";
import MenuModal from "../../../components/ui/MenuModal";
import usePaiements from "../../../hooks/paiements/usePaiements";
import { alertSuccess } from "../../../helpers/alertError";

export default function InscriptionDetailsPage() {
  const location = useLocation();
  const inscription = location.state;
  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);
  const [paiementToDelete, setPaiementToDelete] = useState<Paiement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { paiements } = usePaiements({
    where: { inscriptionId: inscription?.id },
  });

  if (!inscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 animate-fade-in-up">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Inscription non trouvée</h2>
          <p className="text-gray-500 mb-4">Les informations de l'inscription sont introuvables.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleUpdate = () => {
    navigate("/admin/inscriptions/update", { state: inscription });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // await deleteInscription(inscription.id);
      setOpenDeleteModal(false);
      alertSuccess("Inscription supprimée avec succès");
      setTimeout(() => {
        navigate("/admin/inscriptions");
      }, 1500);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeletePaiement = async () => {
    if (!paiementToDelete?.id) return;
    try {
      // await deletePaiement(paiementToDelete.id);
      setPaiementToDelete(null);
      alertSuccess("Paiement supprimé avec succès");
    } catch (error) {
      console.error(error);
    }
  };

  const getStatutPayementColor = (statut: string) => {
    switch (statut) {
      case 'paye':
        return 'bg-green-100 text-green-700';
      case 'partiellement':
        return 'bg-yellow-100 text-yellow-700';
      case 'impaye':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatutScolaireColor = (statut: string) => {
    switch (statut) {
      case 'nouveau':
        return 'bg-blue-100 text-blue-700';
      case 'redoublant':
        return 'bg-purple-100 text-purple-700';
      case 'transfert':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* En-tête sticky avec animation */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10 animate-fade-in-up">
        <div className="px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
              >
                <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {inscription.prenom} {inscription.nom}
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <Award size={14} />
                  {inscription.matricule} • {inscription.classe}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleUpdate}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                <Edit size={16} />
                Modifier
              </button>
              <button
                onClick={() => setOpenDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                <Trash2 size={16} />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu avec animations */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Informations personnelles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User size={18} className="text-primary" />
                Informations personnelles
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Nom complet</p>
                    <p className="font-semibold text-gray-800">{inscription.nom} {inscription.prenom}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date de naissance</p>
                    <p className="font-semibold text-gray-800">{formatDate(inscription.dateNaissance)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MapPin size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Lieu de naissance</p>
                    <p className="font-semibold text-gray-800">{inscription.lieuDeNaissance}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-green-600 text-sm font-bold">{inscription.sexe === 'M' ? '♂' : '♀'}</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Sexe</p>
                    <p className="font-semibold text-gray-800">{inscription.sexe === 'M' ? 'Masculin' : 'Féminin'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Phone size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Contact</p>
                    <p className="font-semibold text-gray-800">{inscription.contact}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Award size={16} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Matricule</p>
                    <p className="font-semibold font-mono text-gray-800">{inscription.matricule}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informations scolaires */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <School size={18} className="text-primary" />
                Informations scolaires
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Classe</p>
                  <p className="font-semibold text-gray-800">{inscription.classe}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Niveau de classe</p>
                  <p className="font-semibold text-gray-800">{inscription.niveauClasse}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Cycle</p>
                  <p className="font-semibold text-gray-800">{inscription.cycle}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Niveau scolaire</p>
                  <p className="font-semibold text-gray-800">{inscription.niveauScolaire}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Année scolaire</p>
                  <p className="font-semibold text-gray-800">{inscription.anneeScolaire}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Date d'inscription</p>
                  <p className="font-semibold text-gray-800">{formatDate(inscription.dateInscription)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Statut scolaire</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${getStatutScolaireColor(inscription.statutScolaire)}`}>
                    {inscription.statutScolaire}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">Statut paiement</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${getStatutPayementColor(inscription.statutPayement)}`}>
                    {inscription.statutPayement}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Historique des paiements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <CreditCard size={18} className="text-primary" />
                Historique des paiements
              </h2>
            </div>
            <div className="p-6">
              {paiements && paiements.length > 0 ? (
                <PaiementsList
                  paiements={paiements}
                  onAction={(paiement) => setSelectedPaiement(paiement)}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CreditCard size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">Aucun paiement enregistré pour cet élève</p>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium inline-flex items-center gap-1">
                    + Ajouter un paiement
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal suppression inscription */}
      <DeleteConfirmationModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDelete}
        title="Supprimer l'inscription"
        message={`Êtes-vous sûr de vouloir supprimer l'inscription de ${inscription.prenom} ${inscription.nom} ? Cette action est irréversible.`}
        confirmText={isDeleting ? "Suppression..." : "Supprimer"}
        cancelText="Annuler"
      />

      {/* Menu modal paiement */}
      {selectedPaiement && (
        <MenuModal
          title={`Paiement #${selectedPaiement.id?.slice(-6)}`}
          isOpen={!!selectedPaiement}
          onClose={() => setSelectedPaiement(null)}
          icon={<FileText className="text-primary" size={20} />}
          menu={[
            {
              label: "Voir détails",
              icon: FileText,
              onClick: () => { navigate("/admin/paiements/details", { state: selectedPaiement }); setSelectedPaiement(null); }
            },
            {
              label: "Modifier",
              icon: Edit,
              onClick: () => { navigate("/admin/paiements/update", { state: selectedPaiement }); setSelectedPaiement(null); }
            },
            {
              label: "Imprimer le reçu",
              icon: Printer,
              onClick: () => { console.log("Print", selectedPaiement.id); setSelectedPaiement(null); }
            },
            {
              label: "Supprimer",
              icon: MoreVertical,
              onClick: () => { setPaiementToDelete(selectedPaiement); setSelectedPaiement(null); }
            }
          ]}
        />
      )}

      {/* Modal suppression paiement */}
      <DeleteConfirmationModal
        isOpen={!!paiementToDelete}
        onClose={() => setPaiementToDelete(null)}
        onConfirm={handleDeletePaiement}
        title="Supprimer le paiement"
        message="Voulez-vous vraiment supprimer ce paiement ? Cette action est irréversible."
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