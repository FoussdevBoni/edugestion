// src/pages/admin/materiel/InventaireEditPage.tsx
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertCircle, CheckCircle, Edit, Package } from "lucide-react";
import InventaireForm, { InventaireFormData } from "../../../../components/admin/forms/InventaireForm";
import useMateriels from "../../../../hooks/materiels/useMateriels";
import { Inventaire } from "../../../../utils/types/data";
import { alertSuccess, alertError } from "../../../../helpers/alertError";

export default function InventaireEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const { materiels: stockActuel } = useMateriels();
  const location = useLocation();
  const inventaire: Inventaire = location.state;

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // Simulation de modification
      console.log("Modification inventaire:", { id, ...formData });
      setSaved(true);
      alertSuccess("Inventaire modifié avec succès !");
      setTimeout(() => {
        navigate(`/admin/materiel/inventaires/${id}`);
      }, 1500);
    } catch (error) {
      alertError("Erreur lors de la modification");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!inventaire) {
    return (
      <div className="text-center py-12 animate-fade-in-up">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <p className="text-gray-500 text-center mb-4">Inventaire non trouvé</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

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
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8">
      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button
          onClick={() => navigate(`/admin/materiel/inventaires/${id}`)}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier l'inventaire</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Edit size={14} />
            ID: {id}
          </p>
        </div>
      </div>

      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">Inventaire modifié avec succès ! Redirection...</span>
        </div>
      )}

      {/* Informations récapitulatives */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Package size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Période</p>
              <p className="font-medium text-gray-800">{inventaire.periode}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <span className="text-lg">📅</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="font-medium text-gray-800">
                {new Date(inventaire.date).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <span className="text-lg">📦</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Articles comptés</p>
              <p className="font-medium text-gray-800">{inventaire.materiels?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire avec animation */}
      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <InventaireForm
          initialData={initialData}
          stockActuel={stockActuel}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/admin/materiel/inventaires/${id}`)}
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