// src/pages/admin/parametres/scolarite/classes/ClasseDetailsPage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Edit, Trash2, Calendar, BookOpen, 
  ChevronRight, Layers, Users, User
} from "lucide-react";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";

// Données fictives pour les élèves (à remplacer par les vraies données)
const mockEleves = [
  { id: "1", nom: "Koffi", prenom: "Abla", sexe: "F" },
  { id: "2", nom: "Mensah", prenom: "Kofi", sexe: "M" },
  { id: "3", nom: "Dogbe", prenom: "Yawa", sexe: "F" },
];

export default function ClasseDetailsPage() {
  const location = useLocation();
  const classe = location.state;
  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  if (!classe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Classe non trouvée</h2>
          <p className="text-gray-500 mb-4">Les informations de la classe sont introuvables.</p>
          <button
            onClick={() => navigate("/admin/parametres/scolarite/classes")}
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
    navigate("/admin/configuration/classes/update", { state: classe });
  };

  const handleDelete = () => {
    console.log("Suppression de la classe:", classe);
    setOpenDeleteModal(false);
    navigate("admin/configuration/classes");
  };

  const handleViewEleve = (eleve: any) => {
    navigate("/admin/eleves/details", { state: eleve });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/parametres/scolarite/classes")}
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
            <span onClick={() => navigate("/admin/parametres/scolarite/classes")} className="hover:text-primary cursor-pointer">
              Classes
            </span>
            <ChevronRight size={14} />
            <span className="text-gray-700">{classe.nom}</span>
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
                Élèves ({mockEleves.length})
              </h2>
            </div>
            <div className="p-6">
              {mockEleves.length > 0 ? (
                <div className="space-y-2">
                  {mockEleves.map((eleve) => (
                    <div
                      key={eleve.id}
                      onClick={() => handleViewEleve(eleve)}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-md transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User size={14} className="text-primary" />
                        </div>
                        <span className="font-medium text-gray-800">
                          {eleve.nom} {eleve.prenom}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        eleve.sexe === 'M' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                      }`}>
                        {eleve.sexe}
                      </span>
                    </div>
                  ))}
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
    </div>
  );
}