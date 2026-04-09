// electron/controllers/niveauClasseController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { cycleController } from './cycleController.js';

// Fonction utilitaire pour enrichir un niveauClasse
async function enrichirNiveauClasse(niveauClasse) {
  if (!niveauClasse) return null;
  
  // Récupérer le cycle à partir de cycleId
  const cycle = await cycleController.getById(niveauClasse.cycleId);
  
  return {
    ...niveauClasse,
    cycle: cycle?.nom || '',
    niveauScolaire: cycle?.niveauScolaire || ''
  };
}

export const niveauClasseController = {
  async getAll() {
    try {
      const db = getDb();
      const niveauxClasses = db.data.niveauxClasses || [];
      
      // Enrichir chaque niveauClasse
      const niveauxEnrichis = [];
      for (const nc of niveauxClasses) {
        niveauxEnrichis.push(await enrichirNiveauClasse(nc));
      }
      
      return niveauxEnrichis;
    } catch (error) {
      console.error("Erreur getAll niveauxClasses:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const db = getDb();
      const niveauClasse = db.data.niveauxClasses?.find(n => n.id === id) || null;
      return await enrichirNiveauClasse(niveauClasse);
    } catch (error) {
      console.error("Erreur getById niveauClasse:", error);
      throw error;
    }
  },

  async getByCycle(cycleId) {
    try {
      const db = getDb();
      const niveauxClasses = db.data.niveauxClasses?.filter(n => n.cycleId === cycleId) || [];
      
      // Enrichir chaque niveauClasse
      const niveauxEnrichis = [];
      for (const nc of niveauxClasses) {
        niveauxEnrichis.push(await enrichirNiveauClasse(nc));
      }
      
      return niveauxEnrichis;
    } catch (error) {
      console.error("Erreur getByCycle niveauClasse:", error);
      throw error;
    }
  },

  async create(data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      
      // Vérifier que le cycle existe
      const cycle = await cycleController.getById(data.cycleId);
      if (!cycle) {
        throw new Error("Cycle non trouvé");
      }

      // Vérifier les champs obligatoires
      if (!data.nom || data.nom.trim() === '') {
        throw new Error("Le champ 'nom' est obligatoire");
      }

      const nomNiveau = data.nom.trim();

      // Vérifier si un niveau avec le même nom existe déjà dans le même cycle
      const existingNiveau = db.data.niveauxClasses?.find(
        n => n.nom === nomNiveau && n.cycleId === data.cycleId
      );
      
      if (existingNiveau) {
        throw new Error(`Un niveau de classe "${nomNiveau}" existe déjà dans ce cycle`);
      }

      const newItem = {
        id: uuidv4(),
        nom: nomNiveau,
        cycleId: data.cycleId,
        createdAt: now,
        updatedAt: now
      };

      await db.update((dbData) => {
        if (!dbData.niveauxClasses) dbData.niveauxClasses = [];
        dbData.niveauxClasses.push(newItem);
      });

      return await enrichirNiveauClasse(newItem);
    } catch (error) {
      console.error("Erreur create niveauClasse:", error);
      throw error;
    }
  },

  async createManyNiveauClasse(niveauxData) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      const createdItems = [];
      const errors = [];

      // Vérifier que les données sont un tableau
      if (!Array.isArray(niveauxData)) {
        throw new Error("Les données doivent être un tableau de niveaux de classe");
      }

      // Valider et préparer chaque niveau de classe
      for (let i = 0; i < niveauxData.length; i++) {
        const data = niveauxData[i];
        
        try {
          // Vérifier que le cycle existe
          const cycle = await cycleController.getById(data.cycleId);
          if (!cycle) {
            errors.push({
              index: i,
              data: data,
              error: `Cycle non trouvé pour cycleId: ${data.cycleId}`
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

          if (!data.cycleId) {
            errors.push({
              index: i,
              data: data,
              error: "Le champ 'cycleId' est obligatoire"
            });
            continue;
          }

          // Nettoyer le nom
          const nomNiveau = data.nom.trim();

          // Vérifier si un niveau de classe avec le même nom existe déjà dans la base pour ce cycle
          const existingNiveauInDb = db.data.niveauxClasses?.find(
            n => n.nom === nomNiveau && n.cycleId === data.cycleId
          );
          
          if (existingNiveauInDb) {
            errors.push({
              index: i,
              data: data,
              error: `Un niveau de classe "${nomNiveau}" existe déjà dans ce cycle`
            });
            continue;
          }

          // Vérifier les doublons dans la liste en cours de création
          const duplicateInBatch = createdItems.find(
            item => item.nom === nomNiveau && item.cycleId === data.cycleId
          );
          
          if (duplicateInBatch) {
            errors.push({
              index: i,
              data: data,
              error: `Doublon détecté dans la liste : "${nomNiveau}" apparaît plusieurs fois pour le même cycle`
            });
            continue;
          }

          // Créer l'élément
          const newItem = {
            id: uuidv4(),
            nom: nomNiveau,
            cycleId: data.cycleId,
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
        throw new Error(`Aucun niveau de classe valide à créer. Erreurs: ${errors.map(e => e.error).join(', ')}`);
      }

      // Ajouter tous les éléments valides à la base de données
      await db.update((dbData) => {
        if (!dbData.niveauxClasses) dbData.niveauxClasses = [];
        dbData.niveauxClasses.push(...createdItems);
      });

      // Enrichir les éléments créés
      const enrichedItems = [];
      for (const item of createdItems) {
        enrichedItems.push(await enrichirNiveauClasse(item));
      }

      // Retourner le résultat avec les succès et les erreurs
      return {
        success: true,
        created: enrichedItems,
        createdCount: enrichedItems.length,
        errors: errors,
        totalAttempted: niveauxData.length
      };
      
    } catch (error) {
      console.error("Erreur createManyNiveauClasse:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      let updatedItem = null;

      // Récupérer le niveau existant
      const existingNiveau = db.data.niveauxClasses?.find(n => n.id === id);
      if (!existingNiveau) {
        throw new Error("Niveau de classe non trouvé");
      }

      // Vérifier si on change le nom ou le cycleId
      const newNom = data.nom ? data.nom.trim() : existingNiveau.nom;
      const newCycleId = data.cycleId || existingNiveau.cycleId;

      // Si le nom a changé ou le cycle a changé, vérifier les doublons
      if (newNom !== existingNiveau.nom || newCycleId !== existingNiveau.cycleId) {
        // Vérifier si un autre niveau (avec un id différent) a déjà ce nom dans ce cycle
        const duplicateNiveau = db.data.niveauxClasses?.find(
          n => n.id !== id && n.nom === newNom && n.cycleId === newCycleId
        );
        
        if (duplicateNiveau) {
          throw new Error(`Un niveau de classe "${newNom}" existe déjà dans ce cycle`);
        }
      }

      // Vérifier que le nouveau cycle existe (si changé)
      if (data.cycleId && data.cycleId !== existingNiveau.cycleId) {
        const cycle = await cycleController.getById(data.cycleId);
        if (!cycle) {
          throw new Error("Cycle non trouvé");
        }
      }

      await db.update((dbData) => {
        const index = dbData.niveauxClasses?.findIndex(n => n.id === id);
        if (index !== -1) {
          dbData.niveauxClasses[index] = {
            ...dbData.niveauxClasses[index],
            nom: newNom,
            cycleId: newCycleId,
            updatedAt: now
          };
          updatedItem = dbData.niveauxClasses[index];
        }
      });

      return await enrichirNiveauClasse(updatedItem);
    } catch (error) {
      console.error("Erreur update niveauClasse:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const db = getDb();
      
      // Vérifier si le niveau de classe est utilisé par des classes
      const classesUtilisant = db.data.classes?.filter(c => c.niveauClasseId === id) || [];
      if (classesUtilisant.length > 0) {
        throw new Error("Ce niveau de classe est utilisé par des classes. Supprimez d'abord ces classes.");
      }

      await db.update((dbData) => {
        dbData.niveauxClasses = dbData.niveauxClasses?.filter(n => n.id !== id) || [];
      });

      return { success: true };
    } catch (error) {
      console.error("Erreur delete niveauClasse:", error);
      throw error;
    }
  }
};