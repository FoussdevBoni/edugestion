// src/pages/admin/configuration/cycles/CyclesPage.tsx
import { useState } from "react";
import { Plus, Search, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Cycle } from "../../../../utils/types/data";
import CyclesList from "../../../../components/admin/lists/CyclesList";
import useCycles from "../../../../hooks/cycles/useCycles";
import { CycleDeleModal, CycleMenuModal } from "../../../../components/admin/modals/CycleModals";
import { alertError, alertServerError, alertSuccess } from "../../../../helpers/alertError";
import PageLayout from "../../../../layouts/PageLayout";


export default function CyclesPage() {
  const navigate = useNavigate();
  const [selectedCycle, setSelectedCycle] = useState<Cycle | null>(null);
  const [cycleToDelete, setCycleToDelete] = useState<Cycle | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { cycles, deleteCycle } = useCycles();
  
  const filteredCycles = cycles.filter(cycle =>
    cycle.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cycle.niveauScolaire.toLowerCase().includes(searchTerm.toLowerCase())
  );

 

 const handleDelete = async () => {
  if (!cycleToDelete?.id) {
    alertError();
    return;
  }
  try {
    await deleteCycle(cycleToDelete?.id);
    setCycleToDelete(null);
    setSelectedCycle(null);
    alertSuccess("Cycle supprimé avec succès");
  } catch (error) {
    alertServerError(error);
  }
};
  const handleAction = (cycle: Cycle) => {
    setSelectedCycle(cycle);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <PageLayout
      title="Cycles scolaires"
      description={`${filteredCycles.length} cycle${filteredCycles.length > 1 ? 's' : ''} configurés`}
      actions={
        <button
          onClick={() => navigate("/admin/configuration/cycles/new")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
        >
          <Plus size={18} />
          Nouveau cycle
        </button>
      }
    >
     
      {/* Barre de recherche */}
      <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un cycle par nom ou niveau..."
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

      {/* Liste */}
      <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <CyclesList cycles={filteredCycles} onAction={handleAction} />
      </div>

      {/* Message si aucun résultat */}
      {filteredCycles.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Aucun cycle trouvé</p>
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

      {/* Modal actions sur un cycle */}
      {selectedCycle && (
        <CycleMenuModal
          selectedCycle={selectedCycle}
          setSelectedCycle={setSelectedCycle}
          setCycleToDelete={setCycleToDelete}
          handleCloseMenuModal={() => setSelectedCycle(null)}
        />
      )}

      {/* Modal confirmation suppression */}
      <CycleDeleModal
        handleCloseDeleteModal={() => setCycleToDelete(null)}
        handleDelete={handleDelete}
        cycleToDelete={cycleToDelete}
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