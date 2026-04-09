// src/pages/admin/configuration/niveaux/NiveauScolaireDetailsPage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeft, Edit, Trash2, Calendar, Layers,
    BookOpen, Plus
} from "lucide-react";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import useCycles from "../../../../hooks/cycles/useCycles";
import CyclesList from "../../../../components/admin/lists/CyclesList";
import { Cycle } from "../../../../utils/types/data";
import { CycleDeleModal, CycleMenuModal } from "../../../../components/admin/modals/CycleModals";
import { niveauScolaireService } from "../../../../services/niveauScolaireService";


export default function NiveauScolaireDetailsPage() {
    const location = useLocation();
    const niveau = location.state;
    const navigate = useNavigate();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedCycle, setSelectedCycle] = useState<Cycle | null>(null);
    const [cycleToDelete, setCycleToDelete] = useState<Cycle | null>(null);
    const { cycles, deleteCycle } = useCycles()

    if (!niveau) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Niveau non trouvé</h2>
                    <p className="text-gray-500 mb-4">Les informations du niveau scolaire sont introuvables.</p>
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

    // Récupérer les cycles de ce niveau
    const cyclesDuNiveau = cycles.filter(cycle => cycle.niveauScolaireId === niveau.id);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleUpdate = () => {
        navigate("/admin/configuration/niveaux-scolaire/update", { state: niveau });
    };

    const handleDelete = async () => {
        if (!niveau?.id) {
            alert("Une erreur s'est produite. Veillez réessayer")
            return
        }
        try {
            await niveauScolaireService.delete(niveau?.id)
            navigate("/admin/configuration/niveaux-scolaire");

        } catch (error) {
            alert("Une erreur s'est produite. Veillez réessayer")
        }
    };
    const handleAddCycle = () => {
        navigate("/admin/configuration/cycles/new", { state: { niveauId: niveau.id, niveauNom: niveau.nom } });
    };




    const handleDeleteCycle = () => {
        if (!cycleToDelete?.id) {
            alert("Une erreur s'est produite")
            return
        }
        try {
            deleteCycle(cycleToDelete?.id)
            setCycleToDelete(null);
            setSelectedCycle(null);
        } catch (error) {
            alert("Une erreur s'est produite")
        }

    };


    const handleAction = (cycle: Cycle) => {
        setSelectedCycle(cycle);
    };

    const handleCloseMenuModal = () => {
        setSelectedCycle(null);
    };

    const handleCloseDeleteModal = () => {
        setCycleToDelete(null);
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
                                <h1 className="text-2xl font-bold text-gray-800">{niveau.nom}</h1>
                                <p className="text-sm text-gray-500">
                                    Détails du niveau scolaire • {cyclesDuNiveau.length} cycle{cyclesDuNiveau.length > 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleAddCycle}
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                <Plus size={16} />
                                Ajouter un cycle
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
                                    <p className="text-sm text-gray-500">Nom du niveau</p>
                                    <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                                        <Layers size={16} className="text-primary" />
                                        {niveau.nom}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Date de création</p>
                                    <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                                        <Calendar size={16} className="text-gray-400" />
                                        {formatDate(niveau.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cycles du niveau */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <BookOpen size={18} className="text-primary" />
                                Cycles ({cyclesDuNiveau.length})
                            </h2>
                            <button
                                onClick={handleAddCycle}
                                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                            >
                                <Plus size={16} />
                                Ajouter un cycle
                            </button>
                        </div>
                        <div className="p-6">
                            {cyclesDuNiveau.length > 0 ? (
                                <CyclesList cycles={cyclesDuNiveau} onAction={(cycle) => {
                                    handleAction(cycle)
                                }} />
                            ) : (
                                <div className="text-center py-8">
                                    <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500 mb-4">Aucun cycle n'a encore été ajouté à ce niveau</p>
                                    <button
                                        onClick={handleAddCycle}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                                    >
                                        <Plus size={16} />
                                        Ajouter un cycle
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
                title="Supprimer le niveau scolaire"
                message={`Êtes-vous sûr de vouloir supprimer le niveau "${niveau.nom}" ? Cette action est irréversible et supprimera également tous les cycles associés.`}
                confirmText="Supprimer"
                cancelText="Annuler"
            />



            {/* Modal actions sur un cycle */}
            {selectedCycle && (
                <CycleMenuModal
                    selectedCycle={selectedCycle}
                    setSelectedCycle={setSelectedCycle}
                    setCycleToDelete={setCycleToDelete}
                    handleCloseMenuModal={handleCloseMenuModal}

                />
            )}

            {/* Modal confirmation suppression */}
            <CycleDeleModal
                handleCloseDeleteModal={handleCloseDeleteModal}
                handleDelete={handleDeleteCycle}
                cycleToDelete={cycleToDelete}
            />
        </div>
    );
}