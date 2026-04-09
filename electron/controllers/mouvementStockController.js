// electron/controllers/mouvementStockController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

export const mouvementStockController = {
  async getAll() {
    try {
      const db = getDb();
      const mouvements = db.data.mouvementsStock || [];
      const materiels = db.data.materiels || [];

      return mouvements.map(m => ({
        ...m,
        materiel: materiels.find(mat => mat.id === m.materielId)
      }));
    } catch (error) {
      console.error("Erreur getAll mouvementsStock:", error);
      throw error;
    }
  },

  async getByMateriel(materielId) {
    try {
      const db = getDb();
      const mouvements = db.data.mouvementsStock?.filter(m => m.materielId === materielId) || [];
      const materiel = db.data.materiels?.find(m => m.id === materielId);

      return mouvements.map(m => ({
        ...m,
        materiel
      })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error("Erreur getByMateriel mouvementsStock:", error);
      throw error;
    }
  },

  async create(data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();

      const mouvement = {
        id: uuidv4(),
        ...data,
        quantiteAvant: Number(data.quantiteAvant),
        quantiteApres: Number(data.quantiteApres),
        difference: Number(data.difference),
        date: data.date || now,
        createdAt: now,
        updatedAt: now
      };

      await db.update((dbData) => {
        if (!dbData.mouvementsStock) dbData.mouvementsStock = [];
        dbData.mouvementsStock.push(mouvement);
      });

      return mouvement;
    } catch (error) {
      console.error("Erreur create mouvementStock:", error);
      throw error;
    }
  },

  async getHistoriqueComplet(materielId) {
    try {
      const mouvements = await this.getByMateriel(materielId);
      
      // Calculer l'évolution du stock
      let stock = 0;
      return mouvements.map(m => {
        stock = m.quantiteApres;
        return {
          ...m,
          stockCourant: stock
        };
      });
    } catch (error) {
      console.error("Erreur getHistoriqueComplet:", error);
      throw error;
    }
  }
};