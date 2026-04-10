// src/pages/admin/photos/UploadElevePhotosPage.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FolderOpen, Upload, CheckCircle, XCircle, AlertTriangle, Image, Loader2 } from "lucide-react";
import usePhotos from "../../../hooks/photos/usePhotos";
import useEleves from "../../../hooks/eleves/useEleves";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import { Inscription } from "../../../utils/types/data";
import { alertSuccess } from "../../../helpers/alertError";

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

  const classesDisponibles = [...new Set(
    eleves
      .filter(ins => {
        const matchesNiveau = niveauSelectionne ? ins.niveauScolaire === niveauSelectionne : true;
        const matchesCycle = cycleSelectionne ? ins.cycle === cycleSelectionne : true;
        return matchesNiveau && matchesCycle;
      })
      .map(ins => ins.classe)
  )].sort();

  const elevesDeLaClasse = classeSelectionnee
    ? eleves.filter(ins => ins.classe === classeSelectionnee)
    : [];

  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setElevesSelectionnes(elevesDeLaClasse);
    } else {
      setElevesSelectionnes([]);
    }
  };

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
      const photosData = await Promise.all(
        fichiersPhotos.map(async (file) => {
          const base64 = await fileToBase64(file);
          const matricule = file.name.split('.')[0];
          return { matricule, base64 };
        })
      );
      
      const result = await uploadPhotos(photosData, elevesSelectionnes);
      setShowResult(true);
      if (result.success.length > 0) {
        alertSuccess(`${result.success.length} photo(s) importée(s) avec succès`);
      }
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
          <h1 className="text-2xl font-bold text-gray-800">Importation des photos</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Image size={14} />
            Sélectionnez une classe et importez les photos par matricule
          </p>
        </div>
      </div>

      {/* Input file caché */}
      <input
        type="file"
        ref={fileInputRef}
        webkitdirectory={"" as any}
        directory=""
        multiple
        className="hidden"
        onChange={handleDossierSelectionne}
      />

      {/* Étape 1 - Sélection de la classe */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-primary rounded-full"></div>
          <h2 className="text-lg font-semibold text-gray-800">1. Choisir une classe</h2>
        </div>
        <select
          value={classeSelectionnee}
          onChange={(e) => setClasseSelectionnee(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200"
        >
          <option value="">Sélectionner une classe</option>
          {classesDisponibles.map(classe => (
            <option key={classe} value={classe}>{classe}</option>
          ))}
        </select>
      </div>

      {/* Étape 2 - Sélection des élèves */}
      {classeSelectionnee && elevesDeLaClasse.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <h2 className="text-lg font-semibold text-gray-800">2. Sélectionner les élèves</h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={(e) => handleSelectAllChange(e.target.checked)}
                className="w-4 h-4 text-primary rounded"
              />
              <span className="text-sm text-gray-700">Tout sélectionner</span>
            </label>
          </div>

          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Sél.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Matricule</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Élève</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Photo</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {elevesDeLaClasse.map((eleve, idx) => (
                    <tr key={eleve.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={elevesSelectionnes.some(e => e.id === eleve.id)}
                          onChange={() => toggleEleve(eleve)}
                          className="w-4 h-4 text-primary rounded cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-2 font-mono text-xs text-gray-600">{eleve.matricule || '-'}</td>
                      <td className="px-4 py-2 font-medium text-gray-800">{eleve.prenom} {eleve.nom}</td>
                      <td className="px-4 py-2">
                        {eleve.photo ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                            <CheckCircle size={10} /> Photo existante
                          </span>
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
        </div>
      )}

      {/* Étape 3 - Sélection du dossier */}
      {elevesSelectionnes.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-800">3. Choisir le dossier des photos</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={handleChoisirDossier}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200"
            >
              <FolderOpen size={18} />
              Parcourir...
            </button>
            {dossierChoisi && (
              <span className="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                📁 {dossierChoisi} ({fichiersPhotos.length} fichier(s))
              </span>
            )}
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-xl">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Important :</p>
                <p>Les photos doivent être nommées avec le matricule de l'élève.</p>
                <p className="text-xs mt-1 font-mono">Exemples : <code className="bg-blue-100 px-1 rounded">20A053.jpg</code>, <code className="bg-blue-100 px-1 rounded">20A054.png</code></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bouton d'upload */}
      {dossierChoisi && elevesSelectionnes.length > 0 && (
        <div className="flex justify-end animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <button
            onClick={handleUpload}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Résultat de l'importation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <CheckCircle size={18} />
                <span className="font-semibold">Réussis ({uploadResult.success.length})</span>
              </div>
              <ul className="space-y-1 text-sm text-green-600 max-h-32 overflow-y-auto">
                {uploadResult.success.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-1">✓ {item.eleve}</li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4">
              <div className="flex items-center gap-2 text-red-700 mb-2">
                <XCircle size={18} />
                <span className="font-semibold">Échecs ({uploadResult.errors.length})</span>
              </div>
              <ul className="space-y-1 text-sm text-red-600 max-h-32 overflow-y-auto">
                {uploadResult.errors.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-1">✗ {item.eleve} - {item.error}</li>
                ))}
              </ul>
            </div>
          </div>

          {uploadResult.errors.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-xl flex items-start gap-2">
              <AlertTriangle size={18} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-700">
                <p className="font-medium">Photos manquantes ou erreurs :</p>
                <p>Vérifiez que les photos sont nommées avec le bon matricule.</p>
              </div>
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