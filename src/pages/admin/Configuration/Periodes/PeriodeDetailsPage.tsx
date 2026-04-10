// src/pages/admin/configuration/periodes/PeriodeDetailsPage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Edit, Trash2, Calendar, Layers, FileText, Plus,
  AlertCircle, CheckCircle
} from "lucide-react";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import useEvaluations from "../../../../hooks/evaluations/useEvaluations";
import { alertError, alertSuccess } from "../../../../helpers/alertError";
import { periodeService } from "../../../../services/periodeService";

export default function PeriodeDetailsPage() {
  const location = useLocation();
  const periode = location.state;
  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { evaluations } = useEvaluations();

  if (!periode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 animate-fade-in-up">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Période non trouvée</h2>
          <p className="text-gray-500 mb-4">Les informations de la période sont introuvables.</p>
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

  const handleDelete = async () => {
    if (!periode.id) {
      alertError();
      return;
    }
    setIsDeleting(true);
    try {
      await periodeService.delete(periode.id);
      setOpenDeleteModal(false);
      alertSuccess("Période supprimée avec succès");
      setTimeout(() => {
        navigate("/admin/configuration/periodes");
      }, 1500);
    } catch (error) {
      alertError();
    } finally {
      setIsDeleting(false);
    }
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
                <h1 className="text-2xl font-bold text-gray-800">{periode.nom}</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <Calendar size={14} />
                  {periode.niveauScolaire} • {evaluationsDeLaPeriode.length} évaluation{evaluationsDeLaPeriode.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAddEvaluation}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                <Plus size={16} />
                Ajouter une évaluation
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Nom de la période</p>
                    <p className="font-semibold text-gray-800">{periode.nom}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Layers size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Niveau scolaire</p>
                    <p className="font-semibold text-gray-800">{periode.niveauScolaire}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Calendar size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date de création</p>
                    <p className="font-semibold text-gray-800">{formatDate(periode.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Évaluations de la période */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                Évaluations ({evaluationsDeLaPeriode.length})
              </h2>
              <button
                onClick={handleAddEvaluation}
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 font-medium"
              >
                <Plus size={16} />
                Ajouter une évaluation
              </button>
            </div>
            <div className="p-6">
              {evaluationsDeLaPeriode.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {evaluationsDeLaPeriode.map((evaluation, idx) => (
                    <div
                      key={evaluation.id}
                      onClick={() => handleViewEvaluation(evaluation)}
                      className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-[1.02] bg-white animate-fade-in-up"
                      style={{ animationDelay: `${300 + idx * 50}ms` }}
                    >
                      <h3 className="font-semibold text-gray-800">{evaluation.nom}</h3>
                      <p className="text-xs text-gray-500 mt-1 font-mono">ID: {evaluation.id.substring(0, 8)}...</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          evaluation.type === 'composition' ? 'bg-purple-100 text-purple-700' :
                          evaluation.type === 'devoir' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {evaluation.type}
                        </span>
                        <p className="text-xs text-gray-400">
                          Créée le {formatDate(evaluation.createdAt!)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">Aucune évaluation n'a encore été ajoutée à cette période</p>
                  <button
                    onClick={handleAddEvaluation}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300"
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