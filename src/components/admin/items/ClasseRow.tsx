// src/components/admin/rows/ClasseRow.tsx
import { Calendar } from "lucide-react";
import { Classe } from "../../../utils/types/data";
import TableRow from "../../ui/tables/TableRow";

interface ClasseRowProps {
  classe: Classe;
  onAction: (classe: Classe) => void;
  onSelect?: (classe: Classe, isSelected: boolean) => void;
  isSelected?: boolean;
  elevesCount?: number;
  selectable?: boolean;
}

export default function ClasseRow({ 
  classe, 
  onAction, 
  onSelect,
  isSelected = false,
  elevesCount = 0,
  selectable = true
}: ClasseRowProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <TableRow
      item={classe}
      onAction={onAction}
      onSelect={onSelect}
      isSelected={isSelected}
      selectable={selectable}
      actionable={true}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <span className="font-medium text-gray-800">{classe.nom}</span>
        </div>
      </td>
      
      <td className="py-3 px-4 text-gray-600">
        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
          { classe.effectifTotal || 0} élève{ classe.effectifTotal > 1 ? 's' : ''}
        </span>
      </td>
      
      <td className="py-3 px-4 text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <span>{formatDate(classe.createdAt!)}</span>
        </div>
      </td>
    </TableRow>
  );
}