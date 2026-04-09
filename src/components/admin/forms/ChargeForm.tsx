// src/pages/admin/comptabilite/charges/components/ChargeForm.tsx
import { useState } from "react";
import { 
  Save, X, CreditCard,
  User, FileText, Tag
} from "lucide-react";

interface ChargeFormData {
  libelle: string;
  montant: string;
  date: string;
  categorie: 'salaire' | 'facture' | 'loyer' | 'entretien' | 'transport' | 'fourniture_bureau' | 'autre';
  service?: string;
  beneficiaire?: string;
  modePaiement: 'especes' | 'mobile_money' | 'virement' | 'cheque';
  reference?: string;
  periode?: string;
  notes?: string;
}

interface ChargeFormProps {
  initialData?: ChargeFormData;
  onSubmit: (data: ChargeFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const CATEGORIES = [
  { value: 'salaire', label: 'Salaire', icon: '👤' },
  { value: 'facture', label: 'Facture', icon: '💡' },
  { value: 'loyer', label: 'Loyer', icon: '🏠' },
  { value: 'entretien', label: 'Entretien', icon: '🔧' },
  { value: 'transport', label: 'Transport', icon: '🚚' },
  { value: 'fourniture_bureau', label: 'Fourniture bureau', icon: '📎' },
  { value: 'autre', label: 'Autre', icon: '📦' },
];

const MODES_PAIEMENT = [
  { value: 'especes', label: 'Espèces' },
  { value: 'mobile_money', label: 'Mobile money' },
  { value: 'virement', label: 'Virement bancaire' },
  { value: 'cheque', label: 'Chèque' },
];

export default function ChargeForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false 
}: ChargeFormProps) {
  
  const [formData, setFormData] = useState<ChargeFormData>(
    initialData || {
      libelle: "",
      montant: "",
      date: new Date().toISOString().split('T')[0],
      categorie: "facture",
      service: "",
      beneficiaire: "",
      modePaiement: "especes",
      reference: "",
      periode: "",
      notes: ""
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.libelle) newErrors.libelle = "Le libellé est requis";
    if (!formData.montant) newErrors.montant = "Le montant est requis";
    else if (Number(formData.montant) <= 0) newErrors.montant = "Le montant doit être positif";
    
    if (!formData.date) newErrors.date = "La date est requise";
    
    if (formData.categorie === 'salaire' && !formData.periode) {
      newErrors.periode = "La période est requise pour un salaire";
    }
    
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

  const categorieSelectionnee = CATEGORIES.find(c => c.value === formData.categorie);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="space-y-6">
        {/* Libellé */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Libellé <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.libelle}
            onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              errors.libelle ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: Salaire janvier, Facture eau, etc."
          />
          {errors.libelle && (
            <p className="mt-1 text-sm text-red-500">{errors.libelle}</p>
          )}
        </div>

        {/* Montant et Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant (FCFA) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={formData.montant}
              onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.montant ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: 50000"
            />
            {errors.montant && (
              <p className="mt-1 text-sm text-red-500">{errors.montant}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date <span className="text-red-500">*</span>
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
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setFormData({ ...formData, categorie: cat.value as any })}
                className={`flex items-center gap-2 p-3 border rounded-lg transition-colors ${
                  formData.categorie === cat.value
                    ? 'bg-primary text-white border-primary'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span>{cat.icon}</span>
                <span className="text-sm">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Service (pour factures) */}
        {formData.categorie === 'facture' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de service
            </label>
            <select
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Sélectionnez</option>
              <option value="Eau">Eau</option>
              <option value="Électricité">Électricité</option>
              <option value="Internet">Internet</option>
              <option value="Téléphone">Téléphone</option>
              <option value="Gaz">Gaz</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
        )}

        {/* Période (pour salaires) */}
        {formData.categorie === 'salaire' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.periode}
              onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.periode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: Janvier 2026"
            />
            {errors.periode && (
              <p className="mt-1 text-sm text-red-500">{errors.periode}</p>
            )}
          </div>
        )}

        {/* Bénéficiaire */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bénéficiaire
          </label>
          <div className="relative">
            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={formData.beneficiaire}
              onChange={(e) => setFormData({ ...formData, beneficiaire: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Nom de la personne ou entreprise"
            />
          </div>
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
              onChange={(e) => setFormData({ ...formData, modePaiement: e.target.value as any })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
            >
              {MODES_PAIEMENT.map(mode => (
                <option key={mode.value} value={mode.value}>{mode.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Référence */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Référence (facultatif)
          </label>
          <div className="relative">
            <Tag size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="N° facture, reçu, etc."
            />
          </div>
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

        {/* Résumé */}
        {Number(formData.montant) > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <FileText size={16} />
              <span className="font-medium">Récapitulatif</span>
            </div>
            <p className="text-sm text-blue-700">
              {formData.categorie === 'salaire' ? 'Salaire' : 
               formData.categorie === 'facture' ? 'Facture' : 'Charge'} de{' '}
              <span className="font-bold">
                {new Intl.NumberFormat('fr-FR').format(Number(formData.montant))} FCFA
              </span>{' '}
              {formData.beneficiaire && `- Bénéficiaire: ${formData.beneficiaire}`}
            </p>
            {formData.periode && (
              <p className="text-xs text-blue-600 mt-1">Période: {formData.periode}</p>
            )}
          </div>
        )}

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
            {isSubmitting ? "Enregistrement..." : "Enregistrer la charge"}
          </button>
        </div>
      </div>
    </form>
  );
}