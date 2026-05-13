// electron/handlers/resetHandlers.js
import { ipcMain } from 'electron';
import { resetController } from '../controllers/resetController.js';

export function initResetHandlers() {
  console.log('📝 Enregistrement des handlers reset...');
  
  ipcMain.handle('reset:database', async () => {
    return await resetController.resetDatabase();
  });
  
  ipcMain.handle('reset:scolaireData', async () => {
    return await resetController.resetScolaireData();
  });
  
  ipcMain.handle('export:database', async (event, options) => {
    return await resetController.exportDatabase(options);
  });
  
  ipcMain.handle('export:scolaireData', async (event, filePath) => {
    return await resetController.exportScolaireData(filePath);
  });
  
  // CHANGÉ : reçoit { fileContent, merge }
  ipcMain.handle('import:database', async (event, { fileContent, merge = false }) => {
    return await resetController.importDatabase(fileContent, { merge });
  });
  
  console.log('✅ Handlers reset enregistrés');
}