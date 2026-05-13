// src/pages/admin/DataManagementPage.tsx
import { useState, useRef } from "react";
import {
  Database,
  Download,
  Upload,
  Trash2,
  FileJson,
  AlertTriangle,
  RefreshCw,
  School,
  HardDrive
} from "lucide-react";
import { alertError, alertSuccess } from "../../../helpers/alertError";
import { resetService } from "../../../services/resetService";
import PageLayout from "../../../layouts/PageLayout";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";

const StatCard = ({ label, value, icon, color, delay = 0 }: any) => {
  const colors: any = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
    green: "from-green-50 to-green-100 border-green-200 text-green-700",
    red: "from-red-50 to-red-100 border-red-200 text-red-700",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-700",
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl border p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in-up`} style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-3 bg-white/50 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default function DataManagementPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Dialog states
  const [resetDialog, setResetDialog] = useState<{
    open: boolean;
    type: 'all' | 'scolaire';
  }>({ open: false, type: 'all' });
  
  const [importDialog, setImportDialog] = useState<{
    open: boolean;
    fileContent?: string;
  }>({ open: false });

  const handleExportFullDatabase = async () => {
    setIsExporting(true);
    try {
      const result = await resetService.exportDatabase({
        minify: false,
        exclude: []
      });
      
      if (result.success) {
        alertSuccess(`Base de données exportée avec succès !\n${result.filePath}\nTaille: ${(result.size! / 1024).toFixed(2)} KB`);
      } else {
        alertError(result.message);
      }
    } catch (error) {
      console.error("Erreur export:", error);
      alertError("Erreur lors de l'export de la base de données");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportScolaireData = async () => {
    setIsExporting(true);
    try {
      const result = await resetService.exportScolaireData();
      
      if (result.success) {
        alertSuccess(`Données scolaires exportées avec succès !\n${result.filePath}`);
      } else {
        alertError(result.message);
      }
    } catch (error) {
      console.error("Erreur export scolaire:", error);
      alertError("Erreur lors de l'export des données scolaires");
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Lire le fichier côté renderer
      const content = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
      });

      setImportDialog({ open: true, fileContent: content });
    } catch (error) {
      console.error("Erreur lecture fichier:", error);
      alertError("Erreur lors de la lecture du fichier");
    }
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImportDatabase = async () => {
    if (!importDialog.fileContent) return;
    
    setImportDialog({ open: false, fileContent: undefined });
    setIsImporting(true);
    try {
      const result = await resetService.importDatabase(importDialog.fileContent, false);
      
      if (result.success) {
        alertSuccess("Base de données importée avec succès ! L'application va se recharger.");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        alertError(result.message);
      }
    } catch (error) {
      console.error("Erreur import:", error);
      alertError("Erreur lors de l'import de la base de données");
    } finally {
      setIsImporting(false);
    }
  };

  const handleResetAll = async () => {
    setResetDialog({ open: false, type: 'all' });
    setIsResetting(true);
    try {
      const result = await resetService.resetDatabase();
      
      if (result.success) {
        alertSuccess("Base de données réinitialisée avec succès ! L'application va se recharger.");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        alertError(result.message);
      }
    } catch (error) {
      console.error("Erreur reset:", error);
      alertError("Erreur lors de la réinitialisation");
    } finally {
      setIsResetting(false);
    }
  };

  const handleResetScolaire = async () => {
    setResetDialog({ open: false, type: 'scolaire' });
    setIsResetting(true);
    try {
      const result = await resetService.resetScolaireData();
      
      if (result.success) {
        alertSuccess("Données scolaires réinitialisées avec succès ! L'application va se recharger.");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        alertError(result.message);
      }
    } catch (error) {
      console.error("Erreur reset scolaire:", error);
      alertError("Erreur lors de la réinitialisation des données scolaires");
    } finally {
      setIsResetting(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <PageLayout
      title="Gestion des données"
      description="Exportez, importez ou réinitialisez votre base de données"
      actions={
        <div className="flex items-center gap-3 animate-fade-in-up">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={openFileDialog}
            disabled={isImporting}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={18} />
            {isImporting ? 'Import...' : 'Importer'}
          </button>
        </div>
      }
    >
      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard 
          label="Base de données" 
          value="JSON" 
          icon={<Database size={20} />} 
          color="blue" 
          delay={100} 
        />
        <StatCard 
          label="Export disponible" 
          value="Complet + Scolaire" 
          icon={<FileJson size={20} />} 
          color="green" 
          delay={200} 
        />
        <StatCard 
          label="Sauvegarde" 
          value="Recommandée" 
          icon={<HardDrive size={20} />} 
          color="purple" 
          delay={300} 
        />
      </div>

      {/* Section Export */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <Download size={20} className="text-green-600" />
          Exporter les données
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleExportFullDatabase}
            disabled={isExporting}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl border border-gray-200 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database size={20} className="text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-800">Export complet</div>
                <div className="text-xs text-gray-500">Toute la base de données (JSON)</div>
              </div>
            </div>
            {isExporting ? (
              <RefreshCw size={18} className="animate-spin text-gray-400" />
            ) : (
              <Download size={18} className="text-gray-400" />
            )}
          </button>

          <button
            onClick={handleExportScolaireData}
            disabled={isExporting}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl border border-gray-200 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <School size={20} className="text-green-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-800">Export scolaire uniquement</div>
                <div className="text-xs text-gray-500">Élèves, classes, notes, etc.</div>
              </div>
            </div>
            {isExporting ? (
              <RefreshCw size={18} className="animate-spin text-gray-400" />
            ) : (
              <Download size={18} className="text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Section Réinitialisation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <Trash2 size={20} className="text-red-600" />
          Réinitialiser les données
        </h3>
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">Attention : Opération irréversible !</p>
                <p className="text-amber-700">
                  La réinitialisation supprime définitivement les données. 
                  Nous vous recommandons d'exporter vos données avant toute réinitialisation.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setResetDialog({ open: true, type: 'scolaire' })}
              disabled={isResetting}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-xl border border-red-200 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <School size={20} className="text-red-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-800">Réinitialiser données scolaires</div>
                  <div className="text-xs text-gray-500">Conserve licence & infos école</div>
                </div>
              </div>
              <Trash2 size={18} className="text-red-400" />
            </button>

            <button
              onClick={() => setResetDialog({ open: true, type: 'all' })}
              disabled={isResetting}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl border border-red-600 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-200 rounded-lg">
                  <Database size={20} className="text-red-700" />
                </div>
                <div className="text-left text-white">
                  <div className="font-semibold">Réinitialisation complète</div>
                  <div className="text-xs text-red-100">Toute la base (sauf licence)</div>
                </div>
              </div>
              <AlertTriangle size={18} className="text-red-200" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal confirmation réinitialisation */}
      <DeleteConfirmationModal
        isOpen={resetDialog.open}
        onClose={() => setResetDialog({ open: false, type: 'all' })}
        onConfirm={resetDialog.type === 'all' ? handleResetAll : handleResetScolaire}
        title={resetDialog.type === 'all' ? "Réinitialisation complète" : "Réinitialisation des données scolaires"}
        message={resetDialog.type === 'all' 
          ? "Voulez-vous vraiment réinitialiser TOUTE la base de données ? Cette action est irréversible et supprimera toutes les données (élèves, classes, notes, etc.). La licence sera conservée."
          : "Voulez-vous vraiment réinitialiser les données scolaires ? Cette action supprimera les élèves, classes, notes, bulletins, etc. Les informations de l'école et la licence seront conservées."
        }
        confirmText={isResetting ? "Réinitialisation..." : "Confirmer"}
        cancelText="Annuler"
      />

      {/* Modal confirmation import */}
      <DeleteConfirmationModal
        isOpen={importDialog.open}
        onClose={() => setImportDialog({ open: false, fileContent: undefined })}
        onConfirm={handleImportDatabase}
        title="Importer une base de données"
        message="L'import va remplacer toutes les données actuelles. Êtes-vous sûr de vouloir continuer ? Nous vous recommandons d'exporter vos données actuelles avant l'import."
        confirmText={isImporting ? "Import..." : "Confirmer l'import"}
        cancelText="Annuler"
      />

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
    </PageLayout>
  );
}