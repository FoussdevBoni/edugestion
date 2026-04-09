// src/pages/admin/materiel/components/MaterielList.tsx

import { Materiel } from "../../../utils/types/data";
import MaterielRow from "../items/MaterielRow";


interface MaterielListProps {
  materiels: Materiel[];
  onDelete?: (materiel: Materiel) => void;
}

export default function MaterielList({ materiels, onDelete }: MaterielListProps) {
  if (materiels.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-500">Aucun matériel trouvé</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {materiels.map((materiel) => (
            <MaterielRow
              key={materiel.id}
              materiel={materiel}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}