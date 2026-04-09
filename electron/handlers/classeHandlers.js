// electron/handlers/classeHandlers.js
import { ipcMain } from 'electron';
import { classeController } from '../controllers/classeController.js';

export function initClasseHandlers() {
  console.log('📝 Enregistrement des handlers classes...');

  ipcMain.handle('classe:getAll', async () => {
    return await classeController.getAll();
  });

  ipcMain.handle('classe:getById', async (event, id) => {
    return await classeController.getById(id);
  });

  ipcMain.handle('classe:getByNiveauClasse', async (event, niveauClasseId) => {
    return await classeController.getByNiveauClasse(niveauClasseId);
  });

  ipcMain.handle('classe:create', async (event, data) => {
    return await classeController.create(data);
  });

  ipcMain.handle('classe:createMany', async (event, classes) => {
    return await classeController.createManyClasse(classes);
  });

  ipcMain.handle('classe:update', async (event, id, data) => {
    return await classeController.update(id, data);
  });

  ipcMain.handle('classe:delete', async (event, id) => {
    return await classeController.delete(id);
  });

  ipcMain.handle('classe:deleteMany', async (event, ids) => {
    return await classeController.deleteMany(ids);
  });

  console.log('✅ Handlers classes enregistrés');
}