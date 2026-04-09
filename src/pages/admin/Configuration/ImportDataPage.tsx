// src/pages/admin/parametres/ImportDataPage.tsx (avec le service)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, FileJson, AlertCircle, CheckCircle } from "lucide-react";
import { importService } from "../../../services/importService";
import { alertError } from "../../../helpers/alertError";

export default function ImportDataPage() {
  const navigate = useNavigate();
  const [isImporting, setIsImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);
        setPreview({
          niveauxScolaires: jsonData.niveauxScolaires?.length || 0,
          cycles: jsonData.cycles?.length || 0,
          niveauxClasses: jsonData.niveauxClasses?.length || 0,
          matieres: jsonData.matieres?.length || 0,
          periodes: jsonData.periodes?.length || 0,
          evaluations: jsonData.evaluations?.length || 0
        });
      } catch (error) {
        alertError("Fichier JSON invalide");
        setSelectedFile(null);
        setPreview(null);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    setImportResult(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string);
          const result = await importService.importData(jsonData);
          setImportResult({ success: true, message: result.message });
          setTimeout(() => {
            navigate("/admin/configuration");
          }, 2000);
        } catch (error: any) {
          setImportResult({ success: false, message: error.message || "Erreur lors de l'import" });
        } finally {
          setIsImporting(false);
        }
      };
      reader.readAsText(selectedFile);
    } catch (error: any) {
      setImportResult({ success: false, message: error.message });
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Importer des données</h1>
          <p className="text-sm text-gray-500 mt-1">
            Importez un fichier JSON contenant la structure de base
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Upload size={24} className="text-primary" />
            <h2 className="text-lg font-semibold text-gray-800">1. Choisir un fichier</h2>
          </div>

          <label className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition
            ${selectedFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-primary'}
          `}>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <FileJson size={48} className={`mx-auto mb-3 ${selectedFile ? 'text-green-500' : 'text-gray-400'}`} />
            <p className="text-sm text-gray-600">
              {selectedFile ? selectedFile.name : "Cliquez ou glissez un fichier JSON"}
            </p>
            <p className="text-xs text-gray-400 mt-1">Format JSON uniquement</p>
          </label>

          {preview && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Aperçu du fichier :</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Niveaux scolaires:</span>
                  <span className="font-medium">{preview.niveauxScolaires}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cycles:</span>
                  <span className="font-medium">{preview.cycles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Niveaux classes:</span>
                  <span className="font-medium">{preview.niveauxClasses}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Matières:</span>
                  <span className="font-medium">{preview.matieres}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Périodes:</span>
                  <span className="font-medium">{preview.periodes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Évaluations:</span>
                  <span className="font-medium">{preview.evaluations}</span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleImport}
            disabled={!selectedFile || isImporting}
            className="w-full mt-6 bg-primary text-white py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition"
          >
            {isImporting ? "Import en cours..." : "Importer les données"}
          </button>
        </div>

        <div className="space-y-6">
          {importResult && (
            <div className={`p-4 rounded-lg flex items-start gap-3 ${importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              {importResult.success ? <CheckCircle className="text-green-500 flex-shrink-0" size={20} /> : <AlertCircle className="text-red-500 flex-shrink-0" size={20} />}
              <div>
                <p className={`font-medium ${importResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {importResult.success ? "Import réussi" : "Erreur"}
                </p>
                <p className={`text-sm ${importResult.success ? 'text-green-600' : 'text-red-600'}`}>
                  {importResult.message}
                </p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-bold text-blue-800 mb-2">📋 À savoir</h3>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>L'import va écraser les données existantes</li>
              <li>Assurez-vous d'avoir une sauvegarde avant d'importer</li>
              <li>Le fichier doit être au format JSON valide</li>
              <li>Seules les structures de base sont importées (pas les élèves, enseignants, etc.)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}