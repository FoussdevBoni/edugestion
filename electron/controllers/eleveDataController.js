// electron/controllers/eleveDataController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

export const eleveDataController = {
  async getAll() {
    try {
      const db = getDb();
      return db.data.elevesData || [];
    } catch (error) {
      console.error("Erreur getAll elevesData:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const db = getDb();
      return db.data.elevesData?.find(e => e.id === id) || null;
    } catch (error) {
      console.error("Erreur getById eleveData:", error);
      throw error;
    }
  },

  async getByMatricule(matricule) {
    try {
      const db = getDb();
      return db.data.elevesData?.find(e => e.matricule === matricule) || null;
    } catch (error) {
      console.error("Erreur getByMatricule eleveData:", error);
      throw error;
    }
  },

  async create(data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();

      // Générer un matricule unique si non fourni
      if (!data.matricule) {
        const annee = new Date().getFullYear().toString().slice(-2);
        const count = (db.data.elevesData?.length || 0) + 1;
        data.matricule = `EL-${annee}-${count.toString().padStart(4, '0')}`;
      }

      // Vérifier que le matricule est unique
      const existing = db.data.elevesData?.find(e => e.matricule === data.matricule);
      if (existing) {
        throw new Error("Un élève avec ce matricule existe déjà");
      }

      const newItem = {
        id: uuidv4(),
        ...data,
        statut: data.statut || 'actif',
        createdAt: now,
        updatedAt: now
      };

      await db.update((dbData) => {
        if (!dbData.elevesData) dbData.elevesData = [];
        dbData.elevesData.push(newItem);
      });

      return newItem;
    } catch (error) {
      console.error("Erreur create eleveData:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      let updatedItem = null;

      await db.update((dbData) => {
        const index = dbData.elevesData?.findIndex(e => e.id === id);
        if (index !== -1) {
          dbData.elevesData[index] = {
            ...dbData.elevesData[index],
            ...data,
            updatedAt: now
          };
          updatedItem = dbData.elevesData[index];
        }
      });

      return updatedItem;
    } catch (error) {
      console.error("Erreur update eleveData:", error);
      throw error;
    }
  },

 async delete(id) {
  try {
    const db = getDb();

    // Récupérer les inscriptions de l'élève
    const inscriptions = db.data.inscriptions?.filter(i => i.eleveDataId === id) || [];
    const inscriptionIds = inscriptions.map(i => i.id);

    // Récupérer les paiements liés à ces inscriptions
    const paiements = db.data.paiements?.filter(p => inscriptionIds.includes(p.inscriptionId)) || [];

    await db.update((dbData) => {
      // Supprimer les paiements liés
      dbData.paiements = dbData.paiements?.filter(p => !inscriptionIds.includes(p.inscriptionId)) || [];
      
      // Supprimer les inscriptions
      dbData.inscriptions = dbData.inscriptions?.filter(i => i.eleveDataId !== id) || [];
      
      // Supprimer l'élève
      dbData.elevesData = dbData.elevesData?.filter(e => e.id !== id) || [];
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur delete eleveData:", error);
    throw error;
  }
}
};