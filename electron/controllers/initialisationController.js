// electron/controllers/initialisationController.js
import { getDb } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initialisationController = {
  // Importation initiale ou ajout de nouveaux niveaux
  async importerNiveauxScolaires(payload) {
    try {
      const db = getDb();
      const { pays, niveauxScolaires } = payload;
      
      // Lire le fichier JSON
      const jsonPath = path.join(__dirname, '../default.db.json');
      if (!fs.existsSync(jsonPath)) {
        throw new Error(`Fichier non trouvé: ${jsonPath}`);
      }
      
      const jsonData = fs.readFileSync(jsonPath, 'utf-8');
      const data = JSON.parse(jsonData);
      
      const paysData = data[pays] || data[Object.keys(data)[0]];
      if (!paysData) {
        throw new Error(`Pays "${pays}" non trouvé dans le fichier`);
      }
      
      // Filtrer les niveaux scolaires demandés
      const niveauxADemander = paysData.filter(n => niveauxScolaires.includes(n.nom));
      
      if (niveauxADemander.length === 0) {
        return { 
          success: false, 
          message: "Aucun niveau scolaire trouvé pour la sélection" 
        };
      }
      
      const now = new Date().toISOString();
      const resultats = {
        niveauxScolaires: { ajoutes: 0, ignores: 0 },
        cycles: { ajoutes: 0, ignores: 0 },
        niveauxClasses: { ajoutes: 0, ignores: 0 },
        matieres: { ajoutes: 0, ignores: 0 },
        periodes: { ajoutes: 0, ignores: 0 },
        evaluations: { ajoutes: 0, ignores: 0 }
      };
      
      for (const niveau of niveauxADemander) {
        // Vérifier si le niveau scolaire existe déjà
        let niveauScolaireId = db.data.niveauxScolaires?.find(n => n.nom === niveau.nom)?.id;
        
        if (!niveauScolaireId) {
          // Créer le niveau scolaire
          niveauScolaireId = uuidv4();
          await db.update((dbData) => {
            if (!dbData.niveauxScolaires) dbData.niveauxScolaires = [];
            dbData.niveauxScolaires.push({
              id: niveauScolaireId,
              nom: niveau.nom,
              ordre: niveau.ordre,
              createdAt: now,
              updatedAt: now
            });
          });
          resultats.niveauxScolaires.ajoutes++;
        } else {
          resultats.niveauxScolaires.ignores++;
        }
        
        // Importer les périodes de ce niveau
        if (niveau.periodes && Array.isArray(niveau.periodes)) {
          for (const periodeData of niveau.periodes) {
            // Vérifier si la période existe déjà
            let periodeId = db.data.periodes?.find(p => 
              p.nom === periodeData.nom && p.niveauScolaireId === niveauScolaireId
            )?.id;
            
            if (!periodeId) {
              periodeId = uuidv4();
              await db.update((dbData) => {
                if (!dbData.periodes) dbData.periodes = [];
                dbData.periodes.push({
                  id: periodeId,
                  nom: periodeData.nom,
                  niveauScolaireId: niveauScolaireId,
                  ordre: periodeData.ordre,
                  coefficient: 1,
                  createdAt: now,
                  updatedAt: now
                });
              });
              resultats.periodes.ajoutes++;
              
              // Importer les évaluations de cette période
              if (periodeData.evaluations && Array.isArray(periodeData.evaluations)) {
                for (const evalData of periodeData.evaluations) {
                  const evalExiste = db.data.evaluations?.some(e => 
                    e.nom === evalData.nom && e.periodeId === periodeId
                  );
                  
                  if (!evalExiste) {
                    await db.update((dbData) => {
                      if (!dbData.evaluations) dbData.evaluations = [];
                      dbData.evaluations.push({
                        id: uuidv4(),
                        nom: evalData.nom,
                        abreviation: evalData.abreviation || evalData.nom.substring(0, 3).toUpperCase(),
                        periodeId: periodeId,
                        niveauScolaireId: niveauScolaireId,
                        type: evalData.type,
                        createdAt: now,
                        updatedAt: now
                      });
                    });
                    resultats.evaluations.ajoutes++;
                  } else {
                    resultats.evaluations.ignores++;
                  }
                }
              }
            } else {
              resultats.periodes.ignores++;
            }
          }
        }
        
        // Importer les cycles de ce niveau
        if (niveau.cycles && Array.isArray(niveau.cycles)) {
          for (const cycleData of niveau.cycles) {
            // Vérifier si le cycle existe déjà
            let cycleId = db.data.cycles?.find(c => 
              c.nom === cycleData.nom && c.niveauScolaireId === niveauScolaireId
            )?.id;
            
            if (!cycleId) {
              cycleId = uuidv4();
              await db.update((dbData) => {
                if (!dbData.cycles) dbData.cycles = [];
                dbData.cycles.push({
                  id: cycleId,
                  niveauScolaireId: niveauScolaireId,
                  nom: cycleData.nom,
                  ordre: cycleData.ordre,
                  createdAt: now,
                  updatedAt: now
                });
              });
              resultats.cycles.ajoutes++;
            } else {
              resultats.cycles.ignores++;
            }
            
            // Importer les niveaux de classe de ce cycle
            if (cycleData.niveaux_de_classes && Array.isArray(cycleData.niveaux_de_classes)) {
              for (const niveauClasseData of cycleData.niveaux_de_classes) {
                // Vérifier si le niveau de classe existe déjà
                let niveauClasseId = db.data.niveauxClasses?.find(nc => 
                  nc.nom === niveauClasseData.nom && nc.cycleId === cycleId
                )?.id;
                
                if (!niveauClasseId) {
                  niveauClasseId = uuidv4();
                  await db.update((dbData) => {
                    if (!dbData.niveauxClasses) dbData.niveauxClasses = [];
                    dbData.niveauxClasses.push({
                      id: niveauClasseId,
                      cycleId: cycleId,
                      nom: niveauClasseData.nom,
                      nomComplet: niveauClasseData.nom,
                      ordre: 1,
                      createdAt: now,
                      updatedAt: now
                    });
                  });
                  resultats.niveauxClasses.ajoutes++;
                  
                  // Importer les matières de ce niveau de classe
                  if (niveauClasseData.matieres && Array.isArray(niveauClasseData.matieres)) {
                    for (const matiereData of niveauClasseData.matieres) {
                      const matiereExiste = db.data.matieres?.some(m => 
                        m.nom === matiereData.nom && m.niveauClasseId === niveauClasseId
                      );
                      
                      if (!matiereExiste) {
                        await db.update((dbData) => {
                          if (!dbData.matieres) dbData.matieres = [];
                          dbData.matieres.push({
                            id: uuidv4(),
                            nom: matiereData.nom,
                            coefficient: matiereData.coefficient,
                            niveauClasseId: niveauClasseId,
                            createdAt: now,
                            updatedAt: now
                          });
                        });
                        resultats.matieres.ajoutes++;
                      } else {
                        resultats.matieres.ignores++;
                      }
                    }
                  }
                } else {
                  resultats.niveauxClasses.ignores++;
                }
              }
            }
          }
        }
      }
      
      return {
        success: true,
        message: "Importation terminée",
        resultats
      };
      
    } catch (error) {
      console.error("Erreur importerNiveauxScolaires:", error);
      throw error;
    }
  },
  
  async getNiveauxDisponibles(pays) {
    try {
      const jsonPath = path.join(__dirname, '../default.db.json');
      const jsonData = fs.readFileSync(jsonPath, 'utf-8');
      const data = JSON.parse(jsonData);
      
      const paysData = data[pays] || data[Object.keys(data)[0]];
      
      return paysData.map(n => ({
        nom: n.nom,
        ordre: n.ordre,
        cyclesCount: n.cycles?.length || 0,
        periodesCount: n.periodes?.length || 0
      }));
    } catch (error) {
      console.error("Erreur getNiveauxDisponibles:", error);
      throw error;
    }
  },
  
  async getNiveauxExistants() {
    try {
      const db = getDb();
      return {
        niveauxScolaires: db.data.niveauxScolaires || [],
        cycles: db.data.cycles || [],
        niveauxClasses: db.data.niveauxClasses || [],
        matieres: db.data.matieres || []
      };
    } catch (error) {
      console.error("Erreur getNiveauxExistants:", error);
      throw error;
    }
  },
  
  async verifierStructureExistante() {
    try {
      const db = getDb();
      return {
        existe: !!(db.data.niveauxScolaires && db.data.niveauxScolaires.length > 0),
        stats: {
          niveauxScolaires: db.data.niveauxScolaires?.length || 0,
          cycles: db.data.cycles?.length || 0,
          niveauxClasses: db.data.niveauxClasses?.length || 0,
          matieres: db.data.matieres?.length || 0
        }
      };
    } catch (error) {
      console.error("Erreur verifierStructureExistante:", error);
      throw error;
    }
  }
};