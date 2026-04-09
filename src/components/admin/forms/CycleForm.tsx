// src/components/forms/CycleForm.tsx
import { useState, useEffect } from "react";
import useNiveauxScolaires from "../../../hooks/niveauxScolaires/useNiveauxScolaires";

export interface CycleFormData {
  id?: string;
  nom: string;
  niveauScolaireId: string;
  niveauScolaire: string;
}

interface CycleFormProps {
  initialData?: CycleFormData;
  onSubmit: (data: CycleFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function CycleForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false 
}: CycleFormProps) {
  const {niveauxScolaires} = useNiveauxScolaires()
  const [formData, setFormData] = useState<CycleFormData>(
    initialData || {
      nom: "",
      niveauScolaireId: "",
      niveauScolaire: "",
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof CycleFormData, string>>>({});

  // Mettre à jour le nom du niveau scolaire quand l'ID change
  useEffect(() => {
    if (formData.niveauScolaireId) {
      const niveau = niveauxScolaires.find(n => n.id === formData.niveauScolaireId);
      if (niveau) {
        setFormData(prev => ({ ...prev, niveauScolaire: niveau.nom }));
      }
    }
  }, [formData.niveauScolaireId]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CycleFormData, string>> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom du cycle est requis";
    }
    if (!formData.niveauScolaireId) {
      newErrors.niveauScolaireId = "Le niveau scolaire est requis";
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

  const handleChange = (field: keyof CycleFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Informations du cycle
        </h3>

        <div className="space-y-4">
          {/* Niveau scolaire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Niveau scolaire <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.niveauScolaireId}
              onChange={(e) => handleChange("niveauScolaireId", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.niveauScolaireId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionner un niveau</option>
              {niveauxScolaires.map(niveau => (
                <option key={niveau.id} value={niveau.id}>
                  {niveau.nom}
                </option>
              ))}
            </select>
            {errors.niveauScolaireId && (
              <p className="mt-1 text-sm text-red-500">{errors.niveauScolaireId}</p>
            )}
          </div>

          {/* Nom du cycle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du cycle <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => handleChange("nom", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.nom ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Maternelle, 1er cycle, etc."
            />
            {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
          </div>

          {/* Note informative */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
            <p>
              <strong>Note :</strong> Après la création du cycle, vous pourrez lui ajouter des niveaux de classe.
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
          {isSubmitting ? "Enregistrement..." : initialData ? "Mettre à jour" : "Créer le cycle"}
        </button>
      </div>
    </form>
  );
}