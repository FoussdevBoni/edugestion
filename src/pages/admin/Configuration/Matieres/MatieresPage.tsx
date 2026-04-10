// src/pages/admin/configuration/matieres/MatieresPage.tsx
import { useState, useMemo, useEffect } from "react";
import { Plus, MoreVertical, FileText, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MatieresList from "../../../../components/admin/lists/MatieresList";
import TabsHorizontalScrollable from "../../../../components/ui/TabsHorizontalScrollable";
import { Matiere } from "../../../../utils/types/data";
import useMatieres from "../../../../hooks/matieres/useMatieres";
import { alertError, alertSuccess } from "../../../../helpers/alertError";
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
      alertSuccess("Matière supprimée avec succès");
    } catch (error) {
      alertError();
    } finally {
    }
  };

  const handleDeleteMany = async () => {
    if (!itemsToDelete || itemsToDelete.length === 0) return;
    try {
      await deleteManyMatieres(itemsToDelete);
      setItemsToDelete(null);
      alertSuccess(`${itemsToDelete.length} matière(s) supprimée(s) avec succès`);
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
              navigate("/admin/configuration/matieres/new");
            } else {
              navigate("/admin/matieres/new");
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
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
        message: `Êtes-vous sûr de vouloir supprimer la matière "${matiereToDelete?.nom}" ? Cette action est irréversible.`
      }}
    >
      {/* Tabs des niveaux de classe avec animation */}
      {niveauxClasseFiltres.length > 0 && (
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <TabsHorizontalScrollable
            tabs={tabs}
            activeTab={selectedNiveauClasseId}
            onTabChange={setSelectedNiveauClasseId}
          />
        </div>
      )}

      {/* Barre de recherche avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une matière par nom..."
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

      {/* Message si aucun niveau de classe */}
      {niveauxClasseFiltres.length === 0 && (cycleSelectionne || niveauSelectionne) && (
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <p className="text-yellow-700">Aucun niveau de classe trouvé pour {niveauSelectionne} {cycleSelectionne}</p>
        </div>
      )}

      {/* Liste avec animation */}
      <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
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
              className: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-md transition-all"
            }
          ]}
        />
      </div>

      {/* Message si aucun résultat */}
      {filteredMatieres.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl animate-fade-in-up" style={{ animationDelay: '500ms' }}>
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
              className="mt-3 text-sm text-primary hover:underline"
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