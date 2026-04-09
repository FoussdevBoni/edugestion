// electron/utils/machineId.js
import { machineIdSync } from 'node-machine-id';
import { networkInterfaces } from 'os';

export function getMachineId() {
  try {
    // ID matériel unique
    const machineId = machineIdSync();
    
    // Ajouter l'adresse MAC pour plus de précision
    const nets = networkInterfaces();
    let macAddress = '';
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        if (!net.internal && net.mac !== '00:00:00:00:00:00') {
          macAddress = net.mac;
          break;
        }
      }
      if (macAddress) break;
    }
    
    // Combiner les deux
    return `${machineId}-${macAddress}`;
  } catch (error) {
    console.error("Erreur génération machine ID:", error);
    // Fallback
    return `ID-${Date.now()}-${Math.random().toString(36)}`;
  }
}