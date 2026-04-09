// src/pages/admin/inscriptions/InscriptionDetailsPage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Edit, Trash2, CreditCard, Phone, MapPin,
  Award,
  MoreVertical,
  Printer,
  FileText
} from "lucide-react";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";
import PaiementsList from "../../../components/admin/lists/PaiementsList";
import { Paiement } from "../../../utils/types/data";
import MenuModal from "../../../components/ui/MenuModal";
import usePaiements from "../../../hooks/paiements/usePaiements";

export default function InscriptionDetailsPage() {
  const location = useLocation();
  const inscription = location.state;
  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  // 2. Local UI State
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);
  const [paiementToDelete, setPaiementToDelete] = useState<Paiement | null>(null);

  const { paiements} = usePaiements({
    where: { inscriptionId: inscription.id },
  })

  if (!inscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Inscription non trouvée</h2>
          <p className="text-gray-500 mb-4">Les informations de l'inscription sont introuvables.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
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

  const handleDelete = () => {
    console.log("Suppression de l'inscription:", inscription);
    setOpenDeleteModal(false);
    navigate("/admin/inscriptions");
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
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {inscription.prenom} {inscription.nom}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {inscription.matricule} • {inscription.classe}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleUpdate}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <Edit size={16} />
                Modifier
              </button>
              <button
                onClick={() => setOpenDeleteModal(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <Trash2 size={16} />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Informations personnelles */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Informations personnelles</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="font-medium text-gray-800">{inscription.nom} {inscription.prenom}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de naissance</p>
                  <p className="font-medium text-gray-800">{formatDate(inscription.dateNaissance)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lieu de naissance</p>
                  <p className="font-medium text-gray-800 flex items-center gap-1">
                    <MapPin size={14} className="text-gray-400" />
                    {inscription.lieuDeNaissance}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sexe</p>
                  <p className="font-medium text-gray-800">{inscription.sexe === 'M' ? 'Masculin' : 'Féminin'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="font-medium text-gray-800 flex items-center gap-1">
                    <Phone size={14} className="text-gray-400" />
                    {inscription.contact}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Matricule</p>
                  <p className="font-medium text-gray-800 flex items-center gap-1">
                    <Award size={14} className="text-gray-400" />
                    {inscription.matricule}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Informations scolaires */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Informations scolaires</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Classe</p>
                  <p className="font-medium text-gray-800">{inscription.classe}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Niveau de classe</p>
                  <p className="font-medium text-gray-800">{inscription.niveauClasse}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cycle</p>
                  <p className="font-medium text-gray-800">{inscription.cycle}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Niveau scolaire</p>
                  <p className="font-medium text-gray-800">{inscription.niveauScolaire}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Année scolaire</p>
                  <p className="font-medium text-gray-800">{inscription.anneeScolaire}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date d'inscription</p>
                  <p className="font-medium text-gray-800">{formatDate(inscription.dateInscription)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Statut scolaire</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatutScolaireColor(inscription.statutScolaire)}`}>
                    {inscription.statutScolaire}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Statut paiement</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatutPayementColor(inscription.statutPayement)}`}>
                    {inscription.statutPayement}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Historique des paiements (simplifié) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <CreditCard size={18} className="text-primary" />
                Historique des paiements
              </h2>
            </div>
            <div className="p-6">
              {paiements && paiements.length > 0 ? (
                <div className="space-y-2">
                  <PaiementsList paiements={paiements}

                    onAction={(paiement) => {
                      setSelectedPaiement(paiement)
                    }}

                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 mb-4">Aucun paiement enregistré pour cet élève</p>
                  <button className="text-primary hover:text-primary/80 text-sm font-medium">
                    + Ajouter un paiement
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de suppression */}
      <DeleteConfirmationModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDelete}
        title="Supprimer l'inscription"
        message={`Êtes-vous sûr de vouloir supprimer l'inscription de ${inscription.prenom} ${inscription.nom} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />


      {selectedPaiement && (
        <MenuModal
          title={`Paiement #${selectedPaiement.id.slice(-6)}`}
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


      <DeleteConfirmationModal
        isOpen={!!paiementToDelete}
        onClose={() => setPaiementToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer le paiement"
        message="Voulez-vous vraiment supprimer ce paiement ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}