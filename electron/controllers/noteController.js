// electron/controllers/noteController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { inscriptionController } from './inscriptionController.js';
import { matiereController } from './matiereController.js';
import { periodeController } from './periodeController.js';
import { evaluationController } from './evaluationController.js';
import { classeController } from './classeController.js';
import { enseignantController } from './enseignantController.js';
import { inscriptionController as eleveController } from './inscriptionController.js';
import { bulletinController } from './bulletinController.js';

// Fonction utilitaire pour enrichir une note
async function enrichirNote(note) {
  if (!note) return null;

  const inscription = await inscriptionController.getById(note.inscriptionId);
  const matiere = await matiereController.getById(note.matiereId);
  const periode = await periodeController.getById(note.periodeId);
  const evaluation = await evaluationController.getById(note.evaluationId);
  const enseignant = await enseignantController.getById(note.enseignantId);

  const eleve = inscription?.eleveDataId ? await eleveController.getById(inscription.eleveDataId) : null;

  return {
    ...note,
    id: note.id,
    matiere: matiere?.nom || '',
    periode: periode?.nom || '',
    evaluation: evaluation?.nom || '',
    niveauScolaire: inscription?.niveauScolaire || '',
    classe: inscription?.classe || '',
    eleve: eleve ? `${eleve.prenom} ${eleve.nom}` : '',
    niveauClasse: inscription?.niveauClasse || '',
    anneeScolaire: inscription?.anneeScolaire || '',
    enseignant: enseignant ? `${enseignant.prenom} ${enseignant.nom}` : '',
  };
}

