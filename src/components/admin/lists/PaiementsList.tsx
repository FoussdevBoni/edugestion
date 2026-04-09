// src/components/admin/lists/PaiementsList.tsx

import { Paiement } from "../../../utils/types/data";
import PaiementRow from "../items/PaiementRow";


interface PaiementsListProps {
  paiements: Paiement[];
  onAction: (paiement: Paiement) => void;
}

export default function PaiementsList({ paiements, onAction }: PaiementsListProps) {
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
                Montant
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date paiement
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Motif
              </th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paiements.length > 0 ? (
              paiements.map((paiement) => (
                <PaiementRow
                  key={paiement.id} 
                  paiement={paiement} 
                  onAction={onAction}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  Aucun paiement trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}