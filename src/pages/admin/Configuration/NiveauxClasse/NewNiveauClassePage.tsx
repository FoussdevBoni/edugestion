// src/pages/admin/configuration/niveaux-classe/NewNiveauClassePage.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle, PlusCircle, Layers, BookOpen } from "lucide-react";
import NiveauClasseForm, { NiveauClasseFormData } from "../../../../components/admin/forms/NiveauClasseForm";
import { niveauClasseService } from "../../../../services/niveauClasseService";
import { classeService } from "../../../../services/classeService";
import { alertError, alertSuccess } from "../../../../helpers/alertError";

export default function NewNiveauClassePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const cyclePreselectionne = location.state?.cycleId;
  const cycleNom = location.state?.cycleNom;
  const niveauScolaire = location.state?.niveauScolaire;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const initialData = cyclePreselectionne ? {
    cycleId: cyclePreselectionne,
    cycle: cycleNom || "",
    niveauScolaire: niveauScolaire || "",
    nom: ""
  } : undefined;

  const handleSubmit = async (dataArray: NiveauClasseFormData[]) => {
    setIsSubmitting(true);
    try {
      for (const data of dataArray) {
        const newNiveau = {
          nom: data.nom,
          cycleId: data.cycleId,
        };

        const createdNiveau = await niveauClasseService.create(newNiveau);

        if (data.autoCreateClass) {
          if (data.hasMultipleDivisions && data.divisions && data.divisions.length > 0) {
            for (const division of data.divisions) {
              const classe = {
                nom: `${createdNiveau.nom} ${division}`,
                niveauClasseId: createdNiveau.id,
                effectifF: 0,
                effectifM: 0
              };
              await classeService.create(classe);
            }
          } else {
            const classe = {
              nom: createdNiveau.nom,
              niveauClasseId: createdNiveau.id,
              effectifF: 0,
              effectifM: 0
            };
            await classeService.create(classe);
          }
        }
      }

      setSaved(true);
      alertSuccess("Niveau de classe créé avec succès");
      
      setTimeout(() => {
        navigate("/admin/configuration/niveaux-classe");
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      alertError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/configuration/niveaux-classe");
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">Niveau de classe créé avec succès ! Redirection...</span>
        </div>
      )}

      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button
          onClick={() => navigate("/admin/configuration/niveaux-classe")}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouveau niveau de classe</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <PlusCircle size={14} />
            {cycleNom ? `Ajouter un niveau au cycle ${cycleNom}` : "Créez un nouveau niveau de classe"}
          </p>
        </div>
      </div>

      {/* Informations récapitulatives */}
      {cycleNom && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <BookOpen size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Cycle</p>
                <p className="font-medium text-gray-800">{cycleNom}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Layers size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Niveau scolaire</p>
                <p className="font-medium text-gray-800">{niveauScolaire}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <NiveauClasseForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Aide avec animation */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <div className="flex items-start gap-3">
          <div className="p-1 bg-white rounded-full shadow-sm">
            <span className="text-primary text-sm font-bold block px-2">i</span>
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-700 mb-1">Informations</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Mode Unique</strong> : Crée un seul niveau</li>
              <li><strong>Mode Multiple (6ème, 5ème...)</strong> : Crée plusieurs niveaux différents</li>
              <li><strong>Plusieurs divisions</strong> : Pour un niveau qui a plusieurs classes (A, B, C...)</li>
              <li>Les classes sont automatiquement créées selon vos choix</li>
            </ul>
          </div>
        </div>
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