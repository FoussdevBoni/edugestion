// electron/controllers/matiereController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { niveauClasseController } from './niveauClasseController.js';

// Fonction utilitaire pour enrichir une matière
async function enrichirMatiere(matiere) {
  if (!matiere) return null;

  const niveauClasse = await niveauClasseController.getById(matiere.niveauClasseId);

  return {
    ...matiere,
    niveauClasse: niveauClasse?.nom || '',
    cycle: niveauClasse?.cycle || '',
    niveauScolaire: niveauClasse?.niveauScolaire || ''
  };
}

export const matiereController = {
  async getAll() {
    try {
      const db = getDb();
      const matieres = db.data.matieres || [];

      const matieresEnrichies = [];
      for (const matiere of matieres) {
        matieresEnrichies.push(await enrichirMatiere(matiere));
      }

      return matieresEnrichies;
    } catch (error) {
      console.error("Erreur getAll matieres:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const db = getDb();
      const matiere = db.data.matieres?.find(m => m.id === id) || null;
      return await enrichirMatiere(matiere);
    } catch (error) {
      console.error("Erreur getById matiere:", error);
      throw error;
    }
  },

  async getByNiveauClasse(niveauClasseId) {
    try {
      const db = getDb();
      const matieres = db.data.matieres?.filter(m => m.niveauClasseId === niveauClasseId) || [];

      const matieresEnrichies = [];
      for (const matiere of matieres) {
        matieresEnrichies.push(await enrichirMatiere(matiere));
      }

      return matieresEnrichies;
    } catch (error) {
      console.error("Erreur getByNiveauClasse matiere:", error);
      throw error;
    }
  },

  async create(data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();

      // Vérifier que le niveau de classe existe
      const niveauClasse = await niveauClasseController.getById(data.niveauClasseId);
      if (!niveauClasse) {
        throw new Error("Niveau de classe non trouvé");
      }

      // Vérifier si une matière avec le même nom existe déjà pour ce niveau
      const existing = db.data.matieres?.find(m =>
        m.nom.toLowerCase() === data.nom.toLowerCase() &&
        m.niveauClasseId === data.niveauClasseId
      );
      if (existing) {
        throw new Error("Une matière avec ce nom existe déjà pour ce niveau");
      }

      const newItem = {
        id: uuidv4(),
        ...data,
        coefficient: Number(data.coefficient),
        createdAt: now,
        updatedAt: now
      };

      await db.update((dbData) => {
        if (!dbData.matieres) dbData.matieres = [];
        dbData.matieres.push(newItem);
      });

      return await enrichirMatiere(newItem);
    } catch (error) {
      console.error("Erreur create matiere:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      let updatedItem = null;

      await db.update((dbData) => {
        const index = dbData.matieres?.findIndex(m => m.id === id);
        if (index !== -1) {
          dbData.matieres[index] = {
            ...dbData.matieres[index],
            ...data,
            coefficient: data.coefficient ? Number(data.coefficient) : dbData.matieres[index].coefficient,
            updatedAt: now
          };
          updatedItem = dbData.matieres[index];
        }
      });

      return await enrichirMatiere(updatedItem);
    } catch (error) {
      console.error("Erreur update matiere:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const db = getDb();

      await db.update((dbData) => {
        // Supprimer les notes liées
        dbData.notes = dbData.notes?.filter(n => n.matiereId !== id) || [];

        // Supprimer les séances liées
        dbData.seances = dbData.seances?.filter(s => s.matiereId !== id) || [];

        // Supprimer la matière
        dbData.matieres = dbData.matieres?.filter(m => m.id !== id) || [];
      });

      return { success: true };
    } catch (error) {
      console.error("Erreur delete matiere:", error);
      throw error;
    }
  },

  async deleteMany(ids) {
    try {
      const db = getDb();
      let deletedCount = 0;

      await db.update((dbData) => {
        const initialLength = dbData.matieres?.length || 0;

        // Supprimer les notes liées
        dbData.notes = dbData.notes?.filter(n => !ids.includes(n.matiereId)) || [];

        // Supprimer les séances liées
        dbData.seances = dbData.seances?.filter(s => !ids.includes(s.matiereId)) || [];

        // Supprimer les matières
        dbData.matieres = dbData.matieres?.filter(m => !ids.includes(m.id)) || [];

        deletedCount = initialLength - (dbData.matieres?.length || 0);
      });

      return { success: true, deletedCount };
    } catch (error) {
      console.error("Erreur deleteMany matieres:", error);
      throw error;
    }
  }
};