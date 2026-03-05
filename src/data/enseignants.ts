// src/utils/fakeData/enseignants.ts
import { Enseignant } from '../utils/types/data';
import { ids } from './baseData';

export const enseignants: Enseignant[] = [
  {
    id: "ens_001",
    nom: "DIALLO",
    prenom: "Abdoulaye",
    email: "abdoulaye.diallo@ecole.sn",
    tel: "777001122",
    matieresId: ["mat_001", "mat_002"],
    matieres: ["Mathématiques", "Physique-Chimie"],
    classesId: [ids.classes.sixiemeA, ids.classes.cinquiemeB, ids.classes.secondeS],
    classes: ["6ème A", "5ème B", "Seconde S"],
    emploiDuTemps: {},
    createdAt: "2023-08-15T08:00:00.000Z"
  },
  {
    id: "ens_002",
    nom: "SARR",
    prenom: "Mariama",
    email: "mariama.sarr@ecole.sn",
    tel: "777003344",
    matieresId: ["mat_003", "mat_004"],
    matieres: ["Français", "Latin"],
    classesId: [ids.classes.sixiemeA, ids.classes.sixiemeB, ids.classes.premiereL],
    classes: ["6ème A", "6ème B", "Première L"],
    emploiDuTemps: {},
    createdAt: "2023-08-16T09:30:00.000Z"
  },
  {
    id: "ens_003",
    nom: "FALL",
    prenom: "Ousmane",
    email: "ousmane.fall@ecole.sn",
    tel: "777005566",
    matieresId: ["mat_005"],
    matieres: ["Histoire-Géographie"],
    classesId: [ids.classes.cinquiemeA, ids.classes.quatriemeA, ids.classes.troisiemeA, ids.classes.secondeS],
    classes: ["5ème A", "4ème A", "3ème A", "Seconde S"],
    emploiDuTemps: {},
    createdAt: "2023-08-16T10:15:00.000Z"
  },
  {
    id: "ens_004",
    nom: "NDIAYE",
    prenom: "Aminata",
    email: "aminata.ndiaye@ecole.sn",
    tel: "777007788",
    matieresId: ["mat_006", "mat_007"],
    matieres: ["Anglais", "Espagnol"],
    classesId: [ids.classes.cm2B, ids.classes.sixiemeA, ids.classes.sixiemeB, ids.classes.secondeS],
    classes: ["CM2 B", "6ème A", "6ème B", "Seconde S"],
    emploiDuTemps: {},
    createdAt: "2023-08-17T08:45:00.000Z"
  },
  {
    id: "ens_005",
    nom: "GUEYE",
    prenom: "Mamadou",
    email: "mamadou.gueye@ecole.sn",
    tel: "777009900",
    matieresId: ["mat_008"],
    matieres: ["SVT"],
    classesId: [ids.classes.cm1A, ids.classes.cm2B, ids.classes.troisiemeA, ids.classes.premiereS],
    classes: ["CM1 A", "CM2 B", "3ème A", "Première S"],
    emploiDuTemps: {},
    createdAt: "2023-08-17T11:20:00.000Z"
  },
  {
    id: "ens_006",
    nom: "DIOP",
    prenom: "Fatou",
    email: "fatou.diop@ecole.sn",
    tel: "777011122",
    matieresId: ["mat_001", "mat_009"],
    matieres: ["Mathématiques", "Informatique"],
    classesId: [ids.classes.cpA, ids.classes.ce1A, ids.classes.ce2A],
    classes: ["CP A", "CE1 A", "CE2 A"],
    emploiDuTemps: {},
    createdAt: "2023-08-18T09:00:00.000Z"
  }
];