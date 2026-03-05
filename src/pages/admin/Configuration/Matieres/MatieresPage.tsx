// src/pages/admin/configuration/matieres/MatieresPage.tsx
import { useState } from "react";
import { Plus, Download, MoreVertical, FileText, Printer, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MatieresList from "../../../../components/admin/lists/MatieresList";
import MenuModal, { Menu } from "../../../../components/ui/MenuModal";

import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import { Matiere } from "../../../../utils/types/data";
import { matieres } from "../../../../data/matieres";

export default function MatieresPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatiere, setSelectedMatiere] = useState<Matiere | null>(null);
  const [matiereToDelete, setMatiereToDelete] = useState<Matiere | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrer les matières
  const filteredMatieres = matieres.filter(matiere =>
    matiere.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    matiere.niveauClasse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = () => {
    console.log("Suppression de la matière:", matiereToDelete);
    setMatiereToDelete(null);
    setSelectedMatiere(null);
  };

  const menuItems: Menu[] = [
    {
      label: "Ajouter une matière",
      icon: Plus,
      onClick: () => {
        navigate("/admin/configuration/matieres/new");
        setIsModalOpen(false);
      }
    },
    {
      label: "Importer",
      icon: Download,
      onClick: () => {
        console.log("Importer des matières");
        setIsModalOpen(false);
      }
    }
  ];

  const handleAction = (matiere: Matiere) => {
    setSelectedMatiere(matiere);
  };

  const handleCloseMenuModal = () => {
    setSelectedMatiere(null);
  };

  const handleCloseDeleteModal = () => {
    setMatiereToDelete(null);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Matières</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredMatieres.length} matière{filteredMatieres.length > 1 ? 's' : ''} configurée{filteredMatieres.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            Nouvelle matière
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une matière par nom ou niveau..."
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
      <MatieresList 
        matieres={filteredMatieres} 
        onAction={handleAction}
      />

      {/* Message si aucun résultat */}
      {filteredMatieres.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucune matière trouvée</p>
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
        title="Gestion des matières"
        icon={<Plus className="text-primary" size={20} />}
      />

      {/* Modal actions sur une matière */}
      {selectedMatiere && (
        <MenuModal
          menu={[
            {
              label: "Voir détails",
              icon: FileText,
              onClick: () => {
                navigate("/admin/configuration/matieres/details", { state: selectedMatiere });
                setSelectedMatiere(null);
              }
            },
            {
              label: "Modifier",
              icon: Plus,
              onClick: () => {
                navigate("/admin/configuration/matieres/update", { state: selectedMatiere });
                setSelectedMatiere(null);
              }
            },
            {
              label: "Notes",
              icon: Printer,
              onClick: () => {
                console.log("Voir les notes de", selectedMatiere.nom);
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
          ]}
          isOpen={!!selectedMatiere}
          onClose={handleCloseMenuModal}
          title={selectedMatiere.nom}
          icon={<Plus className="text-primary" size={20} />}
        />
      )}

      {/* Modal confirmation suppression */}
      <DeleteConfirmationModal
        isOpen={!!matiereToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title="Supprimer la matière"
        message={`Êtes-vous sûr de vouloir supprimer la matière "${matiereToDelete?.nom}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}