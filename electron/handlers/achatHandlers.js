// electron/handlers/achatHandlers.js
import { ipcMain } from 'electron';
import { achatController } from '../controllers/achatController.js';

export function initAchatHandlers() {
  console.log('📝 Enregistrement des handlers achat...');

  ipcMain.handle('achat:getAll', async () => {
    return await achatController.getAll();
  });

  ipcMain.handle('achat:getById', async (event, id) => {
    return await achatController.getById(id);
  });

  ipcMain.handle('achat:create', async (event, data) => {
    return await achatController.create(data);
  });

  ipcMain.handle('achat:update', async (event, id, data) => {
    return await achatController.update(id, data);
  });

  ipcMain.handle('achat:delete', async (event, id) => {
    return await achatController.delete(id);
  });

  console.log('✅ Handlers achat enregistrés');
}