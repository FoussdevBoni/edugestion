// Ici ce sont des types ( modeles) de données sortantes de la base de données


import {
  BaseAchat,
  BaseBulletin,
  BaseCharge,
  BaseClasse, BaseConfigBulletin, BaseCycle, BaseEleveData, BaseEnseignant, BaseEvaluation, BaseInscription,
  BaseInventaire,
  BaseMateriel,
  BaseMatiere, BaseMouvementStock, BaseNiveauClasse, BaseNiveauScolaire, BaseNote, BasePaiement, BasePeriode, BaseSeance, BaseTransaction, StatutPayement
} from "./base";



export interface User {
  id: string
}
export interface EcoleInfo {
  id: string;
  nom: string;
  ia?: string;
  ief?: string;
  logo?: string;
  adresse: string;
  telephone: string;
  email: string;
  enTeteCarte?: string
  pays?: string
  siteWeb?: string;
  anneeScolaire: string;
  devise?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EleveData extends BaseEleveData {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Eleve extends Inscription {
  id: string;
}

export interface Paiement extends BasePaiement {
  id: string;
  inscription: Inscription;
  createdAt?: string;
  updatedAt?: string;
}

export interface Inscription extends BaseInscription, EleveData {
  id: string;
  niveauClasse: string;
  classe: string;
  cycle: string;
  niveauScolaire: string;
  statutPayement: StatutPayement
  paiements?: Paiement[]
  createdAt?: string;
  updatedAt?: string;
}

export interface Enseignant extends BaseEnseignant {
  id: string;
  enseignementsData: {
    classe: string,
    niveauClasse: string,
    cycle: string,
    niveauScolaire: string
    matiere: string
  }[],
  emploiDuTemps?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Note extends BaseNote {
  id: string;
  inscriptionId: string;
  matiere: string;
  periode: string;
  note: number;
  coefficient: number;
  enseignantId: string;
  evaluation: string;
  niveauScolaire: string;
  classe: string,
  eleve: string;
  niveauClasse: string;
  anneeScolaire: string
  createdAt?: string;
  updatedAt?: string;
}


export interface Matiere extends BaseMatiere {
  id: string;
  nom: string;
  coefficient: number;
  niveauClasse: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface Classe extends BaseClasse {
  id: string;
  cycle: string;
  niveauClasse: string;
  niveauScolaire: string
  effectifTotal: number,
  effectifFInscrits: number
  effectifGInscrits: number;
  effectifTotalInscrits: number
  createdAt?: string;
  updatedAt?: string;
}

export interface NiveauClasse extends BaseNiveauClasse {
  id: string;
  cycle: string;
  niveauScolaire: string
  createdAt?: string;
  updatedAt?: string;
}

export interface Cycle extends BaseCycle {
  id: string;
  niveauScolaire: string
  createdAt?: string;
  updatedAt?: string;
}

export interface NiveauScolaire extends BaseNiveauScolaire {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Evaluation extends BaseEvaluation {
  id: string;
  niveauScolaire: string;
  periode: string
  createdAt?: string;
  updatedAt?: string;
}

export interface Periode extends BasePeriode {
  id: string;
  niveauScolaire: string
  createdAt?: string;
  updatedAt?: string;
}

export interface Seance extends BaseSeance {
  id: string;
  cycle: string;
  niveauScolaire: string;
  matiere: string;
  classe: string;
  niveauClasse: string;
  enseignant: string;
  createdAt?: string;
  updatedAt?: string;
}



export interface DossierEleve {
  inscriptionHistory: Inscription[];
  notes: Note[];
  bulletins?: Bulletin[];
}



export interface Recu {
  id: string;
  numeroRecu: string;           // ex: "REC-2025-0001"
  paiementId: string;            // Référence au paiement original
  inscription: Inscription;      // Infos élève
  montantPaye: number;
  montantRestant: number
  motif: string;                 // "Scolarité 1er trimestre", etc.
  modePaiement: string;
  datePayement: string;
  dateEmission: string;          // Date d'édition du reçu
  statutPayement: string
  ecoleInfos: {
    nom: string;
    adresse: string;
    telephone: string;
    email: string;
    logo?: string;
    devise?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}



export interface CarteIdentite {
  enTeteCarte?: string;
  nomEcole: string;
  devise?: string;
  anneeScolaire: string;
  eleve: {
    nom: string;
    prenom: string;
    dateNaissance: string;
    matricule: string;
    sexe: 'M' | 'F';
    classe: string;
    lieuNaissance?: string;
    photoBase64?: string | null;
  };
}





export interface Materiel extends BaseMateriel {
  id: string
  nom: string
  quantite: number,
  createdAt: string
  updatedAt: string
}



export interface Achat extends BaseAchat {
  id: string
  materielId: string        // Quel matériel est acheté
  quantite: number
  prixUnitaire: number
  date: string
  createdBy: string
  total?: number
  transactionId?: string;
  reference: string
  materiel?: Materiel,
  transaction?: Transaction
  createdAt: string
  updatedAt: string

}


export interface Transaction extends BaseTransaction {
  id: string
  createdAt: string
  updatedAt: string
}


export interface Inventaire extends BaseInventaire {
  id: string

  createdAt: string
  updatedAt: string
}




export interface Charge extends BaseCharge {
  id: string;
  createdAt: string;
  updatedAt: string;
  transaction?: Transaction;
}


// src/utils/types/data.ts
export interface MouvementStock extends BaseMouvementStock {
  id: string;
  date: string;        // Date du mouvement
  createdAt: string;
  updatedAt: string;

  // Champs enrichis
  materiel?: Materiel;
  utilisateur?: string;
}



interface NoteItem {
  nom: string;
  note: string;
  coefficient?: string;
}




export interface NoteDetail {
  items: NoteItem[];
}

export interface MoyenneParMatiere {
  matiereId: string;
  matiere: string;
  notes: NoteDetail;
  moyenneVingtieme: string;
  coefficient: string;
  pointsPonderes: string;
  appreciation: string;
}

export interface Bulletin extends BaseBulletin {
  id: string;
  eleve: {
    nom: string;
    prenom: string;
    matricule: string;
    classe: string;
    niveauClasse: string; // ex: "6ème"
    cycle: string;        // ex: "COLLÈGE"
    niveauScolaire: string; // ex: "SECONDAIRE"
  };
  infosDeClasse: {
    effectif: number

  }
  periode: string;
  classeId: string,



  moyennesParMatiere: MoyenneParMatiere[];

  resultatFinal: {
    totalPoints: string;     // Le 249,49
    totalCoefficients: string; // Le 22
    moyenneGenerale: string;
    moyennesPeriodesAnterieures?: {
      periodeId: string,
      nom: string,
      moyenne: string
    }[]
    moyenneAnnuelle: string;
    rang: string;
  }

}

// Model de données sortante 
export interface ConfigBulletin extends BaseConfigBulletin {
  id: string
  createdAt: string;
  updatedAt: string;
}