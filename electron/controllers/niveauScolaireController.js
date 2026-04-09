// electron/controllers/niveauScolaireController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

export const niveauScolaireController = {
  async getAll() {
    try {
      const db = getDb();
      return db.data.niveauxScolaires || [];
    } catch (error) {
      console.error("Erreur getAll niveauxScolaires:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const db = getDb();
      return db.data.niveauxScolaires?.find(n => n.id === id) || null;
    } catch (error) {
      console.error("Erreur getById niveauScolaire:", error);
      throw error;
    }
  },

  async create(data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      
      // Vérifier les champs obligatoires
      if (!data.nom || data.nom.trim() === '') {
        throw new Error("Le champ 'nom' est obligatoire");
      }

      const nomNiveauScolaire = data.nom.trim();

      // Vérifier si un niveau scolaire avec le même nom existe déjà
      const existingNiveau = db.data.niveauxScolaires?.find(
        n => n.nom === nomNiveauScolaire
      );
      
      if (existingNiveau) {
        throw new Error(`Un niveau scolaire "${nomNiveauScolaire}" existe déjà`);
      }
      
      const newItem = {
        id: uuidv4(),
        nom: nomNiveauScolaire,
        createdAt: now,
        updatedAt: now
      };

      await db.update((dbData) => {
        if (!dbData.niveauxScolaires) dbData.niveauxScolaires = [];
        dbData.niveauxScolaires.push(newItem);
      });

      return newItem;
    } catch (error) {
      console.error("Erreur create niveauScolaire:", error);
      throw error;
    }
  },

  async createManyNiveauScolaire(niveauxData) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      const createdItems = [];
      const errors = [];

      // Vérifier que les données sont un tableau
      if (!Array.isArray(niveauxData)) {
        throw new Error("Les données doivent être un tableau de niveaux scolaires");
      }

      // Valider et préparer chaque niveau scolaire
      for (let i = 0; i < niveauxData.length; i++) {
        const data = niveauxData[i];
        
        try {
          // Vérifier les champs obligatoires
          if (!data.nom || data.nom.trim() === '') {
            errors.push({
              index: i,
              data: data,
              error: "Le champ 'nom' est obligatoire"
            });
            continue;
          }

          // Nettoyer le nom
          const nomNiveauScolaire = data.nom.trim();

          // Vérifier si un niveau scolaire avec le même nom existe déjà dans la base
          const existingNiveauInDb = db.data.niveauxScolaires?.find(
            n => n.nom === nomNiveauScolaire
          );
          
          if (existingNiveauInDb) {
            errors.push({
              index: i,
              data: data,
              error: `Un niveau scolaire "${nomNiveauScolaire}" existe déjà`
            });
            continue;
          }

          // Vérifier les doublons dans la liste en cours de création
          const duplicateInBatch = createdItems.find(
            item => item.nom === nomNiveauScolaire
          );
          
          if (duplicateInBatch) {
            errors.push({
              index: i,
              data: data,
              error: `Doublon détecté dans la liste : "${nomNiveauScolaire}" apparaît plusieurs fois`
            });
            continue;
          }

          // Créer l'élément
          const newItem = {
            id: uuidv4(),
            nom: nomNiveauScolaire,
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
        throw new Error(`Aucun niveau scolaire valide à créer. Erreurs: ${errors.map(e => e.error).join(', ')}`);
      }

      // Ajouter tous les éléments valides à la base de données
      await db.update((dbData) => {
        if (!dbData.niveauxScolaires) dbData.niveauxScolaires = [];
        dbData.niveauxScolaires.push(...createdItems);
      });

      // Retourner le résultat avec les succès et les erreurs
      return {
        success: true,
        created: createdItems,
        createdCount: createdItems.length,
        errors: errors,
        totalAttempted: niveauxData.length
      };
      
    } catch (error) {
      console.error("Erreur createManyNiveauScolaire:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      let updatedItem = null;

      // Récupérer le niveau existant
      const existingNiveau = db.data.niveauxScolaires?.find(n => n.id === id);
      if (!existingNiveau) {
        throw new Error("Niveau scolaire non trouvé");
      }

      // Vérifier si on change le nom
      const newNom = data.nom ? data.nom.trim() : existingNiveau.nom;

      // Si le nom a changé, vérifier les doublons
      if (newNom !== existingNiveau.nom) {
        // Vérifier si un autre niveau (avec un id différent) a déjà ce nom
        const duplicateNiveau = db.data.niveauxScolaires?.find(
          n => n.id !== id && n.nom === newNom
        );
        
        if (duplicateNiveau) {
          throw new Error(`Un niveau scolaire "${newNom}" existe déjà`);
        }
      }

      await db.update((dbData) => {
        const index = dbData.niveauxScolaires?.findIndex(n => n.id === id);
        if (index !== -1) {
          dbData.niveauxScolaires[index] = {
            ...dbData.niveauxScolaires[index],
            nom: newNom,
            updatedAt: now
          };
          updatedItem = dbData.niveauxScolaires[index];
        }
      });

      return updatedItem;
    } catch (error) {
      console.error("Erreur update niveauScolaire:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const db = getDb();
      
      // Vérifier si le niveau est utilisé par des cycles
      const cyclesUtilisant = db.data.cycles?.filter(c => c.niveauScolaireId === id) || [];
      if (cyclesUtilisant.length > 0) {
        throw new Error("Ce niveau scolaire est utilisé par des cycles. Supprimez d'abord les cycles.");
      }

      await db.update((dbData) => {
        dbData.niveauxScolaires = dbData.niveauxScolaires?.filter(n => n.id !== id) || [];
      });

      return { success: true };
    } catch (error) {
      console.error("Erreur delete niveauScolaire:", error);
      throw error;
    }
  }
};