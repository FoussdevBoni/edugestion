// src/pages/admin/configuration/niveaux/NiveauScolaireDetailsPage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeft, Edit, Trash2, Calendar, Layers,
    BookOpen, Plus, AlertCircle
} from "lucide-react";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import useCycles from "../../../../hooks/cycles/useCycles";
import CyclesList from "../../../../components/admin/lists/CyclesList";
import { Cycle } from "../../../../utils/types/data";
import { CycleDeleModal, CycleMenuModal } from "../../../../components/admin/modals/CycleModals";
import { niveauScolaireService } from "../../../../services/niveauScolaireService";
import { alertError, alertSuccess } from "../../../../helpers/alertError";

export default function NiveauScolaireDetailsPage() {
    const location = useLocation();
    const niveau = location.state;
    const navigate = useNavigate();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedCycle, setSelectedCycle] = useState<Cycle | null>(null);
    const [cycleToDelete, setCycleToDelete] = useState<Cycle | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { cycles, deleteCycle } = useCycles();

    if (!niveau) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 animate-fade-in-up">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} className="text-red-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Niveau non trouvé</h2>
                    <p className="text-gray-500 mb-4">Les informations du niveau scolaire sont introuvables.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300"
                    >
                        Retour à la liste
                    </button>
                </div>
            </div>
        );
    }

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
            alertError();
            return;
        }
        setIsDeleting(true);
        try {
            await niveauScolaireService.delete(niveau.id);
            setOpenDeleteModal(false);
            alertSuccess("Niveau scolaire supprimé avec succès");
            setTimeout(() => {
                navigate("/admin/configuration/niveaux-scolaire");
            }, 1500);
        } catch (error) {
            alertError();
        } finally {
            setIsDeleting(false);
        }
    };

    const handleAddCycle = () => {
        navigate("/admin/configuration/cycles/new", { state: { niveauId: niveau.id, niveauNom: niveau.nom } });
    };

    const handleDeleteCycle = () => {
        if (!cycleToDelete?.id) {
            alertError();
            return;
        }
        try {
            deleteCycle(cycleToDelete.id);
            setCycleToDelete(null);
            setSelectedCycle(null);
            alertSuccess("Cycle supprimé avec succès");
        } catch (error) {
            alertError();
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
        <div className="min-h-screen bg-gray-50 pb-8">
            {/* En-tête sticky avec animation */}
            <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10 animate-fade-in-up">
                <div className="px-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
                            >
                                <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">{niveau.nom}</h1>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <Layers size={14} />
                                    Détails du niveau scolaire • {cyclesDuNiveau.length} cycle{cyclesDuNiveau.length > 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleAddCycle}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                            >
                                <Plus size={16} />
                                Ajouter un cycle
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                            >
                                <Edit size={16} />
                                Modifier
                            </button>
                            <button
                                onClick={() => setOpenDeleteModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                            >
                                <Trash2 size={16} />
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenu avec animations */}
            <div className="p-6">
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* Informations générales */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800">Informations générales</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Layers size={16} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Nom du niveau</p>
                                        <p className="font-semibold text-gray-800">{niveau.nom}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Calendar size={16} className="text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Date de création</p>
                                        <p className="font-semibold text-gray-800">{formatDate(niveau.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cycles du niveau */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <BookOpen size={18} className="text-primary" />
                                Cycles ({cyclesDuNiveau.length})
                            </h2>
                            <button
                                onClick={handleAddCycle}
                                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 font-medium"
                            >
                                <Plus size={16} />
                                Ajouter un cycle
                            </button>
                        </div>
                        <div className="p-6">
                            {cyclesDuNiveau.length > 0 ? (
                                <CyclesList 
                                    cycles={cyclesDuNiveau} 
                                    onAction={handleAction} 
                                />
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <BookOpen size={32} className="text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 mb-4">Aucun cycle n'a encore été ajouté à ce niveau</p>
                                    <button
                                        onClick={handleAddCycle}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300"
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

            {/* Modal de suppression niveau */}
            <DeleteConfirmationModal
                isOpen={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={handleDelete}
                title="Supprimer le niveau scolaire"
                message={`Êtes-vous sûr de vouloir supprimer le niveau "${niveau.nom}" ? Cette action est irréversible et supprimera également tous les cycles associés.`}
                confirmText={isDeleting ? "Suppression..." : "Supprimer"}
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

            {/* Modal confirmation suppression cycle */}
            <CycleDeleModal
                handleCloseDeleteModal={handleCloseDeleteModal}
                handleDelete={handleDeleteCycle}
                cycleToDelete={cycleToDelete}
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
        </div>
    );
}