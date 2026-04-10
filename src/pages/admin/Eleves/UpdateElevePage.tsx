import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, CheckCircle, Edit, User, BookOpen } from "lucide-react";
import EleveForm, { EleveFormData } from "../../../components/admin/forms/EleveForm";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import { alertSuccess, alertError } from "../../../helpers/alertError";
import { inscriptionService } from "../../../services/inscriptionService";
import { eleveDataService } from "../../../services/eleveDataService";

export default function UpdateElevePage() {
  const navigate = useNavigate();
  const { niveauSelectionne, cycleSelectionne } = useEcoleNiveau();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const location = useLocation();
  const eleve = location.state;

  const handleSubmit = async (data: EleveFormData) => {
    setIsSubmitting(true);

    try {
      // Appel API pour mettre à jour
      await eleveDataService.update(eleve.eleveDataId, {
        ...data

      })

      await inscriptionService.update(eleve.id!, {
        ...data,

      });

      setSaved(true);
      alertSuccess("Élève modifié avec succès");

      setTimeout(() => {
        navigate("/admin/eleves");
      }, 1500);

    } catch (err) {
      alertError("Une erreur est survenue lors de la mise à jour");
      console.error("Erreur:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/eleves");
  };

  if (!eleve) {
    return (
      <div className="max-w-2xl mx-auto mt-10 animate-fade-in-up">
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-10 text-center">
          <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Élève introuvable</h2>
          <p className="text-red-600 mb-6">L'élève que vous cherchez à modifier n'existe pas ou a été supprimé.</p>
          <button
            onClick={() => navigate("/admin/eleves")}
            className="px-6 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-all duration-300"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">Élève modifié avec succès ! Redirection...</span>
        </div>
      )}

      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button
          onClick={() => navigate("/admin/eleves")}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
          title="Retour à la liste"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier l'élève</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Edit size={14} />
            {eleve.prenom} {eleve.nom} • {eleve.classe} {eleve.section && `Section ${eleve.section}`}
          </p>
        </div>
      </div>

      {/* Informations récapitulatives */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <User size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Élève</p>
              <p className="font-medium text-gray-800">{eleve.prenom} {eleve.nom}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <BookOpen size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Classe</p>
              <p className="font-medium text-gray-800">{eleve.classe}</p>
            </div>
          </div>
          {eleve.matricule && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <span className="text-primary font-bold text-sm">#</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Matricule</p>
                <p className="font-medium font-mono text-gray-800">{eleve.matricule}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message sur les filtres */}
      {(niveauSelectionne || cycleSelectionne) && (
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-start gap-3">
            <AlertCircle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-700">
              Les filtres actuels n'affectent pas la modification.
              Les données de l'élève sont pré-remplies.
            </p>
          </div>
        </div>
      )}

      {/* Formulaire avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <EleveForm
          initialData={eleve}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
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