// src/pages/admin/comptabilite/charges/components/ChargeRow.tsx
import { Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Charge } from "../../../utils/types/data";

interface ChargeRowProps {
  charge: Charge;
  onDelete: (charge: Charge) => void;
}

export default function ChargeRow({ charge, onDelete }: ChargeRowProps) {
  const navigate = useNavigate();

  const formatMoney = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  const handleRowClick = () => {
    navigate(`/admin/comptabilite/charges/details`, { state: charge });
  };

  return (
    <tr 
      className="hover:bg-gray-50 cursor-pointer"
      onClick={handleRowClick}
    >
      <td className="px-6 py-4 text-sm">{formatDate(charge.date)}</td>
      <td className="px-6 py-4 font-medium">{charge.libelle}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{charge.beneficiaire || '-'}</td>
      <td className="px-6 py-4 text-right font-mono font-medium text-primary">
        {formatMoney(charge.montant)}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button 
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            onClick={() => navigate(`/admin/comptabilite/charges/details`, { state: charge })}
          >
            <Eye size={16} />
          </button>
          <button 
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
            onClick={() => navigate(`/admin/comptabilite/charges/update`, { state: charge })}
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => onDelete(charge)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}