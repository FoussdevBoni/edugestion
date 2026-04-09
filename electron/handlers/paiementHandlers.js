// electron/handlers/paiementHandlers.js
import { ipcMain } from 'electron';
import { paiementController } from '../controllers/paiementController.js';

export function initPaiementHandlers() {
  console.log('📝 Enregistrement des handlers paiement...');

  // Handler unique avec filtres
  ipcMain.handle('paiement:getData', async (_, where = {}, options = {}) => {
    return await paiementController.getData(where, options);
  });

  // Garder pour compatibilité
  ipcMain.handle('paiement:getAll', async () => {
    return await paiementController.getAll();
  });

  ipcMain.handle('paiement:getById', async (_, id) => {
    return await paiementController.getById(id);
  });

  ipcMain.handle('paiement:create', async (_, data) => {
    return await paiementController.create(data);
  });

  ipcMain.handle('paiement:update', async (_, id, data) => {
    return await paiementController.update(id, data);
  });

  ipcMain.handle('paiement:delete', async (_, id) => {
    return await paiementController.delete(id);
  });

  console.log('✅ Handlers paiement enregistrés');
}