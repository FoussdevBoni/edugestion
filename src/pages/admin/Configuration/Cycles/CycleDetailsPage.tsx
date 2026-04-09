// src/pages/admin/configuration/cycles/CycleDetailsPage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeft, Edit, Trash2, BookOpen,
    Layers, Plus
} from "lucide-react";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import useNiveauxClasses from "../../../../hooks/niveauxClasses/useNiveauxClasses";
import NiveauxClasseList from "../../../../components/admin/lists/NiveauxClasseList";
import { NiveauClasse } from "../../../../utils/types/data";
import NiveauClasseModals from "../../../../components/admin/modals/NiveauClasseModals";
import { cycleService } from "../../../../services/cycleService";
import { alertError } from "../../../../helpers/alertError";


export default function CycleDetailsPage() {
    const location = useLocation();
    const cycle = location.state;
    const navigate = useNavigate();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const { niveauxClasse, deleteNiveauClasse } = useNiveauxClasses()

    const [selectedNiveauClasse, setSelectedNiveauClasse] = useState<NiveauClasse | null>(null);
    const [niveauClasseToDelete, setNiveauClasseToDelete] = useState<NiveauClasse | null>(null);

    const handleAction = (niveau: NiveauClasse) => {
        setSelectedNiveauClasse(niveau);
    };

    const handleCloseMenuModal = () => {
        setSelectedNiveauClasse(null);
    };

    const handleCloseDeleteModal = () => {
        setNiveauClasseToDelete(null);
    };

    if (!cycle) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Cycle non trouvé</h2>
                    <p className="text-gray-500 mb-4">Les informations du cycle sont introuvables.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                        Retour à la liste
                    </button>
                </div>
            </div>
        );
    }

    // Récupérer les niveaux de classe de ce cycle
    const niveauxClasseDuCycle = niveauxClasse.filter(nc => nc.cycleId === cycle.id);



    const handleUpdate = () => {
        navigate("/admin/configuration/cycles/update", { state: cycle });
    };

    const handleDelete = async () => {
        if (cycle.id) {
            alertError()
        }
        try {
            await cycleService.delete(cycle.id)
            console.log("Suppression du cycle:", cycle);
            setOpenDeleteModal(false);
            navigate("/admin/configuration/cycles");
        } catch (error) {
            alertError()
        }
    };

    const handleDeleteNiveauClasse = async () => {
        if (!niveauClasseToDelete?.id) {
            alert("Une erreur s'est produite")
            return
        }
        try {
            deleteNiveauClasse(niveauClasseToDelete?.id)
            setOpenDeleteModal(false);
        } catch (error) {

        }

    };

    const handleAddNiveauClasse = () => {
        navigate("/admin/configuration/niveaux-classe/new", {
            state: {
                cycleId: cycle.id,
                cycleNom: cycle.nom,
                niveauScolaire: cycle.niveauScolaire
            }
        });
    };



    return (
        <div className="min-h-screen bg-gray-50">
            {/* En-tête */}
            <div className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={20} className="text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">{cycle.nom}</h1>
                                <p className="text-sm text-gray-500">
                                    {cycle.niveauScolaire} • {niveauxClasseDuCycle.length} niveau{niveauxClasseDuCycle.length > 1 ? 'x' : ''} de classe
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleAddNiveauClasse}
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                <Plus size={16} />
                                Ajouter un niveau
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <Edit size={16} />
                                Modifier
                            </button>
                            <button
                                onClick={() => setOpenDeleteModal(true)}
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                <Trash2 size={16} />
                                Supprimer
                            </button>
                        </div>
                    </div>


                </div>
            </div>

            {/* Contenu */}
            <div className="p-6">
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* Informations générales */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800">Informations générales</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Nom du cycle</p>
                                    <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                                        <BookOpen size={16} className="text-primary" />
                                        {cycle.nom}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Niveau scolaire</p>
                                    <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                                        <Layers size={16} className="text-blue-500" />
                                        {cycle.niveauScolaire}
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Niveaux de classe du cycle */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Layers size={18} className="text-primary" />
                                Niveaux de classe ({niveauxClasseDuCycle.length})
                            </h2>
                            <button
                                onClick={handleAddNiveauClasse}
                                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                            >
                                <Plus size={16} />
                                Ajouter un niveau
                            </button>
                        </div>
                        <div className="p-6">
                            {niveauxClasseDuCycle.length > 0 ? (
                                <NiveauxClasseList niveauxClasse={niveauxClasse} onAction={(niveau) => {
                                    handleAction(niveau)
                                }} />
                            ) : (
                                <div className="text-center py-8">
                                    <Layers size={48} className="mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500 mb-4">Aucun niveau de classe n'a encore été ajouté à ce cycle</p>
                                    <button
                                        onClick={handleAddNiveauClasse}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                                    >
                                        <Plus size={16} />
                                        Ajouter un niveau de classe
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de suppression */}
            <DeleteConfirmationModal
                isOpen={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={handleDelete}
                title="Supprimer le cycle"
                message={`Êtes-vous sûr de vouloir supprimer le cycle "${cycle.nom}" ? Cette action est irréversible et supprimera également tous les niveaux de classe associés.`}
                confirmText="Supprimer"
                cancelText="Annuler"
            />



            <NiveauClasseModals
                handleDelete={handleDeleteNiveauClasse}
                niveauClasseToDelete={niveauClasseToDelete}
                selectedNiveauClasse={selectedNiveauClasse}
                setNiveauClasseToDelete={setNiveauClasseToDelete}
                setSelectedNiveauClasse={setSelectedNiveauClasse}
                handleCloseDeleteModal={handleCloseDeleteModal}
                handleCloseMenuModal={handleCloseMenuModal}
            />


        </div>
    );
}