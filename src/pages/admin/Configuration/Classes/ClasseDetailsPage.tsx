// src/pages/admin/parametres/scolarite/classes/ClasseDetailsPage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Edit, Trash2, Calendar, BookOpen,
  Layers, Users, User,
  MoreVertical,
  Download,
  UserPlus,
  FileText
} from "lucide-react";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import { alertError, alertServerError } from "../../../../helpers/alertError";
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
  const { eleves, deleteInscription } = useEleves()
  const [selectedEleve, setSelectedEleve] = useState<Inscription | null>(null);
  const [eleveToDelete, setEleveToDelete] = useState<Inscription | null>(null);
  const classeEleves = eleves.filter(item => item.classeId === classe.id)


  const handleDeleteEleve = async () => {
    if (!eleveToDelete?.id) return;
    try {
      await deleteInscription(eleveToDelete.id);
      setEleveToDelete(null);
    } catch (err) {
      alertServerError(err, "Erreur suppression");
    }
  };

  const { handleDownload } = useCarte({ eleve: selectedEleve })

  if (!classe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Classe non trouvée</h2>
          <p className="text-gray-500 mb-4">Les informations de la classe sont introuvables.</p>
          <button
            onClick={() => {
              navigate(-1);
            }}
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
    if (config) {
      navigate("/admin/configuration/classes/update", { state: classe });

    } else {
      navigate("/admin/classes/update", { state: classe });

    }
  };

  const handleDelete = async () => {
    if (!classe?.id) {
      alertError()
      return
    }
    try {
      await classeService.delete(classe?.id)
      setOpenDeleteModal(false);
      navigate(-1);
    } catch (error) {
      alertError()
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
                onClick={() => {
                  navigate(-1);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{classe.nom}</h1>
                <p className="text-sm text-gray-500">
                  {classe.niveauClasse} • {classe.cycle} • {classe.niveauScolaire}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Classe</p>
                  <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                    <Users size={16} className="text-primary" />
                    {classe.nom}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Niveau de classe</p>
                  <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                    <Layers size={16} className="text-purple-500" />
                    {classe.niveauClasse}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cycle</p>
                  <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                    <BookOpen size={16} className="text-blue-500" />
                    {classe.cycle}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Niveau scolaire</p>
                  <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                    <Layers size={16} className="text-green-500" />
                    {classe.niveauScolaire}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de création</p>
                  <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                    <Calendar size={16} className="text-gray-400" />
                    {formatDate(classe.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Élèves de la classe */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User size={18} className="text-primary" />
                Élèves ({classeEleves.length})
              </h2>
            </div>
            <div className="p-6">
              {classeEleves.length > 0 ? (
                <div className="space-y-2">
                  <ElevesList eleves={classeEleves}
                    onAction={(eleve) => {
                      setSelectedEleve(eleve)
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <User size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">Aucun élève dans cette classe pour le moment</p>
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
        title="Supprimer la classe"
        message={`Êtes-vous sûr de vouloir supprimer la classe "${classe.nom}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />



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
              onClick: async () => {
                handleDownload()

              }
            },
            {
              label: "Supprimer",
              icon: MoreVertical,
              onClick: () => { setEleveToDelete(selectedEleve); setSelectedEleve(null); }
            }
          ]}
        />
      )}

      <DeleteConfirmationModal
        isOpen={!!eleveToDelete}
        onClose={() => setEleveToDelete(null)}
        onConfirm={handleDeleteEleve}
        title="Supprimer l'élève"
        message={`Voulez-vous vraiment supprimer ${eleveToDelete?.prenom} ${eleveToDelete?.nom} ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}