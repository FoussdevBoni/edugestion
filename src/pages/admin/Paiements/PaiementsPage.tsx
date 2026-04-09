// src/pages/admin/paiements/PaiementsPage.tsx
import { useState, useMemo } from "react";
import { Plus, MoreVertical, FileText, Printer, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Components
import PaiementsList from "../../../components/admin/lists/PaiementsList";
import MenuModal from "../../../components/ui/MenuModal";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";
import ClasseFilter from "../../../components/wrappers/ClassesFilter";

// Hooks & Helpers
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import { Paiement } from "../../../utils/types/data";
import usePaiements from "../../../hooks/paiements/usePaiements";
import { alertServerError } from "../../../helpers/alertError";
import useRecu from "../../../hooks/paiements/useRecu";

export default function PaiementsPage() {
  const navigate = useNavigate();

  // 1. Context & Data Hooks
  const {
    niveauSelectionne, cycleSelectionne, niveauClasseSelectionne, classeSelectionne
  } = useEcoleNiveau();

  const { paiements, deletePaiement, loading } = usePaiements();

  // 2. Local UI State
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);
  const [paiementToDelete, setPaiementToDelete] = useState<Paiement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("");
  const [selectedPeriode, setSelectedPeriode] = useState("");
  const [selectedMotif, setSelectedMotif] = useState("");


  // Extraire les motifs uniques
  const motifsDisponibles = useMemo(() => {
    const motifs = paiements
      .map(p => p.motif)
      .filter((motif): motif is string => !!motif);
    return ['', ...new Set(motifs)].sort();
  }, [paiements]);

  // 3. Filtrage dynamique
  const filteredPaiements = paiements.filter(paiement => {
    const ins = paiement.inscription;
    if (!ins) return false;

    // Filtres globaux (Context & Tabs)
    const matchesGlobal = (!niveauSelectionne || ins.niveauScolaire === niveauSelectionne) &&
      (!cycleSelectionne || ins.cycle === cycleSelectionne);

    const matchesLocalTabs = (!niveauClasseSelectionne || ins.niveauClasse === niveauClasseSelectionne) &&
      (!classeSelectionne || ins.classe === classeSelectionne);

    // Filtres locaux (Search, Statut, Période, Motif)
    const matchesSearch =
      ins.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ins.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ins.matricule?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatut = !selectedStatut || paiement.statut === selectedStatut;
    const matchesMotif = !selectedMotif || paiement.motif === selectedMotif;

    let matchesPeriode = true;
    if (selectedPeriode) {
      const datePaiement = new Date(paiement.datePayement);
      const [year, month] = selectedPeriode.split('-');
      matchesPeriode = datePaiement.getMonth() + 1 === parseInt(month) &&
        datePaiement.getFullYear() === parseInt(year);
    }

    return matchesGlobal && matchesLocalTabs && matchesSearch &&
      matchesStatut && matchesPeriode && matchesMotif;
  });

  const { handleDownload } = useRecu({ paiement: selectedPaiement })

  // 4. Handlers
  const handleDelete = async () => {
    if (!paiementToDelete?.id) return;
    try {
      await deletePaiement(paiementToDelete.id);
      setPaiementToDelete(null);
    } catch (error) {
      alertServerError(error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatut("");
    setSelectedPeriode("");
    setSelectedMotif("");
  };

  if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Paiements</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredPaiements.length} paiement{filteredPaiements.length > 1 ? 's' : ''} affiché{filteredPaiements.length > 1 ? 's' : ''}
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/paiements/new")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} /> Nouveau paiement
        </button>
      </div>

      {/* Filtres Locaux */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un élève..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <select
          value={selectedStatut}
          onChange={(e) => setSelectedStatut(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 bg-white"
        >
          <option value="">Tous les statuts</option>
          <option value="paye">Payé</option>
          <option value="partiellement">Partiellement payé</option>
          <option value="impaye">Impayé</option>
        </select>

        <select
          value={selectedMotif}
          onChange={(e) => setSelectedMotif(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 bg-white"
        >
          <option value="">Tous les motifs</option>
          {motifsDisponibles.filter(m => m !== '').map(motif => (
            <option key={motif} value={motif}>{motif}</option>
          ))}
        </select>

        <input
          type="month"
          value={selectedPeriode}
          onChange={(e) => setSelectedPeriode(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 bg-white"
        />
      </div>

      {/* FILTRES PAR TABS (Niveau & Classe) */}
      <ClasseFilter
        data={paiements}
        getCycle={(p) => p.inscription?.cycle}
        getNiveauClasse={(p) => p.inscription?.niveauClasse}
        getClasse={(p) => p.inscription?.classe}
      >

      </ClasseFilter>

      {/* Liste */}
      <PaiementsList
        paiements={filteredPaiements}
        onAction={setSelectedPaiement}
      />

      {/* Message si aucun résultat */}
      {filteredPaiements.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun paiement trouvé</p>
          {(searchTerm || selectedStatut || selectedPeriode || selectedMotif) && (
            <button onClick={clearFilters} className="mt-4 text-primary text-sm font-medium">
              Effacer les filtres
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {selectedPaiement && (
        <MenuModal
          title={`Paiement #${selectedPaiement.id.slice(-6)}`}
          isOpen={!!selectedPaiement}
          onClose={() => setSelectedPaiement(null)}
          icon={<FileText className="text-primary" size={20} />}
          menu={[
            {
              label: "Voir détails",
              icon: FileText,
              onClick: () => { navigate("/admin/paiements/details", { state: selectedPaiement }); setSelectedPaiement(null); }
            },
            {
              label: "Modifier",
              icon: Plus,
              onClick: () => { navigate("/admin/paiements/update", { state: selectedPaiement }); setSelectedPaiement(null); }
            },
            {
              label: "Imprimer le reçu",
              icon: Printer,
              onClick: () => {
                handleDownload()
                setSelectedPaiement(null);
              }
            },
            {
              label: "Supprimer",
              icon: MoreVertical,
              onClick: () => { setPaiementToDelete(selectedPaiement); setSelectedPaiement(null); }
            }
          ]}
        />
      )}

      <DeleteConfirmationModal
        isOpen={!!paiementToDelete}
        onClose={() => setPaiementToDelete(null)}
        onConfirm={handleDelete}
        title="Supprimer le paiement"
        message="Voulez-vous vraiment supprimer ce paiement ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}