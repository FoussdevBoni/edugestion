// electron/handlers/importHandlers.js
import { ipcMain } from 'electron';
import { importController } from '../controllers/importController.js';

export function initImportHandlers() {
  ipcMain.handle('import:data', async (event, data) => {
    return await importController.importData(data);
  });
}