// src/services/inscriptionsService.ts
import { fakeDataService } from './fakeDataService';
import { Inscription } from '../utils/types/data';
import { BaseInscription } from '../utils/types/base';

interface GetInscriptionsOptions {
  eleveId?: string;
  anneeScolaire?: string;
}

export const inscriptionsService = {
  async getAll(options?: GetInscriptionsOptions): Promise<Inscription[]> {
    try {
      return await fakeDataService.getInscriptions(options);
    } catch (error) {
      console.error('Erreur getAll Inscriptions:', error);
      throw error;
    }
  },

  async getByEleveId(eleveId: string): Promise<Inscription[]> {
    try {
      return await fakeDataService.getInscriptions({ eleveId });
    } catch (error) {
      console.error('Erreur getByEleveId Inscriptions:', error);
      throw error;
    }
  },

  async create(payload: BaseInscription): Promise<Inscription> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));

      // Récupérer les données de l'élève
      const eleveData = await fakeDataService.getEleveDataById(payload.eleveDataId);
      if (!eleveData) throw new Error('Données élève non trouvées');

      // Récupérer les informations de la classe
      const classes = await fakeDataService.getClasses();
      const classe = classes.find(c => c.id === payload.classeId);
      if (!classe) throw new Error('Classe non trouvée');

      const newInscription: Inscription = {
        ...payload,
        ...eleveData,
        classe: classe.nom,
        niveauClasse: classe.niveauClasse,
        cycle: classe.cycle,
        niveauScolaire: classe.niveauScolaire,
        payements: [],
        createdAt: new Date().toISOString(),
        id: `ins_${Date.now()}`,

      };

      return newInscription;
    } catch (error) {
      console.error('Erreur create Inscription:', error);
      throw error;
    }
  },

  async update(id: string, payload: Partial<BaseInscription>): Promise<Inscription> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      // Logique de mise à jour...
      throw new Error('Méthode non implémentée');
    } catch (error) {
      console.error('Erreur update Inscription:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log(`Inscription ${id} supprimée (simulation)`);
    } catch (error) {
      console.error('Erreur delete Inscription:', error);
      throw error;
    }
  },
};