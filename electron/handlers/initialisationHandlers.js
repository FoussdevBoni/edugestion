// electron/handlers/initialisationHandlers.js
import { ipcMain } from 'electron';
import { initialisationController } from '../controllers/initialisationController.js';

export function initInitialisationHandlers() {
  console.log('📝 Enregistrement des handlers d\'initialisation...');
  
  ipcMain.handle('initialisation:importerNiveauxScolaires', async (_, payload) => {
    return await initialisationController.importerNiveauxScolaires(payload);
  });
  
  ipcMain.handle('initialisation:getNiveauxDisponibles', async (_, pays) => {
    return await initialisationController.getNiveauxDisponibles(pays);
  });
  
  ipcMain.handle('initialisation:getNiveauxExistants', async () => {
    return await initialisationController.getNiveauxExistants();
  });
  
  ipcMain.handle('initialisation:verifierStructureExistante', async () => {
    return await initialisationController.verifierStructureExistante();
  });
  
  console.log('✅ Handlers d\'initialisation enregistrés');
}