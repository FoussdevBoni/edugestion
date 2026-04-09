// electron/controllers/licenceController.js
import { getDb } from '../db.js';
import crypto from 'crypto';
import machineId from 'node-machine-id';
import { networkInterfaces } from 'os';

// Fonction de hash identique au frontend
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).toUpperCase();
}

// Clé secrète (à mettre dans .env)
const SECRET_KEY = process.env.LICENSE_SECRET_KEY || 'MaSuperCléSecrèteQuePersonneNeConnaît123!@';

export const licenceController = {
  getMachineId() {
    try {
      const id = machineId.machineIdSync();
      
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
      
      const uniqueId = crypto
        .createHash('sha256')
        .update(`${id}-${macAddress}`)
        .digest('hex')
        .substring(0, 16)
        .toUpperCase();
      
      return {
        success: true,
        machineId: uniqueId,
        formattedId: uniqueId.match(/.{1,4}/g)?.join('-') || uniqueId
      };
    } catch (error) {
      console.error("Erreur getMachineId:", error);
      return {
        success: false,
        machineId: null,
        formattedId: null,
        error: error.message
      };
    }
  },

  validateLicense(licenseKey) {
    try {
      const { machineId: currentMachineId } = this.getMachineId();
      
      if (!currentMachineId) {
        return {
          valid: false,
          reason: "Impossible de récupérer l'identifiant machine"
        };
      }

      const parts = licenseKey.split('|');
      if (parts.length !== 3) {
        return {
          valid: false,
          reason: "Format de licence invalide"
        };
      }

      const [storedMachineId, expirationDate, signature] = parts;

      if (storedMachineId !== currentMachineId) {
        return {
          valid: false,
          reason: "Cette licence n'est pas valide pour cette machine"
        };
      }

      const expectedSignature = simpleHash(storedMachineId + expirationDate + SECRET_KEY);

      if (signature !== expectedSignature) {
        return {
          valid: false,
          reason: "Signature de licence invalide"
        };
      }

      const now = new Date();
      const expDate = new Date(expirationDate);

      if (now > expDate) {
        return {
          valid: false,
          reason: "Licence expirée",
          expired: true,
          expirationDate: expDate.toISOString()
        };
      }

      const daysLeft = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
      
      return {
        valid: true,
        expirationDate: expDate.toISOString(),
        daysLeft,
        machineId: storedMachineId
      };

    } catch (error) {
      console.error("Erreur validateLicense:", error);
      return {
        valid: false,
        reason: "Erreur lors de la validation de la licence"
      };
    }
  },

  async saveLicense(licenseKey) {
    try {
      const validation = this.validateLicense(licenseKey);
      
      if (!validation.valid) {
        return validation;
      }

      const db = getDb();
      
      await db.update((dbData) => {
        dbData.licence = {
          key: licenseKey,
          machineId: validation.machineId,
          expirationDate: validation.expirationDate,
          activatedAt: new Date().toISOString(),
          lastChecked: new Date().toISOString()
        };
      });

      return {
        success: true,
        ...validation
      };

    } catch (error) {
      console.error("Erreur saveLicense:", error);
      return {
        success: false,
        valid: false,
        reason: "Erreur lors de la sauvegarde de la licence"
      };
    }
  },

  async getStoredLicense() {
    try {
      const db = getDb();
      return db.data.licence || null;
    } catch (error) {
      console.error("Erreur getStoredLicense:", error);
      return null;
    }
  },

  async checkStoredLicense() {
    try {
      const stored = await this.getStoredLicense();
      
      if (!stored || !stored.key) {
        return {
          valid: false,
          reason: "Aucune licence trouvée",
          needsActivation: true
        };
      }

      const validation = this.validateLicense(stored.key);

      if (validation.valid) {
        const db = getDb();
        await db.update((dbData) => {
          if (dbData.licence) {
            dbData.licence.lastChecked = new Date().toISOString();
          }
        });
      }

      return validation;

    } catch (error) {
      console.error("Erreur checkStoredLicense:", error);
      return {
        valid: false,
        reason: "Erreur lors de la vérification de la licence"
      };
    }
  },

  async clearLicense() {
    try {
      const db = getDb();
      await db.update((dbData) => {
        delete dbData.licence;
      });
      return { success: true };
    } catch (error) {
      console.error("Erreur clearLicense:", error);
      return { success: false, error: error.message };
    }
  }
};