// src/components/admin/lists/MatieresList.tsx

import { Matiere } from "../../../utils/types/data";
import MatiereRow from "../items/MatiereRow";

interface MatieresListProps {
  matieres: Matiere[];
  onAction: (matiere: Matiere) => void;
}

export default function MatieresList({ matieres, onAction }: MatieresListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Matière
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coefficient
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Niveau de classe
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
            {matieres.length > 0 ? (
              matieres.map((matiere) => (
                <MatiereRow
                  key={matiere.id} 
                  matiere={matiere} 
                  onAction={onAction}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  Aucune matière trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}