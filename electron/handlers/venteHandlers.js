// electron/handlers/venteHandlers.js
import { ipcMain } from 'electron';
import { venteController } from '../controllers/venteController.js';

export function initVenteHandlers() {
  console.log('📝 Enregistrement des handlers vente...');

  ipcMain.handle('vente:getAll', async () => {
    return await venteController.getAll();
  });

  ipcMain.handle('vente:getById', async (event, id) => {
    return await venteController.getById(id);
  });

  ipcMain.handle('vente:create', async (event, data) => {
    return await venteController.create(data);
  });

  ipcMain.handle('vente:createMany', async (event, data) => {
    return await venteController.createMany(data);
  });

  ipcMain.handle('vente:update', async (event, id, data) => {
    return await venteController.update(id, data);
  });

  ipcMain.handle('vente:delete', async (event, id) => {
    return await venteController.delete(id);
  });

  console.log('✅ Handlers vente enregistrés');
}