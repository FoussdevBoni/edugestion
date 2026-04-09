import { Inscription } from "../../../utils/types/data";
import InscriptionRow from "../items/InscriptionRow";


interface InscriptionsListProps {
  inscriptions: Inscription[];
  onAction: (inscription: Inscription) => void;
}

export default function InscriptionsList({ inscriptions, onAction }: InscriptionsListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Élève
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Classe
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut scolaire
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paiement
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date inscription
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Année
              </th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inscriptions.length > 0 ? (
              inscriptions.map((inscription) => (
                <InscriptionRow
                  key={inscription.id} 
                  inscription={inscription} 
                  onAction={onAction}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  Aucune inscription trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}