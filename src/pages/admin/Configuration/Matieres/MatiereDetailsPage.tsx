// src/pages/admin/configuration/matieres/MatiereDetailsPage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Edit, Trash2, Calendar, BookOpen, Layers, Hash,
  AlertCircle
} from "lucide-react";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import { alertError, alertSuccess } from "../../../../helpers/alertError";
import { matiereService } from "../../../../services/matiereService";

interface PagesProps {
  config?: boolean
}

export default function MatiereDetailsPage({ config }: PagesProps) {
  const location = useLocation();
  const matiere = location.state;
  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!matiere) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 animate-fade-in-up">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Matière non trouvée</h2>
          <p className="text-gray-500 mb-4">Les informations de la matière sont introuvables.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300"
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
    if (config) {
      navigate("/admin/configuration/matieres/update", { state: matiere });
    } else {
      navigate("/admin/matieres/update", { state: matiere });
    }
  };

  const handleDelete = async () => {
    if (!matiere.id) {
      alertError();
      return;
    }
    setIsDeleting(true);
    try {
      await matiereService.delete(matiere.id);
      setOpenDeleteModal(false);
      alertSuccess("Matière supprimée avec succès");
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      alertError();
    } finally {
      setIsDeleting(false);
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
                <h1 className="text-2xl font-bold text-gray-800">{matiere.nom}</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <Hash size={14} />
                  Coefficient {matiere.coefficient} • {matiere.niveauClasse}
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

      {/* Contenu avec animation */}
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          {/* Informations générales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Informations générales</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Nom de la matière</p>
                    <p className="font-semibold text-gray-800">{matiere.nom}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Hash size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Coefficient</p>
                    <p className="font-semibold text-gray-800">{matiere.coefficient}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Layers size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Niveau de classe</p>
                    <p className="font-semibold text-gray-800">{matiere.niveauClasse}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Calendar size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date de création</p>
                    <p className="font-semibold text-gray-800">{formatDate(matiere.createdAt)}</p>
                  </div>
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