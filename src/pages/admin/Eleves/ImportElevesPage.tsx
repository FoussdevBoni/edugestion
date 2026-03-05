import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Upload, Download, AlertCircle, 
  CheckCircle, XCircle, FileSpreadsheet, HelpCircle,
  ChevronRight
} from "lucide-react";
import { Eleve } from "../../../utils/types/data";

export default function ImportElevesPage() {
  const navigate = useNavigate();
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<"idle" | "preview" | "success" | "error">("idle");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Champs obligatoires
  const requiredFields = [
    { field: "nom", label: "Nom" },
    { field: "prenom", label: "Prénom" },
    { field: "dateNaissance", label: "Date de naissance" },
    { field: "sexe", label: "Sexe (M/F)" },
    { field: "niveauScolaire", label: "Niveau scolaire" },
    { field: "cycle", label: "Cycle" },
    { field: "classe", label: "Classe" },
    { field: "anneeScolaire", label: "Année scolaire" }
  ];

  // Champs optionnels
  const optionalFields = [
    { field: "section", label: "Section" },
    { field: "photo", label: "Photo (URL)" }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    
    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Vérifier le type de fichier
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    
    if (!validTypes.includes(selectedFile.type)) {
      setError("Format de fichier non supporté. Veuillez uploader un fichier Excel (.xlsx, .xls) ou CSV.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const importList = () => {
    if (!file) {
      setError("Veuillez sélectionner un fichier");
      return;
    }

    setIsUploading(true);
    setError(null);

    // Simulation de lecture du fichier Excel
    setTimeout(() => {
      try {
        // Ici, tu utiliseras une bibliothèque comme xlsx ou papaparse
        // pour parser le fichier Excel/CSV
        
        // Simulation de données importées
        const importedData: Partial<Eleve>[] = [
          {
            nom: "Koffi",
            prenom: "Abla",
            dateNaissance: "2010-05-12",
            sexe: "F",
            niveauScolaire: "Secondaire",
            cycle: "1er cycle (Collège)",
            classe: "6ème",
            section: "A",
            anneeScolaire: "2024-2025"
          },
          {
            nom: "Mensah",
            prenom: "Kofi",
            dateNaissance: "2009-11-23",
            sexe: "M",
            niveauScolaire: "Secondaire",
            cycle: "1er cycle (Collège)",
            classe: "5ème",
            section: "B",
            anneeScolaire: "2024-2025"
          }
        ];

        // Valider les données importées
        const errors: string[] = [];
        importedData.forEach((eleve, index) => {
          requiredFields.forEach(field => {
            if (!eleve[field.field as keyof Eleve]) {
              errors.push(`Ligne ${index + 2}: Le champ "${field.label}" est obligatoire`);
            }
          });
        });

        if (errors.length > 0) {
          setValidationErrors(errors);
          setImportStatus("error");
        } else {
          setEleves(importedData as Eleve[]);
          setImportStatus("preview");
        }
      } catch (err) {
        setError("Erreur lors de la lecture du fichier");
      } finally {
        setIsUploading(false);
      }
    }, 2000);
  };

  const confirmAndSaveList = () => {
    setIsUploading(true);
    
    // Simulation de sauvegarde en base de données
    setTimeout(() => {
      console.log("Élèves importés:", eleves);
      setImportStatus("success");
      setIsUploading(false);
      
      // Redirection après 2 secondes
      setTimeout(() => {
        navigate("/admin/eleves");
      }, 2000);
    }, 1500);
  };

  const downloadTemplate = () => {
    // Générer un fichier Excel template
    const headers = [
      "nom",
      "prenom",
      "dateNaissance",
      "sexe",
      "niveauScolaire",
      "cycle",
      "classe",
      "section",
      "anneeScolaire"
    ].join(",");
    
    const sampleRow = [
      "Koffi",
      "Abla",
      "2010-05-12",
      "F",
      "Secondaire",
      "1er cycle (Collège)",
      "6ème",
      "A",
      "2024-2025"
    ].join(",");

    const csvContent = `${headers}\n${sampleRow}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template_import_eleves.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/eleves")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Importation des élèves</h1>
          <p className="text-sm text-gray-500 mt-1">
            Importez une liste d'élèves depuis un fichier Excel ou CSV
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-primary/5 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <HelpCircle size={20} className="text-primary" />
            Instructions
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary text-sm font-medium">1</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Téléchargez le modèle</p>
              <p className="text-sm text-gray-500 mt-1">
                Utilisez notre fichier modèle pour vous assurer que votre fichier est au bon format
              </p>
              <button
                onClick={downloadTemplate}
                className="mt-2 flex items-center gap-2 text-primary hover:text-primary/80 text-sm"
              >
                <Download size={16} />
                Télécharger le modèle Excel/CSV
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary text-sm font-medium">2</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Préparez votre fichier</p>
              <p className="text-sm text-gray-500 mt-1">
                Remplissez le fichier avec les informations des élèves
              </p>
              
              {/* Champs obligatoires */}
              <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-red-800 flex items-center gap-2 mb-2">
                  <AlertCircle size={16} />
                  Champs obligatoires
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {requiredFields.map(field => (
                    <div key={field.field} className="text-xs text-red-700">
                      • {field.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Champs optionnels */}
              <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                  <CheckCircle size={16} className="text-gray-500" />
                  Champs optionnels
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {optionalFields.map(field => (
                    <div key={field.field} className="text-xs text-gray-600">
                      • {field.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-primary text-sm font-medium">3</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Importez le fichier</p>
              <p className="text-sm text-gray-500 mt-1">
                Sélectionnez votre fichier et cliquez sur "Importer"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Zone d'upload */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FileSpreadsheet size={48} className="mx-auto text-gray-400 mb-4" />
          
          <div className="mb-4">
            <p className="text-gray-700 mb-2">
              {file ? file.name : "Glissez-déposez votre fichier ici"}
            </p>
            <p className="text-sm text-gray-500">
              Formats acceptés : .xlsx, .xls, .csv
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center gap-2">
                <Upload size={16} />
                Choisir un fichier
              </span>
            </label>
            
            {file && (
              <button
                onClick={importList}
                disabled={isUploading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isUploading ? "Importation..." : "Importer"}
                <ChevronRight size={16} />
              </button>
            )}
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg flex items-center gap-2">
              <XCircle size={16} />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Erreurs de validation */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-800 flex items-center gap-2 mb-3">
            <XCircle size={16} />
            Erreurs de validation ({validationErrors.length})
          </h3>
          <ul className="space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="text-xs text-red-600">
                • {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Prévisualisation des données */}
      {importStatus === "preview" && eleves.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-primary/5 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Prévisualisation ({eleves.length} élèves)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prénom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Niveau</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cycle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Classe</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Section</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {eleves.map((eleve, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-3">{eleve.nom}</td>
                    <td className="px-6 py-3">{eleve.prenom}</td>
                    <td className="px-6 py-3">{eleve.niveauScolaire}</td>
                    <td className="px-6 py-3">{eleve.cycle}</td>
                    <td className="px-6 py-3">{eleve.classe}</td>
                    <td className="px-6 py-3">{eleve.section || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={() => {
                setFile(null);
                setEleves([]);
                setImportStatus("idle");
              }}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={confirmAndSaveList}
              disabled={isUploading}
              className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {isUploading ? "Enregistrement..." : "Confirmer l'importation"}
            </button>
          </div>
        </div>
      )}

      {/* Succès */}
      {importStatus === "success" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Importation réussie !
          </h3>
          <p className="text-sm text-green-600">
            {eleves.length} élèves ont été importés avec succès.
          </p>
          <p className="text-xs text-green-500 mt-2">
            Redirection vers la liste des élèves...
          </p>
        </div>
      )}
    </div>
  );
}