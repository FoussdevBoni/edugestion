// src/pages/admin/parametres/scolarite/classes/NewClassePage.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle, PlusCircle } from "lucide-react";
import ClasseForm, { ClasseFormData } from "../../../../components/admin/forms/ClasseForm";
import { classeService } from "../../../../services/classeService";
import { alertError, alertSuccess } from "../../../../helpers/alertError";

interface PagesProps {
  config?: boolean
}

export default function NewClassePage({ config }: PagesProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const niveauPreselectionne = location.state?.niveauClasseId;
  const niveauNom = location.state?.niveauClasseNom;
  const cycle = location.state?.cycle;
  const niveauScolaire = location.state?.niveauScolaire;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  // Pré-remplir si un niveau de classe est passé en paramètre
  const initialData = niveauPreselectionne ? {
    niveauClasseId: niveauPreselectionne,
    niveauClasse: niveauNom || "",
    cycle: cycle || "",
    niveauScolaire: niveauScolaire || "",
    nom: "",
    effectifF: 0,
    effectifM: 0
  } : undefined;

  const handleSubmit = async (dataArray: ClasseFormData[]) => {
    setIsSubmitting(true);
    try {
      const classesToCreate = dataArray.map(data => ({
        nom: data.nom,
        niveauClasseId: data.niveauClasseId,
        effectifF: data.effectifF || 0,
        effectifM: data.effectifM || 0
      }));

      await classeService.createMany(classesToCreate);
      setSaved(true);
      alertSuccess(`${classesToCreate.length} classe(s) créée(s) avec succès`);
      
      setTimeout(() => {
        if (config) {
          navigate("/admin/configuration/classes");
        } else {
          navigate("/admin/classes");
        }
      }, 1500);
    } catch (error) {
      console.error(error);
      alertError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
          title="Retour à la liste"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouvelle classe</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <PlusCircle size={14} />
            {niveauNom ? `Ajouter une classe au niveau ${niveauNom}` : "Créez une nouvelle classe"}
          </p>
        </div>
      </div>

      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">Classe(s) créée(s) avec succès ! Redirection...</span>
        </div>
      )}

      {/* Formulaire avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <ClasseForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Aide avec animation */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-start gap-3">
          <div className="p-1 bg-white rounded-full shadow-sm">
            <span className="text-primary text-sm font-bold block px-2">i</span>
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-700 mb-1">Informations</p>
            <p>
              Les classes sont les divisions finales (ex: 6ème A, CM1 B, etc.).
              Chaque classe est associée à un niveau de classe qui détermine son cycle et son niveau scolaire.
            </p>
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