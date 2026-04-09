// Ce sont des types de données entrantes dans la base de données

import { Materiel } from "./data";
export type BulletinStatut = 'complet' | 'incomplet' | 'a_finaliser' | 'brouillon'


export type Sexe = "M" | "F";
export type StatutEleve = "actif" | "inactif" | "exclu";
export type Jour = "LUNDI" | "MARDI" | "MERCREDI" | "JEUDI" | "VENDREDI" | "SAMEDI";
export type StatutScolaire = 'nouveau' | 'redoublant';
export type StatutPayement = 'partiellement' | 'paye' | 'impaye';


export interface BaseEcoleInfos {
    nom: string;
    logo?: string;
    enTeteCarte?: string
    ia?: string;
    ief?: string;

    adresse?: string;
    telephone: string;
    email?: string;
    siteWeb?: string;
    anneeScolaire: string;
    devise?: string;
}

export interface BaseNiveauScolaire {
    nom: string; // "Préscolaire", "Primaire", "Secondaire",
    ordre: number
}

export interface BaseCycle {
    niveauScolaireId: string;
    nom: string; // "Maternelle", "1er cycle", "2ème cycle"
    ordre: number
}

export interface BaseNiveauClasse {
    cycleId: string;
    nomComplet?: string,
    ordre: number
    nom: string; // "6ème", "5ème", etc.
}

export interface BaseClasse {
    nom: string; // "6ème A"
    niveauClasseId: string;
    effectifF: number,
    effectifM: number
}

export interface BasePeriode {
    nom: string; // "1er Trimestre", "Semestre 1"
    niveauScolaireId?: string;
    ordre: number,
    coefficient: number;

}

export interface BaseMatiere {
    nom: string;
    coefficient: number;
    niveauClasseId: string;
}

export interface BaseEvaluation {
    nom: string; // "Devoir", "Examen",
    abreviation?: string;
    periodeId?: string;
    niveauScolaireId?: string,
    type: "composition" | "devoir" | "interrogation",

}

export interface BaseEleveData {
    nom: string;
    prenom: string;
    dateNaissance: string; // YYYY-MM-DD
    sexe: Sexe;
    photo?: string;
    matricule?: string;
    statut?: StatutEleve;
    lieuDeNaissance?: string;
    contact?: string;
}


export interface BaseInscription {
    anneeScolaire: string;
    dateInscription: string;
    statutScolaire?: StatutScolaire;
    classeId: string;
    eleveDataId: string;
    isActive?: boolean;
    vieScolaire?: {
        periodeId: string;
        score: { absences: number, retards: number, conduite: number }
    }[]
}


export interface BaseEnseignant {
    nom: string;
    prenom: string;
    email: string;
    tel: string;
    enseignements: {
        classeId: string;
        matiereId: string;
    }[];

}

export interface BaseNote {
    inscriptionId: string // ou cela 
    matiereId: string;
    periodeId: string;
    note: number;
    coefficient: number;
    classeId: string;
    evaluationId: string;
    closed?: boolean
}

export interface BaseSeance {
    classeId: string;
    matiereId: string;
    enseignantId: string;
    jour: Jour;
    heureDebut: string; // "08:00"
    heureFin: string;   // "09:00"
    anneeScolaire: string;
}





export interface BasePaiement {
    inscriptionId: string;
    montantPaye: number;
    statut: StatutPayement;
    montantRestant?: number;
    modePaiement: string
    datePayement: string;
    motif?: string
}


export interface BaseMateriel {
    nom: string
    quantite: number,
    seuilAlerte: number,
    description?: string,
    fournisseur?: string,

}

export interface BaseAchat {
    materielId: string        // Quel matériel est acheté
    quantite: number
    prixUnitaire: number;
    referenceExterne?: string
    date: string
    createdBy: string
    total?: number
    modePaiement: string;      // Mode de paiement utilisé
    notes?: string;

}

export interface BaseTransaction {
    type: 'entree' | 'sortie'
    montant: number
    motif: string            // select pour motifs
    description: string
    date: string
    modePaiement: string
    createdBy: string
    metaData?: any           // stocker id achat, facture, etc.
}



export interface InventaireItem extends Materiel {
    quantiteReelle: number,
    difference: number
}
export interface BaseInventaire {
    date: string
    periode: string
    materiels: InventaireItem[]
    notes?: string
    autrePeriode?: string
}

export interface BaseCharge {
    libelle: string;
    montant: number;
    date: string;
    categorie: 'salaire' | 'facture' | 'loyer' | 'entretien' | 'transport' | 'fourniture_bureau' | 'autre';
    service?: string;
    beneficiaire?: string;
    modePaiement: 'especes' | 'mobile_money' | 'virement' | 'cheque';
    reference?: string;
    periode?: string;
    notes?: string;
    transactionId?: string;
}


export type TypeMouvementStock = 'entree' | 'sortie' | 'correction' | 'inventaire';

export interface BaseMouvementStock {
    materielId: string;
    quantiteAvant: number;
    quantiteApres: number;
    difference: number;  // quantiteApres - quantiteAvant
    type: TypeMouvementStock;
    motif: string;       // "Achat", "Vente", "Correction manuelle", "Inventaire", etc.
    referenceId?: string; // ID de l'achat, inventaire, etc.
    referenceType?: string; // "achat", "inventaire", "correction"
    createdBy: string;
    notes?: string;
}


// src/utils/types/base.ts
export interface BaseBulletinUpdate {
    vieScolaire: {
        absences: number;
        retards: number;
        conduite: number;
    };
    decisionConseil: string;
    observations: string;

}

export interface BaseBulletin {
    vieScolaire: {
        absences: number;
        retards: number;
        conduite: number;
    };
    inscriptionId: string,
    periodeId: string
    status: BulletinStatut


    commentaires: {
        decisionConseil: string;
        observations: string;
    }

}

export type ModeCalcule = 'moyenne' | 'conserver'

export interface BaseConfigBulletin {
    interrogation: {
        actif: boolean,
        mode: ModeCalcule
    },
    devoir: {
        actif: boolean,
        mode: ModeCalcule
    },
    composition: {
        actif: boolean,
        mode: ModeCalcule
    }
}
