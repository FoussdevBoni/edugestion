// electron/handlers/eleveDataHandlers.js
import { ipcMain } from 'electron';
import { eleveDataController } from '../controllers/eleveDataController.js';

export function initEleveDataHandlers() {
  console.log('📝 Enregistrement des handlers eleveData...');

  ipcMain.handle('eleveData:getAll', async () => {
    return await eleveDataController.getAll();
  });

  ipcMain.handle('eleveData:getById', async (event, id) => {
    return await eleveDataController.getById(id);
  });

  ipcMain.handle('eleveData:getByMatricule', async (event, matricule) => {
    return await eleveDataController.getByMatricule(matricule);
  });

  ipcMain.handle('eleveData:create', async (event, data) => {
    return await eleveDataController.create(data);
  });

  ipcMain.handle('eleveData:update', async (event, id, data) => {
    return await eleveDataController.update(id, data);
  });

  ipcMain.handle('eleveData:delete', async (event, id) => {
    return await eleveDataController.delete(id);
  });

  console.log('✅ Handlers eleveData enregistrés');
}