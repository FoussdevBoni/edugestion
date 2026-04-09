// electron/controllers/transactionController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

export const transactionController = {
  async getAll() {
    try {
      const db = getDb();
      return db.data.transactions || [];
    } catch (error) {
      console.error("Erreur getAll transactions:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const db = getDb();
      return db.data.transactions?.find(t => t.id === id) || null;
    } catch (error) {
      console.error("Erreur getById transaction:", error);
      throw error;
    }
  },

  async getByType(type) {
    try {
      const db = getDb();
      return db.data.transactions?.filter(t => t.type === type) || [];
    } catch (error) {
      console.error("Erreur getByType transaction:", error);
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
        montant: Number(data.montant),
        createdAt: now,
        updatedAt: now
      };

      await db.update((dbData) => {
        if (!dbData.transactions) dbData.transactions = [];
        dbData.transactions.push(newItem);
      });

      return newItem;
    } catch (error) {
      console.error("Erreur create transaction:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      let updatedItem = null;

      await db.update((dbData) => {
        const index = dbData.transactions?.findIndex(t => t.id === id);
        if (index !== -1) {
          dbData.transactions[index] = {
            ...dbData.transactions[index],
            ...data,
            montant: data.montant ? Number(data.montant) : dbData.transactions[index].montant,
            updatedAt: now
          };
          updatedItem = dbData.transactions[index];
        }
      });

      return updatedItem;
    } catch (error) {
      console.error("Erreur update transaction:", error);
      throw error;
    }
  },

  async delete(id, options = {}) {
    try {
      const db = getDb();
      const { force = false } = options; // Option force pour les suppressions en cascade

      // Si force = true, on supprime sans vérifier
      if (!force) {
        // Vérifier si la transaction est liée à un achat
        const achatLie = db.data.achats?.find(a => a.transactionId === id);
        if (achatLie) {
          throw new Error("Cette transaction est liée à un achat. Supprimez d'abord l'achat.");
        }

        // Vérifier si la transaction est liée à une charge
        const chargeLiee = db.data.charges?.find(c => c.transactionId === id);
        if (chargeLiee) {
          throw new Error("Cette transaction est liée à une charge. Supprimez d'abord la charge.");
        }

        // Vérifier si la transaction est liée à un paiement
        const paiementLie = db.data.paiements?.find(p => p.transactionId === id);
        if (paiementLie) {
          throw new Error("Cette transaction est liée à un paiement. Supprimez d'abord le paiement.");
        }
      }

      await db.update((dbData) => {
        dbData.transactions = dbData.transactions?.filter(t => t.id !== id) || [];
      });

      return { success: true };
    } catch (error) {
      console.error("Erreur delete transaction:", error);
      throw error;
    }
  }
};