// src/components/admin/rows/NiveauClasseRow.tsx
import { MoreVertical, Calendar, Layers } from "lucide-react";
import { NiveauClasse } from "../../../utils/types/data";

interface NiveauClasseRowProps {
  niveauClasse: NiveauClasse;
  onAction: (niveauClasse: NiveauClasse) => void;
  classesCount?: number;
}

export default function NiveauClasseRow({ niveauClasse, onAction, classesCount = 0 }: NiveauClasseRowProps) {
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
          <span className="font-medium text-gray-800">{niveauClasse.nom}</span>
        </div>
      </td>
     
      <td className="py-3 px-4 text-gray-600">
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          {classesCount} classe{classesCount > 1 ? 's' : ''}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <span>{formatDate(niveauClasse.createdAt!)}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-right">
        <button
          onClick={() => onAction(niveauClasse)}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
        >
          <MoreVertical size={18} className="text-gray-500" />
        </button>
      </td>
    </tr>
  );
}