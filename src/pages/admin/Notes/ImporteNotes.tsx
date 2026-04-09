// src/pages/ImportNotesPage.tsx
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { Upload, X, CheckCircle, AlertCircle, FileSpreadsheet } from "lucide-react";
import useMatieres from "../../../hooks/matieres/useMatieres";
import usePeriodes from "../../../hooks/periodes/usePeriodes";
import useEvaluations from "../../../hooks/evaluations/useEvaluations";
import { noteService } from "../../../services/noteService";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import useClasses from "../../../hooks/classes/useClasses";
import TabsHorizontalScrollable from "../../../components/ui/TabsHorizontalScrollable";

// Types
interface PreviewItem {
  matricule: string;
  note: string | number;
}

interface SuccessItem {
  matricule: string;
  note: number;
  coefficient: number;
  noteId: string;
}

interface ErrorItem {
  matricule: string;
  error: string;
}

interface ImportResult {
  success: SuccessItem[];
  errors: ErrorItem[];
}

export default function ImportNotesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<PreviewItem[]>([]);
  const [selectedClasse, setSelectedClasse] = useState<string>("");
  const [selectedMatiere, setSelectedMatiere] = useState<string>("");
  const [selectedPeriode, setSelectedPeriode] = useState<string>("");
  const [selectedEvaluation, setSelectedEvaluation] = useState<string>("");
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  
  const { niveauSelectionne, cycleSelectionne } = useEcoleNiveau();
  const { matieres } = useMatieres();
  const { periodes } = usePeriodes();
  const { evaluations } = useEvaluations();
  const { classes } = useClasses();

  // Filtrer les classes par cycle et niveau
  const classesFiltrees = useMemo(() => {
    let filtered = classes || [];
    
    if (cycleSelectionne) {
      filtered = filtered.filter(c => c.cycle === cycleSelectionne);
    }
    if (niveauSelectionne) {
      filtered = filtered.filter(c => c.niveauScolaire === niveauSelectionne);
    }
    
    return filtered;
  }, [classes, cycleSelectionne, niveauSelectionne]);

  // Construire les tabs avec les classes
  const tabs = useMemo(() => {
    return classesFiltrees.map(c => ({
      id: c.id,
      label: c.nom,
      count: c.effectifTotalInscrits
    }));
  }, [classesFiltrees]);

  // Récupérer le niveauClasseId de la classe sélectionnée
  const selectedNiveauClasseId = useMemo(() => {
    const classe = classesFiltrees.find(c => c.id === selectedClasse);
    return classe?.niveauClasseId;
  }, [selectedClasse, classesFiltrees]);

  // Filtrer les matières en fonction du niveauClasseId
  const filteredMatieres = useMemo(() => {
    let filtered = matieres || [];
    
    if (selectedNiveauClasseId) {
      filtered = filtered.filter(m => m.niveauClasseId === selectedNiveauClasseId);
    }
    
    return filtered;
  }, [matieres, selectedNiveauClasseId]);

  // Filtrer les périodes par niveauScolaire
  const filteredPeriodes = useMemo(() => {
    let filtered = periodes || [];
    
    if (niveauSelectionne) {
      filtered = filtered.filter(p => p.niveauScolaire === niveauSelectionne);
    }
    
    return filtered;
  }, [periodes, niveauSelectionne]);

  // Réinitialiser les sélections quand la classe change
  useEffect(() => {
    setSelectedMatiere("");
  }, [selectedClasse]);

  // Sélectionner automatiquement la première classe si disponible
  useEffect(() => {
    if (classesFiltrees.length > 0 && !selectedClasse) {
      setSelectedClasse(classesFiltrees[0].id);
    }
  }, [classesFiltrees, selectedClasse]);

  // Lire le fichier Excel
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFile(file);
    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<any>(sheet);

      const extracted: PreviewItem[] = rows.map(row => ({
        matricule: row.matricule || row.Matricule || row.MATRICULE || "",
        note: row.note || row.Note || row.NOTE || ""
      })).filter(item => item.matricule && item.note);

      setPreviewData(extracted);
    };

    reader.readAsArrayBuffer(file);
  };

  const removeFile = () => {
    setFile(null);
    setPreviewData([]);
    setResult(null);
  };

  const handleImport = async () => {
    if (!selectedMatiere || !selectedPeriode || !selectedEvaluation || previewData.length === 0) {
      alert("Veuillez remplir tous les champs et sélectionner un fichier");
      return;
    }

    setIsImporting(true);
    setResult(null);

    try {
      const response = await noteService.importFromExcel({
        matiereId: selectedMatiere,
        periodeId: selectedPeriode,
        evaluationId: selectedEvaluation,
        notes: previewData.map(item => ({
          matricule: item.matricule,
          note: parseFloat(String(item.note))
        }))
      });

      setResult(response);
    } catch (error: any) {
      setResult({ success: [], errors: [{ matricule: "Global", error: error.message }] });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 rounded-xl">
          <FileSpreadsheet className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Import des Notes</h1>
          <p className="text-sm text-gray-500">Importer des notes depuis un fichier Excel</p>
        </div>
      </header>

      {/* Tabs horizontaux pour les classes */}
      {tabs.length > 0 && (
        <TabsHorizontalScrollable
          tabs={tabs}
          activeTab={selectedClasse}
          onTabChange={setSelectedClasse}
        />
      )}

      {/* Formulaire */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-5">
        {/* Sélection de la période */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Période <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedPeriode}
            onChange={(e) => setSelectedPeriode(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">Sélectionner une période</option>
            {filteredPeriodes.map(p => (
              <option key={p.id} value={p.id}>{p.nom}</option>
            ))}
          </select>
          {filteredPeriodes.length === 0 && (
            <p className="text-sm text-amber-600 mt-1">
              Aucune période disponible pour ce niveau scolaire
            </p>
          )}
        </div>

        {/* Sélection de l'évaluation */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Évaluation <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedEvaluation}
            onChange={(e) => setSelectedEvaluation(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            disabled={!selectedPeriode}
          >
            <option value="">Sélectionner une évaluation</option>
            {evaluations
              ?.filter(e => e.periodeId === selectedPeriode)
              .map(e => (
                <option key={e.id} value={e.id}>{e.nom} ({e.abreviation})</option>
              ))}
          </select>
        </div>

        {/* Sélection de la matière */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Matière <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedMatiere}
            onChange={(e) => setSelectedMatiere(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            disabled={!selectedNiveauClasseId}
          >
            <option value="">Sélectionner une matière </option>
            {filteredMatieres.map(m => (
              <option key={m.id} value={m.id}>{m.nom} (Coeff: {m.coefficient})</option>
            ))}
          </select>
          {selectedClasse && filteredMatieres.length === 0 && (
            <p className="text-sm text-amber-600 mt-1">
              Aucune matière disponible pour cette classe
            </p>
          )}
        </div>

        {/* Upload fichier */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Fichier Excel <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            {!file ? (
              <label className="cursor-pointer block">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Cliquez ou glissez votre fichier Excel</p>
                <p className="text-xs text-gray-400 mt-1">Colonnes attendues : matricule, note</p>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({previewData.length} notes trouvées)
                  </span>
                </div>
                <button onClick={removeFile} className="p-1 hover:bg-gray-200 rounded">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Aperçu des données */}
      {previewData.length > 0 && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="font-semibold text-gray-800">Aperçu des données ({previewData.length} lignes)</h3>
          </div>
          <div className="overflow-x-auto max-h-64">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Matricule</th>
                  <th className="px-4 py-2 text-left">Note</th>
                </tr>
              </thead>
              <tbody>
                {previewData.slice(0, 10).map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2">{item.matricule}</td>
                    <td className="px-4 py-2">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {previewData.length > 10 && (
              <div className="px-4 py-2 text-center text-xs text-gray-500 border-t">
                + {previewData.length - 10} autres lignes
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bouton importer */}
      {previewData.length > 0 && (
        <button
          onClick={handleImport}
          disabled={isImporting || !selectedMatiere || !selectedPeriode || !selectedEvaluation}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isImporting ? (
            <>Import en cours...</>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Importer {previewData.length} note(s)
            </>
          )}
        </button>
      )}

      {/* Résultats */}
      {result && (
        <div className="space-y-3">
          {result.success.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-2">
                <CheckCircle className="w-5 h-5" />
                Import réussi ({result.success.length})
              </div>
              <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                {result.success.map((s, idx) => (
                  <li key={idx} className="text-emerald-600">
                    {s.matricule} → {s.note} (Coeff: {s.coefficient})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.errors?.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                <AlertCircle className="w-5 h-5" />
                Erreurs ({result.errors.length})
              </div>
              <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                {result.errors.map((err, idx) => (
                  <li key={idx} className="text-red-600">
                    {err.matricule}: {err.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}