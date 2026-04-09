// src/utils/fakeData/notes.ts
import { Note } from '../utils/types/data';
import { enseignants } from './enseignants';

// ========== PRIMAIRE ==========
// CP A - 1er Trimestre
export const notes: Note[] = [
  // CP A - 1er Trimestre
  {
    id: "note_001",
    inscriptionId: "ins_2023_001", // DIOP Mamadou
    matiereId: "mat_002", // Français
    matiere: "Français",
    periodeId: "periode_1",
    periode: "1er Trimestre",
    note: 15.5,
    coefficient: 4,
    enseignantId: enseignants[1].id, // Mensah Ama
    evaluationId: "eval_001",
    evaluation: "1ère évaluation",
    createdAt: "2023-11-15T10:00:00.000Z",
    niveauScolaire: "Primaire",
    classe: "CP A",
    eleve: "DIOP Mamadou",
    niveauClasse: "CP",
    anneeScolaire: "2023-2024"
  },
  {
    id: "note_002",
    inscriptionId: "ins_2023_001", // DIOP Mamadou
    matiereId: "mat_001", // Mathématiques
    matiere: "Mathématiques",
    periodeId: "periode_1",
    periode: "1er Trimestre",
    note: 12,
    coefficient: 3,
    enseignantId: enseignants[1].id, // Mensah Ama (institutrice)
    evaluationId: "eval_001",
    evaluation: "1ère évaluation",
    createdAt: "2023-11-15T10:00:00.000Z",
    niveauScolaire: "Primaire",
    classe: "CP A",
    eleve: "DIOP Mamadou",
    niveauClasse: "CP",
    anneeScolaire: "2023-2024"
  },
  {
    id: "note_003",
    inscriptionId: "ins_2023_002", // SOW Aminata
    matiereId: "mat_001", // Mathématiques
    matiere: "Mathématiques",
    periodeId: "periode_1",
    periode: "1er Trimestre",
    note: 17,
    coefficient: 3,
    enseignantId: enseignants[1].id, // Mensah Ama
    evaluationId: "eval_001",
    evaluation: "1ère évaluation",
    createdAt: "2023-11-15T10:00:00.000Z",
    niveauScolaire: "Primaire",
    classe: "CP A",
    eleve: "SOW Aminata",
    niveauClasse: "CP",
    anneeScolaire: "2023-2024"
  },
  {
    id: "note_004",
    inscriptionId: "ins_2023_002", // SOW Aminata
    matiereId: "mat_002", // Français
    matiere: "Français",
    periodeId: "periode_1",
    periode: "1er Trimestre",
    note: 16,
    coefficient: 4,
    enseignantId: enseignants[1].id, // Mensah Ama
    evaluationId: "eval_001",
    evaluation: "1ère évaluation",
    createdAt: "2023-11-15T10:00:00.000Z",
    niveauScolaire: "Primaire",
    classe: "CP A",
    eleve: "SOW Aminata",
    niveauClasse: "CP",
    anneeScolaire: "2023-2024"
  },

  // CE1 B - 1er Trimestre
  {
    id: "note_005",
    inscriptionId: "ins_2023_003", // FALL Oumar
    matiereId: "mat_002", // Français
    matiere: "Français",
    periodeId: "periode_1",
    periode: "1er Trimestre",
    note: 13,
    coefficient: 4,
    enseignantId: enseignants[0].id, // Koffi Komlan (instituteur)
    evaluationId: "eval_001",
    evaluation: "1ère évaluation",
    createdAt: "2023-11-16T09:00:00.000Z",
    niveauScolaire: "Primaire",
    classe: "CE1 B",
    eleve: "FALL Oumar",
    niveauClasse: "CE1",
    anneeScolaire: "2023-2024"
  },
  {
    id: "note_006",
    inscriptionId: "ins_2023_003", // FALL Oumar
    matiereId: "mat_001", // Mathématiques
    matiere: "Mathématiques",
    periodeId: "periode_1",
    periode: "1er Trimestre",
    note: 11,
    coefficient: 3,
    enseignantId: enseignants[0].id, // Koffi Komlan
    evaluationId: "eval_001",
    evaluation: "1ère évaluation",
    createdAt: "2023-11-16T09:00:00.000Z",
    niveauScolaire: "Primaire",
    classe: "CE1 B",
    eleve: "FALL Oumar",
    niveauClasse: "CE1",
    anneeScolaire: "2023-2024"
  },
  {
    id: "note_007",
    inscriptionId: "ins_2023_004", // NDIAYE Fatou
    matiereId: "mat_002", // Français
    matiere: "Français",
    periodeId: "periode_1",
    periode: "1er Trimestre",
    note: 18,
    coefficient: 4,
    enseignantId: enseignants[0].id, // Koffi Komlan
    evaluationId: "eval_001",
    evaluation: "1ère évaluation",
    createdAt: "2023-11-16T10:30:00.000Z",
    niveauScolaire: "Primaire",
    classe: "CE1 B",
    eleve: "NDIAYE Fatou",
    niveauClasse: "CE1",
    anneeScolaire: "2023-2024"
  },

  // CM2 A - 1er Trimestre
  {
    id: "note_008",
    inscriptionId: "ins_2023_006", // SECK Modou
    matiereId: "mat_006", // Sciences
    matiere: "Sciences",
    periodeId: "periode_1",
    periode: "1er Trimestre",
    note: 14,
    coefficient: 2,
    enseignantId: enseignants[2].id, // Dogbe Yawo (instituteur)
    evaluationId: "eval_001",
    evaluation: "1ère évaluation",
    createdAt: "2023-11-17T08:15:00.000Z",
    niveauScolaire: "Primaire",
    classe: "CM2 A",
    eleve: "SECK Modou",
    niveauClasse: "CM2",
    anneeScolaire: "2023-2024"
  },

  // ========== COLLÈGE ==========
  // 6ème A - 1er Trimestre
  {
    id: "note_009",
    inscriptionId: "ins_2023_005", // GUEYE Aïssatou
    matiereId: "mat_007", // Mathématiques
    matiere: "Mathématiques",
    periodeId: "periode_1",
    periode: "1er Trimestre",
    note: 14,
    coefficient: 4,
    enseignantId: enseignants[0].id, // Koffi Komlan
    evaluationId: "eval_004",
    evaluation: "1ère interrogation",
    createdAt: "2023-10-15T10:30:00.000Z",
    niveauScolaire: "Secondaire",
    classe: "6ème A",
    eleve: "GUEYE Aïssatou",
    niveauClasse: "6ème",
    anneeScolaire: "2023-2024"
  },
  {
    id: "note_010",
    inscriptionId: "ins_2023_005", // GUEYE Aïssatou
    matiereId: "mat_008", // Français
    matiere: "Français",
    periodeId: "periode_1",
    periode: "1er Trimestre",
    note: 13.5,
    coefficient: 4,
    enseignantId: enseignants[1].id, // Mensah Ama
    evaluationId: "eval_004",
    evaluation: "1ère interrogation",
    createdAt: "2023-10-16T09:15:00.000Z",
    niveauScolaire: "Secondaire",
    classe: "6ème A",
    eleve: "GUEYE Aïssatou",
    niveauClasse: "6ème",
    anneeScolaire: "2023-2024"
  },
  {
    id: "note_011",
    inscriptionId: "ins_2023_005", // GUEYE Aïssatou
    matiereId: "mat_009", // Anglais
    matiere: "Anglais",
    periodeId: "periode_1",
    periode: "1er Trimestre",
    note: 15,
    coefficient: 2,
    enseignantId: enseignants[2].id, // Dogbe Yawo
    evaluationId: "eval_004",
    evaluation: "1ère interrogation",
    createdAt: "2023-10-17T11:45:00.000Z",
    niveauScolaire: "Secondaire",
    classe: "6ème A",
    eleve: "GUEYE Aïssatou",
    niveauClasse: "6ème",
    anneeScolaire: "2023-2024"
  },
  {
    id: "note_012",
    inscriptionId: "ins_2023_007", // DIAGNE Marième
    matiereId: "mat_007", // Mathématiques
    matiere: "Mathématiques",
    periodeId: "periode_1",
    periode: "1er Trimestre",
    note: 16,
    coefficient: 4,
    enseignantId: enseignants[0].id, // Koffi Komlan
    evaluationId: "eval_004",
    evaluation: "1ère interrogation",
    createdAt: "2023-10-15T10:30:00.000Z",
    niveauScolaire: "Secondaire",
    classe: "6ème A",
    eleve: "DIAGNE Marième",
    niveauClasse: "6ème",
    anneeScolaire: "2023-2024"
  },

  // 3ème B - 1er Trimestre
  {
    id: "note_013",
    inscriptionId: "ins_2023_008", // BA Cheikh
    matiereId: "mat_010", // Physique-Chimie
    matiere: "Physique-Chimie",
    periodeId: "periode_1",
    periode: "1er Trimestre",
    note: 12,
    coefficient: 3,
    enseignantId: enseignants[3].id, // Sewonou Afia
    evaluationId: "eval_005",
    evaluation: "2ème interrogation",
    createdAt: "2023-11-05T08:30:00.000Z",
    niveauScolaire: "Secondaire",
    classe: "3ème B",
    eleve: "BA Cheikh",
    niveauClasse: "3ème",
    anneeScolaire: "2023-2024"
  },
  {
    id: "note_014",
    inscriptionId: "ins_2023_008", // BA Cheikh
    matiereId: "mat_011", // SVT
    matiere: "SVT",
    periodeId: "periode_1",
    periode: "1er Trimestre",
    note: 11.5,
    coefficient: 3,
    enseignantId: enseignants[3].id, // Sewonou Afia
    evaluationId: "eval_007",
    evaluation: "1er devoir",
    createdAt: "2023-11-20T14:15:00.000Z",
    niveauScolaire: "Secondaire",
    classe: "3ème B",
    eleve: "BA Cheikh",
    niveauClasse: "3ème",
    anneeScolaire: "2023-2024"
  },

  // ========== LYCÉE ==========
  // Seconde S - 1er Trimestre
  {
    id: "note_015",
    inscriptionId: "ins_2023_009", // KANE Moussa
    matiereId: "mat_012", // Mathématiques
    matiere: "Mathématiques",
    periodeId: "periode_4",
    periode: "1er Semestre",
    note: 11,
    coefficient: 5,
    enseignantId: enseignants[0].id, // Koffi Komlan
    evaluationId: "eval_008",
    evaluation: "2ème devoir",
    createdAt: "2023-12-12T11:45:00.000Z",
    niveauScolaire: "Secondaire",
    classe: "Seconde S",
    eleve: "KANE Moussa",
    niveauClasse: "Seconde",
    anneeScolaire: "2023-2024"
  },
  {
    id: "note_016",
    inscriptionId: "ins_2023_009", // KANE Moussa
    matiereId: "mat_005", // Histoire-Géographie
    matiere: "Histoire-Géographie",
    periodeId: "periode_4",
    periode: "1er Semestre",
    note: 14,
    coefficient: 2,
    enseignantId: enseignants[1].id, // Mensah Ama
    evaluationId: "eval_007",
    evaluation: "1er devoir",
    createdAt: "2023-11-18T08:30:00.000Z",
    niveauScolaire: "Secondaire",
    classe: "Seconde S",
    eleve: "KANE Moussa",
    niveauClasse: "Seconde",
    anneeScolaire: "2023-2024"
  },
  {
    id: "note_017",
    inscriptionId: "ins_2023_009", // KANE Moussa
    matiereId: "mat_004", // Grammaire
    matiere: "Grammaire",
    periodeId: "periode_4",
    periode: "1er Semestre",
    note: 12.5,
    coefficient: 2,
    enseignantId: enseignants[1].id, // Mensah Ama
    evaluationId: "eval_004",
    evaluation: "1ère interrogation",
    createdAt: "2023-10-20T09:45:00.000Z",
    niveauScolaire: "Secondaire",
    classe: "Seconde S",
    eleve: "KANE Moussa",
    niveauClasse: "Seconde",
    anneeScolaire: "2023-2024"
  },

  // Première L - 1er Trimestre
  {
    id: "note_018",
    inscriptionId: "ins_2023_010", // DIOUF Rokhaya
    matiereId: "mat_013", // Philosophie
    matiere: "Philosophie",
    periodeId: "periode_4",
    periode: "1er Semestre",
    note: 15,
    coefficient: 3,
    enseignantId: enseignants[1].id, // Mensah Ama
    evaluationId: "eval_007",
    evaluation: "1er devoir",
    createdAt: "2023-11-22T10:00:00.000Z",
    niveauScolaire: "Secondaire",
    classe: "Première L",
    eleve: "DIOUF Rokhaya",
    niveauClasse: "Première",
    anneeScolaire: "2023-2024"
  },
  {
    id: "note_019",
    inscriptionId: "ins_2023_010", // DIOUF Rokhaya
    matiereId: "mat_002", // Français
    matiere: "Français",
    periodeId: "periode_4",
    periode: "1er Semestre",
    note: 16.5,
    coefficient: 4,
    enseignantId: enseignants[1].id, // Mensah Ama
    evaluationId: "eval_008",
    evaluation: "2ème devoir",
    createdAt: "2023-12-05T14:30:00.000Z",
    niveauScolaire: "Secondaire",
    classe: "Première L",
    eleve: "DIOUF Rokhaya",
    niveauClasse: "Première",
    anneeScolaire: "2023-2024"
  },

  // ========== 2ème TRIMESTRE ==========
  // CP A - 2ème Trimestre
  {
    id: "note_020",
    inscriptionId: "ins_2023_001", // DIOP Mamadou
    matiereId: "mat_002", // Français
    matiere: "Français",
    periodeId: "periode_2",
    periode: "2ème Trimestre",
    note: 16,
    coefficient: 4,
    enseignantId: enseignants[1].id, // Mensah Ama
    evaluationId: "eval_002",
    evaluation: "2ème évaluation",
    createdAt: "2024-02-15T10:00:00.000Z",
    niveauScolaire: "Primaire",
    classe: "CP A",
    eleve: "DIOP Mamadou",
    niveauClasse: "CP",
    anneeScolaire: "2023-2024"
  },
  {
    id: "note_021",
    inscriptionId: "ins_2023_001", // DIOP Mamadou
    matiereId: "mat_001", // Mathématiques
    matiere: "Mathématiques",
    periodeId: "periode_2",
    periode: "2ème Trimestre",
    note: 13,
    coefficient: 3,
    enseignantId: enseignants[1].id, // Mensah Ama
    evaluationId: "eval_002",
    evaluation: "2ème évaluation",
    createdAt: "2024-02-15T10:00:00.000Z",
    niveauScolaire: "Primaire",
    classe: "CP A",
    eleve: "DIOP Mamadou",
    niveauClasse: "CP",
    anneeScolaire: "2023-2024"
  },

  // 6ème A - 2ème Trimestre
  {
    id: "note_022",
    inscriptionId: "ins_2023_005", // GUEYE Aïssatou
    matiereId: "mat_007", // Mathématiques
    matiere: "Mathématiques",
    periodeId: "periode_2",
    periode: "2ème Trimestre",
    note: 12.5,
    coefficient: 4,
    enseignantId: enseignants[0].id, // Koffi Komlan
    evaluationId: "eval_009",
    evaluation: "1ère interrogation",
    createdAt: "2024-02-16T09:30:00.000Z",
    niveauScolaire: "Secondaire",
    classe: "6ème A",
    eleve: "GUEYE Aïssatou",
    niveauClasse: "6ème",
    anneeScolaire: "2023-2024"
  },

  // Seconde S - 2ème Semestre
  {
    id: "note_023",
    inscriptionId: "ins_2023_009", // KANE Moussa
    matiereId: "mat_012", // Mathématiques
    matiere: "Mathématiques",
    periodeId: "periode_5",
    periode: "2ème Semestre",
    note: 13,
    coefficient: 5,
    enseignantId: enseignants[0].id, // Koffi Komlan
    evaluationId: "eval_013",
    evaluation: "2ème devoir",
    createdAt: "2024-05-16T11:15:00.000Z",
    niveauScolaire: "Secondaire",
    classe: "Seconde S",
    eleve: "KANE Moussa",
    niveauClasse: "Seconde",
    anneeScolaire: "2023-2024"
  },

  // ========== 3ème TRIMESTRE ==========
  {
    id: "note_024",
    inscriptionId: "ins_2023_002", // SOW Aminata
    matiereId: "mat_002", // Français
    matiere: "Français",
    periodeId: "periode_3",
    periode: "3ème Trimestre",
    note: 17.5,
    coefficient: 4,
    enseignantId: enseignants[1].id, // Mensah Ama
    evaluationId: "eval_003",
    evaluation: "3ème évaluation",
    createdAt: "2024-06-10T09:00:00.000Z",
    niveauScolaire: "Primaire",
    classe: "CP A",
    eleve: "SOW Aminata",
    niveauClasse: "CP",
    anneeScolaire: "2023-2024"
  },
  {
    id: "note_025",
    inscriptionId: "ins_2023_005", // GUEYE Aïssatou
    matiereId: "mat_009", // Anglais
    matiere: "Anglais",
    periodeId: "periode_3",
    periode: "3ème Trimestre",
    note: 16,
    coefficient: 2,
    enseignantId: enseignants[2].id, // Dogbe Yawo
    evaluationId: "eval_011",
    evaluation: "3ème interrogation",
    createdAt: "2024-05-25T11:30:00.000Z",
    niveauScolaire: "Secondaire",
    classe: "6ème A",
    eleve: "GUEYE Aïssatou",
    niveauClasse: "6ème",
    anneeScolaire: "2023-2024"
  }
];