// electron/handlers/materielHandlers.js
import { ipcMain } from 'electron';
import { materielController } from '../controllers/materielController.js';

export function initMaterielHandlers() {
  console.log('📝 Enregistrement des handlers matériel...');

  ipcMain.handle('materiel:getAll', async () => {
    return await materielController.getAll();
  });

  ipcMain.handle('materiel:getById', async (event, id) => {
    return await materielController.getById(id);
  });

  ipcMain.handle('materiel:create', async (event, data) => {
    return await materielController.create(data);
  });

  ipcMain.handle('materiel:update', async (event, id, data) => {
    return await materielController.update(id, data);
  });

  ipcMain.handle('materiel:delete', async (event, id) => {
    return await materielController.delete(id);
  });

  console.log('✅ Handlers matériel enregistrés');
}