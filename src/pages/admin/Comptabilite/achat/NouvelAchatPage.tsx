// src/pages/admin/comptabilite/achats/NouvelAchatPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PackagePlus, CheckCircle } from "lucide-react";
import AchatForm from "../../../../components/admin/forms/AchatForm";
import { achatService } from "../../../../services/achatService";
import { BaseAchat } from "../../../../utils/types/base";
import { alertServerError, alertSuccess } from "../../../../helpers/alertError";

export default function NouvelAchatPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
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
      setSaved(true);
      alertSuccess("Achat enregistré avec succès");
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      alertServerError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAjouterMateriel = () => {
    navigate("/admin/comptabilite/materiel/new");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* En-tête avec animation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
          >
            <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Nouvel achat</h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <PackagePlus size={14} />
              Enregistrer l'achat de nouveau matériel
            </p>
          </div>
        </div>

        <button
          onClick={handleAjouterMateriel}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
        >
          <PackagePlus size={18} />
          Nouveau matériel
        </button>
      </div>

      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">Achat enregistré avec succès ! Redirection...</span>
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
              <li>Les champs marqués d'un * sont obligatoires</li>
              <li>Le prix unitaire est en FCFA</li>
              <li>La quantité doit être un nombre entier positif</li>
              <li>Une transaction sera automatiquement créée pour cet achat</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <AchatForm
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