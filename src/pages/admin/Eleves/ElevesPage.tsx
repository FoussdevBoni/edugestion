import { useState, useEffect } from "react";
import { Plus, Download, MoreVertical, UserPlus, FileText, Printer } from "lucide-react";
import ElevesList from "../../../components/admin/lists/ElevesList";
import MenuModal, { Menu } from "../../../components/ui/MenuModal";
import { Eleve } from "../../../utils/types/data";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import { useNavigate } from "react-router-dom";
import { eleves } from "../../../data/eleves";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";

export default function ElevesPage() {
  const { niveauSelectionne, cycleSelectionne } = useEcoleNiveau();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEleve, setSelectedEleve] = useState<Eleve | null>(null);
  const [eleveToDelete, setEleveToDelete] = useState<Eleve | null>(null); // 👈 Nouvel état pour la suppression

  const navigate = useNavigate();

  const handleDelete = () => {
    console.log("Suppression de l'élève:", eleveToDelete);
    // Ici tu feras l'appel API pour supprimer
    setEleveToDelete(null);
    setSelectedEleve(null);
    // Optionnel: recharger la liste ou mettre à jour l'UI
  };

  // États pour les filtres locaux
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClasse, setSelectedClasse] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  // Obtenir les classes disponibles pour le cycle sélectionné
  const classesDisponibles = [...new Set(
    eleves
      .filter(eleve => {
        const matchesNiveau = niveauSelectionne ? eleve.niveauScolaire === niveauSelectionne : true;
        const matchesCycle = cycleSelectionne ? eleve.cycle === cycleSelectionne : true;
        return matchesNiveau && matchesCycle;
      })
      .map(e => e.classe)
  )].filter(Boolean).sort();

  // Obtenir les sections disponibles pour la classe sélectionnée
  const sectionsDisponibles = [...new Set(
    eleves
      .filter(eleve => {
        const matchesNiveau = niveauSelectionne ? eleve.niveauScolaire === niveauSelectionne : true;
        const matchesCycle = cycleSelectionne ? eleve.cycle === cycleSelectionne : true;
        const matchesClasse = selectedClasse ? eleve.classe === selectedClasse : true;
        return matchesNiveau && matchesCycle && matchesClasse;
      })
      .map(e => e.section)
  )].filter(Boolean).sort();

  // Filtrer les élèves selon tous les critères
  const filteredEleves = eleves.filter(eleve => {
    // Filtres globaux (du header)
    const matchesNiveauGlobal = niveauSelectionne ? eleve.niveauScolaire === niveauSelectionne : true;
    const matchesCycleGlobal = cycleSelectionne ? eleve.cycle === cycleSelectionne : true;

    // Filtres locaux
    const matchesSearch =
      eleve.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eleve.prenom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClasse = selectedClasse ? eleve.classe === selectedClasse : true;
    const matchesSection = selectedSection ? eleve.section === selectedSection : true;

    return matchesNiveauGlobal && matchesCycleGlobal && matchesSearch && matchesClasse && matchesSection;
  });

  // Réinitialiser les filtres locaux quand les filtres globaux changent
  useEffect(() => {
    setSelectedClasse("");
    setSelectedSection("");
  }, [niveauSelectionne, cycleSelectionne]);

  // Réinitialiser la section quand la classe change
  useEffect(() => {
    setSelectedSection("");
  }, [selectedClasse]);

  const menuItems: Menu[] = [
    {
      label: "Ajouter un élève",
      icon: UserPlus,
      onClick: () => {
        navigate("/admin/eleves/new");
        setIsModalOpen(false);
      }
    },
    {
      label: "Importer liste",
      icon: Download,
      onClick: () => {
        navigate("/admin/eleves/import")
        setIsModalOpen(false);
      }
    }
  ];

  const handleAction = (eleve: Eleve) => {
    setSelectedEleve(eleve);
  };

  const handleCloseMenuModal = () => {
    setSelectedEleve(null);
  };

  const handleCloseDeleteModal = () => {
    setEleveToDelete(null);
    // Ne pas remettre selectedEleve à null ici, car il est déjà null
  };

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des élèves</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredEleves.length} élèves sur {eleves.length} inscrits pour l'année 2024-2025
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            Nouvel élève
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher un élève par nom ou prénom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
      </div>

      {/* Filtres locaux (classe et section) avec hiérarchie */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Filtre Classe - désactivé si aucun cycle sélectionné */}
        <select
          value={selectedClasse}
          onChange={(e) => setSelectedClasse(e.target.value)}
          disabled={!cycleSelectionne}
          className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
            !cycleSelectionne ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
          }`}
        >
          <option value="">Toutes les classes</option>
          {classesDisponibles.map(classe => (
            <option key={classe} value={classe}>{classe}</option>
          ))}
        </select>

        {/* Filtre Section - désactivé si aucune classe sélectionnée */}
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          disabled={!selectedClasse}
          className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
            !selectedClasse ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
          }`}
        >
          <option value="">Toutes les sections</option>
          {sectionsDisponibles.map(section => section && (
            <option key={section} value={section}>Section {section}</option>
          ))}
        </select>
      </div>

      {/* Message informatif selon l'état des filtres */}
      {!cycleSelectionne && (
        <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
          Veuillez d'abord sélectionner un cycle pour filtrer par classe
        </div>
      )}

      {cycleSelectionne && !selectedClasse && classesDisponibles.length > 0 && (
        <div className="text-sm text-gray-500">
          {classesDisponibles.length} classe{classesDisponibles.length > 1 ? 's' : ''} disponible{classesDisponibles.length > 1 ? 's' : ''}
        </div>
      )}

      {/* Indicateur de filtres actifs */}
      {(niveauSelectionne || cycleSelectionne || selectedClasse || selectedSection) && (
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
          {selectedClasse && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
              {selectedClasse}
            </span>
          )}
          {selectedSection && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
              Section {selectedSection}
            </span>
          )}
          {(selectedClasse || selectedSection) && (
            <button
              onClick={() => {
                setSelectedClasse("");
                setSelectedSection("");
              }}
              className="text-red-500 hover:text-red-700 ml-2 text-xs"
            >
              Effacer filtres locaux
            </button>
          )}
        </div>
      )}

      {/* Liste des élèves */}
      <ElevesList eleves={filteredEleves} onAction={handleAction} />

      {/* Message si aucun résultat */}
      {filteredEleves.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun élève ne correspond à vos critères</p>
        </div>
      )}

      {/* Modal pour les actions globales */}
      <MenuModal
        menu={menuItems}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Gestion des élèves"
        icon={<Plus className="text-primary" size={20} />}
      />

      {/* Modal pour les actions sur un élève spécifique */}
      {selectedEleve && (
        <MenuModal
          menu={[
            {
              label: "Voir détails",
              icon: FileText,
              onClick: () => {
                navigate("/admin/eleves/details", { state: selectedEleve });
                setSelectedEleve(null);
              }
            },
            {
              label: "Modifier",
              icon: UserPlus,
              onClick: () => {
                navigate("/admin/eleves/update", { state: selectedEleve });
                setSelectedEleve(null);
              }
            },
            {
              label: "Bulletin",
              icon: Printer,
              onClick: () => {
                console.log("Bulletin", selectedEleve);
                setSelectedEleve(null);
              }
            },
            {
              label: "Supprimer",
              icon: MoreVertical,
              onClick: () => {
                setEleveToDelete(selectedEleve); // 👈 On stocke l'élève à supprimer
                setSelectedEleve(null); // 👈 On ferme le menu modal
              }
            }
          ]}
          isOpen={!!selectedEleve}
          onClose={handleCloseMenuModal}
          title={`${selectedEleve.prenom} ${selectedEleve.nom}`}
          icon={<UserPlus className="text-primary" size={20} />}
        />
      )}

      {/* Modal de confirmation de suppression - utilise eleveToDelete */}
      <DeleteConfirmationModal
        isOpen={!!eleveToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title="Supprimer l'élève"
        message={`Êtes-vous sûr de vouloir supprimer ${eleveToDelete?.prenom} ${eleveToDelete?.nom} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}