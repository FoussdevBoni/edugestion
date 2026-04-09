import { useState } from "react";
import useNiveauxScolaires from "../../../hooks/niveauxScolaires/useNiveauxScolaires";

export interface PeriodeFormData {
  id?: string;
  nom: string;
  niveauScolaireId: string;
  niveauScolaire: string;
  coefficient: number;
  ordre: number; // Pour l'ordre des périodes (1, 2, 3, etc.)
}

interface PeriodeFormProps {
  initialData?: PeriodeFormData;
  onSubmit: (data: PeriodeFormData[]) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function PeriodeForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false
}: PeriodeFormProps) {
  const { niveauxScolaires } = useNiveauxScolaires();
  const isUpdate = !!initialData;
  const [isMultiple, setIsMultiple] = useState(false);

  const [formData, setFormData] = useState<PeriodeFormData>(
    initialData || { 
      nom: "", 
      niveauScolaireId: "", 
      niveauScolaire: "", 
      coefficient: 1,
      ordre: 1
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof PeriodeFormData, string>>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Partial<Record<keyof PeriodeFormData, string>> = {};
    if (!formData.nom.trim()) newErrors.nom = "Le nom ou la liste est requis";
    if (!formData.niveauScolaireId) newErrors.niveauScolaireId = "Le niveau scolaire est requis";
    if (formData.coefficient <= 0) newErrors.coefficient = "Le coefficient doit être supérieur à 0";
    if (formData.coefficient > 10) newErrors.coefficient = "Le coefficient ne peut pas dépasser 10";
    if (formData.ordre <= 0) newErrors.ordre = "L'ordre doit être supérieur à 0";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const niveau = niveauxScolaires.find(n => n.id === formData.niveauScolaireId);

    if (isUpdate) {
      onSubmit([{ ...formData, niveauScolaire: niveau?.nom || "" }]);
    } else {
      if (isMultiple) {
        // Saisie multiple : on parse les noms et on permet de spécifier l'ordre
        const lines = formData.nom.split("\n").filter(line => line.trim() !== "");
        
        const periodes = lines.map((line, index) => {
          // Format possible: "Semestre 1,2" ou "Semestre 1" ou "Semestre 1, coeff=2, ordre=1"
          const parts = line.split(",").map(p => p.trim());
          let nom = parts[0];
          let coefficient = formData.coefficient;
          let ordre = index + 1; // Ordre par défaut basé sur la position
          
          // Parsing des options supplémentaires
          parts.slice(1).forEach(part => {
            if (part.includes("=")) {
              const [key, value] = part.split("=");
              if (key === "coeff" || key === "coefficient") {
                coefficient = parseFloat(value) || formData.coefficient;
              } else if (key === "ordre" || key === "order") {
                ordre = parseInt(value) || (index + 1);
              }
            } else if (!isNaN(parseFloat(part))) {
              // Si c'est juste un nombre, on considère que c'est le coefficient
              coefficient = parseFloat(part);
            }
          });
          
          return {
            ...formData,
            nom,
            coefficient,
            ordre,
            niveauScolaire: niveau?.nom || ""
          };
        });
        
        onSubmit(periodes);
      } else {
        // Saisie simple
        onSubmit([{ 
          ...formData, 
          niveauScolaire: niveau?.nom || "",
          ordre: formData.ordre // Utiliser l'ordre saisi manuellement
        }]);
      }
    }
  };

  const handleChange = (field: keyof PeriodeFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Informations de la période
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.niveauScolaireId ? 'border-red-500' : 'border-gray-300'
                }`}
            >
              <option value="">Sélectionner un niveau</option>
              {niveauxScolaires.map(niveau => (
                <option key={niveau.id} value={niveau.id}>{niveau.nom}</option>
              ))}
            </select>
            {errors.niveauScolaireId && <p className="mt-1 text-sm text-red-500">{errors.niveauScolaireId}</p>}
          </div>

          {/* Toggle Saisie en masse (Uniquement en création) */}
          {!isUpdate && (
            <div className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                id="bulk"
                checked={isMultiple}
                onChange={(e) => setIsMultiple(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="bulk" className="text-sm font-medium text-gray-600 cursor-pointer">
                Saisie multiple (une période par ligne)
              </label>
            </div>
          )}

          {/* Nom/Liste des périodes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isMultiple ? "Liste des périodes (une par ligne)" : "Nom de la période"} <span className="text-red-500">*</span>
            </label>
            
            {isMultiple ? (
              <>
                <textarea
                  value={formData.nom}
                  onChange={(e) => handleChange("nom", e.target.value)}
                  rows={5}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm ${errors.nom ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder={`Semestre 2, coeff=2, ordre=2
Semestre 1, coeff=2, ordre=1
Trimestre 3, coeff=1, ordre=3
Examen Final, coeff=3, ordre=4`}
                />
                <p className="mt-1 text-xs text-gray-500">
                  💡 Format: "Nom, coeff=X, ordre=Y" ou "Nom, X, Y" (coeff et ordre sont optionnels)
                </p>
                <p className="mt-1 text-xs text-blue-600">
                  📝 Exemple: "Semestre 2, coeff=2, ordre=2" ou "Semestre 1, 2, 1"
                </p>
              </>
            ) : (
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => handleChange("nom", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.nom ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Ex: 1er Semestre"
              />
            )}
            {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
          </div>

          {/* Ordre (uniquement pour la saisie simple) */}
          {!isMultiple && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ordre <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.ordre}
                  onChange={(e) => handleChange("ordre", parseInt(e.target.value) || 0)}
                  step="1"
                  min="1"
                  max="20"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.ordre ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                <div className="text-sm text-gray-500 whitespace-nowrap">
                  (1-20)
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                💡 L'ordre détermine la séquence des périodes (1 = première, 2 = deuxième, etc.)
              </p>
              {errors.ordre && <p className="mt-1 text-sm text-red-500">{errors.ordre}</p>}
            </div>
          )}

          {/* Coefficient (uniquement pour la saisie simple) */}
          {!isMultiple && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coefficient <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.coefficient}
                  onChange={(e) => handleChange("coefficient", parseFloat(e.target.value) || 0)}
                  step="0.5"
                  min="0.5"
                  max="10"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.coefficient ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                <div className="text-sm text-gray-500 whitespace-nowrap">
                  (0.5-10)
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                💡 Important : Le coefficient détermine le poids de cette période dans le calcul de la moyenne annuelle
              </p>
              <p className="mt-1 text-xs text-blue-600">
                📊 Exemple : Si Semestre 1 a coeff 2 et Semestre 2 a coeff 3, la moyenne annuelle = (Moy_S1 × 2 + Moy_S2 × 3) / 5
              </p>
              {errors.coefficient && <p className="mt-1 text-sm text-red-500">{errors.coefficient}</p>}
            </div>
          )}

          {/* Aide pour la saisie multiple */}
          {!isUpdate && isMultiple && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-800 mb-2">📘 Format de saisie multiple</p>
              <p className="text-xs text-blue-700 mb-2">
                Chaque ligne représente une période. Vous pouvez spécifier :
              </p>
              <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
                <li><strong>Nom seul</strong> : "Semestre 1" (coeff et ordre par défaut)</li>
                <li><strong>Avec coefficient</strong> : "Semestre 1, coeff=2" ou "Semestre 1, 2"</li>
                <li><strong>Avec ordre</strong> : "Semestre 2, ordre=2"</li>
                <li><strong>Avec les deux</strong> : "Semestre 1, coeff=2, ordre=1"</li>
              </ul>
              <p className="text-xs text-blue-700 mt-2">
                ⚠️ L'ordre est important pour le calcul des moyennes annuelles et l'affichage chronologique.
              </p>
            </div>
          )}

          {isUpdate && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm font-medium text-yellow-800 mb-1">⚠️ Attention</p>
              <p className="text-xs text-yellow-700">
                La modification du coefficient ou de l'ordre affectera le calcul des moyennes annuelles pour tous les bulletins de cette période.
              </p>
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
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? "Enregistrement..." : initialData ? "Mettre à jour" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}