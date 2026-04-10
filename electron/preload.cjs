// electron/preload.cjs
const { contextBridge, ipcRenderer } = require('electron');

console.log("🛠️ PRELOAD : Initialisation...");

try {
  // Expose l'API principale
  contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
      invoke: (channel, ...args) => {
        console.log(`📡 IPC invoke: ${channel}`, args);
        return ipcRenderer.invoke(channel, ...args);
      },
      on: (channel, func) => {
        console.log(`📡 IPC on: ${channel}`);
        ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
      },
      removeAllListeners: (channel) => {
        console.log(`📡 IPC removeAllListeners: ${channel}`);
        ipcRenderer.removeAllListeners(channel);
      }
    },

    minimizeWindow: () => ipcRenderer.send('window:minimize'),
    maximizeWindow: () => ipcRenderer.send('window:maximize'),
    closeWindow: () => ipcRenderer.send('window:close'),
    test: 'Hello'
  });

  console.log("✅ PRELOAD : API exposée avec succès");
  console.log("📦 API disponible sur window.electron.ipcRenderer");

} catch (error) {
  console.error("❌ PRELOAD : Erreur fatale", error);
}