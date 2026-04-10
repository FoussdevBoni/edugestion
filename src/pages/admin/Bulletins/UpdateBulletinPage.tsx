// src/pages/admin/bulletins/UpdateBulletinPage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X, AlertCircle, CheckCircle, User, BookOpen, Calendar } from "lucide-react";
import { alertServerError, alertSuccess } from "../../../helpers/alertError";
import { bulletinService } from "../../../services/bulletinService";
import { Bulletin } from "../../../utils/types/data";

export default function UpdateBulletinPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bulletin: Bulletin = location.state;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    vieScolaire: {
      absences: bulletin?.vieScolaire?.absences || 0,
      retards: bulletin?.vieScolaire?.retards || 0,
      conduite: bulletin?.vieScolaire?.conduite || 0
    },
    commentaires: {
      decisionConseil: bulletin?.commentaires?.decisionConseil || "",
      observations: bulletin?.commentaires?.observations || ""
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.vieScolaire.absences < 0) {
      newErrors.absences = "Le nombre d'absences ne peut pas être négatif";
    }
    if (formData.vieScolaire.retards < 0) {
      newErrors.retards = "Le nombre de retards ne peut pas être négatif";
    }
    if (formData.vieScolaire.conduite < 0 || formData.vieScolaire.conduite > 20) {
      newErrors.conduite = "La note de conduite doit être comprise entre 0 et 20";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await bulletinService.save(bulletin.inscriptionId, bulletin.periodeId, formData);
      setSaved(true);
      alertSuccess("Bulletin modifié avec succès");
      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      alertServerError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bulletin) {
    return (
      <div className="text-center py-12 animate-fade-in-up">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <p className="text-gray-500 text-center mb-4">Bulletin non trouvé</p>
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

  const getConduiteColor = (note: number) => {
    if (note >= 15) return "text-green-600 bg-green-50";
    if (note >= 10) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
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
          <h1 className="text-2xl font-bold text-gray-800">Modifier le bulletin</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <User size={14} />
            {bulletin.eleve?.prenom} {bulletin.eleve?.nom} · 
            <BookOpen size={14} />
            {bulletin.eleve?.classe} · 
            <Calendar size={14} />
            {bulletin.periode}
          </p>
        </div>
      </div>

      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">Bulletin modifié avec succès ! Redirection...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="space-y-6">
          {/* Vie scolaire */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <h2 className="text-lg font-semibold text-gray-800">Vie scolaire</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-gray-50 rounded-xl p-4 transition-all duration-300 hover:shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Absences (heures)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.vieScolaire.absences}
                  onChange={(e) => setFormData({
                    ...formData,
                    vieScolaire: { ...formData.vieScolaire, absences: parseInt(e.target.value) || 0 }
                  })}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200 ${
                    errors.absences ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                  }`}
                />
                {errors.absences && <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle size={12} />{errors.absences}</p>}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 transition-all duration-300 hover:shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Retards
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.vieScolaire.retards}
                  onChange={(e) => setFormData({
                    ...formData,
                    vieScolaire: { ...formData.vieScolaire, retards: parseInt(e.target.value) || 0 }
                  })}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200 ${
                    errors.retards ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                  }`}
                />
                {errors.retards && <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle size={12} />{errors.retards}</p>}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 transition-all duration-300 hover:shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note de conduite /20
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={formData.vieScolaire.conduite}
                  onChange={(e) => setFormData({
                    ...formData,
                    vieScolaire: { ...formData.vieScolaire, conduite: parseFloat(e.target.value) || 0 }
                  })}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200 ${
                    errors.conduite ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                  }`}
                />
                {errors.conduite && <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle size={12} />{errors.conduite}</p>}
                {!errors.conduite && formData.vieScolaire.conduite > 0 && (
                  <p className={`mt-1 text-xs px-2 py-0.5 rounded-full inline-block ${getConduiteColor(formData.vieScolaire.conduite)}`}>
                    {formData.vieScolaire.conduite >= 15 ? "Excellent" : formData.vieScolaire.conduite >= 10 ? "Correct" : "À améliorer"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Décision du conseil */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <h2 className="text-lg font-semibold text-gray-800">Décision du conseil</h2>
            </div>
            <select
              value={formData.commentaires.decisionConseil}
              onChange={(e) => setFormData({
                ...formData,
                commentaires: { ...formData.commentaires, decisionConseil: e.target.value }
              })}
              className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200 bg-white ${
                errors.decisionConseil ? 'border-red-500 bg-red-50' : 'border-gray-200'
              }`}
            >
              <option value="">Sélectionner une décision</option>
              <option value="Passe en classe supérieure">✅ Passe en classe supérieure</option>
              <option value="Passe avec félicitations">⭐ Passe avec félicitations</option>
              <option value="Passe avec encouragements">👍 Passe avec encouragements</option>
              <option value="Passe avec réserves">⚠️ Passe avec réserves</option>
              <option value="Redouble">🔄 Redouble</option>
              <option value="Exclusion">❌ Exclusion</option>
            </select>
            {errors.decisionConseil && <p className="mt-1 text-sm text-red-500 flex items-center gap-1"><AlertCircle size={12} />{errors.decisionConseil}</p>}
          </div>

          {/* Observations */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <h2 className="text-lg font-semibold text-gray-800">Observations</h2>
            </div>
            <textarea
              value={formData.commentaires.observations}
              onChange={(e) => setFormData({
                ...formData,
                commentaires: { ...formData.commentaires, observations: e.target.value }
              })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200 resize-none"
              placeholder="Observations sur l'élève..."
            />
            <p className="text-xs text-gray-400 mt-1">Suggestions : "Bon travail", "Peut mieux faire", "Progrès remarquables", etc.</p>
          </div>

          {/* Boutons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              <X size={16} />
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || saved}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
            >
              <Save size={16} />
              {isSubmitting ? "Enregistrement..." : saved ? "Enregistré !" : "Enregistrer"}
            </button>
          </div>
        </div>
      </form>

      {/* Informations supplémentaires */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-start gap-3">
          <div className="p-1 bg-blue-100 rounded-full">
            <span className="text-blue-600 text-sm font-bold">i</span>
          </div>
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Informations</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Les absences sont comptabilisées en heures</li>
              <li>La note de conduite est sur 20</li>
              <li>La décision du conseil apparaîtra sur le bulletin final</li>
              <li>Les observations sont visibles par les parents</li>
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