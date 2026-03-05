// src/components/admin/rows/MatiereRow.tsx
import { MoreVertical, Calendar, BookOpen, Hash } from "lucide-react";
import { Matiere } from "../../../utils/types/data";

interface MatiereRowProps {
  matiere: Matiere;
  onAction: (matiere: Matiere) => void;
}

export default function MatiereRow({ matiere, onAction }: MatiereRowProps) {
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
      <td className="py-3 px-4 text-right">
        <button
          onClick={() => onAction(matiere)}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
        >
          <MoreVertical size={18} className="text-gray-500" />
        </button>
      </td>
    </tr>
  );
}