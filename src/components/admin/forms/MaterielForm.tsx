// src/components/admin/forms/MaterielForm.tsx
import { useState } from "react";
import { 
  Save, X, AlertTriangle, Plus, Trash2
} from "lucide-react";

interface LigneMateriel {
  nom: string;
  quantite: string;
  seuilAlerte: string;
  description: string;
  fournisseur: string;
}

interface MaterielFormData {
  lignes: LigneMateriel[];
}

interface MaterielFormProps {
  initialData?: MaterielFormData;  // Pour update (une seule ligne)
  onSubmit: (data: MaterielFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  mode?: 'create' | 'update';  // Pour savoir si on est en création ou modification
}

export default function MaterielForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false,
  mode = 'create'
}: MaterielFormProps) {
  
  const [formData, setFormData] = useState<MaterielFormData>(
    initialData || {
      lignes: [{ nom: "", quantite: "0", seuilAlerte: "10", description: "", fournisseur: "" }]
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Ajouter une ligne (uniquement en mode création)
  const ajouterLigne = () => {
    if (mode === 'update') return;
    setFormData({
      ...formData,
      lignes: [...formData.lignes, { nom: "", quantite: "0", seuilAlerte: "10", description: "", fournisseur: "" }]
    });
  };

  // Supprimer une ligne
  const supprimerLigne = (index: number) => {
    if (mode === 'update' || formData.lignes.length === 1) return;
    const nouvellesLignes = formData.lignes.filter((_, i) => i !== index);
    setFormData({ ...formData, lignes: nouvellesLignes });
  };

  // Mettre à jour une ligne
  const updateLigne = (index: number, field: keyof LigneMateriel, value: string) => {
    const nouvellesLignes = [...formData.lignes];
    nouvellesLignes[index] = { ...nouvellesLignes[index], [field]: value };
    setFormData({ ...formData, lignes: nouvellesLignes });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    formData.lignes.forEach((ligne, index) => {
      if (!ligne.nom) {
        newErrors[`ligne_${index}_nom`] = "Le nom est requis";
      }
      if (!ligne.quantite) {
        newErrors[`ligne_${index}_quantite`] = "La quantité est requise";
      } else if (Number(ligne.quantite) < 0) {
        newErrors[`ligne_${index}_quantite`] = "La quantité ne peut pas être négative";
      }
      if (!ligne.seuilAlerte) {
        newErrors[`ligne_${index}_seuil`] = "Le seuil d'alerte est requis";
      } else if (Number(ligne.seuilAlerte) < 0) {
        newErrors[`ligne_${index}_seuil`] = "Le seuil doit être positif";
      }
    });
    
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="space-y-6">
        {/* En-tête avec bouton d'ajout (visible seulement en création) */}
        {mode === 'create' && (
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nouveaux matériaux <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={ajouterLigne}
              className="flex items-center gap-1 px-3 py-1 text-sm text-primary border border-primary rounded-lg hover:bg-primary/5"
            >
              <Plus size={16} />
              Ajouter un matériel
            </button>
          </div>
        )}

        {/* Lignes de matériel */}
        <div className="space-y-4">
          {formData.lignes.map((ligne, index) => {
            const stockBas = Number(ligne.quantite) < Number(ligne.seuilAlerte);
            
            return (
              <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-medium text-gray-700">
                    Matériel {index + 1}
                  </h3>
                  {mode === 'create' && formData.lignes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => supprimerLigne(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={ligne.nom}
                    onChange={(e) => updateLigne(index, 'nom', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors[`ligne_${index}_nom`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Cahier 100 pages"
                  />
                  {errors[`ligne_${index}_nom`] && (
                    <p className="mt-1 text-sm text-red-500">{errors[`ligne_${index}_nom`]}</p>
                  )}
                </div>

                {/* Quantité et Seuil */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantité en stock <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={ligne.quantite}
                      onChange={(e) => updateLigne(index, 'quantite', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors[`ligne_${index}_quantite`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`ligne_${index}_quantite`] && (
                      <p className="mt-1 text-sm text-red-500">{errors[`ligne_${index}_quantite`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seuil d'alerte <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={ligne.seuilAlerte}
                      onChange={(e) => updateLigne(index, 'seuilAlerte', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors[`ligne_${index}_seuil`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`ligne_${index}_seuil`] && (
                      <p className="mt-1 text-sm text-red-500">{errors[`ligne_${index}_seuil`]}</p>
                    )}
                  </div>
                </div>

                {/* Alerte stock bas */}
                {stockBas && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-orange-600" />
                    <p className="text-sm text-orange-700">
                      Le stock est en dessous du seuil d'alerte
                    </p>
                  </div>
                )}

                {/* Fournisseur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fournisseur habituel
                  </label>
                  <input
                    type="text"
                    value={ligne.fournisseur}
                    onChange={(e) => updateLigne(index, 'fournisseur', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Nom du fournisseur"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={ligne.description}
                    onChange={(e) => updateLigne(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Description du matériel..."
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Boutons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
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
            {isSubmitting ? "Enregistrement..." : mode === 'create' ? "Enregistrer les matériels" : "Enregistrer"}
          </button>
        </div>
      </div>
    </form>
  );
}