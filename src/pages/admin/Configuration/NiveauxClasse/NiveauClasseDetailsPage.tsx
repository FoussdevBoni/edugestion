// src/pages/admin/configuration/niveaux-classe/NiveauClasseDetailsPage.tsx

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Edit, Trash2, Calendar, BookOpen,
  ChevronRight, Layers, Users, Plus
} from "lucide-react";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import { Classe } from "../../../../utils/types/data";
import ClasseModals from "../../../../components/admin/modals/ClasseModals";
import useClasses from "../../../../hooks/classes/useClasses";
import ClassesList from "../../../../components/admin/lists/ClassesList";
import { niveauClasseService } from "../../../../services/niveauClasseService";

export default function NiveauClasseDetailsPage() {
  const location = useLocation();
  const niveauClasse = location.state;
  const navigate = useNavigate();
  const { classes, deleteClasse } = useClasses()
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedClasse, setSelectedClasse] = useState<Classe | null>(null);
  const [classeToDelete, setClasseToDelete] = useState<Classe | null>(null);

  const handleAction = (classe: Classe) => {
    setSelectedClasse(classe);
  };

  const handleCloseMenuModal = () => {
    setSelectedClasse(null);
  };

  const handleCloseDeleteModal = () => {
    setClasseToDelete(null);
  };
  

  if (!niveauClasse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Niveau de classe non trouvé</h2>
          <p className="text-gray-500 mb-4">Les informations du niveau de classe sont introuvables.</p>
          <button
            onClick={() => navigate("/admin/configuration/niveaux-classe")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  // Récupérer les classes de ce niveau
  const classesDuNiveau = classes.filter(c => c.niveauClasseId === niveauClasse.id);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleUpdate = () => {
    navigate("/admin/configuration/niveaux-classe/update", { state: niveauClasse });
  };

  const handleDelete = async () => {
    if (!niveauClasse.id) {
      alert("Une erreur s'est produite")
      return
    }
    try {
      await niveauClasseService.delete(niveauClasse.id)
      setOpenDeleteModal(false);
      navigate("/admin/configuration/niveaux-classe");
    } catch (error) {
      alert("Une erreur s'est produite")

    }
  };

  const handleAddClasse = () => {
    navigate("/admin/configuration/classes/new", {
      state: {
        niveauClasseId: niveauClasse.id,
        niveauClasseNom: niveauClasse.nom,
        cycle: niveauClasse.cycle,
        niveauScolaire: niveauClasse.niveauScolaire
      }
    });
  };



  const handleDeleteClasse = () => {
    if (!classeToDelete?.id) {
      alert("Une erreur s'est produite")
      return
    }
    try {
      deleteClasse(classeToDelete?.id)
      setClasseToDelete(null)
    } catch (error) {
      alert("Une erreur s'est produite")

    }
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/configuration/niveaux-classe")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{niveauClasse.nom}</h1>
                <p className="text-sm text-gray-500">
                  {niveauClasse.cycle} • {niveauClasse.niveauScolaire} • {classesDuNiveau.length} classe{classesDuNiveau.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAddClasse}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <Plus size={16} />
                Ajouter une classe
              </button>
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
            <span onClick={() => navigate("/admin/configuration/niveaux-classe")} className="hover:text-primary cursor-pointer">
              Niveaux de classe
            </span>
            <ChevronRight size={14} />
            <span className="text-gray-700">{niveauClasse.nom}</span>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Informations générales */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Informations générales</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Nom du niveau</p>
                  <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                    <Layers size={16} className="text-primary" />
                    {niveauClasse.nom}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cycle</p>
                  <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                    <BookOpen size={16} className="text-purple-500" />
                    {niveauClasse.cycle}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Niveau scolaire</p>
                  <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                    <Layers size={16} className="text-blue-500" />
                    {niveauClasse.niveauScolaire}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de création</p>
                  <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                    <Calendar size={16} className="text-gray-400" />
                    {formatDate(niveauClasse.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Classes du niveau */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Users size={18} className="text-primary" />
                Classes ({classesDuNiveau.length})
              </h2>
              <button
                onClick={handleAddClasse}
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
              >
                <Plus size={16} />
                Ajouter une classe
              </button>
            </div>
            <div className="p-6">
              {classesDuNiveau.length > 0 ? (
                <ClassesList classes={classesDuNiveau} onAction={(classe) => {
                  handleAction(classe)
                }} />
              ) : (
                <div className="text-center py-8">
                  <Users size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 mb-4">Aucune classe n'a encore été ajoutée à ce niveau</p>
                  <button
                    onClick={handleAddClasse}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    <Plus size={16} />
                    Ajouter une classe
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
        title="Supprimer le niveau de classe"
        message={`Êtes-vous sûr de vouloir supprimer le niveau "${niveauClasse.nom}" ? Cette action est irréversible et supprimera également toutes les classes associées.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />

      <ClasseModals
        handleCloseDeleteModal={handleCloseDeleteModal}
        handleCloseMenuModal={handleCloseMenuModal}
        classeToDelete={classeToDelete}
        selectedClasse={selectedClasse}
        setClasseToDelete={setClasseToDelete}
        setSelectedClasse={setSelectedClasse}
        handleDelete={handleDeleteClasse}
      />
    </div>
  );
}