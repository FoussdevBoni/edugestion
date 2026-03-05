// src/utils/fakeData/eleves.ts
import { Eleve } from '../utils/types/data';
import { inscriptions } from './inscriptions';

// Filtrer seulement les inscriptions de l'année en cours (2023-2024)
export const eleves: Eleve[] = inscriptions
  .filter(ins => ins.anneeScolaire === "2023-2024")
  .map(ins => ({
    ...ins,
    id: `eleve_${ins.eleveDataId}`,
    eleveDataId: ins.eleveDataId,
    
  }));