// src/services/statsService.ts
import { invokeIpc } from "../utils/invokeIpc";

export interface StatsComptabilite {
  periode: {
    debut: string;
    fin: string;
  };
  resume: {
    totalPaiements: number;
    totalAchats: number;
    totalCharges: number;
    totalSorties: number;
    solde: number;
  };
  details: {
    paiements: number;
    achats: number;
    charges: number;
  };
  graphiques: {
    evolution: Array<{
      mois: string;
      entree: number;
      sortie: number;
    }>;
    chargesParCategorie: Record<string, number>;
  };
}

export interface StatsStock {
  totalTypes: number;
  totalUnites: number;
  stockBas: number;
  rupture: number;
  alertes: Array<{
    id: string;
    nom: string;
    quantite: number;
    seuil: number;
  }>;
}

export interface StatsDashboard {
  stats: {
    eleves: number;
    enseignants: number;
    classes: number;
    caisseMois: number;
  };
  repartition: {
    parClasse: Array<{
      classeId: string;
      nomClasse: string;
      count: number;
    }>;
    parNiveauClasse: Array<{
      niveauClasse: string;
      count: number;
    }>;
    parCycle: Array<{
      cycle: string;
      count: number;
    }>;
    parNiveauScolaire: Array<{
      niveauScolaire: string;
      count: number;
    }>;
  };
  bulletinsDisponibles: Array<{
    classeId: string;
    nomClasse: string;
    count: number;
  }>;
  alertes: {
    impayes: Array<{
      id: string;
      eleve: string;
      montant: number;
      classe: string;
    }>;
    bulletinsAFinaliser: Array<{
      id: string;
      eleve: {
        nom: string;
        prenom: string;
        matricule: string;
        classe: string;
      };
      classe: string;
    }>;
    stockBas: Array<{
      id: string;
      nom: string;
      quantite: number;
      seuil: number;
    }>;
  };
}

export const statsService = {
  async getComptabilite(periode?: { debut?: string; fin?: string }): Promise<StatsComptabilite> {
    return await invokeIpc('stats:comptabilite', periode);
  },

  async getStock(): Promise<StatsStock> {
    return await invokeIpc('stats:stock');
  },

  async getDashboard(): Promise<StatsDashboard> {
    return await invokeIpc('stats:dashboard');
  }
};