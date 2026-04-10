// src/pages/admin/configuration/niveaux/NiveauScolairesPage.tsx
import { useState } from "react";
import { Plus, MoreVertical, FileText, Search, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MenuModal from "../../../../components/ui/MenuModal";
import NiveauScolairesList from "../../../../components/admin/lists/NiveauxScolaireList";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import useNiveauScolaire from "../../../../hooks/niveauxScolaires/useNiveauxScolaires";
import { NiveauScolaire } from "../../../../utils/types/data";
import { alertError, alertServerError, alertSuccess } from "../../../../helpers/alertError";
import PageLayout from "../../../../layouts/PageLayout";
import { useRefresh } from "../../../../contexts/RefreshContext";


export default function NiveauScolairesPage() {
  const navigate = useNavigate();
  const [selectedNiveau, setSelectedNiveau] = useState<NiveauScolaire | null>(null);
  const [niveauToDelete, setNiveauToDelete] = useState<NiveauScolaire | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { niveauxScolaires, error, deleteNiveau } = useNiveauScolaire();

  const filteredNiveaux = niveauxScolaires.filter(niveau =>
    niveau.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const { triggerRefresh } = useRefresh();




  const handleDelete = async () => {
    if (!niveauToDelete?.id) {
      alertError();
      return;
    }
    setIsDeleting(true);
    try {
      await deleteNiveau(niveauToDelete.id);
      triggerRefresh(); // ← recharge les données dans le layout

      if (error) {
        alertServerError(error);

      } else {
        alertSuccess("Niveau scolaire supprimé avec succès");
        setNiveauToDelete(null);
        setSelectedNiveau(null);
      }

    } catch (error) {
      alertServerError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAction = (niveau: NiveauScolaire) => {
    setSelectedNiveau(niveau);
  };

  const handleCloseMenuModal = () => {
    setSelectedNiveau(null);
  };

  const handleCloseDeleteModal = () => {
    setNiveauToDelete(null);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <PageLayout
      title="Niveaux scolaires"
      description={`${filteredNiveaux.length} niveau${filteredNiveaux.length > 1 ? 'x' : ''} configurés`}
      actions={
        <button
          onClick={() => navigate("/admin/configuration/niveaux-scolaire/new")}
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
            placeholder="Rechercher un niveau scolaire..."
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

      {/* Liste avec animation */}
      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <NiveauScolairesList
          niveaux={filteredNiveaux}
          onAction={handleAction}
        />
      </div>

      {/* Message si aucun résultat avec animation */}
      {filteredNiveaux.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <Layers size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Aucun niveau scolaire trouvé</p>
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Effacer la recherche
            </button>
          )}
        </div>
      )}

      {/* Modal actions sur un niveau */}
      {selectedNiveau && (
        <MenuModal
          menu={[
            {
              label: "Voir détails",
              icon: FileText,
              onClick: () => {
                navigate("/admin/configuration/niveaux-scolaire/details", { state: selectedNiveau });
                setSelectedNiveau(null);
              }
            },
            {
              label: "Modifier",
              icon: Plus,
              onClick: () => {
                navigate("/admin/configuration/niveaux-scolaire/update", { state: selectedNiveau });
                setSelectedNiveau(null);
              }
            },

            {
              label: "Supprimer",
              icon: MoreVertical,
              onClick: () => {
                setNiveauToDelete(selectedNiveau);
                setSelectedNiveau(null);
              }
            }
          ]}
          isOpen={!!selectedNiveau}
          onClose={handleCloseMenuModal}
          title={selectedNiveau.nom}
          icon={<Layers className="text-primary" size={20} />}
        />
      )}

      {/* Modal confirmation suppression */}
      <DeleteConfirmationModal
        isOpen={!!niveauToDelete}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title="Supprimer le niveau scolaire"
        message={`Êtes-vous sûr de vouloir supprimer le niveau "${niveauToDelete?.nom}" ? Cette action est irréversible.`}
        confirmText={isDeleting ? "Suppression..." : "Supprimer"}
        cancelText="Annuler"
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