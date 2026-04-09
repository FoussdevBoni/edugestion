// src/pages/admin/comptabilite/achats/NouvelAchatPage.tsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PackagePlus } from "lucide-react";
import AchatForm from "../../../../components/admin/forms/AchatForm";
import { achatService } from "../../../../services/achatService";
import { BaseAchat } from "../../../../utils/types/base";
import { alertServerError } from "../../../../helpers/alertError";

export default function NouvelAchatPage() {
  const navigate = useNavigate();

  const handleSubmit = async (formData: any) => {
    try {
      const promises = formData.lignes.map(async (ligne: any) => {
        const achatData: BaseAchat = {
          materielId: ligne.materielId,
          quantite: Number(ligne.quantite),
          prixUnitaire: Number(ligne.prixUnitaire),
          referenceExterne: formData.referenceExterne,
          date: formData.date,
          createdBy: 'system',
          modePaiement: formData.modePaiement,
          notes: formData.notes
        };
        return await achatService.create(achatData);
      });

      await Promise.all(promises);
      navigate(-1);
    } catch (error) {
      alertServerError(error);
    }
  };

  const handleAjouterMateriel = () => {
    navigate("/admin/comptabilite/materiel/new");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Nouvel achat</h1>
            <p className="text-sm text-gray-500">Enregistrer l'achat de nouveau matériel</p>
          </div>
        </div>

        <button
          onClick={handleAjouterMateriel}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <PackagePlus size={18} />
          Nouveau matériel
        </button>
      </div>

      <AchatForm
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}