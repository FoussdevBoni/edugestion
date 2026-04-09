// src/pages/admin/parametres/scolarite/classes/ClassesPage.tsx
import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ClassesList from "../../../../components/admin/lists/ClassesList";
import TabsHorizontalScrollable from "../../../../components/ui/TabsHorizontalScrollable";
import { Classe } from "../../../../utils/types/data";
import useClasses from "../../../../hooks/classes/useClasses";
import ClasseModals from "../../../../components/admin/modals/ClasseModals";
import { alertError } from "../../../../helpers/alertError";
import useNiveauxClasses from "../../../../hooks/niveauxClasses/useNiveauxClasses";
import { useEcoleNiveau } from "../../../../hooks/filters/useEcoleNiveau";
import PageLayout from "../../../../layouts/PageLayout";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";

interface PagesProps {
  config?: boolean
}

export default function ClassesPage({ config }: PagesProps) {
  const navigate = useNavigate();
  const [selectedClasse, setSelectedClasse] = useState<Classe | null>(null);
  const [classeToDelete, setClasseToDelete] = useState<Classe | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNiveauClasseId, setSelectedNiveauClasseId] = useState<string>("tous");
  const [itemsToDelete, setItemsToDelete] = useState<string[] | null>(null);

  const { classes, deleteClasse, deleteManyClasses } = useClasses();
  const { niveauSelectionne, cycleSelectionne } = useEcoleNiveau();
  const { niveauxClasse } = useNiveauxClasses();

  // Filtrer les niveaux de classe par cycle et niveau sélectionnés
  const niveauxClasseFiltres = useMemo(() => {
    let filtered = niveauxClasse;

    if (cycleSelectionne) {
      filtered = filtered.filter(nc => nc.cycle === cycleSelectionne);
    }
    if (niveauSelectionne) {
      filtered = filtered.filter(nc => nc.niveauScolaire === niveauSelectionne);
    }

    return filtered;
  }, [niveauxClasse, cycleSelectionne, niveauSelectionne]);

  // Construire les tabs à partir des niveaux de classe filtrés
  const tabs = useMemo(() => {
    const countByNiveauClasse = classes.reduce((acc, classe) => {
      const niveauClasseId = classe.niveauClasseId;
      acc[niveauClasseId] = (acc[niveauClasseId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      {
        id: "tous",
        label: "Tous",
        count: classes.length
      },
      ...niveauxClasseFiltres.map(nc => ({
        id: nc.id,
        label: nc.nom,
        count: countByNiveauClasse[nc.id] || 0
      }))
    ];
  }, [classes, niveauxClasseFiltres]);

  // Filtrer les classes
  const filteredClasses = useMemo(() => {
    let filtered = classes;

    if (selectedNiveauClasseId !== "tous") {
      filtered = filtered.filter(classe => classe.niveauClasseId === selectedNiveauClasseId);
    }

    if (cycleSelectionne || niveauSelectionne) {
      const niveauxIds = niveauxClasseFiltres.map(nc => nc.id);
      filtered = filtered.filter(classe => niveauxIds.includes(classe.niveauClasseId));
    }

    if (searchTerm) {
      filtered = filtered.filter(classe =>
        classe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classe.niveauClasse.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classe.cycle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classe.niveauScolaire.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [classes, selectedNiveauClasseId, niveauxClasseFiltres, cycleSelectionne, niveauSelectionne, searchTerm]);

  // Données fictives pour les élèves
  const mockElevesParClasse = useMemo(() => {
    return classes.reduce((acc, classe) => {
      acc[classe.id] = Math.floor(Math.random() * 30) + 15;
      return acc;
    }, {} as Record<string, number>);
  }, [classes]);

  const handleDelete = () => {
    if (!classeToDelete?.id) {
      alertError();
      return;
    }
    try {
      deleteClasse(classeToDelete?.id);
      setClasseToDelete(null);
      setSelectedClasse(null);
    } catch (error) {
      alertError();
    }
  };

  const handleDeleteMany = async () => {
    if (!itemsToDelete || itemsToDelete.length === 0) return;
    try {
      await deleteManyClasses(itemsToDelete);
      setItemsToDelete(null);
    } catch (error) {
      alertError();
    }
  };

  const handleAction = (classe: Classe) => {
    setSelectedClasse(classe);
  };

  const handleCloseMenuModal = () => {
    setSelectedClasse(null);
  };

  const handleCloseDeleteModal = () => {
    setClasseToDelete(null);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <PageLayout
      title="Classes"
      description={`${filteredClasses.length} classe${filteredClasses.length > 1 ? 's' : ''}
        ${niveauSelectionne && ` - ${niveauSelectionne}`}
        ${cycleSelectionne && ` / ${cycleSelectionne}`}`}
      actions={
        <button
          onClick={() => {
            if (config) {
              navigate("/admin/configuration/classes/new")
            } else {
              navigate("/admin/classes/new")
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Nouvelles classes
        </button>
      }
    >
      {/* Tabs des niveaux de classe */}
      {niveauxClasseFiltres.length > 0 && (
        <TabsHorizontalScrollable
          tabs={tabs}
          activeTab={selectedNiveauClasseId}
          onTabChange={setSelectedNiveauClasseId}
        />
      )}

      {/* Barre de recherche */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, niveau, cycle..."
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

      {/* Message si aucun niveau de classe */}
      {niveauxClasseFiltres.length === 0 && (cycleSelectionne || niveauSelectionne) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
          Aucun niveau de classe trouvé pour {niveauSelectionne} {cycleSelectionne}
        </div>
      )}

      {/* Liste */}
      <ClassesList
        classes={filteredClasses}
        onAction={handleAction}
        elevesCount={mockElevesParClasse}
        selectable={true}
        selectActions={[
          {
            label: "Supprimer",
            onClick: (selectedItems) => {
              const ids = selectedItems.map(i => i.id);
              setItemsToDelete(ids);
            },
            className: "bg-red-600 text-white hover:bg-red-700"
          }
        ]}
      />

      {/* Message si aucun résultat */}
      {filteredClasses.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {selectedNiveauClasseId !== "tous"
              ? "Aucune classe pour ce niveau"
              : "Aucune classe trouvée"}
          </p>
          {(searchTerm || selectedNiveauClasseId !== "tous") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedNiveauClasseId("tous");
              }}
              className="mt-4 text-primary hover:text-primary/80 text-sm"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}

      {/* Modals pour suppression simple */}
      <ClasseModals
        config={config}
        handleCloseDeleteModal={handleCloseDeleteModal}
        handleCloseMenuModal={handleCloseMenuModal}
        classeToDelete={classeToDelete}
        selectedClasse={selectedClasse}
        setClasseToDelete={setClasseToDelete}
        setSelectedClasse={setSelectedClasse}
        handleDelete={handleDelete}
      />

      {/* Modal confirmation suppression multiple */}
      <DeleteConfirmationModal
        isOpen={!!itemsToDelete && itemsToDelete.length > 0}
        onClose={() => setItemsToDelete(null)}
        onConfirm={handleDeleteMany}
        title="Supprimer les classes"
        message={`Voulez-vous vraiment supprimer ${itemsToDelete?.length} classe(s) ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </PageLayout>
  );
}