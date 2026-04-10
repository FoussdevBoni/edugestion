// src/services/eleveDataService.ts
import { invokeIpc } from "../utils/invokeIpc";
import { BaseEleveData } from "../utils/types/base";
import { EleveData } from "../utils/types/data";

export interface DeleteManyResult {
  success: boolean;
  deletedCount: number;
}

export const eleveDataService = {
  // Récupérer tous les élèves (données brutes)
  async getAll(): Promise<EleveData[]> {
    return await invokeIpc('eleveData:getAll');
  },

  // Récupérer un élève par son ID
  async getById(id: string): Promise<EleveData | null> {
    return await invokeIpc('eleveData:getById', id);
  },

  // Récupérer un élève par son matricule
  async getByMatricule(matricule: string): Promise<EleveData | null> {
    return await invokeIpc('eleveData:getByMatricule', matricule);
  },

  // Créer un nouvel élève
  async create(data: BaseEleveData): Promise<EleveData> {
    return await invokeIpc('eleveData:create', data);
  },

  // Mettre à jour un élève
  async update(id: string, data: Partial<BaseEleveData>): Promise<EleveData | null> {
    return await invokeIpc('eleveData:update', id, data);
  },

  // Supprimer un élève
  async delete(id: string): Promise<{ success: boolean }> {
    return await invokeIpc('eleveData:delete', id);
  }

  
};