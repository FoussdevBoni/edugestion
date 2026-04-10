// src/pages/admin/configuration/cycles/UpdateCyclePage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle, Edit, BookOpen, Layers } from "lucide-react";
import CycleForm, { CycleFormData } from "../../../../components/admin/forms/CycleForm";
import useCycles from "../../../../hooks/cycles/useCycles";
import { cycleService } from "../../../../services/cycleService";
import { alertSuccess, alertError } from "../../../../helpers/alertError";

export default function UpdateCyclePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const cycleData = location.state;
  const { cycles } = useCycles();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cycle, setCycle] = useState<CycleFormData | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchCycle = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (cycleData) {
          setCycle({
            id: cycleData.id,
            nom: cycleData.nom,
            niveauScolaireId: cycleData.niveauScolaireId,
            niveauScolaire: cycleData.niveauScolaire,
            ordre: cycleData.ordre
          });
        } else if (cycles.length > 0) {
          setCycle({
            id: cycles[0].id,
            nom: cycles[0].nom,
            niveauScolaireId: cycles[0].niveauScolaireId,
            niveauScolaire: cycles[0].niveauScolaire,
            ordre: cycles[0].ordre
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCycle();
  }, [cycleData, cycles]);

  const handleSubmit = async (data: CycleFormData) => {
    setIsSubmitting(true);
    try {
      await cycleService.update(data.id!, data);
      setSaved(true);
      alertSuccess("Cycle modifié avec succès");
      setTimeout(() => {
        navigate("/admin/configuration/cycles");
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alertError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/configuration/cycles");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in-up">
        <Loader2 size={40} className="animate-spin text-primary mb-4" />
        <p className="text-gray-500 font-medium">Chargement des informations...</p>
      </div>
    );
  }

  if (!cycle) {
    return (
      <div className="max-w-2xl mx-auto mt-10 animate-fade-in-up">
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-10 text-center">
          <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Cycle introuvable</h2>
          <p className="text-red-600 mb-6">Les informations de ce cycle ne sont plus disponibles.</p>
          <button
            onClick={() => navigate("/admin/configuration/cycles")}
            className="px-6 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-all duration-300"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">Cycle modifié avec succès ! Redirection...</span>
        </div>
      )}

      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button
          onClick={() => navigate("/admin/configuration/cycles")}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier le cycle</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Edit size={14} />
            {cycle.nom} - {cycle.niveauScolaire}
          </p>
        </div>
      </div>

      {/* Informations récapitulatives */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <BookOpen size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Nom du cycle</p>
              <p className="font-medium text-gray-800">{cycle.nom}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Layers size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Niveau scolaire</p>
              <p className="font-medium text-gray-800">{cycle.niveauScolaire}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <CycleForm
          initialData={cycle}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>

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
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}