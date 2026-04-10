import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, AlertCircle, CheckCircle, Edit, User, Mail, Phone } from "lucide-react";
import EnseignantForm, { EnseignantFormData } from "../../../components/admin/forms/EnseignantForm";
import { alertError, alertServerError, alertSuccess } from "../../../helpers/alertError";
import { enseignantService } from "../../../services/enseignantService";

export default function UpdateEnseignantPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const enseignant = location.state;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (data: EnseignantFormData) => {
    setIsSubmitting(true);
    if (!data.id) {
      alertError();
      return;
    }
    try {
      await enseignantService.update(data.id, data);
      setSaved(true);
      alertSuccess("Enseignant modifié avec succès");
      
      setTimeout(() => {
        navigate("/admin/enseignants");
      }, 1500);
    } catch (error) {
      alertServerError(error);
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/enseignants");
  };

  if (!enseignant) {
    return (
      <div className="max-w-2xl mx-auto mt-10 animate-fade-in-up">
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-10 text-center">
          <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Enseignant introuvable</h2>
          <p className="text-red-600 mb-6">L'enseignant que vous cherchez à modifier n'existe pas.</p>
          <button
            onClick={() => navigate("/admin/enseignants")}
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
          <span className="text-green-700 font-medium">Enseignant modifié avec succès ! Redirection...</span>
        </div>
      )}

      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button
          onClick={() => navigate("/admin/enseignants")}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
          title="Retour à la liste"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier l'enseignant</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Edit size={14} />
            {enseignant.prenom} {enseignant.nom}
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
              <p className="text-xs text-gray-500">Nom complet</p>
              <p className="font-medium text-gray-800">{enseignant.prenom} {enseignant.nom}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Mail size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{enseignant.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Phone size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Téléphone</p>
              <p className="font-medium text-gray-800">{enseignant.tel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <EnseignantForm
          initialData={enseignant}
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