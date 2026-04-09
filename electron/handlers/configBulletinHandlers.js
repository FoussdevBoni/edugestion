// electron/handlers/configBulletinHandlers.js
import { ipcMain } from 'electron';
import { configBulletinController } from '../controllers/configBulletinController.js';

export function initConfigBulletinHandlers() {
  console.log('📝 Enregistrement des handlers configuration bulletins...');

  // Récupérer la configuration (une seule)
  ipcMain.handle('configBulletin:get', async () => {
    return await configBulletinController.getConfig();
  });

  // Sauvegarder la configuration
  ipcMain.handle('configBulletin:save', async (_, data) => {
    return await configBulletinController.saveConfig(data);
  });

  // Supprimer la configuration
  ipcMain.handle('configBulletin:delete', async () => {
    return await configBulletinController.deleteConfig();
  });

  console.log('✅ Handlers configuration bulletins enregistrés');
}