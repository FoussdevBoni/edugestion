// src/pages/admin/configuration/niveaux-classe/NiveauxClassePage.tsx
import { useState, useMemo } from "react";
import { Plus, Download, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NiveauxClasseList from "../../../../components/admin/lists/NiveauxClasseList";
import MenuModal, { Menu } from "../../../../components/ui/MenuModal";

import { NiveauClasse } from "../../../../utils/types/data";
import useNiveauxClasses from "../../../../hooks/niveauxClasses/useNiveauxClasses";
import NiveauClasseModals from "../../../../components/admin/modals/NiveauClasseModals";
import { useEcoleNiveau } from "../../../../hooks/filters/useEcoleNiveau";
import { alertError } from "../../../../helpers/alertError";

export default function NiveauxClassePage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNiveauClasse, setSelectedNiveauClasse] = useState<NiveauClasse | null>(null);
  const [niveauClasseToDelete, setNiveauClasseToDelete] = useState<NiveauClasse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { niveauxClasse, deleteNiveauClasse } = useNiveauxClasses()

  const { cycleSelectionne, niveauSelectionne } = useEcoleNiveau()

  // Filtrer les niveaux de classe
  const filteredNiveauxClasse = useMemo(() => {
    return niveauxClasse.filter(nc => {
      // Filtres globaux (du header)
      const matchesNiveauGlobal = niveauSelectionne ? nc.niveauScolaire === niveauSelectionne : true;
      const matchesCycleGlobal = cycleSelectionne ? nc.cycle === cycleSelectionne : true;

      // Si les filtres globaux ne matchent pas, on exclut directement
      if (!matchesNiveauGlobal || !matchesCycleGlobal) {
        return false;
      }

      // Si searchTerm est vide, on garde tous ceux qui ont passé les filtres globaux
      if (!searchTerm) {
        return true;
      }

      // Sinon, on filtre par searchTerm
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
      alertError()
      return
    }
    try {
      deleteNiveauClasse(niveauClasseToDelete.id)
      setNiveauClasseToDelete(null);
      setSelectedNiveauClasse(null);
    } catch (error) {
      alertError()

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
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Niveaux de classe</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredNiveauxClasse.length} niveau{filteredNiveauxClasse.length > 1 ? 'x' : ''} de classe configurés
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              navigate("/admin/configuration/niveaux-classe/new")
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            Nouveau niveau
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, cycle ou niveau scolaire..."
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

      {/* Indicateur des filtres actifs */}
      {(niveauSelectionne || cycleSelectionne || searchTerm) && (
        <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
          <span>Filtres actifs:</span>
          {niveauSelectionne && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
              {niveauSelectionne}
            </span>
          )}
          {cycleSelectionne && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
              {cycleSelectionne}
            </span>
          )}
          {searchTerm && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
              "{searchTerm}"
            </span>
          )}
        </div>
      )}

      {/* Liste */}
      <NiveauxClasseList niveauxClasse={filteredNiveauxClasse} onAction={handleAction} />

      {/* Message si aucun résultat */}
      {filteredNiveauxClasse.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun niveau de classe trouvé</p>
          {(searchTerm || niveauSelectionne || cycleSelectionne) && (
            <button
              onClick={() => {
                setSearchTerm("");
                // Note: on ne réinitialise pas les filtres globaux ici
                // car ils sont gérés ailleurs
              }}
              className="mt-4 text-primary hover:text-primary/80 text-sm"
            >
              Effacer la recherche
            </button>
          )}
        </div>
      )}


      {/* Modal actions sur un niveau de classe */}
      <NiveauClasseModals
        handleDelete={handleDelete}
        niveauClasseToDelete={niveauClasseToDelete}
        selectedNiveauClasse={selectedNiveauClasse}
        setNiveauClasseToDelete={setNiveauClasseToDelete}
        setSelectedNiveauClasse={setSelectedNiveauClasse}
        handleCloseDeleteModal={handleCloseDeleteModal}
        handleCloseMenuModal={handleCloseMenuModal}
      />
    </div>
  );
}