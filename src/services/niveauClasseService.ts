// src/services/niveauClasseService.ts
import { invokeIpc } from "../utils/invokeIpc";

export const niveauClasseService = {
  async getAll() {
    return await invokeIpc('niveauClasse:getAll');
  },
  
  async getById(id: string) {
    return await invokeIpc('niveauClasse:getById', id);
  },
  
  async getByCycle(cycleId: string) {
    return await invokeIpc('niveauClasse:getByCycle', cycleId);
  },
  
  async create(data: any) {
    return await invokeIpc('niveauClasse:create', data);
  },

  async createMany(niveaux: Array<{ nom: string; cycleId: string }>) {
    return await invokeIpc('niveauClasse:createMany', niveaux);
  },
  
  async update(id: string, data: any) {
    return await invokeIpc('niveauClasse:update', id, data);
  },
  
  async delete(id: string) {
    return await invokeIpc('niveauClasse:delete', id);
  }
};