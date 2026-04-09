// electron/controllers/bulletinController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { inscriptionController } from './inscriptionController.js';
import { periodeController } from './periodeController.js';
import {
  BULLETIN_STATUS,
  calculerEffectifClasse,
  calculerMoyennes,

  mettreAJourTousLesRangs,
  enrichirBulletin,
  calculerRecapitulatifAnnuel
} from '../helpers/bulletinHelpers.js';

export const bulletinController = {
  /**
   * Récupère tous les bulletins
   */
  async getAll() {
    try {
      const db = getDb();
      const bulletins = db.data.bulletins || [];
      return await Promise.all(bulletins.map(b => enrichirBulletin(b)));
    } catch (error) {
      console.error("[bulletinController.getAll] Erreur:", error);
      throw error;
    }
  },

  /**
   * Récupère un bulletin par son ID
   */
  async getById(id) {
    try {
      const db = getDb();
      const bulletin = db.data.bulletins?.find(b => b.id === id) || null;
      return await enrichirBulletin(bulletin);
    } catch (error) {
      console.error(`[bulletinController.getById] Erreur:`, error);
      throw error;
    }
  },

  /**
   * Récupère tous les bulletins d'une période
   */
  async getByPeriode(periodeId) {
    try {
      const db = getDb();
      const bulletins = db.data.bulletins?.filter(b => b.periodeId === periodeId) || [];
      return await Promise.all(bulletins.map(b => enrichirBulletin(b)));
    } catch (error) {
      console.error(`[bulletinController.getByPeriode] Erreur:`, error);
      throw error;
    }
  },

  /**
   * Récupère les bulletins d'une classe pour une période
   */
  async getByClasseAndPeriode(classeId, periodeId) {
    try {
      const db = getDb();
      const inscriptions = await inscriptionController.getByClasse(classeId);
      const inscriptionIds = new Set(inscriptions.map(ins => ins.id));

      const bulletins = db.data.bulletins?.filter(b =>
        b.periodeId === periodeId && inscriptionIds.has(b.inscriptionId)
      ) || [];

      return await Promise.all(bulletins.map(b => enrichirBulletin(b)));
    } catch (error) {
      console.error(`[bulletinController.getByClasseAndPeriode] Erreur:`, error);
      throw error;
    }
  },

  /**
   * Récupère un bulletin par période et inscription
   */
  async getByPeriodeAndInscription(data) {
    try {
      const { periodeId, inscriptionId } = data;

      const db = getDb();
      const bulletin = db.data.bulletins?.find(b =>
        b.periodeId === periodeId && b.inscriptionId === inscriptionId
      ) || null;
      return await enrichirBulletin(bulletin);
    } catch (error) {
      console.error(`[bulletinController.getByPeriodeAndInscription] Erreur:`, error);
      throw error;
    }
  },

  /**
   * Crée des bulletins en masse
   */

  // Méthode privée pour créer un bulletin (logique commune)
  async _createBulletin(inscriptionId, periodeId, now, db) {
    const inscription = await inscriptionController.getById(inscriptionId);
    if (!inscription) {
      throw new Error("Inscription non trouvée");
    }

    // Vérifier si le bulletin existe déjà
    const existe = db.data.bulletins?.some(b =>
      b.inscriptionId === inscriptionId && b.periodeId === periodeId
    );

    if (existe) {
      return {
        bulletin: existe,
        inscription,
        success: true
      };
    }

    const newBulletin = {
      id: uuidv4(),
      inscriptionId: inscriptionId,
      periodeId: periodeId,
      classeId: inscription.classeId,
      classe: inscription.classe,
      status: BULLETIN_STATUS.BROUILLON,
      moyennesParMatiere: [],
      resultatFinal: null,
      infosDeClasse: { effectif: 0 },
      vieScolaire: { absences: 0, retards: 0, conduite: null },
      commentaires: { decisionConseil: "", observations: "" },
      notesManquantes: [],
      createdAt: now,
      updatedAt: now
    };

    await db.update((dbData) => {
      if (!dbData.bulletins) dbData.bulletins = [];
      dbData.bulletins.push(newBulletin);
    });

    return {
      bulletin: newBulletin,
      inscription,
      success: true
    };
  },

  async createUnique(data) {
    try {
      const { periodeId, inscriptionId } = data;
      const now = new Date().toISOString();
      const db = getDb();

      // Vérifier la période
      const periode = await periodeController.getById(periodeId);
      if (!periode) {
        throw new Error("Période non trouvée");
      }

      const result = await this._createBulletin(inscriptionId, periodeId, now, db);

      // Retourner le bulletin enrichi
      return await enrichirBulletin(result.bulletin);

    } catch (error) {
      console.error(`[bulletinController.createUnique] Erreur:`, error);
      throw error;
    }
  },

  async createMultiple(data) {
    try {
      const { periodeId, inscriptionIds } = data;
      const now = new Date().toISOString();
      const results = { success: [], errors: [] };
      const db = getDb();

      // Vérifier la période
      const periode = await periodeController.getById(periodeId);
      if (!periode) {
        throw new Error("Période non trouvée");
      }

      for (const inscriptionId of inscriptionIds) {
        try {
          const result = await this._createBulletin(inscriptionId, periodeId, now, db);

          results.success.push({
            inscriptionId,
            eleve: `${result.inscription.prenom} ${result.inscription.nom}`,
            bulletin: await enrichirBulletin(result.bulletin)
          });
        } catch (error) {
          results.errors.push({
            inscriptionId,
            error: error.message
          });
        }
      }

      return results;
    } catch (error) {
      console.error(`[bulletinController.createMultiple] Erreur:`, error);
      throw error;
    }
  },
  /**
   * Génère des bulletins en masse - VERSION OPTIMISÉE
   */
  async generateMultiple(data) {
    try {
      const { periodeId, bulletinIds, config } = data;
      const results = { success: [], errors: [] };
      const db = getDb();

      // Récupérer tous les bulletins en une fois
      const bulletins = [];
      let classeId = null;

      for (const bulletinId of bulletinIds) {
        const bulletin = db.data.bulletins?.find(b => b.id === bulletinId);
        if (bulletin) {
          bulletins.push(bulletin);
          if (!classeId && bulletin.classeId) classeId = bulletin.classeId;
        } else {
          results.errors.push({ bulletinId, error: "Bulletin non trouvé" });
        }
      }

      if (bulletins.length === 0) {
        return results;
      }

      // Récupérer toutes les inscriptions en une fois
      const inscriptionsMap = new Map();
      for (const bulletin of bulletins) {
        if (!inscriptionsMap.has(bulletin.inscriptionId)) {
          const inscription = await inscriptionController.getById(bulletin.inscriptionId);
          if (inscription) inscriptionsMap.set(bulletin.inscriptionId, inscription);
        }
      }

      // Calculer l'effectif de la classe
      const effectif = await calculerEffectifClasse(classeId);

      // Générer chaque bulletin
      const bulletinsGeneres = [];

      for (const bulletin of bulletins) {
        try {
          const inscription = inscriptionsMap.get(bulletin.inscriptionId);
          if (!inscription) {
            results.errors.push({ bulletinId: bulletin.id, error: "Inscription non trouvée" });
            continue;
          }

          // Calculer les moyennes
          const calculs = await calculerMoyennes(
            bulletin.inscriptionId,
            periodeId,
            config,
            bulletin.vieScolaire?.conduite
          );

          // Calculer le récapitulatif annuel
          const recapAnnuel = await calculerRecapitulatifAnnuel(bulletin.inscriptionId, periodeId);

          // Déterminer le statut
          let status;
          let notesManquantes = [];

          if (!calculs.bulletinComplet) {
            status = BULLETIN_STATUS.INCOMPLET;
            notesManquantes = calculs.matieresManquantes || [];
          } else {
            const aConduite = bulletin.vieScolaire?.conduite !== null &&
              bulletin.vieScolaire?.conduite !== undefined &&
              bulletin.vieScolaire?.conduite !== "";

            if (aConduite) {
              status = BULLETIN_STATUS.COMPLET;
            } else {
              status = BULLETIN_STATUS.A_FINALISER;
              notesManquantes = [{
                matiereId: "conduite",
                matiere: "CONDUITE",
                evaluationsManquantes: ["Note de conduite à saisir"]
              }];
            }
          }

          // Préparer le bulletin mis à jour
          const bulletinMisAJour = {
            ...bulletin,
            status,
            moyennesParMatiere: calculs.moyennesParMatiere,
            resultatFinal: calculs.resultatFinal ? {
              ...calculs.resultatFinal,
              moyenneAnnuelle: recapAnnuel.moyenneAnnuelle,
              moyennesPeriodesAnterieures: recapAnnuel.moyennesPrecedentes
            } : null,
            infosDeClasse: { effectif },
            notesManquantes,
            updatedAt: new Date().toISOString()
          };

          bulletinsGeneres.push(bulletinMisAJour);

          results.success.push({
            bulletinId: bulletin.id,
            eleve: `${inscription.prenom} ${inscription.nom}`,
            bulletin: await enrichirBulletin(bulletinMisAJour)
          });

        } catch (error) {
          results.errors.push({ bulletinId: bulletin.id, error: error.message });
        }
      }

      // Mettre à jour tous les bulletins en base
      if (bulletinsGeneres.length > 0) {
        await db.update((dbData) => {
          for (const bulletinGenere of bulletinsGeneres) {
            const index = dbData.bulletins.findIndex(b => b.id === bulletinGenere.id);
            if (index !== -1) {
              dbData.bulletins[index] = bulletinGenere;
            }
          }
        });

        // Calculer et mettre à jour tous les rangs en une seule passe
        if (classeId && periodeId && bulletinsGeneres.some(b => b.status === BULLETIN_STATUS.COMPLET)) {
          await mettreAJourTousLesRangs(classeId, periodeId);
        }
      }

      return results;

    } catch (error) {
      console.error(`[bulletinController.generateMultiple] Erreur:`, error);
      throw error;
    }
  },

  /**
   * Met à jour un bulletin
   */
  async update(id, data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      let updatedBulletin = null;

      await db.update((dbData) => {
        const index = dbData.bulletins?.findIndex(b => b.id === id);
        if (index !== -1) {
          const bulletin = dbData.bulletins[index];

          // Mettre à jour les champs
          if (data.vieScolaire) {
            bulletin.vieScolaire = { ...bulletin.vieScolaire, ...data.vieScolaire };
          }
          if (data.commentaires) {
            bulletin.commentaires = { ...bulletin.commentaires, ...data.commentaires };
          }

          // Recalculer le statut
          if (bulletin.status === BULLETIN_STATUS.COMPLET &&
            (!bulletin.vieScolaire?.conduite || bulletin.vieScolaire.conduite === "")) {
            bulletin.status = BULLETIN_STATUS.A_FINALISER;
          } else if (bulletin.status === BULLETIN_STATUS.A_FINALISER &&
            bulletin.vieScolaire?.conduite && bulletin.vieScolaire.conduite !== "") {
            bulletin.status = BULLETIN_STATUS.COMPLET;
          }

          bulletin.updatedAt = now;
          updatedBulletin = bulletin;
        }
      });

      // Recalculer les rangs si le statut est passé à COMPLET
      if (updatedBulletin?.status === BULLETIN_STATUS.COMPLET) {
        const inscription = await inscriptionController.getById(updatedBulletin.inscriptionId);
        if (inscription?.classeId) {
          await mettreAJourTousLesRangs(inscription.classeId, updatedBulletin.periodeId);
          // Récupérer à nouveau le bulletin avec le rang mis à jour
          const db = getDb();
          const bulletinAvecRang = db.data.bulletins?.find(b => b.id === id);
          if (bulletinAvecRang) updatedBulletin = bulletinAvecRang;
        }
      }

      return await enrichirBulletin(updatedBulletin);

    } catch (error) {
      console.error(`[bulletinController.update] Erreur:`, error);
      throw error;
    }
  },


  /**
 * Sauvegarde un bulletin (crée si inexistant, met à jour sans écraser)
 */
  async saveBulletin(payload) {
    try {
      const { inscriptionId, periodeId, data } = payload;
      const db = getDb();
      const now = new Date().toISOString();
      let bulletin = db.data.bulletins?.find(b =>
        b.inscriptionId === inscriptionId && b.periodeId === periodeId
      );

      // Si le bulletin n'existe pas, on le crée
      if (!bulletin) {
        const inscription = await inscriptionController.getById(inscriptionId);
        if (!inscription) {
          throw new Error("Inscription non trouvée");
        }

        bulletin = {
          id: uuidv4(),
          inscriptionId: inscriptionId,
          periodeId: periodeId,
          classeId: inscription.classeId,
          classe: inscription.classe,
          status: BULLETIN_STATUS.BROUILLON,
          moyennesParMatiere: [],
          resultatFinal: null,
          infosDeClasse: { effectif: 0 },
          vieScolaire: { absences: 0, retards: 0, conduite: null },
          commentaires: { decisionConseil: "", observations: "" },
          notesManquantes: [],
          createdAt: now,
          updatedAt: now
        };

        await db.update((dbData) => {
          if (!dbData.bulletins) dbData.bulletins = [];
          dbData.bulletins.push(bulletin);
        });
      }

      // Mettre à jour UNIQUEMENT les champs fournis
      await db.update((dbData) => {
        const index = dbData.bulletins?.findIndex(b => b.id === bulletin.id);
        if (index !== -1) {
          const b = dbData.bulletins[index];

          if (data.vieScolaire !== undefined) {
            b.vieScolaire = { ...b.vieScolaire, ...data.vieScolaire };
          }
          if (data.commentaires !== undefined) {
            b.commentaires = { ...b.commentaires, ...data.commentaires };
          }
          if (data.moyennesParMatiere !== undefined) {
            b.moyennesParMatiere = data.moyennesParMatiere;
          }
          if (data.resultatFinal !== undefined) {
            b.resultatFinal = data.resultatFinal;
          }
          if (data.status !== undefined) {
            b.status = data.status;
          }
          if (data.infosDeClasse !== undefined) {
            b.infosDeClasse = { ...b.infosDeClasse, ...data.infosDeClasse };
          }
          if (data.notesManquantes !== undefined) {
            b.notesManquantes = data.notesManquantes;
          }

          b.updatedAt = now;
        }
      });

      // 🔄 SYNC: Si la mise à jour concerne vieScolaire, mettre à jour l'inscription
      if (data.vieScolaire) {
        const inscription = await inscriptionController.getById(inscriptionId);
        if (inscription) {
          const vieScolaire = inscription.vieScolaire || [];
          const existingIndex = vieScolaire.findIndex(v => v.periodeId === periodeId);

          if (existingIndex >= 0) {
            // Mettre à jour la période existante
            vieScolaire[existingIndex].score = {
              ...vieScolaire[existingIndex].score,
              ...data.vieScolaire
            };
          } else {
            // Ajouter une nouvelle période
            vieScolaire.push({
              periodeId: periodeId,
              score: {
                absences: data.vieScolaire.absences ?? 0,
                retards: data.vieScolaire.retards ?? 0,
                conduite: data.vieScolaire.conduite ?? null
              }
            });
          }

          await inscriptionController.update(inscriptionId, { vieScolaire });
        }
      }

      // Récupérer le bulletin mis à jour
      const dbFinal = getDb();
      const bulletinFinal = dbFinal.data.bulletins?.find(b => b.id === bulletin.id);
      return await enrichirBulletin(bulletinFinal);

    } catch (error) {
      console.error(`[bulletinController.saveBulletin] Erreur:`, error);
      throw error;
    }
  },
  /**
   * Supprime un bulletin
   */
  async delete(id) {
    try {
      const db = getDb();
      let bulletinSupprime = null;

      // Récupérer les infos avant suppression pour recalculer les rangs
      const bulletin = db.data.bulletins?.find(b => b.id === id);
      if (bulletin) {
        bulletinSupprime = bulletin;
      }

      await db.update((dbData) => {
        dbData.bulletins = dbData.bulletins?.filter(b => b.id !== id) || [];
      });

      // Recalculer les rangs de la classe si nécessaire
      if (bulletinSupprime?.classeId && bulletinSupprime?.periodeId) {
        await mettreAJourTousLesRangs(bulletinSupprime.classeId, bulletinSupprime.periodeId);
      }

      return { success: true };

    } catch (error) {
      console.error(`[bulletinController.delete] Erreur:`, error);
      throw error;
    }
  },

  /**
   * Supprime plusieurs bulletins
   */
  async deleteMany(ids) {
    try {
      const db = getDb();
      let deletedCount = 0;
      let classePeriodeInfo = null;

      // Récupérer les infos avant suppression
      const bulletinsASupprimer = db.data.bulletins?.filter(b => ids.includes(b.id)) || [];
      if (bulletinsASupprimer.length > 0) {
        const first = bulletinsASupprimer[0];
        classePeriodeInfo = {
          classeId: first.classeId,
          periodeId: first.periodeId
        };
      }

      await db.update((dbData) => {
        const initialLength = dbData.bulletins?.length || 0;
        dbData.bulletins = dbData.bulletins?.filter(b => !ids.includes(b.id)) || [];
        deletedCount = initialLength - (dbData.bulletins?.length || 0);
      });

      // Recalculer les rangs si nécessaire
      if (classePeriodeInfo?.classeId && classePeriodeInfo?.periodeId && deletedCount > 0) {
        await mettreAJourTousLesRangs(classePeriodeInfo.classeId, classePeriodeInfo.periodeId);
      }

      return { success: true, deletedCount };

    } catch (error) {
      console.error(`[bulletinController.deleteMany] Erreur:`, error);
      throw error;
    }
  },

  /**
   * Recalcule tous les rangs d'une classe pour une période
   */
  async recalculerRangs(classeId, periodeId) {
    try {
      return await mettreAJourTousLesRangs(classeId, periodeId);
    } catch (error) {
      console.error(`[bulletinController.recalculerRangs] Erreur:`, error);
      return { success: false, updatedCount: 0 };
    }
  }
};