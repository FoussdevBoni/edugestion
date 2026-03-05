// src/utils/fakeData/baseData.ts
import { v4 as uuidv4 } from 'uuid';

// Génération d'IDs cohérents
export const ids = {
  niveauxScolaires: {
    maternel: uuidv4(),
    primaire: uuidv4(),
    secondaire: uuidv4()
  },
  cycles: {
    maternelle: uuidv4(),
    primaire: uuidv4(),
    college: uuidv4(),
    lycee: uuidv4()
  },
  niveauxClasse: {
    // Maternel
    petiteSection: uuidv4(),
    moyenneSection: uuidv4(),
    grandeSection: uuidv4(),
    // Primaire
    ci: uuidv4(),
    cp: uuidv4(),
    ce1: uuidv4(),
    ce2: uuidv4(),
    cm1: uuidv4(),
    cm2: uuidv4(),
    // Secondaire 1er cycle (Collège)
    sixieme: uuidv4(),
    cinquieme: uuidv4(),
    quatrieme: uuidv4(),
    troisieme: uuidv4(),
    // Secondaire 2nd cycle (Lycée)
    seconde: uuidv4(),
    premiere: uuidv4(),
    terminale: uuidv4()
  },
  classes: {
    // Maternel
    psA: uuidv4(), msA: uuidv4(), gsA: uuidv4(),
    // Primaire
    ciA: uuidv4(), cpA: uuidv4(), ce1A: uuidv4(), ce2A: uuidv4(), cm1A: uuidv4(), cm2A: uuidv4(),
    ciB: uuidv4(), cpB: uuidv4(), ce1B: uuidv4(), ce2B: uuidv4(), cm1B: uuidv4(), cm2B: uuidv4(),
    // Collège
    sixiemeA: uuidv4(), sixiemeB: uuidv4(),
    cinquiemeA: uuidv4(), cinquiemeB: uuidv4(),
    quatriemeA: uuidv4(), quatriemeB: uuidv4(),
    troisiemeA: uuidv4(), troisiemeB: uuidv4(),
    // Lycée
    secondeL: uuidv4(), secondeS: uuidv4(),
    premiereL: uuidv4(), premiereS: uuidv4(),
    terminaleL: uuidv4(), terminaleS: uuidv4()
  }
};

// 1. Niveaux Scolaires
export const niveauxScolaires = [
  {
    id: ids.niveauxScolaires.maternel,
    nom: "Maternel",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.niveauxScolaires.primaire,
    nom: "Primaire",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.niveauxScolaires.secondaire,
    nom: "Secondaire",
    createdAt: "2024-09-01T00:00:00.000Z"
  }
];

// 2. Cycles
export const cycles = [
  {
    id: ids.cycles.maternelle,
    niveauScolaireId: ids.niveauxScolaires.maternel,
    niveauScolaire: "Maternel",
    nom: "Maternelle",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.cycles.primaire,
    niveauScolaireId: ids.niveauxScolaires.primaire,
    niveauScolaire: "Primaire",
    nom: "1er cycle",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.cycles.college,
    niveauScolaireId: ids.niveauxScolaires.secondaire,
    niveauScolaire: "Secondaire",
    nom: "1er cycle (Collège)",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.cycles.lycee,
    niveauScolaireId: ids.niveauxScolaires.secondaire,
    niveauScolaire: "Secondaire",
    nom: "2ème cycle (Lycée)",
    createdAt: "2024-09-01T00:00:00.000Z"
  }
];

