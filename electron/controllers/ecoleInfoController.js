// controllers/ecoleInfoController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

export const ecoleInfoController = {
    /**
     * Crée ou remplace les informations de l'école
     * Si des infos existent déjà, elles sont écrasées
     * Si pas d'ID fourni, un nouvel ID est généré
     */
    async save(data) {
        try {
            const db = getDb();
            const now = new Date().toISOString();

            // Si les infos existent déjà, on les écrase
            const existingInfo = db.data.ecoleInfos;
            
            let newEcoleInfo;
            
            if (existingInfo && Object.keys(existingInfo).length > 0) {
                // Écraser les données existantes
                newEcoleInfo = {
                    id: data.id || existingInfo.id || uuidv4(),
                    ...data,
                    createdAt: existingInfo.createdAt || now,
                    updatedAt: now
                };
            } else {
                // Créer de nouvelles données
                newEcoleInfo = {
                    id: data.id || uuidv4(),
                    ...data,
                    createdAt: now,
                    updatedAt: now
                };
            }

            await db.update((dbData) => {
                dbData.ecoleInfos = newEcoleInfo;
            });

            return { success: true, data: newEcoleInfo };
        } catch (error) {
            console.error("Erreur lors de la sauvegarde des infos de l'école:", error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Récupère les informations de l'école
     */
    async get() {
        try {
            const db = getDb();
            return { success: true, data: db.data.ecoleInfos || null };
        } catch (error) {
            console.error("Erreur lors de la récupération des infos de l'école:", error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Met à jour les informations existantes (version alternative)
     */
    async update(data) {
        try {
            const db = getDb();
            const now = new Date().toISOString();

            if (!db.data.ecoleInfos || Object.keys(db.data.ecoleInfos).length === 0) {
                // Si rien n'existe, on crée avec les données
                const newEcoleInfo = {
                    id: data.id || uuidv4(),
                    ...data,
                    createdAt: now,
                    updatedAt: now
                };

                await db.update((dbData) => {
                    dbData.ecoleInfos = newEcoleInfo;
                });

                return { success: true, data: newEcoleInfo };
            }

            // Sinon on met à jour
            const updatedEcoleInfo = {
                ...db.data.ecoleInfos,
                ...data,
                id: data.id || db.data.ecoleInfos.id,
                updatedAt: now
            };

            await db.update((dbData) => {
                dbData.ecoleInfos = updatedEcoleInfo;
            });

            return { success: true, data: updatedEcoleInfo };
        } catch (error) {
            console.error("Erreur lors de la mise à jour des infos de l'école:", error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Supprime les informations de l'école
     */
    async delete() {
        try {
            const db = getDb();

            await db.update((dbData) => {
                dbData.ecoleInfos = null;
            });

            return { success: true, message: "Informations de l'école supprimées avec succès" };
        } catch (error) {
            console.error("Erreur lors de la suppression des infos de l'école:", error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Vérifie si les informations existent
     */
    async exists() {
        try {
            const db = getDb();
            const exists = db.data.ecoleInfos && Object.keys(db.data.ecoleInfos).length > 0;
            return { success: true, exists };
        } catch (error) {
            console.error("Erreur lors de la vérification:", error);
            return { success: false, error: error.message };
        }
    }
};