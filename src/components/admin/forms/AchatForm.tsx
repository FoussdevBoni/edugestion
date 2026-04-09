// src/components/admin/forms/AchatForm.tsx
import { useState } from "react";
import { 
  Save, X, CreditCard, Calculator, Plus, Trash2
} from "lucide-react";
import useMateriels from "../../../hooks/materiels/useMateriels";
import { Input } from "../../ui/NumberInput";

interface LigneAchat {
  materielId: string;
  quantite: string;
  prixUnitaire: string;
}

interface AchatFormData {
  lignes: LigneAchat[];
  date: string;
  modePaiement: string;
  referenceExterne: string;
  notes: string;
}

interface AchatFormProps {
  initialData?: AchatFormData;
  onSubmit: (data: AchatFormData & { total: number }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const MODES_PAIEMENT = [
  "Espèces",
  "Mobile money",
  "Virement bancaire",
  "Chèque"
];

export default function AchatForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false 
}: AchatFormProps) {
  
  const { materiels, loading } = useMateriels();
  
  const [formData, setFormData] = useState<AchatFormData>(
    initialData || {
      lignes: [{ materielId: "", quantite: "", prixUnitaire: "" }],
      date: new Date().toISOString().split('T')[0],
      modePaiement: "Espèces",
      referenceExterne: "",
      notes: ""
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calcul du total
  const total = formData.lignes.reduce((sum, ligne) => {
    const qte = Number(ligne.quantite) || 0;
    const prix = Number(ligne.prixUnitaire) || 0;
    return sum + (qte * prix);
  }, 0);

  // Ajouter une ligne
  const ajouterLigne = () => {
    setFormData({
      ...formData,
      lignes: [...formData.lignes, { materielId: "", quantite: "", prixUnitaire: "" }]
    });
  };

  // Supprimer une ligne
  const supprimerLigne = (index: number) => {
    if (formData.lignes.length === 1) return;
    const nouvellesLignes = formData.lignes.filter((_, i) => i !== index);
    setFormData({ ...formData, lignes: nouvellesLignes });
  };

  // Mettre à jour une ligne
  const updateLigne = (index: number, field: keyof LigneAchat, value: string) => {
    const nouvellesLignes = [...formData.lignes];
    nouvellesLignes[index] = { ...nouvellesLignes[index], [field]: value };
    setFormData({ ...formData, lignes: nouvellesLignes });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    // Vérifier chaque ligne
    formData.lignes.forEach((ligne, index) => {
      if (!ligne.materielId) {
        newErrors[`ligne_${index}_materiel`] = "Matériel requis";
      }
      if (!ligne.quantite) {
        newErrors[`ligne_${index}_quantite`] = "Quantité requise";
      } else if (Number(ligne.quantite) <= 0) {
        newErrors[`ligne_${index}_quantite`] = "Quantité positive";
      }
      if (!ligne.prixUnitaire) {
        newErrors[`ligne_${index}_prix`] = "Prix requis";
      } else if (Number(ligne.prixUnitaire) <= 0) {
        newErrors[`ligne_${index}_prix`] = "Prix positif";
      }
    });
    
    if (!formData.date) newErrors.date = "Date requise";
    
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ ...formData, total });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="space-y-6">
        {/* Lignes d'achat */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Articles achetés <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={ajouterLigne}
              className="flex items-center gap-1 px-3 py-1 text-sm text-primary border border-primary rounded-lg hover:bg-primary/5"
            >
              <Plus size={16} />
              Ajouter un article
            </button>
          </div>

          <div className="space-y-4">
            {formData.lignes.map((ligne, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Sélection du matériel */}
                  <div>
                    <select
                      value={ligne.materielId}
                      onChange={(e) => updateLigne(index, 'materielId', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors[`ligne_${index}_materiel`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Sélectionnez un matériel</option>
                      {materiels.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.nom} (Stock: {m.quantite})
                        </option>
                      ))}
                    </select>
                    {errors[`ligne_${index}_materiel`] && (
                      <p className="mt-1 text-xs text-red-500">{errors[`ligne_${index}_materiel`]}</p>
                    )}
                  </div>

                  {/* Quantité */}
                  <div>
                    <Input
                      type="number"
                      min="1"
                      value={ligne.quantite}
                      onChange={(e) => updateLigne(index, 'quantite', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors[`ligne_${index}_quantite`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Quantité"
                    />
                    {errors[`ligne_${index}_quantite`] && (
                      <p className="mt-1 text-xs text-red-500">{errors[`ligne_${index}_quantite`]}</p>
                    )}
                  </div>

                  {/* Prix unitaire */}
                  <div>
                    <input
                      type="number"
                      min="1"
                      value={ligne.prixUnitaire}
                      onChange={(e) => updateLigne(index, 'prixUnitaire', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors[`ligne_${index}_prix`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Prix unitaire"
                    />
                    {errors[`ligne_${index}_prix`] && (
                      <p className="mt-1 text-xs text-red-500">{errors[`ligne_${index}_prix`]}</p>
                    )}
                  </div>
                </div>

                {/* Bouton suppression */}
                {formData.lignes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => supprimerLigne(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Total général */}
        {total > 0 && (
          <div className="bg-primary/5 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="text-primary" size={20} />
              <span className="font-medium text-gray-700">Total de l'achat</span>
            </div>
            <span className="text-2xl font-bold text-primary">
              {new Intl.NumberFormat('fr-FR').format(total)} FCFA
            </span>
          </div>
        )}

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date d'achat <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              errors.date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-500">{errors.date}</p>
          )}
        </div>

        {/* Mode de paiement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mode de paiement
          </label>
          <div className="relative">
            <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={formData.modePaiement}
              onChange={(e) => setFormData({ ...formData, modePaiement: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
            >
              {MODES_PAIEMENT.map(mode => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Référence externe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Référence externe (facultatif)
          </label>
          <input
            type="text"
            value={formData.referenceExterne}
            onChange={(e) => setFormData({ ...formData, referenceExterne: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="N° facture fournisseur, reçu, etc."
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (facultatif)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Informations complémentaires..."
          />
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
            {isSubmitting ? "Enregistrement..." : "Enregistrer l'achat"}
          </button>
        </div>
      </div>
    </form>
  );
}