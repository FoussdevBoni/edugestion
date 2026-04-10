// src/pages/admin/configuration/evaluations/EvaluationsPage.tsx
import { useState, useMemo, useEffect } from "react";
import { Plus, MoreVertical, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EvaluationsList from "../../../../components/admin/lists/EvaluationsList";
import MenuModal from "../../../../components/ui/MenuModal";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import TabsHorizontalScrollable from "../../../../components/ui/TabsHorizontalScrollable";
import { Evaluation } from "../../../../utils/types/data";
import useEvaluations from "../../../../hooks/evaluations/useEvaluations";
import { alertError, alertSuccess } from "../../../../helpers/alertError";
import { useEcoleNiveau } from "../../../../hooks/filters/useEcoleNiveau";
import usePeriodes from "../../../../hooks/periodes/usePeriodes";

export default function EvaluationsPage() {
  const navigate = useNavigate();
  const { niveauSelectionne } = useEcoleNiveau();
  const { periodes } = usePeriodes();
  const { evaluations, deleteEvaluation } = useEvaluations();
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [evaluationToDelete, setEvaluationToDelete] = useState<Evaluation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<string>(periodes[0]?.id);
  const [isDeleting, setIsDeleting] = useState(false);

  const periodesFiltrees = useMemo(() => {
    if (!niveauSelectionne) return periodes;
    return periodes.filter(periode =>
      periode.niveauScolaire === niveauSelectionne
    );
  }, [periodes, niveauSelectionne]);

  useEffect(() => {
    setSelectedPeriodeId(periodes[0]?.id);
  }, [periodes[0]?.id]);

  const tabs = useMemo(() => {
    const countByPeriode = evaluations.reduce((acc, ev) => {
      const periodeId = ev.periodeId || 'sans-periode';
      acc[periodeId] = (acc[periodeId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const tabsList = periodesFiltrees.map(periode => ({
      id: periode.id,
      label: periode.nom,
      count: countByPeriode[periode.id] || 0
    }));

    if (countByPeriode['sans-periode']) {
      tabsList.push({
        id: "sans-periode",
        label: "Sans période",
        count: countByPeriode['sans-periode']
      });
    }

    return tabsList;
  }, [evaluations, periodesFiltrees]);

  const filteredEvaluations = useMemo(() => {
    let filtered = evaluations;

    if (niveauSelectionne) {
      filtered = filtered.filter(ev => ev.niveauScolaire === niveauSelectionne);
    }

    if (searchTerm) {
      filtered = filtered.filter(ev =>
        ev.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.periode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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
    setIsDeleting(true);
    try {
      deleteEvaluation(evaluationToDelete.id);
      setEvaluationToDelete(null);
      setSelectedEvaluation(null);
      alertSuccess("Évaluation supprimée avec succès");
    } catch (error) {
      alertError();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
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
          onClick={() => navigate("/admin/configuration/evaluations/new")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
        >
          <Plus size={18} />
          Nouvelle évaluation
        </button>
      </div>

      {/* Tabs des périodes */}
      {periodesFiltrees.length > 0 && (
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <TabsHorizontalScrollable
            tabs={tabs}
            activeTab={selectedPeriodeId}
            onTabChange={setSelectedPeriodeId}
          />
        </div>
      )}

      {/* Recherche */}
      <div className="relative animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher une évaluation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <span className="text-xs">✕</span>
          </button>
        )}
      </div>

      {/* Liste */}
      <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <EvaluationsList
          evaluations={filteredEvaluations}
          onAction={setSelectedEvaluation}
        />
      </div>

      {/* Message si vide */}
      {filteredEvaluations.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <p className="text-gray-500">Aucune évaluation trouvée</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Effacer la recherche
            </button>
          )}
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
        title="Supprimer l'évaluation"
        message={`Voulez-vous vraiment supprimer l'évaluation "${evaluationToDelete?.nom}" ? Cette action est irréversible.`}
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