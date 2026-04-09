// src/pages/init/InitEcolePage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { School, Info, Loader2, Check, Plus } from "lucide-react";
import { ecoleInfosService } from "../../services/ecoleInfosService";
import { alertServerError } from "../../helpers/alertError";
import { initialisationService } from "../../services/initialisationService";

interface NiveauDisponible {
  nom: string;
  ordre: number;
  cyclesCount: number;
  periodesCount: number;
}

export default function InitEcolePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [niveauxDisponibles, setNiveauxDisponibles] = useState<NiveauDisponible[]>([]);
  const [niveauxSelectionnes, setNiveauxSelectionnes] = useState<Set<string>>(new Set());
  const [loadingNiveaux, setLoadingNiveaux] = useState(true);
  
  const [importStatus, setImportStatus] = useState<{
    show: boolean;
    message: string;
    type: "info" | "success" | "error";
    details?: any;
  }>({ show: false, message: "", type: "info" });
  
  const [formData, setFormData] = useState({
    nom: "",
    adresse: "",
    telephone: "",
    email: "",
    anneeScolaire: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1)
  });

  const [error, setError] = useState("");

  // Charger les niveaux disponibles
  useEffect(() => {
    const loadNiveaux = async () => {
      try {
        const niveaux = await initialisationService.getNiveauxDisponibles("senegal");
        setNiveauxDisponibles(niveaux.sort((a, b) => a.ordre - b.ordre));
      } catch (err) {
        console.error("Erreur chargement niveaux:", err);
      } finally {
        setLoadingNiveaux(false);
      }
    };
    loadNiveaux();
  }, []);

  const toggleNiveau = (nom: string) => {
    const newSet = new Set(niveauxSelectionnes);
    if (newSet.has(nom)) {
      newSet.delete(nom);
    } else {
      newSet.add(nom);
    }
    setNiveauxSelectionnes(newSet);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom.trim()) {
      setError("Le nom de l'école est requis");
      return;
    }

    if (niveauxSelectionnes.size === 0) {
      setError("Sélectionnez au moins un niveau scolaire");
      return;
    }

    setIsSubmitting(true);
    setImportStatus({ show: true, message: "Création de l'école...", type: "info" });
    
    try {
      // 1. Créer l'école
      await ecoleInfosService.create(formData);
      setImportStatus({ show: true, message: "École créée. Importation de la structure scolaire...", type: "info" });
      
      // 2. Importer les niveaux sélectionnés
      const result = await initialisationService.importerNiveauxScolaires(
        "senegal", 
        Array.from(niveauxSelectionnes)
      );
      
      if (result.success) {
        setImportStatus({ 
          show: true, 
          message: "✅ Configuration terminée avec succès !", 
          type: "success",
          details: result.resultats
        });
        
        setTimeout(() => {
          navigate("/admin/home");
        }, 2000);
      } else {
        setImportStatus({ 
          show: true, 
          message: `⚠️ ${result.message}`, 
          type: "error" 
        });
        
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 2000);
      }
      
    } catch (error) {
      setImportStatus({ show: false, message: "", type: "info" });
      alertServerError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingNiveaux) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <School size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Configuration rapide</h1>
          <p className="text-gray-500 mt-2">
            Remplissez les informations essentielles pour commencer
          </p>
        </div>

        {/* Message d'information important */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
          <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">ℹ️ Information importante</p>
            <p>
              Vous pourrez ajouter d'autres niveaux scolaires plus tard depuis les paramètres.
              Les données déjà créées (élèves, notes, etc.) ne seront pas affectées.
            </p>
          </div>
        </div>

        {/* Message d'importation */}
        {importStatus.show && (
          <div className={`mb-6 p-3 rounded-lg flex items-center gap-3 ${
            importStatus.type === "success" ? "bg-green-50 text-green-700 border border-green-200" :
            importStatus.type === "error" ? "bg-red-50 text-red-700 border border-red-200" :
            "bg-blue-50 text-blue-700 border border-blue-200"
          }`}>
            {isSubmitting && importStatus.type === "info" && (
              <Loader2 size={18} className="animate-spin flex-shrink-0" />
            )}
            <div className="flex-1">
              <span className="text-sm">{importStatus.message}</span>
              {importStatus.details && (
                <div className="text-xs mt-1 opacity-75">
                  {importStatus.details.niveauxScolaires.ajoutes} niveaux, {importStatus.details.matieres.ajoutes} matières importées
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations école */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Informations de l'école</h2>
            
            <div>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nom de l'école *"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Adresse (optionnel)"
              />
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Téléphone (optionnel)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Email (optionnel)"
              />
              <input
                type="text"
                value={formData.anneeScolaire}
                onChange={(e) => setFormData({ ...formData, anneeScolaire: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Année scolaire"
              />
            </div>
          </div>

          {/* Sélection des niveaux scolaires */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Niveaux scolaires de votre établissement
            </h2>
            <p className="text-sm text-gray-500">
              Sélectionnez les niveaux que votre école propose actuellement. 
              Vous pourrez en ajouter d'autres plus tard.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {niveauxDisponibles.map((niveau) => (
                <button
                  key={niveau.nom}
                  type="button"
                  onClick={() => toggleNiveau(niveau.nom)}
                  className={`flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
                    niveauxSelectionnes.has(niveau.nom)
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium text-gray-800">{niveau.nom}</div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    niveauxSelectionnes.has(niveau.nom)
                      ? "bg-primary border-primary"
                      : "border-gray-300"
                  }`}>
                    {niveauxSelectionnes.has(niveau.nom) && (
                      <Check size={14} className="text-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Configuration en cours..." : "Commencer"}
          </button>
        </form>
      </div>
    </div>
  );
}