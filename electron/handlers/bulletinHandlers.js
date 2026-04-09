// electron/handlers/bulletinHandlers.js
import { ipcMain } from 'electron';
import { bulletinController } from '../controllers/bulletinController.js';

export function initBulletinHandlers() {
  console.log('📝 Enregistrement des handlers bulletins...');

  // Récupération
  ipcMain.handle('bulletin:getAll', async () => {
    return await bulletinController.getAll();
  });

  ipcMain.handle('bulletin:getById', async (_, id) => {
    return await bulletinController.getById(id);
  });

  ipcMain.handle('bulletin:getByPeriode', async (_, periodeId) => {
    return await bulletinController.getByPeriode(periodeId);
  });

   ipcMain.handle('bulletin:getByPeriodeAndInscription', async (_, data) => {
    return await bulletinController.getByPeriodeAndInscription(data);
  });

  // Création unique (squelette)
  ipcMain.handle('bulletin:createUnique', async (_, data) => {
    return await bulletinController.createUnique(data);
  });

  // Création en masse (squelettes)
  ipcMain.handle('bulletin:createMultiple', async (_, data) => {
    return await bulletinController.createMultiple(data);
  });

  // Génération en masse (calculs avec config)
  ipcMain.handle('bulletin:generateMultiple', async (_, data) => {
    return await bulletinController.generateMultiple(data);
  });

  // Mise à jour (vie scolaire, commentaires)
  ipcMain.handle('bulletin:update', async (_, id, data) => {
    return await bulletinController.update(id, data);
  });

    // Mise à jour (vie scolaire, commentaires)
  ipcMain.handle('bulletin:save', async (_, payload) => {
    return await bulletinController.saveBulletin(payload);
  });

  // Suppression
  ipcMain.handle('bulletin:delete', async (_, id) => {
    return await bulletinController.delete(id);
  });

    ipcMain.handle('bulletin:deleteMany', async (_,ids) => {
    return await bulletinController.deleteMany(ids);
  });

  console.log('✅ Handlers bulletins enregistrés');
}