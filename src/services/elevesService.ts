// src/services/elevesService.ts
import { fakeDataService } from './fakeDataService';
import { Eleve } from '../utils/types/data';

export interface GetElevesOptions {
  anneeScolaire?: string;
}

export const elevesService = {
  async getAll(options?: GetElevesOptions): Promise<Eleve[]> {
    try {
      return await fakeDataService.getEleves(options);
    } catch (error) {
      console.error('Erreur getAll Eleves:', error);
      throw error;
    }
  },

  async getByClasse(classeId: string, anneeScolaire?: string): Promise<Eleve[]> {
    try {
      const allEleves = await fakeDataService.getEleves({ anneeScolaire });
      return allEleves.filter(e => e.classeId === classeId);
    } catch (error) {
      console.error('Erreur getByClasse Eleves:', error);
      throw error;
    }
  },

  async create(payload: { eleveId: string; classe: string; anneeScolaire: string; statut?: string }): Promise<Eleve> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));

      // Récupérer l'inscription correspondante
      const inscriptions = await fakeDataService.getInscriptions({
        eleveId: payload.eleveId,
        anneeScolaire: payload.anneeScolaire
      });

      const inscription = inscriptions[0];
      if (!inscription) throw new Error('Inscription non trouvée');

      const newEleve: Eleve = {
        ...inscription,
        id: `eleve_${payload.eleveId}`,
        eleveDataId: payload.eleveId,
      };

      return newEleve;
    } catch (error) {
      console.error('Erreur create Eleve:', error);
      throw error;
    }
  },

  async update(id: string, payload: Partial<{ classe?: string; anneeScolaire?: string; statut?: string }>): Promise<Eleve> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      // Logique de mise à jour...
      throw new Error('Méthode non implémentée');
    } catch (error) {
      console.error('Erreur update Eleve:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log(`Élève ${id} supprimé (simulation)`);
    } catch (error) {
      console.error('Erreur delete Eleve:', error);
      throw error;
    }
  },
};