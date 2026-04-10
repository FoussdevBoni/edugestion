// electron/controllers/evaluationController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { periodeController } from './periodeController.js';
import { niveauScolaireController } from './niveauScolaireController.js';
import { matiereController } from './matiereController.js';
// Fonction utilitaire pour enrichir une évaluation
async function enrichirEvaluation(evaluation) {
  if (!evaluation) return null;
  
  let periode = null;
  let niveauScolaire = null;
  
  if (evaluation.periodeId) {
    periode = await periodeController.getById(evaluation.periodeId);
  }
  
  if (evaluation.niveauScolaireId) {
    niveauScolaire = await niveauScolaireController.getById(evaluation.niveauScolaireId);
  }
  
  return {
    ...evaluation,
    periode: periode?.nom || 'Non définie',
    niveauScolaire: niveauScolaire?.nom || 'Tous les niveaux'
  };
}

export const evaluationController = {
  async getAll() {
    try {
      const db = getDb();
      const evaluations = db.data.evaluations || [];
      
      const evaluationsEnrichies = [];
      for (const evalItem of evaluations) {
        evaluationsEnrichies.push(await enrichirEvaluation(evalItem));
      }
      
      return evaluationsEnrichies;
    } catch (error) {
      console.error("Erreur getAll evaluations:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const db = getDb();
      const evaluation = db.data.evaluations?.find(e => e.id === id) || null;
      return await enrichirEvaluation(evaluation);
    } catch (error) {
      console.error("Erreur getById evaluation:", error);
      throw error;
    }
  },

  async getByPeriode(periodeId) {
    try {
      const db = getDb();
      const evaluations = db.data.evaluations?.filter(e => e.periodeId === periodeId) || [];
      
      const evaluationsEnrichies = [];
      for (const evalItem of evaluations) {
        evaluationsEnrichies.push(await enrichirEvaluation(evalItem));
      }
      
      return evaluationsEnrichies;
    } catch (error) {
      console.error("Erreur getByPeriode evaluation:", error);
      throw error;
    }
  },

  async getByNiveauScolaire(niveauScolaireId) {
    try {
      const db = getDb();
      const evaluations = db.data.evaluations?.filter(e => e.niveauScolaireId === niveauScolaireId) || [];
      
      const evaluationsEnrichies = [];
      for (const evalItem of evaluations) {
        evaluationsEnrichies.push(await enrichirEvaluation(evalItem));
      }
      
      return evaluationsEnrichies;
    } catch (error) {
      console.error("Erreur getByNiveauScolaire evaluation:", error);
      throw error;
    }
  },

  async create(data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      
      // Vérifier que la période existe si fournie
      if (data.periodeId) {
        const periode = await periodeController.getById(data.periodeId);
        if (!periode) {
          throw new Error("Période non trouvée");
        }
      }

      // Vérifier que le niveau scolaire existe si fourni
      if (data.niveauScolaireId) {
        const niveau = await niveauScolaireController.getById(data.niveauScolaireId);
        if (!niveau) {
          throw new Error("Niveau scolaire non trouvé");
        }
      }

      const newItem = {
        id: uuidv4(),
        ...data,
        createdAt: now,
        updatedAt: now
      };

      await db.update((dbData) => {
        if (!dbData.evaluations) dbData.evaluations = [];
        dbData.evaluations.push(newItem);
      });

      return await enrichirEvaluation(newItem);
    } catch (error) {
      console.error("Erreur create evaluation:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      let updatedItem = null;

      await db.update((dbData) => {
        const index = dbData.evaluations?.findIndex(e => e.id === id);
        if (index !== -1) {
          dbData.evaluations[index] = {
            ...dbData.evaluations[index],
            ...data,
            updatedAt: now
          };
          updatedItem = dbData.evaluations[index];
        }
      });

      return await enrichirEvaluation(updatedItem);
    } catch (error) {
      console.error("Erreur update evaluation:", error);
      throw error;
    }
  },

 async delete(id) {
  try {
    const db = getDb();

    // Récupérer les notes liées à cette évaluation
    const notes = db.data.notes?.filter(n => n.evaluationId === id) || [];

    await db.update((dbData) => {
      // Supprimer les notes liées
      dbData.notes = dbData.notes?.filter(n => n.evaluationId !== id) || [];
      
      // Supprimer l'évaluation
      dbData.evaluations = dbData.evaluations?.filter(e => e.id !== id) || [];
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur delete evaluation:", error);
    throw error;
  }
},
  // Ajouter cette méthode
  async getByPeriodeAndMatiere(periodeId, matiereId) {
    try {
      const db = getDb();
      
      // Récupérer la période pour avoir le niveau scolaire
      const periode = await periodeController.getById(periodeId);
      if (!periode) {
        throw new Error("Période non trouvée");
      }

      // Récupérer la matière pour avoir le niveau de classe
      const matiere = await matiereController.getById(matiereId);
      if (!matiere) {
        throw new Error("Matière non trouvée");
      }

      // Récupérer le niveau de classe
      
      // Filtrer les évaluations
      const evaluations = db.data.evaluations?.filter(e => {
        // Soit la période correspond directement
        if (e.periodeId === periodeId) return true;
        
        // Soit c'est une évaluation pour tous les niveaux (pas de période spécifique)
        if (!e.periodeId) {
          // Et le niveau scolaire correspond
          if (e.niveauScolaireId === periode.niveauScolaireId) return true;
          if (!e.niveauScolaireId) return true; // Évaluation pour tous les niveaux
        }
        
        return false;
      }) || [];

      // Enrichir et retourner
      const evaluationsEnrichies = [];
      for (const evalItem of evaluations) {
        evaluationsEnrichies.push(await enrichirEvaluation(evalItem));
      }
      
      return evaluationsEnrichies;
    } catch (error) {
      console.error("Erreur getByPeriodeAndMatiere:", error);
      throw error;
    }
  },
};