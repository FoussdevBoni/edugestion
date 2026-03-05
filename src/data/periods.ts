// src/utils/fakeData/periodes.ts
import { Periode } from '../utils/types/data';
import { ids } from './baseData';

export const periodes: Periode[] = [

  // Les périodes du primaires
  {
    id: "periode_1",
    nom: "1er Trimestre",
    ordre: 1,
    dateDebut: "2023-10-02",
    dateFin: "2023-12-22",
    niveauScolaireId: ids.niveauxScolaires.primaire,
    niveauScolaire: "Primaire",
    createdAt: "2023-09-01T00:00:00.000Z"
  },
  {
    id: "periode_2",
    nom: "2ème Trimestre",
    ordre: 2,
    dateDebut: "2024-01-08",
    dateFin: "2024-03-29",
    niveauScolaireId: ids.niveauxScolaires.primaire,
    niveauScolaire: "Primaire",
    createdAt: "2023-09-01T00:00:00.000Z"
  },
  {
    id: "periode_3",
    nom: "3ème Trimestre",
    ordre: 3,
    dateDebut: "2024-04-15",
    dateFin: "2024-07-05",
    niveauScolaireId: ids.niveauxScolaires.primaire,
    niveauScolaire: "Primaire",
    createdAt: "2023-09-01T00:00:00.000Z"
  },

  // Les périodes du secondaires
  
  {
    id: "periode_4",
    nom: "1er Semestre",
    ordre: 1,
    dateDebut: "2023-10-02",
    dateFin: "2024-02-09",
    niveauScolaireId: ids.niveauxScolaires.secondaire,
    niveauScolaire: "Secondaire",
    createdAt: "2023-09-01T00:00:00.000Z"
  },
  {
    id: "periode_5",
    nom: "2ème Semestre",
    ordre: 2,
    dateDebut: "2024-02-19",
    dateFin: "2024-07-05",
    niveauScolaireId: ids.niveauxScolaires.secondaire,
    niveauScolaire: "Secondaire",
    createdAt: "2023-09-01T00:00:00.000Z"
  }
];