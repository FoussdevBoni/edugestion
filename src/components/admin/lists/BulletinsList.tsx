// src/components/admin/lists/BulletinsList.tsx
import { Bulletin } from "../../../utils/types/data";
import TableList, { SelectAction } from "../../ui/tables/TableList";
import BulletinRow from "../items/BulletinRow";

interface BulletinsListProps {
  bulletins: Bulletin[];
  onAction: (bulletin: Bulletin) => void;
  onSelectBulletins?: (selectedBulletins: Bulletin[]) => void;
  selectable?: boolean;
  selectActions?: SelectAction[];
  onUpdateConduite?: (bulletinId: string, conduite: number) => Promise<void>;

}

export default function BulletinsList({
  bulletins,
  onAction,
  onSelectBulletins,
  selectable = true,
  selectActions,
  onUpdateConduite
}: BulletinsListProps) {

  const columns = [
    { header: "Élève", className: "w-1/4" },
    { header: "Classe", className: "w-1/6" },
    { header: "Moyenne", className: "w-1/6" },
    { header: "Rang", className: "w-1/6" },
    { header: "Conduite", className: "w-1/6" },
    { header: "Statut", className: "w-1/6" },
  ];

  return (
    <TableList
      items={bulletins}
      columns={columns}
      getId={(bulletin) => bulletin.id}
      onAction={onAction}
      onSelectItems={onSelectBulletins}
      selectable={selectable}
      emptyMessage="Aucun bulletin trouvé"
      actionColumn={true}
      selectActions={selectActions}
      renderRow={(bulletin, isSelected, onSelect) => (
        <BulletinRow
          key={bulletin.id}
          bulletin={bulletin}
          onAction={onAction}
          onSelect={onSelect}
          isSelected={isSelected}
          selectable={selectable}
          onUpdateConduite={onUpdateConduite}
        />
      )}
    />
  );
}