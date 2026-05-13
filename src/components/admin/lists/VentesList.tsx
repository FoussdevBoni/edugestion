// src/pages/admin/comptabilite/ventes/components/VentesList.tsx
import { Vente } from "../../../utils/types/data";
import TableList from "../../../components/ui/tables/TableList";
import VenteRow from "../items/VenteRow";

interface VentesListProps {
  ventes: Vente[];
  materiels: Record<string, string>;
  eleves: Record<string, string>;
  onAction: (vente: Vente) => void;
  onSelectVentes?: (selectedVentes: Vente[]) => void;
  selectable?: boolean;
}

export default function VentesList({ 
  ventes, 
  materiels,
  eleves,
  onAction,
  onSelectVentes,
  selectable = true
}: VentesListProps) {
  const columns = [
    { header: "Date", className: "w-1/6" },
    { header: "Matériel", className: "w-1/4" },
    { header: "Élève", className: "w-1/4" },
    { header: "Qté", className: "w-1/12 text-right" },
    { header: "Prix unitaire", className: "w-1/6 text-right" },
    { header: "Total", className: "w-1/6 text-right" },
  ];

  return (
    <TableList
      items={ventes}
      columns={columns}
      getId={(vente) => vente.id}
      onAction={onAction}
      onSelectItems={onSelectVentes}
      selectable={selectable}
      emptyMessage="Aucune vente trouvée"
      actionColumn={true}
      renderRow={(vente, isSelected, onSelect) => (
        <VenteRow
          key={vente.id}
          vente={vente}
          onAction={onAction}
          materiels={materiels}
          eleves={eleves}
          onSelect={onSelect}
          isSelected={isSelected}
          selectable={selectable}
        />
      )}
    />
  );
}