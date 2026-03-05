import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // EleveData
  getElevesData: () => ipcRenderer.invoke('get-eleves-data'),
  addEleveData: (data) => ipcRenderer.invoke('add-eleve-data', data),
  updateEleveData: (id, data) => ipcRenderer.invoke('update-eleve-data', id, data),
  deleteEleveData: (id) => ipcRenderer.invoke('delete-eleve-data', id),

  // Inscriptions
  getInscriptions: (options) => ipcRenderer.invoke('get-inscriptions', options),
  addInscription: (data) => ipcRenderer.invoke('add-inscription', data),
  updateInscription: (id, data) => ipcRenderer.invoke('update-inscription', id, data),
  deleteInscription: (id) => ipcRenderer.invoke('delete-inscription', id),

  // Eleves
  getEleves: (options) => ipcRenderer.invoke('get-eleves', options),
  updateEleve: (id, data) => ipcRenderer.invoke('update-eleve', id, data),
  deleteEleve: (id) => ipcRenderer.invoke('delete-eleve', id)
});