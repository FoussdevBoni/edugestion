import { MoreVertical, User } from "lucide-react";
import { Eleve } from "../../../utils/types/data";


interface EleveRowProps {
  eleve: Eleve;
  onAction: (eleve: Eleve) => void;
}

export default function EleveRow({ eleve, onAction }: EleveRowProps) {
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
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {eleve.photo ? (
              <img src={eleve.photo} alt={`${eleve.prenom} ${eleve.nom}`} className="w-full h-full object-cover" />
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
      <td className="py-3 px-4 text-right">
        <button
          onClick={()=>{
            onAction(eleve)
          }}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
        >
          <MoreVertical size={18} className="text-gray-500" />
        </button>
      </td>
    </tr>
  );
}