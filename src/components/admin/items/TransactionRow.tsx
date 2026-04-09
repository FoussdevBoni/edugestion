// src/pages/admin/materiel/components/TransactionRow.tsx
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Transaction } from "../../../utils/types/data";

interface TransactionRowProps {
  transaction: Transaction;
}

export default function TransactionRow({ transaction }: TransactionRowProps) {
  const navigate = useNavigate();

  const formatMoney = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isEntree = transaction.type === 'entree';

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 text-sm">
        {formatDate(transaction.date)}
      </td>
      <td className="px-6 py-4">
        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs w-fit ${
          isEntree 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {isEntree ? 'Entrée' : 'Sortie'}
        </span>
      </td>
      <td className="px-6 py-4 text-sm">{transaction.motif}</td>
      <td className={`px-6 py-4 text-right font-mono font-bold ${
        isEntree ? 'text-green-600' : 'text-red-600'
      }`}>
        {isEntree ? '+' : '-'} {formatMoney(transaction.montant)}
      </td>
      <td className="px-6 py-4 text-sm">{transaction.modePaiement}</td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => navigate(`/admin/comptabilite/transactions/details`, { state: transaction })}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <Eye size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}