// src/services/initialisationService.ts
import { invokeIpc } from "../utils/invokeIpc";

export interface NiveauScolaireDisponible {
  nom: string;
  ordre: number;
  cyclesCount: number;
  periodesCount: number;
}

export interface ImportResult {
  success: boolean;
  message: string;
  resultats?: {
    niveauxScolaires: { ajoutes: number; ignores: number };
    cycles: { ajoutes: number; ignores: number };
    niveauxClasses: { ajoutes: number; ignores: number };
    matieres: { ajoutes: number; ignores: number };
    periodes: { ajoutes: number; ignores: number };
    evaluations: { ajoutes: number; ignores: number };
  };
}

export const initialisationService = {
  async importerNiveauxScolaires(pays: string, niveauxScolaires: string[]): Promise<ImportResult> {
    return await invokeIpc('initialisation:importerNiveauxScolaires', { pays, niveauxScolaires });
  },
  
  async getNiveauxDisponibles(pays: string): Promise<NiveauScolaireDisponible[]> {
    return await invokeIpc('initialisation:getNiveauxDisponibles', pays);
  },
  
  async getNiveauxExistants(): Promise<any> {
    return await invokeIpc('initialisation:getNiveauxExistants');
  },
  
  async verifierStructureExistante(): Promise<{ existe: boolean; stats: any }> {
    return await invokeIpc('initialisation:verifierStructureExistante');
  }
};