// electron/controllers/configBulletinController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

export const configBulletinController = {
  // Récupérer la configuration (une seule)
  async getConfig() {
    try {
      const db = getDb();
      const config = db.data.configBulletin || null;

      if (!config) return null;

      return await this.enrichirConfig(config);
    } catch (error) {
      console.error("Erreur getConfig:", error);
      throw error;
    }
  },

  // Créer ou mettre à jour la configuration
  async saveConfig(data) {
    try {
      const db = getDb();
      const now = new Date().toISOString();

      const newConfig = {
        id: uuidv4(),
        interrogation: {
          actif: data?.interrogation?.actif ?? true,
          mode: data?.interrogation?.mode ?? 'moyenne',
        },
        devoir: {
          actif: data?.devoir?.actif ?? true,
          mode: data?.devoir?.mode ?? 'conserver',
        },
        composition: {
          actif: data?.composition?.actif ?? true,
          mode: data?.composition?.mode ?? 'conserver',
        },
        createdAt: now,
        updatedAt: now
      };

      await db.update((dbData) => {
        dbData.configBulletin = newConfig;
      });

      return await this.enrichirConfig(newConfig);
    } catch (error) {
      console.error("Erreur saveConfig:", error);
      throw error;
    }
  },

  // Supprimer la configuration
  async deleteConfig() {
    try {
      const db = getDb();
      await db.update((dbData) => {
        delete dbData.configBulletin;
      });
      return { success: true };
    } catch (error) {
      console.error("Erreur deleteConfig:", error);
      throw error;
    }
  },

  // Fonction utilitaire pour enrichir la configuration
  async enrichirConfig(config) {
    if (!config) return null;

    return {
      ...config,
      id: config.id,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt
    };
  }
};