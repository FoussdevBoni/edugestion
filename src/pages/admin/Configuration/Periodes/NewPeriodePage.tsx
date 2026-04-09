import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PeriodeForm, { PeriodeFormData } from "../../../../components/admin/forms/PeriodeForm";
import { periodeService } from "../../../../services/periodeService";
import { alertError } from "../../../../helpers/alertError";

export default function NewPeriodePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (dataArray: PeriodeFormData[]) => {
    setIsSubmitting(true);
    try {
      // Boucle pour créer chaque période du tableau
      const promises = dataArray.map(item => periodeService.create({
        nom: item.nom,
        niveauScolaireId: item.niveauScolaireId,
        ordre: item.ordre || 1,
        coefficient: item.coefficient
      }));
      
      await Promise.all(promises);
      navigate("/admin/configuration/periodes");
    } catch (error) {
      alertError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => navigate("/admin/configuration/periodes");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouvelle période</h1>
          <p className="text-sm text-gray-500 mt-1">Créez une ou plusieurs périodes pour les évaluations</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm">
        <PeriodeForm onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}