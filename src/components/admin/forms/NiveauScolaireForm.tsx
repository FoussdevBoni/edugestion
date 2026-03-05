// src/components/forms/NiveauScolaireForm.tsx
import { useState } from "react";

export interface NiveauScolaireFormData {
  id?: string;
  nom: string;
}

interface NiveauScolaireFormProps {
  initialData?: NiveauScolaireFormData;
  onSubmit: (data: NiveauScolaireFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function NiveauScolaireForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false 
}: NiveauScolaireFormProps) {
  const [formData, setFormData] = useState<NiveauScolaireFormData>(
    initialData || {
      nom: "",
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof NiveauScolaireFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof NiveauScolaireFormData, string>> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom du niveau scolaire est requis";
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

  const handleChange = (field: keyof NiveauScolaireFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Informations du niveau scolaire
        </h3>

        <div className="space-y-4">
          {/* Nom du niveau */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du niveau <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => handleChange("nom", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.nom ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Primaire, Secondaire, etc."
            />
            {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
          </div>

          {/* Note informative */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
            <p>
              <strong>Note :</strong> Après la création du niveau scolaire, vous pourrez lui ajouter des cycles.
            </p>
          </div>
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
          {isSubmitting ? "Enregistrement..." : initialData ? "Mettre à jour" : "Créer le niveau"}
        </button>
      </div>
    </form>
  );
}