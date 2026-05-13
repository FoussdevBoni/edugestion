// src/services/statsService.ts
import { invokeIpc } from "../utils/invokeIpc";

// src/services/statsService.ts

export interface StatsComptabilite {
  periode: {
    debut: string;
    fin: string;
  };
  resume: {
    totalEntrees: number;      // paiements + ventes
    totalSorties: number;      // achats + charges
    solde: number;
  };
  details: {
    paiements: { count: number; total: number };
    ventes: { count: number; total: number };
    achats: { count: number; total: number };
    charges: { count: number; total: number };
  };
  graphiques: {
    evolution: Array<{
      mois: string;
      entree: number;
      sortie: number;
    }>;
    entreesParMode: Record<string, number>;
    sortiesParMode: Record<string, number>;
  };
  top: {
    entrees: Array<{
      id: string;
      montant: number;
      motif: string;
      date: string;
    }>;
    sorties: Array<{
      id: string;
      montant: number;
      motif: string;
      date: string;
    }>;
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
    totalNiveauxClasse: number;
    totalClasses: number;
    totalEleves: number;
    enseignants: number;
    caisseMois: number;
  };

  parNiveauClasse: Array<{
    niveauClasseId: string;
    nomNiveauClasse: string;
    nombreClasses: number;
  }>;

  parClasse: Array<{
    classeId: string;
    nomClasse: string;
    totalEleves: number;
    filles: number;
    garcons: number;
  }>;

  alertes: {
    impayes: Array<{
      id: string;
      eleve: string;
      montant: number;
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

  async getDashboard(payload: { niveauScolaire?: string }): Promise<StatsDashboard> {
    return await invokeIpc('stats:dashboard', payload);
  }
};