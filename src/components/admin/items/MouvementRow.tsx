// src/components/admin/lists/MouvementRow.tsx
import { useNavigate } from "react-router-dom";
import { Package, ArrowDown, ArrowUp, FileText, Calendar } from "lucide-react";
import { MouvementStock } from "../../../utils/types/data";

const TYPE_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  entree: { label: "Entrée", color: "bg-green-100 text-green-700", icon: ArrowDown },
  sortie: { label: "Sortie", color: "bg-red-100 text-red-700", icon: ArrowUp },
  correction: { label: "Correction", color: "bg-orange-100 text-orange-700", icon: FileText },
  inventaire: { label: "Inventaire", color: "bg-blue-100 text-blue-700", icon: Calendar }
};

interface MouvementRowProps {
  mouvement: MouvementStock;
  materielNom: string;
  onClick?: () => void;
}

export default function MouvementRow({ mouvement, materielNom, onClick }: MouvementRowProps) {
  const navigate = useNavigate();
  const typeInfo = TYPE_CONFIG[mouvement.type] || TYPE_CONFIG.correction;
  const TypeIcon = typeInfo.icon;

  const formatNombre = (n: number) => {
    return new Intl.NumberFormat('fr-FR').format(n);
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/admin/comptabilite/mouvements/${mouvement.id}`, { state: mouvement });
    }
  };

  return (
    <tr 
      className="hover:bg-gray-50 cursor-pointer"
      onClick={handleClick}
    >
      <td className="px-6 py-4 text-sm whitespace-nowrap">
        {new Date(mouvement.date).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${typeInfo.color}`}>
          <TypeIcon size={12} />
          {typeInfo.label}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Package size={16} className="text-gray-400" />
          <span className="font-medium">{materielNom}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-right font-mono">
        {formatNombre(mouvement.quantiteAvant)}
      </td>
      <td className="px-6 py-4 text-right font-mono font-bold">
        {formatNombre(mouvement.quantiteApres)}
      </td>
      <td className="px-6 py-4 text-right">
        <span className={`font-mono font-bold ${
          mouvement.difference > 0 
            ? 'text-green-600' 
            : mouvement.difference < 0 
              ? 'text-red-600' 
              : ''
        }`}>
          {mouvement.difference > 0 ? '+' : ''}{formatNombre(mouvement.difference)}
        </span>
      </td>
      <td className="px-6 py-4 text-sm">{mouvement.motif}</td>
      <td className="px-6 py-4">
        {mouvement.referenceId && (
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {mouvement.referenceType}: {mouvement.referenceId.slice(0, 8)}
          </span>
        )}
      </td>
    </tr>
  );
}