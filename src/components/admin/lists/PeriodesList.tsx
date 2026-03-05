// src/components/admin/lists/PeriodesList.tsx

import { Periode } from "../../../utils/types/data";
import PeriodeRow from "../items/PeriodeRow";


interface PeriodesListProps {
  periodes: Periode[];
  onAction: (periode: Periode) => void;
  evaluationsCount?: Record<string, number>;
}

export default function PeriodesList({ periodes, onAction, evaluationsCount = {} }: PeriodesListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Période
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Niveau scolaire
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Évaluations
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
            {periodes.length > 0 ? (
              periodes.map((periode) => (
                <PeriodeRow 
                  key={periode.id} 
                  periode={periode} 
                  onAction={onAction}
                  evaluationsCount={evaluationsCount[periode.id] || 0}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  Aucune période trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}