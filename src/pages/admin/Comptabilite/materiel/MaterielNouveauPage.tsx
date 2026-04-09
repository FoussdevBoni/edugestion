// src/pages/admin/comptabilite/materiel/NewMaterielPage.tsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MaterielForm from "../../../../components/admin/forms/MaterielForm";
import { materielService } from "../../../../services/materielService";
import { alertServerError } from "../../../../helpers/alertError";
import { BaseMateriel } from "../../../../utils/types/base";

export default function NewMaterielPage() {
  const navigate = useNavigate();

  const handleSubmit = async (formData: any) => {
    try {
      const promises = formData.lignes.map(async (ligne: any) => {
        const newMateriel: BaseMateriel = {
          nom: ligne.nom,
          quantite: Number(ligne.quantite),
          seuilAlerte: Number(ligne.seuilAlerte),
          description: ligne.description,
          fournisseur: ligne.fournisseur
        }
        return await materielService.create(newMateriel);
      });

      await Promise.all(promises);
      navigate(-1);
    } catch (error) {
      alertServerError(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouveau matériel</h1>
          <p className="text-sm text-gray-500">Ajouter un ou plusieurs matériels à l'inventaire</p>
        </div>
      </div>

      <MaterielForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}