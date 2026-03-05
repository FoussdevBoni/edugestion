// src/services/eleveDataService.ts
import { fakeDataService } from './fakeDataService';
import { EleveData } from '../utils/types/data';
import { BaseEleveData } from '../utils/types/base';

export const eleveDataService = {
  async getAll(): Promise<EleveData[]> {
    try {
      return await fakeDataService.getElevesData();
    } catch (error) {
      console.error('Erreur getAll EleveData:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<EleveData | undefined> {
    try {
      return await fakeDataService.getEleveDataById(id);
    } catch (error) {
      console.error('Erreur getById EleveData:', error);
      throw error;
    }
  },

  async create(payload: BaseEleveData): Promise<EleveData> {
    try {
      // Simulation de création
      await new Promise(resolve => setTimeout(resolve, 300));
      const newEleveData: EleveData = {
        id: `eleve_data_${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString()
      };
      return newEleveData;
    } catch (error) {
      console.error('Erreur create EleveData:', error);
      throw error;
    }
  },

  async update(id: string, payload: Partial<BaseEleveData>): Promise<EleveData> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const existing = await this.getById(id);
      if (!existing) throw new Error('Élève non trouvé');
      
      const updated: EleveData = {
        ...existing,
        ...payload,
        updatedAt: new Date().toISOString()
      };
      return updated;
    } catch (error) {
      console.error('Erreur update EleveData:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log(`Élève ${id} supprimé (simulation)`);
    } catch (error) {
      console.error('Erreur delete EleveData:', error);
      throw error;
    }
  },
};