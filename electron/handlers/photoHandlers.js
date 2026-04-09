// electron/handlers/photoHandlers.js
import { ipcMain } from 'electron';
import { photoController } from '../controllers/photoController.js';

export function initPhotoHandlers() {
  console.log('📝 Enregistrement des handlers photos...');

  // Pour photos élèves (upload multiple)
  ipcMain.handle('photo:uploadPhotos', async (_, data) => {
    return await photoController.uploadPhotos(data);
  });

  // Pour fichiers génériques (logo, en-tête, etc.)
  ipcMain.handle('photo:uploadFile', async (_, data) => {
    return await photoController.uploadFile(data);
  });

  // Récupérer photo élève par matricule
  ipcMain.handle('photo:getPhoto', async (_, matricule) => {
    return await photoController.getPhoto(matricule);
  });

  // Récupérer un fichier par son nom
  ipcMain.handle('photo:getFile', async (_, fileName, type) => {
    return await photoController.getFile(fileName, type);
  });

  // Récupérer un fichier en base64
  ipcMain.handle('photo:getFileBase64', async (_, fileName, type) => {
    return await photoController.getFileBase64(fileName, type);
  });

  console.log('✅ Handlers photos enregistrés');
}