// electron/handlers/seanceHandlers.js
import { ipcMain } from 'electron';
import { seanceController } from '../controllers/seanceController.js';

export function initSeanceHandlers() {
  console.log('📝 Enregistrement des handlers seances...');

  ipcMain.handle('seance:getAll', async () => {
    return await seanceController.getAll();
  });

  ipcMain.handle('seance:getById', async (event, id) => {
    return await seanceController.getById(id);
  });

  ipcMain.handle('seance:getByClasse', async (event, classeId) => {
    return await seanceController.getByClasse(classeId);
  });

  ipcMain.handle('seance:getByEnseignant', async (event, enseignantId) => {
    return await seanceController.getByEnseignant(enseignantId);
  });

  ipcMain.handle('seance:getByJour', async (event, jour) => {
    return await seanceController.getByJour(jour);
  });

  ipcMain.handle('seance:create', async (event, data) => {
    return await seanceController.create(data);
  });

  ipcMain.handle('seance:update', async (event, id, data) => {
    return await seanceController.update(id, data);
  });

  ipcMain.handle('seance:delete', async (event, id) => {
    return await seanceController.delete(id);
  });

  console.log('✅ Handlers seances enregistrés');
}