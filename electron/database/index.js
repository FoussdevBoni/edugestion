import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { runMigrations } from './migrations.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// S'assurer que le dossier data existe
const userDataPath = app.getPath('userData');
const dataDir = path.join(userDataPath, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'gestion_scolaire.db');
const db = new Database(dbPath);

// Activer les foreign keys
db.pragma('foreign_keys = ON');

// Exécuter les migrations
runMigrations(db);

export default db;