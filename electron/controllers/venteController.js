// electron/controllers/venteController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { transactionController } from './transactionController.js';
import { materielController } from './materielController.js';
import { inscriptionController } from './inscriptionController.js';
import { sortDataByDate } from '../utils/sortDataByDate.js';

function generateVenteReference() {
    const now = new Date();
    const annee = now.getFullYear();
    const mois = String(now.getMonth() + 1).padStart(2, '0');
    const jour = String(now.getDate()).padStart(2, '0');
    const heures = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const secondes = String(now.getSeconds()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    return `VENT-${annee}${mois}${jour}-${heures}${minutes}${secondes}-${random}`;
}


export async function enrichirVente(vente) {
    if (!vente) return null;

    try {
        const [eleve, materiel, transaction] = await Promise.all([
            vente.eleveId ? inscriptionController.getById(vente.eleveId) : Promise.resolve(null),
            materielController.getById(vente.materielId),
            transactionController.getById(vente.transactionId)
        ]);

        return {
            ...vente,
            eleve: eleve || null,
            materiel: materiel || null,
            transaction: transaction || null
        };
    } catch (error) {
        console.error("Erreur enrichirVente:", error);
        return vente;
    }
}

export const venteController = {
    async getAll() {
        try {
            const db = getDb();
            const ventes = db.data.ventes || [];
            const sortedVentes = sortDataByDate(ventes, 'date');

            // Enrichir chaque vente
            const ventesEnrichies = await Promise.all(
                sortedVentes.map(vente => enrichirVente(vente))
            );

            return ventesEnrichies;
        } catch (error) {
            console.error("Erreur getAll ventes:", error);
            throw error;
        }
    },

    async getById(id) {
        try {
            const db = getDb();
            const vente = db.data.ventes?.find(v => v.id === id) || null;

            if (!vente) return null;

            return await enrichirVente(vente);
        } catch (error) {
            console.error("Erreur getById vente:", error);
            throw error;
        }
    },

    async create(data) {
        try {
            const db = getDb();
            const now = new Date().toISOString();

            // Vérifier que le matériel existe
            const materiel = await materielController.getById(data.materielId);
            if (!materiel) {
                throw new Error("Matériel non trouvé");
            }

            // Vérifier le stock disponible
            if (materiel.quantite < data.quantite) {
                throw new Error(`Stock insuffisant. Disponible: ${materiel.quantite}, Demandé: ${data.quantite}`);
            }

            // Calculer le total
            const total = data.quantite * data.prixUnitaire;

            // Générer la référence
            const reference = data.referenceExterne || generateVenteReference();

            // 1. Créer la transaction (entrée d'argent)
            const transaction = await transactionController.create({
                type: 'entree',
                montant: total,
                motif: 'Vente matériel',
                description: `Vente de ${data.quantite} ${materiel.nom} - Réf: ${reference}`,
                date: data.date || now,
                modePaiement: data.modePaiement,
                createdBy: data.createdBy,
                metaData: { type: 'vente', reference }
            });

            // 2. Créer la vente (données brutes)
            const newVente = {
                id: uuidv4(),
                reference: reference,  // Ajout de la référence
                materielId: data.materielId,
                quantite: Number(data.quantite),
                prixUnitaire: Number(data.prixUnitaire),
                total: total,
                eleveId: data.eleveId || null,
                date: data.date || now,
                modePaiement: data.modePaiement,
                referenceExterne: data.referenceExterne || '',
                notes: data.notes || '',
                transactionId: transaction.id,
                createdBy: data.createdBy,
                createdAt: now,
                updatedAt: now
            };

            await db.update((dbData) => {
                if (!dbData.ventes) dbData.ventes = [];
                dbData.ventes.push(newVente);
            });

            // 3. Mettre à jour le stock du matériel (SORTIE)
            await materielController.updateStock(data.materielId, -data.quantite, {
                type: 'sortie',
                motif: 'Vente',
                referenceId: newVente.id,
                referenceType: 'vente',
                createdBy: data.createdBy
            });

            // Retourner la vente enrichie
            return await enrichirVente(newVente);
        } catch (error) {
            console.error("Erreur create vente:", error);
            throw error;
        }
    },

    async createMany(ventesList) {
        try {
            const ventesCreees = [];

            for (const data of ventesList) {
                const vente = await this.create(data);
                ventesCreees.push(vente);
            }

            return ventesCreees;
        } catch (error) {
            console.error("Erreur createMany ventes:", error);
            throw error;
        }
    },

    async update(id, data) {
        try {
            const db = getDb();
            const now = new Date().toISOString();
            let updatedVente = null;
            let ancienneVente = null;

            await db.update((dbData) => {
                const index = dbData.ventes?.findIndex(v => v.id === id);
                if (index !== -1) {
                    ancienneVente = { ...dbData.ventes[index] };

                    dbData.ventes[index] = {
                        ...ancienneVente,
                        materielId: data.materielId ?? ancienneVente.materielId,
                        quantite: data.quantite ? Number(data.quantite) : ancienneVente.quantite,
                        prixUnitaire: data.prixUnitaire ? Number(data.prixUnitaire) : ancienneVente.prixUnitaire,
                        eleveId: data.eleveId !== undefined ? data.eleveId : ancienneVente.eleveId,
                        date: data.date ?? ancienneVente.date,
                        modePaiement: data.modePaiement ?? ancienneVente.modePaiement,
                        referenceExterne: data.referenceExterne ?? ancienneVente.referenceExterne,
                        notes: data.notes ?? ancienneVente.notes,
                        total: (data.quantite || ancienneVente.quantite) * (data.prixUnitaire || ancienneVente.prixUnitaire),
                        updatedAt: now
                    };
                    updatedVente = dbData.ventes[index];
                }
            });

            if (!updatedVente) {
                throw new Error("Vente non trouvée");
            }

            // Gérer la modification du stock si la quantité change
            if (data.quantite && ancienneVente) {
                const difference = ancienneVente.quantite - updatedVente.quantite;
                if (difference !== 0) {
                    await materielController.updateStock(updatedVente.materielId, difference, {
                        type: difference > 0 ? 'entree' : 'sortie',
                        motif: 'Modification vente',
                        referenceId: id,
                        referenceType: 'vente',
                        createdBy: updatedVente.createdBy
                    });
                }
            }

            // Mettre à jour le montant de la transaction
            if (updatedVente && ancienneVente && updatedVente.total !== ancienneVente.total) {
                await transactionController.update(updatedVente.transactionId, {
                    montant: updatedVente.total
                });
            }

            return await enrichirVente(updatedVente);
        } catch (error) {
            console.error("Erreur update vente:", error);
            throw error;
        }
    },

    async delete(id) {
        try {
            const db = getDb();
            const vente = db.data.ventes?.find(v => v.id === id);

            if (!vente) {
                throw new Error("Vente non trouvée");
            }

            // Supprimer d'abord la transaction liée
            if (vente.transactionId) {
                await transactionController.delete(vente.transactionId, { force: true });
            }

            // Annuler l'effet sur le stock (rentrer la quantité)
            await materielController.updateStock(vente.materielId, vente.quantite, {
                type: 'entree',
                motif: 'Annulation vente',
                referenceId: id,
                referenceType: 'vente',
                createdBy: vente.createdBy
            });

            // Supprimer la vente
            await db.update((dbData) => {
                dbData.ventes = dbData.ventes?.filter(v => v.id !== id) || [];
            });

            return { success: true };
        } catch (error) {
            console.error("Erreur delete vente:", error);
            throw error;
        }
    }
};