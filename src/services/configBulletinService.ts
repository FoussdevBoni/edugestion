// src/services/configBulletinService.ts
import { invokeIpc } from "../utils/invokeIpc";
import { BaseConfigBulletin } from "../utils/types/base";
import { ConfigBulletin } from "../utils/types/data";

export const configBulletinService = {
  // Récupérer la configuration (une seule)
  async get(): Promise<ConfigBulletin | null> {
    return await invokeIpc('configBulletin:get');
  },

  // Sauvegarder la configuration
  async save(data: BaseConfigBulletin): Promise<ConfigBulletin> {
    return await invokeIpc('configBulletin:save', data);
  },

  // Supprimer la configuration
  async delete(): Promise<{ success: boolean }> {
    return await invokeIpc('configBulletin:delete');
  }
};