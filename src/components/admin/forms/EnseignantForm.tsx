import { useState } from "react";
import { User, Mail, Phone, Users, BookOpen, ChevronRight, ChevronLeft } from "lucide-react";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import useClasses from "../../../hooks/classes/useClasses";
import useMatieres from "../../../hooks/matieres/useMatieres";
import useNiveauxClasses from "../../../hooks/niveauxClasses/useNiveauxClasses";

export interface EnseignantFormData {
  id?: string;
  nom: string;
  prenom: string;
  email?: string;
  tel?: string;
  enseignements: {
    classeId: string;
    matiereId: string;
  }[];
  photo?: string;
}

interface EnseignantFormProps {
  initialData?: EnseignantFormData;
  onSubmit: (data: EnseignantFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function EnseignantForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false
}: EnseignantFormProps) {
  const [step, setStep] = useState(1);
  const { niveauSelectionne, cycleSelectionne } = useEcoleNiveau();
  const { classes } = useClasses();
  const { matieres } = useMatieres();
  const { niveauxClasse } = useNiveauxClasses();

  // État pour les classes sélectionnées (étape 2)
  const [selectedClassesIds, setSelectedClassesIds] = useState<string[]>(
    initialData?.enseignements
      ? Array.from(new Set(initialData.enseignements.map(e => e.classeId)))
      : []
  );

  const [formData, setFormData] = useState<EnseignantFormData>(
    initialData || {
      nom: "",
      prenom: "",
      email: "",
      tel: "",
      enseignements: [],
      photo: ""
    }
  );

  const [errors, setErrors] = useState<Partial<Record<keyof EnseignantFormData, string>>>({});

  // Filtrage des classes selon les filtres d'en-tête (Ecole/Niveau)
  const classesFiltrees = classes.filter(c => {
    if (cycleSelectionne && c.cycle !== cycleSelectionne) return false;
    if (niveauSelectionne && c.niveauScolaire !== niveauSelectionne) return false;
    return true;
  });

  const validateStep1 = (): boolean => {
    const newErrors: Partial<Record<keyof EnseignantFormData, string>> = {};
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && selectedClassesIds.length > 0) {
      setStep(3);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep(step - 1);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // On ne soumet que si on est à l'étape 3 et qu'il y a des enseignements
    if (step === 3 && formData.enseignements.length > 0) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof EnseignantFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  // Gestion des classes (Étape 2)
  const toggleClasseSelection = (classeId: string) => {
    setSelectedClassesIds(prev => {
      const isSelected = prev.includes(classeId);
      if (isSelected) {
        // Supprimer aussi les matières liées à cette classe dans le formData
        setFormData(f => ({
          ...f,
          enseignements: f.enseignements.filter(e => e.classeId !== classeId)
        }));
        return prev.filter(id => id !== classeId);
      } else {
        return [...prev, classeId];
      }
    });
  };

  // Gestion des matières (Étape 3)
  const toggleEnseignement = (classeId: string, matiereId: string) => {
    setFormData(prev => {
      const existe = prev.enseignements.some(
        e => e.classeId === classeId && e.matiereId === matiereId
      );

      if (existe) {
        return {
          ...prev,
          enseignements: prev.enseignements.filter(
            e => !(e.classeId === classeId && e.matiereId === matiereId)
          )
        };
      } else {
        return {
          ...prev,
          enseignements: [...prev.enseignements, { classeId, matiereId }]
        };
      }
    });
  };

  const estMatiereSelectionnee = (classeId: string, matiereId: string) => {
    return formData.enseignements.some(
      e => e.classeId === classeId && e.matiereId === matiereId
    );
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 p-4">
      {/* Barre de progression */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? "Modifier l'enseignant" : "Nouvel enseignant"}
          </h2>
          <p className="text-sm text-gray-500">Étape {step} sur 3</p>
        </div>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium transition-colors ${step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-10 h-0.5 ${step > s ? 'bg-primary' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Étape 1: Informations Personnelles */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <User size={20} className="text-primary" /> Informations personnelles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nom <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => handleChange("nom", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none transition-all ${errors.nom ? 'border-red-500' : 'border-gray-300 focus:border-primary'
                  }`}
                placeholder="Ex: DUPONT"
              />
              {errors.nom && <p className="text-xs text-red-500 font-medium">{errors.nom}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Prénom <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) => handleChange("prenom", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 outline-none transition-all ${errors.prenom ? 'border-red-500' : 'border-gray-300 focus:border-primary'
                  }`}
                placeholder="Ex: Jean"
              />
              {errors.prenom && <p className="text-xs text-red-500 font-medium">{errors.prenom}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="jean.dupont@ecole.tg"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Téléphone</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={formData.tel}
                  onChange={(e) => handleChange("tel", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="+228 90 00 00 00"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Étape 2: Sélection des Classes */}
      {/* Étape 2: Sélection des Classes */}
      {step === 2 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Users size={20} className="text-primary" /> Sélectionner les classes
          </h3>
          <p className="text-sm text-gray-500 italic">Cliquez sur les classes pour les attribuer à l'enseignant.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {classesFiltrees.map(classe => {
              // Correction ici : ajout de l'espace entre const et isSelected
              const isSelected = selectedClassesIds.includes(classe.id);
              return (
                <button
                  key={classe.id}
                  type="button"
                  onClick={() => toggleClasseSelection(classe.id)}
                  className={`p-4 border-2 rounded-xl text-left transition-all hover:shadow-md active:scale-95 ${isSelected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-gray-100 bg-gray-50/50 hover:border-gray-300'
                    }`}
                >
                  <p className={`font-bold ${isSelected ? 'text-primary' : 'text-gray-700'}`}>{classe.nom}</p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-tight">{classe.niveauClasse}</p>
                </button>
              );
            })}
          </div>

          {selectedClassesIds.length === 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-700 font-medium text-center">
                ⚠️ Sélectionnez au moins une classe pour passer à l'étape suivante.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Étape 3: Attribution des Matières */}
      {step === 3 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <BookOpen size={20} className="text-primary" /> Matières par classe
          </h3>

          <div className="space-y-8">
            {classesFiltrees
              .filter(c => selectedClassesIds.includes(c.id))
              .map(classe => {
                const matieresDisponibles = matieres.filter(m => m.niveauClasseId === classe.niveauClasseId);

                return (
                  <div key={classe.id} className="group border rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center group-hover:bg-gray-100 transition-colors">
                      <h4 className="font-bold text-gray-800">{classe.nom}</h4>
                      <span className="text-[10px] bg-white px-2 py-1 rounded-full border text-gray-500 font-bold uppercase">
                        Niveau ID: {classe.niveauClasseId}
                      </span>
                    </div>

                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {matieresDisponibles.map(matiere => (
                        <label
                          key={matiere.id}
                          className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${estMatiereSelectionnee(classe.id, matiere.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-100 hover:border-gray-200'
                            }`}
                        >
                          <input
                            type="checkbox"
                            checked={estMatiereSelectionnee(classe.id, matiere.id)}
                            onChange={() => toggleEnseignement(classe.id, matiere.id)}
                            className="w-5 h-5 rounded text-primary border-gray-300 focus:ring-primary"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-700">{matiere.nom}</span>
                            <span className="text-[10px] text-gray-500">Coeff: {matiere.coefficient}</span>
                          </div>
                        </label>
                      ))}
                      {matieresDisponibles.length === 0 && (
                        <p className="col-span-full text-xs text-gray-400 italic py-2">
                          Aucune matière trouvée pour ce niveau dans la base de données.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          {formData.enseignements.length === 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-center">
              <p className="text-sm text-amber-700 font-medium">
                Veuillez cocher au moins une matière dans l'une des classes.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Navigation - Boutons du bas */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={step === 1 ? onCancel : handlePrev}
          className="flex items-center gap-2 px-6 py-2.5 font-semibold text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all active:scale-95"
        >
          {step === 1 ? 'Annuler' : <><ChevronLeft size={18} /> Précédent</>}
        </button>

        {step < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={step === 2 && selectedClassesIds.length === 0}
            className="flex items-center gap-2 px-8 py-2.5 font-bold text-white bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            Suivant <ChevronRight size={18} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting || formData.enseignements.length === 0}
            className="flex items-center gap-2 px-10 py-2.5 font-bold text-white bg-primary rounded-xl hover:bg-primary/90 disabled:opacity-50 shadow-lg shadow-primary/30 transition-all active:scale-95"
          >
            {isSubmitting ? "Enregistrement..." : initialData ? "Mettre à jour" : "Finaliser l'inscription"}
          </button>
        )}
      </div>
    </form>
  );
}