import { useState, useEffect } from "react";
import { User, Mail, Phone, BookOpen, Users, X, Plus, ChevronDown } from "lucide-react";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";

// Interface pour les données du formulaire
export interface EnseignantFormData {
  id?: string;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  niveauScolaire: string;
  cycle: string;
  matieres: string[];
  classes: string[];
  photo?: string;
}

interface EnseignantFormProps {
  initialData?: EnseignantFormData;
  onSubmit: (data: EnseignantFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// Données complètes avec hiérarchie
const programmeScolaire = [
  {
    niveau: "Préscolaire",
    cycles: [
      {
        nom: "Maternelle",
        matieres: [
          "Éveil",
          "Psychomotricité",
          "Chant",
          "Dessin",
          "Langage"
        ],
        classes: [
          { nom: "Petite section", sections: [""] },
          { nom: "Moyenne section", sections: [""] },
          { nom: "Grande section", sections: [""] }
        ]
      }
    ]
  },
  {
    niveau: "Primaire",
    cycles: [
      {
        nom: "Primaire",
        matieres: [
          "Français",
          "Mathématiques",
          "Sciences",
          "Histoire-Géo",
          "EPS",
          "Éducation artistique",
          "Anglais"
        ],
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
    niveau: "Secondaire",
    cycles: [
      {
        nom: "1er cycle (Collège)",
        matieres: [
          "Français",
          "Mathématiques",
          "Physique-Chimie",
          "SVT",
          "Histoire-Géo",
          "Anglais",
          "EPS",
          "Éducation artistique",
          "Espagnol",
          "Allemand"
        ],
        classes: [
          { nom: "6ème", sections: ["A", "B", "C"] },
          { nom: "5ème", sections: ["A", "B", "C"] },
          { nom: "4ème", sections: ["A", "B", "C"] },
          { nom: "3ème", sections: ["A", "B", "C"] }
        ]
      },
      {
        nom: "2ème cycle (Lycée)",
        matieres: [
          "Français",
          "Mathématiques",
          "Physique-Chimie",
          "SVT",
          "Histoire-Géo",
          "Anglais",
          "Philosophie",
          "EPS",
          "Espagnol",
          "Allemand",
          "Éducation civique"
        ],
        classes: [
          { nom: "2nde", sections: ["A", "B", "C", "D"] },
          { nom: "1ère", sections: ["A", "B", "C", "D"] },
          { nom: "Terminale", sections: ["A", "B", "C", "D", "S"] }
        ]
      }
    ]
  }
];

export default function EnseignantForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false 
}: EnseignantFormProps) {
  const { niveauSelectionne, cycleSelectionne } = useEcoleNiveau();
  
  const [formData, setFormData] = useState<EnseignantFormData>(
    initialData || {
      nom: "",
      prenom: "",
      email: "",
      tel: "",
      niveauScolaire: niveauSelectionne || "",
      cycle: cycleSelectionne || "",
      matieres: [],
      classes: [],
      photo: ""
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof EnseignantFormData, string>>>({});
  const [matiereInput, setMatiereInput] = useState("");
  const [classeInput, setClasseInput] = useState("");
  const [showMatiereSuggestions, setShowMatiereSuggestions] = useState(false);
  const [showClasseSuggestions, setShowClasseSuggestions] = useState(false);

  // Mettre à jour le formulaire quand les filtres globaux changent
  useEffect(() => {
    if (!initialData) {
      setFormData(prev => ({
        ...prev,
        niveauScolaire: niveauSelectionne || prev.niveauScolaire,
        cycle: cycleSelectionne || prev.cycle
      }));
    }
  }, [niveauSelectionne, cycleSelectionne, initialData]);

  // Obtenir les cycles disponibles pour le niveau sélectionné
  const niveauChoisi = programmeScolaire.find(n => n.niveau === formData.niveauScolaire);
  const cyclesDisponibles = niveauChoisi?.cycles || [];

  // Obtenir le cycle choisi
  const cycleChoisi = cyclesDisponibles.find(c => c.nom === formData.cycle);

  // Matières disponibles selon le niveau et cycle
  const matieresDisponibles = cycleChoisi?.matieres || [];

  // Classes disponibles selon le niveau et cycle
  const classesDisponibles = cycleChoisi?.classes || [];

  // Réinitialiser quand le niveau change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      cycle: "",
      matieres: [],
      classes: []
    }));
  }, [formData.niveauScolaire]);

  // Réinitialiser quand le cycle change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      matieres: [],
      classes: []
    }));
  }, [formData.cycle]);

  // Filtrer les suggestions de matières
  const matieresSuggestions = matieresDisponibles.filter(
    m => m.toLowerCase().includes(matiereInput.toLowerCase()) && !formData.matieres.includes(m)
  );

  // Filtrer les suggestions de classes
  const classesSuggestions = classesDisponibles.filter(
    c => c.nom.toLowerCase().includes(classeInput.toLowerCase()) && !formData.classes.includes(c.nom)
  );

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EnseignantFormData, string>> = {};

    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    if (!formData.tel.trim()) newErrors.tel = "Le téléphone est requis";
    if (!formData.niveauScolaire) newErrors.niveauScolaire = "Le niveau scolaire est requis";
    if (!formData.cycle) newErrors.cycle = "Le cycle est requis";
    if (formData.matieres.length === 0) newErrors.matieres = "Au moins une matière est requise";
    if (formData.classes.length === 0) newErrors.classes = "Au moins une classe est requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof EnseignantFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const addMatiere = (matiere: string) => {
    if (!formData.matieres.includes(matiere)) {
      setFormData(prev => ({
        ...prev,
        matieres: [...prev.matieres, matiere]
      }));
    }
    setMatiereInput("");
    setShowMatiereSuggestions(false);
  };

  const removeMatiere = (matiere: string) => {
    setFormData(prev => ({
      ...prev,
      matieres: prev.matieres.filter(m => m !== matiere)
    }));
  };

  const addClasse = (classe: string) => {
    if (!formData.classes.includes(classe)) {
      setFormData(prev => ({
        ...prev,
        classes: [...prev.classes, classe]
      }));
    }
    setClasseInput("");
    setShowClasseSuggestions(false);
  };

  const removeClasse = (classe: string) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.filter(c => c !== classe)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          {initialData ? "Modifier l'enseignant" : "Nouvel enseignant"}
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
              placeholder="Nom de l'enseignant"
            />
            {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
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
              placeholder="Prénom de l'enseignant"
            />
            {errors.prenom && <p className="mt-1 text-sm text-red-500">{errors.prenom}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="email@ecole.tg"
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={formData.tel}
                onChange={(e) => handleChange("tel", e.target.value)}
                className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.tel ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+228 XX XX XX XX"
              />
            </div>
            {errors.tel && <p className="mt-1 text-sm text-red-500">{errors.tel}</p>}
          </div>
        </div>
      </div>

      {/* Affectation pédagogique */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen size={20} className="text-primary" />
          Affectation pédagogique
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                {programmeScolaire.map(niveau => (
                  <option key={niveau.niveau} value={niveau.niveau}>
                    {niveau.niveau}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {errors.niveauScolaire && <p className="mt-1 text-sm text-red-500">{errors.niveauScolaire}</p>}
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
            {errors.cycle && <p className="mt-1 text-sm text-red-500">{errors.cycle}</p>}
          </div>
        </div>

        {/* Message d'aide */}
        {formData.niveauScolaire && !formData.cycle && (
          <p className="mb-4 text-sm text-amber-600">
            Veuillez sélectionner un cycle pour voir les matières et classes disponibles
          </p>
        )}
      </div>

      {/* Matières enseignées */}
      {formData.cycle && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-primary" />
            Matières enseignées <span className="text-red-500">*</span>
          </h3>

          {/* Liste des matières sélectionnées */}
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.matieres.map(matiere => (
              <span
                key={matiere}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {matiere}
                <button
                  type="button"
                  onClick={() => removeMatiere(matiere)}
                  className="hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            {formData.matieres.length === 0 && (
              <span className="text-sm text-gray-400">Aucune matière sélectionnée</span>
            )}
          </div>

          {/* Ajout de matière */}
          {matieresDisponibles.length > 0 ? (
            <div className="relative">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={matiereInput}
                  onChange={(e) => {
                    setMatiereInput(e.target.value);
                    setShowMatiereSuggestions(true);
                  }}
                  onFocus={() => setShowMatiereSuggestions(true)}
                  placeholder="Rechercher une matière..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (matiereInput && !formData.matieres.includes(matiereInput)) {
                      addMatiere(matiereInput);
                    }
                  }}
                  className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Suggestions */}
              {showMatiereSuggestions && matiereInput && matieresSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {matieresSuggestions.map(matiere => (
                    <button
                      key={matiere}
                      type="button"
                      onClick={() => addMatiere(matiere)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                    >
                      {matiere}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aucune matière disponible pour ce cycle</p>
          )}
          {errors.matieres && <p className="mt-1 text-sm text-red-500">{errors.matieres}</p>}
        </div>
      )}

      {/* Classes attribuées */}
      {formData.cycle && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <Users size={20} className="text-primary" />
            Classes attribuées <span className="text-red-500">*</span>
          </h3>

          {/* Liste des classes sélectionnées */}
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.classes.map(classe => (
              <span
                key={classe}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {classe}
                <button
                  type="button"
                  onClick={() => removeClasse(classe)}
                  className="hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            {formData.classes.length === 0 && (
              <span className="text-sm text-gray-400">Aucune classe sélectionnée</span>
            )}
          </div>

          {/* Ajout de classe */}
          {classesDisponibles.length > 0 ? (
            <div className="relative">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={classeInput}
                  onChange={(e) => {
                    setClasseInput(e.target.value);
                    setShowClasseSuggestions(true);
                  }}
                  onFocus={() => setShowClasseSuggestions(true)}
                  placeholder="Rechercher une classe..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (classeInput && !formData.classes.includes(classeInput)) {
                      addClasse(classeInput);
                    }
                  }}
                  className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Suggestions */}
              {showClasseSuggestions && classeInput && classesSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {classesSuggestions.map(classe => (
                    <button
                      key={classe.nom}
                      type="button"
                      onClick={() => addClasse(classe.nom)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                    >
                      {classe.nom}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aucune classe disponible pour ce cycle</p>
          )}
          {errors.classes && <p className="mt-1 text-sm text-red-500">{errors.classes}</p>}
        </div>
      )}

      {/* Boutons d'action */}
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