// src/components/admin/lists/MatieresList.tsx
import { Matiere } from "../../../utils/types/data";
import TableList, { SelectAction } from "../../ui/tables/TableList";
import MatiereRow from "../items/MatiereRow";

interface MatieresListProps {
  matieres: Matiere[];
  onAction: (matiere: Matiere) => void;
  onSelectMatieres?: (selectedMatieres: Matiere[]) => void;
  selectable?: boolean;
    selectActions?: SelectAction[];
  
}

export default function MatieresList({ 
  matieres, 
  onAction, 
  onSelectMatieres,
  selectable = false,
  selectActions
}: MatieresListProps) {
  const columns = [
    { header: "Matière", className: "w-1/3" },
    { header: "Coefficient", className: "w-1/6" },
    { header: "Niveau de classe", className: "w-1/3" },
    { header: "Date de création", className: "w-1/6" },
  ];

  return (
    <TableList
      items={matieres}
      columns={columns}
      getId={(matiere) => matiere.id}
      onAction={onAction}
      onSelectItems={onSelectMatieres}
      selectable={selectable}
      emptyMessage="Aucune matière trouvée"
      actionColumn={true}
      selectActions={selectActions}
      renderRow={(matiere, isSelected, onSelect) => (
        <MatiereRow
          key={matiere.id}
          matiere={matiere}
          onAction={onAction}
          onSelect={onSelect}
          isSelected={isSelected}
          selectable={selectable}
        />
      )}
    />
  );
}