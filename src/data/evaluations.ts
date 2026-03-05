// src/utils/fakeData/evaluations.ts
import { Evaluation } from '../utils/types/data';
import { ids } from './baseData';
import { periodes } from './periods';

export const evaluations: Evaluation[] = [

  // Evaluation du primaire

  {
    id: "eval_001",
    nom: "1ère évaluation",
    niveauScolaireId: ids.niveauxScolaires.primaire,
    niveauScolaire: "Primaire",
    periode: periodes[0].nom,
    periodeId: periodes[0].id,
    createdAt: "2023-09-01T00:00:00.000Z"
  },
  {
    id: "eval_002",
    nom: "2ème  évaluation",
    periode: periodes[1].nom,
    periodeId: periodes[1].id,
    niveauScolaireId: ids.niveauxScolaires.primaire,
    niveauScolaire: "Primaire",
    createdAt: "2023-09-01T00:00:00.000Z"
  },
  {
    id: "eval_003",
    nom: "3ème  évaluation",
    periode: periodes[2].nom,
    periodeId: periodes[2].id,
    niveauScolaireId: ids.niveauxScolaires.primaire,
    niveauScolaire: "Primaire",
    createdAt: "2023-09-01T00:00:00.000Z"
  },

  // Les évaluations du sécondaires

  // Les évalution du premier semestre

  {
    id: "eval_004",
    nom: "1ère interrogation du premier semestre",
    periode: periodes[3].nom,
    periodeId: periodes[3].id,
    niveauScolaireId: ids.niveauxScolaires.secondaire,
    niveauScolaire: "Secondaire",
    createdAt: "2023-09-01T00:00:00.000Z"
  },

  {
    id: "eval_005",
    nom: "2ème  interrogation du premier semestre",
    periode: periodes[3].nom,
    periodeId: periodes[3].id,
    niveauScolaireId: ids.niveauxScolaires.secondaire,
    niveauScolaire: "Secondaire",
    createdAt: "2023-09-01T00:00:00.000Z"
  },

  {
    id: "eval_006",
    nom: "3ème  interrogation du premier semestre",
    periode: periodes[3].nom,
    periodeId: periodes[3].id,
    niveauScolaireId: ids.niveauxScolaires.secondaire,
    niveauScolaire: "Secondaire",
    createdAt: "2023-09-01T00:00:00.000Z"
  },

  {
    id: "eval_007",
    nom: "1er devoir du premier semestre",
    periode: periodes[3].nom,
    periodeId: periodes[3].id,
    niveauScolaireId: ids.niveauxScolaires.secondaire,
    niveauScolaire: "Secondaire",
    createdAt: "2023-09-01T00:00:00.000Z"
  },
  {
    id: "eval_008",
    nom: "2ème devoir du premier semestre",
    periode: periodes[3].nom,
    periodeId: periodes[3].id,
    niveauScolaireId: ids.niveauxScolaires.secondaire,
    niveauScolaire: "Secondaire",
    createdAt: "2023-09-01T00:00:00.000Z"
  },

  // Les évalution du premier semestre

  {
    id: "eval_009",
    nom: "1ère interrogation du second semestre",
    periode: periodes[4].nom,
    periodeId: periodes[4].id,
    niveauScolaireId: ids.niveauxScolaires.secondaire,
    niveauScolaire: "Secondaire",
    createdAt: "2023-09-01T00:00:00.000Z"
  },

  {
    id: "eval_0010",
    nom: "2ème  interrogation du second semestre",
    periode: periodes[4].nom,
    periodeId: periodes[4].id,
    niveauScolaireId: ids.niveauxScolaires.secondaire,
    niveauScolaire: "Secondaire",
    createdAt: "2023-09-01T00:00:00.000Z"
  },

  {
    id: "eval_0011",
    nom: "3ème  interrogation du second semestre",
    periode: periodes[4].nom,
    periodeId: periodes[4].id,
    niveauScolaireId: ids.niveauxScolaires.secondaire,
    niveauScolaire: "Secondaire",
    createdAt: "2023-09-01T00:00:00.000Z"
  },

  {
    id: "eval_0012",
    nom: "1er devoir du second semestre",
    periode: periodes[4].nom,
    periodeId: periodes[4].id,
    niveauScolaireId: ids.niveauxScolaires.secondaire,
    niveauScolaire: "Secondaire",
    createdAt: "2023-09-01T00:00:00.000Z"
  },
  {
    id: "eval_0013",
    nom: "2ème devoir du second semestre",
    periode: periodes[4].nom,
    periodeId: periodes[4].id,
    niveauScolaireId: ids.niveauxScolaires.secondaire,
    niveauScolaire: "Secondaire",
    createdAt: "2023-09-01T00:00:00.000Z"
  },



];