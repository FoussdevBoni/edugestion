// src/pages/admin/eleves/ElevesPage.tsx
import { useState, useMemo, useRef, useEffect } from "react";
import {
  Plus, Download, MoreVertical, UserPlus, FileText, Search,
  Users, School, Camera, TrendingUp, Image, FileSpreadsheet, ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

// Components
import ElevesList from "../../../components/admin/lists/ElevesList";
import MenuModal, { Menu } from "../../../components/ui/MenuModal";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";
import ClasseFilter from "../../../components/wrappers/ClassesFilter";

// Hooks & Helpers
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import useEleves from "../../../hooks/eleves/useEleves";
import { alertServerError, alertSuccess, alertError } from "../../../helpers/alertError";
import { Inscription } from "../../../utils/types/data";
import useCarte from "../../../hooks/eleves/useCarte";
import useClasses from "../../../hooks/classes/useClasses";
import { compterParClasse } from "../../../utils/helpers/compterParClasse";
import PageLayout from "../../../layouts/PageLayout";
import { photoService } from "../../../services/photoService";
import { exportToExcelMultiSheet } from "../../../helpers/exportToExcel";

const StatCard = ({ label, value, icon, color, delay = 0 }: any) => {
  const colors: any = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
    green: "from-green-50 to-green-100 border-green-200 text-green-700",
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

export default function ElevesPage() {
  const navigate = useNavigate();

  const {
    niveauSelectionne, cycleSelectionne, niveauClasseSelectionne, classeSelectionne
  } = useEcoleNiveau();

  const { eleves, loading, deleteInscription, deleteManyInscriptions, refresh } = useEleves();
  const { classes } = useClasses();

  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [selectedEleve, setSelectedEleve] = useState<Inscription | null>(null);
  const [eleveToDelete, setEleveToDelete] = useState<Inscription | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsToDelete, setItemsToDelete] = useState<string[] | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // États pour l'upload photo
  const [eleveForPhoto, setEleveForPhoto] = useState<Inscription | null>(null);
  const [tempPhotoFile, setTempPhotoFile] = useState<File | null>(null);
  const [tempPhotoPreview, setTempPhotoPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  const filteredEleves = eleves.filter(eleve => {
    const matchesGlobal = (!niveauSelectionne || eleve.niveauScolaire === niveauSelectionne) &&
      (!cycleSelectionne || eleve.cycle === cycleSelectionne);
    const matchesLocal = (!niveauClasseSelectionne || eleve.niveauClasse === niveauClasseSelectionne) &&
      (!classeSelectionne || eleve.classe === classeSelectionne);
    const matchesSearch = searchTerm === "" ||
      eleve.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eleve.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (eleve.matricule || "").toLowerCase().includes(searchTerm.toLowerCase());

    return matchesGlobal && matchesLocal && matchesSearch;
  });

  
  const effectifsParClasse = compterParClasse(eleves, classes);

  const stats = useMemo(() => ({
    total: eleves.length,
    garcons: eleves.filter(e => e.sexe === 'M').length,
    filles: eleves.filter(e => e.sexe === 'F').length
  }), [eleves]);

  // Grouper les élèves par classe
  const groupElevesByClasse = useMemo(() => {
    const grouped: Record<string, Inscription[]> = {};
    const classesUniques = [...new Set(eleves.map(eleve => eleve.classe))];
    classesUniques.forEach(classe => {
      grouped[classe] = eleves.filter(eleve => eleve.classe === classe);
    });
    return grouped;
  }, [eleves]);

  // Formater les données d'un élève
  const formatEleveData = (eleve: Inscription) => ({
    Nom: eleve.nom || '',
    Prenom: eleve.prenom || '',
    Matricule: eleve.matricule || '',
    StatutScolaire: eleve.statutScolaire || '',
    DateNaissance: eleve.dateNaissance || '',
    LieuNaissance: eleve.lieuDeNaissance || '',
    Sexe: eleve.sexe === 'M' ? 'Masculin' : eleve.sexe === 'F' ? 'Féminin' : ''
  });

  // Exporter toutes les classes
  const handleExportAllClasses = async () => {
    setIsExporting(true);
    setIsExportMenuOpen(false);
    try {
      const sheets = Object.entries(groupElevesByClasse)
        .sort(([classeA], [classeB]) => classeA.localeCompare(classeB))
        .map(([classe, elevesDeLaClasse]) => ({
          name: classe.substring(0, 31),
          data: elevesDeLaClasse.map(formatEleveData),
          headers: [
            { key: 'Nom', label: 'NOM', width: 20 },
            { key: 'Prenom', label: 'PRÉNOM', width: 20 },
            { key: 'Matricule', label: 'MATRICULE', width: 15 },
            { key: 'StatutScolaire', label: 'STATUT SCOLAIRE', width: 20 },
            { 
              key: 'DateNaissance', 
              label: 'DATE DE NAISSANCE', 
              width: 15,
              format: (value: string) => {
                if (!value) return '';
                const date = new Date(value);
                if (isNaN(date.getTime())) return value;
                return date.toLocaleDateString('fr-FR');
              }
            },
            { key: 'LieuNaissance', label: 'LIEU DE NAISSANCE', width: 25 },
            { key: 'Sexe', label: 'SEXE', width: 10 }
          ]
        }));

      if (sheets.length === 0) {
        alertError("Aucune donnée à exporter");
        return;
      }

      // Ajouter une feuille de synthèse
      sheets.unshift({
        name: 'SYNTHESE',
        data: Object.entries(groupElevesByClasse).map(([classe, elevesDeLaClasse]) => ({
          Classe: classe,
          'Nombre total': elevesDeLaClasse.length,
          'Garçons': elevesDeLaClasse.filter(e => e.sexe === 'M').length,
          'Filles': elevesDeLaClasse.filter(e => e.sexe === 'F').length
        })) as any,
        headers: [
          { key: 'Classe', label: 'CLASSE', width: 20 },
          { key: 'Nombre total', label: 'NOMBRE TOTAL', width: 15 },
          { key: 'Garçons', label: 'GARÇONS', width: 12 },
          { key: 'Filles', label: 'FILLES', width: 12 }
        ]
      });

      const filename = `liste_eleves_par_classe_${new Date().toISOString().split('T')[0]}`;
      
      exportToExcelMultiSheet({
        sheets,
        filename,
        autoWidth: true,
        maxWidth: 50,
        dateFormat: 'DD/MM/YYYY',
        thousandSeparator: ' ',
        decimalSeparator: ','
      });

      alertSuccess("Export réussi !");
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      alertError("Erreur lors de l'export des données");
    } finally {
      setIsExporting(false);
    }
  };

  // Exporter la sélection (élèves filtrés)
  const handleExportFiltered = () => {
    setIsExportMenuOpen(false);
    
    if (filteredEleves.length === 0) {
      alertError("Aucun élève à exporter");
      return;
    }

    // Grouper les élèves filtrés par classe
    const groupedFiltered: Record<string, Inscription[]> = {};
    filteredEleves.forEach(eleve => {
      if (!groupedFiltered[eleve.classe]) {
        groupedFiltered[eleve.classe] = [];
      }
      groupedFiltered[eleve.classe].push(eleve);
    });

    const sheets = Object.entries(groupedFiltered)
      .sort(([classeA], [classeB]) => classeA.localeCompare(classeB))
      .map(([classe, elevesDeLaClasse]) => ({
        name: classe.substring(0, 31),
        data: elevesDeLaClasse.map(formatEleveData),
        headers: [
          { key: 'Nom', label: 'NOM', width: 20 },
          { key: 'Prenom', label: 'PRÉNOM', width: 20 },
          { key: 'Matricule', label: 'MATRICULE', width: 15 },
          { key: 'StatutScolaire', label: 'STATUT SCOLAIRE', width: 20 },
          { key: 'DateNaissance', label: 'DATE DE NAISSANCE', width: 15 },
          { key: 'LieuNaissance', label: 'LIEU DE NAISSANCE', width: 25 },
          { key: 'Sexe', label: 'SEXE', width: 10 }
        ]
      }));

    if (sheets.length === 0) {
      alertError("Aucune donnée à exporter");
      return;
    }

    const filename = `export_eleves_${new Date().toISOString().split('T')[0]}`;
    
    exportToExcelMultiSheet({
      sheets,
      filename,
      autoWidth: true,
      maxWidth: 50
    });

    alertSuccess(`${filteredEleves.length} élève(s) exporté(s) avec succès`);
  };

  const handleDelete = async () => {
    if (!eleveToDelete?.id) return;
    setIsDeleting(true);
    try {
      await deleteInscription(eleveToDelete.id);
      setEleveToDelete(null);
      alertSuccess("Élève supprimé avec succès");
    } catch (err) {
      alertServerError(err, "Erreur suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteMany = async () => {
    if (!itemsToDelete || itemsToDelete.length === 0) return;
    try {
      await deleteManyInscriptions(itemsToDelete);
      setItemsToDelete(null);
      alertSuccess(`${itemsToDelete.length} élève(s) supprimé(s) avec succès`);
    } catch (err) {
      alertServerError(err, "Erreur suppression multiple");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!eleveForPhoto?.matricule) {
      alertError(`
        Sans le numéro matricule , on ne peut pas ajouter une photo pour l'élève. Veillez ajouter 
        un numéro matricule à l'élève en cliquant sur "Modifier l'élève"
        `)
      return
    }

    if (!file) {
      alertError(`Veillez choisir une photo`)
      return
    };

    if (!file.type.startsWith('image/')) {
      alertError("Veuillez sélectionner une image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alertError("L'image ne doit pas dépasser 5MB");
      return;
    }

    setTempPhotoFile(file);
    const preview = URL.createObjectURL(file);
    setTempPhotoPreview(preview);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleValidateUpload = async () => {
    if (!tempPhotoFile || !eleveForPhoto?.matricule) return;

    setUploadingPhoto(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(tempPhotoFile);
      });

      await photoService.uploadElevePhoto(eleveForPhoto.matricule, base64);
      alertSuccess(`Photo ajoutée pour ${eleveForPhoto.prenom} ${eleveForPhoto.nom}`);
      refresh();

      setTempPhotoFile(null);
      if (tempPhotoPreview) URL.revokeObjectURL(tempPhotoPreview);
      setTempPhotoPreview(null);
      setEleveForPhoto(null);
    } catch (error) {
      console.error("Erreur upload photo:", error);
      alertError("Erreur lors de l'ajout de la photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCancelUpload = () => {
    setTempPhotoFile(null);
    if (tempPhotoPreview) URL.revokeObjectURL(tempPhotoPreview);
    setTempPhotoPreview(null);
    setEleveForPhoto(null);
  };

  const { handleDownload } = useCarte({ eleve: selectedEleve });

  const menuItems: Menu[] = [
    {
      label: "Ajouter un élève",
      icon: UserPlus,
      onClick: () => { navigate("/admin/eleves/new"); setIsAddMenuOpen(false); }
    },
    {
      label: "Importer liste",
      icon: Download,
      onClick: () => { navigate("/admin/eleves/import"); setIsAddMenuOpen(false); }
    },
    {
      label: "Transférer les élèves",
      icon: Users,
      onClick: () => { navigate("/admin/eleves/transfert"); setIsAddMenuOpen(false); }
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <PageLayout
      title="Gestion des élèves"
      description={`${filteredEleves.length} élèves affichés`}
      actions={
        <div className="flex items-center gap-3 animate-fade-in-up">
          <button
            onClick={() => navigate("/admin/eleves/upload-photos")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <Camera size={18} /> Photos
          </button>
          
          <button
            onClick={() => setIsAddMenuOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <Plus size={18} /> Nouvel élève
          </button>

          {/* Menu Exporter déroulant avec Portal */}
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileSpreadsheet size={18} />
              {isExporting ? 'Export...' : 'Exporter'}
              <ChevronDown size={16} className={`transition-transform duration-200 ${isExportMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isExportMenuOpen && createPortal(
              <div 
                className="fixed bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[99999]"
                style={{
                  top: exportMenuRef.current ? exportMenuRef.current.getBoundingClientRect().bottom + 5 : 0,
                  right: exportMenuRef.current ? window.innerWidth - exportMenuRef.current.getBoundingClientRect().right : 0,
                  width: '256px'
                }}
              >
                <button
                  onClick={handleExportAllClasses}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
                >
                  <FileSpreadsheet size={16} className="text-green-600" />
                  <div>
                    <div className="text-sm font-medium">Toutes les classes</div>
                    <div className="text-xs text-gray-400">Export par classe + synthèse</div>
                  </div>
                </button>
                <button
                  onClick={handleExportFiltered}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
                >
                  <Download size={16} className="text-blue-600" />
                  <div>
                    <div className="text-sm font-medium">Sélection actuelle</div>
                    <div className="text-xs text-gray-400">{filteredEleves.length} élève(s) à exporter</div>
                  </div>
                </button>
              </div>,
              document.body
            )}
          </div>
        </div>
      }
      menu={{
        isOpen: isAddMenuOpen,
        onClose: () => setIsAddMenuOpen(false),
        title: "Gestion des élèves",
        icon: <Plus className="text-primary" size={20} />,
        items: menuItems
      }}
    >
      {/* Input file caché pour l'upload photo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total élèves" value={stats.total} icon={<Users size={20} />} color="blue" delay={100} />
        <StatCard label="Garçons" value={stats.garcons} icon={<TrendingUp size={20} />} color="green" delay={200} />
        <StatCard label="Filles" value={stats.filles} icon={<Users size={20} />} color="purple" delay={300} />
      </div>

      {/* Stats rapides - Effectifs par classe */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-700">
          <School size={16} className="text-primary" /> Effectifs par classe
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(effectifsParClasse).sort().map(([classe, count]) => (
            <div key={classe} className="bg-gray-50 p-3 rounded-xl flex justify-between items-center text-sm transition-all duration-200 hover:bg-gray-100">
              <span className="font-medium text-gray-700">{classe}</span>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-bold text-xs">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recherche */}
      <div className="relative animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par nom, prénom ou matricule..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <span className="text-xs">✕</span>
          </button>
        )}
      </div>

      {/* Filtre par onglets */}
      <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <ClasseFilter
          data={eleves}
          getCycle={(e) => e.cycle}
          getNiveauClasse={(e) => e.niveauClasse}
          getClasse={(e) => e.classe}
        />
      </div>

      {/* Liste */}
      <div className="animate-fade-in-up" style={{ animationDelay: '700ms' }}>
        <ElevesList
          eleves={filteredEleves}
          selectable={true}
          onAction={(e) => setSelectedEleve(e)}
          selectActions={[
            {
              label: "Supprimer",
              onClick: (selectedItems) => {
                const ids = selectedItems.map(i => i.id);
                setItemsToDelete(ids);
              },
              className: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-md transition-all"
            },
            {
              label: "Exporter",
              onClick: (selectedItems) => {
                const sheets = [{
                  name: 'Selection',
                  data: selectedItems.map(formatEleveData),
                  headers: [
                    { key: 'Nom', label: 'NOM', width: 20 },
                    { key: 'Prenom', label: 'PRÉNOM', width: 20 },
                    { key: 'Matricule', label: 'MATRICULE', width: 15 },
                    { key: 'StatutScolaire', label: 'STATUT SCOLAIRE', width: 20 },
                    { key: 'DateNaissance', label: 'DATE DE NAISSANCE', width: 15 },
                    { key: 'LieuNaissance', label: 'LIEU DE NAISSANCE', width: 25 },
                    { key: 'Sexe', label: 'SEXE', width: 10 }
                  ]
                }];
                
                exportToExcelMultiSheet({
                  sheets,
                  filename: `export_${selectedItems.length}_eleves_${new Date().toISOString().split('T')[0]}`,
                  autoWidth: true
                });
                
                alertSuccess(`${selectedItems.length} élève(s) exporté(s)`);
              },
              className: "bg-primary text-white hover:shadow-md transition-all"
            }
          ]}
        />
      </div>

      {/* Menu modal pour élève sélectionné */}
      {selectedEleve && (
        <MenuModal
          title={`${selectedEleve.prenom} ${selectedEleve.nom}`}
          isOpen={!!selectedEleve}
          onClose={() => setSelectedEleve(null)}
          icon={<UserPlus className="text-primary" size={20} />}
          menu={[
            {
              label: "Voir détails",
              icon: FileText,
              onClick: () => { navigate("/admin/eleves/details", { state: selectedEleve }); setSelectedEleve(null); }
            },
            {
              label: "Modifier",
              icon: UserPlus,
              onClick: () => { navigate("/admin/eleves/update", { state: selectedEleve }); setSelectedEleve(null); }
            },
            {
              label: "Ajouter une photo",
              icon: Image,
              onClick: () => {
                setEleveForPhoto(selectedEleve);
                setSelectedEleve(null);
                setTimeout(() => fileInputRef.current?.click(), 100);
              }
            },
            {
              label: "Voir l'aperçu la carte",
              icon: FileText,
              onClick: () => { navigate("/admin/eleves/idcard-pdf-viewer", { state: selectedEleve }); 
              setSelectedEleve(null); }
            },
            {
              label: "Télécharger la carte",
              icon: Download,
              onClick: async () => { handleDownload(); }
            },
            {
              label: "Supprimer",
              icon: MoreVertical,
              onClick: () => { setEleveToDelete(selectedEleve); setSelectedEleve(null); }
            }
          ]}
        />
      )}

      {/* Modal confirmation suppression simple */}
      <DeleteConfirmationModal
        isOpen={!!eleveToDelete}
        onClose={() => setEleveToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer l'élève"
        message={`Voulez-vous vraiment supprimer ${eleveToDelete?.prenom} ${eleveToDelete?.nom} ? Cette action est irréversible.`}
        confirmText={isDeleting ? "Suppression..." : "Supprimer"}
        cancelText="Annuler"
      />

      {/* Modal confirmation suppression multiple */}
      <DeleteConfirmationModal
        isOpen={!!itemsToDelete && itemsToDelete.length > 0}
        onClose={() => setItemsToDelete(null)}
        onConfirm={handleDeleteMany}
        title="Supprimer les élèves"
        message={`Voulez-vous vraiment supprimer ${itemsToDelete?.length} élève(s) ? Cette action est irréversible.`}
      />

      {/* Modal d'aperçu et validation de la photo */}
      {eleveForPhoto && tempPhotoPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="text-center">
              <img
                src={tempPhotoPreview}
                alt="Aperçu"
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-primary/20"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Ajouter une photo
              </h3>
              <p className="text-gray-600 mb-4">
                {eleveForPhoto.prenom} {eleveForPhoto.nom}
              </p>
              {uploadingPhoto ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-sm text-gray-500">Upload en cours...</p>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelUpload}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleValidateUpload}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all"
                  >
                    Valider
                  </button>
                </div>
              )}
            </div>
          </div>
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
    </PageLayout>
  );
}