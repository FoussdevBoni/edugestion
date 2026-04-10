import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Edit, Trash2, Mail, Phone, BookOpen,
  Users, Calendar, AlertCircle, User
} from "lucide-react";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";
import { alertError, alertSuccess } from "../../../helpers/alertError";
import { enseignantService } from "../../../services/enseignantService";
import EmploiEnseignant from "../../../components/admin/details/EmploiEnseignant";

export default function EnseignantDetailsPage() {
  const location = useLocation();
  const enseignant = location.state;
  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const enseignementsParClasse = enseignant?.enseignementsData?.reduce((acc: any, item: any) => {
    if (!acc[item.classe]) {
      acc[item.classe] = [];
    }
    acc[item.classe].push(item.matiere);
    return acc;
  }, {} as Record<string, string[]>) || {};

  if (!enseignant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 animate-fade-in-up">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Enseignant non trouvé</h2>
          <p className="text-gray-500 mb-4">Les informations de l'enseignant sont introuvables.</p>
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

  const handleUpdate = () => {
    navigate("/admin/enseignants/update", { state: enseignant });
  };

  const handleDelete = async () => {
    if (!enseignant.id) {
      alertError();
      return;
    }
    setIsDeleting(true);
    try {
      await enseignantService.delete(enseignant.id);
      setOpenDeleteModal(false);
      alertSuccess("Enseignant supprimé avec succès");
      setTimeout(() => {
        navigate("/admin/enseignants");
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
                <h1 className="text-2xl font-bold text-gray-800">
                  {enseignant.prenom} {enseignant.nom}
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <User size={14} />
                  Fiche enseignant • {enseignant.enseignementsData?.length || 0} enseignement(s)
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

      {/* Contenu principal avec animations */}
      <div className="p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Informations personnelles */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Informations personnelles</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Nom complet</p>
                      <p className="font-semibold text-gray-800">{enseignant.nom} {enseignant.prenom}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mail size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-semibold text-gray-800">{enseignant.email}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Phone size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Téléphone</p>
                      <p className="font-semibold text-gray-800">{enseignant.tel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar size={16} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date d'ajout</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(enseignant.createdAt || "").toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enseignements par classe */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <BookOpen size={18} className="text-primary" />
                Enseignements par classe
              </h2>
            </div>
            <div className="p-6">
              {Object.keys(enseignementsParClasse).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(enseignementsParClasse).map(([classe, matieres]) => (
                    <div key={classe} className="border border-gray-100 rounded-xl p-4 transition-all duration-300 hover:shadow-sm">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                          <Users size={14} className="text-blue-600" />
                        </div>
                        {classe}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(matieres as any).map((matiere: any, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                          >
                            {matiere}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500">Aucun enseignement assigné</p>
                </div>
              )}
            </div>
          </div>

          {/* Emploi du temps */}
          <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <EmploiEnseignant enseignant={enseignant} />
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDelete}
        title="Supprimer l'enseignant"
        message={`Êtes-vous sûr de vouloir supprimer ${enseignant.prenom} ${enseignant.nom} ? Cette action est irréversible.`}
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