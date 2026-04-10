import { useState, useMemo } from "react";
import { Plus, MoreVertical, FileText, Printer, Search, CreditCard } from "lucide-react";
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
import { alertServerError, alertSuccess } from "../../../helpers/alertError";
import useRecu from "../../../hooks/paiements/useRecu";
import PageLayout from "../../../layouts/PageLayout";

export default function PaiementsPage() {
  const navigate = useNavigate();

  const {
    niveauSelectionne, cycleSelectionne, niveauClasseSelectionne, classeSelectionne
  } = useEcoleNiveau();

  const { paiements, deletePaiement, loading } = usePaiements();

  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);
  const [paiementToDelete, setPaiementToDelete] = useState<Paiement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatut, setSelectedStatut] = useState("");
  const [selectedPeriode, setSelectedPeriode] = useState("");
  const [selectedMotif, setSelectedMotif] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const motifsDisponibles = useMemo(() => {
    const motifs = paiements
      .map(p => p.motif)
      .filter((motif): motif is string => !!motif);
    return ['', ...new Set(motifs)].sort();
  }, [paiements]);

  const filteredPaiements = paiements.filter(paiement => {
    const ins = paiement.inscription;
    if (!ins) return false;

    const matchesGlobal = (!niveauSelectionne || ins.niveauScolaire === niveauSelectionne) &&
      (!cycleSelectionne || ins.cycle === cycleSelectionne);

    const matchesLocalTabs = (!niveauClasseSelectionne || ins.niveauClasse === niveauClasseSelectionne) &&
      (!classeSelectionne || ins.classe === classeSelectionne);

    const matchesSearch = searchTerm === "" ||
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

  const { handleDownload } = useRecu({ paiement: selectedPaiement });

  const handleDelete = async () => {
    if (!paiementToDelete?.id) return;
    setIsDeleting(true);
    try {
      await deletePaiement(paiementToDelete.id);
      setPaiementToDelete(null);
      alertSuccess("Paiement supprimé avec succès");
    } catch (error) {
      alertServerError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatut("");
    setSelectedPeriode("");
    setSelectedMotif("");
  };

  if (loading) return (
    <div className="flex justify-center p-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );

  return (
    <PageLayout
      title="Paiements"
      description={`${filteredPaiements.length} paiement${filteredPaiements.length > 1 ? 's' : ''} affiché${filteredPaiements.length > 1 ? 's' : ''}`}
      actions={
        <button
          onClick={() => navigate("/admin/paiements/new")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
        >
          <Plus size={18} /> Nouveau paiement
        </button>
      }
    >
      {/* Filtres Locaux avec animation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
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

        <select
          value={selectedStatut}
          onChange={(e) => setSelectedStatut(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200 bg-white"
        >
          <option value="">Tous les statuts</option>
          <option value="paye">Payé</option>
          <option value="partiellement">Partiellement payé</option>
          <option value="impaye">Impayé</option>
        </select>

        <select
          value={selectedMotif}
          onChange={(e) => setSelectedMotif(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200 bg-white"
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
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200 bg-white"
        />
      </div>

      {/* FILTRES PAR TABS avec animation */}
      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <ClasseFilter
          data={paiements}
          getCycle={(p) => p.inscription?.cycle}
          getNiveauClasse={(p) => p.inscription?.niveauClasse}
          getClasse={(p) => p.inscription?.classe}
        />
      </div>

      {/* Liste avec animation */}
      <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <PaiementsList
          paiements={filteredPaiements}
          onAction={setSelectedPaiement}
        />
      </div>

      {/* Message si aucun résultat */}
      {filteredPaiements.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <CreditCard size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Aucun paiement trouvé</p>
          {(searchTerm || selectedStatut || selectedPeriode || selectedMotif) && (
            <button onClick={clearFilters} className="mt-3 text-sm text-primary hover:underline font-medium">
              Effacer les filtres
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {selectedPaiement && (
        <MenuModal
          title={`Paiement #${selectedPaiement.id?.slice(-6)}`}
          isOpen={!!selectedPaiement}
          onClose={() => setSelectedPaiement(null)}
          icon={<CreditCard className="text-primary" size={20} />}
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
                handleDownload();
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