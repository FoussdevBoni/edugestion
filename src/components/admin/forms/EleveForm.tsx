import { useState, useEffect } from "react";
import { User, BookOpen, ChevronDown } from "lucide-react";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";

// Interface pour les données du formulaire
export interface EleveFormData {
  id?: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: "M" | "F";
  photo?: string;
  niveauScolaire: string;
  cycle: string;
  classe: string;
  section: string;
  anneeScolaire: string;
}

interface EleveFormProps {
  initialData?: EleveFormData;
  onSubmit: (data: EleveFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// Données fictives des niveaux et cycles (à remplacer par les données réelles de la config)
const niveauxScolaires = [
  {
    nom: "Préscolaire",
    cycles: [
      {
        nom: "Maternelle",
        classes: [
          { nom: "Petite section", sections: [""] },
          { nom: "Moyenne section", sections: [""] },
          { nom: "Grande section", sections: [""] }
        ]
      }
    ]
  },
  {
    nom: "Primaire",
    cycles: [
      {
        nom: "Primaire",
        classes: [
          { nom: "CP1", sections: ["A", "B"] },
          { nom: "CP2", sections: ["A", "B"] },
          { nom: "CE1", sections: ["A", "B"] },
          { nom: "CE2", sections: ["A", "B"] },
          { nom: "CM1", sections: ["A", "B"] },
          { nom: "CM2", sections: ["A", "B"] }
        ]
      }
    ]
  },
  {
    nom: "Secondaire",
    cycles: [
      {
        nom: "1er cycle (Collège)",
        classes: [
          { nom: "6ème", sections: ["A", "B", "C"] },
          { nom: "5ème", sections: ["A", "B", "C"] },
          { nom: "4ème", sections: ["A", "B", "C"] },
          { nom: "3ème", sections: ["A", "B", "C"] }
        ]
      },
      {
        nom: "2ème cycle (Lycée)",
        classes: [
          { nom: "2nde", sections: ["A", "B", "C", "D"] },
          { nom: "1ère", sections: ["A", "B", "C", "D"] },
          { nom: "Terminale", sections: ["A", "B", "C", "D", "S"] }
        ]
      }
    ]
  }
];

export default function EleveForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false 
}: EleveFormProps) {
  const { niveauSelectionne, cycleSelectionne } = useEcoleNiveau();
  
  const [formData, setFormData] = useState<EleveFormData>(
    initialData || {
      nom: "",
      prenom: "",
      dateNaissance: "",
      sexe: "M",
      photo: "",
      niveauScolaire: niveauSelectionne || "",
      cycle: cycleSelectionne || "",
      classe: "",
      section: "",
      anneeScolaire: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1)
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof EleveFormData, string>>>({});

  // Mettre à jour le formulaire quand les filtres globaux changent
  useEffect(() => {
    if (!initialData) { // Seulement en mode création
      setFormData(prev => ({
        ...prev,
        niveauScolaire: niveauSelectionne || prev.niveauScolaire,
        cycle: cycleSelectionne || prev.cycle
      }));
    }
  }, [niveauSelectionne, cycleSelectionne, initialData]);

  // Obtenir les cycles disponibles pour le niveau sélectionné
  const cyclesDisponibles = niveauxScolaires.find(
    n => n.nom === formData.niveauScolaire
  )?.cycles || [];

  // Obtenir les classes disponibles pour le cycle sélectionné
  const classesDisponibles = cyclesDisponibles.find(
    c => c.nom === formData.cycle
  )?.classes || [];

  // Obtenir les sections disponibles pour la classe sélectionnée
  const sectionsDisponibles = classesDisponibles.find(
    c => c.nom === formData.classe
  )?.sections || [];

  // Réinitialiser les champs dépendants quand le niveau change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      cycle: "",
      classe: "",
      section: ""
    }));
  }, [formData.niveauScolaire]);

  // Réinitialiser les champs dépendants quand le cycle change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      classe: "",
      section: ""
    }));
  }, [formData.cycle]);

  // Réinitialiser la section quand la classe change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      section: ""
    }));
  }, [formData.classe]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EleveFormData, string>> = {};

    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.dateNaissance) newErrors.dateNaissance = "La date de naissance est requise";
    if (!formData.niveauScolaire) newErrors.niveauScolaire = "Le niveau scolaire est requis";
    if (!formData.cycle) newErrors.cycle = "Le cycle est requis";
    if (!formData.classe) newErrors.classe = "La classe est requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof EleveFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ quand l'utilisateur le modifie
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      {/* En-tête avec titre */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          {initialData ? "Modifier l'élève" : "Nouvel élève"}
        </h2>
        {!initialData && (niveauSelectionne || cycleSelectionne) && (
          <div className="text-sm text-gray-500">
            Pré-rempli avec les filtres actuels
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
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => handleChange("nom", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.nom ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nom de l'élève"
            />
            {errors.nom && (
              <p className="mt-1 text-sm text-red-500">{errors.nom}</p>
            )}
          </div>

          {/* Prénom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) => handleChange("prenom", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.prenom ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Prénom de l'élève"
            />
            {errors.prenom && (
              <p className="mt-1 text-sm text-red-500">{errors.prenom}</p>
            )}
          </div>

          {/* Date de naissance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de naissance <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.dateNaissance}
              onChange={(e) => handleChange("dateNaissance", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.dateNaissance ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dateNaissance && (
              <p className="mt-1 text-sm text-red-500">{errors.dateNaissance}</p>
            )}
          </div>

          {/* Sexe */}
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
                  className="text-primary focus:ring-primary"
                />
                <span>Masculin</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="F"
                  checked={formData.sexe === "F"}
                  onChange={(e) => handleChange("sexe", e.target.value as "M" | "F")}
                  className="text-primary focus:ring-primary"
                />
                <span>Féminin</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Informations scolaires */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen size={20} className="text-primary" />
          Informations scolaires
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Année scolaire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Année scolaire
            </label>
            <input
              type="text"
              value={formData.anneeScolaire}
              onChange={(e) => handleChange("anneeScolaire", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="2024-2025"
            />
          </div>

          {/* Niveau scolaire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Niveau scolaire <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.niveauScolaire}
                onChange={(e) => handleChange("niveauScolaire", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.niveauScolaire ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner un niveau</option>
                {niveauxScolaires.map(niveau => (
                  <option key={niveau.nom} value={niveau.nom}>
                    {niveau.nom}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.niveauScolaire && (
              <p className="mt-1 text-sm text-red-500">{errors.niveauScolaire}</p>
            )}
          </div>

          {/* Cycle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cycle <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.cycle}
                onChange={(e) => handleChange("cycle", e.target.value)}
                disabled={!formData.niveauScolaire}
                className={`w-full px-3 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  !formData.niveauScolaire ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
                } ${errors.cycle ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Sélectionner un cycle</option>
                {cyclesDisponibles.map(cycle => (
                  <option key={cycle.nom} value={cycle.nom}>
                    {cycle.nom}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.cycle && (
              <p className="mt-1 text-sm text-red-500">{errors.cycle}</p>
            )}
          </div>

          {/* Classe - Filtrée selon le niveau et cycle sélectionnés */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Classe <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.classe}
                onChange={(e) => handleChange("classe", e.target.value)}
                disabled={!formData.cycle}
                className={`w-full px-3 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  !formData.cycle ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
                } ${errors.classe ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Sélectionner une classe</option>
                {classesDisponibles.map(classe => (
                  <option key={classe.nom} value={classe.nom}>
                    {classe.nom}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.classe && (
              <p className="mt-1 text-sm text-red-500">{errors.classe}</p>
            )}
          </div>

          {/* Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <div className="relative">
              <select
                value={formData.section}
                onChange={(e) => handleChange("section", e.target.value)}
                disabled={!formData.classe || sectionsDisponibles.length === 0}
                className={`w-full px-3 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  !formData.classe || sectionsDisponibles.length === 0 
                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner une section</option>
                {sectionsDisponibles.map(section => section !== "" && (
                  <option key={section} value={section}>
                    Section {section}
                  </option>
                ))}
                {sectionsDisponibles.includes("") && (
                  <option value="">Sans section</option>
                )}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Messages d'aide contextuels */}
        {!initialData && niveauSelectionne && !formData.niveauScolaire && (
          <p className="mt-2 text-sm text-green-600">
            Le niveau "{niveauSelectionne}" est pré-sélectionné d'après vos filtres
          </p>
        )}
        {formData.niveauScolaire && !formData.cycle && (
          <p className="mt-2 text-sm text-amber-600">
            Veuillez sélectionner un cycle pour voir les classes disponibles
          </p>
        )}
      </div>

      {/* Boutons d'action */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Enregistrement..." : initialData ? "Mettre à jour" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}