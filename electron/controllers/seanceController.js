// electron/controllers/seanceController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { classeController } from './classeController.js';
import { matiereController } from './matiereController.js';
import { enseignantController } from './enseignantController.js';

// Fonction utilitaire pour convertir HH:MM en minutes
function convertirHeureEnMinutes(heureStr) {
  if (!heureStr) return 0;
  const [heures, minutes] = heureStr.split(':').map(Number);
  return heures * 60 + minutes;
}

// Fonction utilitaire pour valider un créneau horaire
function validerCreneauHoraire(heureDebut, heureFin) {
  // Vérifier le format des heures (HH:MM)
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(heureDebut) || !timeRegex.test(heureFin)) {
    throw new Error("Format d'heure invalide. Utilisez HH:MM");
  }

  const debutMinutes = convertirHeureEnMinutes(heureDebut);
  const finMinutes = convertirHeureEnMinutes(heureFin);

  // Vérifier que l'heure de début est différente de l'heure de fin
  if (debutMinutes === finMinutes) {
    throw new Error("L'heure de début et l'heure de fin ne peuvent pas être identiques");
  }

  // Vérifier que l'heure de début est avant l'heure de fin
  if (debutMinutes > finMinutes) {
    throw new Error("L'heure de début doit être antérieure à l'heure de fin");
  }

  // Vérifier la durée minimale (30 minutes minimum)
  const dureeMinutes = finMinutes - debutMinutes;
  if (dureeMinutes < 30) {
    throw new Error("La durée d'une séance doit être d'au moins 30 minutes");
  }

  // Vérifier la durée maximale (3 heures maximum)
  if (dureeMinutes > 180) {
    throw new Error("La durée d'une séance ne peut pas dépasser 3 heures");
  }

  // Vérifier les horaires d'ouverture (entre 7h et 19h)
  if (debutMinutes < 7 * 60 || finMinutes > 19 * 60) {
    throw new Error("Les cours ne peuvent avoir lieu qu'entre 7h00 et 19h00");
  }

  return dureeMinutes;
}

// Fonction utilitaire pour enrichir une séance
async function enrichirSeance(seance) {
  if (!seance) return null;
  
  const classe = await classeController.getById(seance.classeId);
  const matiere = await matiereController.getById(seance.matiereId);
  const enseignant = await enseignantController.getById(seance.enseignantId);

  return {
    ...seance,
    classe: classe?.nom || '',
    niveauClasse: classe?.niveauClasse || '',
    cycle: classe?.cycle || '',
    niveauScolaire: classe?.niveauScolaire || '',
    matiere: matiere?.nom || '',
    enseignant: enseignant ? `${enseignant.prenom} ${enseignant.nom}` : ''
  };
}

