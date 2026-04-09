// handlers/ecoleInfoHandlers.js
import { ipcMain } from 'electron';
import { ecoleInfoController } from '../controllers/ecoleInfoController.js';

export function initEcoleInfoHandlers() {
    // Nouvelle méthode save (crée ou écrase)
    ipcMain.handle('ecoleInfo:save', async (event, data) => {
        return await ecoleInfoController.save(data);
    });

    // Méthode create (gardée pour compatibilité, mais utilise save)
    ipcMain.handle('ecoleInfo:create', async (event, data) => {
        console.warn('ecoleInfo:create est déprécié, utilisez ecoleInfo:save à la place');
        return await ecoleInfoController.save(data);
    });

    // Récupérer les informations
    ipcMain.handle('ecoleInfo:get', async () => {
        return await ecoleInfoController.get();
    });

    // Mettre à jour (crée si n'existe pas)
    ipcMain.handle('ecoleInfo:update', async (event, data) => {
        return await ecoleInfoController.update(data);
    });

    // Supprimer les informations
    ipcMain.handle('ecoleInfo:delete', async () => {
        return await ecoleInfoController.delete();
    });

    // Vérifier si les informations existent
    ipcMain.handle('ecoleInfo:exists', async () => {
        return await ecoleInfoController.exists();
    });
}