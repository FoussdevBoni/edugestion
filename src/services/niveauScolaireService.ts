// src/services/niveauScolaireService.ts
import { BaseNiveauScolaire } from "../utils/types/base";
import { NiveauScolaire } from "../utils/types/data";

const invokeIpc = async (channel: string, ...args: any[]) => {
  return await (window as any).electron.ipcRenderer.invoke(channel, ...args);
};

export const niveauScolaireService = {
  async getAll(): Promise<NiveauScolaire[]> {
    return await invokeIpc('niveauScolaire:getAll');
  },

  async getById(id: string): Promise<NiveauScolaire | null> {
    return await invokeIpc('niveauScolaire:getById', id);
  },

  async create(payload: BaseNiveauScolaire): Promise<NiveauScolaire> {
    return await invokeIpc('niveauScolaire:create', payload);
  },

    async createMany(payload: BaseNiveauScolaire[]): Promise<NiveauScolaire> {
    return await invokeIpc('niveauScolaire:createMany', payload);
  },

  async update(id: string, payload: Partial<BaseNiveauScolaire>): Promise<NiveauScolaire> {
    return await invokeIpc('niveauScolaire:update', id, payload);
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return await invokeIpc('niveauScolaire:delete', id);
  }
};