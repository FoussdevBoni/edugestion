// src/pages/admin/configuration/cycles/CyclesPage.tsx
import { useState } from "react";
import { Plus, MoreVertical, FileText, Printer, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Cycle } from "../../../../utils/types/data";
import { cycles } from "../../../../data/baseData";
import MenuModal from "../../../../components/ui/MenuModal";
import CyclesList from "../../../../components/admin/lists/CyclesList";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";


export default function CyclesPage() {
  const navigate = useNavigate();
  const [selectedCycle, setSelectedCycle] = useState<Cycle | null>(null);
  const [cycleToDelete, setCycleToDelete] = useState<Cycle | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrer les cycles
  const filteredCycles = cycles.filter(cycle =>
    cycle.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cycle.niveauScolaire.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = () => {
    console.log("Suppression du cycle:", cycleToDelete);
    setCycleToDelete(null);
    setSelectedCycle(null);
  };

 
  const handleAction = (cycle: Cycle) => {
    setSelectedCycle(cycle);
  };

  const handleCloseMenuModal = () => {
    setSelectedCycle(null);
  };

  const handleCloseDeleteModal = () => {
    setCycleToDelete(null);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cycles scolaires</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredCycles.length} cycle{filteredCycles.length > 1 ? 's' : ''} configurés
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
               navigate("/admin/configuration/cycles/new");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            Nouveau cycle
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un cycle par nom ou niveau..."
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
      <CyclesList cycles={filteredCycles} onAction={handleAction} />

      {/* Message si aucun résultat */}
      {filteredCycles.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun cycle trouvé</p>
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

   
      {/* Modal actions sur un cycle */}
      {selectedCycle && (
        <MenuModal
          menu={[
            {
              label: "Voir détails",
              icon: FileText,
              onClick: () => {
                navigate("/admin/configuration/cycles/details", { state: selectedCycle });
                setSelectedCycle(null);
              }
            },
            {
              label: "Modifier",
              icon: Plus,
              onClick: () => {
                navigate("/admin/configuration/cycles/update", { state: selectedCycle });
                setSelectedCycle(null);
              }
            },
            {
              label: "Gérer les niveaux",
              icon: Printer,
              onClick: () => {
                navigate("/admin/configuration/niveaux-classe", { state: { cycleId: selectedCycle.id } });
                setSelectedCycle(null);
              }
            },
            {
              label: "Supprimer",
              icon: MoreVertical,
              onClick: () => {
                setCycleToDelete(selectedCycle);
                setSelectedCycle(null);
              }
            }
          ]}
          isOpen={!!selectedCycle}
          onClose={handleCloseMenuModal}
          title={selectedCycle.nom}
          icon={<Plus className="text-primary" size={20} />}
        />
      )}

      {/* Modal confirmation suppression */}
      <DeleteConfirmationModal
        isOpen={!!cycleToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title="Supprimer le cycle"
        message={`Êtes-vous sûr de vouloir supprimer le cycle "${cycleToDelete?.nom}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}