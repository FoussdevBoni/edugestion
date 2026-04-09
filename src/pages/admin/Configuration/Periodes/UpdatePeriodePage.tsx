import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import PeriodeForm, { PeriodeFormData } from "../../../../components/admin/forms/PeriodeForm";
import { alertError } from "../../../../helpers/alertError";
import { periodeService } from "../../../../services/periodeService";

export default function UpdatePeriodePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const periodeData = location.state;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [periode, setPeriode] = useState<PeriodeFormData | null>(null);

  useEffect(() => {
    if (periodeData) {
      setPeriode(periodeData);
      setIsLoading(false);
    } else {
        // Fallback ou Fetch direct si nécessaire
        setIsLoading(false);
    }
  }, [periodeData]);

  const handleSubmit = async (dataArray: PeriodeFormData[]) => {
    const data = dataArray[0];
    if (!data.id) return;

    setIsSubmitting(true);
    try {
      await periodeService.update(data.id, {
        nom: data.nom,
        niveauScolaireId: data.niveauScolaireId,
        ordre: data.ordre,
        coefficient: data.coefficient
      });
      navigate("/admin/configuration/periodes");
    } catch (error) {
      alertError();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;
  if (!periode) return <div className="p-10 text-center"><AlertCircle className="mx-auto mb-2 text-red-500" /> Période introuvable</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier la période</h1>
          <p className="text-sm text-gray-500 mt-1">{periode.nom}</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm">
        <PeriodeForm initialData={periode} onSubmit={handleSubmit} onCancel={() => navigate(-1)} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}