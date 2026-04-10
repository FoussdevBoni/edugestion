// src/pages/admin/eleves/ImportElevesPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Upload, Download, AlertCircle,
  CheckCircle, XCircle, FileSpreadsheet, HelpCircle,
  ChevronRight, School, Trash2, Search, AlertTriangle,
  Users, Filter
} from "lucide-react";
import * as XLSX from 'xlsx';
import { BaseEleveData, Sexe, StatutEleve } from "../../../utils/types/base";
import { inscriptionService } from "../../../services/inscriptionService";
import { alertServerError, alertSuccess } from "../../../helpers/alertError";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import useClasses from "../../../hooks/classes/useClasses";
import useEleves from "../../../hooks/eleves/useEleves";
import { excludeBy } from "../../../helpers/exludeBy";

export default function ImportElevesPage() {
  const navigate = useNavigate();
  const { niveauSelectionne, cycleSelectionne } = useEcoleNiveau();
  const { classes } = useClasses();
  const { eleves: elevesExistants } = useEleves();

  const [elevesNonInscrits, setElevesNonInscrits] = useState<BaseEleveData[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<"idle" | "preview" | "success" | "error">("idle");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [selectedClasseId, setSelectedClasseId] = useState("");
  const [statutScolaire, setStatutScolaire] = useState<"nouveau" | "redoublant">("nouveau");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const classesFiltrees = classes.filter(c => {
    if (cycleSelectionne && c.cycle !== cycleSelectionne) return false;
    if (niveauSelectionne && c.niveauScolaire !== niveauSelectionne) return false;
    return true;
  });

  const requiredFields = [
    { field: "nom", label: "Nom" },
    { field: "prenom", label: "Prénom" },
    { field: "dateNaissance", label: "Date de naissance" },
    { field: "sexe", label: "Sexe" }
  ];

  const optionalFields = [
    { field: "photo", label: "Photo" },
    { field: "matricule", label: "Matricule" },
    { field: "statut", label: "Statut" },
    { field: "lieuDeNaissance", label: "Lieu de naissance" },
    { field: "contact", label: "Contact" }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    setValidationErrors([]);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'xls' && fileExtension !== 'csv') {
      setError("Format de fichier non supporté. Veuillez uploader un fichier Excel (.xlsx, .xls) ou CSV.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const importList = async () => {
    if (!file) {
      setError("Veuillez sélectionner un fichier");
      return;
    }
    if (!selectedClasseId) {
      setError("Veuillez sélectionner une classe pour l'inscription");
      return;
    }

    setIsUploading(true);
    setError(null);
    setValidationErrors([]);

    try {
      const rawData = await readExcelFile(file);
      const errors: string[] = [];

      rawData.forEach((row: any, index) => {
        requiredFields.forEach(field => {
          if (!row[field.field]) {
            errors.push(`Ligne ${index + 2}: Le champ "${field.label}" est obligatoire`);
          }
        });
      });

      if (errors.length > 0) {
        setValidationErrors(errors);
        setImportStatus("error");
      } else {
        const mappedEleves: BaseEleveData[] = rawData.map((row: any) => ({
          nom: row.nom || '',
          prenom: row.prenom || '',
          dateNaissance: row.dateNaissance || '',
          sexe: (row.sexe === 'M' || row.sexe === 'F' ? row.sexe : 'M') as Sexe,
          photo: row.photo || undefined,
          matricule: row.matricule || undefined,
          statut: (row.statut === 'actif' || row.statut === 'inactif' || row.statut === 'exclu'
            ? row.statut : undefined) as StatutEleve,
          lieuDeNaissance: row.lieuDeNaissance || undefined,
          contact: row.contact || undefined
        }));

        const nonInscrits = excludeBy(
          mappedEleves,
          elevesExistants,
          e => e.matricule,
          e => e.matricule
        );
        setElevesNonInscrits(nonInscrits);
        setSelectedRows(new Set(nonInscrits.map((_, index) => index)));
        setImportStatus("preview");
      }
    } catch (err) {
      setError("Erreur lors de la lecture du fichier. Vérifiez que le format est correct.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteRow = (index: number) => {
    setElevesNonInscrits(prev => prev.filter((_, i) => i !== index));
    setSelectedRows(prev => {
      const newSet = new Set<number>();
      prev.forEach(i => {
        if (i < index) newSet.add(i);
        else if (i > index) newSet.add(i - 1);
      });
      return newSet;
    });
  };

  const handleDeleteSelected = () => {
    const indicesToDelete = Array.from(selectedRows).sort((a, b) => b - a);
    let newEleves = [...elevesNonInscrits];
    indicesToDelete.forEach(index => {
      newEleves = newEleves.filter((_, i) => i !== index);
    });
    setElevesNonInscrits(newEleves);
    setSelectedRows(new Set());
  };

  const handleDeleteAll = () => {
    if (window.confirm("Voulez-vous vraiment supprimer toutes les lignes ?")) {
      setElevesNonInscrits([]);
      setSelectedRows(new Set());
      setImportStatus("idle");
      setFile(null);
    }
  };

  const toggleRow = (index: number) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === filteredEleves.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredEleves.map((_, i) => i)));
    }
  };

  const confirmAndSaveList = async () => {
    setIsUploading(true);
    try {
      const elevesASauvegarder = Array.from(selectedRows).map(index => elevesNonInscrits[index]);
      const anneeCourante = new Date().getFullYear() + '-' + (new Date().getFullYear() + 1);
      let successCount = 0;
      const errors: string[] = [];

      for (const eleve of elevesASauvegarder) {
        try {
          await inscriptionService.inscrireNouvelEleve({
            nom: eleve.nom,
            prenom: eleve.prenom,
            dateNaissance: eleve.dateNaissance,
            sexe: eleve.sexe,
            lieuDeNaissance: eleve.lieuDeNaissance || "",
            contact: eleve.contact || "",
            photo: eleve.photo || "",
            anneeScolaire: anneeCourante,
            statutScolaire: statutScolaire,
            classeId: selectedClasseId,
            matricule: eleve.matricule
          });
          successCount++;
        } catch (err: any) {
          errors.push(`${eleve.prenom} ${eleve.nom}: ${err.message || "Erreur inconnue"}`);
        }
      }

      if (errors.length > 0) {
        setValidationErrors(errors);
        setImportStatus("error");
      } else {
        setImportStatus("success");
        alertSuccess(`${successCount} élève(s) importé(s) avec succès`);
        setTimeout(() => navigate("/admin/eleves"), 2000);
      }
    } catch (err) {
      alertServerError(err, "Erreur lors de l'importation");
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    const headers = [["nom", "prenom", "dateNaissance", "sexe", "photo", "matricule", "statut", "lieuDeNaissance", "contact"]];
    const sampleData = [["Leroy", "Anaïs", "2013-08-01", "F", "photo1.jpg", "MAT001", "inactif", "Paris", "+221 77 123 45 67"]];
    const wsData = [...headers, ...sampleData];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "template_import_eleves.xlsx");
  };

  const filteredEleves = elevesNonInscrits.filter(eleve =>
    eleve.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eleve.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eleve.matricule?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (importStatus === "idle" && !elevesExistants && !file) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button onClick={() => navigate("/admin/eleves")} className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group">
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Importation des élèves</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Users size={14} />
            Importez une liste d'élèves depuis un fichier Excel ou CSV
          </p>
        </div>
      </div>

      {/* Sélection de la classe */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <School size={16} className="text-primary" />
          Classe d'affectation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Classe <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedClasseId}
              onChange={(e) => setSelectedClasseId(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="">Sélectionner une classe</option>
              {classesFiltrees.map(classe => (
                <option key={classe.id} value={classe.id}>
                  {classe.nom} - {classe.niveauClasse} ({classe.cycle})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Tous les élèves importés seront inscrits dans cette classe</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut scolaire</label>
            <select
              value={statutScolaire}
              onChange={(e) => setStatutScolaire(e.target.value as "nouveau" | "redoublant")}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="nouveau">Nouveau</option>
              <option value="redoublant">Redoublant</option>
            </select>
          </div>
        </div>
        {(niveauSelectionne || cycleSelectionne) && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <Filter size={14} className="text-primary" />
            <span>Filtres actifs: {niveauSelectionne} {cycleSelectionne && `- ${cycleSelectionne}`}</span>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <HelpCircle size={20} className="text-primary" />
            Instructions
          </h2>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary text-sm font-bold">1</span>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Téléchargez le modèle</p>
              <p className="text-sm text-gray-500 mt-1">Utilisez notre fichier modèle pour vous assurer que votre fichier est au bon format</p>
              <button onClick={downloadTemplate} className="mt-2 flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium">
                <Download size={16} /> Télécharger le modèle Excel
              </button>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary text-sm font-bold">2</span>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Préparez votre fichier</p>
              <p className="text-sm text-gray-500 mt-1">Remplissez le fichier avec les informations des élèves</p>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-red-800 flex items-center gap-2 mb-2"><AlertCircle size={14} />Champs obligatoires</h3>
                  <div className="grid grid-cols-2 gap-1">{requiredFields.map(field => (<div key={field.field} className="text-xs text-red-700">• {field.label}</div>))}</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2"><CheckCircle size={14} className="text-gray-500" />Champs optionnels</h3>
                  <div className="grid grid-cols-2 gap-1">{optionalFields.map(field => (<div key={field.field} className="text-xs text-gray-600">• {field.label}</div>))}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary text-sm font-bold">3</span>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Importez le fichier</p>
              <p className="text-sm text-gray-500 mt-1">Sélectionnez votre fichier et cliquez sur "Importer"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Zone d'upload */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center transition-all hover:border-primary">
          <FileSpreadsheet size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-700 mb-2 font-medium">{file ? file.name : "Glissez-déposez votre fichier ici"}</p>
          <p className="text-sm text-gray-500 mb-4">Formats acceptés : .xlsx, .xls, .csv</p>
          <div className="flex items-center justify-center gap-4">
            <label className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all inline-flex items-center gap-2">
              <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} className="hidden" />
              <Upload size={16} /> Choisir un fichier
            </label>
            {file && (<button onClick={importList} disabled={isUploading} className="px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all disabled:opacity-50 flex items-center gap-2">{isUploading ? "Importation..." : "Importer"}<ChevronRight size={16} /></button>)}
          </div>
          {error && (<div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl flex items-center gap-2"><XCircle size={16} />{error}</div>)}
        </div>
      </div>

      {/* Erreurs de validation */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in-up">
          <h3 className="text-sm font-semibold text-red-800 flex items-center gap-2 mb-2"><XCircle size={16} />Erreurs de validation ({validationErrors.length})</h3>
          <div className="max-h-60 overflow-y-auto"><ul className="space-y-1">{validationErrors.map((error, idx) => (<li key={idx} className="text-xs text-red-600">• {error}</li>))}</ul></div>
        </div>
      )}

      {/* Prévisualisation */}
      {importStatus === "preview" && elevesNonInscrits.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div><h2 className="text-lg font-semibold text-gray-800">Prévisualisation ({elevesNonInscrits.length} nouveaux élèves)</h2><p className="text-sm text-gray-500">Classe: {classes.find(c => c.id === selectedClasseId)?.nom}</p></div>
              <div className="flex items-center gap-2">{selectedRows.size > 0 && (<button onClick={handleDeleteSelected} className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"><Trash2 size={14} />Supprimer sélection</button>)}<button onClick={handleDeleteAll} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm"><Trash2 size={14} />Tout supprimer</button></div>
            </div>
            <div className="mt-4 relative"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Rechercher dans la liste..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" /></div>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 sticky top-0">
                <tr>
                  <th className="px-4 py-3 w-10"><input type="checkbox" checked={selectedRows.size === filteredEleves.length && filteredEleves.length > 0} onChange={toggleSelectAll} className="rounded text-primary" /></th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Matricule</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Prénom</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Sexe</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Date naiss.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Lieu naiss.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEleves.map((eleve, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3"><input type="checkbox" checked={selectedRows.has(idx)} onChange={() => toggleRow(idx)} className="rounded text-primary" /></td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{eleve.matricule || '-'}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{eleve.nom}</td>
                    <td className="px-4 py-3 text-gray-700">{eleve.prenom}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${eleve.sexe === 'M' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>{eleve.sexe}</span></td>
                    <td className="px-4 py-3 text-gray-600">{eleve.dateNaissance}</td>
                    <td className="px-4 py-3">{eleve.statut && (<span className={`px-2 py-1 rounded-full text-xs font-medium ${eleve.statut === 'actif' ? 'bg-green-100 text-green-700' : eleve.statut === 'inactif' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'}`}>{eleve.statut}</span>)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{eleve.contact || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{eleve.lieuDeNaissance || '-'}</td>
                    <td className="px-4 py-3"><button onClick={() => handleDeleteRow(idx)} className="p-1.5 hover:bg-red-100 rounded-lg text-red-500 transition-colors"><Trash2 size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <div className="text-sm text-gray-600"><span className="font-semibold text-primary">{selectedRows.size}</span> élève(s) sélectionné(s)</div>
            <div className="flex gap-3">
              <button onClick={() => { setFile(null); setElevesNonInscrits([]); setImportStatus("idle"); }} className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">Annuler</button>
              <button onClick={confirmAndSaveList} disabled={isUploading || selectedRows.size === 0} className="px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all disabled:opacity-50">{isUploading ? "Enregistrement..." : `Importer ${selectedRows.size} élève(s)`}</button>
            </div>
          </div>
        </div>
      )}

      {/* Succès */}
      {importStatus === "success" && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6 text-center animate-fade-in">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-green-800 mb-1">Importation réussie !</h3>
          <p className="text-sm text-green-600">{selectedRows.size} élèves ont été importés 
            avec succès.</p>
          <p className="text-xs text-green-500 mt-2">Redirection vers la liste des élèves...</p>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; opacity: 0; }
      `}</style>
    </div>
  );
}