// electron/controllers/photoController.js
import { getDb } from '../db.js';
import fs from 'fs/promises';
import path from 'path';
import { app } from 'electron';

const PHOTOS_DIR = path.join(app.getPath('userData'), 'photos');
const UPLOADS_DIR = path.join(app.getPath('userData'), 'uploads');

export const photoController = {
  async init() {
    try {
      await fs.mkdir(PHOTOS_DIR, { recursive: true });
      await fs.mkdir(UPLOADS_DIR, { recursive: true });
      console.log('✅ Dossier photos prêt:', PHOTOS_DIR);
      console.log('✅ Dossier uploads prêt:', UPLOADS_DIR);
    } catch (error) {
      console.error("Erreur création dossiers:", error);
    }
  },

  // Upload direct des fichiers (pour photos élèves)
  async uploadPhotos(data) {
    try {
      const { photos, inscriptions } = data;
      const resultats = {
        success: [],
        errors: []
      };

      await fs.mkdir(PHOTOS_DIR, { recursive: true });

      for (const photo of photos) {
        try {
          const { matricule, base64 } = photo;
          
          const inscription = inscriptions.find(i => i.matricule === matricule);
          if (!inscription) {
            resultats.errors.push({
              eleve: matricule,
              matricule,
              error: "Élève non trouvé"
            });
            continue;
          }

          const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          
          const extension = base64.split(';')[0].split('/')[1] || 'jpg';
          const fileName = `${matricule}_${Date.now()}.${extension}`;
          const filePath = path.join(PHOTOS_DIR, fileName);

          await fs.writeFile(filePath, buffer);

          const db = getDb();
          await db.update((dbData) => {
            const eleveIndex = dbData.elevesData?.findIndex(e => e.matricule === matricule);
            if (eleveIndex !== -1) {
              dbData.elevesData[eleveIndex].photo = fileName;
            }

            if (dbData.inscriptions) {
              const inscIndex = dbData.inscriptions.findIndex(i => i.matricule === matricule);
              if (inscIndex !== -1) {
                dbData.inscriptions[inscIndex].photo = fileName;
              }
            }
          });

          resultats.success.push({
            eleve: `${inscription.prenom} ${inscription.nom}`,
            matricule,
            fichier: fileName
          });

        } catch (error) {
          resultats.errors.push({
            eleve: photo.matricule,
            matricule: photo.matricule,
            error: error.message
          });
        }
      }

      return resultats;
    } catch (error) {
      console.error("Erreur uploadPhotos:", error);
      throw error;
    }
  },

  // Upload générique (logo, en-tête carte, etc.)
 async uploadFile(data) {
  try {
    const { base64, type, nom } = data;
    
    // Déterminer le dossier de destination
    let targetDir = UPLOADS_DIR;
    if (type === 'eleve') {
      targetDir = PHOTOS_DIR;
    }

    await fs.mkdir(targetDir, { recursive: true });

    // Forcer l'extension en jpg
    const fileName = nom || `${type}_${Date.now()}.jpg`;
    const filePath = path.join(targetDir, fileName);

    // Nettoyer le base64
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    let buffer = Buffer.from(base64Data, 'base64');

    // Si c'est un PNG, le convertir en JPEG
    if (base64.includes('image/png')) {
      try {
        const sharp = (await import('sharp')).default;
        buffer = await sharp(buffer)
          .jpeg({ quality: 90 })
          .toBuffer();
      } catch (error) {
        console.warn("Sharp non disponible, sauvegarde en PNG original");
        // Fallback: garder le format original mais avec extension .jpg
      }
    }

    // Sauvegarder le fichier
    await fs.writeFile(filePath, buffer);

    // Mettre à jour la BDD si nécessaire (logo, enTeteCarte)
    if (type === 'logo' || type === 'enTeteCarte') {
      const db = getDb();
      await db.update((dbData) => {
        if (!dbData.ecoleInfos) dbData.ecoleInfos = {};
        dbData.ecoleInfos[type] = fileName;
      });
    }

    return {
      success: true,
      fileName,
      path: filePath
    };
  } catch (error) {
    console.error("Erreur uploadFile:", error);
    throw error;
  }
},

  async getPhoto(matricule) {
    try {
      const db = getDb();
      const eleve = db.data.elevesData?.find(e => e.matricule === matricule);
      
      if (!eleve?.photo) return null;

      const photoPath = path.join(PHOTOS_DIR, eleve.photo);
      
      try {
        await fs.access(photoPath);
        return await fs.readFile(photoPath);
      } catch {
        return null;
      }
    } catch (error) {
      console.error("Erreur getPhoto:", error);
      return null;
    }
  },

  async getFile(fileName, type = 'upload') {
    try {
      const targetDir = type === 'eleve' ? PHOTOS_DIR : UPLOADS_DIR;
      const filePath = path.join(targetDir, fileName);
      
      try {
        await fs.access(filePath);
        return await fs.readFile(filePath);
      } catch {
        return null;
      }
    } catch (error) {
      console.error("Erreur getFile:", error);
      return null;
    }
  },

  async getFileBase64(fileName, type = 'upload') {
    try {
      const buffer = await this.getFile(fileName, type);
      if (!buffer) return null;
      return `data:image/jpeg;base64,${buffer.toString('base64')}`;
    } catch (error) {
      console.error("Erreur getFileBase64:", error);
      return null;
    }
  }
};