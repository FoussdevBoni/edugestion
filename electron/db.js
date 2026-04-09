import { JSONFilePreset } from 'lowdb/node';
import path from 'path';
import { app } from 'electron';
import { fileURLToPath } from 'url';
import { ipcMain } from 'electron';

// Correction ESM pour __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin persistant : %AppData%/EduGestion/db.json
const dbPath = app.isPackaged
    ? path.join(app.getPath('userData'), 'db.json')
    : path.join(__dirname, 'db.json');

// Schéma de base selon tes interfaces
const defaultData = {
    ecoleInfos: {},
    niveauxScolaires: [],
    cycles: [],
    niveauxClasses: [],
    classes: [],
    elevesData: [],
    inscriptions: [],
    matieres: [],
    notes: [],
    paiements: [],
    config: {
        anneeScolaireCourante: "2025-2026",
        version: "1.0.0"
    }
};

// Variable pour stocker l'instance de la DB
let db;

export const initDb = async () => {
    try {
        // JSONFilePreset crée le fichier s'il n'existe pas avec les données par défaut
        db = await JSONFilePreset(dbPath, defaultData);
        console.log("✅ Base de données JSON initialisée à :", dbPath);
        return db;
    } catch (error) {
        console.error("❌ Erreur lors de l'initialisation de LowDB :", error);
        throw error;
    }
};

// Helper pour accéder à la DB partout dans le Main Process
export const getDb = () => {
    if (!db) throw new Error("La base de données n'est pas initialisée ! Appelez initDb() d'abord.");
    return db;
};


// Fonction pour tout récupérer d'un coup (Utile pour l'initialisation de React)
export const getAllData = () => {
    const db = getDb();
    return db.data; // Retourne l'objet complet (ecole, eleves, etc.)
};

