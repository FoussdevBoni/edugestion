// src/services/cycleService.ts
import { invokeIpc } from "../utils/invokeIpc";

export const cycleService = {
  async getAll() {
    return await invokeIpc('cycle:getAll');
  },
  
  async getById(id: string) {
    return await invokeIpc('cycle:getById', id);
  },
  
  async getByNiveauScolaire(niveauScolaireId: string) {
    return await invokeIpc('cycle:getByNiveauScolaire', niveauScolaireId);
  },
  
  async create(data: any) {
    return await invokeIpc('cycle:create', data);
  },

   async createMany(data: any) {
    return await invokeIpc('cycle:createMany', data);
  },
  
  async update(id: string, data: any) {
    return await invokeIpc('cycle:update', id, data);
  },
  
  async delete(id: string) {
    return await invokeIpc('cycle:delete', id);
  }
};