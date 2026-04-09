// electron/handlers/periodeHandlers.js
import { ipcMain } from 'electron';
import { periodeController } from '../controllers/periodeController.js';

export function initPeriodeHandlers() {
  console.log('📝 Enregistrement des handlers periodes...');

  ipcMain.handle('periode:getAll', async () => {
    return await periodeController.getAll();
  });

  ipcMain.handle('periode:getById', async (event, id) => {
    return await periodeController.getById(id);
  });

  ipcMain.handle('periode:getByNiveauScolaire', async (event, niveauScolaireId) => {
    return await periodeController.getByNiveauScolaire(niveauScolaireId);
  });

  ipcMain.handle('periode:getByAnneeScolaire', async (event, anneeScolaire) => {
    return await periodeController.getByAnneeScolaire(anneeScolaire);
  });

  ipcMain.handle('periode:create', async (event, data) => {
    return await periodeController.create(data);
  });

  ipcMain.handle('periode:update', async (event, id, data) => {
    return await periodeController.update(id, data);
  });

  ipcMain.handle('periode:delete', async (event, id) => {
    return await periodeController.delete(id);
  });

  console.log('✅ Handlers periodes enregistrés');
}