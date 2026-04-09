// src/pages/admin/materiel/components/TransactionsList.tsx

import { Transaction } from "../../../utils/types/data";
import TransactionRow from "../items/TransactionRow";


interface TransactionsListProps {
  transactions: Transaction[];
}

export default function TransactionsList({ transactions }: TransactionsListProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500">Aucune transaction trouvée</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motif</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Montant</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paiement</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}