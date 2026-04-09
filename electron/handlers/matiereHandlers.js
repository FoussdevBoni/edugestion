// electron/handlers/matiereHandlers.js
import { ipcMain } from 'electron';
import { matiereController } from '../controllers/matiereController.js';

export function initMatiereHandlers() {
  console.log('📝 Enregistrement des handlers matieres...');

  ipcMain.handle('matiere:getAll', async () => {
    return await matiereController.getAll();
  });

  ipcMain.handle('matiere:getById', async (event, id) => {
    return await matiereController.getById(id);
  });

  ipcMain.handle('matiere:getByNiveauClasse', async (event, niveauClasseId) => {
    return await matiereController.getByNiveauClasse(niveauClasseId);
  });

  ipcMain.handle('matiere:create', async (event, data) => {
    return await matiereController.create(data);
  });

  ipcMain.handle('matiere:update', async (event, id, data) => {
    return await matiereController.update(id, data);
  });

  ipcMain.handle('matiere:delete', async (event, id) => {
    return await matiereController.delete(id);
  });

    ipcMain.handle('matiere:deleteMany', async (event, ids) => {
    return await matiereController.deleteMany(ids);
  });

  console.log('✅ Handlers matieres enregistrés');
}