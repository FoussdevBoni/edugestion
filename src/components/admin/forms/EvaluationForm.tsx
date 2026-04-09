import { useState, useEffect } from "react";
import usePeriodes from "../../../hooks/periodes/usePeriodes";

export interface EvaluationFormData {
  id?: string;
  nom: string;
  abreviation?: string;
  periodeId: string;
  periode: string;
  niveauScolaireId: string;
  niveauScolaire: string;
  type: "composition" | "devoir" | "interrogation";
  coefficient: number;
}

interface EvaluationFormProps {
  initialData?: EvaluationFormData;
  onSubmit: (data: EvaluationFormData[]) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function EvaluationForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false 
}: EvaluationFormProps) {
  const { periodes } = usePeriodes();
  const isUpdate = !!initialData;
  const [isMultiple, setIsMultiple] = useState(false);

  const [formData, setFormData] = useState<EvaluationFormData>(
    initialData || {
      nom: "",
      abreviation: "",
      periodeId: "",
      periode: "",
      niveauScolaireId: "",
      niveauScolaire: "",
      type: "devoir",
      coefficient: 1,
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof EvaluationFormData, string>>>({});

  useEffect(() => {
    if (formData.periodeId) {
      const p = periodes.find(p => p.id === formData.periodeId);
      if (p) {
        setFormData(prev => ({ 
          ...prev, 
          periode: p.nom,
          niveauScolaireId: p.niveauScolaireId || "",
          niveauScolaire: p.niveauScolaire
        }));
      }
    }
  }, [formData.periodeId, periodes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Partial<Record<keyof EvaluationFormData, string>> = {};
    
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.periodeId) newErrors.periodeId = "La période est requise";
    if (!formData.type) newErrors.type = "Le type est requis";
    if (formData.coefficient <= 0) newErrors.coefficient = "Le coefficient doit être supérieur à 0";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isUpdate) {
      onSubmit([formData]);
    } else {
      const noms = formData.nom.split(",").map(s => s.trim()).filter(s => s !== "");
      const evaluations = noms.map(nom => ({
        ...formData,
        nom,
        abreviation: formData.abreviation || nom.substring(0, 3).toUpperCase()
      }));
      onSubmit(evaluations);
    }
  };

  const handleChange = (field: keyof EvaluationFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const periodesParNiveau = periodes.reduce((acc, p) => {
    if (!acc[p.niveauScolaire]) acc[p.niveauScolaire] = [];
    acc[p.niveauScolaire].push(p);
    return acc;
  }, {} as Record<string, typeof periodes>);

  const typesOptions = [
    { value: "composition", label: "Composition" },
    { value: "devoir", label: "Devoir" },
    { value: "interrogation", label: "Interrogation" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Informations de l'évaluation</h3>

        <div className="space-y-4">
          {/* Période */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Période *</label>
            <select
              value={formData.periodeId}
              onChange={(e) => handleChange("periodeId", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.periodeId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Sélectionner une période</option>
              {Object.entries(periodesParNiveau).map(([niveau, list]) => (
                <optgroup key={niveau} label={niveau}>
                  {list.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
                </optgroup>
              ))}
            </select>
            {errors.periodeId && <p className="text-red-500 text-xs mt-1">{errors.periodeId}</p>}
          </div>

          {/* Type d'évaluation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type d'évaluation *</label>
            <select
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value as any)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
            >
              {typesOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
          </div>

          {/* Coefficient */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coefficient *</label>
            <input
              type="number"
              value={formData.coefficient}
              onChange={(e) => handleChange("coefficient", parseFloat(e.target.value) || 0)}
              min="0.5"
              max="10"
              step="0.5"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.coefficient ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.coefficient && <p className="text-red-500 text-xs mt-1">{errors.coefficient}</p>}
          </div>

          {/* Toggle Multiple (uniquement création) */}
          {!isUpdate && (
            <div className="flex items-center gap-2 py-2 border-t border-gray-100">
              <input 
                type="checkbox" 
                id="eval_bulk" 
                checked={isMultiple} 
                onChange={(e) => setIsMultiple(e.target.checked)}
                className="rounded text-primary focus:ring-primary"
              />
              <label htmlFor="eval_bulk" className="text-xs font-bold text-gray-500 cursor-pointer uppercase">
                Saisie multiple (séparés par virgules)
              </label>
            </div>
          )}

          {/* Noms des évaluations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isMultiple ? "Noms des évaluations" : "Nom de l'évaluation"} *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => handleChange("nom", e.target.value)}
              placeholder={isMultiple ? "Ex: Devoir 1, Devoir 2, Composition" : "Ex: Devoir 1"}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.nom ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
          </div>

          {/* Abréviation (optionnelle) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Abréviation <span className="text-gray-400 text-xs">(optionnelle)</span>
            </label>
            <input
              type="text"
              value={formData.abreviation || ""}
              onChange={(e) => handleChange("abreviation", e.target.value)}
              placeholder="Ex: DEV1, COMP, INT"
              maxLength={20}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-gray-400 text-xs mt-1">
              {formData.abreviation ? `${formData.abreviation.length}/10` : "Laissez vide pour génération automatique"}
            </p>
          </div>

          {/* Résumé période/niveau */}
          {formData.periode && (
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 text-sm flex justify-between">
              <span className="text-blue-700">
                <span className="font-bold">Période:</span> {formData.periode}
              </span>
              <span className="text-blue-700">
                <span className="font-bold">Niveau:</span> {formData.niveauScolaire}
              </span>
            </div>
          )}
        </div>
      </div>

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
          className="px-6 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? "Enregistrement..." : isUpdate ? "Mettre à jour" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}