export const seanceController = {
  async getAll() {
    try {
      const db = getDb();
      const seances = db.data.seances || [];
      
      const seancesEnrichies = [];
      for (const seance of seances) {
        seancesEnrichies.push(await enrichirSeance(seance));
      }

      
      return seancesEnrichies;
    } catch (error) {
      console.error("Erreur getAll seances:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const db = getDb();
      const seance = db.data.seances?.find(s => s.id === id) || null;
      return await enrichirSeance(seance);
    } catch (error) {
      console.error("Erreur getById seance:", error);
      throw error;
    }
  },

  async getByClasse(classeId) {
    try {
      const db = getDb();
      const seances = db.data.seances?.filter(s => s.classeId === classeId) || [];
      
      const seancesEnrichies = [];
      for (const seance of seances) {
        seancesEnrichies.push(await enrichirSeance(seance));
      }
      
      return seancesEnrichies;
    } catch (error) {
      console.error("Erreur getByClasse seance:", error);
      throw error;
    }
  },

  async getByEnseignant(enseignantId) {
    try {
      const db = getDb();
      const seances = db.data.seances?.filter(s => s.enseignantId === enseignantId) || [];
      
      const seancesEnrichies = [];
      for (const seance of seances) {
        seancesEnrichies.push(await enrichirSeance(seance));
      }
      
      return seancesEnrichies;
    } catch (error) {
      console.error("Erreur getByEnseignant seance:", error);
      throw error;
    }
  },

  async getByJour(jour) {
    try {
      const db = getDb();
      const seances = db.data.seances?.filter(s => s.jour === jour) || [];
      
      const seancesEnrichies = [];
      for (const seance of seances) {
        seancesEnrichies.push(await enrichirSeance(seance));
      }
      
      return seancesEnrichies;
    } catch (error) {
      console.error("Erreur getByJour seance:", error);
      throw error;
    }
  },

  async create(data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();

      // ========== 1. VALIDATIONS DES DONNÉES REQUISES ==========
      if (!data.jour) throw new Error("Le jour est requis");
      if (!data.heureDebut) throw new Error("L'heure de début est requise");
      if (!data.heureFin) throw new Error("L'heure de fin est requise");
      if (!data.classeId) throw new Error("La classe est requise");
      if (!data.matiereId) throw new Error("La matière est requise");
      if (!data.enseignantId) throw new Error("L'enseignant est requis");

      // ========== 2. VALIDATION DE LA COHÉRENCE HORAIRE ==========
      const dureeMinutes = validerCreneauHoraire(data.heureDebut, data.heureFin);
      const heureDebutMinutes = convertirHeureEnMinutes(data.heureDebut);
      const heureFinMinutes = convertirHeureEnMinutes(data.heureFin);

      // ========== 3. VALIDATION DES EXISTENCES ==========
      // Vérifier que la classe existe
      const classe = await classeController.getById(data.classeId);
      if (!classe) throw new Error("Classe non trouvée");

      // Vérifier que la matière existe
      const matiere = await matiereController.getById(data.matiereId);
      if (!matiere) throw new Error("Matière non trouvée");

      // Vérifier que l'enseignant existe
      const enseignant = await enseignantController.getById(data.enseignantId);
      if (!enseignant) throw new Error("Enseignant non trouvé");

      // ========== 4. VALIDATION DES COMPÉTENCES ENSEIGNANT ==========
      const peutEnseigner = enseignant.enseignements?.some(
        e => e.classeId === data.classeId && e.matiereId === data.matiereId
      );

      if (!peutEnseigner) {
        throw new Error("Cet enseignant n'est pas autorisé à enseigner cette matière dans cette classe");
      }

      // ========== 5. VALIDATION DES CHEVAUCHEMENTS POUR LA CLASSE ==========
      const seancesClasse = db.data.seances?.filter(s => 
        s.jour === data.jour &&
        s.classeId === data.classeId
      ) || [];

      const chevauchementClasse = seancesClasse.some(s => {
        const sDebut = convertirHeureEnMinutes(s.heureDebut);
        const sFin = convertirHeureEnMinutes(s.heureFin);
        return (heureDebutMinutes < sFin && heureFinMinutes > sDebut);
      });

      if (chevauchementClasse) {
        throw new Error("Une séance existe déjà sur ce créneau pour cette classe");
      }

      // ========== 6. VALIDATION DES CHEVAUCHEMENTS POUR L'ENSEIGNANT ==========
      const seancesEnseignant = db.data.seances?.filter(s => 
        s.jour === data.jour &&
        s.enseignantId === data.enseignantId
      ) || [];

      const chevauchementEnseignant = seancesEnseignant.some(s => {
        const sDebut = convertirHeureEnMinutes(s.heureDebut);
        const sFin = convertirHeureEnMinutes(s.heureFin);
        return (heureDebutMinutes < sFin && heureFinMinutes > sDebut);
      });

      if (chevauchementEnseignant) {
        throw new Error("L'enseignant a déjà une séance sur ce créneau");
      }

      // ========== 7. VALIDATION DU QUOTA HORAIRE ENSEIGNANT (optionnel) ==========
      const seancesEnseignantSemaine = db.data.seances?.filter(s => 
        s.enseignantId === data.enseignantId
      ) || [];

      const totalHeuresSemaine = seancesEnseignantSemaine.reduce((total, s) => {
        const debut = convertirHeureEnMinutes(s.heureDebut);
        const fin = convertirHeureEnMinutes(s.heureFin);
        return total + (fin - debut) / 60;
      }, 0);

      const dureeNouvelleSeance = dureeMinutes / 60;
      
      // Max 20h par semaine
      if (totalHeuresSemaine + dureeNouvelleSeance > 20) {
        throw new Error("L'enseignant dépasserait son quota hebdomadaire de 20 heures");
      }

      // ========== 8. CRÉATION DE LA SÉANCE ==========
      const newItem = {
        id: uuidv4(),
        ...data,
        duree: dureeMinutes,
        anneeScolaire: data.anneeScolaire || new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
        createdAt: now,
        updatedAt: now
      };

      await db.update((dbData) => {
        if (!dbData.seances) dbData.seances = [];
        dbData.seances.push(newItem);
      });

      return await enrichirSeance(newItem);
    } catch (error) {
      console.error("Erreur create seance:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      let updatedItem = null;

      // Récupérer la séance existante
      const seanceExistante = db.data.seances?.find(s => s.id === id);
      if (!seanceExistante) throw new Error("Séance non trouvée");

      // Fusionner les données existantes avec les nouvelles
      const nouvelleSeance = { ...seanceExistante, ...data };

      // ========== 1. VALIDATION DE LA COHÉRENCE HORAIRE ==========
      const heureDebut = nouvelleSeance.heureDebut;
      const heureFin = nouvelleSeance.heureFin;
      const dureeMinutes = validerCreneauHoraire(heureDebut, heureFin);
      const heureDebutMinutes = convertirHeureEnMinutes(heureDebut);
      const heureFinMinutes = convertirHeureEnMinutes(heureFin);

      // ========== 2. VALIDATION DES EXISTENCES (si modifiées) ==========
      // Vérifier que la classe existe
      if (data.classeId) {
        const classe = await classeController.getById(data.classeId);
        if (!classe) throw new Error("Classe non trouvée");
      }

      // Vérifier que la matière existe
      if (data.matiereId) {
        const matiere = await matiereController.getById(data.matiereId);
        if (!matiere) throw new Error("Matière non trouvée");
      }

      // Vérifier que l'enseignant existe
      if (data.enseignantId) {
        const enseignant = await enseignantController.getById(data.enseignantId);
        if (!enseignant) throw new Error("Enseignant non trouvé");
      }

      // ========== 3. VALIDATION DES COMPÉTENCES ENSEIGNANT ==========
      const enseignantPourValidation = data.enseignantId 
        ? await enseignantController.getById(data.enseignantId)
        : await enseignantController.getById(seanceExistante.enseignantId);

      const classeId = data.classeId || seanceExistante.classeId;
      const matiereId = data.matiereId || seanceExistante.matiereId;

      const peutEnseigner = enseignantPourValidation.enseignements?.some(
        e => e.classeId === classeId && e.matiereId === matiereId
      );

      if (!peutEnseigner) {
        throw new Error("Cet enseignant n'est pas autorisé à enseigner cette matière dans cette classe");
      }

      // ========== 4. VALIDATION DES CHEVAUCHEMENTS POUR LA CLASSE ==========
      const seancesClasse = db.data.seances?.filter(s => 
        s.id !== id &&
        s.jour === nouvelleSeance.jour &&
        s.classeId === (data.classeId || seanceExistante.classeId)
      ) || [];

      const chevauchementClasse = seancesClasse.some(s => {
        const sDebut = convertirHeureEnMinutes(s.heureDebut);
        const sFin = convertirHeureEnMinutes(s.heureFin);
        return (heureDebutMinutes < sFin && heureFinMinutes > sDebut);
      });

      if (chevauchementClasse) {
        throw new Error("Une séance existe déjà sur ce créneau pour cette classe");
      }

      // ========== 5. VALIDATION DES CHEVAUCHEMENTS POUR L'ENSEIGNANT ==========
      const seancesEnseignant = db.data.seances?.filter(s => 
        s.id !== id &&
        s.jour === nouvelleSeance.jour &&
        s.enseignantId === (data.enseignantId || seanceExistante.enseignantId)
      ) || [];

      const chevauchementEnseignant = seancesEnseignant.some(s => {
        const sDebut = convertirHeureEnMinutes(s.heureDebut);
        const sFin = convertirHeureEnMinutes(s.heureFin);
        return (heureDebutMinutes < sFin && heureFinMinutes > sDebut);
      });

      if (chevauchementEnseignant) {
        throw new Error("L'enseignant a déjà une séance sur ce créneau");
      }

      // ========== 6. VALIDATION DU QUOTA HORAIRE ENSEIGNANT ==========
      const seancesEnseignantSemaine = db.data.seances?.filter(s => 
        s.id !== id &&
        s.enseignantId === (data.enseignantId || seanceExistante.enseignantId)
      ) || [];

      const totalHeuresSemaine = seancesEnseignantSemaine.reduce((total, s) => {
        const debut = convertirHeureEnMinutes(s.heureDebut);
        const fin = convertirHeureEnMinutes(s.heureFin);
        return total + (fin - debut) / 60;
      }, 0);

      const dureeNouvelleSeance = dureeMinutes / 60;
      
      // Max 20h par semaine
      if (totalHeuresSemaine + dureeNouvelleSeance > 20) {
        throw new Error("L'enseignant dépasserait son quota hebdomadaire de 20 heures");
      }

      // ========== 7. MISE À JOUR ==========
      await db.update((dbData) => {
        const index = dbData.seances?.findIndex(s => s.id === id);
        if (index !== -1) {
          dbData.seances[index] = {
            ...dbData.seances[index],
            ...data,
            duree: dureeMinutes,
            updatedAt: now
          };
          updatedItem = dbData.seances[index];
        }
      });

      return await enrichirSeance(updatedItem);
    } catch (error) {
      console.error("Erreur update seance:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const db = getDb();
      await db.update((dbData) => {
        dbData.seances = dbData.seances?.filter(s => s.id !== id) || [];
      });
      return { success: true };
    } catch (error) {
      console.error("Erreur delete seance:", error);
      throw error;
    }
  }
};