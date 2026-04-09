// electron/controllers/materielController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { mouvementStockController } from './mouvementStockController.js';

export const materielController = {
  async getAll() {
    try {
      const db = getDb();
      return db.data.materiels || [];
    } catch (error) {
      console.error("Erreur getAll materiels:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const db = getDb();
      return db.data.materiels?.find(m => m.id === id) || null;
    } catch (error) {
      console.error("Erreur getById materiel:", error);
      throw error;
    }
  },

  async create(data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();

      const newItem = {
        id: uuidv4(),
        ...data,
        quantite: Number(data.quantite) || 0,
        seuilAlerte: Number(data.seuilAlerte) || 10,
        createdAt: now,
        updatedAt: now
      };

      await db.update((dbData) => {
        if (!dbData.materiels) dbData.materiels = [];
        dbData.materiels.push(newItem);
      });

      // Créer un mouvement pour la quantité initiale
      if (newItem.quantite > 0) {
        await mouvementStockController.create({
          materielId: newItem.id,
          quantiteAvant: 0,
          quantiteApres: newItem.quantite,
          difference: newItem.quantite,
          type: 'entree',
          motif: 'Ajout du matériel',
          referenceId: newItem.id,
          referenceType: 'creation',
          createdBy: data.createdBy || 'system',
          notes: `Ajout avec stock initial de ${newItem.quantite} unités`,
          date: now
        });
      }

      return newItem;
    } catch (error) {
      console.error("Erreur create materiel:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      let updatedItem = null;
      let ancienItem = null;

      await db.update((dbData) => {
        const index = dbData.materiels?.findIndex(m => m.id === id);
        if (index !== -1) {
          ancienItem = { ...dbData.materiels[index] };

          dbData.materiels[index] = {
            ...ancienItem,
            ...data,
            quantite: data.quantite !== undefined ? Number(data.quantite) : ancienItem.quantite,
            updatedAt: now
          };
          updatedItem = dbData.materiels[index];
        }
      });

      // Si la quantité a changé, créer un mouvement
      if (data.quantite !== undefined && ancienItem && updatedItem) {
        const difference = updatedItem.quantite - ancienItem.quantite;
        if (difference !== 0) {
          await mouvementStockController.create({
            materielId: id,
            quantiteAvant: ancienItem.quantite,
            quantiteApres: updatedItem.quantite,
            difference,
            type: difference > 0 ? 'correction' : 'correction',
            motif: 'Correction manuelle',
            createdBy: data.updatedBy || 'system',
            date: now
          });
        }
      }

      return updatedItem;
    } catch (error) {
      console.error("Erreur update materiel:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const db = getDb();

      // Vérifier si le matériel est utilisé dans des achats
      const achatsUtilisant = db.data.achats?.filter(a => a.materielId === id) || [];
      if (achatsUtilisant.length > 0) {
        throw new Error("Ce matériel est utilisé dans des achats. Supprimez d'abord les achats.");
      }

      // Vérifier si le matériel est utilisé dans des inventaires
      const inventairesUtilisant = db.data.inventaires?.filter(inv =>
        inv.materiels?.some(m => m.id === id)
      ) || [];
      if (inventairesUtilisant.length > 0) {
        throw new Error("Ce matériel est utilisé dans des inventaires. Supprimez d'abord les inventaires.");
      }

      await db.update((dbData) => {
        dbData.materiels = dbData.materiels?.filter(m => m.id !== id) || [];
      });

      return { success: true };
    } catch (error) {
      console.error("Erreur delete materiel:", error);
      throw error;
    }
  },

  // Mettre à jour le stock
  async updateStock(id, quantite, options = {}) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      let updatedItem = null;
      let ancienneQuantite = 0;

      await db.update((dbData) => {
        const index = dbData.materiels?.findIndex(m => m.id === id);
        if (index !== -1) {
          ancienneQuantite = dbData.materiels[index].quantite;
          dbData.materiels[index].quantite += quantite;
          dbData.materiels[index].updatedAt = now;
          updatedItem = dbData.materiels[index];
        }
      });

      // Enregistrer le mouvement
      if (updatedItem && quantite !== 0) {
        await mouvementStockController.create({
          materielId: id,
          quantiteAvant: ancienneQuantite,
          quantiteApres: updatedItem.quantite,
          difference: quantite,
          type: options.type || (quantite > 0 ? 'entree' : 'sortie'),
          motif: options.motif || 'Ajustement manuel',
          referenceId: options.referenceId,
          referenceType: options.referenceType,
          createdBy: options.createdBy || 'system',
          notes: options.notes,
          date: now
        });
      }

      return updatedItem;
    } catch (error) {
      console.error("Erreur updateStock materiel:", error);
      throw error;
    }
  }
};