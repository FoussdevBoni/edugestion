// src/components/admin/lists/MouvementsList.tsx
import { MouvementStock } from "../../../utils/types/data";
import MouvementRow from "../items/MouvementRow";

interface MouvementsListProps {
  mouvements: MouvementStock[];
  materielsDict: Record<string, string>;
  onRowClick?: (mouvement: MouvementStock) => void;
}

export default function MouvementsList({ mouvements, materielsDict, onRowClick }: MouvementsListProps) {
  if (mouvements.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Aucun mouvement trouvé</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matériel</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avant</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Après</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Différence</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motif</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mouvements.map((mouvement) => (
              <MouvementRow
                key={mouvement.id}
                mouvement={mouvement}
                materielNom={materielsDict[mouvement.materielId] || 'Matériel inconnu'}
                onClick={() => onRowClick?.(mouvement)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}