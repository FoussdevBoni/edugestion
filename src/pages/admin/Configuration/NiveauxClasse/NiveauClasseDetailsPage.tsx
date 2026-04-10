// src/pages/admin/configuration/niveaux-classe/NiveauClasseDetailsPage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Edit, Trash2, Calendar, BookOpen,
  ChevronRight, Layers, Users, Plus,
  AlertCircle
} from "lucide-react";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import { Classe } from "../../../../utils/types/data";
import ClasseModals from "../../../../components/admin/modals/ClasseModals";
import useClasses from "../../../../hooks/classes/useClasses";
import ClassesList from "../../../../components/admin/lists/ClassesList";
import { niveauClasseService } from "../../../../services/niveauClasseService";
import { alertError, alertSuccess } from "../../../../helpers/alertError";

export default function NiveauClasseDetailsPage() {
  const location = useLocation();
  const niveauClasse = location.state;
  const navigate = useNavigate();
  const { classes, deleteClasse } = useClasses();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedClasse, setSelectedClasse] = useState<Classe | null>(null);
  const [classeToDelete, setClasseToDelete] = useState<Classe | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 animate-fade-in-up">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Niveau de classe non trouvé</h2>
          <p className="text-gray-500 mb-4">Les informations du niveau de classe sont introuvables.</p>
          <button
            onClick={() => navigate("/admin/configuration/niveaux-classe")}
            className="px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

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
      alertError();
      return;
    }
    setIsDeleting(true);
    try {
      await niveauClasseService.delete(niveauClasse.id);
      setOpenDeleteModal(false);
      alertSuccess("Niveau de classe supprimé avec succès");
      setTimeout(() => {
        navigate("/admin/configuration/niveaux-classe");
      }, 1500);
    } catch (error) {
      alertError();
    } finally {
      setIsDeleting(false);
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
      alertError();
      return;
    }
    try {
      deleteClasse(classeToDelete.id);
      setClasseToDelete(null);
      alertSuccess("Classe supprimée avec succès");
    } catch (error) {
      alertError();
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
                onClick={() => navigate("/admin/configuration/niveaux-classe")}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
              >
                <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{niveauClasse.nom}</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <Layers size={14} />
                  {niveauClasse.cycle} • {niveauClasse.niveauScolaire} • {classesDuNiveau.length} classe{classesDuNiveau.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAddClasse}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                <Plus size={16} />
                Ajouter une classe
              </button>
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
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Informations générales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Informations générales</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Layers size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Nom du niveau</p>
                    <p className="font-semibold text-gray-800">{niveauClasse.nom}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BookOpen size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cycle</p>
                    <p className="font-semibold text-gray-800">{niveauClasse.cycle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Layers size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Niveau scolaire</p>
                    <p className="font-semibold text-gray-800">{niveauClasse.niveauScolaire}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Calendar size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date de création</p>
                    <p className="font-semibold text-gray-800">{formatDate(niveauClasse.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Classes du niveau */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Users size={18} className="text-primary" />
                Classes ({classesDuNiveau.length})
              </h2>
              <button
                onClick={handleAddClasse}
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 font-medium"
              >
                <Plus size={16} />
                Ajouter une classe
              </button>
            </div>
            <div className="p-6">
              {classesDuNiveau.length > 0 ? (
                <ClassesList 
                  classes={classesDuNiveau} 
                  onAction={handleAction} 
                />
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">Aucune classe n'a encore été ajoutée à ce niveau</p>
                  <button
                    onClick={handleAddClasse}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300"
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

      {/* Modal de suppression niveau */}
      <DeleteConfirmationModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDelete}
        title="Supprimer le niveau de classe"
        message={`Êtes-vous sûr de vouloir supprimer le niveau "${niveauClasse.nom}" ? Cette action est irréversible et supprimera également toutes les classes associées.`}
        confirmText={isDeleting ? "Suppression..." : "Supprimer"}
        cancelText="Annuler"
      />

      {/* Modals pour classes */}
      <ClasseModals
        handleCloseDeleteModal={handleCloseDeleteModal}
        handleCloseMenuModal={handleCloseMenuModal}
        classeToDelete={classeToDelete}
        selectedClasse={selectedClasse}
        setClasseToDelete={setClasseToDelete}
        setSelectedClasse={setSelectedClasse}
        handleDelete={handleDeleteClasse}
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