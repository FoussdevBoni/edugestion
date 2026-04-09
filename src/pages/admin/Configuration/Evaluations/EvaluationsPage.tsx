// src/pages/admin/configuration/evaluations/EvaluationsPage.tsx
import { useState, useMemo } from "react";
import { Plus, MoreVertical, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EvaluationsList from "../../../../components/admin/lists/EvaluationsList";
import MenuModal from "../../../../components/ui/MenuModal";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import TabsHorizontalScrollable from "../../../../components/ui/TabsHorizontalScrollable";
import { Evaluation } from "../../../../utils/types/data";
import useEvaluations from "../../../../hooks/evaluations/useEvaluations";
import { alertError } from "../../../../helpers/alertError";
import { useEcoleNiveau } from "../../../../hooks/filters/useEcoleNiveau";
import usePeriodes from "../../../../hooks/periodes/usePeriodes";


export default function EvaluationsPage() {
  const navigate = useNavigate();
  const { niveauSelectionne } = useEcoleNiveau(); // C'est le nom du niveau (string)
  const { periodes } = usePeriodes();
  const { evaluations, deleteEvaluation } = useEvaluations();
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [evaluationToDelete, setEvaluationToDelete] = useState<Evaluation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<string>("toutes");

  // Filtrer les périodes par niveau sélectionné
  const periodesFiltrees = useMemo(() => {
    if (!niveauSelectionne) return periodes;
    return periodes.filter(periode =>
      periode.niveauScolaire === niveauSelectionne
    );
  }, [periodes, niveauSelectionne]);

  // Construire les tabs à partir des périodes filtrées
  const tabs = useMemo(() => {
    // Compter les évaluations par période
    const countByPeriode = evaluations.reduce((acc, ev) => {
      const periodeId = ev.periodeId || 'sans-periode';
      acc[periodeId] = (acc[periodeId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const tabsList = [
      {
        id: "toutes",
        label: "Toutes",
        count: evaluations.length
      },
      ...periodesFiltrees.map(periode => ({
        id: periode.id,
        label: periode.nom,
        count: countByPeriode[periode.id] || 0
      }))
    ];

    // Ajouter "Sans période" s'il y a des évaluations sans période
    if (countByPeriode['sans-periode']) {
      tabsList.push({
        id: "sans-periode",
        label: "Sans période",
        count: countByPeriode['sans-periode']
      });
    }

    return tabsList;
  }, [evaluations, periodesFiltrees]);

  // Filtrer les évaluations
  const filteredEvaluations = useMemo(() => {
    let filtered = evaluations;

    // Filtre par niveau scolaire
    if (niveauSelectionne) {
      filtered = filtered.filter(ev => ev.niveauScolaire === niveauSelectionne);
    }

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(ev =>
        ev.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.periode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par période
    if (selectedPeriodeId === "sans-periode") {
      filtered = filtered.filter(ev => !ev.periodeId);
    } else if (selectedPeriodeId !== "toutes") {
      filtered = filtered.filter(ev => ev.periodeId === selectedPeriodeId);
    }

    return filtered;
  }, [evaluations, niveauSelectionne, searchTerm, selectedPeriodeId]);

  const handleDelete = () => {
    if (!evaluationToDelete?.id) {
      alertError();
      return;
    }
    try {
      deleteEvaluation(evaluationToDelete.id);
      setEvaluationToDelete(null);
      setSelectedEvaluation(null);
    } catch (error) {
      alertError();
    }
  };


  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Évaluations</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredEvaluations.length} évaluation{filteredEvaluations.length > 1 ? 's' : ''}
            {niveauSelectionne && ` - ${niveauSelectionne}`}
          </p>
        </div>

        <button
          onClick={() => {
            navigate("/admin/configuration/evaluations/new");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          <Plus size={18} />
          Nouvelle évaluation
        </button>
      </div>

      {/* Tabs des périodes */}
      {periodesFiltrees.length > 0 && (
        <TabsHorizontalScrollable
          tabs={tabs}
          activeTab={selectedPeriodeId}
          onTabChange={setSelectedPeriodeId}
        />
      )}

      {/* Recherche */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher une évaluation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Liste */}
      <EvaluationsList
        evaluations={filteredEvaluations}
        onAction={setSelectedEvaluation}
      />

      {/* Message si vide */}
      {filteredEvaluations.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucune évaluation trouvée</p>
        </div>
      )}

    

      {/* Menu évaluation */}
      {selectedEvaluation && (
        <MenuModal
          icon={<Plus className="text-primary" size={20} />}
          menu={[
            {
              label: "Modifier",
              icon: Plus,
              onClick: () => {
                navigate("/admin/configuration/evaluations/update", { state: selectedEvaluation });
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
          onClose={() => setSelectedEvaluation(null)}
          title={selectedEvaluation.nom}
        />
      )}

      {/* Confirmation suppression */}
      <DeleteConfirmationModal
        isOpen={!!evaluationToDelete}
        onClose={() => setEvaluationToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer"
        message={`Supprimer ${evaluationToDelete?.nom} ?`}

      />
    </div>
  );
}