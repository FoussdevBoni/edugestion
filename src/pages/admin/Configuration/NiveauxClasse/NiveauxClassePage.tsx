// src/pages/admin/configuration/niveaux-classe/NiveauxClassePage.tsx
import { useState, useMemo } from "react";
import { Plus, Search, Layers, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NiveauxClasseList from "../../../../components/admin/lists/NiveauxClasseList";
import { NiveauClasse } from "../../../../utils/types/data";
import useNiveauxClasses from "../../../../hooks/niveauxClasses/useNiveauxClasses";
import NiveauClasseModals from "../../../../components/admin/modals/NiveauClasseModals";
import { useEcoleNiveau } from "../../../../hooks/filters/useEcoleNiveau";
import { alertError, alertSuccess } from "../../../../helpers/alertError";
import PageLayout from "../../../../layouts/PageLayout";

export default function NiveauxClassePage() {
  const navigate = useNavigate();
  const [selectedNiveauClasse, setSelectedNiveauClasse] = useState<NiveauClasse | null>(null);
  const [niveauClasseToDelete, setNiveauClasseToDelete] = useState<NiveauClasse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { niveauxClasse, deleteNiveauClasse } = useNiveauxClasses();
  const { cycleSelectionne, niveauSelectionne } = useEcoleNiveau();

  const filteredNiveauxClasse = useMemo(() => {
    return niveauxClasse.filter(nc => {
      const matchesNiveauGlobal = niveauSelectionne ? nc.niveauScolaire === niveauSelectionne : true;
      const matchesCycleGlobal = cycleSelectionne ? nc.cycle === cycleSelectionne : true;

      if (!matchesNiveauGlobal || !matchesCycleGlobal) {
        return false;
      }

      if (!searchTerm) {
        return true;
      }

      const term = searchTerm.toLowerCase();
      return (
        nc.nom.toLowerCase().includes(term) ||
        nc.cycle.toLowerCase().includes(term) ||
        nc.niveauScolaire.toLowerCase().includes(term)
      );
    });
  }, [niveauxClasse, niveauSelectionne, cycleSelectionne, searchTerm]);

  

  const handleDelete = () => {
    if (!niveauClasseToDelete?.id) {
      alertError();
      return;
    }
    try {
      deleteNiveauClasse(niveauClasseToDelete.id);
      setNiveauClasseToDelete(null);
      setSelectedNiveauClasse(null);
      alertSuccess("Niveau de classe supprimé avec succès");
    } catch (error) {
      alertError();
    } finally {
    }
  };

  const handleAction = (niveauClasse: NiveauClasse) => {
    setSelectedNiveauClasse(niveauClasse);
  };

  const handleCloseMenuModal = () => {
    setSelectedNiveauClasse(null);
  };

  const handleCloseDeleteModal = () => {
    setNiveauClasseToDelete(null);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <PageLayout
      title="Niveaux de classe"
      description={`${filteredNiveauxClasse.length} niveau${filteredNiveauxClasse.length > 1 ? 'x' : ''} de classe configurés`}
      actions={
        <button
          onClick={() => navigate("/admin/configuration/niveaux-classe/new")}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
        >
          <Plus size={18} />
          Nouveau niveau
        </button>
      }
    >
      {/* Barre de recherche avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, cycle ou niveau scolaire..."
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

      {/* Indicateur des filtres actifs avec animation */}
      {(niveauSelectionne || cycleSelectionne || searchTerm) && (
        <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <Filter size={14} className="text-primary" />
          <span>Filtres actifs:</span>
          {niveauSelectionne && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              {niveauSelectionne}
            </span>
          )}
          {cycleSelectionne && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              {cycleSelectionne}
            </span>
          )}
          {searchTerm && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              "{searchTerm}"
            </span>
          )}
        </div>
      )}

      {/* Liste avec animation */}
      <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <NiveauxClasseList 
          niveauxClasse={filteredNiveauxClasse} 
          onAction={handleAction} 
        />
      </div>

      {/* Message si aucun résultat avec animation */}
      {filteredNiveauxClasse.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <Layers size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Aucun niveau de classe trouvé</p>
          {(searchTerm || niveauSelectionne || cycleSelectionne) && (
            <button
              onClick={clearSearch}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Effacer la recherche
            </button>
          )}
        </div>
      )}

      {/* Modals pour niveaux de classe */}
      <NiveauClasseModals
        handleDelete={handleDelete}
        niveauClasseToDelete={niveauClasseToDelete}
        selectedNiveauClasse={selectedNiveauClasse}
        setNiveauClasseToDelete={setNiveauClasseToDelete}
        setSelectedNiveauClasse={setSelectedNiveauClasse}
        handleCloseDeleteModal={handleCloseDeleteModal}
        handleCloseMenuModal={handleCloseMenuModal}
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