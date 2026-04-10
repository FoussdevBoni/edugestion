import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, User, Calendar, BookOpen, GraduationCap, AlertCircle } from "lucide-react";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";
import { alertError, alertSuccess } from "../../../helpers/alertError";
import useEleves from "../../../hooks/eleves/useEleves";

export default function EleveDetailsPage() {
  const location = useLocation();
  const eleve = location.state;
  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteInscription } = useEleves();

  if (!eleve) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 animate-fade-in-up">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Élève non trouvé</h2>
          <p className="text-gray-500 mb-4">Les informations de l'élève sont introuvables.</p>
          <button
            onClick={() => navigate("/admin/eleves")}
            className="px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  const handleUpdate = () => {
    navigate(`/admin/eleves/update`, { state: eleve });
  };

  const handleDelete = async () => {
    if (!eleve.id) {
      alertError();
      return;
    }
    setIsDeleting(true);
    try {
      await deleteInscription(eleve.id);
      setOpenDeleteModal(false);
      alertSuccess("Élève supprimé avec succès");
      setTimeout(() => {
        navigate("/admin/eleves");
      }, 1500);
    } catch (error) {
      alertError();
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="p-6">
        {/* En-tête avec animation */}
        <div className="flex items-center gap-4 mb-6 animate-fade-in-up">
          <button
            onClick={() => navigate("/admin/eleves")}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
          >
            <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {eleve?.prenom} {eleve?.nom}
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <User size={14} />
              Détails de l'élève
            </p>
          </div>
        </div>

        {/* Actions avec animation */}
        <div className="flex gap-3 mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
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

        {/* Informations personnelles */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <User size={18} className="text-primary" />
              Informations personnelles
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Nom complet</p>
                  <p className="font-semibold text-gray-800">{eleve?.nom} {eleve?.prenom}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar size={16} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date de naissance</p>
                  <p className="font-semibold text-gray-800">{formatDate(eleve?.dateNaissance)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-blue-600 text-sm font-bold">{eleve?.sexe === "M" ? "♂" : "♀"}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Sexe</p>
                  <p className="font-semibold text-gray-800">{eleve?.sexe === "M" ? "Masculin" : "Féminin"}</p>
                </div>
              </div>

              {eleve?.matricule && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-green-600 text-sm font-bold">#</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Matricule</p>
                    <p className="font-semibold font-mono text-gray-800">{eleve?.matricule}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informations scolaires */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <GraduationCap size={18} className="text-primary" />
              Informations scolaires
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <BookOpen size={16} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Niveau scolaire</p>
                  <p className="font-semibold text-gray-800">{eleve?.niveauScolaire || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <BookOpen size={16} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Cycle</p>
                  <p className="font-semibold text-gray-800">{eleve?.cycle || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <GraduationCap size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Classe</p>
                  <p className="font-semibold text-gray-800">{eleve?.classe || "-"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Calendar size={16} className="text-teal-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Année scolaire</p>
                  <p className="font-semibold text-gray-800">{eleve?.anneeScolaire || "-"}</p>
                </div>
              </div>
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
          confirmText={isDeleting ? "Suppression..." : "Supprimer"}
          cancelText="Annuler"
        />
      </div>

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