// src/components/forms/MatiereForm.tsx
import { useState, useEffect } from "react";
import { niveauxClasse } from "../../../data/baseData";


export interface MatiereFormData {
  id?: string;
  nom: string;
  coefficient: number;
  niveauClasseId: string;
  niveauClasse: string;
}

interface MatiereFormProps {
  initialData?: MatiereFormData;
  onSubmit: (data: MatiereFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function MatiereForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false 
}: MatiereFormProps) {
  const [formData, setFormData] = useState<MatiereFormData>(
    initialData || {
      nom: "",
      coefficient: 1,
      niveauClasseId: "",
      niveauClasse: "",
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof MatiereFormData, string>>>({});

  // Mettre à jour le nom du niveau de classe quand l'ID change
  useEffect(() => {
    if (formData.niveauClasseId) {
      const niveau = niveauxClasse.find(n => n.id === formData.niveauClasseId);
      if (niveau) {
        setFormData(prev => ({ ...prev, niveauClasse: niveau.nom }));
      }
    }
  }, [formData.niveauClasseId]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof MatiereFormData, string>> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom de la matière est requis";
    }
    if (!formData.coefficient || formData.coefficient < 1) {
      newErrors.coefficient = "Le coefficient doit être supérieur ou égal à 1";
    }
    if (!formData.niveauClasseId) {
      newErrors.niveauClasseId = "Le niveau de classe est requis";
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

  const handleChange = (field: keyof MatiereFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Grouper les niveaux de classe par cycle et niveau scolaire
  const niveauxParHierarchie = niveauxClasse.reduce((acc, niveau) => {
    const key = `${niveau.niveauScolaire} - ${niveau.cycle}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(niveau);
    return acc;
  }, {} as Record<string, typeof niveauxClasse>);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Informations de la matière
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Niveau de classe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Niveau de classe <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.niveauClasseId}
              onChange={(e) => handleChange("niveauClasseId", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.niveauClasseId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionner un niveau</option>
              {Object.entries(niveauxParHierarchie).map(([hierarchie, niveaux]) => (
                <optgroup key={hierarchie} label={hierarchie}>
                  {niveaux.map(niveau => (
                    <option key={niveau.id} value={niveau.id}>
                      {niveau.nom}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {errors.niveauClasseId && (
              <p className="mt-1 text-sm text-red-500">{errors.niveauClasseId}</p>
            )}
          </div>

          {/* Nom de la matière */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la matière <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => handleChange("nom", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.nom ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Mathématiques, Français, etc."
            />
            {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
          </div>

          {/* Coefficient */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coefficient <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              step="0.5"
              value={formData.coefficient}
              onChange={(e) => handleChange("coefficient", parseFloat(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.coefficient ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="1, 2, 3, etc."
            />
            {errors.coefficient && (
              <p className="mt-1 text-sm text-red-500">{errors.coefficient}</p>
            )}
          </div>
        </div>

        {/* Aperçu du niveau (lecture seule) */}
        {formData.niveauClasse && (
          <div className="mt-4 bg-gray-50 rounded-lg p-3 text-sm">
            <p className="text-gray-700">
              <span className="font-medium">Niveau de classe sélectionné :</span> {formData.niveauClasse}
            </p>
          </div>
        )}
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
          {isSubmitting ? "Enregistrement..." : initialData ? "Mettre à jour" : "Créer la matière"}
        </button>
      </div>
    </form>
  );
}