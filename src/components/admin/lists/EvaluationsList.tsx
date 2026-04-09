// src/components/admin/lists/EvaluationsList.tsx

import { Evaluation } from "../../../utils/types/data";
import EvaluationRow from "../items/EvaluationRow";


interface EvaluationsListProps {
  evaluations: Evaluation[];
  onAction: (evaluation: Evaluation) => void;
}

export default function EvaluationsList({ evaluations, onAction }: EvaluationsListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Évaluation
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Période
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Abréviation
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {evaluations.length > 0 ? (
              evaluations.map((evaluation) => (
                <EvaluationRow
                  key={evaluation.id} 
                  evaluation={evaluation} 
                  onAction={onAction}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  Aucune évaluation trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}