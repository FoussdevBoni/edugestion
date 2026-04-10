// src/pages/admin/materiel/NouvelInventairePage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Package, AlertCircle } from "lucide-react";
import InventaireForm from "../../../../components/admin/forms/InventaireForm";
import useMateriels from "../../../../hooks/materiels/useMateriels";
import { alertServerError, alertSuccess } from "../../../../helpers/alertError";
import { inventaireService } from "../../../../services/inventaireService";
import { BaseInventaire } from "../../../../utils/types/base";

export default function NouvelInventairePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const { materiels: STOCK_ACTUEL } = useMateriels();

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const newInventaire: BaseInventaire = {
        date: formData.date,
        periode: formData.periode,
        materiels: formData.items
      };
      await inventaireService.create(newInventaire);
      setSaved(true);
      alertSuccess("Inventaire enregistré avec succès");
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      alertServerError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8">
      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouvel inventaire</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Package size={14} />
            Enregistrer l'état des lieux du matériel
          </p>
        </div>
      </div>

      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">Inventaire enregistré avec succès ! Redirection...</span>
        </div>
      )}

      {/* Informations utiles */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-start gap-3">
          <div className="p-1 bg-white rounded-full shadow-sm">
            <span className="text-primary text-sm font-bold block px-2">i</span>
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-700 mb-1">Informations importantes</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>L'inventaire permet de comparer le stock théorique et le stock réel</li>
              <li>Saisissez la quantité réelle pour chaque article</li>
              <li>Les écarts seront automatiquement calculés</li>
              <li>Un rapport sera généré après validation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Formulaire avec animation */}
      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <InventaireForm
          stockActuel={STOCK_ACTUEL}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
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