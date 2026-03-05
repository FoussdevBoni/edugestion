// src/pages/admin/parametres/scolarite/classes/ClassesPage.tsx
import { useState } from "react";
import { Plus, Download, MoreVertical, FileText, Printer, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ClassesList from "../../../../components/admin/lists/ClassesList";
import MenuModal, { Menu } from "../../../../components/ui/MenuModal";

import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import { classes } from "../../../../data/baseData";
import { Classe } from "../../../../utils/types/data";

// Données fictives pour les élèves (à remplacer par les vraies données)
const mockElevesParClasse = {
  [classes[0]?.id]: 25,
  [classes[1]?.id]: 23,
  [classes[2]?.id]: 0,
  [classes[3]?.id]: 28,
  [classes[4]?.id]: 22,
  [classes[5]?.id]: 24,
};

export default function ClassesPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClasse, setSelectedClasse] = useState<Classe | null>(null);
  const [classeToDelete, setClasseToDelete] = useState<Classe | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrer les classes
  const filteredClasses = classes.filter(classe =>
    classe.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classe.niveauClasse.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classe.cycle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classe.niveauScolaire.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = () => {
    console.log("Suppression de la classe:", classeToDelete);
    setClasseToDelete(null);
    setSelectedClasse(null);
  };

  const menuItems: Menu[] = [
    {
      label: "Ajouter une classe",
      icon: Plus,
      onClick: () => {
        setIsModalOpen(false);
      }
    },
    {
      label: "Importer",
      icon: Download,
      onClick: () => {
        console.log("Importer des classes");
        setIsModalOpen(false);
      }
    }
  ];

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
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Classes</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredClasses.length} classe{filteredClasses.length > 1 ? 's' : ''} configurées
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            Nouvelle classe
          </button>
        </div>
      </div>

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

      {/* Liste */}
      <ClassesList 
        classes={filteredClasses} 
        onAction={handleAction}
        elevesCount={mockElevesParClasse}
      />

      {/* Message si aucun résultat */}
      {filteredClasses.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucune classe trouvée</p>
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
        title="Gestion des classes"
        icon={<Plus className="text-primary" size={20} />}
      />

      {/* Modal actions sur une classe */}
      {selectedClasse && (
        <MenuModal
          menu={[
            {
              label: "Voir détails",
              icon: FileText,
              onClick: () => {
                navigate("/admin/configuration/classes/details", { state: selectedClasse });
                setSelectedClasse(null);
              }
            },
            {
              label: "Modifier",
              icon: Plus,
              onClick: () => {
                navigate("/admin/configuration/classes/update", { state: selectedClasse });
                setSelectedClasse(null);
              }
            },
            {
              label: "Liste des élèves",
              icon: Printer,
              onClick: () => {
                navigate("/admin/eleves", { state: { classeId: selectedClasse.id } });
                setSelectedClasse(null);
              }
            },
            {
              label: "Supprimer",
              icon: MoreVertical,
              onClick: () => {
                setClasseToDelete(selectedClasse);
                setSelectedClasse(null);
              }
            }
          ]}
          isOpen={!!selectedClasse}
          onClose={handleCloseMenuModal}
          title={selectedClasse.nom}
          icon={<Plus className="text-primary" size={20} />}
        />
      )}

      {/* Modal confirmation suppression */}
      <DeleteConfirmationModal
        isOpen={!!classeToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title="Supprimer la classe"
        message={`Êtes-vous sûr de vouloir supprimer la classe "${classeToDelete?.nom}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}