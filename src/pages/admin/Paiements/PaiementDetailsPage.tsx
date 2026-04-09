// src/pages/admin/paiements/PaiementDetailsPage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Edit, Trash2, Calendar, User, CreditCard, 
  ChevronRight, FileText, Download, Printer
} from "lucide-react";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";

export default function PaiementDetailsPage() {
  const location = useLocation();
  const paiement = location.state;
  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  if (!paiement) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Paiement non trouvé</h2>
          <p className="text-gray-500 mb-4">Les informations du paiement sont introuvables.</p>
          <button
            onClick={() => navigate("/admin/paiements")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Retour à la liste
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

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(montant);
  };

  const handleUpdate = () => {
    navigate("/admin/paiements/update", { state: paiement });
  };

  const handleDelete = () => {
    console.log("Suppression du paiement:", paiement);
    setOpenDeleteModal(false);
    navigate("/admin/paiements");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    console.log("Export du reçu de paiement");
  };

  const getStatutColor = (statut: string) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/paiements")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Paiement #{paiement.id.slice(-6)}
                </h1>
                <p className="text-sm text-gray-500">
                  {formatDate(paiement.datePayement)} • {paiement.inscription?.classe}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Imprimer le reçu"
              >
                <Printer size={16} />
                <span className="hidden sm:inline">Imprimer</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Exporter le reçu"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Exporter</span>
              </button>
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

          {/* Fil d'Ariane */}
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
            <span onClick={() => navigate("/admin")} className="hover:text-primary cursor-pointer">
              Dashboard
            </span>
            <ChevronRight size={14} />
            <span onClick={() => navigate("/admin/paiements")} className="hover:text-primary cursor-pointer">
              Paiements
            </span>
            <ChevronRight size={14} />
            <span className="text-gray-700">#{paiement.id.slice(-6)}</span>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Carte de paiement */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-primary/5 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <CreditCard size={18} className="text-primary" />
                Détails du paiement
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations élève */}
                <div className="col-span-2 bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <User size={16} className="text-primary" />
                    Élève concerné
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Nom complet</p>
                      <p className="font-medium text-gray-800">
                        {paiement.inscription?.prenom} {paiement.inscription?.nom}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Classe</p>
                      <p className="font-medium text-gray-800">{paiement.inscription?.classe}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Matricule</p>
                      <p className="font-medium text-gray-800">{paiement.inscription?.matricule}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Année scolaire</p>
                      <p className="font-medium text-gray-800">{paiement.inscription?.anneeScolaire}</p>
                    </div>
                  </div>
                </div>

                {/* Montant payé */}
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Montant payé</p>
                  <p className="text-2xl font-bold text-green-700">{formatMontant(paiement.montantPaye)}</p>
                </div>

                {/* Montant restant */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Montant restant</p>
                  <p className="text-2xl font-bold text-yellow-700">{formatMontant(paiement.montantRestant)}</p>
                </div>

                {/* Statut */}
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${getStatutColor(paiement.statut)}`}>
                    {paiement.statut}
                  </span>
                </div>

                {/* Date de paiement */}
                <div>
                  <p className="text-sm text-gray-500">Date de paiement</p>
                  <p className="font-medium text-gray-800 flex items-center gap-1 mt-1">
                    <Calendar size={16} className="text-gray-400" />
                    {formatDate(paiement.datePayement)}
                  </p>
                </div>

                {/* Date de création */}
                <div>
                  <p className="text-sm text-gray-500">Date d'enregistrement</p>
                  <p className="font-medium text-gray-800 flex items-center gap-1 mt-1">
                    <Calendar size={16} className="text-gray-400" />
                    {formatDate(paiement.createdAt)}
                  </p>
                </div>

                {/* Référence */}
                <div>
                  <p className="text-sm text-gray-500">Référence</p>
                  <p className="font-medium text-gray-800 flex items-center gap-1 mt-1">
                    <FileText size={16} className="text-gray-400" />
                    #{paiement.id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions supplémentaires */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Printer size={16} />
              Imprimer le reçu
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Download size={16} />
              Télécharger le reçu
            </button>
          </div>
        </div>
      </div>

      {/* Modal de suppression */}
      <DeleteConfirmationModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDelete}
        title="Supprimer le paiement"
        message={`Êtes-vous sûr de vouloir supprimer ce paiement de ${formatMontant(paiement.montantPaye)} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}