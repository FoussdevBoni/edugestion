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
  
  console.log('✅ Handlers reset enregistrés');
}