export const noteController = {
  async getAll() {
    try {
      const db = getDb();
      const notes = db.data.notes || [];

      const notesEnrichies = [];
      for (const note of notes) {
        notesEnrichies.push(await enrichirNote(note));
      }

      console.log(notesEnrichies)
      return notesEnrichies;
    } catch (error) {
      console.error("Erreur getAll notes:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const db = getDb();
      const note = db.data.notes?.find(n => n.id === id) || null;
      return await enrichirNote(note);
    } catch (error) {
      console.error("Erreur getById note:", error);
      throw error;
    }
  },


  async getByInscription(inscriptionId) {
    try {
      const db = getDb();
      const notes = db.data.notes?.filter(n => n.inscriptionId === inscriptionId) || [];

      const notesEnrichies = [];
      for (const note of notes) {
        notesEnrichies.push(await enrichirNote(note));
      }

      return notesEnrichies;
    } catch (error) {
      console.error("Erreur getByInscription note:", error);
      throw error;
    }
  },

  async getByMatiere(matiereId) {
    try {
      const db = getDb();
      const notes = db.data.notes?.filter(n => n.matiereId === matiereId) || [];

      const notesEnrichies = [];
      for (const note of notes) {
        notesEnrichies.push(await enrichirNote(note));
      }

      return notesEnrichies;
    } catch (error) {
      console.error("Erreur getByMatiere note:", error);
      throw error;
    }
  },

  async getByPeriode(periodeId) {
    try {
      const db = getDb();
      const notes = db.data.notes?.filter(n => n.periodeId === periodeId) || [];

      const notesEnrichies = [];
      for (const note of notes) {
        notesEnrichies.push(await enrichirNote(note));
      }

      return notesEnrichies;
    } catch (error) {
      console.error("Erreur getByPeriode note:", error);
      throw error;
    }
  },

  async getByClasse(classeId) {
    try {
      const db = getDb();

      // Récupérer les inscriptions de la classe
      const inscriptions = await inscriptionController.getByClasse(classeId);
      const inscriptionIds = inscriptions.map(i => i.id);

      const notes = db.data.notes?.filter(n => inscriptionIds.includes(n.inscriptionId)) || [];

      const notesEnrichies = [];
      for (const note of notes) {
        notesEnrichies.push(await enrichirNote(note));
      }

      return notesEnrichies;
    } catch (error) {
      console.error("Erreur getByClasse note:", error);
      throw error;
    }
  },

  async getByEleve(eleveDataId) {
    try {
      const db = getDb();

      // Récupérer les inscriptions de l'élève
      const inscriptions = await inscriptionController.getByEleve(eleveDataId);
      const inscriptionIds = inscriptions.map(i => i.id);

      const notes = db.data.notes?.filter(n => inscriptionIds.includes(n.inscriptionId)) || [];

      const notesEnrichies = [];
      for (const note of notes) {
        notesEnrichies.push(await enrichirNote(note));
      }

      return notesEnrichies;
    } catch (error) {
      console.error("Erreur getByEleve note:", error);
      throw error;
    }
  },

  async create(data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();

      // Vérifications via les contrôleurs
      const inscription = await inscriptionController.getById(data.inscriptionId);
      if (!inscription) throw new Error("Inscription non trouvée");

      const matiere = await matiereController.getById(data.matiereId);
      if (!matiere) throw new Error("Matière non trouvée");

      const periode = await periodeController.getById(data.periodeId);
      if (!periode) throw new Error("Période non trouvée");

      const evaluation = await evaluationController.getById(data.evaluationId);
      if (!evaluation) throw new Error("Évaluation non trouvée");

      const classe = await classeController.getById(inscription.classeId);
      if (!classe) throw new Error("Classe non trouvée");


      if (data.note < 0 || data.note > 20) {
        throw new Error("La note doit être comprise entre 0 et 20");
      }

      // Vérifier si une note existe déjà
      const existingNote = db.data.notes?.find(n =>
        n.inscriptionId === data.inscriptionId &&
        n.matiereId === data.matiereId &&
        n.periodeId === data.periodeId &&
        n.evaluationId === data.evaluationId
      );

      if (existingNote) {
        throw new Error("Une note existe déjà pour cette évaluation");
      }

      const newNote = {
        id: uuidv4(),
        inscriptionId: data.inscriptionId,
        matiereId: data.matiereId,
        periodeId: data.periodeId,
        note: Number(data.note),
        coefficient: Number(data.coefficient),
        enseignantId: data.id || "",
        evaluationId: data.evaluationId,
        createdAt: now,
        updatedAt: now
      };

      await db.update((dbData) => {
        if (!dbData.notes) dbData.notes = [];
        dbData.notes.push(newNote);
      });


      await bulletinController.createUnique({
        inscriptionId: data.inscriptionId,
        periodeId: data.periodeId,
      })
      return await enrichirNote(newNote);


    } catch (error) {
      console.error("Erreur create note:", error);
      throw error;
    }
  },

  async createBatch(dataArray) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      const createdNotes = [];
      const errors = [];

      for (const data of dataArray) {
        try {
          const inscription = await inscriptionController.getById(data.inscriptionId);
          if (!inscription) throw new Error(`Inscription ${data.inscriptionId} non trouvée`);

          const matiere = await matiereController.getById(data.matiereId);
          if (!matiere) throw new Error(`Matière ${data.matiereId} non trouvée`);

          const periode = await periodeController.getById(data.periodeId);
          if (!periode) throw new Error(`Période ${data.periodeId} non trouvée`);

          const evaluation = await evaluationController.getById(data.evaluationId);
          if (!evaluation) throw new Error(`Évaluation ${data.evaluationId} non trouvée`);

          const classe = await classeController.getById(inscription.classeId);
          if (!classe) throw new Error(`Classe non trouvée pour l'inscription ${data.inscriptionId}`);

          const enseignants = await enseignantController.getAll();
          const enseignant = enseignants.find(e =>
            e.enseignements?.some(ens =>
              ens.classeId === classe.id && ens.matiereId === data.matiereId
            )
          );

          if (!enseignant) {
            throw new Error(`Aucun enseignant trouvé pour la matière ${matiere.nom} dans la classe ${classe.nom}`);
          }

          if (data.note < 0 || data.note > 20) {
            throw new Error("La note doit être comprise entre 0 et 20");
          }

          const existingNote = db.data.notes?.find(n =>
            n.inscriptionId === data.inscriptionId &&
            n.matiereId === data.matiereId &&
            n.periodeId === data.periodeId &&
            n.evaluationId === data.evaluationId
          );

          if (existingNote) {
            throw new Error("Une note existe déjà pour cette évaluation");
          }

          const newNote = {
            id: uuidv4(),
            inscriptionId: data.inscriptionId,
            matiereId: data.matiereId,
            periodeId: data.periodeId,
            note: Number(data.note),
            coefficient: Number(data.coefficient),
            enseignantId: enseignant.id,
            evaluationId: data.evaluationId,
            createdAt: now,
            updatedAt: now
          };

          createdNotes.push(newNote);
        } catch (error) {
          errors.push({ data, error: error.message });
        }
      }

      if (createdNotes.length > 0) {
        await db.update((dbData) => {
          if (!dbData.notes) dbData.notes = [];
          dbData.notes.push(...createdNotes);
        });
      }

      // Enrichir les notes créées
      const notesEnrichies = [];
      for (const note of createdNotes) {
        notesEnrichies.push(await enrichirNote(note));
      }

      return {
        success: createdNotes.length,
        errors,
        notes: notesEnrichies
      };
    } catch (error) {
      console.error("Erreur createBatch notes:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      let updatedNote = null;

      await db.update((dbData) => {
        const index = dbData.notes?.findIndex(n => n.id === id);

        if (index === -1) {
          throw new Error("Note introuvable");
        }

        const existingNote = dbData.notes[index];

        // 🔒 Interdire modification si closed
        if (existingNote.closed) {
          throw new Error("Impossible de modifier une note déjà clôturée");
        }

        // 🔒 Validation note
        if (data.note !== undefined && (data.note < 0 || data.note > 20)) {
          throw new Error("La note doit être comprise entre 0 et 20");
        }

        dbData.notes[index] = {
          ...existingNote,
          ...data,
          coefficient: data.coefficient !== undefined
            ? Number(data.coefficient)
            : existingNote.coefficient,
          note: data.note !== undefined
            ? Number(data.note)
            : existingNote.note,
          updatedAt: now
        };

        updatedNote = dbData.notes[index];
      });

      return await enrichirNote(updatedNote);

    } catch (error) {
      console.error("Erreur update note:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const db = getDb();

      await db.update((dbData) => {
        const note = dbData.notes?.find(n => n.id === id);

        if (!note) {
          throw new Error("Note introuvable");
        }

        // 🔒 Interdire suppression si closed
        if (note.closed) {
          throw new Error("Impossible de supprimer une note déjà clôturée");
        }

        dbData.notes = dbData.notes.filter(n => n.id !== id);
      });

      return { success: true };

    } catch (error) {
      console.error("Erreur delete note:", error);
      throw error;
    }
  },

  async close(id) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      let closedNote = null;

      await db.update((dbData) => {
        const index = dbData.notes?.findIndex(n => n.id === id);

        if (index === -1) {
          throw new Error("Note introuvable");
        }

        const existingNote = dbData.notes[index];

        // 🔒 Déjà clôturée
        if (existingNote.closed) {
          throw new Error("Cette note est déjà clôturée");
        }

        dbData.notes[index] = {
          ...existingNote,
          closed: true,
          closedAt: now,
          updatedAt: now
        };

        closedNote = dbData.notes[index];
      });

      return closedNote;

    } catch (error) {
      console.error("Erreur clôture note:", error);
      throw error;
    }
  },

  async closeBatch(ids) {
    try {
      if (!ids || ids.length === 0) {
        throw new Error("Aucune note à clôturer");
      }

      const db = getDb();
      const now = new Date().toISOString();
      const closedNotes = [];
      const errors = [];

      await db.update((dbData) => {
        // Vérifier que toutes les notes existent
        for (const id of ids) {
          const index = dbData.notes?.findIndex(n => n.id === id);

          if (index === -1) {
            errors.push({ id, error: "Note introuvable" });
            continue;
          }

          const existingNote = dbData.notes[index];

          // Vérifier si déjà clôturée
          if (existingNote.closed) {
            errors.push({ id, error: "Note déjà clôturée" });
            continue;
          }

          // Mettre à jour la note
          dbData.notes[index] = {
            ...existingNote,
            closed: true,
            closedAt: now,
            updatedAt: now
          };

          closedNotes.push(dbData.notes[index]);
        }
      });

      // Si aucune note n'a été clôturée, lever une erreur
      if (closedNotes.length === 0 && errors.length > 0) {
        throw new Error(`Aucune note clôturée : ${errors.map(e => e.error).join(', ')}`);
      }

      // Retourner les notes clôturées et les erreurs éventuelles
      return {
        success: closedNotes,
        errors: errors.length > 0 ? errors : null
      };

    } catch (error) {
      console.error("Erreur clôture batch notes:", error);
      throw error;
    }
  },


  // À ajouter dans noteController.js

  async importFromExcel(importData) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      const results = {
        success: [],
        errors: []
      };

      const { matiereId, periodeId, evaluationId, enseignantId, notes: notesList } = importData;

      // Vérifications des IDs obligatoires
      const matiere = await matiereController.getById(matiereId);
      if (!matiere) throw new Error("Matière non trouvée");

      const periode = await periodeController.getById(periodeId);
      if (!periode) throw new Error("Période non trouvée");

      const evaluation = await evaluationController.getById(evaluationId);
      if (!evaluation) throw new Error("Évaluation non trouvée");

      // Récupérer tous les élèves (inscriptions) pour mapper matricule -> inscriptionId
      const toutesLesInscriptions = await inscriptionController.getActives();

      // Créer un map matricule -> inscription
      const matriculeMap = new Map();
      for (const inscription of toutesLesInscriptions) {
        const eleve = await inscriptionController.getByEleve(inscription.eleveDataId);

        if (eleve && eleve.matricule) {
          matriculeMap.set(eleve.matricule, inscription.id);
        }
      }

      for (const item of notesList) {
        try {
          const { matricule, note: noteValue } = item;
          const inscriptionId = matriculeMap.get(matricule);


          if (!inscriptionId) {
            results.errors.push({ matricule, error: `Matricule ${matricule} non trouvé` });
            continue;
          }

          if (noteValue < 0 || noteValue > 20) {
            results.errors.push({ matricule, error: "Note doit être entre 0 et 20" });
            continue;
          }

          const existingNote = db.data.notes?.find(n =>
            n.inscriptionId === inscriptionId &&
            n.matiereId === matiereId &&
            n.periodeId === periodeId &&
            n.evaluationId === evaluationId
          );

          if (existingNote) {
            results.errors.push({ matricule, error: "Une note existe déjà pour cette évaluation" });
            continue;
          }

          const newNote = {
            id: uuidv4(),
            inscriptionId: inscriptionId,
            matiereId: matiereId,
            periodeId: periodeId,
            evaluationId: evaluationId,
            note: Number(noteValue),
            coefficient: matiere.coefficient, // Coefficient de la matière
            enseignantId: enseignantId || "",
            createdAt: now,
            updatedAt: now
          };

          await db.update((dbData) => {
            if (!dbData.notes) dbData.notes = [];
            dbData.notes.push(newNote);
          });

          await bulletinController.createUnique({
            inscriptionId: inscriptionId,
            periodeId: periodeId,
          })

          results.success.push({
            matricule,
            note: noteValue,
            coefficient: matiere.coefficient,
            noteId: newNote.id
          });

        } catch (error) {
          results.errors.push({ matricule: item.matricule, error: error.message });
        }
      }

      return results;

    } catch (error) {
      console.error("Erreur importFromExcel:", error);
      throw error;
    }
  }


};