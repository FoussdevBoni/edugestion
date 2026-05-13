// src/components/admin/lists/InscriptionsList.tsx
import { Inscription } from "../../../utils/types/data";
import TableList, { SelectAction } from "../../ui/tables/TableList";
import InscriptionRow from "../items/InscriptionRow";

interface InscriptionsListProps {
  inscriptions: Inscription[];
  onAction: (inscription: Inscription) => void;
  onSelectInscriptions?: (selectedInscriptions: Inscription[]) => void;
  selectable?: boolean;
  selectActions?: SelectAction[];
}

export default function InscriptionsList({
  inscriptions,
  onAction,
  onSelectInscriptions,
  selectable = false,
  selectActions
}: InscriptionsListProps) {
  const columns = [
    { header: "Élève", className: "w-1/4" },
    { header: "Classe", className: "w-1/6" },
    { header: "Statut scolaire", className: "w-1/6" },
    { header: "Paiement", className: "w-1/6" },
    { header: "Date inscription", className: "w-1/6" },
    { header: "Année", className: "w-1/6" },
  ];

  return (
    <TableList
      items={inscriptions}
      columns={columns}
      getId={(inscription) => inscription.id}
      onAction={onAction}
      onSelectItems={onSelectInscriptions}
      selectable={selectable}
      emptyMessage="Aucune inscription trouvée"
      actionColumn={true}
      selectActions={selectActions}
      renderRow={(inscription, isSelected, onSelect) => (
        <InscriptionRow
          key={inscription.id}
          inscription={inscription}
          onAction={onAction}
          onSelect={onSelect}
          isSelected={isSelected}
          selectable={selectable}
        />
      )}
    />
  );
}