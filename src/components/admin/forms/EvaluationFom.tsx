// src/components/forms/EvaluationForm.tsx
import { useState, useEffect } from "react";
import { periodes } from "../../../data/periods";

export interface EvaluationFormData {
  id?: string;
  nom: string;
  periodeId: string;
  periode: string;
  niveauScolaireId: string;
  niveauScolaire: string;
}

interface EvaluationFormProps {
  initialData?: EvaluationFormData;
  onSubmit: (data: EvaluationFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function EvaluationForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false 
}: EvaluationFormProps) {
  const [formData, setFormData] = useState<EvaluationFormData>(
    initialData || {
      nom: "",
      periodeId: "",
      periode: "",
      niveauScolaireId: "",
      niveauScolaire: "",
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof EvaluationFormData, string>>>({});

  // Mettre à jour les infos quand la période change
  useEffect(() => {
    if (formData.periodeId) {
      const periode = periodes.find(p => p.id === formData.periodeId);
      if (periode) {
        setFormData(prev => ({ 
          ...prev, 
          periode: periode.nom,
          niveauScolaireId: periode.niveauScolaireId || "",
          niveauScolaire: periode.niveauScolaire
        }));
      }
    }
  }, [formData.periodeId]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EvaluationFormData, string>> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom de l'évaluation est requis";
    }
    if (!formData.periodeId) {
      newErrors.periodeId = "La période est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof EvaluationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Grouper les périodes par niveau scolaire
  const periodesParNiveau = periodes.reduce((acc, periode) => {
    if (!acc[periode.niveauScolaire]) {
      acc[periode.niveauScolaire] = [];
    }
    acc[periode.niveauScolaire].push(periode);
    return acc;
  }, {} as Record<string, typeof periodes>);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Informations de l'évaluation
        </h3>

        <div className="space-y-4">
          {/* Période */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Période <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.periodeId}
              onChange={(e) => handleChange("periodeId", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.periodeId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionner une période</option>
              {Object.entries(periodesParNiveau).map(([niveau, periodesList]) => (
                <optgroup key={niveau} label={niveau}>
                  {periodesList.map(periode => (
                    <option key={periode.id} value={periode.id}>
                      {periode.nom}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {errors.periodeId && (
              <p className="mt-1 text-sm text-red-500">{errors.periodeId}</p>
            )}
          </div>

          {/* Nom de l'évaluation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'évaluation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => handleChange("nom", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.nom ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: 1ère évaluation, Devoir, etc."
            />
            {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
          </div>

          {/* Aperçu des infos dérivées (lecture seule) */}
          {formData.periode && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm">
              <p className="text-gray-700">
                <span className="font-medium">Période :</span> {formData.periode}
              </p>
              <p className="text-gray-700 mt-1">
                <span className="font-medium">Niveau scolaire :</span> {formData.niveauScolaire}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? "Enregistrement..." : initialData ? "Mettre à jour" : "Créer l'évaluation"}
        </button>
      </div>
    </form>
  );
}