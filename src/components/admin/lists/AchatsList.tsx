// src/pages/admin/materiel/components/AchatsList.tsx
import { Achat } from "../../../utils/types/data";
import TableList from "../../ui/tables/TableList";
import AchatRow from "../items/AchatRow";

interface AchatsListProps {
  achats: Achat[];
  materiels: Record<string, string>;
  onAction: (achat: Achat) => void;
  onSelectAchats?: (selectedAchats: Achat[]) => void;
  selectable?: boolean;
}

export default function AchatsList({ 
  achats, 
  materiels, 
  onAction,
  onSelectAchats,
  selectable = true
}: AchatsListProps) {
  const columns = [
    { header: "Date", className: "w-1/6" },
    { header: "Matériel", className: "w-1/3" },
    { header: "Qté", className: "w-1/6 text-right" },
    { header: "Prix unitaire", className: "w-1/6 text-right" },
    { header: "Total", className: "w-1/6 text-right" },
  ];

  return (
    <TableList
      items={achats}
      columns={columns}
      getId={(achat) => achat.id}
      onAction={onAction}
      onSelectItems={onSelectAchats}
      selectable={selectable}
      emptyMessage="Aucun achat trouvé"
      actionColumn={true}
      renderRow={(achat, isSelected, onSelect) => (
        <AchatRow
          key={achat.id}
          achat={achat}
          onAction={onAction}
          materiels={materiels}
          onSelect={onSelect}
          isSelected={isSelected}
          selectable={selectable}
        />
      )}
    />
  );
}