// electron/controllers/inventaireController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const enrichirData = async (inventaire) => {
    const inventaireData = {
      ...inventaire,
      
    }
}

export const inventaireController = {
  async getAll() {
    try {
      const db = getDb();
      return db.data.inventaires || [];
    } catch (error) {
      console.error("Erreur getAll inventaires:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const db = getDb();
      return db.data.inventaires?.find(i => i.id === id) || null;
    } catch (error) {
      console.error("Erreur getById inventaire:", error);
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
        materiels: data.materiels.map(m => ({
          ...m,
          quantite: Number(m.quantite)
        })),
        createdAt: now,
        updatedAt: now
      };

      await db.update((dbData) => {
        if (!dbData.inventaires) dbData.inventaires = [];
        dbData.inventaires.push(newItem);
      });

      return newItem;
    } catch (error) {
      console.error("Erreur create inventaire:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      let updatedItem = null;

      await db.update((dbData) => {
        const index = dbData.inventaires?.findIndex(i => i.id === id);
        if (index !== -1) {
          dbData.inventaires[index] = {
            ...dbData.inventaires[index],
            ...data,
            materiels: data.materiels ? data.materiels.map(m => ({
              ...m,
              quantite: Number(m.quantite)
            })) : dbData.inventaires[index].materiels,
            updatedAt: now
          };
          updatedItem = dbData.inventaires[index];
        }
      });

      return updatedItem;
    } catch (error) {
      console.error("Erreur update inventaire:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const db = getDb();
      await db.update((dbData) => {
        dbData.inventaires = dbData.inventaires?.filter(i => i.id !== id) || [];
      });
      return { success: true };
    } catch (error) {
      console.error("Erreur delete inventaire:", error);
      throw error;
    }
  }
};