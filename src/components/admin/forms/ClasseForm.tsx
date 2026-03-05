// src/components/forms/ClasseForm.tsx
import { useState, useEffect } from "react";
import { niveauxClasse } from "../../../data/baseData";


export interface ClasseFormData {
  id?: string;
  nom: string;
  niveauClasseId: string;
  niveauClasse: string;
  cycle: string;
  niveauScolaire: string;
}

interface ClasseFormProps {
  initialData?: ClasseFormData;
  onSubmit: (data: ClasseFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function ClasseForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false 
}: ClasseFormProps) {
  const [formData, setFormData] = useState<ClasseFormData>(
    initialData || {
      nom: "",
      niveauClasseId: "",
      niveauClasse: "",
      cycle: "",
      niveauScolaire: "",
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof ClasseFormData, string>>>({});

  // Mettre à jour les infos du niveau de classe quand l'ID change
  useEffect(() => {
    if (formData.niveauClasseId) {
      const niveau = niveauxClasse.find(n => n.id === formData.niveauClasseId);
      if (niveau) {
        setFormData(prev => ({ 
          ...prev, 
          niveauClasse: niveau.nom,
          cycle: niveau.cycle,
          niveauScolaire: niveau.niveauScolaire 
        }));
      }
    }
  }, [formData.niveauClasseId]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ClasseFormData, string>> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom de la classe est requis";
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

  const handleChange = (field: keyof ClasseFormData, value: string) => {
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
          Informations de la classe
        </h3>

        <div className="space-y-4">
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
              <option value="">Sélectionner un niveau de classe</option>
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

          {/* Nom de la classe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la classe <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => handleChange("nom", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.nom ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: 6ème A, CM1 B, etc."
            />
            {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
          </div>

          {/* Aperçu des infos dérivées (lecture seule) */}
          {formData.niveauClasse && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
              <p className="text-gray-700">
                <span className="font-medium">Niveau de classe :</span> {formData.niveauClasse}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Cycle :</span> {formData.cycle}
              </p>
              <p className="text-gray-700">
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
          {isSubmitting ? "Enregistrement..." : initialData ? "Mettre à jour" : "Créer la classe"}
        </button>
      </div>
    </form>
  );
}