// src/services/fakeDataService.ts

import { classes } from "../data/baseData";
import { eleves } from "../data/eleves";
import { elevesData } from "../data/elevesData";
import { enseignants } from "../data/enseignants";
import { inscriptions } from "../data/inscriptions";
import { matieres } from "../data/matieres";
import { notes } from "../data/notes";
import { paiements } from "../data/paiements";

// Simulation de délai réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fakeDataService = {
  // EleveData
  async getElevesData() {
    await delay(300);
    return [...elevesData];
  },

  async getEleveDataById(id: string) {
    await delay(200);
    return elevesData.find(e => e.id === id);
  },

  // Inscriptions
  async getInscriptions(filters?: { eleveId?: string; anneeScolaire?: string }) {
    await delay(400);
    let result = [...inscriptions];
    
    if (filters?.eleveId) {
      result = result.filter(i => i.eleveDataId === filters.eleveId);
    }
    if (filters?.anneeScolaire) {
      result = result.filter(i => i.anneeScolaire === filters.anneeScolaire);
    }
    
    return result;
  },

  // Élèves (inscriptions en cours)
  async getEleves(filters?: { anneeScolaire?: string }) {
    await delay(300);
    let result = [...eleves];
    
    if (filters?.anneeScolaire) {
      result = result.filter(e => e.anneeScolaire === filters.anneeScolaire);
    }
    
    return result;
  },

  // Enseignants
  async getEnseignants() {
    await delay(300);
    return [...enseignants];
  },

  // Matières
  async getMatieres() {
    await delay(200);
    return [...matieres];
  },

  // Notes
  async getNotes(filters?: { inscriptionId?: string; periodeId?: string }) {
    await delay(400);
    let result = [...notes];
    
    if (filters?.inscriptionId) {
      result = result.filter(n => n.inscriptionId === filters.inscriptionId);
    }
    if (filters?.periodeId) {
      result = result.filter(n => n.periodeId === filters.periodeId);
    }
    
    return result;
  },

  // Paiements
  async getPaiements(filters?: { inscriptionId?: string }) {
    await delay(300);
    let result = [...paiements];
    
    if (filters?.inscriptionId) {
      result = result.filter(p => p.inscriptionId === filters.inscriptionId);
    }
    
    return result;
  },

  // Classes
  async getClasses() {
    await delay(200);
    return [...classes];
  },

  // Dossier complet d'un élève
  async getDossierEleve(eleveDataId: string) {
    await delay(600);
    
    const inscriptionHistory = inscriptions.filter(i => i.eleveDataId === eleveDataId);
    const eleveNotes = notes.filter(n => 
      inscriptionHistory.some(i => i.id === n.inscriptionId)
    );
    
    return {
      inscriptionHistory,
      notes: eleveNotes,
      bulletins: [] // À implémenter si nécessaire
    };
  }
};