// src/pages/admin/photos/UploadElevePhotosPage.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FolderOpen, Upload, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import usePhotos from "../../../hooks/photos/usePhotos";
import useEleves from "../../../hooks/eleves/useEleves";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import { Inscription } from "../../../utils/types/data";

export default function UploadElevePhotosPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { niveauSelectionne, cycleSelectionne } = useEcoleNiveau();
  const { eleves } = useEleves();
  const { uploadPhotos, loading, uploadResult, resetUploadResult } = usePhotos();
  
  const [classeSelectionnee, setClasseSelectionnee] = useState("");
  const [elevesSelectionnes, setElevesSelectionnes] = useState<Inscription[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [dossierChoisi, setDossierChoisi] = useState("");
  const [fichiersPhotos, setFichiersPhotos] = useState<File[]>([]);
  const [showResult, setShowResult] = useState(false);

  // Extraire les classes disponibles
  const classesDisponibles = [...new Set(
    eleves
      .filter(ins => {
        const matchesNiveau = niveauSelectionne ? ins.niveauScolaire === niveauSelectionne : true;
        const matchesCycle = cycleSelectionne ? ins.cycle === cycleSelectionne : true;
        return matchesNiveau && matchesCycle;
      })
      .map(ins => ins.classe)
  )].sort();

  // Filtrer les élèves par classe
  const elevesDeLaClasse = classeSelectionnee
    ? eleves.filter(ins => ins.classe === classeSelectionnee)
    : [];

  // Gérer la sélection de TOUS via le checkbox global
  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setElevesSelectionnes(elevesDeLaClasse);
    } else {
      setElevesSelectionnes([]);
    }
  };

  // Réinitialiser quand la classe change
  useEffect(() => {
    setElevesSelectionnes([]);
    setSelectAll(false);
    setDossierChoisi("");
    setFichiersPhotos([]);
    setShowResult(false);
    resetUploadResult();
  }, [classeSelectionnee, resetUploadResult]);

  const toggleEleve = (eleve: Inscription) => {
    setElevesSelectionnes(prev => {
      const estSelectionne = prev.some(e => e.id === eleve.id);
      let nouvelleSelection;
      
      if (estSelectionne) {
        nouvelleSelection = prev.filter(e => e.id !== eleve.id);
      } else {
        nouvelleSelection = [...prev, eleve];
      }

      setSelectAll(nouvelleSelection.length === elevesDeLaClasse.length && elevesDeLaClasse.length > 0);
      
      return nouvelleSelection;
    });
  };

  const handleChoisirDossier = () => {
    fileInputRef.current?.click();
  };

  const handleDossierSelectionne = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const dossier = fileArray[0].webkitRelativePath.split('/')[0];
      setDossierChoisi(dossier);
      setFichiersPhotos(fileArray);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleUpload = async () => {
    if (fichiersPhotos.length === 0 || elevesSelectionnes.length === 0) return;
    
    setShowResult(false);
    resetUploadResult();
    
    try {
      // Créer un mapping matricule -> fichier
      const photosData = await Promise.all(
        fichiersPhotos.map(async (file) => {
          const base64 = await fileToBase64(file);
          const matricule = file.name.split('.')[0]; // Le nom du fichier sans extension
          return { matricule, base64 };
        })
      );
      
      const result = await uploadPhotos(photosData, elevesSelectionnes);
      setShowResult(true);
    } catch (error) {
      console.error("Erreur upload:", error);
    }
  };

  const getStatutIcone = (matricule: string) => {
    if (!uploadResult) return null;
    
    const success = uploadResult.success.find(s => s.matricule === matricule);
    const error = uploadResult.errors.find(e => e.matricule === matricule);
    
    if (success) return <CheckCircle size={16} className="text-green-600" />;
    if (error) return <XCircle size={16} className="text-red-600" />;
    return null;
  };

  const getMessageErreur = (matricule: string) => {
    return uploadResult?.errors.find(e => e.matricule === matricule)?.error;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Importation des photos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sélectionnez une classe et importez les photos par matricule
          </p>
        </div>
      </div>

      {/* Input file caché pour sélectionner un dossier */}
      <input
        type="file"
        ref={fileInputRef}
        webkitdirectory={"" as any}
        directory=""
        multiple
        className="hidden"
        onChange={handleDossierSelectionne}
      />

      {/* Sélection de la classe */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">1. Choisir une classe</h2>
        <select
          value={classeSelectionnee}
          onChange={(e) => setClasseSelectionnee(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Sélectionner une classe</option>
          {classesDisponibles.map(classe => (
            <option key={classe} value={classe}>{classe}</option>
          ))}
        </select>
      </div>

      {/* Sélection des élèves */}
      {classeSelectionnee && elevesDeLaClasse.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">2. Sélectionner les élèves</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={(e) => handleSelectAllChange(e.target.checked)}
                className="w-4 h-4 text-primary rounded"
              />
              <span className="text-sm text-gray-700">Tout sélectionner</span>
            </label>
          </div>

          <div className="border rounded-lg max-h-64 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Sél.</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Matricule</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Élève</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Photo</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {elevesDeLaClasse.map(eleve => (
                  <tr key={eleve.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={elevesSelectionnes.some(e => e.id === eleve.id)}
                        onChange={() => toggleEleve(eleve)}
                        className="w-4 h-4 text-primary rounded cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-2 font-mono text-sm">{eleve.matricule}</td>
                    <td className="px-4 py-2 font-medium">{eleve.prenom} {eleve.nom}</td>
                    <td className="px-4 py-2">
                      {eleve.photo ? (
                        <span className="text-xs text-green-600">✓ Photo existante</span>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {showResult && getStatutIcone(eleve.matricule!)}
                      {showResult && getMessageErreur(eleve.matricule!) && (
                        <span className="text-xs text-red-500 ml-1">
                          {getMessageErreur(eleve.matricule!)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sélection du dossier */}
      {elevesSelectionnes.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">3. Choisir le dossier des photos</h2>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleChoisirDossier}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <FolderOpen size={18} />
              Parcourir...
            </button>
            {dossierChoisi && (
              <span className="text-sm text-gray-600 truncate max-w-md">
                {dossierChoisi} ({fichiersPhotos.length} fichier(s))
              </span>
            )}
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Important :</strong> Les photos doivent être nommées avec le matricule de l'élève.
              <br />
              Exemples : <code className="bg-blue-100 px-1">20A053.jpg</code>, <code className="bg-blue-100 px-1">20A054.png</code>
            </p>
          </div>
        </div>
      )}

      {/* Bouton d'upload */}
      {dossierChoisi && elevesSelectionnes.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Importation en cours...
              </>
            ) : (
              <>
                <Upload size={18} />
                Importer les photos ({elevesSelectionnes.length})
              </>
            )}
          </button>
        </div>
      )}

      {/* Résultat de l'upload */}
      {showResult && uploadResult && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Résultat de l'importation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <CheckCircle size={18} />
                <span className="font-medium">Réussis ({uploadResult.success.length})</span>
              </div>
              <ul className="space-y-1 text-sm text-green-600 max-h-32 overflow-y-auto">
                {uploadResult.success.map((item, idx) => (
                  <li key={idx}>✓ {item.eleve}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 text-red-700 mb-2">
                <XCircle size={18} />
                <span className="font-medium">Échecs ({uploadResult.errors.length})</span>
              </div>
              <ul className="space-y-1 text-sm text-red-600 max-h-32 overflow-y-auto">
                {uploadResult.errors.map((item, idx) => (
                  <li key={idx}>✗ {item.eleve} - {item.error}</li>
                ))}
              </ul>
            </div>
          </div>

          {uploadResult.errors.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg flex items-start gap-2">
              <AlertTriangle size={18} className="text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-700">
                <p className="font-medium">Photos manquantes ou erreurs :</p>
                <p>Vérifiez que les photos sont nommées avec le bon matricule.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}