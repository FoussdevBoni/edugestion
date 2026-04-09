// src/components/admin/rows/PaiementRow.tsx
import { MoreVertical, Calendar, CreditCard, User, FileText } from "lucide-react";
import { Paiement } from "../../../utils/types/data";

interface PaiementRowProps {
  paiement: Paiement;
  onAction: (paiement: Paiement) => void;
}

export default function PaiementRow({ paiement, onAction }: PaiementRowProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(montant);
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'paye':
        return 'bg-green-100 text-green-700';
      case 'partiellement':
        return 'bg-yellow-100 text-yellow-700';
      case 'impaye':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200">
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <User size={14} className="text-gray-400" />
          <span className="text-gray-800">
            {paiement.inscription?.prenom} {paiement.inscription?.nom}
          </span>
        </div>
        <p className="text-xs text-gray-500">{paiement.inscription?.classe}</p>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">{formatMontant(paiement.montantPaye)}</span>
          {paiement.montantRestant > 0 && (
            <span className="text-xs text-gray-500">Restant: {formatMontant(paiement.montantRestant)}</span>
          )}
        </div>
      </td>
      <td className="py-3 px-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(paiement.statut)}`}>
          {paiement.statut}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <span>{formatDate(paiement.datePayement)}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <span>{paiement.motif}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-right">
        <button
          onClick={() => onAction(paiement)}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
        >
          <MoreVertical size={18} className="text-gray-500" />
        </button>
      </td>
    </tr>
  );
}