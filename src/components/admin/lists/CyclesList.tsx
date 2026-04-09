// src/components/admin/lists/CyclesList.tsx
import useNiveauxClasses from "../../../hooks/niveauxClasses/useNiveauxClasses";
import { Cycle } from "../../../utils/types/data";
import CycleRow from "../items/CycleRow";
import GenericList from "../../ui/tables/TableList";

interface CyclesListProps {
  cycles: Cycle[];
  onAction: (cycle: Cycle) => void;
  onSelectCycles?: (selectedCycles: Cycle[]) => void;
  selectable?: boolean;
}

export default function CyclesList({ 
  cycles, 
  onAction, 
  onSelectCycles,
  selectable = true 
}: CyclesListProps) {
  const { niveauxClasse } = useNiveauxClasses();

  const getNiveauxClasseCount = (cycleId: string) => {
    return niveauxClasse.filter(nc => nc.cycleId === cycleId).length;
  };

 

  const columns = [
    { header: "Cycle", className: "w-1/4" },
    { header: "Niveau scolaire", className: "w-1/4" },
    { header: "Niveaux de classe", className: "w-1/4" },
    { header: "Date de création", className: "w-1/4" },
  ];

  return (
    <GenericList
      items={cycles}
      columns={columns}
      getId={(cycle) => cycle.id}
      onAction={onAction}
      onSelectItems={onSelectCycles}
      selectable={selectable}
      emptyMessage="Aucun cycle trouvé"
      renderRow={(cycle, isSelected, onSelect) => (
        <CycleRow
          key={cycle.id}
          cycle={cycle}
          onAction={onAction}
          onSelect={onSelect}
          isSelected={isSelected}
          niveauxClasseCount={getNiveauxClasseCount(cycle.id)}
          selectable={selectable}
        />
      )}
    />
  );
}