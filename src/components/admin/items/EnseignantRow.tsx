import { MoreVertical, User } from "lucide-react";
import { Enseignant } from "../../../utils/types/data";

interface EnseignantRowProps {
  enseignant: Enseignant;
  onAction: (enseignant: Enseignant) => void;
}

export default function EnseignantRow({ enseignant, onAction }: EnseignantRowProps) {
  // Extraire les matières uniques à partir des enseignementsData
  const matieresUniques = [...new Set(enseignant.enseignementsData?.map(e => e.matiere) || [])];
  
  // Extraire les classes uniques à partir des enseignementsData
  const classesUniques = [...new Set(enseignant.enseignementsData?.map(e => e.classe) || [])];

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200">
      {/* Nom et photo */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            <User size={16} className="text-primary" />
          </div>
          <span className="font-medium text-gray-800">
            {enseignant.nom} {enseignant.prenom}
          </span>
        </div>
      </td>

     

      {/* Matières enseignées */}
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1">
          {matieresUniques.slice(0, 2).map((matiere, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
            >
              {matiere}
            </span>
          ))}
          {matieresUniques.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              +{matieresUniques.length - 2}
            </span>
          )}
        </div>
      </td>

      {/* Classes suivies */}
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1">
          {classesUniques.slice(0, 2).map((classe, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
            >
              {classe}
            </span>
          ))}
          {classesUniques.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              +{classesUniques.length - 2}
            </span>
          )}
        </div>
      </td>

      {/* Bouton d'action */}
      <td className="py-3 px-4 text-right">
        <button
          onClick={() => onAction(enseignant)}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
        >
          <MoreVertical size={18} className="text-gray-500" />
        </button>
      </td>
    </tr>
  );
}