// electron/handlers/evaluationHandlers.js
import { ipcMain } from 'electron';
import { evaluationController } from '../controllers/evaluationController.js';

export function initEvaluationHandlers() {
  console.log('📝 Enregistrement des handlers evaluations...');

  ipcMain.handle('evaluation:getAll', async () => {
    return await evaluationController.getAll();
  });

  ipcMain.handle('evaluation:getById', async (event, id) => {
    return await evaluationController.getById(id);
  });

  ipcMain.handle('evaluation:getByPeriode', async (event, periodeId) => {
    return await evaluationController.getByPeriode(periodeId);
  });

  ipcMain.handle('evaluation:getByNiveauScolaire', async (event, niveauScolaireId) => {
    return await evaluationController.getByNiveauScolaire(niveauScolaireId);
  });

  ipcMain.handle('evaluation:create', async (event, data) => {
    return await evaluationController.create(data);
  });

  ipcMain.handle('evaluation:update', async (event, id, data) => {
    return await evaluationController.update(id, data);
  });

  ipcMain.handle('evaluation:delete', async (event, id) => {
    return await evaluationController.delete(id);
  });

  console.log('✅ Handlers evaluations enregistrés');
}