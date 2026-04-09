// src/components/admin/lists/ClassesList.tsx
import { Classe } from "../../../utils/types/data";
import TableList, { SelectAction } from "../../ui/tables/TableList";
import ClasseRow from "../items/ClasseRow";


interface ClassesListProps {
  classes: Classe[];
  onAction: (classe: Classe) => void;
  onSelectClasses?: (selectedClasses: Classe[]) => void;
  elevesCount?: Record<string, number>;
  selectable?: boolean;
  selectActions?: SelectAction[];

}

export default function ClassesList({
  classes,
  onAction,
  onSelectClasses,
  elevesCount = {},
  selectable = true,
  selectActions
}: ClassesListProps) {
  const columns = [
    { header: "Classe", className: "w-1/3" },
    { header: "Élèves", className: "w-1/3" },
    { header: "Date de création", className: "w-1/3" },
  ];

  return (
    <TableList
      items={classes}
      columns={columns}
      getId={(classe) => classe.id}
      onAction={onAction}
      onSelectItems={onSelectClasses}
      selectable={selectable}
      emptyMessage="Aucune classe trouvée"
      actionColumn={true}
      selectActions={selectActions}
      renderRow={(classe, isSelected, onSelect) => (
        <ClasseRow
          key={classe.id}
          classe={classe}
          onAction={onAction}
          onSelect={onSelect}
          isSelected={isSelected}
          elevesCount={elevesCount[classe.id] || classe.effectifTotal || 0}
          selectable={selectable}
        />
      )}
    />
  );
}