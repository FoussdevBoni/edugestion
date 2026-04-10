// src/components/forms/InscriptionForm.tsx
import { useState, useEffect } from "react";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import useClasses from "../../../hooks/classes/useClasses";
import { BaseInscription } from "../../../utils/types/base";

export interface InscriptionFormData {
  id?: string;
  anneeScolaire: string;
  dateInscription: string;
  statutScolaire: BaseInscription['statutScolaire'];
  classeId: string;
  classe: string;
  niveauClasse: string;
  cycle: string;
  niveauScolaire: string;
  // Données de l'élève
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: "M" | "F";
  photo?: string;
  matricule?: string;
  lieuDeNaissance: string;
  contact: string;
}

interface InscriptionFormProps {
  initialData?: InscriptionFormData;
  onSubmit: (data: InscriptionFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function InscriptionForm({ 
  initialData, 
  onSubmit, 
  onCancel,
  isSubmitting = false 
}: InscriptionFormProps) {
  const { niveauSelectionne, cycleSelectionne } = useEcoleNiveau();
   const {classes} = useClasses()
  const [formData, setFormData] = useState<InscriptionFormData>(
    initialData || {
      anneeScolaire: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
      dateInscription: new Date().toISOString().split('T')[0],
      statutScolaire: "nouveau",
      classeId: "",
      classe: "",
      niveauClasse: "",
      cycle: "",
      niveauScolaire: "",
      nom: "",
      prenom: "",
      dateNaissance: "",
      sexe: "M",
      lieuDeNaissance: "",
      contact: "",
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof InscriptionFormData, string>>>({});

  // Filtrer les classes selon les filtres globaux
  const classesDisponibles = classes.filter(classe => {
    const matchesNiveau = niveauSelectionne ? classe.niveauScolaire === niveauSelectionne : true;
    const matchesCycle = cycleSelectionne ? classe.cycle === cycleSelectionne : true;
    return matchesNiveau && matchesCycle;
  });

  // Mettre à jour les infos quand la classe change
  useEffect(() => {
    if (formData.classeId) {
      const classe = classes.find(c => c.id === formData.classeId);
      if (classe) {
        setFormData(prev => ({ 
          ...prev, 
          classe: classe.nom,
          niveauClasse: classe.niveauClasse,
          cycle: classe.cycle,
          niveauScolaire: classe.niveauScolaire
        }));
      }
    }
  }, [formData.classeId]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof InscriptionFormData, string>> = {};

    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.dateNaissance) newErrors.dateNaissance = "La date de naissance est requise";
    if (!formData.lieuDeNaissance.trim()) newErrors.lieuDeNaissance = "Le lieu de naissance est requis";
    if (!formData.contact.trim()) newErrors.contact = "Le contact est requis";
    if (!formData.classeId) newErrors.classeId = "La classe est requise";
    if (!formData.anneeScolaire.trim()) newErrors.anneeScolaire = "L'année scolaire est requise";
    if (!formData.dateInscription) newErrors.dateInscription = "La date d'inscription est requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof InscriptionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Grouper les classes par niveau scolaire et cycle
  const classesParHierarchie = classesDisponibles.reduce((acc, classe) => {
    const key = `${classe.niveauScolaire} - ${classe.cycle}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(classe);
    return acc;
  }, {} as Record<string, typeof classesDisponibles>);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full"></span>
          Informations de l'élève
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
              placeholder="Prénom de l'élève"
            />
            {errors.prenom && <p className="mt-1 text-sm text-red-500">{errors.prenom}</p>}
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
            {errors.dateNaissance && <p className="mt-1 text-sm text-red-500">{errors.dateNaissance}</p>}
          </div>

          {/* Lieu de naissance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lieu de naissance <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.lieuDeNaissance}
              onChange={(e) => handleChange("lieuDeNaissance", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.lieuDeNaissance ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ville de naissance"
            />
            {errors.lieuDeNaissance && <p className="mt-1 text-sm text-red-500">{errors.lieuDeNaissance}</p>}
          </div>

          {/* Sexe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sexe <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="M"
                  checked={formData.sexe === "M"}
                  onChange={(e) => handleChange("sexe", e.target.value)}
                  className="text-primary focus:ring-primary"
                />
                <span>Masculin</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="F"
                  checked={formData.sexe === "F"}
                  onChange={(e) => handleChange("sexe", e.target.value)}
                  className="text-primary focus:ring-primary"
                />
                <span>Féminin</span>
              </label>
            </div>
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.contact}
              onChange={(e) => handleChange("contact", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.contact ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Numéro de téléphone"
            />
            {errors.contact && <p className="mt-1 text-sm text-red-500">{errors.contact}</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full"></span>
          Informations d'inscription
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Année scolaire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Année scolaire <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.anneeScolaire}
              onChange={(e) => handleChange("anneeScolaire", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.anneeScolaire ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="2024-2025"
            />
            {errors.anneeScolaire && <p className="mt-1 text-sm text-red-500">{errors.anneeScolaire}</p>}
          </div>

          {/* Date d'inscription */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date d'inscription <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.dateInscription}
              onChange={(e) => handleChange("dateInscription", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.dateInscription ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dateInscription && <p className="mt-1 text-sm text-red-500">{errors.dateInscription}</p>}
          </div>

          {/* Statut scolaire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut scolaire <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.statutScolaire}
              onChange={(e) => handleChange("statutScolaire", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="nouveau">Nouveau</option>
              <option value="redoublant">Redoublant</option>
              <option value="transfert">Transfert</option>
            </select>
          </div>

          {/* Classe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Classe <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.classeId}
              onChange={(e) => handleChange("classeId", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.classeId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionner une classe</option>
              {Object.entries(classesParHierarchie).map(([hierarchie, classesList]) => (
                <optgroup key={hierarchie} label={hierarchie}>
                  {classesList.map(classe => (
                    <option key={classe.id} value={classe.id}>
                      {classe.nom}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {errors.classeId && <p className="mt-1 text-sm text-red-500">{errors.classeId}</p>}
          </div>
        </div>

        {/* Aperçu de la hiérarchie */}
        {formData.classe && (
          <div className="mt-4 bg-gray-50 rounded-lg p-3 text-sm">
            <p className="text-gray-700">
              <span className="font-medium">Classe :</span> {formData.classe}
            </p>
            <p className="text-gray-700 mt-1">
              <span className="font-medium">Niveau :</span> {formData.niveauClasse} • {formData.cycle} • {formData.niveauScolaire}
            </p>
          </div>
        )}
      </div>

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
          {isSubmitting ? "Enregistrement..." : initialData ? "Mettre à jour" : "Créer l'inscription"}
        </button>
      </div>
    </form>
  );
}