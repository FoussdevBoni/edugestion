// electron/handlers/inscriptionHandlers.js
import { ipcMain } from 'electron';
import { inscriptionController } from '../controllers/inscriptionController.js';

export function initInscriptionHandlers() {
  console.log('📝 Enregistrement des handlers inscriptions...');

  // Handler unique avec filtres
  ipcMain.handle('inscription:getData', async (_, where = {}, options = {}) => {
    return await inscriptionController.getData(where, options);
  });

  ipcMain.handle('inscription:getAll', async () => {
    return await inscriptionController.getAll();
  });

  ipcMain.handle('inscription:getActives', async () => {
    return await inscriptionController.getActives();
  });

  ipcMain.handle('inscription:getById', async (event, id) => {
    return await inscriptionController.getById(id);
  });

  ipcMain.handle('inscription:getByEleve', async (event, eleveDataId) => {
    return await inscriptionController.getByEleve(eleveDataId);
  });

  ipcMain.handle('inscription:getByClasse', async (event, classeId) => {
    return await inscriptionController.getByClasse(classeId);
  });

  ipcMain.handle('inscription:getByAnneeScolaire', async (event, anneeScolaire) => {
    return await inscriptionController.getByAnneeScolaire(anneeScolaire);
  });

  ipcMain.handle('inscription:getCurrentInscription', async (event, eleveDataId) => {
    return await inscriptionController.getCurrentInscription(eleveDataId);
  });

  ipcMain.handle('inscription:create', async (event, data) => {
    return await inscriptionController.create(data);
  });

  ipcMain.handle('inscription:update', async (event, id, data) => {
    return await inscriptionController.update(id, data);
  });

  ipcMain.handle('inscription:delete', async (event, id) => {
    return await inscriptionController.delete(id);
  });

  ipcMain.handle('inscription:inscrireNouvelEleve', async (event, data) => {
    return await inscriptionController.inscrireNouvelEleve(data);
  });

  ipcMain.handle('inscription:reinscrireEleves', async (event, data) => {
    return await inscriptionController.reinscrireEleves(data);
  });

    ipcMain.handle('inscription:desactiverEleves', async (event, data) => {
    return await inscriptionController.desactiverEleves(data);
  });
  ipcMain.handle('inscription:transfererEleves', async (event, payload) => {
    return await inscriptionController.transfererEleves(payload);
  });

    ipcMain.handle('inscription:deleteMany', async (event, ids) => {
    return await inscriptionController.deleteMany(ids);
  });
  console.log('✅ Handlers inscriptions enregistrés');
}