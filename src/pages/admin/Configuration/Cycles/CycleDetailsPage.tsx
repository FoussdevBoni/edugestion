// src/pages/admin/configuration/cycles/CycleDetailsPage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeft, Edit, Trash2, Calendar, BookOpen,
    ChevronRight, Layers, Plus
} from "lucide-react";
import { niveauxClasse } from "../../../../data/baseData";
import DeleteConfirmationModal from "../../../../components/ui/DeleteConfirmationModal";


export default function CycleDetailsPage() {
    const location = useLocation();
    const cycle = location.state;
    const navigate = useNavigate();
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    if (!cycle) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Cycle non trouvé</h2>
                    <p className="text-gray-500 mb-4">Les informations du cycle sont introuvables.</p>
                    <button
                        onClick={() => navigate("/admin/configuration/cycles")}
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

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleUpdate = () => {
        navigate("/admin/configuration/cycles/update", { state: cycle });
    };

    const handleDelete = () => {
        console.log("Suppression du cycle:", cycle);
        setOpenDeleteModal(false);
        navigate("/admin/configuration/cycles");
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

    const handleViewNiveauClasse = (niveauClasse: any) => {
        navigate("/admin/configuration/niveaux-classe/details", { state: niveauClasse });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* En-tête */}
            <div className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/admin/configuration/cycles")}
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

                    {/* Fil d'Ariane */}
                    <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                        <span onClick={() => navigate("/admin")} className="hover:text-primary cursor-pointer">
                            Dashboard
                        </span>
                        <ChevronRight size={14} />
                        <span onClick={() => navigate("/admin/parametres")} className="hover:text-primary cursor-pointer">
                            Paramètres
                        </span>
                        <ChevronRight size={14} />
                        <span onClick={() => navigate("/admin/configuration/cycles")} className="hover:text-primary cursor-pointer">
                            Cycles
                        </span>
                        <ChevronRight size={14} />
                        <span className="text-gray-700">{cycle.nom}</span>
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                <div>
                                    <p className="text-sm text-gray-500">Date de création</p>
                                    <p className="font-medium text-gray-800 flex items-center gap-2 mt-1">
                                        <Calendar size={16} className="text-gray-400" />
                                        {formatDate(cycle.createdAt)}
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {niveauxClasseDuCycle.map((niveau) => (
                                        <div
                                            key={niveau.id}
                                            onClick={() => handleViewNiveauClasse(niveau)}
                                            className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition cursor-pointer"
                                        >
                                            <h3 className="font-medium text-gray-800">{niveau.nom}</h3>
                                            <p className="text-sm text-gray-500 mt-1">ID: {niveau.id.substring(0, 8)}...</p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                Créé le {formatDate(niveau.createdAt)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
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
        </div>
    );
}