// src/components/admin/rows/CycleRow.tsx
import { Calendar, BookOpen } from "lucide-react";
import { Cycle } from "../../../utils/types/data";
import TableRow from "../../ui/tables/TableRow";

interface CycleRowProps {
  cycle: Cycle;
  onAction: (cycle: Cycle) => void;
  onSelect?: (cycle: Cycle, isSelected: boolean) => void;
  isSelected?: boolean;
  niveauxClasseCount?: number;
  selectable?: boolean;
}

export default function CycleRow({ 
  cycle, 
  onAction, 
  onSelect, 
  isSelected = false,
  niveauxClasseCount = 0,
  selectable = true
}: CycleRowProps) {
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
      item={cycle}
      onAction={onAction}
      onSelect={onSelect}
      isSelected={isSelected}
      selectable={selectable}
      actionable={true}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen size={16} className="text-primary" />
          </div>
          <span className="font-medium text-gray-800">{cycle.nom}</span>
        </div>
      </td>
      
      <td className="py-3 px-4 text-gray-600">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {cycle.niveauScolaire}
        </span>
      </td>
      
      <td className="py-3 px-4 text-gray-600">
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          {niveauxClasseCount} niveau{niveauxClasseCount > 1 ? 'x' : ''}
        </span>
      </td>
      
      <td className="py-3 px-4 text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <span>{formatDate(cycle.createdAt!)}</span>
        </div>
      </td>
    </TableRow>
  );
}