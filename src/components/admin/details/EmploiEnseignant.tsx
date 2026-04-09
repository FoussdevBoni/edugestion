// src/components/emploi-du-temps/EmploiEnseignant.tsx
import { useState, useEffect } from "react";
import { Calendar, Clock, BookOpen, Users } from "lucide-react";
import { Enseignant } from "../../../utils/types/data";
import useSeances from "../../../hooks/seances/useSeances";


interface EmploiEnseignantProps {
  enseignant: Enseignant;
}

// Jours de la semaine

const JOURS_FR = {
  LUNDI: "Lundi",
  MARDI: "Mardi",
  MERCREDI: "Mercredi",
  JEUDI: "Jeudi",
  VENDREDI: "Vendredi",
  SAMEDI: "Samedi"
};

export default function EmploiEnseignant({ enseignant }: EmploiEnseignantProps) {
  const { seances, getEmploiParEnseignant, getEmploiParJour } = useSeances();
  const [emploiParJour, setEmploiParJour] = useState<{jour: string, seances: any[]}[]>([]);


  useEffect(() => {

    const getEmploies  = async ()=>{
      if (enseignant?.id) {
      // Récupérer les séances de l'enseignant
      const seancesEnseignant = await getEmploiParEnseignant(enseignant.id);
      // Organiser par jour
      const organise = getEmploiParJour(seancesEnseignant || []);
      setEmploiParJour(organise);
    }
    }

    getEmploies()
   
  }, [enseignant, seances]);


  // Si pas d'emploi du temps
  const totalSeances = emploiParJour.reduce((acc, jour) => acc + jour.seances.length, 0);
  
  if (totalSeances === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 mb-2">Aucune séance planifiée</p>
        <p className="text-sm text-gray-400">
          {enseignant.prenom} {enseignant.nom} n'a pas encore d'emploi du temps
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* En-tête */}
      <div className="bg-primary/5 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Calendar size={18} className="text-primary" />
          Emploi du temps de {enseignant.prenom} {enseignant.nom}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {totalSeances} séance(s) planifiée(s)
        </p>
      </div>

      {/* Grille des séances par jour */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emploiParJour.map(({ jour, seances }) => (
            seances.length > 0 && (
              <div key={jour} className="border rounded-lg overflow-hidden">
                {/* Jour */}
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <h4 className="font-medium text-gray-700 flex items-center gap-2">
                    <Calendar size={14} className="text-primary" />
                    {JOURS_FR[jour as keyof typeof JOURS_FR]}
                  </h4>
                </div>

                {/* Séances du jour */}
                <div className="p-3 space-y-2">
                  {seances.map((seance) => (
                    <div 
                      key={seance.id} 
                      className="bg-primary/5 rounded-lg p-3 border-l-4 border-primary"
                    >
                      {/* Horaire */}
                      <div className="flex items-center gap-1 text-xs text-primary font-medium mb-2">
                        <Clock size={12} />
                        <span>{seance.heureDebut.substring(0,5)} - {seance.heureFin.substring(0,5)}</span>
                      </div>

                      {/* Classe et matière */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Users size={14} className="text-gray-400" />
                          <span className="font-medium text-gray-700">{seance.classe}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <BookOpen size={14} className="text-gray-400" />
                          <span className="text-gray-600">{seance.matiere}</span>
                        </div>
                      </div>

                      {/* Niveau (info supplémentaire) */}
                      <div className="mt-2 text-xs text-gray-400">
                        {seance.niveauClasse} • {seance.cycle} • {seance.niveauScolaire}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Légende */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock size={14} className="text-primary" />
          <span>Horaires</span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={14} className="text-primary" />
          <span>Classe</span>
        </div>
        <div className="flex items-center gap-1">
          <BookOpen size={14} className="text-primary" />
          <span>Matière</span>
        </div>
      </div>
    </div>
  );
}