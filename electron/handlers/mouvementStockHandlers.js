// electron/handlers/mouvementStockHandlers.js
import { ipcMain } from 'electron';
import { mouvementStockController } from '../controllers/mouvementStockController.js';

export function initMouvementStockHandlers() {
  console.log('📝 Enregistrement des handlers mouvement de stock...');

  ipcMain.handle('mouvementStock:getAll', async () => {
    return await mouvementStockController.getAll();
  });

  ipcMain.handle('mouvementStock:getByMateriel', async (event, materielId) => {
    return await mouvementStockController.getByMateriel(materielId);
  });

  ipcMain.handle('mouvementStock:getHistoriqueComplet', async (event, materielId) => {
    return await mouvementStockController.getHistoriqueComplet(materielId);
  });

  console.log('✅ Handlers mouvement de stock enregistrés');
}