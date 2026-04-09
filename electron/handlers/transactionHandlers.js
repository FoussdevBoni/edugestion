// electron/handlers/transactionHandlers.js
import { ipcMain } from 'electron';
import { transactionController } from '../controllers/transactionController.js';

export function initTransactionHandlers() {
  console.log('📝 Enregistrement des handlers transaction...');

  ipcMain.handle('transaction:getAll', async () => {
    return await transactionController.getAll();
  });

  ipcMain.handle('transaction:getById', async (event, id) => {
    return await transactionController.getById(id);
  });

  ipcMain.handle('transaction:getByType', async (event, type) => {
    return await transactionController.getByType(type);
  });

  ipcMain.handle('transaction:create', async (event, data) => {
    return await transactionController.create(data);
  });

  ipcMain.handle('transaction:update', async (event, id, data) => {
    return await transactionController.update(id, data);
  });

  ipcMain.handle('transaction:delete', async (event, id) => {
    return await transactionController.delete(id);
  });

  console.log('✅ Handlers transaction enregistrés');
}