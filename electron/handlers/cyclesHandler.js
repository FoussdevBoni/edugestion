// electron/handlers/cycleHandlers.js
import { ipcMain } from 'electron';
import { cycleController } from '../controllers/cycleController.js';

export function initCycleHandlers() {
  console.log('📝 Enregistrement des handlers cycles...');

  ipcMain.handle('cycle:getAll', async () => {
    return await cycleController.getAll();
  });

  ipcMain.handle('cycle:getById', async (event, id) => {
    return await cycleController.getById(id);
  });

  ipcMain.handle('cycle:getByNiveauScolaire', async (event, niveauScolaireId) => {
    return await cycleController.getByNiveauScolaire(niveauScolaireId);
  });

  ipcMain.handle('cycle:create', async (event, data) => {
    return await cycleController.create(data);
  });

  ipcMain.handle('cycle:createMany', async (event, cycles) => {
    return await cycleController.createManyCycle(cycles);
  });

  ipcMain.handle('cycle:update', async (event, id, data) => {
    return await cycleController.update(id, data);
  });

  ipcMain.handle('cycle:delete', async (event, id) => {
    return await cycleController.delete(id);
  });

  console.log('✅ Handlers cycles enregistrés');
}