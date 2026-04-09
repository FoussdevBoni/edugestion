// src/components/admin/rows/EleveRow.tsx
import { User } from "lucide-react";
import { Eleve } from "../../../utils/types/data";
import { useElevePhoto } from "../../../hooks/photos/useElevePhoto";
import { useState } from "react";
import TableRow from "../../ui/tables/TableRow";

interface EleveRowProps {
  eleve: Eleve;
  onAction: (eleve: Eleve) => void;
  onSelect?: (eleve: Eleve, isSelected: boolean) => void;
  isSelected?: boolean;
  selectable?: boolean;
}

export default function EleveRow({ 
  eleve, 
  onAction, 
  onSelect,
  isSelected = false,
  selectable = false
}: EleveRowProps) {
  const [imageError, setImageError] = useState(false);
  const { photoUrl, loading } = useElevePhoto(eleve.matricule || '');

  const handleImageError = () => {
    setImageError(true);
  };

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
      item={eleve}
      onAction={onAction}
      onSelect={onSelect}
      isSelected={isSelected}
      selectable={selectable}
      actionable={true}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {loading ? (
              <div className="w-full h-full animate-pulse bg-gray-200" />
            ) : photoUrl && !imageError ? (
              <img 
                src={photoUrl} 
                alt={`${eleve.prenom} ${eleve.nom}`} 
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <User size={16} className="text-primary" />
            )}
          </div>
          <span className="font-medium text-gray-800">
            {eleve.nom} {eleve.prenom}
          </span>
        </div>
      </td>
      <td className="py-3 px-4 text-gray-600">{formatDate(eleve.dateNaissance)}</td>
      <td className="py-3 px-4">
        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
          {eleve.classe}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          eleve.sexe === 'M' 
            ? 'bg-blue-100 text-blue-700' 
            : 'bg-pink-100 text-pink-700'
        }`}>
          {eleve.sexe}
        </span>
      </td>
    </TableRow>
  );
}