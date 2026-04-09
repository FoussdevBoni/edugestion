// src/data/bulletins.ts
import { Bulletin } from "../utils/types/data";

export const FAKE_BULLETINS: Bulletin[] = [
    {
        id: "20A053-S2-2022",
        eleve: {
            nom: "DIONGUE",
            prenom: "FATOU BINTOU",
            matricule: "20A053",
            classe: "6e"
        },
        periode: "SEMESTRE 2",
        anneeScolaire: "2021 - 2022",

        moyennesParMatiere: [
            {
                matiereId: "TSQ",
                matiere: "TSQ",
                notes: { devoir1: 17, devoir2: 17, composition: 14 },
                moyenneVingtieme: 16,
                coefficient: 2,
                pointsPonderes: 32,
                appreciation: "Très Bien"
            },
            {
                matiereId: "DICTEE",
                matiere: "DICTEE",
                notes: { devoir1: 14, devoir2: 14, composition: 16 },
                moyenneVingtieme: 14.66,
                coefficient: 2,
                pointsPonderes: 29.33,
                appreciation: "Bien"
            },
            {
                matiereId: "ORTHO",
                matiere: "Orthographe",
                notes: { devoir1: 10, devoir2: 10, composition: 13 },
                moyenneVingtieme: 11,
                coefficient: 1,
                pointsPonderes: 11,
                appreciation: "Passable"
            },
            {
                matiereId: "ANG",
                matiere: "ANGLAIS",
                notes: { devoir1: 10, devoir2: 11, composition: 9 },
                moyenneVingtieme: 10,
                coefficient: 2,
                pointsPonderes: 20,
                appreciation: "Passable"
            },
            {
                matiereId: "HG",
                matiere: "HIS-GEO",
                notes: { devoir1: 5, devoir2: 15, composition: 7.5 },
                moyenneVingtieme: 9.16,
                coefficient: 2,
                pointsPonderes: 18.33,
                appreciation: "Insuffisant"
            },
            {
                matiereId: "EC",
                matiere: "EC",
                notes: { devoir1: 14, devoir2: 14, composition: 14 },
                moyenneVingtieme: 14,
                coefficient: 1,
                pointsPonderes: 14,
                appreciation: "Bien"
            },
            {
                matiereId: "MATH",
                matiere: "MATHS",
                notes: { devoir1: 2, devoir2: 6.5, composition: 4.5 },
                moyenneVingtieme: 4.33,
                coefficient: 3,
                pointsPonderes: 13,
                appreciation: "Médiocre"
            },
            {
                matiereId: "SVT",
                matiere: "SVT",
                notes: { devoir1: 11.5, devoir2: 10, composition: 10.5 },
                moyenneVingtieme: 10.66,
                coefficient: 2,
                pointsPonderes: 21.33,
                appreciation: "Passable"
            },
            {
                matiereId: "EPS",
                matiere: "EPS",
                notes: { devoir1: 14, devoir2: 15, composition: 16 },
                moyenneVingtieme: 15,
                coefficient: 2,
                pointsPonderes: 30,
                appreciation: "Bien"
            },
            {
                matiereId: "MUS",
                matiere: "Musique",
                notes: { devoir1: 10, devoir2: 10, composition: 10 },
                moyenneVingtieme: 10,
                coefficient: 1,
                pointsPonderes: 10,
                appreciation: "Passable"
            },
            {
                matiereId: "ARA",
                matiere: "ARABE",
                notes: { devoir1: 10, devoir2: 13, composition: 10 },
                moyenneVingtieme: 11,
                coefficient: 2,
                pointsPonderes: 22,
                appreciation: "Passable"
            },
            {
                matiereId: "INF",
                matiere: "INFORMATIQUE",
                notes: { devoir1: 11, devoir2: 11.5, composition: 18 },
                moyenneVingtieme: 13.5,
                coefficient: 1,
                pointsPonderes: 13.5,
                appreciation: "Assez Bien"
            },
            {
                matiereId: "COND",
                matiere: "CONDUITE",
                notes: { composition: 15 },
                moyenneVingtieme: 15,
                coefficient: 1,
                pointsPonderes: 15,
                appreciation: "Bien"
            }
        ],

        totalPoints: 249.49,
        totalCoefficients: 22,
        moyenneGenerale: 11.34,
        rang: "14e",

        moyenneSemestreAnterieur: 10.17,
        moyenneAnnuelle: 10.75,

        vieScolaire: {
            absences: 1,
            retards: 1,
            conduite: 15
        },
        effectif: 30,

        decisionConseil: "Passe en classe supérieure",
        observations: "Peut mieux faire"
    },
    {
        id: "19B072-S2-2022",
        eleve: {
            nom: "FALL",
            prenom: "MOUSSA",
            matricule: "19B072",
            classe: "5e"
        },
        periode: "SEMESTRE 2",
        anneeScolaire: "2021 - 2022",

        moyennesParMatiere: [
            {
                matiereId: "FR",
                matiere: "FRANÇAIS",
                notes: { devoir1: 15, devoir2: 16, composition: 14 },
                moyenneVingtieme: 15,
                coefficient: 3,
                pointsPonderes: 45,
                appreciation: "Bien"
            },
            {
                matiereId: "ANG",
                matiere: "ANGLAIS",
                notes: { devoir1: 12, devoir2: 13, composition: 11 },
                moyenneVingtieme: 12,
                coefficient: 2,
                pointsPonderes: 24,
                appreciation: "Assez Bien"
            },
            {
                matiereId: "MATH",
                matiere: "MATHEMATIQUES",
                notes: { devoir1: 18, devoir2: 19, composition: 17 },
                moyenneVingtieme: 18,
                coefficient: 4,
                pointsPonderes: 72,
                appreciation: "Excellent"
            },
            {
                matiereId: "PC",
                matiere: "PHYS-CHIMIE",
                notes: { devoir1: 16, devoir2: 17, composition: 15 },
                moyenneVingtieme: 16,
                coefficient: 2,
                pointsPonderes: 32,
                appreciation: "Très Bien"
            },
            {
                matiereId: "SVT",
                matiere: "SVT",
                notes: { devoir1: 14, devoir2: 15, composition: 13 },
                moyenneVingtieme: 14,
                coefficient: 2,
                pointsPonderes: 28,
                appreciation: "Bien"
            },
            {
                matiereId: "HG",
                matiere: "HISTOIRE-GEO",
                notes: { devoir1: 13, devoir2: 14, composition: 12 },
                moyenneVingtieme: 13,
                coefficient: 2,
                pointsPonderes: 26,
                appreciation: "Assez Bien"
            },
            {
                matiereId: "EPS",
                matiere: "EPS",
                notes: { devoir1: 16, devoir2: 17, composition: 18 },
                moyenneVingtieme: 17,
                coefficient: 1,
                pointsPonderes: 17,
                appreciation: "Très Bien"
            }
        ],

        totalPoints: 244,
        totalCoefficients: 16,
        moyenneGenerale: 15.25,
        rang: "3e",

        moyenneSemestreAnterieur: 14.50,
        moyenneAnnuelle: 14.87,

        vieScolaire: {
            absences: 0,
            retards: 0,
            conduite: 18
        },
        effectif: 30,

        decisionConseil: "Passe en classe supérieure avec félicitations",
        observations: "Excellent travail"
    },
    {
        id: "21C034-S2-2022",
        eleve: {
            nom: "SARR",
            prenom: "AMINATA",
            matricule: "21C034",
            classe: "4e"
        },
        periode: "SEMESTRE 2",
        anneeScolaire: "2021 - 2022",

        moyennesParMatiere: [
            {
                matiereId: "FR",
                matiere: "FRANÇAIS",
                notes: { devoir1: 8, devoir2: 9, composition: 7 },
                moyenneVingtieme: 8,
                coefficient: 3,
                pointsPonderes: 24,
                appreciation: "Insuffisant"
            },
            {
                matiereId: "ANG",
                matiere: "ANGLAIS",
                notes: { devoir1: 7, devoir2: 8, composition: 6 },
                moyenneVingtieme: 7,
                coefficient: 2,
                pointsPonderes: 14,
                appreciation: "Médiocre"
            },
            {
                matiereId: "MATH",
                matiere: "MATHEMATIQUES",
                notes: { devoir1: 5, devoir2: 6, composition: 4 },
                moyenneVingtieme: 5,
                coefficient: 4,
                pointsPonderes: 20,
                appreciation: "Très Insuffisant"
            },
            {
                matiereId: "PC",
                matiere: "PHYS-CHIMIE",
                notes: { devoir1: 6, devoir2: 7, composition: 5 },
                moyenneVingtieme: 6,
                coefficient: 2,
                pointsPonderes: 12,
                appreciation: "Médiocre"
            },
            {
                matiereId: "SVT",
                matiere: "SVT",
                notes: { devoir1: 9, devoir2: 10, composition: 8 },
                moyenneVingtieme: 9,
                coefficient: 2,
                pointsPonderes: 18,
                appreciation: "Insuffisant"
            }
        ],

        totalPoints: 88,
        totalCoefficients: 13,
        moyenneGenerale: 6.77,
        rang: "28e",

        moyenneSemestreAnterieur: 7.50,
        moyenneAnnuelle: 7.13,

        vieScolaire: {
            absences: 5,
            retards: 8,
            conduite: 8
        },
        effectif: 30,

        decisionConseil: "Redouble",
        observations: "Travail insuffisant, beaucoup d'absences"
    }
];