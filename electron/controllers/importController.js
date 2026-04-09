// electron/controllers/importController.js
import { getDb } from '../db.js';

export const importController = {
  async importData(data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();

      await db.update((dbData) => {
        // Importer les niveaux scolaires
        if (data.niveauxScolaires && data.niveauxScolaires.length > 0) {
          dbData.niveauxScolaires = data.niveauxScolaires.map(n => ({
            ...n,
            createdAt: now,
            updatedAt: now
          }));
        }

        // Importer les cycles
        if (data.cycles && data.cycles.length > 0) {
          dbData.cycles = data.cycles.map(c => ({
            ...c,
            createdAt: now,
            updatedAt: now
          }));
        }

        // Importer les niveaux classes
        if (data.niveauxClasses && data.niveauxClasses.length > 0) {
          dbData.niveauxClasses = data.niveauxClasses.map(n => ({
            ...n,
            description: n.description || '',
            createdAt: now,
            updatedAt: now
          }));
        }

        // Importer les matières
        if (data.matieres && data.matieres.length > 0) {
          dbData.matieres = data.matieres.map(m => ({
            ...m,
            createdAt: now,
            updatedAt: now
          }));
        }

        // Importer les périodes
        if (data.periodes && data.periodes.length > 0) {
          dbData.periodes = data.periodes.map(p => ({
            ...p,
            createdAt: now,
            updatedAt: now
          }));
        }

        // Importer les évaluations
        if (data.evaluations && data.evaluations.length > 0) {
          dbData.evaluations = data.evaluations.map(e => ({
            ...e,
            createdAt: now,
            updatedAt: now
          }));
        }
      });

      return { success: true, message: "Données importées avec succès" };
    } catch (error) {
      console.error("Erreur import:", error);
      throw error;
    }
  }
};