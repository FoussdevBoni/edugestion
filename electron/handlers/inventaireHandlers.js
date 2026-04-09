// electron/handlers/inventaireHandlers.js
import { ipcMain } from 'electron';
import { inventaireController } from '../controllers/inventaireController.js';

export function initInventaireHandlers() {
  console.log('📝 Enregistrement des handlers inventaire...');

  ipcMain.handle('inventaire:getAll', async () => {
    return await inventaireController.getAll();
  });

  ipcMain.handle('inventaire:getById', async (event, id) => {
    return await inventaireController.getById(id);
  });

  ipcMain.handle('inventaire:create', async (event, data) => {
    return await inventaireController.create(data);
  });

  ipcMain.handle('inventaire:update', async (event, id, data) => {
    return await inventaireController.update(id, data);
  });

  ipcMain.handle('inventaire:delete', async (event, id) => {
    return await inventaireController.delete(id);
  });

  console.log('✅ Handlers inventaire enregistrés');
}