// src/pages/admin/materiel/NouvelInventairePage.tsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import InventaireForm from "../../../../components/admin/forms/InventaireForm";
import useMateriels from "../../../../hooks/materiels/useMateriels";
import { alertServerError } from "../../../../helpers/alertError";
import { inventaireService } from "../../../../services/inventaireService";
import { BaseInventaire } from "../../../../utils/types/base";



export default function NouvelInventairePage() {
  const navigate = useNavigate();
  const { materiels: STOCK_ACTUEL } = useMateriels()

  const handleSubmit = async (formData: any) => {
    try {
      // Simulation de création
      const newInventaire: BaseInventaire = {
        date: formData.date,
        periode: formData.periode,
        materiels: formData.items
      }
       inventaireService.create(newInventaire)
      navigate(-1);
    } catch (error) {
      alertServerError(error)
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouvel inventaire</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enregistrer l'état des lieux du matériel
          </p>
        </div>
      </div>

      <InventaireForm
        stockActuel={STOCK_ACTUEL}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}