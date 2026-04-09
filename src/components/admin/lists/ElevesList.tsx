// src/components/admin/lists/ElevesList.tsx
import { Eleve } from "../../../utils/types/data";
import TableList, { SelectAction } from "../../ui/tables/TableList";
import EleveRow from "../items/EleveRow";

interface ElevesListProps {
  eleves: Eleve[];
  onAction: (eleve: Eleve) => void;
  onSelectEleves?: (selectedEleves: Eleve[]) => void;
  selectable?: boolean;
  selectActions?: SelectAction[];

}

export default function ElevesList({
  eleves,
  onAction,
  onSelectEleves,
  selectable = false,
  selectActions
}: ElevesListProps) {
  const columns = [
    { header: "Élève", className: "w-2/5" },
    { header: "Date naissance", className: "w-1/5" },
    { header: "Classe", className: "w-1/5" },
    { header: "Sexe", className: "w-1/5" },
  ];

  return (
    <TableList
      items={eleves}
      columns={columns}
      getId={(eleve) => eleve.id}
      onAction={onAction}
      onSelectItems={onSelectEleves}
      selectable={selectable}
      emptyMessage="Aucun élève trouvé"
      actionColumn={true}
      selectActions={selectActions}
      renderRow={(eleve, isSelected, onSelect) => (
        <EleveRow
          key={eleve.id}
          eleve={eleve}
          onAction={onAction}
          onSelect={onSelect}
          isSelected={isSelected}
          selectable={selectable}
        />
      )}
    />
  );
}