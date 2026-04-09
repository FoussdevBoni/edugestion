// electron/handlers/statsHandlers.js
import { ipcMain } from 'electron';
import { statsController } from '../controllers/statsController.js';

export function initStatsHandlers() {
  console.log('📝 Enregistrement des handlers statistiques...');

  ipcMain.handle('stats:comptabilite', async (_, periode) => {
    return await statsController.getComptabilite(periode);
  });

  ipcMain.handle('stats:stock', async () => {
    return await statsController.getStock();
  });

  ipcMain.handle('stats:dashboard', async () => {
    return await statsController.getDashboard();
  });

  console.log('✅ Handlers statistiques enregistrés');
}