// 3. Niveaux de Classe
export const niveauxClasse = [
  // Maternel
  {
    id: ids.niveauxClasse.petiteSection,
    cycleId: ids.cycles.maternelle,
    cycle: "Maternelle",
    niveauScolaire: "Maternel",
    nom: "Petite Section",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.niveauxClasse.moyenneSection,
    cycleId: ids.cycles.maternelle,
    cycle: "Maternelle",
    niveauScolaire: "Maternel",
    nom: "Moyenne Section",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.niveauxClasse.grandeSection,
    cycleId: ids.cycles.maternelle,
    cycle: "Maternelle",
    niveauScolaire: "Maternel",
    nom: "Grande Section",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  // Primaire
  {
    id: ids.niveauxClasse.ci,
    cycleId: ids.cycles.primaire,
    cycle: "1er cycle",
    niveauScolaire: "Primaire",
    nom: "CI",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.niveauxClasse.cp,
    cycleId: ids.cycles.primaire,
    cycle: "1er cycle",
    niveauScolaire: "Primaire",
    nom: "CP",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.niveauxClasse.ce1,
    cycleId: ids.cycles.primaire,
    cycle: "1er cycle",
    niveauScolaire: "Primaire",
    nom: "CE1",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.niveauxClasse.ce2,
    cycleId: ids.cycles.primaire,
    cycle: "1er cycle",
    niveauScolaire: "Primaire",
    nom: "CE2",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.niveauxClasse.cm1,
    cycleId: ids.cycles.primaire,
    cycle: "1er cycle",
    niveauScolaire: "Primaire",
    nom: "CM1",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.niveauxClasse.cm2,
    cycleId: ids.cycles.primaire,
    cycle: "1er cycle",
    niveauScolaire: "Primaire",
    nom: "CM2",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  // Collège
  {
    id: ids.niveauxClasse.sixieme,
    cycleId: ids.cycles.college,
    cycle: "1er cycle (Collège)",
    niveauScolaire: "Secondaire",
    nom: "6ème",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.niveauxClasse.cinquieme,
    cycleId: ids.cycles.college,
    cycle: "1er cycle (Collège)",
    niveauScolaire: "Secondaire",
    nom: "5ème",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.niveauxClasse.quatrieme,
    cycleId: ids.cycles.college,
    cycle: "1er cycle (Collège)",
    niveauScolaire: "Secondaire",
    nom: "4ème",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.niveauxClasse.troisieme,
    cycleId: ids.cycles.college,
    cycle: "1er cycle (Collège)",
    niveauScolaire: "Secondaire",
    nom: "3ème",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  // Lycée
  {
    id: ids.niveauxClasse.seconde,
    cycleId: ids.cycles.lycee,
    cycle: "2ème cycle (Lycée)",
    niveauScolaire: "Secondaire",
    nom: "Seconde",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.niveauxClasse.premiere,
    cycleId: ids.cycles.lycee,
    cycle: "2ème cycle (Lycée)",
    niveauScolaire: "Secondaire",
    nom: "Première",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.niveauxClasse.terminale,
    cycleId: ids.cycles.lycee,
    cycle: "2ème cycle (Lycée)",
    niveauScolaire: "Secondaire",
    nom: "Terminale",
    createdAt: "2024-09-01T00:00:00.000Z"
  }
];

// 4. Classes
export const classes = [
  // Maternel
  {
    id: ids.classes.psA,
    nom: "Petite Section A",
    niveauClasseId: ids.niveauxClasse.petiteSection,
    niveauClasse: "Petite Section",
    cycle: "Maternelle",
    niveauScolaire: "Maternel",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.classes.msA,
    nom: "Moyenne Section A",
    niveauClasseId: ids.niveauxClasse.moyenneSection,
    niveauClasse: "Moyenne Section",
    cycle: "Maternelle",
    niveauScolaire: "Maternel",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.classes.gsA,
    nom: "Grande Section A",
    niveauClasseId: ids.niveauxClasse.grandeSection,
    niveauClasse: "Grande Section",
    cycle: "Maternelle",
    niveauScolaire: "Maternel",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  // Primaire
  {
    id: ids.classes.ciA,
    nom: "CI A",
    niveauClasseId: ids.niveauxClasse.ci,
    niveauClasse: "CI",
    cycle: "1er cycle",
    niveauScolaire: "Primaire",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.classes.ciB,
    nom: "CI B",
    niveauClasseId: ids.niveauxClasse.ci,
    niveauClasse: "CI",
    cycle: "1er cycle",
    niveauScolaire: "Primaire",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.classes.cm1A,
    nom: "CM1 A",
    niveauClasseId: ids.niveauxClasse.cm1,
    niveauClasse: "CM1",
    cycle: "1er cycle",
    niveauScolaire: "Primaire",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.classes.cm2B,
    nom: "CM2 B",
    niveauClasseId: ids.niveauxClasse.cm2,
    niveauClasse: "CM2",
    cycle: "1er cycle",
    niveauScolaire: "Primaire",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  // Collège
  {
    id: ids.classes.sixiemeA,
    nom: "6ème A",
    niveauClasseId: ids.niveauxClasse.sixieme,
    niveauClasse: "6ème",
    cycle: "1er cycle (Collège)",
    niveauScolaire: "Secondaire",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.classes.sixiemeB,
    nom: "6ème B",
    niveauClasseId: ids.niveauxClasse.sixieme,
    niveauClasse: "6ème",
    cycle: "1er cycle (Collège)",
    niveauScolaire: "Secondaire",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.classes.troisiemeA,
    nom: "3ème A",
    niveauClasseId: ids.niveauxClasse.troisieme,
    niveauClasse: "3ème",
    cycle: "1er cycle (Collège)",
    niveauScolaire: "Secondaire",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  // Lycée
  {
    id: ids.classes.secondeS,
    nom: "Seconde S",
    niveauClasseId: ids.niveauxClasse.seconde,
    niveauClasse: "Seconde",
    cycle: "2ème cycle (Lycée)",
    niveauScolaire: "Secondaire",
    createdAt: "2024-09-01T00:00:00.000Z"
  },
  {
    id: ids.classes.premiereL,
    nom: "Première L",
    niveauClasseId: ids.niveauxClasse.premiere,
    niveauClasse: "Première",
    cycle: "2ème cycle (Lycée)",
    niveauScolaire: "Secondaire",
    createdAt: "2024-09-01T00:00:00.000Z"
  }
];