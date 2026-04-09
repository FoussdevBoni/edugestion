// src/components/admin/rows/InscriptionRow.tsx
import { MoreVertical, Calendar, User } from "lucide-react";
import { Inscription } from "../../../utils/types/data";
import { useState } from "react";
import { useElevePhoto } from "../../../hooks/photos/useElevePhoto";

interface InscriptionRowProps {
  inscription: Inscription;
  onAction: (inscription: Inscription) => void;
}

export default function InscriptionRow({ inscription, onAction }: InscriptionRowProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };


    const [imageError, setImageError] = useState(false);
    const { photoUrl, loading } = useElevePhoto(inscription.matricule || '');
  
    
  
    const handleImageError = () => {
      setImageError(true);
    };

  const getStatutPayementColor = (statut: string) => {
    switch (statut) {
      case 'paye':
        return 'bg-green-100 text-green-700';
      case 'partiellement':
        return 'bg-yellow-100 text-yellow-700';
      case 'impaye':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatutScolaireColor = (statut: string) => {
    switch (statut) {
      case 'nouveau':
        return 'bg-blue-100 text-blue-700';
      case 'redoublant':
        return 'bg-purple-100 text-purple-700';
      case 'transfert':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {loading ? (
              <div className="w-full h-full animate-pulse bg-gray-200" />
            ) : photoUrl && !imageError ? (
              <img 
                src={photoUrl} 
                alt={`${inscription.prenom} ${inscription.nom}`} 
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <User size={16} className="text-primary" />
            )}
          </div>
          <div>
            <span className="font-medium text-gray-800">
              {inscription.nom} {inscription.prenom}
            </span>
            <p className="text-xs text-gray-500">{inscription.matricule}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-gray-600">
        <div className="flex flex-col">
          <span className="font-medium">{inscription.classe}</span>
          <span className="text-xs text-gray-500">{inscription.niveauClasse}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium 
          ${getStatutScolaireColor(inscription.statutScolaire || '')}`}>
          {inscription.statutScolaire}
        </span>
      </td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutPayementColor(inscription.statutPayement)}`}>
          {inscription.statutPayement || 'impayé'}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <span>{formatDate(inscription.dateInscription)}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-gray-600">
        <span className="text-sm">{inscription.anneeScolaire}</span>
      </td>
      <td className="py-3 px-4 text-right">
        <button
          onClick={() => onAction(inscription)}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
        >
          <MoreVertical size={18} className="text-gray-500" />
        </button>
      </td>
    </tr>
  );
}