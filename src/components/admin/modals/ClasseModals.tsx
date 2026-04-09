import MenuModal from '../../ui/MenuModal';
import { useNavigate } from 'react-router-dom';
import { FileText, MoreVertical, Plus, Printer } from 'lucide-react';
import { Classe } from '../../../utils/types/data';
import DeleteConfirmationModal from '../../ui/DeleteConfirmationModal';

interface ClasseModalsProps {
    selectedClasse: Classe | null,
    setSelectedClasse: React.Dispatch<React.SetStateAction<Classe | null>>;
    setClasseToDelete: React.Dispatch<React.SetStateAction<Classe | null>>
    handleCloseMenuModal: () => void;
    classeToDelete: Classe | null;
    handleCloseDeleteModal: () => void;
    handleDelete: () => void,
    config?: boolean

}
export default function ClasseModals(
    { selectedClasse,
        classeToDelete,
        config,
        setSelectedClasse,
        setClasseToDelete,
        handleCloseMenuModal,
        handleCloseDeleteModal,
        handleDelete
    }: ClasseModalsProps) {
    const navigate = useNavigate()
    return (
        <div>
            {selectedClasse && (
                <MenuModal
                    menu={[
                        {
                            label: "Voir détails",
                            icon: FileText,
                            onClick: () => {
                                if (config) {
                                    navigate("/admin/configuration/classes/details", { state: selectedClasse });
                                } else {
                                    navigate("/admin/classes/details", { state: selectedClasse });

                                }
                                setSelectedClasse(null);
                            }
                        },
                        {
                            label: "Modifier",
                            icon: Plus,
                            onClick: () => {
                                if (config) {
                                    navigate("/admin/configuration/classes/update", { state: selectedClasse });

                                } else {
                                    navigate("/admin/classes/update", { state: selectedClasse });
                                }
                                setSelectedClasse(null);
                            }
                        },
                        {
                            label: "Gérer les classes",
                            icon: Printer,
                            onClick: () => {

                                if (config) {
                                    navigate("/admin/configuration/classes", { state: { ClasseId: selectedClasse.id } });
                                } else {
                                    navigate("/admin/classes", { state: { ClasseId: selectedClasse.id } });

                                }
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
                title="Supprimer le  de classe"
                message={`Êtes-vous sûr de vouloir supprimer la  "${classeToDelete?.nom}" ? Cette action est irréversible.`}
                confirmText="Supprimer"
                cancelText="Annuler"
            />
        </div>
    )
}
