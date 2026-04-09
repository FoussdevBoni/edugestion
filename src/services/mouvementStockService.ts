// src/services/mouvementStockService.ts
import { invokeIpc } from "../utils/invokeIpc";
import { MouvementStock } from "../utils/types/data";

export const mouvementStockService = {
  async getAll(): Promise<MouvementStock[]> {
    return await invokeIpc('mouvementStock:getAll');
  },

  async getByMateriel(materielId: string): Promise<MouvementStock[]> {
    return await invokeIpc('mouvementStock:getByMateriel', materielId);
  },

  async getHistoriqueComplet(materielId: string): Promise<MouvementStock[]> {
    return await invokeIpc('mouvementStock:getHistoriqueComplet', materielId);
  }
};