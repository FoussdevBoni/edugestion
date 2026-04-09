// electron/handlers/niveauScolaireHandlers.js
import { ipcMain } from 'electron';
import { niveauScolaireController } from '../controllers/niveauScolaireController.js';

export function initNiveauScolaireHandlers() {
  console.log('📝 Enregistrement des handlers niveauxScolaires...');

  ipcMain.handle('niveauScolaire:getAll', async () => {
    return await niveauScolaireController.getAll();
  });

  ipcMain.handle('niveauScolaire:getById', async (event, id) => {
    return await niveauScolaireController.getById(id);
  });

  ipcMain.handle('niveauScolaire:create', async (event, data) => {
    return await niveauScolaireController.create(data);
  });

    ipcMain.handle('niveauScolaire:createMany', async (event, niveux) => {
    return await niveauScolaireController.createManyNiveauScolaire(niveux);
  });


  ipcMain.handle('niveauScolaire:update', async (event, id, data) => {
    return await niveauScolaireController.update(id, data);
  });

  ipcMain.handle('niveauScolaire:delete', async (event, id) => {
    return await niveauScolaireController.delete(id);
  });

  console.log('✅ Handlers niveauxScolaires enregistrés');
}