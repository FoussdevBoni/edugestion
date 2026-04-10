// src/pages/admin/comptabilite/materiel/NewMaterielPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Package } from "lucide-react";
import MaterielForm from "../../../../components/admin/forms/MaterielForm";
import { materielService } from "../../../../services/materielService";
import { alertServerError, alertSuccess } from "../../../../helpers/alertError";
import { BaseMateriel } from "../../../../utils/types/base";

export default function NewMaterielPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      const promises = formData.lignes.map(async (ligne: any) => {
        const newMateriel: BaseMateriel = {
          nom: ligne.nom,
          quantite: Number(ligne.quantite),
          seuilAlerte: Number(ligne.seuilAlerte),
          description: ligne.description,
          fournisseur: ligne.fournisseur
        };
        return await materielService.create(newMateriel);
      });

      await Promise.all(promises);
      setSaved(true);
      alertSuccess("Matériel(s) ajouté(s) avec succès");
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
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouveau matériel</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Package size={14} />
            Ajouter un ou plusieurs matériels à l'inventaire
          </p>
        </div>
      </div>

      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">Matériel(s) ajouté(s) avec succès ! Redirection...</span>
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
              <li>Le seuil d'alerte permet de détecter automatiquement les stocks bas</li>
              <li>Vous pouvez ajouter plusieurs matériels en une seule fois</li>
              <li>Les champs marqués d'un * sont obligatoires</li>
              <li>La quantité initiale doit être un nombre positif</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Formulaire avec animation */}
      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <MaterielForm
          mode="create"
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