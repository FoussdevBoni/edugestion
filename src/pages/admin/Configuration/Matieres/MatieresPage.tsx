// src/pages/admin/configuration/matieres/MatieresPage.tsx
import { useState, useMemo, useEffect } from "react";
import { Plus, MoreVertical, FileText, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MatieresList from "../../../../components/admin/lists/MatieresList";
import TabsHorizontalScrollable from "../../../../components/ui/TabsHorizontalScrollable";
import { Matiere } from "../../../../utils/types/data";
import useMatieres from "../../../../hooks/matieres/useMatieres";
import { alertError } from "../../../../helpers/alertError";
import useNiveauxClasses from "../../../../hooks/niveauxClasses/useNiveauxClasses";
import { useEcoleNiveau } from "../../../../hooks/filters/useEcoleNiveau";
import PageLayout from "../../../../layouts/PageLayout";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";


interface PagesProps {
  config?: boolean
}


export default function MatieresPage({ config }: PagesProps) {
  const navigate = useNavigate();
  const [selectedMatiere, setSelectedMatiere] = useState<Matiere | null>(null);
  const [matiereToDelete, setMatiereToDelete] = useState<Matiere | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsToDelete, setItemsToDelete] = useState<string[] | null>(null);

  const { matieres, deleteMatiere, deleteManyMatieres } = useMatieres();
  const { cycleSelectionne, niveauSelectionne } = useEcoleNiveau();
  const { niveauxClasse } = useNiveauxClasses();
  const [selectedNiveauClasseId, setSelectedNiveauClasseId] = useState<string>(niveauxClasse[0]?.id);

  useEffect(() => {
    setSelectedNiveauClasseId(niveauxClasse[0]?.id);
  }, [niveauxClasse]);

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
    const countByNiveauClasse = matieres.reduce((acc, matiere) => {
      const niveauClasseId = matiere.niveauClasseId;
      acc[niveauClasseId] = (acc[niveauClasseId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return niveauxClasseFiltres.map(nc => ({
      id: nc.id,
      label: nc.nom,
      count: countByNiveauClasse[nc.id] || 0
    }));
  }, [matieres, niveauxClasseFiltres]);

  // Filtrer les matières
  const filteredMatieres = useMemo(() => {
    let filtered = matieres;

    if (selectedNiveauClasseId !== "tous") {
      filtered = filtered.filter(matiere => matiere.niveauClasseId === selectedNiveauClasseId);
    }

    if (cycleSelectionne || niveauSelectionne) {
      const niveauxIds = niveauxClasseFiltres.map(nc => nc.id);
      filtered = filtered.filter(matiere => niveauxIds.includes(matiere.niveauClasseId));
    }

    if (searchTerm) {
      filtered = filtered.filter(matiere =>
        matiere.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matiere.niveauClasse.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [matieres, selectedNiveauClasseId, niveauxClasseFiltres, cycleSelectionne, niveauSelectionne, searchTerm]);

  const handleDelete = () => {
    if (!matiereToDelete?.id) {
      alertError();
      return;
    }
    try {
      deleteMatiere(matiereToDelete.id);
      setMatiereToDelete(null);
    } catch (error) {
      alertError();
    }
  };

  const handleDeleteMany = async () => {
    if (!itemsToDelete || itemsToDelete.length === 0) return;
    try {
      await deleteManyMatieres(itemsToDelete);
      setItemsToDelete(null);
    } catch (error) {
      alertError();
    }
  };

  const handleAction = (matiere: Matiere) => {
    setSelectedMatiere(matiere);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <PageLayout
      title="Matières"
      description={`${filteredMatieres.length} matière${filteredMatieres.length > 1 ? 's' : ''}
        ${niveauSelectionne && ` - ${niveauSelectionne}`}
        ${cycleSelectionne && ` / ${cycleSelectionne}`}`}
      actions={
        <button
          onClick={() => {
            if (config) {
              navigate("/admin/configuration/matieres/new")
            } else {
              navigate("/admin/matieres/new")
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={18} />
          Nouvelle matière
        </button>
      }
      menu={{
        isOpen: !!selectedMatiere,
        onClose: () => setSelectedMatiere(null),
        title: selectedMatiere?.nom || "",
        icon: <Plus className="text-primary" size={20} />,
        items: [
          {
            label: "Voir détails",
            icon: FileText,
            onClick: () => {
              if (config) {
                navigate("/admin/configuration/matieres/details", { state: selectedMatiere });
              } else {
                navigate("/admin/matieres/details", { state: selectedMatiere });
              }
              setSelectedMatiere(null);
            }
          },
          {
            label: "Modifier",
            icon: Plus,
            onClick: () => {
              if (config) {
                navigate("/admin/configuration/matieres/update", { state: selectedMatiere });
              } else {
                navigate("/admin/matieres/update", { state: selectedMatiere });
              }
              setSelectedMatiere(null);
            }
          },
          {
            label: "Supprimer",
            icon: MoreVertical,
            onClick: () => {
              setMatiereToDelete(selectedMatiere);
              setSelectedMatiere(null);
            }
          }
        ]
      }}
      deleteModal={{
        isOpen: !!matiereToDelete,
        onClose: () => setMatiereToDelete(null),
        onConfirm: handleDelete,
        title: "Supprimer la matière",
        message: `Êtes-vous sûr de vouloir supprimer la matière "${matiereToDelete?.nom}" ?`
      }}
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
            placeholder="Rechercher une matière par nom..."
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
      <MatieresList
        matieres={filteredMatieres}
        onAction={handleAction}
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
      {filteredMatieres.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {selectedNiveauClasseId !== "tous"
              ? "Aucune matière pour ce niveau"
              : "Aucune matière trouvée"}
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

      {/* Modal confirmation suppression multiple */}
      <DeleteConfirmationModal
        isOpen={!!itemsToDelete && itemsToDelete.length > 0}
        onClose={() => setItemsToDelete(null)}
        onConfirm={handleDeleteMany}
        title="Supprimer les matières"
        message={`Voulez-vous vraiment supprimer ${itemsToDelete?.length} matière(s) ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </PageLayout>
  );
}