// src/pages/admin/configuration/cycles/CycleDetailsPage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeft, Edit, Trash2, BookOpen,
    Layers, Plus, AlertCircle, CheckCircle
} from "lucide-react";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";
import useNiveauxClasses from "../../../../hooks/niveauxClasses/useNiveauxClasses";
import NiveauxClasseList from "../../../../components/admin/lists/NiveauxClasseList";
import { NiveauClasse } from "../../../../utils/types/data";
import NiveauClasseModals from "../../../../components/admin/modals/NiveauClasseModals";
import { cycleService } from "../../../../services/cycleService";
import { alertError, alertSuccess } from "../../../../helpers/alertError";

export default function CycleDetailsPage() {
    const location = useLocation();
    const cycle = location.state;
    const navigate = useNavigate();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { niveauxClasse, deleteNiveauClasse } = useNiveauxClasses();

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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 animate-fade-in-up">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} className="text-red-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Cycle non trouvé</h2>
                    <p className="text-gray-500 mb-4">Les informations du cycle sont introuvables.</p>
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

    const niveauxClasseDuCycle = niveauxClasse.filter(nc => nc.cycleId === cycle.id);

    const handleUpdate = () => {
        navigate("/admin/configuration/cycles/update", { state: cycle });
    };

    const handleDelete = async () => {
        if (!cycle.id) {
            alertError();
            return;
        }
        setIsDeleting(true);
        try {
            await cycleService.delete(cycle.id);
            setOpenDeleteModal(false);
            alertSuccess("Cycle supprimé avec succès");
            setTimeout(() => {
                navigate("/admin/configuration/cycles");
            }, 1500);
        } catch (error) {
            alertError();
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteNiveauClasse = async () => {
        if (!niveauClasseToDelete?.id) {
            alertError();
            return;
        }
        try {
            await deleteNiveauClasse(niveauClasseToDelete.id);
            setNiveauClasseToDelete(null);
            alertSuccess("Niveau de classe supprimé avec succès");
        } catch (error) {
            alertError();
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
                                <h1 className="text-2xl font-bold text-gray-800">{cycle.nom}</h1>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <Layers size={14} />
                                    {cycle.niveauScolaire} • {niveauxClasseDuCycle.length} niveau{niveauxClasseDuCycle.length > 1 ? 'x' : ''} de classe
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleAddNiveauClasse}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                            >
                                <Plus size={16} />
                                Ajouter un niveau
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <BookOpen size={16} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Nom du cycle</p>
                                        <p className="font-semibold text-gray-800">{cycle.nom}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Layers size={16} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Niveau scolaire</p>
                                        <p className="font-semibold text-gray-800">{cycle.niveauScolaire}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Niveaux de classe du cycle */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Layers size={18} className="text-primary" />
                                Niveaux de classe ({niveauxClasseDuCycle.length})
                            </h2>
                            <button
                                onClick={handleAddNiveauClasse}
                                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 font-medium"
                            >
                                <Plus size={16} />
                                Ajouter un niveau
                            </button>
                        </div>
                        <div className="p-6">
                            {niveauxClasseDuCycle.length > 0 ? (
                                <NiveauxClasseList 
                                    niveauxClasse={niveauxClasseDuCycle} 
                                    onAction={handleAction} 
                                />
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Layers size={32} className="text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 mb-4">Aucun niveau de classe n'a encore été ajouté à ce cycle</p>
                                    <button
                                        onClick={handleAddNiveauClasse}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300"
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

            {/* Modal de suppression cycle */}
            <DeleteConfirmationModal
                isOpen={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={handleDelete}
                title="Supprimer le cycle"
                message={`Êtes-vous sûr de vouloir supprimer le cycle "${cycle.nom}" ? Cette action est irréversible et supprimera également tous les niveaux de classe associés.`}
                confirmText={isDeleting ? "Suppression..." : "Supprimer"}
                cancelText="Annuler"
            />

            {/* Modals pour niveaux de classe */}
            <NiveauClasseModals
                handleDelete={handleDeleteNiveauClasse}
                niveauClasseToDelete={niveauClasseToDelete}
                selectedNiveauClasse={selectedNiveauClasse}
                setNiveauClasseToDelete={setNiveauClasseToDelete}
                setSelectedNiveauClasse={setSelectedNiveauClasse}
                handleCloseDeleteModal={handleCloseDeleteModal}
                handleCloseMenuModal={handleCloseMenuModal}
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