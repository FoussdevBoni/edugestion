// src/components/admin/lists/NiveauxClasseList.tsx

import { classes } from "../../../data/baseData";
import { NiveauClasse } from "../../../utils/types/data";
import NiveauClasseRow from "../items/NiveauClasseRow";


interface NiveauxClasseListProps {
  niveauxClasse: NiveauClasse[];
  onAction: (niveauClasse: NiveauClasse) => void;
}

export default function NiveauxClasseList({ niveauxClasse, onAction }: NiveauxClasseListProps) {
  // Compter les classes pour chaque niveau de classe
  const getClassesCount = (niveauClasseId: string) => {
    return classes.filter(c => c.niveauClasseId === niveauClasseId).length;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Niveau de classe
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cycle
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Niveau scolaire
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Classes
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de création
              </th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {niveauxClasse.length > 0 ? (
              niveauxClasse.map((niveauClasse) => (
                <NiveauClasseRow
                  key={niveauClasse.id} 
                  niveauClasse={niveauClasse} 
                  onAction={onAction}
                  classesCount={getClassesCount(niveauClasse.id)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  Aucun niveau de classe trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}