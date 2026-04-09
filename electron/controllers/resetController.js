// electron/controllers/resetController.js
import { getDb } from '../db.js';

export const resetController = {
  /**
   * Réinitialise complètement la base de données
   */
  async resetDatabase() {
    try {
      const db = getDb();
      
      // Sauvegarder les données utilisateur (optionnel)
      // Si tu veux garder certaines données comme les infos de l'école
      // const ecoleInfos = db.data.ecoleInfos;
      // const user = db.data.user;
      
      // Réinitialiser toutes les données
      await db.update((dbData) => {
        // Vider tous les tableaux
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
        dbData.utilisateurs = [];
        dbData.ecoleInfos = null;
        
        // Ou si tu préfères tout remettre à un objet vide
        // Object.keys(dbData).forEach(key => {
        //   dbData[key] = Array.isArray(dbData[key]) ? [] : null;
        // });
      });
      
      return { 
        success: true, 
        message: "Base de données réinitialisée avec succès" 
      };
      
    } catch (error) {
      console.error("Erreur resetDatabase:", error);
      throw error;
    }
  },
  
  /**
   * Réinitialise les données scolaires mais garde les infos de l'école
   */
  async resetScolaireData() {
    try {
      const db = getDb();
      
      // Garder les infos de l'école
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
        
        // Restaurer les infos de l'école
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
  }
};