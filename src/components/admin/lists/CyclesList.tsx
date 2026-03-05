// src/components/admin/lists/CyclesList.tsx

import { niveauxClasse } from "../../../data/baseData";
import { Cycle } from "../../../utils/types/data";
import CycleRow from "../items/CycleRow";


interface CyclesListProps {
  cycles: Cycle[];
  onAction: (cycle: Cycle) => void;
}

export default function CyclesList({ cycles, onAction }: CyclesListProps) {
  // Compter les niveaux de classe pour chaque cycle
  const getNiveauxClasseCount = (cycleId: string) => {
    return niveauxClasse.filter(nc => nc.cycleId === cycleId).length;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cycle
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Niveau scolaire
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Niveaux de classe
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de création
              </th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cycles.length > 0 ? (
              cycles.map((cycle) => (
                <CycleRow
                  key={cycle.id} 
                  cycle={cycle} 
                  onAction={onAction}
                  niveauxClasseCount={getNiveauxClasseCount(cycle.id)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  Aucun cycle trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}