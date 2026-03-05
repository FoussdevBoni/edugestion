import { Eleve } from "../../../utils/types/data"
import EleveRow from "../items/EleveRow";

interface ElevesListProps {
  eleves: Eleve[];
  onAction: (eleve: Eleve) => void;
}

export default function ElevesList({ eleves, onAction }: ElevesListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Élève
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Date naissance
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Classe
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Sexe
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {eleves.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-8 text-gray-500">
                Aucun élève trouvé
              </td>
            </tr>
          ) : (
            eleves.map((eleve) => (
              <EleveRow
                key={eleve.id} 
                eleve={eleve} 
                onAction={() => onAction(eleve)} 
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}