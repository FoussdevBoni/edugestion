// src/pages/admin/parametres/scolarite/classes/ClasseDetailsPage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Edit, Trash2, Calendar, BookOpen,
  Layers, Users, User,
  MoreVertical,
  Download,
  UserPlus,
  FileText,
  AlertCircle
} from "lucide-react";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import { alertError, alertServerError, alertSuccess } from "../../../../helpers/alertError";
import { classeService } from "../../../../services/classeService";
import useEleves from "../../../../hooks/eleves/useEleves";
import ElevesList from "../../../../components/admin/lists/ElevesList";
import { Inscription } from "../../../../utils/types/data";
import useCarte from "../../../../hooks/eleves/useCarte";
import MenuModal from "../../../../components/ui/MenuModal";

interface PagesProps {
  config?: boolean
}
export default function ClasseDetailsPage({ config }: PagesProps) {
  const location = useLocation();
  const classe = location.state;
  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { eleves, deleteInscription } = useEleves();
  const [selectedEleve, setSelectedEleve] = useState<Inscription | null>(null);
  const [eleveToDelete, setEleveToDelete] = useState<Inscription | null>(null);
  const classeEleves = eleves.filter(item => item.classeId === classe?.id);

  const handleDeleteEleve = async () => {
    if (!eleveToDelete?.id) return;
    try {
      await deleteInscription(eleveToDelete.id);
      setEleveToDelete(null);
      alertSuccess("Élève supprimé avec succès");
    } catch (err) {
      alertServerError(err, "Erreur suppression");
    }
  };

  const { handleDownload } = useCarte({ eleve: selectedEleve });

  if (!classe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 animate-fade-in-up">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Classe non trouvée</h2>
          <p className="text-gray-500 mb-4">Les informations de la classe sont introuvables.</p>
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
      navigate("/admin/configuration/classes/update", { state: classe });
    } else {
      navigate("/admin/classes/update", { state: classe });
    }
  };

  const handleDelete = async () => {
    if (!classe?.id) {
      alertError();
      return;
    }
    setIsDeleting(true);
    try {
      await classeService.delete(classe.id);
      setOpenDeleteModal(false);
      alertSuccess("Classe supprimée avec succès");
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
                <h1 className="text-2xl font-bold text-gray-800">{classe.nom}</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <Layers size={14} />
                  {classe.niveauClasse} • {classe.cycle} • {classe.niveauScolaire}
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
          {/* Informations générales */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Informations générales</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Classe</p>
                    <p className="font-semibold text-gray-800">{classe.nom}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Layers size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Niveau de classe</p>
                    <p className="font-semibold text-gray-800">{classe.niveauClasse}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cycle</p>
                    <p className="font-semibold text-gray-800">{classe.cycle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Layers size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Niveau scolaire</p>
                    <p className="font-semibold text-gray-800">{classe.niveauScolaire}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Calendar size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date de création</p>
                    <p className="font-semibold text-gray-800">{formatDate(classe.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Élèves de la classe */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User size={18} className="text-primary" />
                Élèves ({classeEleves.length})
              </h2>
            </div>
            <div className="p-6">
              {classeEleves.length > 0 ? (
                <ElevesList 
                  eleves={classeEleves}
                  onAction={(eleve) => setSelectedEleve(eleve)}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500">Aucun élève dans cette classe pour le moment</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de suppression classe */}
      <DeleteConfirmationModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDelete}
        title="Supprimer la classe"
        message={`Êtes-vous sûr de vouloir supprimer la classe "${classe.nom}" ? Cette action est irréversible.`}
        confirmText={isDeleting ? "Suppression..." : "Supprimer"}
        cancelText="Annuler"
      />

      {/* Menu modal pour élève */}
      {selectedEleve && (
        <MenuModal
          title={`${selectedEleve.prenom} ${selectedEleve.nom}`}
          isOpen={!!selectedEleve}
          onClose={() => setSelectedEleve(null)}
          icon={<UserPlus className="text-primary" size={20} />}
          menu={[
            {
              label: "Voir détails",
              icon: FileText,
              onClick: () => { navigate("/admin/eleves/details", { state: selectedEleve }); setSelectedEleve(null); }
            },
            {
              label: "Modifier",
              icon: UserPlus,
              onClick: () => { navigate("/admin/eleves/update", { state: selectedEleve }); setSelectedEleve(null); }
            },
            {
              label: "Télécharger la carte",
              icon: Download,
              onClick: async () => { handleDownload(); }
            },
            {
              label: "Supprimer",
              icon: MoreVertical,
              onClick: () => { setEleveToDelete(selectedEleve); setSelectedEleve(null); }
            }
          ]}
        />
      )}

      {/* Modal suppression élève */}
      <DeleteConfirmationModal
        isOpen={!!eleveToDelete}
        onClose={() => setEleveToDelete(null)}
        onConfirm={handleDeleteEleve}
        title="Supprimer l'élève"
        message={`Voulez-vous vraiment supprimer ${eleveToDelete?.prenom} ${eleveToDelete?.nom} ?`}
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