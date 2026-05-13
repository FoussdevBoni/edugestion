// src/components/admin/forms/VenteForm.tsx
import { useState, useEffect, useMemo } from "react";
import { CreditCard } from "lucide-react";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import useEleves from "../../../hooks/eleves/useEleves";
import useMateriels from "../../../hooks/materiels/useMateriels";

interface VenteFormData {
  materielId: string;
  quantite: number;
  prixUnitaire: number;
  date: string;
  modePaiement: string;
  eleveIds: string[];
  referenceExterne: string;
  notes: string;
}

interface VenteFormProps {
  initialData?: VenteFormData & { eleve?: any };
  onSubmit: (data: VenteFormData & { total: number }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const MODES_PAIEMENT = [
  { value: "especes", label: "Espèces" },
  { value: "mobile_money", label: "Mobile money" },
  { value: "virement", label: "Virement bancaire" },
  { value: "cheque", label: "Chèque" }
];

export default function VenteForm({ 
  initialData,
  onSubmit, 
  onCancel,
  isSubmitting = false 
}: VenteFormProps) {
  const isEditMode = !!initialData;
  const { niveauSelectionne, cycleSelectionne } = useEcoleNiveau();
  const { eleves } = useEleves();
  const { materiels } = useMateriels();
  
  const [formData, setFormData] = useState<VenteFormData>(
    initialData ? {
      materielId: initialData.materielId || "",
      quantite: initialData.quantite || 1,
      prixUnitaire: initialData.prixUnitaire || 0,
      date: initialData.date,
      modePaiement: initialData.modePaiement,
      eleveIds: initialData.eleveIds || [],
      referenceExterne: initialData.referenceExterne || "",
      notes: initialData.notes || ""
    } : {
      materielId: "",
      quantite: 1,
      prixUnitaire: 0,
      date: new Date().toISOString().split('T')[0],
      modePaiement: "especes",
      eleveIds: [],
      referenceExterne: "",
      notes: ""
    }
  );

  const [classeSelectionnee, setClasseSelectionnee] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filtrer les élèves selon les filtres globaux
  const elevesFiltres = useMemo(() => {
    return eleves.filter(eleve => {
      const matchesNiveau = niveauSelectionne ? eleve.niveauScolaire === niveauSelectionne : true;
      const matchesCycle = cycleSelectionne ? eleve.cycle === cycleSelectionne : true;
      return matchesNiveau && matchesCycle;
    });
  }, [eleves, niveauSelectionne, cycleSelectionne]);

  // Classes disponibles
  const classesDisponibles = useMemo(() => {
    return [...new Set(elevesFiltres.map(e => e.classe).filter(Boolean))].sort();
  }, [elevesFiltres]);

  // En mode édition, pré-sélectionner la classe
  useEffect(() => {
    if (isEditMode && initialData?.eleve) {
      const classe = initialData.eleve.classe;
      if (classe) setClasseSelectionnee(classe);
    }
  }, [isEditMode, initialData]);

  // Liste des élèves de la classe choisie
  const elevesDeLaClasse = useMemo(() => {
    return classeSelectionnee 
      ? elevesFiltres.filter(e => e.classe === classeSelectionnee)
      : [];
  }, [classeSelectionnee, elevesFiltres]);

  // Calcul du total
  const total = formData.quantite * formData.prixUnitaire * formData.eleveIds.length;

  // Sélectionner une classe
  const handleClasseChange = (classe: string) => {
    setClasseSelectionnee(classe);
    if (!isEditMode) {
      setFormData(prev => ({ ...prev, eleveIds: [] }));
    }
  };

  // Sélectionner tous les élèves
  const handleSelectAll = (checked: boolean) => {
    if (isEditMode) return;
    setFormData(prev => ({
      ...prev,
      eleveIds: checked ? elevesDeLaClasse.map(e => e.id) : []
    }));
  };

  // Basculer la sélection d'un élève
  const toggleEleve = (id: string) => {
    if (isEditMode) return;
    setFormData(prev => {
      const isSelected = prev.eleveIds.includes(id);
      const newEleveIds = isSelected
        ? prev.eleveIds.filter(i => i !== id)
        : [...prev.eleveIds, id];
      return { ...prev, eleveIds: newEleveIds };
    });
  };

  // Vérifier le stock
  const validateStock = () => {
    if (!formData.materielId || formData.eleveIds.length === 0) return null;
    
    const materiel = materiels?.find(m => m.id === formData.materielId);
    const besoinTotal = formData.quantite * formData.eleveIds.length;
    
    if (materiel && materiel.quantite < besoinTotal) {
      return `Stock insuffisant pour ${materiel.nom}. Disponible: ${materiel.quantite}, Besoin: ${besoinTotal}`;
    }
    return null;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!isEditMode && !classeSelectionnee) {
      newErrors.classe = "Veuillez sélectionner une classe";
    }
    
    if (!isEditMode && formData.eleveIds.length === 0 && classeSelectionnee) {
      newErrors.eleves = "Veuillez sélectionner au moins un élève";
    }
    
    if (!formData.materielId) {
      newErrors.materiel = "Veuillez sélectionner un matériel";
    }
    
    if (!formData.quantite || formData.quantite <= 0) {
      newErrors.quantite = "Quantité positive requise";
    }
    
    if (!formData.prixUnitaire || formData.prixUnitaire <= 0) {
      newErrors.prix = "Prix unitaire positif requis";
    }
    
    if (!formData.date) newErrors.date = "Date requise";
    
    // Vérifier le stock
    const stockError = validateStock();
    if (stockError) newErrors.stock = stockError;
    
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

  const isAllSelected = elevesDeLaClasse.length > 0 && formData.eleveIds.length === elevesDeLaClasse.length;
  const eleveConcerne = isEditMode && initialData?.eleve;
  const nbEleves = isEditMode ? 1 : formData.eleveIds.length;
  
  const selectedMateriel = materiels?.find(m => m.id === formData.materielId);
  const besoinTotal = selectedMateriel ? formData.quantite * nbEleves : 0;
  const stockSuffisant = selectedMateriel ? selectedMateriel.quantite >= besoinTotal : true;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      {/* Message d'erreur global */}
      {errors.global && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
          {errors.global}
        </div>
      )}

      {/* Étape 1: Sélection de la classe (uniquement en création) */}
      {!isEditMode && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            1. Sélectionner une classe
          </h3>

          <select
            value={classeSelectionnee}
            onChange={(e) => handleClasseChange(e.target.value)}
            className={`w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              errors.classe ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Choisir une classe</option>
            {classesDisponibles.map(classe => (
              <option key={classe} value={classe}>{classe}</option>
            ))}
          </select>
          {errors.classe && <p className="mt-1 text-sm text-red-500">{errors.classe}</p>}
        </div>
      )}

      {/* Étape 2: Sélection des élèves */}
      {isEditMode ? (
        eleveConcerne && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              Élève concerné
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">{eleveConcerne.prenom} {eleveConcerne.nom}</p>
              <p className="text-sm text-gray-600">Classe: {eleveConcerne.classe}</p>
              <p className="text-sm text-gray-600">Matricule: {eleveConcerne.matricule}</p>
            </div>
          </div>
        )
      ) : (
        classeSelectionnee && elevesDeLaClasse.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                2. Sélectionner les élèves
              </h3>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-primary rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">
                  Tous les élèves ({elevesDeLaClasse.length})
                </span>
              </label>
            </div>

            <div className="overflow-x-auto max-h-64 overflow-y-auto border rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Sél.</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Élève</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Matricule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {elevesDeLaClasse.map(eleve => (
                    <tr key={eleve.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={formData.eleveIds.includes(eleve.id)}
                          onChange={() => toggleEleve(eleve.id)}
                          className="w-4 h-4 text-primary rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-2 font-medium">{eleve.prenom} {eleve.nom}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{eleve.matricule}</td>
                    </tr>
                  ))}
                </tbody>
               </table>
            </div>
            {errors.eleves && (
              <p className="mt-2 text-sm text-red-500">{errors.eleves}</p>
            )}
            {formData.eleveIds.length === 0 && classeSelectionnee && (
              <p className="mt-2 text-sm text-orange-500">
                ⚠️ Aucun élève sélectionné. Veuillez choisir au moins un élève.
              </p>
            )}
          </div>
        )
      )}

      {/* Étape 3: Détails de la vente */}
      {(nbEleves > 0 || isEditMode) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            {isEditMode ? "Modifier la vente" : `3. Détails de la vente (pour ${nbEleves} élève${nbEleves > 1 ? 's' : ''})`}
          </h3>

          {/* Sélection du matériel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matériel <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.materielId}
                onChange={(e) => setFormData({ ...formData, materielId: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.materiel ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionnez un matériel</option>
                {materiels?.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.nom} (Stock: {m.quantite})
                  </option>
                ))}
              </select>
              {errors.materiel && <p className="mt-1 text-sm text-red-500">{errors.materiel}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantité par élève <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantite}
                onChange={(e) => setFormData({ ...formData, quantite: parseInt(e.target.value) || 0 })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.quantite ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Quantité par élève"
              />
              {errors.quantite && <p className="mt-1 text-sm text-red-500">{errors.quantite}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix unitaire (FCFA) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={formData.prixUnitaire}
                onChange={(e) => setFormData({ ...formData, prixUnitaire: parseInt(e.target.value) || 0 })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.prix ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Prix unitaire"
              />
              {errors.prix && <p className="mt-1 text-sm text-red-500">{errors.prix}</p>}
            </div>
          </div>

          {/* Informations de stock */}
          {selectedMateriel && nbEleves > 0 && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Stock disponible:</span>
                <span className={`font-medium ${stockSuffisant ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedMateriel.quantite} unités
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-600">Besoin total:</span>
                <span className={`font-medium ${stockSuffisant ? 'text-gray-800' : 'text-red-600'}`}>
                  {besoinTotal} unités ({formData.quantite} × {nbEleves} élève(s))
                </span>
              </div>
              {!stockSuffisant && (
                <div className="mt-2 text-sm text-red-600">
                  ⚠️ Stock insuffisant ! Il manque {besoinTotal - selectedMateriel.quantite} 
                  unités.
                </div>
              )}
            </div>
          )}

          {errors.stock && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.stock}</p>
            </div>
          )}

          {/* Total */}
          {total > 0 && (
            <div className="mt-4 p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-gray-600">
                {formData.quantite} × {new Intl.NumberFormat('fr-FR')
                .format(formData.prixUnitaire)} FCFA × {nbEleves} élève(s)
              </p>
              <p className="text-xl font-bold text-primary mt-1">
                Total: {new Intl.NumberFormat('fr-FR').format(total)} FCFA
              </p>
            </div>
          )}

          {/* Date */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date et heure de la vente <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none
                 focus:ring-2 focus:ring-primary/50 ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>

          {/* Mode de paiement */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mode de paiement
            </label>
            <div className="relative">
              <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={formData.modePaiement}
                onChange={(e) => setFormData({ ...formData, modePaiement: e.target.value })}
                className="w-full max-w-md pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {MODES_PAIEMENT.map(mode => (
                  <option key={mode.value} value={mode.value}>{mode.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Référence externe */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Référence externe (facultatif)
            </label>
            <input
              type="text"
              value={formData.referenceExterne}
              onChange={(e) => setFormData({ ...formData, referenceExterne: e.target.value })}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="N° facture, reçu, etc."
            />
          </div>

          {/* Notes */}
          <div className="mt-4">
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
        </div>
      )}

      {/* Boutons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting || (nbEleves === 0 && !isEditMode) || !stockSuffisant}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Enregistrement..." : isEditMode ? "Mettre à jour" : "Enregistrer les ventes"}
        </button>
      </div>
    </form>
  );
}