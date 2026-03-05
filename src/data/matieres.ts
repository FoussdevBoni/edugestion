// src/utils/fakeData/matieres.ts
import { Matiere } from '../utils/types/data';
import { ids } from './baseData';

export const matieres: Matiere[] = [
  // Primaire
  {
    id: "mat_001",
    nom: "Mathématiques",
    coefficient: 3,
    niveauClasseId: ids.niveauxClasse.ci,
    niveauClasse: "CI",
    createdAt: "2023-08-01T00:00:00.000Z"
  },
  {
    id: "mat_002",
    nom: "Français",
    coefficient: 4,
    niveauClasseId: ids.niveauxClasse.cp,
    niveauClasse: "CP",
    createdAt: "2023-08-01T00:00:00.000Z"
  },
  {
    id: "mat_003",
    nom: "Lecture",
    coefficient: 2,
    niveauClasseId: ids.niveauxClasse.ce1,
    niveauClasse: "CE1",
    createdAt: "2023-08-01T00:00:00.000Z"
  },
  {
    id: "mat_004",
    nom: "Grammaire",
    coefficient: 2,
    niveauClasseId: ids.niveauxClasse.ce2,
    niveauClasse: "CE2",
    createdAt: "2023-08-01T00:00:00.000Z"
  },
  {
    id: "mat_005",
    nom: "Histoire-Géographie",
    coefficient: 2,
    niveauClasseId: ids.niveauxClasse.cm1,
    niveauClasse: "CM1",
    createdAt: "2023-08-01T00:00:00.000Z"
  },
  {
    id: "mat_006",
    nom: "Sciences",
    coefficient: 2,
    niveauClasseId: ids.niveauxClasse.cm2,
    niveauClasse: "CM2",
    createdAt: "2023-08-01T00:00:00.000Z"
  },
  // Collège
  {
    id: "mat_007",
    nom: "Mathématiques",
    coefficient: 4,
    niveauClasseId: ids.niveauxClasse.sixieme,
    niveauClasse: "6ème",
    createdAt: "2023-08-01T00:00:00.000Z"
  },
  {
    id: "mat_008",
    nom: "Français",
    coefficient: 4,
    niveauClasseId: ids.niveauxClasse.sixieme,
    niveauClasse: "6ème",
    createdAt: "2023-08-01T00:00:00.000Z"
  },
  {
    id: "mat_009",
    nom: "Anglais",
    coefficient: 2,
    niveauClasseId: ids.niveauxClasse.sixieme,
    niveauClasse: "6ème",
    createdAt: "2023-08-01T00:00:00.000Z"
  },
  {
    id: "mat_010",
    nom: "Physique-Chimie",
    coefficient: 3,
    niveauClasseId: ids.niveauxClasse.troisieme,
    niveauClasse: "3ème",
    createdAt: "2023-08-01T00:00:00.000Z"
  },
  {
    id: "mat_011",
    nom: "SVT",
    coefficient: 3,
    niveauClasseId: ids.niveauxClasse.troisieme,
    niveauClasse: "3ème",
    createdAt: "2023-08-01T00:00:00.000Z"
  },
  // Lycée
  {
    id: "mat_012",
    nom: "Mathématiques",
    coefficient: 5,
    niveauClasseId: ids.niveauxClasse.seconde,
    niveauClasse: "Seconde",
    createdAt: "2023-08-01T00:00:00.000Z"
  },
  {
    id: "mat_013",
    nom: "Philosophie",
    coefficient: 3,
    niveauClasseId: ids.niveauxClasse.premiere,
    niveauClasse: "Première",
    createdAt: "2023-08-01T00:00:00.000Z"
  },
  {
    id: "mat_014",
    nom: "SVT",
    coefficient: 4,
    niveauClasseId: ids.niveauxClasse.terminale,
    niveauClasse: "Terminale",
    createdAt: "2023-08-01T00:00:00.000Z"
  }
];