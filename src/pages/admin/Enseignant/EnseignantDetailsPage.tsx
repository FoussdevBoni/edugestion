import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Edit, Trash2, Mail, Phone, BookOpen,
  Users, Calendar
} from "lucide-react";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";
import { alertError } from "../../../helpers/alertError";
import { enseignantService } from "../../../services/enseignantService";
import EmploiEnseignant from "../../../components/admin/details/EmploiEnseignant";

export default function EnseignantDetailsPage() {
  const location = useLocation();
  const enseignant = location.state;
  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  

  // Grouper les matières par classe
  const enseignementsParClasse = enseignant?.enseignementsData?.reduce((acc: any, item: any) => {
    if (!acc[item.classe]) {
      acc[item.classe] = [];
    }
    acc[item.classe].push(item.matiere);
    return acc;
  }, {} as Record<string, string[]>) || {};

  // Redirection si pas d'enseignant
  if (!enseignant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Enseignant non trouvé</h2>
          <p className="text-gray-500 mb-4">Les informations de l'enseignant sont introuvables.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
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
    try {
      await enseignantService.delete(enseignant.id);
      setOpenDeleteModal(false);
      navigate("/admin/enseignants");
    } catch (error) {
      alertError();
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
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Retour à la liste"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {enseignant.prenom} {enseignant.nom}
                </h1>
                <p className="text-sm text-gray-500">
                  Fiche enseignant • {enseignant.enseignementsData?.length || 0} enseignement(s)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Informations personnelles */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Informations personnelles</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Nom complet</p>
                    <p className="font-medium text-gray-800">{enseignant.nom} {enseignant.prenom}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Mail size={14} className="text-gray-400" />
                      Email
                    </p>
                    <p className="font-medium text-gray-800">{enseignant.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Phone size={14} className="text-gray-400" />
                      Téléphone
                    </p>
                    <p className="font-medium text-gray-800">{enseignant.tel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      Date d'ajout
                    </p>
                    <p className="font-medium text-gray-800">
                      {new Date(enseignant.createdAt || "").toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enseignements par classe */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <BookOpen size={18} className="text-primary" />
                Enseignements par classe
              </h2>
            </div>
            <div className="p-6">
              {Object.keys(enseignementsParClasse).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(enseignementsParClasse).map(([classe, matieres]) => (
                    <div key={classe} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Users size={16} className="text-blue-600" />
                        {classe}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(matieres as any).map((matiere: any, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-primary/10 text-primary rounded-full 
                            text-sm font-medium"
                          >
                            {matiere}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Aucun enseignement assigné</p>
              )}
            </div>
          </div>

          {/* Emploi du temps */}
          <EmploiEnseignant enseignant={enseignant} />

        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDelete}
        title="Supprimer l'enseignant"
        message={`Êtes-vous sûr de vouloir supprimer ${enseignant.prenom} ${enseignant.nom} ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}