// electron/handlers/licenceHandlers.js
import { ipcMain } from 'electron';
import { licenceController } from '../controllers/licenceController.js';

export function initLicenceHandlers() {
  console.log('📝 Enregistrement des handlers licence...');

  ipcMain.handle('licence:getMachineId', async () => {
    return await licenceController.getMachineId();
  });

  ipcMain.handle('licence:validate', async (_, licenseKey) => {
    return await licenceController.validateLicense(licenseKey);
  });

  ipcMain.handle('licence:save', async (_, licenseKey) => {
    return await licenceController.saveLicense(licenseKey);
  });

  ipcMain.handle('licence:check', async () => {
    return await licenceController.checkStoredLicense();
  });

  ipcMain.handle('licence:clear', async () => {
    return await licenceController.clearLicense();
  });

  console.log('✅ Handlers licence enregistrés');
}