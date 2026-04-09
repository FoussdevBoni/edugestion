import { Charge } from "../../../utils/types/data";
import ChargeRow from "../items/ChargeRow";

interface ChargesListProps {
  charges: Charge[];
  onDelete: (charge: Charge) => void;
}

export default function ChargesList({ charges, onDelete }: ChargesListProps) {
  if (charges.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500">Aucune charge trouvée</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Libellé</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bénéficiaire</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Montant (en CFA)</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {charges.map((charge) => (
            <ChargeRow
              key={charge.id}
              charge={charge}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}