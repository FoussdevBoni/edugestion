// electron/controllers/enseignantController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { classeController } from './classeController.js';

// Fonction utilitaire pour enrichir un enseignant avec enseignementsData
async function enrichirEnseignant(enseignant) {
  if (!enseignant) return null;

  const db = getDb();

  const enseignementsData = await Promise.all(
    (enseignant.enseignements ?? []).map(async (ens) => {
      const classe = await classeController.getById(ens.classeId);
      const matiere = db.data.matieres?.find(m => m.id === ens.matiereId);

      if (!classe || !matiere) return null;

      return {
        classe: classe.nom,
        niveauClasse: classe.nom,
        cycle: classe.cycle,
        niveauScolaire: classe.niveauScolaire,
        matiere: matiere.nom
      };
    })
  );

  return {
    ...enseignant,
    enseignementsData: enseignementsData.filter(Boolean)
  };
}

// Fonction utilitaire pour vérifier les doublons matière/classe
async function verifierDoublonsMatiereClasse(enseignements, enseignantIdAExclure = null) {
  if (!enseignements?.length) return;

  const db = getDb();
  const tousLesEnseignants = db.data.enseignants || [];

  // Pour chaque enseignement à ajouter/modifier
  for (const nouvelEns of enseignements) {
    const classe = await classeController.getById(nouvelEns.classeId);
    if (!classe) throw new Error(`Classe ${nouvelEns.classeId} non trouvée`);

    const matiere = db.data.matieres?.find(m => m.id === nouvelEns.matiereId);
    if (!matiere) throw new Error(`Matière ${nouvelEns.matiereId} non trouvée`);

    // Vérifier si un autre enseignant enseigne déjà cette matière dans cette classe
    const enseignantExistant = tousLesEnseignants.find(enseignant => {
      // Exclure l'enseignant courant en cas de modification
      if (enseignantIdAExclure && enseignant.id === enseignantIdAExclure) return false;
      
      // Vérifier si l'enseignant a cet enseignement
      return enseignant.enseignements?.some(ens => 
        ens.classeId === nouvelEns.classeId && 
        ens.matiereId === nouvelEns.matiereId
      );
    });

    if (enseignantExistant) {
      const enseignantEnrichi = await enrichirEnseignant(enseignantExistant);
      throw new Error(
        `La matière "${matiere.nom}" est déjà enseignée dans la classe "${classe.nom}" ` +
        `par ${enseignantEnrichi.prenom} ${enseignantEnrichi.nom}`
      );
    }
  }
}

export const enseignantController = {
  async getAll() {
    try {
      const db = getDb();
      const enseignants = db.data.enseignants || [];

      const enseignantsEnrichis = [];
      for (const ens of enseignants) {
        enseignantsEnrichis.push(await enrichirEnseignant(ens));
      }
      return enseignantsEnrichis;
    } catch (error) {
      console.error("Erreur getAll enseignants:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const db = getDb();
      const enseignant = db.data.enseignants?.find(e => e.id === id) || null;
      return await enrichirEnseignant(enseignant);
    } catch (error) {
      console.error("Erreur getById enseignant:", error);
      throw error;
    }
  },

  async getByMatiere(matiereId) {
    try {
      const db = getDb();
      const enseignants = db.data.enseignants?.filter(e =>
        e.enseignements?.some(ens => ens.matiereId === matiereId)
      ) || [];

      const enseignantsEnrichis = [];
      for (const ens of enseignants) {
        enseignantsEnrichis.push(await enrichirEnseignant(ens));
      }

      return enseignantsEnrichis;
    } catch (error) {
      console.error("Erreur getByMatiere enseignant:", error);
      throw error;
    }
  },

  async getByClasse(classeId) {
    try {
      const db = getDb();
      const enseignants = db.data.enseignants?.filter(e =>
        e.enseignements?.some(ens => ens.classeId === classeId)
      ) || [];

      const enseignantsEnrichis = [];
      for (const ens of enseignants) {
        enseignantsEnrichis.push(await enrichirEnseignant(ens));
      }

      return enseignantsEnrichis;
    } catch (error) {
      console.error("Erreur getByClasse enseignant:", error);
      throw error;
    }
  },

  async create(data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();

      const existing = db.data.enseignants?.find(e => e.email === data.email);
      if (existing && data.email !== "") {
        throw new Error("Un enseignant avec cet email existe déjà");
      }

      // Vérifier les doublons matière/classe
      await verifierDoublonsMatiereClasse(data.enseignements);

      const newItem = {
        id: uuidv4(),
        ...data,
        createdAt: now,
        updatedAt: now
      };

      await db.update((dbData) => {
        if (!dbData.enseignants) dbData.enseignants = [];
        dbData.enseignants.push(newItem);
      });

      return await enrichirEnseignant(newItem);
    } catch (error) {
      console.error("Erreur create enseignant:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      let updatedItem = null;

      // Vérifier les doublons matière/classe en excluant l'enseignant actuel
      await verifierDoublonsMatiereClasse(data.enseignements, id);

      await db.update((dbData) => {
        const index = dbData.enseignants?.findIndex(e => e.id === id);
        if (index !== -1) {
          dbData.enseignants[index] = {
            ...dbData.enseignants[index],
            ...data,
            updatedAt: now
          };
          updatedItem = dbData.enseignants[index];
        }
      });

      return await enrichirEnseignant(updatedItem);
    } catch (error) {
      console.error("Erreur update enseignant:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const db = getDb();

      const seancesUtilisant = db.data.seances?.filter(s => s.enseignantId === id) || [];
      if (seancesUtilisant.length > 0) {
        throw new Error("Cet enseignant est utilisé dans l'emploi du temps. Supprimez d'abord ses séances.");
      }

      await db.update((dbData) => {
        dbData.enseignants = dbData.enseignants?.filter(e => e.id !== id) || [];
      });

      return { success: true };
    } catch (error) {
      console.error("Erreur delete enseignant:", error);
      throw error;
    }
  },

  async search(searchTerm) {
    try {
      const db = getDb();
      const term = searchTerm.toLowerCase();

      // Récupérer tous les enseignants enrichis d'abord
      const tousLesEnseignants = await this.getAll();

      // Filtrer par terme de recherche
      const filtres = tousLesEnseignants.filter(ens =>
        ens.nom.toLowerCase().includes(term) ||
        ens.prenom.toLowerCase().includes(term) ||
        ens.email?.toLowerCase().includes(term) ||
        ens.enseignementsData?.some(ed =>
          ed.classe.toLowerCase().includes(term) ||
          ed.matiere.toLowerCase().includes(term)
        )
      );

      return filtres;
    } catch (error) {
      console.error("Erreur search enseignant:", error);
      throw error;
    }
  }
};