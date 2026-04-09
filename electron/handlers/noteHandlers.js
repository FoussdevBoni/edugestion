// electron/handlers/noteHandlers.js
import { ipcMain } from 'electron';
import { noteController } from '../controllers/noteController.js';

export function initNoteHandlers() {
  console.log('📝 Enregistrement des handlers notes...');

  ipcMain.handle('note:getAll', async () => {
    return await noteController.getAll();
  });

  ipcMain.handle('note:getById', async (event, id) => {
    return await noteController.getById(id);
  });

  ipcMain.handle('note:getByInscription', async (event, inscriptionId) => {
    return await noteController.getByInscription(inscriptionId);
  });

  ipcMain.handle('note:getByMatiere', async (event, matiereId) => {
    return await noteController.getByMatiere(matiereId);
  });

  ipcMain.handle('note:getByPeriode', async (event, periodeId) => {
    return await noteController.getByPeriode(periodeId);
  });

  ipcMain.handle('note:getByClasse', async (event, classeId) => {
    return await noteController.getByClasse(classeId);
  });

  ipcMain.handle('note:getByEleve', async (event, eleveDataId) => {
    return await noteController.getByEleve(eleveDataId);
  });

  ipcMain.handle('note:create', async (event, data) => {
    return await noteController.create(data);
  });

  ipcMain.handle('note:createBatch', async (event, dataArray) => {
    return await noteController.createBatch(dataArray);
  });

  ipcMain.handle('note:update', async (event, id, data) => {
    return await noteController.update(id, data);
  });

  ipcMain.handle('note:delete', async (event, id) => {
    return await noteController.delete(id);
  });

  ipcMain.handle('note:close', async (event, id) => {
    return await noteController.close(id);
  });
    ipcMain.handle('note:closeBatch', async (event, ids) => {
    return await noteController.closeBatch(ids);
  });

    ipcMain.handle('note:import', async (event, data) => {
    return await noteController.importFromExcel(data);
  });



  console.log('✅ Handlers notes enregistrés');
}