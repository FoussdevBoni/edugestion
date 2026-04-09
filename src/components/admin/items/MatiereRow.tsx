// src/components/admin/rows/MatiereRow.tsx
import { Calendar, BookOpen, Hash } from "lucide-react";
import { Matiere } from "../../../utils/types/data";
import TableRow from "../../ui/tables/TableRow";

interface MatiereRowProps {
  matiere: Matiere;
  onAction: (matiere: Matiere) => void;
  onSelect?: (matiere: Matiere, isSelected: boolean) => void;
  isSelected?: boolean;
  selectable?: boolean;
}

export default function MatiereRow({ 
  matiere, 
  onAction, 
  onSelect,
  isSelected = false,
  selectable = false
}: MatiereRowProps) {
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
      item={matiere}
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
          <span className="font-medium text-gray-800">{matiere.nom}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-gray-600">
        <div className="flex items-center gap-1">
          <Hash size={14} className="text-gray-400" />
          <span className="font-medium">{matiere.coefficient}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-gray-600">
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
          {matiere.niveauClasse}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <span>{formatDate(matiere.createdAt!)}</span>
        </div>
      </td>
    </TableRow>
  );
}