// electron/controllers/inscriptionController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { bulletinController } from './bulletinController.js';

// Fonction utilitaire pour enrichir une inscription
function enrichirInscription(inscription) {
  if (!inscription) return null;

  const db = getDb();
  const eleve = db.data.elevesData?.find(e => e.id === inscription.eleveDataId);
  const classe = db.data.classes?.find(c => c.id === inscription.classeId);
  const niveauClasse = db.data.niveauxClasses?.find(nc => nc.id === classe?.niveauClasseId);
  const cycle = db.data.cycles?.find(c => c.id === niveauClasse?.cycleId);
  const niveauScolaire = db.data.niveauxScolaires?.find(ns => ns.id === cycle?.niveauScolaireId);


  return {
    ...inscription,
    ...eleve,
    id: inscription.id,
    niveauClasse: niveauClasse?.nom || '',
    classe: classe?.nom || '',
    cycle: cycle?.nom || '',
    niveauScolaire: niveauScolaire?.nom || '',
    niveauClasseId: niveauClasse?.id
  };
}

export const inscriptionController = {
  // Endpoint unique avec filtres dynamiques
  async getData(where = {}, options = {}) {
    try {
      const db = getDb();
      let inscriptions = db.data.inscriptions || [];

      // Appliquer tous les filtres du where
      if (Object.keys(where).length > 0) {
        inscriptions = inscriptions.filter(inscription => {
          return Object.entries(where).every(([key, value]) => {
            // Ignorer les valeurs undefined/null
            if (value === undefined || value === null) return true;

            // Cas spécial pour les dates (format YYYY-MM-DD)
            if (key.includes('Date') && typeof value === 'string') {
              const inscriptionDate = inscription[key]?.split('T')[0];
              return inscriptionDate === value;
            }

            // Cas pour les IDs (comparaison stricte)
            if (key.includes('Id') || key === 'id') {
              return inscription[key] === value;
            }

            // Cas pour les booléens
            if (typeof value === 'boolean') {
              return inscription[key] === value;
            }

            // Cas pour les recherches partielles (texte)
            if (typeof value === 'string' && value.includes('%')) {
              const searchTerm = value.replace(/%/g, '').toLowerCase();
              const inscriptionValue = inscription[key]?.toString().toLowerCase() || '';
              return inscriptionValue.includes(searchTerm);
            }

            // Cas pour les tableaux (IN)
            if (Array.isArray(value)) {
              return value.includes(inscription[key]);
            }

            // Comparaison par défaut
            return inscription[key] === value;
          });
        });
      }

      // Tri
      if (options.orderBy) {
        const orderDir = options.orderDir === 'DESC' ? -1 : 1;
        inscriptions.sort((a, b) => {
          const aVal = a[options.orderBy];
          const bVal = b[options.orderBy];

          if (typeof aVal === 'string' && typeof bVal === 'string') {
            return orderDir * aVal.localeCompare(bVal);
          }
          return orderDir * ((aVal || 0) - (bVal || 0));
        });
      }

      // Pagination
      if (options.limit) {
        const start = options.offset || 0;
        inscriptions = inscriptions.slice(start, start + options.limit);
      }

      // Enrichir
      const inscriptionsEnrichies = inscriptions.map(enrichirInscription);

      // Retourner un seul si demandé
      if (options.unique && inscriptionsEnrichies.length === 1) {
        return inscriptionsEnrichies[0];
      }

      return inscriptionsEnrichies;
    } catch (error) {
      console.error("Erreur getData inscriptions:", error);
      throw error;
    }
  },

  // Méthodes de compatibilité (utilisent getData)
  async getAll() {
    return this.getData();
  },

  async getActives() {
    return this.getData({ isActive: true });
  },

  async getById(id) {
    return this.getData({ id }, { unique: true });
  },

  async getByEleve(eleveDataId) {
    return this.getData({ eleveDataId }, { unique: true });
  },

  async getByClasse(classeId) {
    return this.getData({ classeId });
  },

  async getByAnneeScolaire(anneeScolaire) {
    return this.getData({ anneeScolaire });
  },

  async getCurrentInscription(eleveDataId) {
    const anneeCourante = new Date().getFullYear() + '-' + (new Date().getFullYear() + 1);
    return this.getData(
      { eleveDataId, anneeScolaire: anneeCourante, isActive: true },
      { unique: true }
    );
  },

  // Recherche avancée
  async search(criteres) {
    const where = {};
    const options = {};

    // Construire where à partir des critères
    if (criteres.classeId) where.classeId = criteres.classeId;
    if (criteres.eleveDataId) where.eleveDataId = criteres.eleveDataId;
    if (criteres.anneeScolaire) where.anneeScolaire = criteres.anneeScolaire;
    if (criteres.statutScolaire) where.statutScolaire = criteres.statutScolaire;
    if (criteres.isActive !== undefined) where.isActive = criteres.isActive;

    // Recherche texte (nom, prenom, matricule)
    if (criteres.recherche) {
      const searchTerm = `%${criteres.recherche}%`;
      where.nom = searchTerm;
      where.prenom = searchTerm;
      where.matricule = searchTerm;
      // Note: cette syntaxe ne fonctionnera pas directement
      // Il faudrait une logique plus complexe pour l'OR
    }

    // Options de pagination et tri
    if (criteres.page && criteres.limit) {
      options.offset = (criteres.page - 1) * criteres.limit;
      options.limit = criteres.limit;
    }

    if (criteres.tri) {
      options.orderBy = criteres.tri.champ;
      options.orderDir = criteres.tri.direction;
    }

    return this.getData(where, options);
  },

  // CRUD standard
  async create(data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();

      const eleve = db.data.elevesData?.find(e => e.id === data.eleveDataId);
      if (!eleve) throw new Error("Élève non trouvé");

      const classe = db.data.classes?.find(c => c.id === data.classeId);
      if (!classe) throw new Error("Classe non trouvée");

      const niveauClasse = db.data.niveauxClasses?.find(nc => nc.id === classe.niveauClasseId);
      const cycle = db.data.cycles?.find(c => c.id === niveauClasse?.cycleId);
      const niveauScolaire = db.data.niveauxScolaires?.find(ns => ns.id === cycle?.niveauScolaireId);

      // Désactiver l'ancienne inscription active
      const ancienneInscription = db.data.inscriptions?.find(i =>
        i.eleveDataId === data.eleveDataId && i.isActive !== false
      );

      if (ancienneInscription) {
        await db.update((dbData) => {
          const index = dbData.inscriptions.findIndex(i => i.id === ancienneInscription.id);
          if (index !== -1) {
            dbData.inscriptions[index].isActive = false;
          }
        });
      }

      const newInscription = {
        id: uuidv4(),
        eleveDataId: data.eleveDataId,
        anneeScolaire: data.anneeScolaire,
        dateInscription: data.dateInscription || new Date().toISOString().split('T')[0],
        statutScolaire: data.statutScolaire || 'nouveau',
        classeId: data.classeId,
        isActive: true,
        createdAt: now,
        updatedAt: now
      };

      await db.update((dbData) => {
        if (!dbData.inscriptions) dbData.inscriptions = [];
        dbData.inscriptions.push(newInscription);
      });

      return {
        ...newInscription,
        ...eleve,
        id: newInscription.id,
        niveauClasse: niveauClasse?.nom || '',
        classe: classe.nom,
        cycle: cycle?.nom || '',
        niveauScolaire: niveauScolaire?.nom || '',
      };
    } catch (error) {
      console.error("Erreur create inscription:", error);
      throw error;
    }
  },

  async inscrireNouvelEleve(data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();

      const classe = db.data.classes?.find(c => c.id === data.classeId);
      if (!classe) throw new Error("Classe non trouvée");

      const niveauClasse = db.data.niveauxClasses?.find(nc => nc.id === classe.niveauClasseId);
      const cycle = db.data.cycles?.find(c => c.id === niveauClasse?.cycleId);
      const niveauScolaire = db.data.niveauxScolaires?.find(ns => ns.id === cycle?.niveauScolaireId);

      if (data.matricule) {
        const existingEleve = db.data.elevesData?.find(e => e.matricule === data.matricule);
        if (existingEleve) {
          throw new Error(`Un élève avec le matricule ${data.matricule} existe déjà`);
        }
      }

      const newEleve = {
        id: uuidv4(),
        nom: data.nom,
        prenom: data.prenom,
        dateNaissance: data.dateNaissance,
        sexe: data.sexe,
        lieuDeNaissance: data.lieuDeNaissance || "",
        contact: data.contact || "",
        photo: data.photo || "",
        matricule: data.matricule || null,
        statut: 'actif',
        createdAt: now,
        updatedAt: now
      };

      await db.update((dbData) => {
        if (!dbData.elevesData) dbData.elevesData = [];
        dbData.elevesData.push(newEleve);
      });

      const newInscription = {
        id: uuidv4(),
        eleveDataId: newEleve.id,
        anneeScolaire: data.anneeScolaire,
        dateInscription: data.dateInscription || new Date().toISOString().split('T')[0],
        statutScolaire: data.statutScolaire || 'nouveau',
        classeId: data.classeId,
        isActive: true,
        createdAt: now,
        updatedAt: now
      };

      await db.update((dbData) => {
        if (!dbData.inscriptions) dbData.inscriptions = [];
        dbData.inscriptions.push(newInscription);
      });

      return {
        ...newInscription,
        ...newEleve,
        id: newInscription.id,
        niveauClasse: niveauClasse?.nom || '',
        classe: classe.nom,
        cycle: cycle?.nom || '',
        niveauScolaire: niveauScolaire?.nom || '',
      };

    } catch (error) {
      console.error("Erreur inscrireNouvelEleve:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      let updatedItem = null;
      let eleve = null;
      let classe = null;


      await db.update((dbData) => {
        const index = dbData.inscriptions?.findIndex(i => i.id === id);
        if (index !== -1) {
          dbData.inscriptions[index] = {
            ...dbData.inscriptions[index],
            ...data,
            updatedAt: now
          };
          updatedItem = dbData.inscriptions[index];

          eleve = dbData.elevesData?.find(e => e.id === updatedItem.eleveDataId);
          classe = dbData.classes?.find(c => c.id === updatedItem.classeId);
        }
      });

      if (!updatedItem) return null;

      // 🔄 SYNC: Si la mise à jour concerne vieScolaire, mettre à jour les bulletins correspondants
      if (data.vieScolaire && Array.isArray(data.vieScolaire)) {
        for (const periodeData of data.vieScolaire) {
          const bulletinIndex = db.data.bulletins?.findIndex(b =>
            b.inscriptionId === id && b.periodeId === periodeData.periodeId
          );

          if (bulletinIndex !== -1 && bulletinIndex !== undefined) {
            // Bulletin existe → mettre à jour
            await db.update((dbData) => {
              const b = dbData.bulletins[bulletinIndex];
              if (b) {
                b.vieScolaire = {
                  ...b.vieScolaire,
                  ...periodeData.score
                };
                b.updatedAt = now;
              }
            });
          } else {
            // Bulletin n'existe pas → le créer
            const nowBulletin = new Date().toISOString();
            const newBulletin = {
              id: uuidv4(),
              inscriptionId: id,
              periodeId: periodeData.periodeId,
              classeId: updatedItem.classeId,
              classe: classe?.nom || '',
              status: 'brouillon',
              moyennesParMatiere: [],
              resultatFinal: null,
              infosDeClasse: { effectif: 0 },
              vieScolaire: {
                absences: periodeData.score?.absences || 0,
                retards: periodeData.score?.retards || 0,
                conduite: periodeData.score?.conduite || null
              },
              commentaires: { decisionConseil: "", observations: "" },
              notesManquantes: [],
              createdAt: nowBulletin,
              updatedAt: nowBulletin
            };

            await db.update((dbData) => {
              if (!dbData.bulletins) dbData.bulletins = [];
              dbData.bulletins.push(newBulletin);
            });
          }
        }
      }

      const niveauClasse = db.data.niveauxClasses?.find(nc => nc.id === classe?.niveauClasseId);
      const cycle = db.data.cycles?.find(c => c.id === niveauClasse?.cycleId);
      const niveauScolaire = db.data.niveauxScolaires?.find(ns => ns.id === cycle?.niveauScolaireId);

      return {
        ...updatedItem,
        ...eleve,
        id: updatedItem.id,
        niveauClasse: niveauClasse?.nom || '',
        classe: classe?.nom || '',
        cycle: cycle?.nom || '',
        niveauScolaire: niveauScolaire?.nom || '',
      };
    } catch (error) {
      console.error("Erreur update inscription:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const db = getDb();

      const paiements = db.data.paiements?.filter(p => p.inscriptionId === id) || [];
      if (paiements.length > 0) {
        throw new Error("Impossible de supprimer une inscription avec des paiements");
      }

      await db.update((dbData) => {
        dbData.inscriptions = dbData.inscriptions?.filter(i => i.id !== id) || [];
      });

      return { success: true };
    } catch (error) {
      console.error("Erreur delete inscription:", error);
      throw error;
    }
  },

  // Méthode pour réinscrire les élèves
  async reinscrireEleves(payload) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      const anneeCourante = new Date().getFullYear() + '-' + (new Date().getFullYear() + 1);

      const resultats = {
        success: [],
        errors: []
      };

      for (const eleve of payload.eleves) {
        try {
          // Vérifier que l'élève existe
          const eleveExistant = db.data.elevesData?.find(e => e.id === eleve.eleveDataId);
          if (!eleveExistant) {
            throw new Error(`Élève non trouvé: ${eleve.prenom} ${eleve.nom}`);
          }

          // Vérifier que la classe cible existe
          const classeCible = db.data.classes?.find(c => c.id === payload.classeCibleId);
          if (!classeCible) {
            throw new Error("Classe cible non trouvée");
          }

          // Désactiver l'ancienne inscription active
          if (eleve.id) {
            await db.update((dbData) => {
              const index = dbData.inscriptions.findIndex(i => i.id === eleve.id);
              if (index !== -1) {
                dbData.inscriptions[index].isActive = false;
              }
            });
          }

          // Créer la nouvelle inscription
          const newInscription = {
            id: uuidv4(),
            eleveDataId: eleve.eleveDataId,
            anneeScolaire: payload.anneeCourante || anneeCourante,
            dateInscription: new Date().toISOString().split('T')[0],
            statutScolaire: payload.statut || 'nouveau',
            classeId: payload.classeCibleId,
            isActive: true,
            createdAt: now,
            updatedAt: now
          };

          await db.update((dbData) => {
            if (!dbData.inscriptions) dbData.inscriptions = [];
            dbData.inscriptions.push(newInscription);
          });

          resultats.success.push({
            eleveId: eleve.eleveDataId,
            nom: `${eleve.prenom} ${eleve.nom}`,
            nouvelleInscription: newInscription
          });

        } catch (error) {
          resultats.errors.push({
            eleveId: eleve.eleveDataId,
            nom: `${eleve.prenom} ${eleve.nom}`,
            error: error.message
          });
        }
      }

      return resultats;
    } catch (error) {
      console.error("Erreur reinscrireEleves:", error);
      throw error;
    }
  },

  async desactiverEleves(inscriptionIds) {
    try {
      const db = getDb();
      const now = new Date().toISOString();

      // S'assurer que inscriptionIds est un tableau
      const ids = Array.isArray(inscriptionIds) ? inscriptionIds : [inscriptionIds];


      const resultats = {
        success: [],
        errors: []
      };

      for (const inscriptionId of ids) {
        try {
          // Désactiver l'inscription
          await db.update((dbData) => {
            const index = dbData.inscriptions?.findIndex(i => i.id === inscriptionId);
            if (index !== -1) {
              dbData.inscriptions[index].isActive = false;
              dbData.inscriptions[index].updatedAt = now;
            } else {
              throw new Error(`Inscription ${inscriptionId} non trouvée`);
            }
          });

          resultats.success.push({ inscriptionId });
        } catch (error) {
          resultats.errors.push({ inscriptionId, error: error.message });
        }
      }


      return resultats;
    } catch (error) {
      console.error("Erreur desactiverEleves:", error);
      throw error;
    }
  },

  async transfererEleves(payload) {
    try {
      const db = getDb();
      const now = new Date().toISOString();

      const { inscriptions, classeId } = payload;

      const resultats = {
        success: [],
        errors: []
      };

      // Vérifier que la classe cible existe
      const classeCible = db.data.classes?.find(c => c.id === classeId);
      if (!classeCible) {
        throw new Error("Classe de destination non trouvée");
      }

      for (const inscription of inscriptions) {
        try {
          // Vérifier que l'inscription existe
          const inscriptionExistante = db.data.inscriptions?.find(i => i.id === inscription.id);
          if (!inscriptionExistante) {
            throw new Error(`Inscription ${inscription.id} non trouvée`);
          }

          // Vérifier que l'élève existe
          const eleve = db.data.elevesData?.find(e => e.id === inscriptionExistante.eleveDataId);
          if (!eleve) {
            throw new Error(`Élève non trouvé pour l'inscription ${inscription.id}`);
          }

          // Vérifier que la classe source et cible sont différentes
          if (inscriptionExistante.classeId === classeId) {
            throw new Error(`${eleve.prenom} ${eleve.nom} est déjà dans cette classe`);
          }

          // Mettre à jour l'inscription
          await db.update((dbData) => {
            const index = dbData.inscriptions.findIndex(i => i.id === inscription.id);
            if (index !== -1) {
              dbData.inscriptions[index].classeId = classeId;
              dbData.inscriptions[index].updatedAt = now;
            }
          });

          resultats.success.push({
            inscriptionId: inscription.id,
            eleveId: eleve.id,
            nom: `${eleve.prenom} ${eleve.nom}`,
            nouvelleClasse: classeCible.nom
          });

        } catch (error) {
          resultats.errors.push({
            inscriptionId: inscription.id,
            nom: inscription.prenom ? `${inscription.prenom} ${inscription.nom}` : 'Inconnu',
            error: error.message
          });
        }
      }

      return resultats;
    } catch (error) {
      console.error("Erreur transfererEleves:", error);
      throw error;
    }
  },

  async deleteMany(ids) {
    try {
      const db = getDb();
      let deletedCount = 0;

      await db.update((dbData) => {
        const initialLength = dbData.inscriptions?.length || 0;

        // Supprimer également les paiements liés
        dbData.paiements = dbData.paiements?.filter(p => !ids.includes(p.inscriptionId)) || [];

        // Supprimer les inscriptions
        dbData.inscriptions = dbData.inscriptions?.filter(i => !ids.includes(i.id)) || [];

        deletedCount = initialLength - (dbData.inscriptions?.length || 0);
      });

      return { success: true, deletedCount };
    } catch (error) {
      console.error("Erreur deleteMany inscriptions:", error);
      throw error;
    }
  }
};