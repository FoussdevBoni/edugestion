export type Sexe = "M" | "F";
export type StatutEleve = "actif" | "inactif" | "exclu";
export type Jour = "LUNDI" | "MARDI" | "MERCREDI" | "JEUDI" | "VENDREDI" | "SAMEDI";
export type StatutScolaire = 'nouveau' | 'redoublant';
export type StatutPayement = 'partiellement' | 'paye';

export interface BaseNiveauScolaire {
    nom: string; // "Préscolaire", "Primaire", "Secondaire"
}

export interface BaseCycle {
    niveauScolaireId: string;
    nom: string; // "Maternelle", "1er cycle", "2ème cycle"
}

export interface BaseNiveauClasse {
    cycleId: string;
    nom: string; // "6ème", "5ème", etc.
}

export interface BaseClasse {
    nom: string; // "6ème A"
    niveauClasseId: string;
}

export interface BasePeriode {
    nom: string; // "1er Trimestre", "Semestre 1"
    ordre: number;
    dateDebut: string;
    dateFin: string;
    niveauScolaireId?: string
}

export interface BaseMatiere {
    nom: string;
    coefficient: number;
    niveauClasseId: string;
}

export interface BaseEvaluation {
    nom: string; // "Devoir", "Examen"
    periodeId?: string;
    niveauScolaireId?: string
}

export interface BaseEleveData {
    nom: string;
    prenom: string;
    dateNaissance: string; // YYYY-MM-DD
    sexe: Sexe;
    photo?: string;
    anneeScolaire: string;
    matricule: string;
    statut: StatutEleve;
    lieuDeNaissance?: string;
    contact?: string;
}

export interface BaseEnseignant {
    nom: string;
    prenom: string;
    email: string;
    tel: string;
    matieresId: string[];
    classesId: string[];
}

export interface BaseNote {
    inscriptionId: string // ou cela 
    matiereId: string;
    periodeId: string;
    note: number;
    coefficient: number;
    enseignantId: string;
    evaluationId: string;
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




export interface BaseInscription {
    anneeScolaire: string;
    dateInscription: string; // YYYY-MM-DD
    statutScolaire: StatutScolaire; // nouveau ou redoublant
    classeId: string;
    eleveDataId: string;
}

export interface BasePayement {
    inscriptionId: string;
    montantPaye: number;
    statut: StatutPayement;
    montantRestant: number;
    datePayement: string; // YYYY-MM-DD
}