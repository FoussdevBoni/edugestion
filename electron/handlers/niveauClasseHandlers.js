// electron/handlers/niveauClasseHandlers.js
import { ipcMain } from 'electron';
import { niveauClasseController } from '../controllers/niveauClasseController.js';

export function initNiveauClasseHandlers() {
  console.log('📝 Enregistrement des handlers niveauxClasses...');

  ipcMain.handle('niveauClasse:getAll', async () => {
    return await niveauClasseController.getAll();
  });

  ipcMain.handle('niveauClasse:getById', async (event, id) => {
    return await niveauClasseController.getById(id);
  });

  ipcMain.handle('niveauClasse:getByCycle', async (event, cycleId) => {
    return await niveauClasseController.getByCycle(cycleId);
  });

  ipcMain.handle('niveauClasse:create', async (event, data) => {
    return await niveauClasseController.create(data);
  });

  ipcMain.handle('niveauClasse:createMany', async (event, niveaux) => {
    return await niveauClasseController.createManyNiveauClasse(niveaux);
  });

  ipcMain.handle('niveauClasse:update', async (event, id, data) => {
    return await niveauClasseController.update(id, data);
  });

  ipcMain.handle('niveauClasse:delete', async (event, id) => {
    return await niveauClasseController.delete(id);
  });

  console.log('✅ Handlers niveauxClasses enregistrés');
}