import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDb } from './db.js';
import { initEcoleInfoHandlers } from './handlers/ecoleInfoHandler.js';
import { initNiveauScolaireHandlers } from './handlers/niveauScolaireHandler.js';
import { initCycleHandlers } from './handlers/cyclesHandler.js';
import { initNiveauClasseHandlers } from './handlers/niveauClasseHandlers.js';
import { initClasseHandlers } from './handlers/classeHandlers.js';
import { initMatiereHandlers } from './handlers/matiereHandlers.js';
import { initPeriodeHandlers } from './handlers/periodesHandlers.js';
import { initEvaluationHandlers } from './handlers/evaluationHandlers.js';
import { initEnseignantHandlers } from './handlers/enseignantHandlers.js';
import { initSeanceHandlers } from './handlers/seanceHandlers.js';
import { initEleveDataHandlers } from './handlers/eleveDataHandlers.js';
import { initInscriptionHandlers } from './handlers/inscriptionHandlers.js';
import { initNoteHandlers } from './handlers/noteHandlers.js';
import { initMaterielHandlers } from './handlers/materielHandlers.js';
import { initAchatHandlers } from './handlers/achatHandlers.js';
import { initChargeHandlers } from './handlers/chargeHandlers.js';
import { initInventaireHandlers } from './handlers/inventaireHandlers.js';
import { initTransactionHandlers } from './handlers/transactionHandlers.js';
import { initPaiementHandlers } from './handlers/paiementHandlers.js';
import { initMouvementStockHandlers } from './handlers/mouvementStockHandlers.js';
import { initStatsHandlers } from './handlers/statsHandlers.js';
import { initBulletinHandlers } from './handlers/bulletinHandlers.js';
import { initPhotoHandlers } from './handlers/photoHandlers.js';
import { initLicenceHandlers } from './handlers/licenceHandlers.js';
import { initConfigBulletinHandlers } from './handlers/configBulletinHandlers.js';
import { initImportHandlers } from './handlers/importHandlers.js';
import { initInitialisationHandlers } from './handlers/initialisationHandlers.js';
import { initResetHandlers } from './handlers/resetHandlers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "EduGestion",
    // Utilise l'icône selon l'environnement
    icon: path.join(__dirname, "../assets/icon.png"),
    titleBarStyle: 'hidden',
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),

    }
  });

  // VERIFICATION : Sommes-nous en développement ou en production ?
  const isDev = !app.isPackaged;

  if (isDev) {


    // En développement, on charge l'URL de Vite
    win.loadURL('http://localhost:5173');
    // Optionnel : ouvre les outils de développement automatiquement
    win.webContents.openDevTools();
  } else {
    // En production, on charge le fichier index.html compilé dans le dossier /dist
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Supprimer le menu par défaut (Optionnel, pour faire plus "Logiciel pro")
  win.setMenu(null);
}

// Dans main.js
app.whenReady().then(async () => {
  try {
    // 1. On attend impérativement que la DB soit prête
    await initDb();
    initEcoleInfoHandlers();
    initNiveauScolaireHandlers();
    initCycleHandlers()
    initNiveauClasseHandlers(); // ← Ajouter ici
    initClasseHandlers();
    initMatiereHandlers();
    initPeriodeHandlers();
    initEvaluationHandlers();
    initEnseignantHandlers();
    initSeanceHandlers();
    initEleveDataHandlers();
    initInscriptionHandlers();
    initNoteHandlers();
    initMaterielHandlers();
    initAchatHandlers();
    initChargeHandlers();
    initInventaireHandlers();
    initTransactionHandlers();
    initPaiementHandlers();
    initMouvementStockHandlers();
    initStatsHandlers(),
      initBulletinHandlers();
    initPhotoHandlers();
    initLicenceHandlers();
    initConfigBulletinHandlers();
    initImportHandlers();
    initInitialisationHandlers()
    initResetHandlers()
    createWindow();

    ipcMain.on('window:minimize', () => {
      const win = BrowserWindow.getFocusedWindow();
      win?.minimize();
    });

    ipcMain.on('window:maximize', () => {
      const win = BrowserWindow.getFocusedWindow();
      if (win?.isMaximized()) {
        win.unmaximize();
      } else {
        win?.maximize();
      }
    });

    ipcMain.on('window:close', () => {
      const win = BrowserWindow.getFocusedWindow();
      win?.close();
    });
  } catch (err) {
    console.error("Échec du démarrage :", err);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});