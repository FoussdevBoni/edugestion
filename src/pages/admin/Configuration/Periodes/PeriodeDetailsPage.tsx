// src/pages/admin/configuration/periodes/PeriodeDetailsPage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Edit, Trash2, Calendar, 
  ChevronRight, Layers, FileText, Plus
} from "lucide-react";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import { evaluations } from "../../../../data/evaluations";

export default function PeriodeDetailsPage() {
  const location = useLocation();
  const periode = location.state;
  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  if (!periode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Période non trouvée</h2>
          <p className="text-gray-500 mb-4">Les informations de la période sont introuvables.</p>
          <button
            onClick={() => navigate("/admin/configuration/periodes")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  // Récupérer les évaluations de cette période
  const evaluationsDeLaPeriode = evaluations.filter(e => e.periodeId === periode.id);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleUpdate = () => {
    navigate("/admin/configuration/periodes/update", { state: periode });
  };

  const handleDelete = () => {
    console.log("Suppression de la période:", periode);
    setOpenDeleteModal(false);
    navigate("/admin/configuration/periodes");
  };

  const handleAddEvaluation = () => {
    navigate("/admin/configuration/evaluations/new", { 
      state: { 
        periodeId: periode.id, 
        periodeNom: periode.nom,
        niveauScolaireId: periode.niveauScolaireId,
        niveauScolaire: periode.niveauScolaire
      } 
    });
  };

  const handleViewEvaluation = (evaluation: any) => {
    navigate("/admin/configuration/evaluations/details", { state: evaluation });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/configuration/periodes")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{periode.nom}</h1>
                <p className="text-sm text-gray-500">
                  {periode.niveauScolaire} • {evaluationsDeLaPeriode.length} évaluation{evaluationsDeLaPeriode.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAddEvaluation}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <Plus size={16} />
                Ajouter une évaluation
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
            <span onClick={() => navigate("/admin/configuration/periodes")} className="hover:text-primary cursor-pointer">
              Périodes
            </span>
            <ChevronRight size={14} />
            <span className="text-gray-700">{periode.nom}</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Nom de la période</p>
                  <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                    <Calendar size={16} className="text-primary" />
                    {periode.nom}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Niveau scolaire</p>
                  <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                    <Layers size={16} className="text-blue-500" />
                    {periode.niveauScolaire}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de création</p>
                  <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                    <Calendar size={16} className="text-gray-400" />
                    {formatDate(periode.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Évaluations de la période */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                Évaluations ({evaluationsDeLaPeriode.length})
              </h2>
              <button
                onClick={handleAddEvaluation}
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
              >
                <Plus size={16} />
                Ajouter une évaluation
              </button>
            </div>
            <div className="p-6">
              {evaluationsDeLaPeriode.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {evaluationsDeLaPeriode.map((evaluation) => (
                    <div
                      key={evaluation.id}
                      onClick={() => handleViewEvaluation(evaluation)}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition cursor-pointer"
                    >
                      <h3 className="font-medium text-gray-800">{evaluation.nom}</h3>
                      <p className="text-sm text-gray-500 mt-1">ID: {evaluation.id.substring(0, 8)}...</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Créée le {formatDate(evaluation.createdAt!)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 mb-4">Aucune évaluation n'a encore été ajoutée à cette période</p>
                  <button
                    onClick={handleAddEvaluation}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    <Plus size={16} />
                    Ajouter une évaluation
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
        title="Supprimer la période"
        message={`Êtes-vous sûr de vouloir supprimer la période "${periode.nom}" ? Cette action est irréversible et supprimera également toutes les évaluations associées.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}