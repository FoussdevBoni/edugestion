import { useState, useEffect } from "react";
import useNiveauxClasses from "../../../hooks/niveauxClasses/useNiveauxClasses";

export interface MatiereFormData {
  id?: string;
  nom: string;
  coefficient: number;
  niveauClasseId: string;
  niveauClasse: string;
}

interface MatiereFormProps {
  initialData?: MatiereFormData;
  onSubmit: (data: MatiereFormData[]) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function MatiereForm({ initialData, onSubmit, onCancel, isSubmitting = false }: MatiereFormProps) {
  const { niveauxClasse } = useNiveauxClasses();
  const isUpdate = !!initialData;

  const [selectedNiveauxIds, setSelectedNiveauxIds] = useState<string[]>([]);
  const [nomsMatieres, setNomsMatieres] = useState("");
  const [step, setStep] = useState(1);
  const [previewData, setPreviewData] = useState<MatiereFormData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");

  const [singleData, setSingleData] = useState<MatiereFormData>(
    initialData || { nom: "", coefficient: 1, niveauClasseId: "", niveauClasse: "" }
  );

  const handlePrepareAdjustment = () => {
    const noms = nomsMatieres.split(",").map(s => s.trim()).filter(s => s !== "");
    const list: MatiereFormData[] = [];
    selectedNiveauxIds.forEach(id => {
      const niv = niveauxClasse.find(n => n.id === id);
      noms.forEach(nom => {
        list.push({ nom, coefficient: 1, niveauClasseId: id, niveauClasse: niv?.nom || "" });
      });
    });
    setPreviewData(list);
    setActiveTab(selectedNiveauxIds[0]);
    setStep(2);
  };

  const handleUpdatePreviewCoef = (index: number, val: string) => {
    const cleanValue = val.replace(",", ".").replace(/[^0-9.]/g, "");
    const newList = [...previewData];
    newList[index].coefficient = cleanValue === "" ? 0 : parseFloat(cleanValue);
    setPreviewData(newList);
  };

  if (isUpdate) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); onSubmit([singleData]); }} className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={singleData.nom}
            onChange={(e) => setSingleData({ ...singleData, nom: e.target.value })}
            className="p-2 border rounded outline-none focus:border-primary"
            placeholder="Nom"
          />
          <input
            type="text"
            inputMode="decimal"
            value={singleData.coefficient === 0 ? "" : singleData.coefficient}
            onChange={(e) => {
              const val = e.target.value.replace(",", ".").replace(/[^0-9.]/g, "");
              setSingleData({ ...singleData, coefficient: val === "" ? 0 : parseFloat(val) });
            }}
            className="p-2 border rounded outline-none focus:border-primary"
            placeholder="Coef"
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={onCancel}>Annuler</button>
          <button type="submit" disabled={isSubmitting} className="bg-primary text-white px-4 py-2 rounded">
            {isSubmitting ? "..." : "Mettre à jour"}
          </button>
        </div>
      </form>
    );
  }

  if (step === 2) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex gap-2 overflow-x-auto border-b no-scrollbar">
          {selectedNiveauxIds.map(id => (
            <button
              key={`tab-${id}`}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`p-2 border-b-2 font-bold whitespace-nowrap ${activeTab === id ? "border-primary text-primary" : "border-transparent text-gray-400"}`}
            >
              {niveauxClasse.find(n => n.id === id)?.nom}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {previewData.map((item, idx) => {
            if (item.niveauClasseId !== activeTab) return null;
            return (
              <div key={`input-${item.niveauClasseId}-${item.nom}`} className="flex justify-between items-center p-3 border rounded bg-white">
                <span className="text-sm font-medium">{item.nom}</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={item.coefficient === 0 ? "" : item.coefficient}
                  onChange={(e) => handleUpdatePreviewCoef(idx, e.target.value)}
                  className="w-16 p-1 border rounded text-center font-bold text-primary outline-none focus:border-primary"
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-end gap-4 border-t pt-4">
          <button type="button" onClick={() => setStep(1)} className="text-gray-500">Retour</button>
          <button type="button" onClick={() => onSubmit(previewData)} disabled={isSubmitting} className="bg-primary text-white px-6 py-2 rounded font-bold">
            {isSubmitting ? "..." : "Valider tout"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap gap-2">
        {niveauxClasse.map(niv => (
          <button
            key={`btn-${niv.id}`}
            type="button"
            onClick={() => setSelectedNiveauxIds(prev => prev.includes(niv.id) ? prev.filter(i => i !== niv.id) : [...prev, niv.id])}
            className={`px-3 py-1 border rounded-full text-xs font-bold transition ${selectedNiveauxIds.includes(niv.id) ? "bg-primary text-white border-primary" : "bg-gray-50 text-gray-400 border-gray-100"}`}
          >
            {niv.nom}
          </button>
        ))}
      </div>
      <textarea
        value={nomsMatieres}
        onChange={(e) => setNomsMatieres(e.target.value)}
        placeholder="Maths, Français, Anglais..."
        className="w-full p-3 border rounded-xl outline-none focus:border-primary"
        rows={3}
      />
      <div className="flex justify-end border-t pt-4">
        <button
          type="button"
          onClick={handlePrepareAdjustment}
          disabled={!selectedNiveauxIds.length || !nomsMatieres.trim()}
          className="bg-primary text-white px-8 py-2 rounded-lg font-bold disabled:opacity-30"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}