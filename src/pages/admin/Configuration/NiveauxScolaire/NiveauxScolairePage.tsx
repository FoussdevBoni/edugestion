// src/pages/admin/configuration/niveaux/NiveauScolairesPage.tsx
import { useState } from "react";
import { Plus, MoreVertical, FileText, Printer, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MenuModal from "../../../../components/ui/MenuModal";
import NiveauScolairesList from "../../../../components/admin/lists/NiveauxScolaireList";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import useNiveauScolaire from "../../../../hooks/niveauxScolaires/useNiveauxScolaires";
import { NiveauScolaire } from "../../../../utils/types/data";


export default function NiveauScolairesPage() {
    const navigate = useNavigate();
    const [selectedNiveau, setSelectedNiveau] = useState<NiveauScolaire | null>(null);
    const [niveauToDelete, setNiveauToDelete] = useState<NiveauScolaire | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const { niveauxScolaires, deleteNiveau } = useNiveauScolaire()

    // Filtrer les niveaux
    const filteredNiveaux = niveauxScolaires.filter(niveau =>
        niveau.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = () => {
        if (!niveauToDelete?.id) {
            alert("Une erreur s'est produite. Veillez réessayer")
            return
        }
        try {

            deleteNiveau(niveauToDelete?.id)
            setNiveauToDelete(null);
            setSelectedNiveau(null);
        } catch (error) {
            alert("Une erreur s'est produite. Veillez réessayer")
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
        <div className="space-y-6">
            {/* En-tête */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Niveaux scolaires</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {filteredNiveaux.length} niveau{filteredNiveaux.length > 1 ? 'x' : ''} configurés
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            navigate("/admin/configuration/niveaux-scolaire/new")
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
                        placeholder="Rechercher un niveau scolaire..."
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
            <NiveauScolairesList niveaux={filteredNiveaux} onAction={handleAction} />

            {/* Message si aucun résultat */}
            {filteredNiveaux.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Aucun niveau scolaire trouvé</p>
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
                            label: "Gérer les cycles",
                            icon: Printer,
                            onClick: () => {
                                navigate("/admin/configuration/cycles", { state: { niveauId: selectedNiveau.id } });
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
                    icon={<Plus className="text-primary" size={20} />}
                />
            )}

            {/* Modal confirmation suppression */}
            <DeleteConfirmationModal
                isOpen={!!niveauToDelete}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDelete}
                title="Supprimer le niveau"
                message={`Êtes-vous sûr de vouloir supprimer le niveau "${niveauToDelete?.nom}" ? Cette action est irréversible.`}
                confirmText="Supprimer"
                cancelText="Annuler"
            />
        </div>
    );
}