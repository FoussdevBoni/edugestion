// electron/controllers/classeController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { niveauClasseController } from './niveauClasseController.js';
import { inscriptionController } from './inscriptionController.js';

// Fonction utilitaire pour enrichir une classe
async function enrichirClasse(classe) {
  if (!classe) return null;

  // Récupérer le niveauClasse à partir de niveauClasseId
  const niveauClasse = await niveauClasseController.getById(classe.niveauClasseId);

  // Récupérer les inscriptions ACTIVES de la classe
  const inscriptions = await inscriptionController.getByClasse(classe.id);
  const inscriptionsActives = inscriptions.filter(inscription => inscription.isActive === true);

  // Calculer les effectifs inscrits (uniquement actifs)
  let effectifFInscrits = 0;
  let effectifMInscrits = 0;

  for (const inscription of inscriptionsActives) {
    if (inscription.eleve?.sexe === 'F') {
      effectifFInscrits++;
    } else if (inscription.eleve?.sexe === 'M') {
      effectifMInscrits++;
    }
  }

  const effectifTotalPapier = (classe.effectifF || 0) + (classe.effectifM || 0);
  return {
    ...classe,
    niveauClasse: niveauClasse?.nom || '',
    cycle: niveauClasse?.cycle || '',
    niveauScolaire: niveauClasse?.niveauScolaire || '',
    effectifTotal: effectifTotalPapier,
    effectifFInscrits: effectifFInscrits,
    effectifMInscrits: effectifMInscrits,
    effectifTotalInscrits: inscriptionsActives.length
  };
}

