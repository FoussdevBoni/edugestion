// electron/controllers/periodeController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { niveauScolaireController } from './niveauScolaireController.js';

// Fonction utilitaire pour enrichir une période
async function enrichirPeriode(periode) {
  if (!periode) return null;
  
  let niveauScolaire = null;
  if (periode.niveauScolaireId) {
    niveauScolaire = await niveauScolaireController.getById(periode.niveauScolaireId);
  }
  
  return {
    ...periode,
    niveauScolaire: niveauScolaire?.nom || 'Tous les niveaux'
  };
}

export const periodeController = {
  async getAll() {
    try {
      const db = getDb();
      const periodes = db.data.periodes || [];
      
      const periodesEnrichies = [];
      for (const periode of periodes) {
        periodesEnrichies.push(await enrichirPeriode(periode));
      }
      
      return periodesEnrichies;
    } catch (error) {
      console.error("Erreur getAll periodes:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const db = getDb();
      const periode = db.data.periodes?.find(p => p.id === id) || null;
      return await enrichirPeriode(periode);
    } catch (error) {
      console.error("Erreur getById periode:", error);
      throw error;
    }
  },

  async getByNiveauScolaire(niveauScolaireId) {
    try {
      const db = getDb();
      const periodes = db.data.periodes?.filter(p => p.niveauScolaireId === niveauScolaireId) || [];
      
      const periodesEnrichies = [];
      for (const periode of periodes) {
        periodesEnrichies.push(await enrichirPeriode(periode));
      }
      
      return periodesEnrichies;
    } catch (error) {
      console.error("Erreur getByNiveauScolaire periode:", error);
      throw error;
    }
  },

  async getByAnneeScolaire(anneeScolaire) {
    try {
      const db = getDb();
      // Filtrer les périodes dont l'année correspond
      const periodes = db.data.periodes?.filter(p => {
        const anneeDebut = p.dateDebut.substring(0, 4);
        const anneeFin = p.dateFin.substring(0, 4);
        return anneeScolaire.includes(anneeDebut) || anneeScolaire.includes(anneeFin);
      }) || [];
      
      const periodesEnrichies = [];
      for (const periode of periodes) {
        periodesEnrichies.push(await enrichirPeriode(periode));
      }
      
      return periodesEnrichies;
    } catch (error) {
      console.error("Erreur getByAnneeScolaire periode:", error);
      throw error;
    }
  },

  async create(data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      
      // Vérifier que le niveau scolaire existe si fourni
      if (data.niveauScolaireId) {
        const niveau = await niveauScolaireController.getById(data.niveauScolaireId);
        if (!niveau) {
          throw new Error("Niveau scolaire non trouvé");
        }
      }

      // Vérifier l'ordre unique pour un même niveau
      const existing = db.data.periodes?.find(p => 
        p.ordre === data.ordre && 
        p.niveauScolaireId === data.niveauScolaireId
      );
      if (existing) {
        throw new Error("Une période avec cet ordre existe déjà pour ce niveau");
      }

      // Vérifier que dateDebut < dateFin
      if (new Date(data.dateDebut) >= new Date(data.dateFin)) {
        throw new Error("La date de début doit être antérieure à la date de fin");
      }

      const newItem = {
        id: uuidv4(),
        ...data,
        ordre: Number(data.ordre),
        createdAt: now,
        updatedAt: now
      };

      await db.update((dbData) => {
        if (!dbData.periodes) dbData.periodes = [];
        dbData.periodes.push(newItem);
      });

      return await enrichirPeriode(newItem);
    } catch (error) {
      console.error("Erreur create periode:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      let updatedItem = null;

      await db.update((dbData) => {
        const index = dbData.periodes?.findIndex(p => p.id === id);
        if (index !== -1) {
          // Vérifier les dates si elles sont modifiées
          const dateDebut = data.dateDebut || dbData.periodes[index].dateDebut;
          const dateFin = data.dateFin || dbData.periodes[index].dateFin;
          
          if (new Date(dateDebut) >= new Date(dateFin)) {
            throw new Error("La date de début doit être antérieure à la date de fin");
          }

          dbData.periodes[index] = {
            ...dbData.periodes[index],
            ...data,
            ordre: data.ordre ? Number(data.ordre) : dbData.periodes[index].ordre,
            updatedAt: now
          };
          updatedItem = dbData.periodes[index];
        }
      });

      return await enrichirPeriode(updatedItem);
    } catch (error) {
      console.error("Erreur update periode:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const db = getDb();
      
      // Vérifier si la période est utilisée par des évaluations
      const evaluationsUtilisant = db.data.evaluations?.filter(e => e.periodeId === id) || [];
      if (evaluationsUtilisant.length > 0) {
        throw new Error("Cette période est utilisée par des évaluations. Supprimez d'abord les évaluations.");
      }

      // Vérifier si la période est utilisée par des notes
      const notesUtilisant = db.data.notes?.filter(n => n.periodeId === id) || [];
      if (notesUtilisant.length > 0) {
        throw new Error("Cette période est utilisée par des notes. Supprimez d'abord les notes.");
      }

      await db.update((dbData) => {
        dbData.periodes = dbData.periodes?.filter(p => p.id !== id) || [];
      });

      return { success: true };
    } catch (error) {
      console.error("Erreur delete periode:", error);
      throw error;
    }
  }
};