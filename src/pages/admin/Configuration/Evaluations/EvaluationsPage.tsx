// src/pages/admin/configuration/evaluations/EvaluationsPage.tsx
import { useState } from "react";
import { Plus, Download, MoreVertical, FileText, Printer, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EvaluationsList from "../../../../components/admin/lists/EvaluationsList";
import MenuModal, { Menu } from "../../../../components/ui/MenuModal";

import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import { Evaluation } from "../../../../utils/types/data";
import { evaluations } from "../../../../data/evaluations";

export default function EvaluationsPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [evaluationToDelete, setEvaluationToDelete] = useState<Evaluation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrer les évaluations
  const filteredEvaluations = evaluations.filter(evaluation =>
    evaluation.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evaluation.periode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evaluation.niveauScolaire.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = () => {
    console.log("Suppression de l'évaluation:", evaluationToDelete);
    setEvaluationToDelete(null);
    setSelectedEvaluation(null);
  };

  const menuItems: Menu[] = [
    {
      label: "Ajouter une évaluation",
      icon: Plus,
      onClick: () => {
        navigate("/admin/configuration/evaluations/new");
        setIsModalOpen(false);
      }
    },
    {
      label: "Importer",
      icon: Download,
      onClick: () => {
        console.log("Importer des évaluations");
        setIsModalOpen(false);
      }
    }
  ];

  const handleAction = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
  };

  const handleCloseMenuModal = () => {
    setSelectedEvaluation(null);
  };

  const handleCloseDeleteModal = () => {
    setEvaluationToDelete(null);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Évaluations</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredEvaluations.length} évaluation{filteredEvaluations.length > 1 ? 's' : ''} configurée{filteredEvaluations.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            Nouvelle évaluation
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une évaluation par nom, période ou niveau..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <span className="text-xs">✕</span>
            </button>
          )}
        </div>
      </div>

      {/* Liste */}
      <EvaluationsList 
        evaluations={filteredEvaluations} 
        onAction={handleAction}
      />

      {/* Message si aucun résultat */}
      {filteredEvaluations.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucune évaluation trouvée</p>
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="mt-4 text-primary hover:text-primary/80 text-sm"
            >
              Effacer la recherche
            </button>
          )}
        </div>
      )}

      {/* Modal actions globales */}
      <MenuModal
        menu={menuItems}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Gestion des évaluations"
        icon={<Plus className="text-primary" size={20} />}
      />

      {/* Modal actions sur une évaluation */}
      {selectedEvaluation && (
        <MenuModal
          menu={[
            {
              label: "Voir détails",
              icon: FileText,
              onClick: () => {
                navigate("/admin/configuration/evaluations/details", { state: selectedEvaluation });
                setSelectedEvaluation(null);
              }
            },
            {
              label: "Modifier",
              icon: Plus,
              onClick: () => {
                navigate("/admin/configuration/evaluations/update", { state: selectedEvaluation });
                setSelectedEvaluation(null);
              }
            },
            {
              label: "Notes",
              icon: Printer,
              onClick: () => {
                console.log("Voir les notes de", selectedEvaluation.nom);
                setSelectedEvaluation(null);
              }
            },
            {
              label: "Supprimer",
              icon: MoreVertical,
              onClick: () => {
                setEvaluationToDelete(selectedEvaluation);
                setSelectedEvaluation(null);
              }
            }
          ]}
          isOpen={!!selectedEvaluation}
          onClose={handleCloseMenuModal}
          title={selectedEvaluation.nom}
          icon={<Plus className="text-primary" size={20} />}
        />
      )}

      {/* Modal confirmation suppression */}
      <DeleteConfirmationModal
        isOpen={!!evaluationToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title="Supprimer l'évaluation"
        message={`Êtes-vous sûr de vouloir supprimer l'évaluation "${evaluationToDelete?.nom}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}