export const classeController = {
  async getAll() {
    try {
      const db = getDb();
      const classes = db.data.classes || [];

      // Enrichir chaque classe
      const classesEnrichies = [];
      for (const classe of classes) {
        classesEnrichies.push(await enrichirClasse(classe));
      }

      return classesEnrichies;
    } catch (error) {
      console.error("Erreur getAll classes:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const db = getDb();
      const classe = db.data.classes?.find(c => c.id === id) || null;
      return await enrichirClasse(classe);
    } catch (error) {
      console.error("Erreur getById classe:", error);
      throw error;
    }
  },

  async getByNiveauClasse(niveauClasseId) {
    try {
      const db = getDb();
      const classes = db.data.classes?.filter(c => c.niveauClasseId === niveauClasseId) || [];

      // Enrichir chaque classe
      const classesEnrichies = [];
      for (const classe of classes) {
        classesEnrichies.push(await enrichirClasse(classe));
      }

      return classesEnrichies;
    } catch (error) {
      console.error("Erreur getByNiveauClasse classe:", error);
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

      // Vérifier les champs obligatoires
      if (!data.nom || data.nom.trim() === '') {
        throw new Error("Le champ 'nom' est obligatoire");
      }

      const nomClasse = data.nom.trim();

      // Vérifier si une classe avec le même nom existe déjà dans ce niveau
      const existingClasse = db.data.classes?.find(
        c => c.nom === nomClasse && c.niveauClasseId === data.niveauClasseId
      );

      if (existingClasse) {
        throw new Error(`Une classe "${nomClasse}" existe déjà dans ce niveau`);
      }

      const newItem = {
        id: uuidv4(),
        nom: nomClasse,
        niveauClasseId: data.niveauClasseId,
        effectifF: data.effectifF || 0,
        effectifM: data.effectifM || 0,
        createdAt: now,
        updatedAt: now
      };

      await db.update((dbData) => {
        if (!dbData.classes) dbData.classes = [];
        dbData.classes.push(newItem);
      });

      return await enrichirClasse(newItem);
    } catch (error) {
      console.error("Erreur create classe:", error);
      throw error;
    }
  },

  async createManyClasse(classesData) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      const createdItems = [];
      const errors = [];

      // Vérifier que les données sont un tableau
      if (!Array.isArray(classesData)) {
        throw new Error("Les données doivent être un tableau de classes");
      }

      // Valider et préparer chaque classe
      for (let i = 0; i < classesData.length; i++) {
        const data = classesData[i];

        try {
          // Vérifier que le niveau de classe existe
          const niveauClasse = await niveauClasseController.getById(data.niveauClasseId);
          if (!niveauClasse) {
            errors.push({
              index: i,
              data: data,
              error: `Niveau de classe non trouvé pour niveauClasseId: ${data.niveauClasseId}`
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

          if (!data.niveauClasseId) {
            errors.push({
              index: i,
              data: data,
              error: "Le champ 'niveauClasseId' est obligatoire"
            });
            continue;
          }

          // Nettoyer le nom (trim)
          const nomClasse = data.nom.trim();

          // Vérifier si une classe avec le même nom existe déjà dans la base de données pour ce niveau
          const existingClasseInDb = db.data.classes?.find(
            c => c.nom === nomClasse && c.niveauClasseId === data.niveauClasseId
          );

          if (existingClasseInDb) {
            errors.push({
              index: i,
              data: data,
              error: `Une classe "${nomClasse}" existe déjà dans ce niveau`
            });
            continue;
          }

          // Vérifier les doublons dans la liste en cours de création (même niveau)
          const duplicateInBatch = createdItems.find(
            item => item.nom === nomClasse && item.niveauClasseId === data.niveauClasseId
          );

          if (duplicateInBatch) {
            errors.push({
              index: i,
              data: data,
              error: `Doublon détecté dans la liste : "${nomClasse}" apparaît plusieurs fois pour le même niveau`
            });
            continue;
          }

          // Créer l'élément
          const newItem = {
            id: uuidv4(),
            nom: nomClasse,
            niveauClasseId: data.niveauClasseId,
            effectifF: data.effectifF || 0,
            effectifM: data.effectifM || 0,
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
        throw new Error(`Aucune classe valide à créer. Erreurs: ${errors.map(e => e.error).join(', ')}`);
      }

      // Ajouter tous les éléments valides à la base de données
      await db.update((dbData) => {
        if (!dbData.classes) dbData.classes = [];
        dbData.classes.push(...createdItems);
      });

      // Enrichir les éléments créés
      const enrichedItems = [];
      for (const item of createdItems) {
        enrichedItems.push(await enrichirClasse(item));
      }

      // Retourner le résultat avec les succès et les erreurs
      return {
        success: true,
        created: enrichedItems,
        createdCount: enrichedItems.length,
        errors: errors,
        totalAttempted: classesData.length
      };

    } catch (error) {
      console.error("Erreur createManyClasse:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      let updatedItem = null;

      // Récupérer la classe existante
      const existingClass = db.data.classes?.find(c => c.id === id);
      if (!existingClass) {
        throw new Error("Classe non trouvée");
      }

      // Vérifier si on change le nom ou le niveauClasseId
      const newNom = data.nom ? data.nom.trim() : existingClass.nom;
      const newNiveauClasseId = data.niveauClasseId || existingClass.niveauClasseId;
      const newEffectifF = data.effectifF !== undefined ? data.effectifF : existingClass.effectifF;
      const newEffectifM = data.effectifM !== undefined ? data.effectifM : existingClass.effectifM;

      // Si le nom a changé ou le niveau a changé, vérifier les doublons
      if (newNom !== existingClass.nom || newNiveauClasseId !== existingClass.niveauClasseId) {
        // Vérifier si une autre classe (avec un id différent) a déjà ce nom dans ce niveau
        const duplicateClass = db.data.classes?.find(
          c => c.id !== id && c.nom === newNom && c.niveauClasseId === newNiveauClasseId
        );

        if (duplicateClass) {
          throw new Error(`Une classe "${newNom}" existe déjà dans ce niveau`);
        }
      }

      // Vérifier que le nouveau niveau de classe existe (si changé)
      if (data.niveauClasseId && data.niveauClasseId !== existingClass.niveauClasseId) {
        const niveauClasse = await niveauClasseController.getById(data.niveauClasseId);
        if (!niveauClasse) {
          throw new Error("Niveau de classe non trouvé");
        }
      }

      await db.update((dbData) => {
        const index = dbData.classes?.findIndex(c => c.id === id);
        if (index !== -1) {
          dbData.classes[index] = {
            ...dbData.classes[index],
            nom: newNom,
            niveauClasseId: newNiveauClasseId,
            effectifF: newEffectifF,
            effectifM: newEffectifM,
            updatedAt: now
          };
          updatedItem = dbData.classes[index];
        }
      });

      return await enrichirClasse(updatedItem);
    } catch (error) {
      console.error("Erreur update classe:", error);
      throw error;
    }
  },

  // electron/controllers/classeController.js

  async deleteMany(ids) {
    try {
      const db = getDb();
      let deletedCount = 0;

      await db.update((dbData) => {
        const initialLength = dbData.classes?.length || 0;

        // Supprimer les inscriptions liées
        dbData.inscriptions = dbData.inscriptions?.filter(i => !ids.includes(i.classeId)) || [];

        // Supprimer les séances liées
        dbData.seances = dbData.seances?.filter(s => !ids.includes(s.classeId)) || [];

        // Supprimer les classes
        dbData.classes = dbData.classes?.filter(c => !ids.includes(c.id)) || [];

        deletedCount = initialLength - (dbData.classes?.length || 0);
      });

      return { success: true, deletedCount };
    } catch (error) {
      console.error("Erreur deleteMany classes:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const db = getDb();

      await db.update((dbData) => {
        // Supprimer les inscriptions liées
        dbData.inscriptions = dbData.inscriptions?.filter(i => i.classeId !== id) || [];

        // Supprimer les séances liées
        dbData.seances = dbData.seances?.filter(s => s.classeId !== id) || [];

        // Supprimer la classe
        dbData.classes = dbData.classes?.filter(c => c.id !== id) || [];
      });

      return { success: true };
    } catch (error) {
      console.error("Erreur delete classe:", error);
      throw error;
    }
  },
};