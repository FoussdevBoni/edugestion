// src/pages/admin/configuration/cycles/UpdateCyclePage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import CycleForm, { CycleFormData } from "../../../../components/admin/forms/CycleForm";
import useCycles from "../../../../hooks/cycles/useCycles";
import { cycleService } from "../../../../services/cycleService";

export default function UpdateCyclePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const cycleData = location.state;
  const {cycles} = useCycles()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cycle, setCycle] = useState<CycleFormData | null>(null);

  useEffect(() => {
    const fetchCycle = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (cycleData) {
          setCycle({
            id: cycleData.id,
            nom: cycleData.nom,
            niveauScolaireId: cycleData.niveauScolaireId,
            niveauScolaire: cycleData.niveauScolaire
          });
        } else {
          // Fallback: prendre le premier cycle pour l'exemple
          setCycle({
            id: cycles[0].id,
            nom: cycles[0].nom,
            niveauScolaireId: cycles[0].niveauScolaireId,
            niveauScolaire: cycles[0].niveauScolaire
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCycle();
  }, [cycleData]);

  const handleSubmit = async (data: CycleFormData) => {
    setIsSubmitting(true);
    try {
      await cycleService.update(data.id! , data)
      navigate("/admin/configuration/cycles");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/configuration/cycles");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Chargement des informations...</p>
        </div>
      </div>
    );
  }

  if (!cycle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/configuration/cycles")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Modifier le cycle</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-700 mb-2">
            Cycle introuvable
          </h2>
          <button
            onClick={() => navigate("/admin/configuration/cycles")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/configuration/cycles")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier le cycle</h1>
          <p className="text-sm text-gray-500 mt-1">
            {cycle.nom} - {cycle.niveauScolaire}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <CycleForm
          initialData={cycle}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}