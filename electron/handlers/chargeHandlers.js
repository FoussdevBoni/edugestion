// electron/handlers/chargeHandlers.js
import { ipcMain } from 'electron';
import { chargeController } from '../controllers/chargeController.js';

export function initChargeHandlers() {
  console.log('📝 Enregistrement des handlers charge...');

  ipcMain.handle('charge:getAll', async () => {
    return await chargeController.getAll();
  });

  ipcMain.handle('charge:getById', async (event, id) => {
    return await chargeController.getById(id);
  });

  ipcMain.handle('charge:create', async (event, data) => {
    return await chargeController.create(data);
  });

  ipcMain.handle('charge:update', async (event, id, data) => {
    return await chargeController.update(id, data);
  });

  ipcMain.handle('charge:delete', async (event, id) => {
    return await chargeController.delete(id);
  });

  console.log('✅ Handlers charge enregistrés');
}