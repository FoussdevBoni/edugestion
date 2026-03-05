// src/pages/admin/configuration/niveaux-classe/NiveauxClassePage.tsx
import { useState } from "react";
import { Plus, Download, MoreVertical, FileText, Printer, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NiveauxClasseList from "../../../../components/admin/lists/NiveauxClasseList";
import MenuModal, { Menu } from "../../../../components/ui/MenuModal";

import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import { NiveauClasse } from "../../../../utils/types/data";
import { niveauxClasse } from "../../../../data/baseData";

export default function NiveauxClassePage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNiveauClasse, setSelectedNiveauClasse] = useState<NiveauClasse | null>(null);
  const [niveauClasseToDelete, setNiveauClasseToDelete] = useState<NiveauClasse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrer les niveaux de classe
  const filteredNiveauxClasse = niveauxClasse.filter(nc =>
    nc.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nc.cycle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nc.niveauScolaire.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = () => {
    console.log("Suppression du niveau de classe:", niveauClasseToDelete);
    setNiveauClasseToDelete(null);
    setSelectedNiveauClasse(null);
  };

  const menuItems: Menu[] = [
    {
      label: "Ajouter un niveau",
      icon: Plus,
      onClick: () => {
        navigate("/admin/configuration/niveaux-classe/new");
        setIsModalOpen(false);
      }
    },
    {
      label: "Importer",
      icon: Download,
      onClick: () => {
        console.log("Importer des niveaux de classe");
        setIsModalOpen(false);
      }
    }
  ];

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
            onClick={() => setIsModalOpen(true)}
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

      {/* Liste */}
      <NiveauxClasseList niveauxClasse={filteredNiveauxClasse} onAction={handleAction} />

      {/* Message si aucun résultat */}
      {filteredNiveauxClasse.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun niveau de classe trouvé</p>
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
        title="Gestion des niveaux de classe"
        icon={<Plus className="text-primary" size={20} />}
      />

      {/* Modal actions sur un niveau de classe */}
      {selectedNiveauClasse && (
        <MenuModal
          menu={[
            {
              label: "Voir détails",
              icon: FileText,
              onClick: () => {
                navigate("/admin/configuration/niveaux-classe/details", { state: selectedNiveauClasse });
                setSelectedNiveauClasse(null);
              }
            },
            {
              label: "Modifier",
              icon: Plus,
              onClick: () => {
                navigate("/admin/configuration/niveaux-classe/update", { state: selectedNiveauClasse });
                setSelectedNiveauClasse(null);
              }
            },
            {
              label: "Gérer les classes",
              icon: Printer,
              onClick: () => {
                navigate("/admin/configuration/classes", { state: { niveauClasseId: selectedNiveauClasse.id } });
                setSelectedNiveauClasse(null);
              }
            },
            {
              label: "Supprimer",
              icon: MoreVertical,
              onClick: () => {
                setNiveauClasseToDelete(selectedNiveauClasse);
                setSelectedNiveauClasse(null);
              }
            }
          ]}
          isOpen={!!selectedNiveauClasse}
          onClose={handleCloseMenuModal}
          title={selectedNiveauClasse.nom}
          icon={<Plus className="text-primary" size={20} />}
        />
      )}

      {/* Modal confirmation suppression */}
      <DeleteConfirmationModal
        isOpen={!!niveauClasseToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title="Supprimer le niveau de classe"
        message={`Êtes-vous sûr de vouloir supprimer le niveau "${niveauClasseToDelete?.nom}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}