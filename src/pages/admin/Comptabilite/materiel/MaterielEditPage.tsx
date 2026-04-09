// src/pages/admin/comptabilite/materiel/UpdateMaterielPage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MaterielForm from "../../../../components/admin/forms/MaterielForm";
import useMateriels from "../../../../hooks/materiels/useMateriels";
import { alertServerError } from "../../../../helpers/alertError";

export default function UpdateMaterielPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateMateriel } = useMateriels();
   
  const location = useLocation();
  const materiel = location.state;

  const initialData = {
    lignes: [{
      nom: materiel.nom,
      quantite: materiel.quantite.toString(),
      seuilAlerte: materiel.seuilAlerte?.toString() || "10",
      description: materiel.description || "",
      fournisseur: materiel.fournisseur || ""
    }]
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const ligne = formData.lignes[0];
      await updateMateriel(materiel.id, {
        nom: ligne.nom,
        quantite: Number(ligne.quantite),
        seuilAlerte: Number(ligne.seuilAlerte),
        description: ligne.description,
        fournisseur: ligne.fournisseur
      });
      navigate(-1);
    } catch (error) {
      alertServerError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier le matériel</h1>
          <p className="text-sm text-gray-500 mt-1">Modifier les informations du matériel</p>
        </div>
      </div>

      <MaterielForm
        mode="update"
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}