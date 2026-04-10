// src/pages/admin/parametres/ImportDataPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, FileJson, AlertCircle, CheckCircle, Database, Info } from "lucide-react";
import { importService } from "../../../services/importService";
import { alertError, alertSuccess } from "../../../helpers/alertError";

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
          alertSuccess("Données importées avec succès");
          setTimeout(() => {
            navigate("/admin/configuration");
          }, 2000);
        } catch (error: any) {
          setImportResult({ success: false, message: error.message || "Erreur lors de l'import" });
          alertError(error.message || "Erreur lors de l'import");
        } finally {
          setIsImporting(false);
        }
      };
      reader.readAsText(selectedFile);
    } catch (error: any) {
      setImportResult({ success: false, message: error.message });
      alertError(error.message);
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Importer des données</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Database size={14} />
            Importez un fichier JSON contenant la structure de base
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonne gauche - Upload */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Upload size={20} className="text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">1. Choisir un fichier</h2>
          </div>

          <label className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
            ${selectedFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-primary hover:bg-primary/5'}
          `}>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <FileJson size={48} className={`mx-auto mb-3 ${selectedFile ? 'text-green-500' : 'text-gray-400'}`} />
            <p className="text-sm text-gray-600 font-medium">
              {selectedFile ? selectedFile.name : "Cliquez ou glissez un fichier JSON"}
            </p>
            <p className="text-xs text-gray-400 mt-1">Format JSON uniquement</p>
          </label>

          {preview && (
            <div className="mt-5 p-4 bg-gray-50 rounded-xl animate-fade-in-up">
              <p className="text-sm font-semibold text-gray-700 mb-3">Aperçu du fichier :</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                  <span className="text-gray-500">Niveaux scolaires:</span>
                  <span className="font-bold text-primary">{preview.niveauxScolaires}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                  <span className="text-gray-500">Cycles:</span>
                  <span className="font-bold text-primary">{preview.cycles}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                  <span className="text-gray-500">Niveaux classes:</span>
                  <span className="font-bold text-primary">{preview.niveauxClasses}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                  <span className="text-gray-500">Matières:</span>
                  <span className="font-bold text-primary">{preview.matieres}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                  <span className="text-gray-500">Périodes:</span>
                  <span className="font-bold text-primary">{preview.periodes}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                  <span className="text-gray-500">Évaluations:</span>
                  <span className="font-bold text-primary">{preview.evaluations}</span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleImport}
            disabled={!selectedFile || isImporting}
            className="w-full mt-6 bg-gradient-to-r from-primary to-primary/80 text-white py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            {isImporting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Import en cours...
              </div>
            ) : (
              "Importer les données"
            )}
          </button>
        </div>

        {/* Colonne droite - Informations */}
        <div className="space-y-6">
          {importResult && (
            <div className={`p-5 rounded-xl flex items-start gap-3 transition-all duration-300 animate-fade-in-up ${
              importResult.success 
                ? 'bg-gradient-to-r from-green-50 to-green-100 border border-green-200' 
                : 'bg-gradient-to-r from-red-50 to-red-100 border border-red-200'
            }`} style={{ animationDelay: '200ms' }}>
              {importResult.success 
                ? <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                : <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              }
              <div>
                <p className={`font-semibold ${importResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {importResult.success ? "Import réussi" : "Erreur"}
                </p>
                <p className={`text-sm ${importResult.success ? 'text-green-700' : 'text-red-700'}`}>
                  {importResult.message}
                </p>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-start gap-3">
              <div className="p-1 bg-white rounded-full shadow-sm">
                <Info size={16} className="text-primary" />
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-semibold text-gray-700 mb-2">Informations</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>L'import va écraser les données existantes</li>
                  <li>Assurez-vous d'avoir une sauvegarde avant d'importer</li>
                  <li>Le fichier doit être au format JSON valide</li>
                  <li>Seules les structures de base sont importées (pas les élèves, enseignants, etc.)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

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