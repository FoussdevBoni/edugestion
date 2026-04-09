// src/pages/admin/materiel/InventaireEditPage.tsx
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import InventaireForm, { InventaireFormData } from "../../../../components/admin/forms/InventaireForm";
import useMateriels from "../../../../hooks/materiels/useMateriels";
import { Inventaire } from "../../../../utils/types/data";




export default function InventaireEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { materiels: stockActuel } = useMateriels()
  const location = useLocation()
  const inventaire: Inventaire = location.state
  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // Simulation de modification
      console.log("Modification inventaire:", { id, ...formData });
      alert("Inventaire modifié avec succès ! (simulation)");
      navigate(`/admin/materiel/inventaires/${id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const initialData: InventaireFormData = {
    periode: inventaire.periode,
    date: inventaire.date,
    autrePeriode: inventaire.autrePeriode || "",
    notes: inventaire.notes || "",
    items: inventaire.materiels.map(m => ({
      ...m,
      quantiteReelle: m.quantite,
      difference: 0
    }))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/admin/materiel/inventaires/${id}`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier l'inventaire</h1>
          <p className="text-sm text-gray-500 mt-1">ID: {id}</p>
        </div>
      </div>

      <InventaireForm
        initialData={initialData}
        stockActuel={stockActuel}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/admin/materiel/inventaires/${id}`)}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}