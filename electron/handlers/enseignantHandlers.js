// electron/handlers/enseignantHandlers.js
import { ipcMain } from 'electron';
import { enseignantController } from '../controllers/enseignantController.js';

export function initEnseignantHandlers() {
  console.log('📝 Enregistrement des handlers enseignants...');

  ipcMain.handle('enseignant:getAll', async () => {
    return await enseignantController.getAll();
  });

  ipcMain.handle('enseignant:getById', async (event, id) => {
    return await enseignantController.getById(id);
  });

  ipcMain.handle('enseignant:getByMatiere', async (event, matiereId) => {
    return await enseignantController.getByMatiere(matiereId);
  });

  ipcMain.handle('enseignant:getByClasse', async (event, classeId) => {
    return await enseignantController.getByClasse(classeId);
  });

  ipcMain.handle('enseignant:create', async (event, data) => {
    return await enseignantController.create(data);
  });

  ipcMain.handle('enseignant:update', async (event, id, data) => {
    return await enseignantController.update(id, data);
  });

  ipcMain.handle('enseignant:delete', async (event, id) => {
    return await enseignantController.delete(id);
  });

  console.log('✅ Handlers enseignants enregistrés');
}