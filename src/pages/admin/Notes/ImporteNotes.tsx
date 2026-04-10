// src/pages/ImportNotesPage.tsx
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { Upload, X, CheckCircle, AlertCircle, FileSpreadsheet, Download, Info, ArrowLeft } from "lucide-react";
import useMatieres from "../../../hooks/matieres/useMatieres";
import usePeriodes from "../../../hooks/periodes/usePeriodes";
import useEvaluations from "../../../hooks/evaluations/useEvaluations";
import { noteService } from "../../../services/noteService";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import useClasses from "../../../hooks/classes/useClasses";
import TabsHorizontalScrollable from "../../../components/ui/TabsHorizontalScrollable";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate()
  const { niveauSelectionne, cycleSelectionne } = useEcoleNiveau();
  const { matieres } = useMatieres();
  const { periodes } = usePeriodes();
  const { evaluations } = useEvaluations();
  const { classes } = useClasses();

  const classesFiltrees = useMemo(() => {
    let filtered = classes || [];
    if (cycleSelectionne) filtered = filtered.filter(c => c.cycle === cycleSelectionne);
    if (niveauSelectionne) filtered = filtered.filter(c => c.niveauScolaire === niveauSelectionne);
    return filtered;
  }, [classes, cycleSelectionne, niveauSelectionne]);

  const tabs = useMemo(() => {
    return classesFiltrees.map(c => ({
      id: c.id,
      label: c.nom,
      count: c.effectifTotalInscrits
    }));
  }, [classesFiltrees]);

  const selectedNiveauClasseId = useMemo(() => {
    const classe = classesFiltrees.find(c => c.id === selectedClasse);
    return classe?.niveauClasseId;
  }, [selectedClasse, classesFiltrees]);

  const filteredMatieres = useMemo(() => {
    let filtered = matieres || [];
    if (selectedNiveauClasseId) filtered = filtered.filter(m => m.niveauClasseId === selectedNiveauClasseId);
    return filtered;
  }, [matieres, selectedNiveauClasseId]);

  const filteredPeriodes = useMemo(() => {
    let filtered = periodes || [];
    if (niveauSelectionne) filtered = filtered.filter(p => p.niveauScolaire === niveauSelectionne);
    return filtered;
  }, [periodes, niveauSelectionne]);

  useEffect(() => {
    setSelectedMatiere("");
  }, [selectedClasse]);

  useEffect(() => {
    if (classesFiltrees.length > 0 && !selectedClasse) {
      setSelectedClasse(classesFiltrees[0].id);
    }
  }, [classesFiltrees, selectedClasse]);

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
      setResult(null);
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

  const downloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    const headers = [["matricule", "note"]];
    const sampleData = [["MAT001", "15"], ["MAT002", "12.5"], ["MAT003", "18"]];
    const wsData = [...headers, ...sampleData];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Template_Notes");
    XLSX.writeFile(wb, "template_import_notes.xlsx");
  };



  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 pb-8">
      {/* Header avec animation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
          >
            <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
          </button>
        
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Import des Notes</h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <Upload size={14} />
              Importer des notes depuis un fichier Excel
            </p>
          </div>
        </div>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:scale-[1.02]"
        >
          <Download size={16} className="text-primary" />
          Télécharger le template
        </button>
      </div>

      {/* Tabs horizontaux pour les classes */}
      {tabs.length > 0 && (
        <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <TabsHorizontalScrollable
            tabs={tabs}
            activeTab={selectedClasse}
            onTabChange={setSelectedClasse}
          />
        </div>
      )}

      {/* Formulaire */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Période <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedPeriode}
              onChange={(e) => setSelectedPeriode(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            >
              <option value="">Sélectionner une période</option>
              {filteredPeriodes.map(p => (
                <option key={p.id} value={p.id}>{p.nom}</option>
              ))}
            </select>
            {filteredPeriodes.length === 0 && (
              <p className="text-sm text-amber-600 mt-1 flex items-center gap-1"><AlertCircle size={12} /> Aucune période disponible</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Évaluation <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedEvaluation}
              onChange={(e) => setSelectedEvaluation(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
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
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Matière <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedMatiere}
            onChange={(e) => setSelectedMatiere(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            disabled={!selectedNiveauClasseId}
          >
            <option value="">Sélectionner une matière</option>
            {filteredMatieres.map(m => (
              <option key={m.id} value={m.id}>{m.nom} (Coeff: {m.coefficient})</option>
            ))}
          </select>
          {selectedClasse && filteredMatieres.length === 0 && (
            <p className="text-sm text-amber-600 mt-1 flex items-center gap-1"><AlertCircle size={12} /> Aucune matière disponible pour cette classe</p>
          )}
        </div>

        {/* Upload fichier */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Fichier Excel <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center transition-all hover:border-primary hover:bg-primary/5">
            {!file ? (
              <label className="cursor-pointer block">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 font-medium">Cliquez ou glissez votre fichier Excel</p>
                <p className="text-xs text-gray-400 mt-1">Colonnes attendues : matricule, note</p>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-800">{file.name}</span>
                    <p className="text-xs text-gray-500">{previewData.length} notes trouvées</p>
                  </div>
                </div>
                <button onClick={removeFile} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Aperçu des données */}
      {previewData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Info size={16} className="text-primary" />
              Aperçu des données ({previewData.length} lignes)
            </h3>
          </div>
          <div className="overflow-x-auto max-h-64">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Matricule</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {previewData.slice(0, 10).map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 font-mono text-sm">{item.matricule}</td>
                    <td className="px-4 py-2 font-medium">{item.note} / 20</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {previewData.length > 10 && (
              <div className="px-4 py-2 text-center text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
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
          className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 hover:shadow-md disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 animate-fade-in-up"
          style={{ animationDelay: '700ms' }}
        >
          {isImporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Import en cours...
            </>
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
        <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
          {result.success.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-700 font-semibold mb-3">
                <CheckCircle className="w-5 h-5" />
                Import réussi ({result.success.length})
              </div>
              <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                {result.success.map((s, idx) => (
                  <li key={idx} className="text-green-600 flex justify-between items-center p-1">
                    <span className="font-mono">{s.matricule}</span>
                    <span>{s.note} / 20 (Coeff: {s.coefficient})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.errors?.length > 0 && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-700 font-semibold mb-3">
                <AlertCircle className="w-5 h-5" />
                Erreurs ({result.errors.length})
              </div>
              <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                {result.errors.map((err, idx) => (
                  <li key={idx} className="text-red-600 flex items-center gap-2 p-1">
                    <span className="font-mono">{err.matricule}</span>
                    <span>→</span>
                    <span>{err.error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}