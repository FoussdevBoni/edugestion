// electron/controllers/chargeController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { transactionController } from './transactionController.js';

export const chargeController = {
  async getAll() {
    try {
      const db = getDb();
      const charges = db.data.charges || [];
      const transactions = db.data.transactions || [];

      return charges.map(charge => ({
        ...charge,
        transaction: transactions.find(t => t.id === charge.transactionId)
      }));
    } catch (error) {
      console.error("Erreur getAll charges:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const db = getDb();
      const charge = db.data.charges?.find(c => c.id === id) || null;
      
      if (!charge) return null;

      const transactions = db.data.transactions || [];

      return {
        ...charge,
        transaction: transactions.find(t => t.id === charge.transactionId)
      };
    } catch (error) {
      console.error("Erreur getById charge:", error);
      throw error;
    }
  },

  async create(data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();

      // 1. Créer la transaction (sortie d'argent)
      const transaction = await transactionController.create({
        type: 'sortie',
        montant: data.montant,
        motif: data.categorie,
        description: data.libelle,
        date: data.date,
        modePaiement: data.modePaiement,
        createdBy: data.createdBy,
        metaData: { type: 'charge', categorie: data.categorie }
      });

      // 2. Créer la charge
      const newCharge = {
        id: uuidv4(),
        ...data,
        montant: Number(data.montant),
        transactionId: transaction.id,
        createdAt: now,
        updatedAt: now
      };

      await db.update((dbData) => {
        if (!dbData.charges) dbData.charges = [];
        dbData.charges.push(newCharge);
      });

      return {
        ...newCharge,
        transaction
      };
    } catch (error) {
      console.error("Erreur create charge:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      let updatedCharge = null;

      await db.update((dbData) => {
        const index = dbData.charges?.findIndex(c => c.id === id);
        if (index !== -1) {
          dbData.charges[index] = {
            ...dbData.charges[index],
            ...data,
            montant: data.montant ? Number(data.montant) : dbData.charges[index].montant,
            updatedAt: now
          };
          updatedCharge = dbData.charges[index];

          // Mettre à jour la transaction liée
          if (updatedCharge.transactionId) {
            const transactionIndex = dbData.transactions?.findIndex(t => t.id === updatedCharge.transactionId);
            if (transactionIndex !== -1) {
              dbData.transactions[transactionIndex].montant = updatedCharge.montant;
              dbData.transactions[transactionIndex].description = updatedCharge.libelle;
              dbData.transactions[transactionIndex].updatedAt = now;
            }
          }
        }
      });

      return updatedCharge;
    } catch (error) {
      console.error("Erreur update charge:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const db = getDb();
      const charge = db.data.charges?.find(c => c.id === id);

      if (!charge) {
        throw new Error("Charge non trouvée");
      }

      // Supprimer la transaction liée
      if (charge.transactionId) {
        await transactionController.delete(charge.transactionId);
      }

      // Supprimer la charge
      await db.update((dbData) => {
        dbData.charges = dbData.charges?.filter(c => c.id !== id) || [];
      });

      return { success: true };
    } catch (error) {
      console.error("Erreur delete charge:", error);
      throw error;
    }
  }
};