// src/pages/admin/configuration/matieres/MatiereDetailsPage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Edit, Trash2, Calendar, BookOpen, 
  ChevronRight, Layers, Hash
} from "lucide-react";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";

export default function MatiereDetailsPage() {
  const location = useLocation();
  const matiere = location.state;
  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  if (!matiere) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Matière non trouvée</h2>
          <p className="text-gray-500 mb-4">Les informations de la matière sont introuvables.</p>
          <button
            onClick={() => navigate("/admin/configuration/matieres")}
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

  const handleUpdate = () => {
    navigate("/admin/configuration/matieres/update", { state: matiere });
  };

  const handleDelete = () => {
    console.log("Suppression de la matière:", matiere);
    setOpenDeleteModal(false);
    navigate("/admin/configuration/matieres");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/configuration/matieres")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{matiere.nom}</h1>
                <p className="text-sm text-gray-500">
                  Coefficient {matiere.coefficient} • {matiere.niveauClasse}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleUpdate}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
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
            <span onClick={() => navigate("/admin/parametres")} className="hover:text-primary cursor-pointer">
              Paramètres
            </span>
            <ChevronRight size={14} />
            <span onClick={() => navigate("/admin/configuration/matieres")} className="hover:text-primary cursor-pointer">
              Matières
            </span>
            <ChevronRight size={14} />
            <span className="text-gray-700">{matiere.nom}</span>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          {/* Informations générales */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Informations générales</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Nom de la matière</p>
                  <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                    <BookOpen size={16} className="text-primary" />
                    {matiere.nom}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Coefficient</p>
                  <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                    <Hash size={16} className="text-purple-500" />
                    {matiere.coefficient}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Niveau de classe</p>
                  <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                    <Layers size={16} className="text-blue-500" />
                    {matiere.niveauClasse}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de création</p>
                  <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                    <Calendar size={16} className="text-gray-400" />
                    {formatDate(matiere.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de suppression */}
      <DeleteConfirmationModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDelete}
        title="Supprimer la matière"
        message={`Êtes-vous sûr de vouloir supprimer la matière "${matiere.nom}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}