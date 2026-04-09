// src/pages/admin/materiel/components/InventaireForm.tsx
import { useEffect, useState } from "react";
import { 
  Save, X, Plus, Minus
} from "lucide-react";

interface InventaireItem {
  id: string;
  nom: string;
  quantite: number; // stock théorique
  quantiteReelle: number;
  difference: number;
}

export interface InventaireFormData {
  periode: string;
  date: string;
  autrePeriode: string;
  notes: string;
  items: InventaireItem[];
}

interface InventaireFormProps {
  initialData?: InventaireFormData;
  stockActuel: { id: string; nom: string; quantite: number }[];
  onSubmit: (data: InventaireFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const PERIODES = [
  "Début année scolaire",
  "Fin 1er trimestre",
  "Début 2ème trimestre",
  "Fin 2ème trimestre",
  "Début 3ème trimestre",
  "Fin année scolaire",
  "Autre"
];

export default function InventaireForm({ 
  initialData,
  stockActuel,
  onSubmit, 
  onCancel,
  isSubmitting = false 
}: InventaireFormProps) {

  
  const [formData, setFormData] = useState<InventaireFormData>(
    initialData || {
      periode: PERIODES[0],
      date: new Date().toISOString().split('T')[0],
      autrePeriode: "",
      notes: "",
      items: stockActuel.map(m => ({
        ...m,
        quantiteReelle: m.quantite,
        difference: 0
      }))
    }
  );
  

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleQuantityChange = (id: string, nouvelleQuantite: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const diff = nouvelleQuantite - item.quantite;
          return {
            ...item,
            quantiteReelle: nouvelleQuantite,
            difference: diff
          };
        }
        return item;
      })
    }));
  };

  const resetToStock = (id: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          return {
            ...item,
            quantiteReelle: item.quantite,
            difference: 0
          };
        }
        return item;
      })
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.periode) newErrors.periode = "Veuillez sélectionner une période";
    if (formData.periode === "Autre" && !formData.autrePeriode) {
      newErrors.autrePeriode = "Veuillez préciser la période";
    }
    if (!formData.date) newErrors.date = "Veuillez saisir une date";
    
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

  const totalEcarts = formData.items.filter(i => i.difference !== 0).length;
  const totalPertes = formData.items.filter(i => i.difference < 0).reduce((sum, i) => sum + Math.abs(i.difference), 0);
  const totalSurplus = formData.items.filter(i => i.difference > 0).reduce((sum, i) => sum + i.difference, 0);



  useEffect(()=>{
    setFormData({
      periode: PERIODES[0],
      date: new Date().toISOString().split('T')[0],
      autrePeriode: "",
      notes: "",
      items: stockActuel.map(m => ({
        ...m,
        quantiteReelle: m.quantite,
        difference: 0
      }))
    })
  } , [PERIODES , stockActuel])
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations générales */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Période */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.periode}
              onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.periode ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {PERIODES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.periode && (
              <p className="mt-1 text-sm text-red-500">{errors.periode}</p>
            )}
          </div>

          {/* Date */}
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

          {/* Autre période (conditionnel) */}
          {formData.periode === "Autre" && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Précisez la période <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.autrePeriode}
                onChange={(e) => setFormData({ ...formData, autrePeriode: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.autrePeriode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Avant les examens"
              />
              {errors.autrePeriode && (
                <p className="mt-1 text-sm text-red-500">{errors.autrePeriode}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Résumé des écarts */}
      {totalEcarts > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-700 mb-1">Articles avec écart</p>
            <p className="text-2xl font-bold text-orange-700">{totalEcarts}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700 mb-1">Pertes (unités)</p>
            <p className="text-2xl font-bold text-red-700">{totalPertes}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-700 mb-1">Surplus (unités)</p>
            <p className="text-2xl font-bold text-green-700">{totalSurplus}</p>
          </div>
        </div>
      )}

      {/* Tableau de l'inventaire */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Relevé du matériel</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matériel</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stock théorique</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stock réel</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Écart</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {formData.items.map((item) => {
                const hasError = item.difference !== 0;
                return (
                  <tr key={item.id} className={hasError ? 'bg-orange-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 font-medium">{item.nom}</td>
                    <td className="px-6 py-4 text-right font-mono">{item.quantite}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, Math.max(0, item.quantiteReelle - 1))}
                          className="p-1 text-gray-500 hover:bg-gray-200 rounded"
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={item.quantiteReelle}
                          onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                          className="w-20 text-right px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.quantiteReelle + 1)}
                          className="p-1 text-gray-500 hover:bg-gray-200 rounded"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.difference !== 0 && (
                        <span className={`font-mono font-bold ${
                          item.difference < 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {item.difference > 0 ? '+' : ''}{item.difference}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.difference !== 0 && (
                        <button
                          type="button"
                          onClick={() => resetToStock(item.id)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Réinitialiser
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes (facultatif)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Observations, remarques sur l'état du matériel..."
        />
      </div>

      {/* Boutons */}
      <div className="flex items-center justify-end gap-3">
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
          {isSubmitting ? "Enregistrement..." : "Enregistrer l'inventaire"}
        </button>
      </div>
    </form>
  );
}