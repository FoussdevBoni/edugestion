// src/utils/fakeData/seances.ts
import { Seance } from '../utils/types/data';
import { cycles, classes } from './baseData';
import { enseignants } from './enseignants';
import { matieres } from './matieres';

export const seances: Seance[] = [
  // ========== PRIMAIRE ==========
  // Au primaire, un seul enseignant par classe (l'instituteur/trice)
  
  // CP A - Lundi (avec Mme Mensah Ama comme institutrice)
  {
    id: "seance_001",
    cycle: cycles[1].nom, // "1er cycle" (Primaire)
    niveauScolaire: "Primaire",
    matiere: "Français",
    classe: "CP A",
    niveauClasse: "CP",
    enseignant: "Mme Mensah Ama",
    classeId: classes.find(c => c.nom === "CP A")?.id || "classe_cpa",
    matiereId: matieres.find(m => m.nom === "Français" && m.niveauClasse === "CP")?.id || "mat_002",
    enseignantId: enseignants[1].id, // Mensah Ama
    jour: "LUNDI",
    heureDebut: "08:00",
    heureFin: "09:00",
    anneeScolaire: "2024-2025",
    createdAt: "2024-08-15T10:00:00.000Z"
  },
  {
    id: "seance_002",
    cycle: cycles[1].nom,
    niveauScolaire: "Primaire",
    matiere: "Mathématiques",
    classe: "CP A",
    niveauClasse: "CP",
    enseignant: "Mme Mensah Ama",
    classeId: classes.find(c => c.nom === "CP A")?.id || "classe_cpa",
    matiereId: matieres.find(m => m.nom === "Mathématiques" && m.niveauClasse === "CP")?.id || "mat_002",
    enseignantId: enseignants[1].id,
    jour: "LUNDI",
    heureDebut: "09:00",
    heureFin: "10:00",
    anneeScolaire: "2024-2025",
    createdAt: "2024-08-15T10:00:00.000Z"
  },
  {
    id: "seance_003",
    cycle: cycles[1].nom,
    niveauScolaire: "Primaire",
    matiere: "Lecture",
    classe: "CP A",
    niveauClasse: "CP",
    enseignant: "Mme Mensah Ama",
    classeId: classes.find(c => c.nom === "CP A")?.id || "classe_cpa",
    matiereId: matieres.find(m => m.nom === "Lecture" && m.niveauClasse === "CP")?.id || "mat_003",
    enseignantId: enseignants[1].id,
    jour: "LUNDI",
    heureDebut: "10:00",
    heureFin: "11:00",
    anneeScolaire: "2024-2025",
    createdAt: "2024-08-15T10:00:00.000Z"
  },

  // CP A - Mardi (toujours Mme Mensah Ama)
  {
    id: "seance_004",
    cycle: cycles[1].nom,
    niveauScolaire: "Primaire",
    matiere: "Écriture",
    classe: "CP A",
    niveauClasse: "CP",
    enseignant: "Mme Mensah Ama",
    classeId: classes.find(c => c.nom === "CP A")?.id || "classe_cpa",
    matiereId: matieres.find(m => m.nom === "Français" && m.niveauClasse === "CP")?.id || "mat_002",
    enseignantId: enseignants[1].id,
    jour: "MARDI",
    heureDebut: "08:00",
    heureFin: "09:00",
    anneeScolaire: "2024-2025",
    createdAt: "2024-08-15T10:00:00.000Z"
  },
  {
    id: "seance_005",
    cycle: cycles[1].nom,
    niveauScolaire: "Primaire",
    matiere: "Mathématiques",
    classe: "CP A",
    niveauClasse: "CP",
    enseignant: "Mme Mensah Ama",
    classeId: classes.find(c => c.nom === "CP A")?.id || "classe_cpa",
    matiereId: matieres.find(m => m.nom === "Mathématiques" && m.niveauClasse === "CP")?.id || "mat_002",
    enseignantId: enseignants[1].id,
    jour: "MARDI",
    heureDebut: "09:00",
    heureFin: "10:00",
    anneeScolaire: "2024-2025",
    createdAt: "2024-08-15T10:00:00.000Z"
  },

  // CE1 B - Lundi (avec M. Koffi Komlan comme instituteur)
  {
    id: "seance_006",
    cycle: cycles[1].nom,
    niveauScolaire: "Primaire",
    matiere: "Français",
    classe: "CE1 B",
    niveauClasse: "CE1",
    enseignant: "M. Koffi Komlan",
    classeId: classes.find(c => c.nom === "CE1 B")?.id || "classe_ce1b",
    matiereId: matieres.find(m => m.nom === "Français" && m.niveauClasse === "CE1")?.id || "mat_002",
    enseignantId: enseignants[0].id, // Koffi Komlan
    jour: "LUNDI",
    heureDebut: "08:00",
    heureFin: "09:00",
    anneeScolaire: "2024-2025",
    createdAt: "2024-08-15T10:00:00.000Z"
  },
  {
    id: "seance_007",
    cycle: cycles[1].nom,
    niveauScolaire: "Primaire",
    matiere: "Mathématiques",
    classe: "CE1 B",
    niveauClasse: "CE1",
    enseignant: "M. Koffi Komlan",
    classeId: classes.find(c => c.nom === "CE1 B")?.id || "classe_ce1b",
    matiereId: matieres.find(m => m.nom === "Mathématiques" && m.niveauClasse === "CE1")?.id || "mat_001",
    enseignantId: enseignants[0].id,
    jour: "LUNDI",
    heureDebut: "09:00",
    heureFin: "10:00",
    anneeScolaire: "2024-2025",
    createdAt: "2024-08-15T10:00:00.000Z"
  },
  {
    id: "seance_008",
    cycle: cycles[1].nom,
    niveauScolaire: "Primaire",
    matiere: "Lecture",
    classe: "CE1 B",
    niveauClasse: "CE1",
    enseignant: "M. Koffi Komlan",
    classeId: classes.find(c => c.nom === "CE1 B")?.id || "classe_ce1b",
    matiereId: matieres.find(m => m.nom === "Lecture" && m.niveauClasse === "CE1")?.id || "mat_003",
    enseignantId: enseignants[0].id,
    jour: "LUNDI",
    heureDebut: "10:00",
    heureFin: "11:00",
    anneeScolaire: "2024-2025",
    createdAt: "2024-08-15T10:00:00.000Z"
  },

  // ========== SECONDAIRE ==========
  // Au secondaire, un enseignant différent par matière
  
  // 6ème A - Lundi
  {
    id: "seance_009",
    cycle: cycles[2].nom, // "1er cycle (Collège)"
    niveauScolaire: "Secondaire",
    matiere: "Mathématiques",
    classe: "6ème A",
    niveauClasse: "6ème",
    enseignant: "M. Koffi Komlan",
    classeId: classes.find(c => c.nom === "6ème A")?.id || "classe_6a",
    matiereId: matieres.find(m => m.nom === "Mathématiques" && m.niveauClasse === "6ème")?.id || "mat_007",
    enseignantId: enseignants[0].id,
    jour: "LUNDI",
    heureDebut: "08:00",
    heureFin: "10:00",
    anneeScolaire: "2024-2025",
    createdAt: "2024-08-15T10:00:00.000Z"
  },
  {
    id: "seance_010",
    cycle: cycles[2].nom,
    niveauScolaire: "Secondaire",
    matiere: "Français",
    classe: "6ème A",
    niveauClasse: "6ème",
    enseignant: "Mme Mensah Ama",
    classeId: classes.find(c => c.nom === "6ème A")?.id || "classe_6a",
    matiereId: matieres.find(m => m.nom === "Français" && m.niveauClasse === "6ème")?.id || "mat_008",
    enseignantId: enseignants[1].id,
    jour: "LUNDI",
    heureDebut: "10:00",
    heureFin: "12:00",
    anneeScolaire: "2024-2025",
    createdAt: "2024-08-15T10:00:00.000Z"
  },
  {
    id: "seance_011",
    cycle: cycles[2].nom,
    niveauScolaire: "Secondaire",
    matiere: "Anglais",
    classe: "6ème A",
    niveauClasse: "6ème",
    enseignant: "M. Dogbe Yawo",
    classeId: classes.find(c => c.nom === "6ème A")?.id || "classe_6a",
    matiereId: matieres.find(m => m.nom === "Anglais" && m.niveauClasse === "6ème")?.id || "mat_009",
    enseignantId: enseignants[2].id, // Dogbe Yawo
    jour: "LUNDI",
    heureDebut: "14:00",
    heureFin: "16:00",
    anneeScolaire: "2024-2025",
    createdAt: "2024-08-15T10:00:00.000Z"
  },

  // 6ème A - Mardi
  {
    id: "seance_012",
    cycle: cycles[2].nom,
    niveauScolaire: "Secondaire",
    matiere: "Histoire-Géo",
    classe: "6ème A",
    niveauClasse: "6ème",
    enseignant: "Mme Mensah Ama",
    classeId: classes.find(c => c.nom === "6ème A")?.id || "classe_6a",
    matiereId: matieres.find(m => m.nom === "Histoire-Géo" && m.niveauClasse === "6ème")?.id || "mat_008",
    enseignantId: enseignants[1].id,
    jour: "MARDI",
    heureDebut: "08:00",
    heureFin: "10:00",
    anneeScolaire: "2024-2025",
    createdAt: "2024-08-15T10:00:00.000Z"
  },
  {
    id: "seance_013",
    cycle: cycles[2].nom,
    niveauScolaire: "Secondaire",
    matiere: "SVT",
    classe: "6ème A",
    niveauClasse: "6ème",
    enseignant: "Mme Sewonou Afia",
    classeId: classes.find(c => c.nom === "6ème A")?.id || "classe_6a",
    matiereId: matieres.find(m => m.nom === "SVT" && m.niveauClasse === "6ème")?.id || "mat_011",
    enseignantId: enseignants[3].id, // Sewonou Afia
    jour: "MARDI",
    heureDebut: "10:00",
    heureFin: "12:00",
    anneeScolaire: "2024-2025",
    createdAt: "2024-08-15T10:00:00.000Z"
  },

  // 3ème B - Lundi
  {
    id: "seance_014",
    cycle: cycles[2].nom,
    niveauScolaire: "Secondaire",
    matiere: "Physique-Chimie",
    classe: "3ème B",
    niveauClasse: "3ème",
    enseignant: "Mme Sewonou Afia",
    classeId: classes.find(c => c.nom === "3ème B")?.id || "classe_3b",
    matiereId: matieres.find(m => m.nom === "Physique-Chimie" && m.niveauClasse === "3ème")?.id || "mat_010",
    enseignantId: enseignants[3].id,
    jour: "LUNDI",
    heureDebut: "08:00",
    heureFin: "10:00",
    anneeScolaire: "2024-2025",
    createdAt: "2024-08-15T10:00:00.000Z"
  },
  {
    id: "seance_015",
    cycle: cycles[2].nom,
    niveauScolaire: "Secondaire",
    matiere: "SVT",
    classe: "3ème B",
    niveauClasse: "3ème",
    enseignant: "Mme Sewonou Afia",
    classeId: classes.find(c => c.nom === "3ème B")?.id || "classe_3b",
    matiereId: matieres.find(m => m.nom === "SVT" && m.niveauClasse === "3ème")?.id || "mat_011",
    enseignantId: enseignants[3].id,
    jour: "LUNDI",
    heureDebut: "10:00",
    heureFin: "12:00",
    anneeScolaire: "2024-2025",
    createdAt: "2024-08-15T10:00:00.000Z"
  },

  // ========== LYCÉE ==========
  // Seconde S - Lundi
  {
    id: "seance_016",
    cycle: cycles[3].nom, // "2ème cycle (Lycée)"
    niveauScolaire: "Secondaire",
    matiere: "Mathématiques",
    classe: "Seconde S",
    niveauClasse: "Seconde",
    enseignant: "M. Koffi Komlan",
    classeId: classes.find(c => c.nom === "Seconde S")?.id || "classe_2s",
    matiereId: matieres.find(m => m.nom === "Mathématiques" && m.niveauClasse === "Seconde")?.id || "mat_012",
    enseignantId: enseignants[0].id,
    jour: "LUNDI",
    heureDebut: "08:00",
    heureFin: "10:00",
    anneeScolaire: "2024-2025",
    createdAt: "2024-08-15T10:00:00.000Z"
  },
  {
    id: "seance_017",
    cycle: cycles[3].nom,
    niveauScolaire: "Secondaire",
    matiere: "Physique-Chimie",
    classe: "Seconde S",
    niveauClasse: "Seconde",
    enseignant: "Mme Sewonou Afia",
    classeId: classes.find(c => c.nom === "Seconde S")?.id || "classe_2s",
    matiereId: matieres.find(m => m.nom === "Physique-Chimie" && m.niveauClasse === "Seconde")?.id || "mat_012",
    enseignantId: enseignants[3].id,
    jour: "LUNDI",
    heureDebut: "10:00",
    heureFin: "12:00",
    anneeScolaire: "2024-2025",
    createdAt: "2024-08-15T10:00:00.000Z"
  },
  {
    id: "seance_018",
    cycle: cycles[3].nom,
    niveauScolaire: "Secondaire",
    matiere: "SVT",
    classe: "Seconde S",
    niveauClasse: "Seconde",
    enseignant: "Mme Sewonou Afia",
    classeId: classes.find(c => c.nom === "Seconde S")?.id || "classe_2s",
    matiereId: matieres.find(m => m.nom === "SVT" && m.niveauClasse === "Seconde")?.id || "mat_012",
    enseignantId: enseignants[3].id,
    jour: "LUNDI",
    heureDebut: "14:00",
    heureFin: "16:00",
    anneeScolaire: "2024-2025",
    createdAt: "2024-08-15T10:00:00.000Z"
  },

  // Première L - Mardi
  {
    id: "seance_019",
    cycle: cycles[3].nom,
    niveauScolaire: "Secondaire",
    matiere: "Français",
    classe: "Première L",
    niveauClasse: "Première",
    enseignant: "Mme Mensah Ama",
    classeId: classes.find(c => c.nom === "Première L")?.id || "classe_1l",
    matiereId: matieres.find(m => m.nom === "Français" && m.niveauClasse === "Première")?.id || "mat_013",
    enseignantId: enseignants[1].id,
    jour: "MARDI",
    heureDebut: "08:00",
    heureFin: "10:00",
    anneeScolaire: "2024-2025",
    createdAt: "2024-08-15T10:00:00.000Z"
  },
  {
    id: "seance_020",
    cycle: cycles[3].nom,
    niveauScolaire: "Secondaire",
    matiere: "Philosophie",
    classe: "Première L",
    niveauClasse: "Première",
    enseignant: "Mme Mensah Ama",
    classeId: classes.find(c => c.nom === "Première L")?.id || "classe_1l",
    matiereId: matieres.find(m => m.nom === "Philosophie" && m.niveauClasse === "Première")?.id || "mat_013",
    enseignantId: enseignants[1].id,
    jour: "MARDI",
    heureDebut: "10:00",
    heureFin: "12:00",
    anneeScolaire: "2024-2025",
    createdAt: "2024-08-15T10:00:00.000Z"
  },
  {
    id: "seance_021",
    cycle: cycles[3].nom,
    niveauScolaire: "Secondaire",
    matiere: "Histoire-Géo",
    classe: "Première L",
    niveauClasse: "Première",
    enseignant: "Mme Mensah Ama",
    classeId: classes.find(c => c.nom === "Première L")?.id || "classe_1l",
    matiereId: matieres.find(m => m.nom === "Histoire-Géo" && m.niveauClasse === "Première")?.id || "mat_013",
    enseignantId: enseignants[1].id,
    jour: "MARDI",
    heureDebut: "14:00",
    heureFin: "16:00",
    anneeScolaire: "2024-2025",
    createdAt: "2024-08-15T10:00:00.000Z"
  }
];