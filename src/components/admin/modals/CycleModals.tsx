import MenuModal from '../../ui/MenuModal';
import { useNavigate } from 'react-router-dom';
import { FileText, MoreVertical, Plus, Printer } from 'lucide-react';
import { Cycle } from '../../../utils/types/data';
import DeleteConfirmationModal from '../../ui/DeleteConfirmationModal';

interface Props {
  selectedCycle: Cycle,
  setSelectedCycle: React.Dispatch<React.SetStateAction<Cycle | null>>;
  setCycleToDelete: React.Dispatch<React.SetStateAction<Cycle | null>>;
  handleCloseMenuModal: () => void
}
export const CycleMenuModal = ({ selectedCycle, setSelectedCycle,
  setCycleToDelete, handleCloseMenuModal }: Props) => {
  const navigate = useNavigate()
  return (
    <MenuModal
      menu={[
        {
          label: "Voir détails",
          icon: FileText,
          onClick: () => {
            navigate("/admin/configuration/cycles/details", { state: selectedCycle });
            setSelectedCycle(null);
          }
        },
        {
          label: "Modifier",
          icon: Plus,
          onClick: () => {
            navigate("/admin/configuration/cycles/update", { state: selectedCycle });
            setSelectedCycle(null);
          }
        },
        {
          label: "Gérer les niveaux",
          icon: Printer,
          onClick: () => {
            navigate("/admin/configuration/niveaux-classe", {
              state: {
                cycleId:
                  selectedCycle?.id
              }
            });
            setSelectedCycle(null);
          }
        },
        {
          label: "Supprimer",
          icon: MoreVertical,
          onClick: () => {
            setCycleToDelete(selectedCycle);
            setSelectedCycle(null);
          }
        }
      ]}
      isOpen={!!selectedCycle}
      onClose={handleCloseMenuModal}
      title={selectedCycle.nom}
      icon={<Plus className="text-primary" size={20} />}
    />
  )
}


interface CycleDeleteModalProps {
 cycleToDelete: Cycle | null,
 handleCloseDeleteModal: ()=>void;
 handleDelete: ()=>void
}

export const CycleDeleModal = ({cycleToDelete , handleCloseDeleteModal , handleDelete}: CycleDeleteModalProps) => {
  return (
    <DeleteConfirmationModal
      isOpen={!!cycleToDelete}
      onClose={handleCloseDeleteModal}
      onConfirm={handleDelete}
      title="Supprimer le cycle"
      message={`Êtes-vous sûr de vouloir supprimer le cycle "${cycleToDelete?.nom}" ? Cette action est irréversible.`}
      confirmText="Supprimer"
      cancelText="Annuler"
    />
  )
}
