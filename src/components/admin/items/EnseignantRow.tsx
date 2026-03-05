import { MoreVertical, User, Mail, Phone } from "lucide-react";
import { Enseignant } from "../../../utils/types/data";

interface EnseignantRowProps {
  enseignant: Enseignant;
  onAction: (enseignant: Enseignant) => void;
}

export default function EnseignantRow({ enseignant, onAction }: EnseignantRowProps) {
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

      {/* Email */}
      <td className="py-3 px-4 text-gray-600">
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-gray-400" />
          <span>{enseignant.email}</span>
        </div>
      </td>

      {/* Téléphone */}
      <td className="py-3 px-4 text-gray-600">
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-gray-400" />
          <span>{enseignant.tel}</span>
        </div>
      </td>

      {/* Matières enseignées */}
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1">
          {enseignant.matieres.slice(0, 2).map((matiere, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
            >
              {matiere}
            </span>
          ))}
          {enseignant.matieres.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              +{enseignant.matieres.length - 2}
            </span>
          )}
        </div>
      </td>

      {/* Classes suivies */}
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1">
          {enseignant.classes.slice(0, 2).map((classe, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
            >
              {classe}
            </span>
          ))}
          {enseignant.classes.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              +{enseignant.classes.length - 2}
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