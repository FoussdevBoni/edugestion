// src/components/admin/forms/EleveForm.tsx
import { useState, useEffect } from "react";
import { User, BookOpen, ChevronDown, AlertCircle } from "lucide-react";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import useClasses from "../../../hooks/classes/useClasses";
import usePeriodes from "../../../hooks/periodes/usePeriodes";

export interface VieScolaireItem {
  periodeId: string;
  score: {
    absences: number;
    retards: number;
    conduite: number;
  };
}

export interface EleveFormData {
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: "M" | "F";
  matricule?: string;
  lieuDeNaissance?: string;
  contact?: string;
  photo?: string;
  anneeScolaire: string;
  statutScolaire: "nouveau" | "redoublant";
  classeId: string;
  vieScolaire?: VieScolaireItem[];
  niveauScolaireId?: string;
  cycleId?: string;
  niveauClasseId?: string;
}

interface EleveFormProps {
  initialData?: EleveFormData;
  onSubmit: (data: EleveFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function EleveForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false 
}: EleveFormProps) {
  const { niveauSelectionne, cycleSelectionne } = useEcoleNiveau();
  const { classes } = useClasses();
  const { periodes } = usePeriodes();
  
  const [formData, setFormData] = useState<EleveFormData>(
    initialData || {
      nom: "",
      prenom: "",
      dateNaissance: "",
      sexe: "M",
      matricule: "",
      lieuDeNaissance: "",
      contact: "",
      photo: "",
      anneeScolaire: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
      statutScolaire: "nouveau",
      classeId: "",
      vieScolaire: [],
      niveauScolaireId: "",
      cycleId: "",
      niveauClasseId: ""
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof EleveFormData, string>>>({});

  const classeSelectionnee = classes.find(c => c.id === formData.classeId);

  useEffect(() => {
    if (classeSelectionnee) {
      setFormData(prev => ({ ...prev }));
    }
  }, [formData.classeId]);

  useEffect(() => {
    if (!initialData && (niveauSelectionne || cycleSelectionne)) {
      const classeFiltree = classes.find(c => {
        const niveauOk = niveauSelectionne ? c.niveauScolaire === niveauSelectionne : true;
        const cycleOk = cycleSelectionne ? c.cycle === cycleSelectionne : true;
        return niveauOk && cycleOk;
      });
      
      if (classeFiltree) {
        setFormData(prev => ({ ...prev, classeId: classeFiltree.id }));
      }
    }
  }, [niveauSelectionne, cycleSelectionne, initialData, classes]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EleveFormData, string>> = {};

    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.dateNaissance) newErrors.dateNaissance = "La date de naissance est requise";
    if (!formData.classeId) newErrors.classeId = "La classe est requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof EleveFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleVieScolaireChange = (periodeId: string, field: "absences" | "retards" | "conduite", value: number) => {
    const vieScolaire = [...(formData.vieScolaire || [])];
    const existingIndex = vieScolaire.findIndex(v => v.periodeId === periodeId);
    
    if (existingIndex >= 0) {
      vieScolaire[existingIndex].score[field] = value;
    } else {
      vieScolaire.push({
        periodeId,
        score: { absences: 0, retards: 0, conduite: 0, [field]: value }
      });
    }
    
    setFormData(prev => ({ ...prev, vieScolaire }));
  };

  const getVieScolaireValue = (periodeId: string, field: "absences" | "retards" | "conduite"): number => {
    const item = formData.vieScolaire?.find(v => v.periodeId === periodeId);
    return item?.score[field] || 0;
  };

  const periodesFiltrees = periodes.filter(p => {
    if (niveauSelectionne && p.niveauScolaire !== niveauSelectionne) return false;
    return true;
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          {initialData ? "Modifier l'élève" : "Nouvel élève"}
        </h2>
        {!initialData && (niveauSelectionne || cycleSelectionne) && (
          <div className="text-sm text-gray-500">
            Classe pré-sélectionnée d'après vos filtres
          </div>
        )}
      </div>

      {/* Informations personnelles */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <User size={20} className="text-primary" />
          Informations personnelles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => handleChange("nom", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.nom ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nom"
            />
            {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) => handleChange("prenom", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.prenom ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Prénom"
            />
            {errors.prenom && <p className="mt-1 text-sm text-red-500">{errors.prenom}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matricule
            </label>
            <input
              type="text"
              value={formData.matricule}
              onChange={(e) => handleChange("matricule", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Matricule"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de naissance <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.dateNaissance}
              onChange={(e) => handleChange("dateNaissance", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.dateNaissance ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dateNaissance && <p className="mt-1 text-sm text-red-500">{errors.dateNaissance}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lieu de naissance
            </label>
            <input
              type="text"
              value={formData.lieuDeNaissance}
              onChange={(e) => handleChange("lieuDeNaissance", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Lieu de naissance"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sexe
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="M"
                  checked={formData.sexe === "M"}
                  onChange={(e) => handleChange("sexe", e.target.value as "M" | "F")}
                  className="text-primary"
                />
                <span>Masculin</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="F"
                  checked={formData.sexe === "F"}
                  onChange={(e) => handleChange("sexe", e.target.value as "M" | "F")}
                  className="text-primary"
                />
                <span>Féminin</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact
            </label>
            <input
              type="text"
              value={formData.contact}
              onChange={(e) => handleChange("contact", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Téléphone du parent"
            />
          </div>
        </div>
      </div>

      {/* Inscription */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen size={20} className="text-primary" />
          Inscription scolaire
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Année scolaire
            </label>
            <input
              type="text"
              value={formData.anneeScolaire}
              onChange={(e) => handleChange("anneeScolaire", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="2024-2025"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <div className="relative">
              <select
                value={formData.statutScolaire}
                onChange={(e) => handleChange("statutScolaire", e.target.value as "nouveau" | "redoublant")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg appearance-none"
              >
                <option value="nouveau">Nouveau</option>
                <option value="redoublant">Redoublant</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Classe <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.classeId}
                onChange={(e) => handleChange("classeId", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg appearance-none ${
                  errors.classeId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner une classe</option>
                {classes
                  .filter(c => {
                    if (niveauSelectionne && c.niveauScolaire !== niveauSelectionne) return false;
                    if (cycleSelectionne && c.cycle !== cycleSelectionne) return false;
                    return true;
                  })
                  .map(classe => (
                    <option key={classe.id} value={classe.id}>
                      {classe.nom} - {classe.niveauClasse} ({classe.cycle})
                    </option>
                  ))
                }
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.classeId && <p className="mt-1 text-sm text-red-500">{errors.classeId}</p>}
          </div>
        </div>
      </div>

      {/* Vie scolaire */}
      {periodesFiltrees.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-primary" />
            Vie scolaire
          </h3>

          <div className="space-y-4">
            {periodesFiltrees.map(periode => (
              <div key={periode.id} className="border border-gray-100 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-3">{periode.nom}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Absences 
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={getVieScolaireValue(periode.id, "absences")}
                      onChange={(e) => handleVieScolaireChange(periode.id, "absences", parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Retards
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={getVieScolaireValue(periode.id, "retards")}
                      onChange={(e) => handleVieScolaireChange(periode.id, "retards", parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Note de conduite /20
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      value={getVieScolaireValue(periode.id, "conduite")}
                      onChange={(e) => handleVieScolaireChange(periode.id, "conduite", parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Boutons */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? "Enregistrement..." : "Inscrire l'élève"}
        </button>
      </div>
    </form>
  );
}