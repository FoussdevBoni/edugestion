// src/components/admin/rows/NiveauScolaireRow.tsx
import { MoreVertical, Calendar, Layers } from "lucide-react";
import { NiveauScolaire } from "../../../utils/types/data";

interface NiveauScolaireRowProps {
  niveau: NiveauScolaire;
  onAction: (niveau: NiveauScolaire) => void;
  cyclesCount?: number;
}

export default function NiveauScolaireRow({ niveau, onAction, cyclesCount = 0 }: NiveauScolaireRowProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Layers size={16} className="text-primary" />
          </div>
          <span className="font-medium text-gray-800">{niveau.nom}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-gray-600">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {cyclesCount} cycle{cyclesCount > 1 ? 's' : ''}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <span>{formatDate(niveau.createdAt!)}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-right">
        <button
          onClick={() => onAction(niveau)}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
        >
          <MoreVertical size={18} className="text-gray-500" />
        </button>
      </td>
    </tr>
  );
}