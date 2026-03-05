import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2} from "lucide-react";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";

export default function EleveDetailsPage() {
  const location = useLocation();
  const eleve = location.state;
  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleUpdate = () => {
    navigate(`/admin/eleves/update`, { state: eleve });
  };

  const handleDelete = () => {
    console.log("Suppression de l'élève:", eleve);
    setOpenDeleteModal(false);
    navigate("/admin/eleves");
  };

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/admin/eleves")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {eleve?.prenom} {eleve?.nom}
          </h1>
          <p className="text-sm text-gray-500">Détails de l'élève</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={handleUpdate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          <Edit size={16} />
          Modifier
        </button>
        <button
          onClick={() => setOpenDeleteModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          <Trash2 size={16} />
          Supprimer
        </button>
      </div>

      {/* Informations de l'élève */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Informations personnelles</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Nom</p>
            <p className="font-medium">{eleve?.nom}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Prénom</p>
            <p className="font-medium">{eleve?.prenom}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date de naissance</p>
            <p className="font-medium">{eleve?.dateNaissance}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Sexe</p>
            <p className="font-medium">{eleve?.sexe === "M" ? "Masculin" : "Féminin"}</p>
          </div>
        </div>
      </div>

      {/* Informations scolaires */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
        <h2 className="text-lg font-semibold mb-4">Informations scolaires</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Niveau scolaire</p>
            <p className="font-medium">{eleve?.niveauScolaire}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cycle</p>
            <p className="font-medium">{eleve?.cycle}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Classe</p>
            <p className="font-medium">{eleve?.classe}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Section</p>
            <p className="font-medium">{eleve?.section || "Aucune"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Année scolaire</p>
            <p className="font-medium">{eleve?.anneeScolaire}</p>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDelete}
        title="Supprimer l'élève"
        message={`Êtes-vous sûr de vouloir supprimer ${eleve?.prenom} ${eleve?.nom} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}