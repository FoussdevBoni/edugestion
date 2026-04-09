// src/pages/admin/materiel/components/MaterielRow.tsx
import { Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Materiel } from "../../../utils/types/data";

interface MaterielRowProps {
  materiel: Materiel;
  onDelete?: (materiel: Materiel) => void;
}

export default function MaterielRow({ materiel, onDelete }: MaterielRowProps) {
  const navigate = useNavigate();

  const getStockStatus = (quantite: number , seuilAlerte: number) => {
    if (quantite === 0) return { color: "text-red-700 bg-red-50", text: "Rupture" };
    if (quantite < seuilAlerte) return { color: "text-orange-700 bg-orange-50", text: "Stock bas" };
    return { color: "text-green-700 bg-green-50", text: "OK" };
  };

  const status = getStockStatus(materiel.quantite , materiel.seuilAlerte || 0);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 font-medium">{materiel.nom}</td>
      <td className="px-6 py-4">
        <span className={`font-mono ${materiel.quantite < materiel.seuilAlerte ? 'text-orange-600 font-bold' : ''}`}>
          {materiel.quantite} unités
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs ${status.color}`}>
          {status.text}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => navigate(`/admin/comptabilite/materiel/details`, { state: materiel })}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
          >
            <Eye size={16} />
          </button>
          <button 
            onClick={() => navigate(`/admin/comptabilite/materiel/update`, { state: materiel })}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => onDelete?.(materiel)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}