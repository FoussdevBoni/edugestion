// electron/controllers/achatController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { transactionController } from './transactionController.js';
import { materielController } from './materielController.js';

export const achatController = {
  async getAll() {
    try {
      const db = getDb();
      const achats = db.data.achats || [];
      const materiels = db.data.materiels || [];
      const transactions = db.data.transactions || [];

      return achats.map(achat => ({
        ...achat,
        materiel: materiels.find(m => m.id === achat.materielId),
        transaction: transactions.find(t => t.id === achat.transactionId)
      }));
    } catch (error) {
      console.error("Erreur getAll achats:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const db = getDb();
      const achat = db.data.achats?.find(a => a.id === id) || null;

      if (!achat) return null;

      const materiels = db.data.materiels || [];
      const transactions = db.data.transactions || [];

      return {
        ...achat,
        materiel: materiels.find(m => m.id === achat.materielId),
        transaction: transactions.find(t => t.id === achat.transactionId)
      };
    } catch (error) {
      console.error("Erreur getById achat:", error);
      throw error;
    }
  },

  async create(data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();

      // Vérifier que le matériel existe
      const materiel = await materielController.getById(data.materielId);
      if (!materiel) {
        throw new Error("Matériel non trouvé");
      }

      // Calculer le total
      const total = data.quantite * data.prixUnitaire;

      // 1. Créer la transaction (sortie d'argent)
      const transaction = await transactionController.create({
        type: 'sortie',
        montant: total,
        motif: 'Achat matériel',
        description: `Achat de ${data.quantite} ${materiel.nom}`,
        date: data.date,
        modePaiement: data.modePaiement,
        createdBy: data.createdBy,
        metaData: { type: 'achat' }
      });

      // 2. Créer l'achat
      const newAchat = {
        id: uuidv4(),
        ...data,
        quantite: Number(data.quantite),
        prixUnitaire: Number(data.prixUnitaire),
        total: total,
        transactionId: transaction.id,
        createdAt: now,
        updatedAt: now
      };

      await db.update((dbData) => {
        if (!dbData.achats) dbData.achats = [];
        dbData.achats.push(newAchat);
      });

      // 3. Mettre à jour le stock du matériel
      await materielController.updateStock(data.materielId, data.quantite, {
        type: 'entree',
        motif: 'Achat',
        referenceId: newAchat.id,
        referenceType: 'achat',
        createdBy: data.createdBy
      });


      return {
        ...newAchat,
        materiel,
        transaction
      };
    } catch (error) {
      console.error("Erreur create achat:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      let updatedAchat = null;
      let ancienAchat = null;

      await db.update((dbData) => {
        const index = dbData.achats?.findIndex(a => a.id === id);
        if (index !== -1) {
          ancienAchat = { ...dbData.achats[index] }; // Sauvegarder l'ancien

          dbData.achats[index] = {
            ...ancienAchat,
            ...data,
            quantite: data.quantite ? Number(data.quantite) : ancienAchat.quantite,
            prixUnitaire: data.prixUnitaire ? Number(data.prixUnitaire) : ancienAchat.prixUnitaire,
            total: (data.quantite || ancienAchat.quantite) * (data.prixUnitaire || ancienAchat.prixUnitaire),
            updatedAt: now
          };
          updatedAchat = dbData.achats[index];
        }
      });

      // Utiliser ancienAchat et updatedAchat
      if (data.quantite && ancienAchat) {
        const difference = updatedAchat.quantite - ancienAchat.quantite;
        console.log(difference)
        if (difference !== 0) {
          await materielController.updateStock(updatedAchat.materielId, difference, {
            type: difference > 0 ? 'entree' : 'sortie',
            motif: 'Modification achat',
            referenceId: id,
            referenceType: 'achat',
            createdBy: updatedAchat.createdBy
          });
        }
      }

      return updatedAchat;
    } catch (error) {
      console.error("Erreur update achat:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const db = getDb();
      const achat = db.data.achats?.find(a => a.id === id);

      if (!achat) {
        throw new Error("Achat non trouvé");
      }

      // Supprimer d'abord la transaction liée
      if (achat.transactionId) {
        await transactionController.delete(achat.transactionId, { force: true });
      }

      // Annuler l'effet sur le stock
      await materielController.updateStock(achat.materielId, -achat.quantite);

      // Supprimer l'achat
      await db.update((dbData) => {
        dbData.achats = dbData.achats?.filter(a => a.id !== id) || [];
      });

      return { success: true };
    } catch (error) {
      console.error("Erreur delete achat:", error);
      throw error;
    }
  }
};