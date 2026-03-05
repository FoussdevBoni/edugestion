// src/components/admin/lists/ClassesList.tsx

import { Classe } from "../../../utils/types/data";
import ClasseRow from "../items/ClasseRow";


interface ClassesListProps {
  classes: Classe[];
  onAction: (classe: Classe) => void;
  elevesCount?: Record<string, number>;
}

export default function ClassesList({ classes, onAction, elevesCount = {} }: ClassesListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Classe
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Niveau de classe
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cycle
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Niveau scolaire
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Élèves
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
            {classes.length > 0 ? (
              classes.map((classe) => (
                <ClasseRow
                  key={classe.id} 
                  classe={classe} 
                  onAction={onAction}
                  elevesCount={elevesCount[classe.id] || 0}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  Aucune classe trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}