// src/components/admin/forms/PaiementForm.tsx
import { useState, useEffect, useMemo } from "react";
import { CreditCard } from "lucide-react";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import useEleves from "../../../hooks/eleves/useEleves";

export interface PaiementFormData {
  motif: string;
  motifPersonnalise?: string;
  montantPaye: number;
  montantRestant?: number; // Optionnel, apparait si statut partiellement
  statut: "paye" | "partiellement" | "impaye";
  modePaiement: string;
  datePayement: string;
  inscriptions: string[];
  inscriptionId?: string; 
}

interface PaiementFormProps {
  initialData?: PaiementFormData & { inscription?: any };
  onSubmit: (data: PaiementFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const MODES_PAIEMENT = [
  { value: "especes", label: "Espèces" },
  { value: "mobile_money", label: "Mobile money" },
  { value: "virement", label: "Virement bancaire" },
  { value: "cheque", label: "Chèque" }
];

const MOTIFS = [
  "Scolarité 1er trimestre",
  "Scolarité 2ème trimestre", 
  "Scolarité 3ème trimestre",
  "Frais d'inscription",
  "Frais de tenue",
  "Transport",
  "Cantine",
  "Autre"
];

export default function PaiementForm({ 
  initialData,
  onSubmit, 
  onCancel,
  isSubmitting = false 
}: PaiementFormProps) {
  const isEditMode = !!initialData;
  const { niveauSelectionne, cycleSelectionne } = useEcoleNiveau();
  const { eleves } = useEleves();
  
  const [formData, setFormData] = useState<PaiementFormData>(
    initialData ? {
      motif: initialData.motif || MOTIFS[0],
      motifPersonnalise: initialData.motifPersonnalise || "",
      montantPaye: initialData.montantPaye,
      montantRestant: initialData.montantRestant,
      statut: initialData.statut,
      modePaiement: initialData.modePaiement,
      datePayement: initialData.datePayement,
      inscriptions: initialData.inscriptionId ? [initialData.inscriptionId] : [],
      inscriptionId: initialData.inscriptionId
    } : {
      motif: MOTIFS[0],
      motifPersonnalise: "",
      montantPaye: 0,
      montantRestant: undefined,
      statut: "paye",
      modePaiement: "especes",
      datePayement: new Date().toISOString().split('T')[0],
      inscriptions: []
    }
  );

  const [classeSelectionnee, setClasseSelectionnee] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Réinitialiser montantRestant quand le statut change
  useEffect(() => {
    if (formData.statut !== 'partiellement') {
      setFormData(prev => ({ ...prev, montantRestant: undefined }));
    }
  }, [formData.statut]);

  // Filtrer les élèves selon les filtres globaux
  const elevesFiltres = useMemo(() => {
    return eleves.filter(ins => {
      const matchesNiveau = niveauSelectionne ? ins.niveauScolaire === niveauSelectionne : true;
      const matchesCycle = cycleSelectionne ? ins.cycle === cycleSelectionne : true;
      return matchesNiveau && matchesCycle;
    });
  }, [eleves, niveauSelectionne, cycleSelectionne]);

  // Extraire les classes disponibles
  const classesDisponibles = useMemo(() => {
    return [...new Set(elevesFiltres.map(e => e.classe).filter(Boolean))].sort();
  }, [elevesFiltres]);

  // En mode édition, on pré-sélectionne la classe
  useEffect(() => {
    if (isEditMode && initialData?.inscription) {
      const classe = initialData.inscription.classe;
      if (classe) setClasseSelectionnee(classe);
    }
  }, [isEditMode, initialData]);

  // Liste des élèves pour la classe choisie
  const elevesDeLaClasse = useMemo(() => {
    return classeSelectionnee 
      ? elevesFiltres.filter(e => e.classe === classeSelectionnee)
      : [];
  }, [classeSelectionnee, elevesFiltres]);

  const handleClasseChange = (classe: string) => {
    setClasseSelectionnee(classe);
    if (!isEditMode) {
      setFormData(prev => ({ ...prev, inscriptions: [] }));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (isEditMode) return;
    setFormData(prev => ({
      ...prev,
      inscriptions: checked ? elevesDeLaClasse.map(e => e.id) : []
    }));
  };

  const toggleEleve = (id: string) => {
    if (isEditMode) return;
    setFormData(prev => {
      const isSelected = prev.inscriptions.includes(id);
      const newInscriptions = isSelected
        ? prev.inscriptions.filter(i => i !== id)
        : [...prev.inscriptions, id];
      return { ...prev, inscriptions: newInscriptions };
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!isEditMode && !classeSelectionnee) {
      newErrors.classe = "Veuillez sélectionner une classe";
    }
    
    if (!isEditMode && formData.inscriptions.length === 0) {
      newErrors.inscriptions = "Veuillez sélectionner au moins un élève";
    }
    
    if (!formData.motif) newErrors.motif = "Le motif est requis";
    if (formData.motif === 'Autre' && !formData.motifPersonnalise) {
      newErrors.motifPersonnalise = "Veuillez préciser le motif";
    }
    if (formData.montantPaye <= 0) newErrors.montantPaye = "Le montant doit être supérieur à 0";
    if (!formData.datePayement) newErrors.datePayement = "La date est requise";
    
    if (formData.statut === 'partiellement' && (!formData.montantRestant || formData.montantRestant <= 0)) {
      newErrors.montantRestant = "Le montant restant doit être supérieur à 0";
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

  const total = formData.montantPaye * formData.inscriptions.length;
  const isAllSelected = elevesDeLaClasse.length > 0 && formData.inscriptions.length === elevesDeLaClasse.length;
  const eleveConcerne = isEditMode && initialData?.inscription;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      {/* Sélection de la classe */}
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

      {/* Sélection des élèves */}
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
                <span className="text-sm text-gray-700">Tous les élèves</span>
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
                          checked={formData.inscriptions.includes(eleve.id)}
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
            {errors.inscriptions && (
              <p className="mt-2 text-sm text-red-500">{errors.inscriptions}</p>
            )}
          </div>
        )
      )}

      {/* Détails du paiement */}
      {(formData.inscriptions.length > 0 || isEditMode) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            {isEditMode ? "Modifier" : "3. Détails du paiement"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Motif */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motif <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.motif}
                onChange={(e) => setFormData({ ...formData, motif: e.target.value, motifPersonnalise: "" })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.motif ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {MOTIFS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Motif personnalisé */}
            {formData.motif === 'Autre' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Précisez le motif <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.motifPersonnalise}
                  onChange={(e) => setFormData({ ...formData, motifPersonnalise: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.motifPersonnalise ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Achat de livres, Sortie scolaire, etc."
                />
                {errors.motifPersonnalise && (
                  <p className="mt-1 text-sm text-red-500">{errors.motifPersonnalise}</p>
                )}
              </div>
            )}

            {/* Montant payé */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Montant payé (FCFA) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.montantPaye}
                onChange={(e) => setFormData({ ...formData, montantPaye: parseInt(e.target.value) || 0 })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.montantPaye ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="paye">Payé</option>
                <option value="partiellement">Partiellement payé</option>
                <option value="impaye">Impayé</option>
              </select>
            </div>

            {/* Montant restant (apparaît si statut partiellement) */}
            {formData.statut === 'partiellement' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant restant (FCFA) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.montantRestant || ''}
                  onChange={(e) => setFormData({ ...formData, montantRestant: parseInt(e.target.value) || 0 })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    errors.montantRestant ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.montantRestant && (
                  <p className="mt-1 text-sm text-red-500">{errors.montantRestant}</p>
                )}
              </div>
            )}

            {/* Mode de paiement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode de paiement <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={formData.modePaiement}
                  onChange={(e) => setFormData({ ...formData, modePaiement: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {MODES_PAIEMENT.map(mode => (
                    <option key={mode.value} value={mode.value}>{mode.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de paiement <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.datePayement}
                onChange={(e) => setFormData({ ...formData, datePayement: e.target.value })}
                className={`w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.datePayement ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
          </div>

          {!isEditMode && (
            <div className="mt-4 p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{formData.inscriptions.length} élève(s)</span> ×{' '}
                <span className="font-medium">{new Intl.NumberFormat('fr-FR').format(formData.montantPaye)} FCFA</span>
              </p>
              <p className="text-xl font-bold text-primary mt-1">
                Total: {new Intl.NumberFormat('fr-FR').format(total)} FCFA
              </p>
            </div>
          )}
        </div>
      )}

      {/* Boutons */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? "Enregistrement..." : isEditMode ? "Mettre à jour" : "Enregistrer les paiements"}
        </button>
      </div>
    </form>
  );
}