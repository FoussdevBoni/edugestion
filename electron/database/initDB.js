import db from "./db.js";

export default function initDB() {

  db.prepare(`
  CREATE TABLE IF NOT EXISTS eleveDatas (
    id TEXT PRIMARY KEY,
    nom TEXT,
    prenom TEXT,
    dateNaissance TEXT,
    sexe TEXT,
    photo TEXT,
    anneeScolaire TEXT,
    matricule TEXT,
    statut TEXT,
    lieuDeNaissance TEXT,
    contact TEXT,
    createdAt TEXT,
    updatedAt TEXT
  )
  `).run();

}