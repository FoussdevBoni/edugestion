// src/components/forms/NiveauScolaireForm.tsx
import { useState } from "react";

export interface CycleData {
  id?: string;
  nom: string;
}

export interface NiveauScolaireFormData {
  id?: string;
  nom: string;
  aDesCycles: boolean;
  cycles: CycleData[];
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
  const isEditMode = !!initialData?.id;
  
  const [formData, setFormData] = useState<NiveauScolaireFormData>(
    initialData || {
      nom: "",
      aDesCycles: false,
      cycles: [],
    }
  );

  const [cyclesInput, setCyclesInput] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof NiveauScolaireFormData, string>>>({});

  // Mettre à jour les cycles quand l'input change (seulement en mode création)
  const handleCyclesInputChange = (value: string) => {
    setCyclesInput(value);
    
    if (value.trim() === "") {
      setFormData(prev => ({ ...prev, cycles: [] }));
      return;
    }

    const cycleNames = value
      .split(",")
      .map(name => name.trim())
      .filter(name => name !== "");
    
    const uniqueCycleNames = [...new Set(cycleNames)];
    
    const newCycles = uniqueCycleNames.map((name, index) => ({
      nom: name,
      id: Date.now().toString() + index
    }));
    
    setFormData(prev => ({ ...prev, cycles: newCycles }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof NiveauScolaireFormData, string>> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom du niveau scolaire est requis";
    }

    if (!isEditMode && formData.aDesCycles && formData.cycles.length === 0) {
      newErrors.cycles = "Veuillez saisir au moins un cycle";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Si l'utilisateur a choisi "Non" pour les cycles, on crée un cycle fantôme avec le nom du niveau
      if (!formData.aDesCycles) {
        onSubmit({
          ...formData,
          cycles: [{ nom: formData.nom }]
        });
      } else {
        onSubmit(formData);
      }
    }
  };

  const handleChange = (field: keyof NiveauScolaireFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          {isEditMode ? "Modifier le niveau scolaire" : "Informations du niveau scolaire"}
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

          {/* Formulaire de création seulement */}
          {!isEditMode && (
            <>
              {/* Question sur les cycles */}
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Ce niveau scolaire est-il divisé en cycles ?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="oui"
                      checked={formData.aDesCycles === true}
                      onChange={() => handleChange("aDesCycles", true)}
                      className="mr-2"
                    />
                    <span>Oui</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="non"
                      checked={formData.aDesCycles === false}
                      onChange={() => handleChange("aDesCycles", false)}
                      className="mr-2"
                    />
                    <span>Non</span>
                  </label>
                </div>
              </div>

              {/* Gestion des cycles (si Oui) */}
              {formData.aDesCycles && (
                <div className="border-t border-gray-200 pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Noms des cycles <span className="text-red-500">*</span>
                  </label>
                  <label className="block text-xs text-gray-500 mb-2">
                    Séparez les noms des cycles par des virgules
                  </label>
                  <input
                    type="text"
                    value={cyclesInput}
                    onChange={(e) => handleCyclesInputChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.cycles ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Cycle 1, Cycle 2, Cycle 3"
                  />
                  {errors.cycles && <p className="mt-1 text-sm text-red-500">{errors.cycles}</p>}
                  
                  {/* Affichage des cycles en temps réel */}
                  {formData.cycles.length > 0 && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cycles ({formData.cycles.length})
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {formData.cycles.map((cycle, index) => (
                          <div
                            key={cycle.id || index}
                            className="bg-gray-100 rounded-lg px-3 py-1.5"
                          >
                            <span className="text-sm text-gray-700">{cycle.nom}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Message informatif pour le cycle fantôme */}
              {formData.aDesCycles === false && formData.nom && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
                  <p>
                    <strong>Note :</strong> Un cycle fantôme nommé <strong>"{formData.nom}"</strong> sera automatiquement créé pour ce niveau scolaire.
                  </p>
                </div>
              )}

              {formData.aDesCycles === false && !formData.nom && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
                  <p>
                    <strong>Note :</strong> Un cycle fantôme portant le même nom que le niveau scolaire sera automatiquement créé.
                  </p>
                </div>
              )}

              {/* Note informative générale */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                <p>
                  <strong>Note :</strong> {formData.aDesCycles 
                    ? "Saisissez les noms des cycles séparés par des virgules. Ils apparaîtront automatiquement ci-dessous." 
                    : "Un cycle fantôme portant le même nom que le niveau sera automatiquement créé."}
                </p>
              </div>
            </>
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
          {isSubmitting ? "Enregistrement..." : isEditMode ? "Mettre à jour" : "Créer le niveau"}
        </button>
      </div>
    </form>
  );
}