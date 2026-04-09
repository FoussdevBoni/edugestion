import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import useNiveauxClasses from "../../../hooks/niveauxClasses/useNiveauxClasses";
import Input from "../../ui/NumberInput";

export interface ClasseFormData {
  id?: string;
  nom: string;
  niveauClasseId: string;
  niveauClasse: string;
  cycle: string;
  niveauScolaire: string;
  effectifF: number;
  effectifM: number;
}

interface ClasseFormProps {
  initialData?: ClasseFormData;
  onSubmit: (data: ClasseFormData[]) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface ClasseLigne {
  id: string;
  nom: string;
  effectifF: number;
  effectifM: number;
}

export default function ClasseForm({ initialData, onSubmit, onCancel, isSubmitting = false }: ClasseFormProps) {
  const { niveauxClasse } = useNiveauxClasses();
  const isUpdate = !!initialData;
  
  const [mode, setMode] = useState<"simple" | "multiple" | "dynamique">("simple");
  
  // Mode simple (une seule classe)
  const [formData, setFormData] = useState<ClasseFormData>(
    initialData || { 
      nom: "", 
      niveauClasseId: "", 
      niveauClasse: "", 
      cycle: "", 
      niveauScolaire: "",
      effectifF: 0,
      effectifM: 0
    }
  );

  // Mode dynamique (plusieurs classes avec leurs effectifs)
  const [lignes, setLignes] = useState<ClasseLigne[]>([
    { id: Date.now().toString(), nom: "", effectifF: 0, effectifM: 0 }
  ]);

  const [errors, setErrors] = useState<{ nom?: string; niveauClasseId?: string }>({});

  useEffect(() => {
    if (formData.niveauClasseId) {
      const niveau = niveauxClasse.find(n => n.id === formData.niveauClasseId);
      if (niveau) {
        setFormData(prev => ({ 
          ...prev, 
          niveauClasse: niveau.nom,
          cycle: niveau.cycle,
          niveauScolaire: niveau.niveauScolaire 
        }));
      }
    }
  }, [formData.niveauClasseId, niveauxClasse]);

  const ajouterLigne = () => {
    setLignes([...lignes, { id: Date.now().toString(), nom: "", effectifF: 0, effectifM: 0 }]);
  };

  const supprimerLigne = (id: string) => {
    if (lignes.length > 1) {
      setLignes(lignes.filter(ligne => ligne.id !== id));
    }
  };

  const mettreAJourLigne = (id: string, champ: keyof ClasseLigne, valeur: string | number) => {
    setLignes(lignes.map(ligne => 
      ligne.id === id ? { ...ligne, [champ]: valeur } : ligne
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation commune
    if (!formData.niveauClasseId) {
      setErrors({ niveauClasseId: "Le niveau est obligatoire" });
      return;
    }

    if (isUpdate) {
      onSubmit([formData]);
      return;
    }

    // Mode simple
    if (mode === "simple") {
      if (!formData.nom.trim()) {
        setErrors({ nom: "Le nom est obligatoire" });
        return;
      }
      onSubmit([formData]);
      return;
    }

    // Mode multiple (A, B, C)
    if (mode === "multiple") {
      const segments = formData.nom.split(",").map(s => s.trim()).filter(s => s !== "");
      if (segments.length === 0) {
        setErrors({ nom: "Veuillez entrer au moins une division" });
        return;
      }
      const classesAcreer: ClasseFormData[] = segments.map(seg => ({
        ...formData,
        nom: `${formData.niveauClasse} ${seg}`,
        effectifF: 0,
        effectifM: 0
      }));
      onSubmit(classesAcreer);
      return;
    }

    // Mode dynamique
    if (mode === "dynamique") {
      const lignesValides = lignes.filter(ligne => ligne.nom.trim() !== "");
      if (lignesValides.length === 0) {
        alert("Veuillez ajouter au moins une classe");
        return;
      }
      const classesAcreer: ClasseFormData[] = lignesValides.map(ligne => ({
        ...formData,
        nom: ligne.nom.trim(),
        effectifF: ligne.effectifF,
        effectifM: ligne.effectifM
      }));
      onSubmit(classesAcreer);
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6">
      {!isUpdate && (
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <p className="text-blue-800 text-sm font-bold mb-2">📝 Choisissez votre méthode</p>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setMode("simple")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${mode === "simple" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
            >
              🔹 Simple
            </button>
            <button
              type="button"
              onClick={() => setMode("multiple")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${mode === "multiple" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
            >
              🔸 Multiple (A, B, C)
            </button>
            <button
              type="button"
              onClick={() => setMode("dynamique")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition ${mode === "dynamique" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
            >
              📊 Dynamique (classe + effectifs)
            </button>
          </div>
        </div>
      )}

      {/* Niveau de classe (commun aux 3 modes) */}
      <div>
        <label className="block text-gray-700 font-bold mb-2 text-sm uppercase">Niveau de classe</label>
        <select
          value={formData.niveauClasseId}
          onChange={(e) => setFormData({...formData, niveauClasseId: e.target.value})}
          className={`w-full p-3 border-2 rounded-xl outline-none transition ${errors.niveauClasseId ? 'border-red-500' : 'border-gray-100 focus:border-primary'}`}
        >
          <option value="">-- Sélectionner --</option>
          {niveauxClasse.map(n => <option key={n.id} value={n.id}>{n.nom}</option>)}
        </select>
        {errors.niveauClasseId && <p className="text-red-500 text-xs mt-1">{errors.niveauClasseId}</p>}
      </div>

      {/* Mode SIMPLE */}
      {mode === "simple" && !isUpdate && (
        <div>
          <label className="block text-gray-700 font-bold mb-2 text-sm uppercase">Nom de la classe</label>
          <Input
            type="text"
            value={formData.nom}
            onChange={(e) => setFormData({...formData, nom: e.target.value})}
            className={`w-full p-3 border-2 rounded-xl outline-none transition ${errors.nom ? 'border-red-500' : 'border-gray-100 focus:border-primary'}`}
            placeholder="Ex: 6ème A"
          />
          {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm uppercase">Effectif Filles</label>
              <Input
                type="number"
                min="0"
                value={formData.effectifF}
                onChange={(e) => setFormData({...formData, effectifF: parseInt(e.target.value) || 0})}
                className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm uppercase">Effectif Garçons</label>
              <Input
                type="number"
                min="0"
                value={formData.effectifM}
                onChange={(e) => setFormData({...formData, effectifM: parseInt(e.target.value) || 0})}
                className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mode MULTIPLE (A, B, C) */}
      {mode === "multiple" && !isUpdate && (
        <div>
          <label className="block text-gray-700 font-bold mb-2 text-sm uppercase">Divisions (séparées par des virgules)</label>
          <Input
            type="text"
            value={formData.nom}
            onChange={(e) => setFormData({...formData, nom: e.target.value})}
            className={`w-full p-3 border-2 rounded-xl outline-none transition ${errors.nom ? 'border-red-500' : 'border-gray-100 focus:border-primary'}`}
            placeholder="A, B, C"
          />
          {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
          <div className="bg-yellow-50 p-3 rounded-xl mt-4">
            <p className="text-yellow-700 text-sm">⚠️ Les effectifs seront à 0 par défaut. Vous pourrez les modifier après.</p>
          </div>
        </div>
      )}

      {/* Mode DYNAMIQUE (classe + effectifs) */}
      {mode === "dynamique" && !isUpdate && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-gray-700 font-bold text-sm uppercase">Classes et effectifs</label>
            <button
              type="button"
              onClick={ajouterLigne}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <Plus size={16} /> Ajouter une classe
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {lignes.map((ligne, index) => (
              <div key={ligne.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-bold text-gray-500">Classe #{index + 1}</span>
                  {lignes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => supprimerLigne(ligne.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-gray-600 text-xs font-bold mb-1">Nom de la classe</label>
                    <Input
                      type="text"
                      value={ligne.nom}
                      onChange={(e) => mettreAJourLigne(ligne.id, "nom", e.target.value)}
                      className="w-full p-2 border-2 border-gray-200 rounded-lg outline-none focus:border-primary"
                      placeholder={`Ex: ${formData.niveauClasse} A`}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-600 text-xs font-bold mb-1">Effectif Filles</label>
                      <Input
                        type="number"
                        min="0"
                        value={ligne.effectifF}
                        onChange={(e) => mettreAJourLigne(ligne.id, "effectifF", parseInt(e.target.value) || 0)}
                        className="w-full p-2 border-2 border-gray-200 rounded-lg outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-xs font-bold mb-1">Effectif Garçons</label>
                      <Input
                        type="number"
                        min="0"
                        value={ligne.effectifM}
                        onChange={(e) => mettreAJourLigne(ligne.id, "effectifM", parseInt(e.target.value) || 0)}
                        className="w-full p-2 border-2 border-gray-200 rounded-lg outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-500">
                    Total: {(ligne.effectifF || 0) + (ligne.effectifM || 0)} élèves
                  </div>
                </div>
              </div>
            ))}
          </div>

          {lignes.filter(l => l.nom.trim()).length > 0 && (
            <div className="bg-green-50 p-3 rounded-xl">
              <p className="text-green-700 text-sm">
                ✅ {lignes.filter(l => l.nom.trim()).length} classe(s) à créer
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mode UPDATE (modification d'une classe existante) */}
      {isUpdate && (
        <div>
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm uppercase">Nom de la classe</label>
            <Input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-primary"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm uppercase">Effectif Filles</label>
              <Input
                type="number"
                min="0"
                value={formData.effectifF}
                onChange={(e) => setFormData({...formData, effectifF: parseInt(e.target.value) || 0})}
                className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm uppercase">Effectif Garçons</label>
              <Input
                type="number"
                min="0"
                value={formData.effectifM}
                onChange={(e) => setFormData({...formData, effectifM: parseInt(e.target.value) || 0})}
                className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* Total général pour mode dynamique */}
      {mode === "dynamique" && !isUpdate && lignes.length > 0 && (
        <div className="bg-gray-100 p-4 rounded-xl">
          <h4 className="font-bold text-gray-700 mb-2">Récapitulatif</h4>
          <div className="space-y-1 text-sm">
            <p>📚 Total classes : {lignes.filter(l => l.nom.trim()).length}</p>
            <p>👧 Total effectif filles : {lignes.reduce((acc, l) => acc + (l.effectifF || 0), 0)}</p>
            <p>👦 Total effectif garçons : {lignes.reduce((acc, l) => acc + (l.effectifM || 0), 0)}</p>
            <p className="font-bold">📊 Total élèves : {lignes.reduce((acc, l) => acc + (l.effectifF || 0) + (l.effectifM || 0), 0)}</p>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-4 pt-6 border-t">
        <button type="button" onClick={onCancel} className="px-6 py-2 text-gray-400 font-bold">Annuler</button>
        <button type="submit" disabled={isSubmitting} className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20">
          {isSubmitting ? "Patientez..." : isUpdate ? "Mettre à jour" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}