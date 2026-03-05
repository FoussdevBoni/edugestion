import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Edit, Trash2, Mail, Phone, BookOpen, 
  Users, ChevronRight, Calendar
} from "lucide-react";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";

export default function EnseignantDetailsPage() {
  const location = useLocation();
  const enseignant = location.state;
  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Redirection si pas d'enseignant
  if (!enseignant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Enseignant non trouvé</h2>
          <p className="text-gray-500 mb-4">Les informations de l'enseignant sont introuvables.</p>
          <button
            onClick={() => navigate("/admin/enseignants")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  const handleUpdate = () => {
    navigate("/admin/enseignants/update", { state: enseignant });
  };

  const handleDelete = () => {
    console.log("Suppression de l'enseignant:", enseignant);
    setOpenDeleteModal(false);
    navigate("/admin/enseignants");
  };

  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête avec navigation */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/enseignants")}
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
                  Fiche enseignant • {enseignant.matieres?.length || 0} matière(s) enseignée(s)
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

          {/* Fil d'Ariane */}
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
            <span 
              onClick={() => navigate("/admin")} 
              className="hover:text-primary cursor-pointer"
            >
              Dashboard
            </span>
            <ChevronRight size={14} />
            <span 
              onClick={() => navigate("/admin/enseignants")} 
              className="hover:text-primary cursor-pointer"
            >
              Enseignants
            </span>
            <ChevronRight size={14} />
            <span className="text-gray-700">{enseignant.prenom} {enseignant.nom}</span>
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
                    <p className="font-medium text-gray-800">15 Septembre 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Matières enseignées */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <BookOpen size={18} className="text-primary" />
                Matières enseignées
              </h2>
            </div>
            <div className="p-6">
              {enseignant.matieres && enseignant.matieres.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {enseignant.matieres.map((matiere: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {matiere}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Aucune matière assignée</p>
              )}
            </div>
          </div>

          {/* Classes attribuées */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Users size={18} className="text-primary" />
                Classes attribuées
              </h2>
            </div>
            <div className="p-6">
              {enseignant.classes && enseignant.classes.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {enseignant.classes.map((classe: string, index: number) => (
                    <div
                      key={index}
                      className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium text-center"
                    >
                      {classe}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Aucune classe assignée</p>
              )}
            </div>
          </div>

          {/* Emploi du temps (optionnel) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Emploi du temps</h2>
            </div>
            <div className="p-6 text-center text-gray-500">
              <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
              <p>L'emploi du temps n'est pas encore disponible</p>
              <button className="mt-3 text-primary hover:text-primary/80 text-sm">
                Configurer l'emploi du temps
              </button>
            </div>
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
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}