// electron/controllers/paiementController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { transactionController } from './transactionController.js';
import { inscriptionController } from './inscriptionController.js';

// Fonction utilitaire pour enrichir un paiement
async function enrichirPaiement(paiement) {
  if (!paiement) return null;
  
  const inscription = await inscriptionController.getById(paiement.inscriptionId);
  const transaction = await transactionController.getById(paiement.transactionId);
  
  return {
    ...paiement,
    inscription,
    transaction
  };
}

export const paiementController = {
  // Endpoint unique avec filtres dynamiques
  async getData(where = {}, options = {}) {
    try {
      const db = getDb();
      let paiements = db.data.paiements || [];
      
      // Appliquer tous les filtres du where
      if (Object.keys(where).length > 0) {
        paiements = paiements.filter(paiement => {
          return Object.entries(where).every(([key, value]) => {
            if (value === undefined || value === null) return true;
            
            // Cas pour les dates
            if (key.includes('Date') && typeof value === 'string') {
              const paiementDate = paiement[key]?.split('T')[0];
              return paiementDate === value;
            }
            
            // Cas pour les IDs
            if (key.includes('Id') || key === 'id') {
              return paiement[key] === value;
            }
            
            // Cas pour les booléens
            if (typeof value === 'boolean') {
              return paiement[key] === value;
            }
            
            // Cas pour les recherches partielles
            if (typeof value === 'string' && value.includes('%')) {
              const searchTerm = value.replace(/%/g, '').toLowerCase();
              const paiementValue = paiement[key]?.toString().toLowerCase() || '';
              return paiementValue.includes(searchTerm);
            }
            
            // Cas pour les tableaux
            if (Array.isArray(value)) {
              return value.includes(paiement[key]);
            }
            
            // Comparaison par défaut
            return paiement[key] === value;
          });
        });
      }
      
      // Tri
      if (options.orderBy) {
        const orderDir = options.orderDir === 'DESC' ? -1 : 1;
        paiements.sort((a, b) => {
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
        paiements = paiements.slice(start, start + options.limit);
      }
      
      // Enrichir
      const paiementsEnrichis = [];
      for (const paiement of paiements) {
        paiementsEnrichis.push(await enrichirPaiement(paiement));
      }
      
      // Retourner un seul si demandé
      if (options.unique && paiementsEnrichis.length === 1) {
        return paiementsEnrichis[0];
      }
      
      return paiementsEnrichis;
    } catch (error) {
      console.error("Erreur getData paiements:", error);
      throw error;
    }
  },

  // Garder les méthodes existantes pour compatibilité
  async getAll() {
    return this.getData();
  },

  async getById(id) {
    return this.getData({ id }, { unique: true });
  },

  async create(data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();

      const inscription = await inscriptionController.getById(data.inscriptionId);
      if (!inscription) {
        throw new Error("Inscription non trouvée");
      }

      const transaction = await transactionController.create({
        type: 'entree',
        montant: data.montantPaye,
        motif: 'Paiement scolarité',
        description: `Paiement de ${data.montantPaye} FCFA pour ${inscription.eleve || 'élève'}`,
        date: data.datePayement,
        modePaiement: data.modePaiement || 'especes',
        createdBy: data.createdBy,
        metaData: { type: 'paiement', inscriptionId: data.inscriptionId }
      });

      const newPaiement = {
        id: uuidv4(),
        inscriptionId: data.inscriptionId,
        montantPaye: Number(data.montantPaye),
        statut: data.statut || 'paye',
        montantRestant: Number(data.montantRestant || 0),
        datePayement: data.datePayement,
        modePaiement: data.modePaiement,
        motif: data.motif,
        transactionId: transaction.id,
        createdAt: now,
        updatedAt: now
      };

      await db.update((dbData) => {
        if (!dbData.paiements) dbData.paiements = [];
        dbData.paiements.push(newPaiement);

        const inscIndex = dbData.inscriptions?.findIndex(i => i.id === data.inscriptionId);
        if (inscIndex !== -1) {
          const totalPaye = dbData.paiements
            .filter(p => p.inscriptionId === data.inscriptionId)
            .reduce((sum, p) => sum + p.montantPaye, 0);
          
          dbData.inscriptions[inscIndex].statutPayement = 'partiellement';
          if (totalPaye >= dbData.inscriptions[inscIndex].fraisScolarite) {
            dbData.inscriptions[inscIndex].statutPayement = 'paye';
          }
        }
      });

      return {
        ...newPaiement,
        inscription,
        transaction
      };
    } catch (error) {
      console.error("Erreur create paiement:", error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();
      let updatedPaiement = null;

      await db.update((dbData) => {
        const index = dbData.paiements?.findIndex(p => p.id === id);
        if (index !== -1) {
          dbData.paiements[index] = {
            ...dbData.paiements[index],
            ...data,
            montantPaye: data.montantPaye ? Number(data.montantPaye) : dbData.paiements[index].montantPaye,
            updatedAt: now
          };
          updatedPaiement = dbData.paiements[index];

          if (updatedPaiement.transactionId) {
            const transactionIndex = dbData.transactions?.findIndex(t => t.id === updatedPaiement.transactionId);
            if (transactionIndex !== -1) {
              dbData.transactions[transactionIndex].montant = updatedPaiement.montantPaye;
              dbData.transactions[transactionIndex].updatedAt = now;
            }
          }
        }
      });

      return await enrichirPaiement(updatedPaiement);
    } catch (error) {
      console.error("Erreur update paiement:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const db = getDb();
      const paiement = db.data.paiements?.find(p => p.id === id);

      if (!paiement) {
        throw new Error("Paiement non trouvé");
      }

      if (paiement.transactionId) {
        await transactionController.delete(paiement.transactionId, { force: true });
      }

      await db.update((dbData) => {
        dbData.paiements = dbData.paiements?.filter(p => p.id !== id) || [];
      });

      return { success: true };
    } catch (error) {
      console.error("Erreur delete paiement:", error);
      throw error;
    }
  }
};