// electron/controllers/cycleController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { niveauScolaireController } from './niveauScolaireController.js';

// Fonction utilitaire pour enrichir un cycle
async function enrichirCycle(cycle) {
  if (!cycle) return null;
  
  // Récupérer le niveau scolaire à partir de niveauScolaireId
  const niveauScolaire = await niveauScolaireController.getById(cycle.niveauScolaireId);
  
  return {
    ...cycle,
    niveauScolaire: niveauScolaire?.nom || ''
  };
}

export const cycleController = {
  async getAll() {
    try {
      const db = getDb();
      const cycles = db.data.cycles || [];
      
      // Enrichir chaque cycle
      const cyclesEnrichis = [];
      for (const cycle of cycles) {
        cyclesEnrichis.push(await enrichirCycle(cycle));
      }
      
      return cyclesEnrichis;
    } catch (error) {
      console.error("Erreur getAll cycles:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const db = getDb();
      const cycle = db.data.cycles?.find(c => c.id === id) || null;
      return await enrichirCycle(cycle);
    } catch (error) {
      console.error("Erreur getById cycle:", error);
      throw error;
    }
  },

  async getByNiveauScolaire(niveauScolaireId) {
    try {
      const db = getDb();
      const cycles = db.data.cycles?.filter(c => c.niveauScolaireId === niveauScolaireId) || [];
      
      // Enrichir chaque cycle
      const cyclesEnrichis = [];
      for (const cycle of cycles) {
        cyclesEnrichis.push(await enrichirCycle(cycle));
      }
      
      return cyclesEnrichis;
    } catch (error) {
      console.error("Erreur getByNiveauScolaire cycle:", error);
      throw error;
    }
  },

  async create(data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      
      // Vérifier que le niveau scolaire existe
      const niveau = await niveauScolaireController.getById(data.niveauScolaireId);
      if (!niveau) {
        throw new Error("Niveau scolaire non trouvé");
      }

      // Vérifier les champs obligatoires
      if (!data.nom || data.nom.trim() === '') {
        throw new Error("Le champ 'nom' est obligatoire");
      }

      const nomCycle = data.nom.trim();

      // Vérifier si un cycle avec le même nom existe déjà dans le même niveau scolaire
      const existingCycle = db.data.cycles?.find(
        c => c.nom === nomCycle && c.niveauScolaireId === data.niveauScolaireId
      );
      
      if (existingCycle) {
        throw new Error(`Un cycle "${nomCycle}" existe déjà dans ce niveau scolaire`);
      }

      const newItem = {
        id: uuidv4(),
        nom: nomCycle,
        niveauScolaireId: data.niveauScolaireId,
        createdAt: now,
        updatedAt: now
      };

      await db.update((dbData) => {
        if (!dbData.cycles) dbData.cycles = [];
        dbData.cycles.push(newItem);
      });

      return await enrichirCycle(newItem);
    } catch (error) {
      console.error("Erreur create cycle:", error);
      throw error;
    }
  },

  async createManyCycle(cyclesData) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      const createdItems = [];
      const errors = [];

      // Vérifier que les données sont un tableau
      if (!Array.isArray(cyclesData)) {
        throw new Error("Les données doivent être un tableau de cycles");
      }

      // Valider et préparer chaque cycle
      for (let i = 0; i < cyclesData.length; i++) {
        const data = cyclesData[i];
        
        try {
          // Vérifier que le niveau scolaire existe
          const niveau = await niveauScolaireController.getById(data.niveauScolaireId);
          if (!niveau) {
            errors.push({
              index: i,
              data: data,
              error: `Niveau scolaire non trouvé pour niveauScolaireId: ${data.niveauScolaireId}`
            });
            continue;
          }

          // Vérifier les champs obligatoires
          if (!data.nom || data.nom.trim() === '') {
            errors.push({
              index: i,
              data: data,
              error: "Le champ 'nom' est obligatoire"
            });
            continue;
          }

          if (!data.niveauScolaireId) {
            errors.push({
              index: i,
              data: data,
              error: "Le champ 'niveauScolaireId' est obligatoire"
            });
            continue;
          }

          // Nettoyer le nom
          const nomCycle = data.nom.trim();

          // Vérifier si un cycle avec le même nom existe déjà dans la base pour ce niveau scolaire
          const existingCycleInDb = db.data.cycles?.find(
            c => c.nom === nomCycle && c.niveauScolaireId === data.niveauScolaireId
          );
          
          if (existingCycleInDb) {
            errors.push({
              index: i,
              data: data,
              error: `Un cycle "${nomCycle}" existe déjà dans ce niveau scolaire`
            });
            continue;
          }

          // Vérifier les doublons dans la liste en cours de création
          const duplicateInBatch = createdItems.find(
            item => item.nom === nomCycle && item.niveauScolaireId === data.niveauScolaireId
          );
          
          if (duplicateInBatch) {
            errors.push({
              index: i,
              data: data,
              error: `Doublon détecté dans la liste : "${nomCycle}" apparaît plusieurs fois pour le même niveau scolaire`
            });
            continue;
          }

          // Créer l'élément
          const newItem = {
            id: uuidv4(),
            nom: nomCycle,
            niveauScolaireId: data.niveauScolaireId,
            createdAt: now,
            updatedAt: now
          };

          createdItems.push(newItem);
          
        } catch (error) {
          errors.push({
            index: i,
            data: data,
            error: error.message
          });
        }
      }

      // Si aucun élément valide, lever une erreur
      if (createdItems.length === 0 && errors.length > 0) {
        throw new Error(`Aucun cycle valide à créer. Erreurs: ${errors.map(e => e.error).join(', ')}`);
      }

      // Ajouter tous les éléments valides à la base de données
      await db.update((dbData) => {
        if (!dbData.cycles) dbData.cycles = [];
        dbData.cycles.push(...createdItems);
      });

      // Enrichir les éléments créés
      const enrichedItems = [];
      for (const item of createdItems) {
        enrichedItems.push(await enrichirCycle(item));
      }

      // Retourner le résultat avec les succès et les erreurs
      return {
        success: true,
        created: enrichedItems,
        createdCount: enrichedItems.length,
        errors: errors,
        totalAttempted: cyclesData.length
      };
      
    } catch (error) {
      console.error("Erreur createManyCycle:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      let updatedItem = null;

      // Récupérer le cycle existant
      const existingCycle = db.data.cycles?.find(c => c.id === id);
      if (!existingCycle) {
        throw new Error("Cycle non trouvé");
      }

      // Vérifier si on change le nom ou le niveauScolaireId
      const newNom = data.nom ? data.nom.trim() : existingCycle.nom;
      const newNiveauScolaireId = data.niveauScolaireId || existingCycle.niveauScolaireId;

      // Si le nom a changé ou le niveau scolaire a changé, vérifier les doublons
      if (newNom !== existingCycle.nom || newNiveauScolaireId !== existingCycle.niveauScolaireId) {
        // Vérifier si un autre cycle (avec un id différent) a déjà ce nom dans ce niveau scolaire
        const duplicateCycle = db.data.cycles?.find(
          c => c.id !== id && c.nom === newNom && c.niveauScolaireId === newNiveauScolaireId
        );
        
        if (duplicateCycle) {
          throw new Error(`Un cycle "${newNom}" existe déjà dans ce niveau scolaire`);
        }
      }

      // Vérifier que le nouveau niveau scolaire existe (si changé)
      if (data.niveauScolaireId && data.niveauScolaireId !== existingCycle.niveauScolaireId) {
        const niveau = await niveauScolaireController.getById(data.niveauScolaireId);
        if (!niveau) {
          throw new Error("Niveau scolaire non trouvé");
        }
      }

      await db.update((dbData) => {
        const index = dbData.cycles?.findIndex(c => c.id === id);
        if (index !== -1) {
          dbData.cycles[index] = {
            ...dbData.cycles[index],
            nom: newNom,
            niveauScolaireId: newNiveauScolaireId,
            updatedAt: now
          };
          updatedItem = dbData.cycles[index];
        }
      });

      return await enrichirCycle(updatedItem);
    } catch (error) {
      console.error("Erreur update cycle:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const db = getDb();
      
      // Vérifier si le cycle est utilisé par des niveaux de classe
      const niveauxClasseUtilisant = db.data.niveauxClasses?.filter(nc => nc.cycleId === id) || [];
      if (niveauxClasseUtilisant.length > 0) {
        throw new Error("Ce cycle est utilisé par des niveaux de classe. Supprimez d'abord ces niveaux.");
      }

      await db.update((dbData) => {
        dbData.cycles = dbData.cycles?.filter(c => c.id !== id) || [];
      });

      return { success: true };
    } catch (error) {
      console.error("Erreur delete cycle:", error);
      throw error;
    }
  }
};