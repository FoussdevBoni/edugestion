// src/pages/admin/configuration/ecole/EcoleInfosPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  School, MapPin, Phone, Mail, Globe, Calendar,
  Quote, Edit, Clock, PlusCircle, Image, Upload,
  Database, RefreshCw, AlertTriangle
} from "lucide-react";
import useEcoleInfos from "../../../../hooks/ecoleInfos/useEcoleInfos";
import { photoService } from "../../../../services/photoService";
import { initialisationService } from "../../../../services/initialisationService";
import { resetService } from "../../../../services/resetService";
import { confirmModal } from "../../../../helpers/confirmModal";
import { alertSuccess, alertError } from "../../../../helpers/alertError";
import { useRefresh } from "../../../../contexts/RefreshContext";

export default function EcoleInfosPage() {
  const navigate = useNavigate();
  const { ecoleInfos: ecole, loading, error } = useEcoleInfos();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [enTeteUrl, setEnTeteUrl] = useState<string | null>(null);
  const { triggerRefresh } = useRefresh();


  useEffect(() => {
    const loadImages = async () => {
      if (ecole?.logo) {
        const base64 = await photoService.getFileBase64(ecole.logo, 'upload');
        setLogoUrl(base64);
      }
      if (ecole?.enTeteCarte) {
        const base64 = await photoService.getFileBase64(ecole.enTeteCarte, 'upload');
        setEnTeteUrl(base64);
      }
    };
    loadImages();
  }, [ecole]);

  const handleResetScolaire = async () => {
    const confirmed = await confirmModal(
      "Attention : La réinitialisation des paramètres scolaires va supprimer tous les niveaux, cycles, classes et matières actuels et restaurer la configuration par défaut.\n\nCette action est irréversible. Confirmez-vous ?"
    );
    
    if (!confirmed) return;

    try {
      const niveaux = await initialisationService.getNiveauxDisponibles("senegal");
      await initialisationService.importerNiveauxScolaires(
        "senegal",
        niveaux.sort((a, b) => a.ordre - b.ordre).map((n) => n.nom)
      );

      alertSuccess("Paramètres scolaires réinitialisés avec succès");
      triggerRefresh()
    } catch (error) {
      alertError("Erreur lors de la réinitialisation des paramètres scolaires");
      console.error("Erreur:", error);
    }
  };

  const handleResetComplete = async () => {
    const confirmed = await confirmModal(
      "ATTENTION\n\n" +
      "Cette action va supprimer TOUTES les données de l'application :\n" +
      "• Élèves\n" +
      "• Classes\n" +
      "• Matières\n" +
      "• Notes\n" +
      "• Bulletins\n" +
      "• Paiements\n" +
      "• Et toutes les autres données\n\n" +
      "Cette action est IRRÉVERSIBLE.\n\n" +
      "Voulez-vous vraiment continuer ?"
    );
    
    if (!confirmed) return;

    try {
      const result = await resetService.resetDatabase();
      if (result.success) {
        alertSuccess("Base de données réinitialisée avec succès");
        navigate("/init");
      }
    } catch (error) {
      alertError("Erreur lors de la réinitialisation de la base de données");
      console.error("Erreur:", error);
    }
  };

  const handleResetData = async () => {
    const confirmed = await confirmModal(
      "Attention : La réinitialisation des données va supprimer :\n" +
      "• Tous les élèves\n" +
      "• Toutes les notes\n" +
      "• Tous les bulletins\n" +
      "• Tous les paiements\n\n" +
      "La structure (classes, matières) sera conservée.\n\n" +
      "Cette action est irréversible. Confirmez-vous ?"
    );
    
    if (!confirmed) return;

    try {
      const result = await resetService.resetScolaireData();
      if (result.success) {
        alertSuccess("Données réinitialisées avec succès");
        triggerRefresh()
      }
    } catch (error) {
      alertError("Erreur lors de la réinitialisation des données");
      console.error("Erreur:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleUpdate = () => {
    navigate("/admin/configuration/ecole/update", { state: ecole });
  };

  const handleCreate = () => {
    navigate("/admin/configuration/ecole/new");
  };

  const handleImport = () => {
    navigate("/admin/configuration/import");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6 text-center animate-fade-in-up">
        <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={32} className="text-red-600" />
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-md transition-all duration-300"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!ecole) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white rounded-xl border border-gray-100 p-8 animate-fade-in-up">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <School size={48} className="text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Aucune école configurée
        </h3>
        <p className="text-gray-500 text-center mb-6 max-w-md">
          Commencez par configurer les informations de votre établissement.
          Ces données seront utilisées dans tous les documents générés par le système.
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300"
          >
            <PlusCircle size={20} />
            Configurer mon école
          </button>
          <button
            onClick={handleImport}
            className="flex items-center gap-2 px-6 py-3 border border-primary text-primary rounded-xl hover:bg-primary/5 transition-all duration-300"
          >
            <Upload size={20} />
            Importer les configurations
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="text-primary font-bold mb-1">1</div>
            <p className="text-sm text-gray-600">Informations générales</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="text-primary font-bold mb-1">2</div>
            <p className="text-sm text-gray-600">Coordonnées</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="text-primary font-bold mb-1">3</div>
            <p className="text-sm text-gray-600">Année scolaire</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Boutons d'actions avec animation */}
      <div className="flex justify-end gap-3 flex-wrap animate-fade-in-up">
        <button
          onClick={handleResetScolaire}
          className="flex items-center gap-2 px-4 py-2 border border-yellow-500 text-yellow-600 rounded-xl hover:bg-yellow-50 transition-all duration-300 hover:scale-[1.02]"
        >
          <RefreshCw size={18} />
          Réinitialiser paramètres
        </button>
        <button
          onClick={handleResetData}
          className="flex items-center gap-2 px-4 py-2 border border-orange-500 text-orange-600 rounded-xl hover:bg-orange-50 transition-all duration-300 hover:scale-[1.02]"
        >
          <Database size={18} />
          Réinitialiser données
        </button>
        <button
          onClick={handleResetComplete}
          className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-600 rounded-xl hover:bg-red-50 transition-all duration-300 hover:scale-[1.02]"
        >
          <AlertTriangle size={18} />
          Réinitialiser complet
        </button>
        <button
          onClick={handleImport}
          className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-xl hover:bg-primary/5 transition-all duration-300 hover:scale-[1.02]"
        >
          <Upload size={18} />
          Importer
        </button>
      </div>

      {/* Carte principale avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-xl shadow-md flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt={ecole.nom} className="w-full h-full object-contain" />
              ) : (
                <School size={48} className="text-primary" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{ecole.nom}</h2>
              {ecole.devise && (
                <p className="text-gray-600 mt-2 flex items-center gap-2">
                  <Quote size={16} className="text-primary" />
                  "{ecole.devise}"
                </p>
              )}
            </div>
            <button
              onClick={handleUpdate}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <Edit size={18} />
              Modifier
            </button>
          </div>
        </div>

        {/* Grille d'informations */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl transition-all duration-300 hover:shadow-sm">
            <div className="p-2 bg-primary/10 rounded-lg">
              <School size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">IA / IEF</p>
              <p className="font-medium text-gray-800">{ecole.ia || "Non renseigné"} / {ecole.ief || "Non renseigné"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl transition-all duration-300 hover:shadow-sm">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapPin size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Adresse</p>
              <p className="font-medium text-gray-800">{ecole.adresse}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl transition-all duration-300 hover:shadow-sm">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Phone size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Téléphone</p>
              <p className="font-medium text-gray-800">{ecole.telephone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl transition-all duration-300 hover:shadow-sm">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Mail size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{ecole.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl transition-all duration-300 hover:shadow-sm">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Globe size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Site Web</p>
              <p className="font-medium text-gray-800">{ecole.siteWeb || "Non renseigné"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl transition-all duration-300 hover:shadow-sm">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Année scolaire en cours</p>
              <p className="font-medium text-gray-800">{ecole.anneeScolaire}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl transition-all duration-300 hover:shadow-sm md:col-span-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Dernière mise à jour</p>
              <p className="font-medium text-gray-800">{formatDate(ecole.updatedAt)}</p>
              <p className="text-xs text-gray-400 mt-1">
                Créé le {formatDate(ecole.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section En-tête carte d'identité avec animation */}
      {enTeteUrl && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Image size={20} className="text-primary" />
            En-tête pour carte d'identité
          </h3>
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <img src={enTeteUrl} alt="En-tête carte" className="max-w-full h-auto rounded" />
          </div>
        </div>
      )}

      {/* Section aide avec animation */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <div className="flex items-start gap-3">
          <div className="p-1 bg-white rounded-full shadow-sm">
            <span className="text-primary text-sm font-bold block px-2">i</span>
          </div>
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">À propos de cette page</p>
            <p>
              Ces informations sont utilisées dans tout le système : en-têtes, rapports,
              bulletins, factures, cartes d'identité, etc. Assurez-vous qu'elles sont toujours à jour.
            </p>
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