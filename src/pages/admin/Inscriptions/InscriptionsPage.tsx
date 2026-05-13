// src/pages/admin/inscriptions/InscriptionsPage.tsx
import { useState, useEffect, useMemo, useRef } from "react";
import { Plus, MoreVertical, FileText, Search, Calendar, Users, Download, FileSpreadsheet, ChevronDown, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

// Components
import InscriptionsList from "../../../components/admin/lists/InscriptionsList";
import MenuModal, { Menu } from "../../../components/ui/MenuModal";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";
import ClasseFilter from "../../../components/wrappers/ClassesFilter";

// Hooks & Helpers
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import { Inscription } from "../../../utils/types/data";
import useInscriptions from "../../../hooks/inscriptions/useInscriptions";
import { alertSuccess, alertError } from "../../../helpers/alertError";
import PageLayout from "../../../layouts/PageLayout";
import { exportToExcelMultiSheet } from "../../../helpers/exportToExcel";
import { StatutPayement } from "../../../utils/types/base";

const StatCard = ({ label, value, icon, color, delay = 0 }: any) => {
  const colors: any = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
    green: "from-green-50 to-green-100 border-green-200 text-green-700",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-700",
    yellow: "from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700",
    red: "from-red-50 to-red-100 border-red-200 text-red-700",
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

export default function InscriptionsPage() {
  const navigate = useNavigate();

  const {
    niveauSelectionne,
    cycleSelectionne,
    niveauClasseSelectionne,
    classeSelectionne
  } = useEcoleNiveau();

  const { inscriptions, loading, deleteInscription, updateInscription } = useInscriptions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInscription, setSelectedInscription] = useState<Inscription | null>(null);
  const [inscriptionToDelete, setInscriptionToDelete] = useState<Inscription | null>(null);
  const [inscriptionsToUpdate, setInscriptionsToUpdate] = useState<Inscription[]>([]);
  const [newPaymentStatus, setNewPaymentStatus] = useState<StatutPayement>('impaye');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAnnee, setSelectedAnnee] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  const anneesDisponibles = useMemo(() => {
    return [...new Set(inscriptions.map(ins => ins.anneeScolaire))].sort().reverse();
  }, [inscriptions]);

  useEffect(() => {
    if (anneesDisponibles.length > 0 && !selectedAnnee) {
      setSelectedAnnee(anneesDisponibles[0]);
    }
  }, [anneesDisponibles, selectedAnnee]);

  const inscriptionsDeLAnnee = useMemo(() => {
    return inscriptions.filter(ins => !selectedAnnee || ins.anneeScolaire === selectedAnnee);
  }, [inscriptions, selectedAnnee]);

  const filteredInscriptions = useMemo(() => {
    return inscriptionsDeLAnnee.filter(ins => {
      const matchesNiveauGlobal = !niveauSelectionne || ins.niveauScolaire === niveauSelectionne;
      const matchesCycleGlobal = !cycleSelectionne || ins.cycle === cycleSelectionne;
      const matchesNiveauClasse = !niveauClasseSelectionne || ins.niveauClasse === niveauClasseSelectionne;
      const matchesClasse = !classeSelectionne || ins.classe === classeSelectionne;

      const matchesSearch =
        ins.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ins.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ins.matricule || "").toLowerCase().includes(searchTerm.toLowerCase());

      return matchesNiveauGlobal && matchesCycleGlobal && matchesNiveauClasse && matchesClasse && matchesSearch;
    });
  }, [inscriptionsDeLAnnee, niveauSelectionne, cycleSelectionne, niveauClasseSelectionne, classeSelectionne, searchTerm]);

  // Statistiques
  const stats = useMemo(() => ({
    total: filteredInscriptions.length,
    garcons: filteredInscriptions.filter(i => i.sexe === 'M').length,
    filles: filteredInscriptions.filter(i => i.sexe === 'F').length,
    payes: filteredInscriptions.filter(i => i.statutPayement === 'paye').length,
    partiellement: filteredInscriptions.filter(i => i.statutPayement === 'partiellement').length,
    impayes: filteredInscriptions.filter(i => i.statutPayement === 'impaye').length,
  }), [filteredInscriptions]);

  // Grouper les inscriptions par classe
  const groupInscriptionsByClasse = useMemo(() => {
    const grouped: Record<string, Inscription[]> = {};
    const classesUniques = [...new Set(filteredInscriptions.map(ins => ins.classe))];
    classesUniques.forEach(classe => {
      grouped[classe] = filteredInscriptions.filter(ins => ins.classe === classe);
    });
    return grouped;
  }, [filteredInscriptions]);

  // Formater les données d'une inscription
  const formatInscriptionData = (inscription: Inscription) => ({
    'Nom': inscription.nom || '',
    'Prénom': inscription.prenom || '',
    'Matricule': inscription.matricule || '',
    'Classe': inscription.classe || '',
    'Niveau Classe': inscription.niveauClasse || '',
    'Statut Scolaire': inscription.statutScolaire || '',
    'Statut Paiement': inscription.statutPayement || '',
    'Date Inscription': inscription.dateInscription ? new Date(inscription.dateInscription).toLocaleDateString('fr-FR') : '',
    'Année Scolaire': inscription.anneeScolaire || '',
    'Sexe': inscription.sexe === 'M' ? 'Masculin' : inscription.sexe === 'F' ? 'Féminin' : ''
  });

  // Exporter toutes les inscriptions
  const handleExportAll = async () => {
    setIsExporting(true);
    setIsExportMenuOpen(false);
    try {
      const sheets = Object.entries(groupInscriptionsByClasse)
        .sort(([classeA], [classeB]) => classeA.localeCompare(classeB))
        .map(([classe, inscriptionsDeLaClasse]) => ({
          name: classe.substring(0, 31),
          data: inscriptionsDeLaClasse.map(formatInscriptionData),
        }));

      if (sheets.length === 0) {
        alertError("Aucune donnée à exporter");
        return;
      }

      // Ajouter une feuille de synthèse
      sheets.unshift({
        name: 'SYNTHESE',
        data: [{
          'Total inscriptions': stats.total,
          'Garçons': stats.garcons,
          'Filles': stats.filles,
          'Paiements effectués': stats.payes,
          'Paiements partiels': stats.partiellement,
          'Paiements impayés': stats.impayes,
          'Année scolaire': selectedAnnee,
        }] as any
      });

      const filename = `inscriptions_${selectedAnnee}_${new Date().toISOString().split('T')[0]}`;

      exportToExcelMultiSheet({
        sheets,
        filename,
        autoWidth: true,
        maxWidth: 50,
      });

      alertSuccess("Export réussi !");
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      alertError("Erreur lors de l'export des données");
    } finally {
      setIsExporting(false);
    }
  };

  // Exporter la sélection filtrée
  const handleExportFiltered = () => {
    setIsExportMenuOpen(false);

    if (filteredInscriptions.length === 0) {
      alertError("Aucune inscription à exporter");
      return;
    }

    const groupedFiltered: Record<string, Inscription[]> = {};
    filteredInscriptions.forEach(inscription => {
      if (!groupedFiltered[inscription.classe]) {
        groupedFiltered[inscription.classe] = [];
      }
      groupedFiltered[inscription.classe].push(inscription);
    });

    const sheets = Object.entries(groupedFiltered)
      .sort(([classeA], [classeB]) => classeA.localeCompare(classeB))
      .map(([classe, inscriptionsDeLaClasse]) => ({
        name: classe.substring(0, 31),
        data: inscriptionsDeLaClasse.map(formatInscriptionData),
      }));

    if (sheets.length === 0) {
      alertError("Aucune donnée à exporter");
      return;
    }

    const filename = `export_inscriptions_${new Date().toISOString().split('T')[0]}`;

    exportToExcelMultiSheet({
      sheets,
      filename,
      autoWidth: true,
      maxWidth: 50,
    });

    alertSuccess(`${filteredInscriptions.length} inscription(s) exportée(s) avec succès`);
  };

  // Changer le statut de paiement pour plusieurs inscriptions
  const handleChangePaymentStatus = (selectedItems: Inscription[]) => {
    setInscriptionsToUpdate(selectedItems);
    setIsPaymentModalOpen(true);
  };

  // Valider le changement de statut
  const handleConfirmPaymentUpdate = async () => {
    setIsUpdatingPayment(true);
    try {
      const updatePromises = inscriptionsToUpdate.map(inscription =>
        updateInscription(inscription.id, { ...inscription, statutPayement: newPaymentStatus })
      );
      
      await Promise.all(updatePromises);
      
      alertSuccess(`${inscriptionsToUpdate.length} inscription(s) mise(s) à jour avec succès`);
      setIsPaymentModalOpen(false);
      setInscriptionsToUpdate([]);
      setNewPaymentStatus('impaye');
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alertError("Erreur lors de la mise à jour des statuts");
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  const handleDelete = async () => {
    if (!inscriptionToDelete?.id) return;
    setIsDeleting(true);
    try {
      await deleteInscription(inscriptionToDelete.id);
      setInscriptionToDelete(null);
      alertSuccess("Inscription supprimée avec succès");
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const menuItems: Menu[] = [
    {
      label: "Nouvel élève",
      icon: Plus,
      onClick: () => { navigate("/admin/eleves/new"); setIsModalOpen(false); }
    },
    {
      label: "Réinscrire les élèves",
      icon: Users,
      onClick: () => { navigate("/admin/inscriptions/new"); setIsModalOpen(false); }
    }
  ];

  if (loading) return (
    <div className="flex justify-center p-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );

  return (
    <PageLayout
      title="Inscriptions"
      description={`${filteredInscriptions.length} inscription${filteredInscriptions.length > 1 ? 's' : ''} affichée${filteredInscriptions.length > 1 ? 's' : ''}`}
      actions={
        <div className="flex items-center gap-3 animate-fade-in-up">
          {/* Menu Exporter déroulant */}
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
                  onClick={handleExportAll}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
                >
                  <FileSpreadsheet size={16} className="text-green-600" />
                  <div>
                    <div className="text-sm font-medium">Toutes les inscriptions</div>
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
                    <div className="text-xs text-gray-400">{filteredInscriptions.length} inscription(s) à exporter</div>
                  </div>
                </button>
              </div>,
              document.body
            )}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <Plus size={18} /> Nouvelles inscriptions
          </button>
        </div>
      }
      menu={{
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        title: "Gestion des inscriptions",
        icon: <Plus className="text-primary" size={20} />,
        items: menuItems
      }}
    >
      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total inscriptions" value={stats.total} icon={<Users size={20} />} color="blue" delay={100} />
        <StatCard label="Garçons" value={stats.garcons} icon={<Users size={20} />} color="green" delay={200} />
        <StatCard label="Filles" value={stats.filles} icon={<Users size={20} />} color="purple" delay={300} />
        <StatCard label="Payés" value={stats.payes} icon={<CreditCard size={20} />} color="green" delay={400} />
        <StatCard label="Impayés" value={stats.impayes} icon={<CreditCard size={20} />} color="red" delay={500} />
      </div>

      {/* Barre de Filtres Principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un élève..."
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

        <div className="relative">
          <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={selectedAnnee}
            onChange={(e) => setSelectedAnnee(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200 appearance-none bg-white"
          >
            {anneesDisponibles.map(annee => (
              <option key={annee} value={annee}>{annee}</option>
            ))}
          </select>
        </div>
      </div>

      {/* FILTRES PAR TABS */}
      <div className="animate-fade-in-up" style={{ animationDelay: '700ms' }}>
        <ClasseFilter
          data={inscriptionsDeLAnnee}
          getCycle={(ins) => ins.cycle}
          getNiveauClasse={(ins) => ins.niveauClasse}
          getClasse={(ins) => ins.classe}
        />
      </div>

      {/* Liste finale filtrée */}
      <div className="animate-fade-in-up" style={{ animationDelay: '800ms' }}>
        <InscriptionsList
          inscriptions={filteredInscriptions}
          onAction={setSelectedInscription}
          selectable={true}
          selectActions={[
            {
              label: "Changer le statut de paiement",
              onClick: handleChangePaymentStatus,
              className: "bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:shadow-md transition-all"
            }
          ]}
        />
      </div>

      {/* Modals */}
      <MenuModal
        menu={menuItems}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Gestion des inscriptions"
        icon={<Plus className="text-primary" size={20} />}
      />

      {/* Modal pour changer le statut de paiement */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={24} className="text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Changer le statut de paiement
              </h3>
              <p className="text-gray-600 mb-4">
                Vous allez modifier le statut de paiement de <strong>{inscriptionsToUpdate.length}</strong> inscription(s)
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Nouveau statut
                </label>
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value as StatutPayement)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200"
                >
                  <option value="impaye">Impayé</option>
                  <option value="partiellement">Partiellement payé</option>
                  <option value="paye">Payé</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsPaymentModalOpen(false);
                    setInscriptionsToUpdate([]);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmPaymentUpdate}
                  disabled={isUpdatingPayment}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingPayment ? "Mise à jour..." : "Confirmer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedInscription && (
        <MenuModal
          title={`${selectedInscription.prenom} ${selectedInscription.nom}`}
          isOpen={!!selectedInscription}
          onClose={() => setSelectedInscription(null)}
          icon={<FileText className="text-primary" size={20} />}
          menu={[
            {
              label: "Voir détails",
              icon: FileText,
              onClick: () => { navigate("/admin/inscriptions/details", { state: selectedInscription }); setSelectedInscription(null); }
            },
            {
              label: "Modifier",
              icon: Plus,
              onClick: () => { navigate("/admin/inscriptions/update", { state: selectedInscription }); setSelectedInscription(null); }
            },
            {
              label: "Changer statut paiement",
              icon: CreditCard,
              onClick: () => {
                handleChangePaymentStatus([selectedInscription]);
                setSelectedInscription(null);
              }
            },
            {
              label: "Supprimer",
              icon: MoreVertical,
              onClick: () => { setInscriptionToDelete(selectedInscription); setSelectedInscription(null); }
            }
          ]}
        />
      )}

      <DeleteConfirmationModal
        isOpen={!!inscriptionToDelete}
        onClose={() => setInscriptionToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer l'inscription"
        message={`Voulez-vous vraiment supprimer l'inscription de ${inscriptionToDelete?.prenom} ${inscriptionToDelete?.nom} ? Cette action est irréversible.`}
        confirmText={isDeleting ? "Suppression..." : "Supprimer"}
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