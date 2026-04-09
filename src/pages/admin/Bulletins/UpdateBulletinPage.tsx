// src/pages/admin/bulletins/UpdateBulletinPage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import { alertServerError } from "../../../helpers/alertError";
import { bulletinService } from "../../../services/bulletinService";
import { Bulletin } from "../../../utils/types/data";

export default function UpdateBulletinPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bulletin: Bulletin = location.state;
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      navigate(-1);
    } catch (error) {
      alertServerError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bulletin) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Bulletin non trouvé</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Modifier le bulletin
          </h1>
          <p className="text-sm text-gray-500">
            {bulletin.eleve.prenom} {bulletin.eleve.nom} - {bulletin.eleve.classe}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {/* Vie scolaire */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Vie scolaire</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Absences
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.vieScolaire.absences}
                  onChange={(e) => setFormData({
                    ...formData,
                    vieScolaire: { ...formData.vieScolaire, absences: parseInt(e.target.value) || 0 }
                  })}
                  className={`w-full px-4 py-2 border rounded-lg ${
                    errors.absences ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.absences && <p className="mt-1 text-sm text-red-500">{errors.absences}</p>}
              </div>

              <div>
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
                  className={`w-full px-4 py-2 border rounded-lg ${
                    errors.retards ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.retards && <p className="mt-1 text-sm text-red-500">{errors.retards}</p>}
              </div>

              <div>
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
                  className={`w-full px-4 py-2 border rounded-lg ${
                    errors.conduite ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.conduite && <p className="mt-1 text-sm text-red-500">{errors.conduite}</p>}
              </div>
            </div>
          </div>

          {/* Décision du conseil */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Décision du conseil</h2>
            <select
              value={formData.commentaires.decisionConseil}
              onChange={(e) => setFormData({
                ...formData,
                commentaires: { ...formData.commentaires, decisionConseil: e.target.value }
              })}
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.decisionConseil ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionner une décision</option>
              <option value="Passe en classe supérieure">Passe en classe supérieure</option>
              <option value="Passe avec félicitations">Passe avec félicitations</option>
              <option value="Passe avec encouragements">Passe avec encouragements</option>
              <option value="Passe avec réserves">Passe avec réserves</option>
              <option value="Redouble">Redouble</option>
              <option value="Exclusion">Exclusion</option>
            </select>
            {errors.decisionConseil && <p className="mt-1 text-sm text-red-500">{errors.decisionConseil}</p>}
          </div>

          {/* Observations */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Observations</h2>
            <textarea
              value={formData.commentaires.observations}
              onChange={(e) => setFormData({
                ...formData,
                commentaires: { ...formData.commentaires, observations: e.target.value }
              })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Observations sur l'élève..."
            />
          </div>

          {/* Boutons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <X size={16} />
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              <Save size={16} />
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}