// src/components/admin/lists/NiveauScolairesList.tsx
import { cycles } from "../../../data/baseData";
import { NiveauScolaire } from "../../../utils/types/data";
import NiveauScolaireRow from "../items/NiveauScolaireRow";

interface NiveauScolairesListProps {
  niveaux: NiveauScolaire[];
  onAction: (niveau: NiveauScolaire) => void;
}

export default function NiveauxScolaireList({ niveaux, onAction }: NiveauScolairesListProps) {
  // Compter les cycles pour chaque niveau
  const getCyclesCount = (niveauId: string) => {
    return cycles.filter(cycle => cycle.niveauScolaireId === niveauId).length;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Niveau scolaire
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cycles
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
            {niveaux.length > 0 ? (
              niveaux.map((niveau) => (
                <NiveauScolaireRow
                  key={niveau.id} 
                  niveau={niveau} 
                  onAction={onAction}
                  cyclesCount={getCyclesCount(niveau.id)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  Aucun niveau scolaire trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}