// src/services/ecoleInfosService.ts
import { BaseEcoleInfos } from "../utils/types/base";
import { EcoleInfo } from "../utils/types/data";

// src/services/ecoleInfosService.ts
const invokeIpc = async (channel: string, ...args: any[]) => {
  console.log(`Appel IPC vers ${channel} avec args:`, args);
  
  if ((window as any).electron && (window as any).electron.ipcRenderer) {
    console.log('electron.ipcRenderer disponible');
    try {
      const result = await (window as any).electron.ipcRenderer.invoke(channel, ...args);
      console.log(`Résultat de ${channel}:`, result);
      return result;
    } catch (error) {
      console.error(`Erreur IPC pour ${channel}:`, error);
      throw error;
    }
  } else {
    console.error('electron.ipcRenderer non disponible');
    return null;
  }
};

export const ecoleInfosService = {
    async testPing() {
        try {
            return await invokeIpc('test:ping');
        } catch (error) {
            console.error("Erreur test:", error);
            throw error;
        }
    },

    async create(payload: BaseEcoleInfos) {
        try {
            const response = await invokeIpc('ecoleInfo:create', payload);
            console.log('Réponse brute du backend:', response); // ← AJOUTE CE LOG


            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data as EcoleInfo;
        } catch (error) {
            console.error("Erreur lors de la création des infos de l'école:", error);
            throw error;
        }
    },

    async update(payload: Partial<BaseEcoleInfos>) {
        try {
            const response = await invokeIpc('ecoleInfo:update', payload);

            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data as EcoleInfo;
        } catch (error) {
            console.error("Erreur lors de la mise à jour des infos de l'école:", error);
            throw error;
        }
    },

    async get(): Promise<EcoleInfo | null> {
        try {
            const response = await invokeIpc('ecoleInfo:get');
            console.log('Réponse brute du backend:', response); // ← AJOUTE CE LOG

            if (!response?.success) {
                throw new Error(response?.error);
            }

            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des infos de l'école:", error);
            throw error;
        }
    },

    async delete() {
        try {
            const response = await invokeIpc('ecoleInfo:delete');

            if (!response.success) {
                throw new Error(response.error);
            }

            return response.data;
        } catch (error) {
            console.error("Erreur lors de la suppression des infos de l'école:", error);
            throw error;
        }
    }
};