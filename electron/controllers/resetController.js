// electron/controllers/resetController.js
import { getDb } from '../db.js';
import { dialog } from 'electron';
import fs from 'fs/promises';

export const resetController = {
  async resetDatabase() {
    try {
      const db = getDb();
      const licence = db.data.licence;

      await db.update((dbData) => {
        Object.keys(dbData).forEach(key => {
          if (key !== 'licence') {
            dbData[key] = null;
          }
        });
        dbData.licence = licence;
      });

      return {
        success: true,
        message: "Base de données réinitialisée avec succès (licence conservée)"
      };
    } catch (error) {
      console.error("Erreur resetDatabase:", error);
      throw error;
    }
  },

  async resetScolaireData() {
    try {
      const db = getDb();
      const ecoleInfos = db.data.ecoleInfos;

      await db.update((dbData) => {
        dbData.niveauxScolaires = [];
        dbData.cycles = [];
        dbData.niveauxClasses = [];
        dbData.matieres = [];
        dbData.periodes = [];
        dbData.evaluations = [];
        dbData.classes = [];
        dbData.elevesData = [];
        dbData.inscriptions = [];
        dbData.bulletins = [];
        dbData.notes = [];
        dbData.seances = [];
        dbData.paiements = [];
        dbData.ecoleInfos = ecoleInfos;
      });

      return {
        success: true,
        message: "Données scolaires réinitialisées"
      };
    } catch (error) {
      console.error("Erreur resetScolaireData:", error);
      throw error;
    }
  },

  async exportDatabase(options = {}) {
    try {
      const db = getDb();
      const { filePath, minify = false, exclude = [] } = options;
      
      let exportData = JSON.parse(JSON.stringify(db.data));
      
      if (exclude.length > 0) {
        exclude.forEach(key => {
          delete exportData[key];
        });
      }
      
      const exportPackage = {
        metadata: {
          exportDate: new Date().toISOString(),
          version: "1.0",
          totalRecords: this._countRecords(exportData)
        },
        data: exportData
      };
      
      let finalPath = filePath;
      if (!finalPath) {
        const result = await dialog.showSaveDialog({
          title: 'Exporter la base de données',
          defaultPath: `backup_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`,
          filters: [
            { name: 'JSON', extensions: ['json'] }
          ]
        });
        
        if (result.canceled) {
          return {
            success: false,
            message: "Export annulé"
          };
        }
        finalPath = result.filePath;
      }
      
      const jsonString = minify 
        ? JSON.stringify(exportPackage)
        : JSON.stringify(exportPackage, null, 2);
      
      await fs.writeFile(finalPath, jsonString, 'utf-8');
      
      return {
        success: true,
        message: `Base de données exportée avec succès vers ${finalPath}`,
        filePath: finalPath,
        size: (await fs.stat(finalPath)).size,
        recordCount: exportPackage.metadata.totalRecords
      };
    } catch (error) {
      console.error("Erreur exportDatabase:", error);
      throw error;
    }
  },

  async exportScolaireData(filePath) {
    try {
      const db = getDb();
      
      const scolairesKeys = [
        'niveauxScolaires',
        'cycles',
        'niveauxClasses',
        'matieres',
        'periodes',
        'evaluations',
        'classes',
        'elevesData',
        'inscriptions',
        'bulletins',
        'notes',
        'seances',
        'paiements'
      ];
      
      const scolairesData = {};
      scolairesKeys.forEach(key => {
        if (db.data[key]) {
          scolairesData[key] = db.data[key];
        }
      });
      
      const exportPackage = {
        metadata: {
          exportDate: new Date().toISOString(),
          type: "scolaires_only",
          version: "1.0"
        },
        data: scolairesData
      };
      
      let finalPath = filePath;
      if (!finalPath) {
        const result = await dialog.showSaveDialog({
          title: 'Exporter les données scolaires',
          defaultPath: `scolaires_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`,
          filters: [
            { name: 'JSON', extensions: ['json'] }
          ]
        });
        
        if (result.canceled) {
          return {
            success: false,
            message: "Export annulé"
          };
        }
        finalPath = result.filePath;
      }
      
      await fs.writeFile(finalPath, JSON.stringify(exportPackage, null, 2), 'utf-8');
      
      return {
        success: true,
        message: `Données scolaires exportées avec succès`,
        filePath: finalPath
      };
    } catch (error) {
      console.error("Erreur exportScolaireData:", error);
      throw error;
    }
  },

  // CHANGÉ : accepte fileContent au lieu de filePath
  async importDatabase(fileContent, options = { merge: false }) {
    try {
      const db = getDb();
      
      let importData = JSON.parse(fileContent);
      
      if (importData.metadata && importData.data) {
        importData = importData.data;
      }
      
      if (options.merge) {
        await db.update((dbData) => {
          Object.keys(importData).forEach(key => {
            if (key !== 'licence' && Array.isArray(importData[key])) {
              if (dbData[key] && Array.isArray(dbData[key])) {
                const existingIds = new Set(dbData[key].map(item => item.id));
                const newItems = importData[key].filter(item => !existingIds.has(item.id));
                dbData[key] = [...dbData[key], ...newItems];
              } else {
                dbData[key] = importData[key];
              }
            } else if (key !== 'licence') {
              dbData[key] = importData[key];
            }
          });
        });
      } else {
        const licence = db.data.licence;
        await db.update((dbData) => {
          Object.keys(dbData).forEach(key => {
            if (key !== 'licence') {
              delete dbData[key];
            }
          });
          
          Object.keys(importData).forEach(key => {
            if (key !== 'licence') {
              dbData[key] = importData[key];
            }
          });
          
          dbData.licence = licence;
        });
      }
      
      return {
        success: true,
        message: `Import terminé avec succès (mode: ${options.merge ? 'fusion' : 'remplacement'})`
      };
    } catch (error) {
      console.error("Erreur importDatabase:", error);
      throw error;
    }
  },

  _countRecords(data) {
    let total = 0;
    Object.values(data).forEach(value => {
      if (Array.isArray(value)) {
        total += value.length;
      } else if (value && typeof value === 'object') {
        total += 1;
      }
    });
    return total;
  }
};