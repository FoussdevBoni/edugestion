// src/services/inventaireService.ts
import { invokeIpc } from "../utils/invokeIpc";
import { BaseInventaire } from "../utils/types/base";
import { Inventaire } from "../utils/types/data";

export const inventaireService = {
  async getAll(): Promise<Inventaire[]> {
    return await invokeIpc('inventaire:getAll');
  },

  async getById(id: string): Promise<Inventaire | null> {
    return await invokeIpc('inventaire:getById', id);
  },

  async create(data: BaseInventaire): Promise<Inventaire> {
    return await invokeIpc('inventaire:create', data);
  },

  async update(id: string, data: Partial<BaseInventaire>): Promise<Inventaire> {
    return await invokeIpc('inventaire:update', id, data);
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return await invokeIpc('inventaire:delete', id);
  },

  async getDernier(): Promise<Inventaire | null> {
    const inventaires = await this.getAll();
    return inventaires.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0] || null;
  },

  async getByPeriode(periode: string): Promise<Inventaire[]> {
    const inventaires = await this.getAll();
    return inventaires.filter(i => i.periode === periode);
  },

  async comparerAvecStockActuel(id: string, stockActuel: any[]): Promise<any[]> {
    const inventaire = await this.getById(id);
    if (!inventaire) return [];

    return inventaire.materiels.map(item => {
      const stock = stockActuel.find(s => s.id === item.id);
      return {
        ...item,
        stockActuel: stock?.quantite || 0,
        difference: (stock?.quantite || 0) - item.quantite
      };
    });
  }
};