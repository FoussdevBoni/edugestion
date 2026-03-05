// src/pages/admin/configuration/periodes/UpdatePeriodePage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import PeriodeForm, { PeriodeFormData } from "../../../../components/admin/forms/PeriodeForm";
import { periodes } from "../../../../data/periods";


export default function UpdatePeriodePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const periodeData = location.state;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [periode, setPeriode] = useState<PeriodeFormData | null>(null);

  useEffect(() => {
    const fetchPeriode = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (periodeData) {
          setPeriode({
            id: periodeData.id,
            nom: periodeData.nom,
            niveauScolaireId: periodeData.niveauScolaireId,
            niveauScolaire: periodeData.niveauScolaire
          });
        } else {
          // Fallback: prendre la première période pour l'exemple
          setPeriode({
            id: periodes[0].id,
            nom: periodes[0].nom,
            niveauScolaireId: periodes[0].niveauScolaireId || "",
            niveauScolaire: periodes[0].niveauScolaire
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPeriode();
  }, [periodeData]);

  const handleSubmit = async (data: PeriodeFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Mise à jour de la période:", data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate("/admin/configuration/periodes");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/configuration/periodes");
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

  if (!periode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/configuration/periodes")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Modifier la période</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-700 mb-2">
            Période introuvable
          </h2>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/configuration/periodes")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier la période</h1>
          <p className="text-sm text-gray-500 mt-1">
            {periode.nom} - {periode.niveauScolaire}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <PeriodeForm
          initialData={periode}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}