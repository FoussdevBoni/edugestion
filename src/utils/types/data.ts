import { BaseClasse, BaseCycle, BaseEleveData, BaseEnseignant, BaseEvaluation, BaseInscription, BaseMatiere, BaseNiveauClasse, BaseNiveauScolaire, BaseNote, BasePayement, BasePeriode, BaseSeance } from "./base";


export interface EcoleInfo {
  id: string;
  nom: string;
  logo?: string;
  adresse: string;
  telephone: string;
  email: string;
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
  eleveDataId: string;


}

export interface Payement extends BasePayement {
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
  payements?: Payement[]
  createdAt?: string;
  updatedAt?: string;
}

export interface Enseignant extends BaseEnseignant {
  id: string;
  classes: string[];
  matieres: string[];
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
  eleveId: string;
  montant: number;
  datePaiement: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface JournalCaisse {
  id: string;
  date: string;
  totalEntrees: number;
  totalSorties: number;
  recuIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CarteIdentite {
  id: string;
  eleveId: string;
  numeroCarte: string;
  dateCreation: string;
  photo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Bulletin {
  id: string;
  inscriptionId: string;
  periode: string;
  notes: Note[];
  moyenne: number;
  appreciation?: string;
  dateGeneration: string;
}
