// src/pages/admin/configuration/periodes/PeriodesPage.tsx
import { useState, useMemo } from "react";
import { Plus, MoreVertical, FileText, Printer, Search, Calendar, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PeriodesList from "../../../../components/admin/lists/PeriodesList";
import MenuModal from "../../../../components/ui/MenuModal";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import { Periode } from "../../../../utils/types/data";
import { alertError, alertSuccess } from "../../../../helpers/alertError";
import usePeriodes from "../../../../hooks/periodes/usePeriodes";
import { useEcoleNiveau } from "../../../../hooks/filters/useEcoleNiveau";
import PageLayout from "../../../../layouts/PageLayout";

export default function PeriodesPage() {
  const navigate = useNavigate();
  const [selectedPeriode, setSelectedPeriode] = useState<Periode | null>(null);
  const [periodeToDelete, setPeriodeToDelete] = useState<Periode | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { niveauSelectionne } = useEcoleNiveau();
  const { periodes, deletePeriode } = usePeriodes();

  const filteredPeriodes = useMemo(() => {
    let filtered = periodes;

    if (niveauSelectionne) {
      filtered = filtered.filter(periode =>
        periode.niveauScolaire === niveauSelectionne
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(periode =>
        periode.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        periode.niveauScolaire.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [periodes, niveauSelectionne, searchTerm]);

  const handleDelete = async () => {
    if (!periodeToDelete?.id) {
      alertError();
      return;
    }
    setIsDeleting(true);
    try {
      await deletePeriode(periodeToDelete.id);
      setPeriodeToDelete(null);
      setSelectedPeriode(null);
      alertSuccess("Période supprimée avec succès");
    } catch (error) {
      alertError();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAction = (periode: Periode) => {
    setSelectedPeriode(periode);
  };

  const handleCloseMenuModal = () => {
    setSelectedPeriode(null);
  };

  const handleCloseDeleteModal = () => {
    setPeriodeToDelete(null);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <PageLayout
      title="Périodes scolaires"
      description={`${filteredPeriodes.length} période${filteredPeriodes.length > 1 ? 's' : ''}
        ${niveauSelectionne && ` - ${niveauSelectionne}`}`}
      actions={
        <button
          onClick={() => navigate("/admin/configuration/periodes/new")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
        >
          <Plus size={18} />
          Nouvelle période
        </button>
      }
    >
      {/* Barre de recherche avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une période par nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <span className="text-xs">✕</span>
            </button>
          )}
        </div>
      </div>

      {/* Indicateur des filtres actifs */}
      {niveauSelectionne && (
        <div className="flex items-center gap-2 text-sm text-gray-600 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <Filter size={14} className="text-primary" />
          <span>Filtre actif:</span>
          <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
            {niveauSelectionne}
          </span>
        </div>
      )}

      {/* Liste avec animation */}
      <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <PeriodesList
          periodes={filteredPeriodes}
          onAction={handleAction}
        />
      </div>

      {/* Message si aucun résultat avec animation */}
      {filteredPeriodes.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">
            {niveauSelectionne
              ? `Aucune période pour ${niveauSelectionne}`
              : "Aucune période trouvée"
            }
          </p>
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Effacer la recherche
            </button>
          )}
        </div>
      )}

      {/* Modal actions sur une période */}
      {selectedPeriode && (
        <MenuModal
          menu={[
            {
              label: "Voir détails",
              icon: FileText,
              onClick: () => {
                navigate("/admin/configuration/periodes/details", { state: selectedPeriode });
                setSelectedPeriode(null);
              }
            },
            {
              label: "Modifier",
              icon: Plus,
              onClick: () => {
                navigate("/admin/configuration/periodes/update", { state: selectedPeriode });
                setSelectedPeriode(null);
              }
            },
            {
              label: "Gérer les évaluations",
              icon: Printer,
              onClick: () => {
                navigate("/admin/configuration/evaluations", {
                  state: {
                    periodeId: selectedPeriode.id,
                    niveauSelectionne: selectedPeriode.niveauScolaire
                  }
                });
                setSelectedPeriode(null);
              }
            },
            {
              label: "Supprimer",
              icon: MoreVertical,
              onClick: () => {
                setPeriodeToDelete(selectedPeriode);
                setSelectedPeriode(null);
              }
            }
          ]}
          isOpen={!!selectedPeriode}
          onClose={handleCloseMenuModal}
          title={selectedPeriode.nom}
          icon={<Calendar className="text-primary" size={20} />}
        />
      )}

      {/* Modal confirmation suppression */}
      <DeleteConfirmationModal
        isOpen={!!periodeToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title="Supprimer la période"
        message={`Êtes-vous sûr de vouloir supprimer la période "${periodeToDelete?.nom}" ? Cette action est irréversible.`}
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