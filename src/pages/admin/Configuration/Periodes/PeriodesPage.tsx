// src/pages/admin/configuration/periodes/PeriodesPage.tsx
import { useState } from "react";
import { Plus, Download, MoreVertical, FileText, Printer, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PeriodesList from "../../../../components/admin/lists/PeriodesList";
import MenuModal, { Menu } from "../../../../components/ui/MenuModal";

import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import { Periode } from "../../../../utils/types/data";
import { evaluations } from "../../../../data/evaluations";
import { periodes } from "../../../../data/periods";

export default function PeriodesPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeriode, setSelectedPeriode] = useState<Periode | null>(null);
  const [periodeToDelete, setPeriodeToDelete] = useState<Periode | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Compter les évaluations par période
  const evaluationsCount = evaluations.reduce((acc, evalItem) => {
    acc[evalItem.periodeId || ""] = (acc[evalItem.periodeId || ""] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filtrer les périodes
  const filteredPeriodes = periodes.filter(periode =>
    periode.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    periode.niveauScolaire.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = () => {
    console.log("Suppression de la période:", periodeToDelete);
    setPeriodeToDelete(null);
    setSelectedPeriode(null);
  };

  const menuItems: Menu[] = [
    {
      label: "Ajouter une période",
      icon: Plus,
      onClick: () => {
        navigate("/admin/configuration/periodes/new");
        setIsModalOpen(false);
      }
    },
    {
      label: "Importer",
      icon: Download,
      onClick: () => {
        console.log("Importer des périodes");
        setIsModalOpen(false);
      }
    }
  ];

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
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Périodes scolaires</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredPeriodes.length} période{filteredPeriodes.length > 1 ? 's' : ''} configurée{filteredPeriodes.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            Nouvelle période
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une période par nom ou niveau..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
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

      {/* Liste */}
      <PeriodesList 
        periodes={filteredPeriodes} 
        onAction={handleAction}
        evaluationsCount={evaluationsCount}
      />

      {/* Message si aucun résultat */}
      {filteredPeriodes.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucune période trouvée</p>
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="mt-4 text-primary hover:text-primary/80 text-sm"
            >
              Effacer la recherche
            </button>
          )}
        </div>
      )}

      {/* Modal actions globales */}
      <MenuModal
        menu={menuItems}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Gestion des périodes"
        icon={<Plus className="text-primary" size={20} />}
      />

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
                navigate("/admin/configuration/evaluations", { state: { periodeId: selectedPeriode.id } });
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
          icon={<Plus className="text-primary" size={20} />}
        />
      )}

      {/* Modal confirmation suppression */}
      <DeleteConfirmationModal
        isOpen={!!periodeToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title="Supprimer la période"
        message={`Êtes-vous sûr de vouloir supprimer la période "${periodeToDelete?.nom}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}