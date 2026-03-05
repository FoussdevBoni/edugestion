import { useState, useEffect } from "react";
import { Plus, Download, MoreVertical, UserPlus, FileText, Printer, Search } from "lucide-react";
import EnseignantsList from "../../../components/admin/lists/EnseignantsList";
import MenuModal, { Menu } from "../../../components/ui/MenuModal";
import { Enseignant } from "../../../utils/types/data";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import { useNavigate } from "react-router-dom";
import { enseignants } from "../../../data/enseignants";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";
import { systemeScolaireSenegal } from "../../../data/systemScolaire";
import { normalizeClasse } from "../../../helpers/normalizeClasse";

export default function EnseignantsPage() {
  const { niveauSelectionne, cycleSelectionne } = useEcoleNiveau();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnseignant, setSelectedEnseignant] = useState<Enseignant | null>(null);
  const [enseignantToDelete, setEnseignantToDelete] = useState<Enseignant | null>(null);

  const navigate = useNavigate();

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClasse, setSelectedClasse] = useState("");      // "6ᵉ", "5ᵉ", etc.
  const [selectedSection, setSelectedSection] = useState("");    // "6ᵉ A", "6ᵉ B", etc.
  const [selectedMatiere, setSelectedMatiere] = useState("");

  // Trouver le niveau sélectionné
  const niveauChoisi = systemeScolaireSenegal.find(n => n.nom === niveauSelectionne);

  // Trouver le cycle sélectionné
  const cycleChoisi = niveauChoisi?.cycles?.find(c => c.nom === cycleSelectionne);

  // Classes disponibles (sans sections) pour le cycle sélectionné
  const classesDisponibles = cycleChoisi?.classes?.map(c => c.nom) || [];

  // Sections disponibles pour la classe sélectionnée
  const sectionsDisponibles = cycleChoisi?.classes
    ?.find(c => c.nom === selectedClasse)
    ?.sections?.map(s => s.nom) || [];

  // Matières disponibles pour la section sélectionnée (ou première section si aucune sélection)
  const matieresDisponibles = (() => {
    if (!cycleChoisi || !selectedClasse) return [];

    const classe = cycleChoisi.classes?.find(c => c.nom === selectedClasse);
    if (!classe) return [];

    // Si une section est sélectionnée, prendre ses matières
    if (selectedSection) {
      const section = classe.sections?.find(s => s.nom === selectedSection);
      return section?.matieres.map(m => m.nom) || [];
    }

    // Sinon, prendre les matières de la première section (toutes les sections ont les mêmes matières généralement)
    const premiereSection = classe.sections?.[0];
    return premiereSection?.matieres.map(m => m.nom) || [];
  })();

  // Filtrer les enseignants selon tous les critères
  const filteredEnseignants = enseignants.filter(enseignant => {
    // Filtres locaux
    const matchesSearch =
      enseignant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enseignant.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enseignant.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Vérifier si l'enseignant a la classe sélectionnée (ex: "6ᵉ")
    const matchesClasse = selectedClasse ?
      enseignant.classes.some(c =>
        normalizeClasse(c).startsWith(normalizeClasse(selectedClasse))
      ) : true;

    // Vérifier si l'enseignant a la section complète (ex: "6ᵉ A")
    const matchesSection = selectedSection ?
      enseignant.classes.includes(selectedSection) : true;

    // Vérifier si l'enseignant a la matière
    const matchesMatiere = selectedMatiere ?
      enseignant.matieres.includes(selectedMatiere) : true;

    return matchesSearch && matchesClasse && matchesSection && matchesMatiere;
  });

  // Réinitialiser quand les filtres globaux changent
  useEffect(() => {
    setSelectedClasse("");
    setSelectedSection("");
    setSelectedMatiere("");
  }, [niveauSelectionne, cycleSelectionne]);

  // Réinitialiser section et matière quand la classe change
  useEffect(() => {
    setSelectedSection("");
    setSelectedMatiere("");
  }, [selectedClasse]);

  // Réinitialiser matière quand la section change
  useEffect(() => {
    setSelectedMatiere("");
  }, [selectedSection]);

  const handleDelete = () => {
    console.log("Suppression de l'enseignant:", enseignantToDelete);
    setEnseignantToDelete(null);
    setSelectedEnseignant(null);
  };

  const menuItems: Menu[] = [
    {
      label: "Ajouter un enseignant",
      icon: UserPlus,
      onClick: () => {
        navigate("/admin/enseignants/new");
        setIsModalOpen(false);
      }
    },
    {
      label: "Importer liste",
      icon: Download,
      onClick: () => {
        navigate("/admin/enseignants/import");
        setIsModalOpen(false);
      }
    }
  ];

  const handleAction = (enseignant: Enseignant) => {
    setSelectedEnseignant(enseignant);
  };

  const handleCloseMenuModal = () => {
    setSelectedEnseignant(null);
  };

  const handleCloseDeleteModal = () => {
    setEnseignantToDelete(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedClasse("");
    setSelectedSection("");
    setSelectedMatiere("");
  };

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des enseignants</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredEnseignants.length} enseignant{filteredEnseignants.length > 1 ? 's' : ''} sur {enseignants.length} inscrits
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} />
            Nouvel enseignant
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
      </div>

      {/* Filtres hiérarchiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filtre Classe - désactivé si aucun cycle sélectionné */}
        <select
          value={selectedClasse}
          onChange={(e) => setSelectedClasse(e.target.value)}
          disabled={!cycleSelectionne}
          className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${!cycleSelectionne ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
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
          className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${!selectedClasse ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
            }`}
        >
          <option value="">Toutes les sections</option>
          {sectionsDisponibles.map(section => (
            <option key={section} value={section}>{section}</option>
          ))}
        </select>

        {/* Filtre Matière - désactivé si aucune classe sélectionnée */}
        <select
          value={selectedMatiere}
          onChange={(e) => setSelectedMatiere(e.target.value)}
          disabled={!selectedClasse}
          className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${!selectedClasse ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
            }`}
        >
          <option value="">Toutes les matières</option>
          {matieresDisponibles.map(matiere => (
            <option key={matiere} value={matiere}>{matiere}</option>
          ))}
        </select>
      </div>

      {/* Messages informatifs */}
      {!cycleSelectionne && (
        <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
          Veuillez d'abord sélectionner un cycle pour filtrer par classe
        </div>
      )}

      {cycleSelectionne && selectedClasse && sectionsDisponibles.length === 0 && (
        <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
          Cette classe n'a pas de sections
        </div>
      )}

      {cycleSelectionne && selectedClasse && matieresDisponibles.length === 0 && (
        <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
          Aucune matière disponible pour cette section
        </div>
      )}

      {/* Indicateur de filtres actifs */}
      {(searchTerm || niveauSelectionne || cycleSelectionne || selectedClasse || selectedSection || selectedMatiere) && (
        <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
          <span>Filtres actifs:</span>
          {searchTerm && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
              "{searchTerm}"
            </span>
          )}
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
              {selectedSection}
            </span>
          )}
          {selectedMatiere && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
              {selectedMatiere}
            </span>
          )}
          {(searchTerm || selectedClasse || selectedSection || selectedMatiere) && (
            <button
              onClick={clearFilters}
              className="text-red-500 hover:text-red-700 ml-2 text-xs"
            >
              Effacer filtres
            </button>
          )}
        </div>
      )}

      {/* Liste des enseignants */}
      <EnseignantsList enseignants={filteredEnseignants} onAction={handleAction} />

      {/* Message si aucun résultat */}
      {filteredEnseignants.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun enseignant ne correspond à vos critères</p>
          {(searchTerm || selectedClasse || selectedSection || selectedMatiere) && (
            <button
              onClick={clearFilters}
              className="mt-4 text-primary hover:text-primary/80 text-sm"
            >
              Effacer les filtres
            </button>
          )}
        </div>
      )}

      {/* Modal pour les actions globales */}
      <MenuModal
        menu={menuItems}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Gestion des enseignants"
        icon={<UserPlus className="text-primary" size={20} />}
      />

      {/* Modal pour les actions sur un enseignant spécifique */}
      {selectedEnseignant && (
        <MenuModal
          menu={[
            {
              label: "Voir détails",
              icon: FileText,
              onClick: () => {
                navigate("/admin/enseignants/details", { state: selectedEnseignant });
                setSelectedEnseignant(null);
              }
            },
            {
              label: "Modifier",
              icon: UserPlus,
              onClick: () => {
                navigate("/admin/enseignants/update", { state: selectedEnseignant });
                setSelectedEnseignant(null);
              }
            },
            {
              label: "Emploi du temps",
              icon: Printer,
              onClick: () => {
                console.log("Emploi du temps", selectedEnseignant);
                setSelectedEnseignant(null);
              }
            },
            {
              label: "Supprimer",
              icon: MoreVertical,
              onClick: () => {
                setEnseignantToDelete(selectedEnseignant);
                setSelectedEnseignant(null);
              }
            }
          ]}
          isOpen={!!selectedEnseignant}
          onClose={handleCloseMenuModal}
          title={`${selectedEnseignant.prenom} ${selectedEnseignant.nom}`}
          icon={<UserPlus className="text-primary" size={20} />}
        />
      )}

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        isOpen={!!enseignantToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title="Supprimer l'enseignant"
        message={`Êtes-vous sûr de vouloir supprimer ${enseignantToDelete?.prenom} ${enseignantToDelete?.nom} ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}