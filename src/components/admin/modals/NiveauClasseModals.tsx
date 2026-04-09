import MenuModal from '../../ui/MenuModal';
import { useNavigate } from 'react-router-dom';
import { FileText, MoreVertical, Plus, Printer } from 'lucide-react';
import { NiveauClasse } from '../../../utils/types/data';
import DeleteConfirmationModal from '../../ui/DeleteConfirmationModal';

interface NiveauClasseModalsProps {
    selectedNiveauClasse: NiveauClasse | null,
    setSelectedNiveauClasse: React.Dispatch<React.SetStateAction<NiveauClasse | null>>;
    setNiveauClasseToDelete: React.Dispatch<React.SetStateAction<NiveauClasse | null>>
    handleCloseMenuModal: () => void;
    niveauClasseToDelete: NiveauClasse | null;
    handleCloseDeleteModal: () => void;
    handleDelete: () => void

}
export default function NiveauClasseModals(
    { selectedNiveauClasse,
        niveauClasseToDelete,
        setSelectedNiveauClasse,
        setNiveauClasseToDelete,
        handleCloseMenuModal,
        handleCloseDeleteModal,
        handleDelete
    }: NiveauClasseModalsProps) {
    const navigate = useNavigate()
    return (
        <div>
            {selectedNiveauClasse && (
                <MenuModal
                    menu={[
                        {
                            label: "Voir détails",
                            icon: FileText,
                            onClick: () => {
                                navigate("/admin/configuration/niveaux-classe/details", { state: selectedNiveauClasse });
                                setSelectedNiveauClasse(null);
                            }
                        },
                        {
                            label: "Modifier",
                            icon: Plus,
                            onClick: () => {
                                navigate("/admin/configuration/niveaux-classe/update", { state: selectedNiveauClasse });
                                setSelectedNiveauClasse(null);
                            }
                        },
                        {
                            label: "Gérer les classes",
                            icon: Printer,
                            onClick: () => {
                                navigate("/admin/configuration/classes", { state: { niveauClasseId: selectedNiveauClasse.id } });
                                setSelectedNiveauClasse(null);
                            }
                        },
                        {
                            label: "Supprimer",
                            icon: MoreVertical,
                            onClick: () => {
                                setNiveauClasseToDelete(selectedNiveauClasse);
                                setSelectedNiveauClasse(null);
                            }
                        }
                    ]}
                    isOpen={!!selectedNiveauClasse}
                    onClose={handleCloseMenuModal}
                    title={selectedNiveauClasse.nom}
                    icon={<Plus className="text-primary" size={20} />}
                />
            )}

            {/* Modal confirmation suppression */}
            <DeleteConfirmationModal
                isOpen={!!niveauClasseToDelete}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDelete}
                title="Supprimer le niveau de classe"
                message={`Êtes-vous sûr de vouloir supprimer le niveau "${niveauClasseToDelete?.nom}" ? Cette action est irréversible.`}
                confirmText="Supprimer"
                cancelText="Annuler"
            />
        </div>
    )
}
