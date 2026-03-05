import { v4 as uuidv4 } from 'uuid';

export function runMigrations(db) {
  // Table eleve_data
  db.exec(`
    CREATE TABLE IF NOT EXISTS eleve_data (
      id TEXT PRIMARY KEY,
      nom TEXT NOT NULL,
      prenom TEXT NOT NULL,
      date_naissance TEXT NOT NULL,
      sexe TEXT CHECK(sexe IN ('M', 'F')) NOT NULL,
      photo TEXT,
      annee_scolaire TEXT NOT NULL,
      matricule TEXT UNIQUE NOT NULL,
      statut TEXT CHECK(statut IN ('actif', 'inactif', 'exclu')) NOT NULL,
      lieu_de_naissance TEXT,
      contact TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table niveau_scolaire
  db.exec(`
    CREATE TABLE IF NOT EXISTS niveau_scolaire (
      id TEXT PRIMARY KEY,
      nom TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table cycle
  db.exec(`
    CREATE TABLE IF NOT EXISTS cycle (
      id TEXT PRIMARY KEY,
      niveau_scolaire_id TEXT NOT NULL,
      nom TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (niveau_scolaire_id) REFERENCES niveau_scolaire(id) ON DELETE CASCADE
    )
  `);

  // Table niveau_classe
  db.exec(`
    CREATE TABLE IF NOT EXISTS niveau_classe (
      id TEXT PRIMARY KEY,
      cycle_id TEXT NOT NULL,
      nom TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cycle_id) REFERENCES cycle(id) ON DELETE CASCADE
    )
  `);

  // Table classe
  db.exec(`
    CREATE TABLE IF NOT EXISTS classe (
      id TEXT PRIMARY KEY,
      nom TEXT NOT NULL,
      niveau_classe_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (niveau_classe_id) REFERENCES niveau_classe(id) ON DELETE CASCADE
    )
  `);

  // Table periode
  db.exec(`
    CREATE TABLE IF NOT EXISTS periode (
      id TEXT PRIMARY KEY,
      nom TEXT NOT NULL,
      ordre INTEGER NOT NULL,
      date_debut TEXT NOT NULL,
      date_fin TEXT NOT NULL,
      cycle_id TEXT,
      niveau_scolaire_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cycle_id) REFERENCES cycle(id) ON DELETE CASCADE,
      FOREIGN KEY (niveau_scolaire_id) REFERENCES niveau_scolaire(id) ON DELETE CASCADE
    )
  `);

  // Table matiere
  db.exec(`
    CREATE TABLE IF NOT EXISTS matiere (
      id TEXT PRIMARY KEY,
      nom TEXT NOT NULL,
      coefficient INTEGER NOT NULL,
      niveau_classe_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (niveau_classe_id) REFERENCES niveau_classe(id) ON DELETE CASCADE
    )
  `);

  // Table enseignant
  db.exec(`
    CREATE TABLE IF NOT EXISTS enseignant (
      id TEXT PRIMARY KEY,
      nom TEXT NOT NULL,
      prenom TEXT NOT NULL,
      email TEXT NOT NULL,
      tel TEXT NOT NULL,
      matieres_ids TEXT,
      classes_ids TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table evaluation
  db.exec(`
    CREATE TABLE IF NOT EXISTS evaluation (
      id TEXT PRIMARY KEY,
      nom TEXT NOT NULL,
      cycle_id TEXT,
      niveau_scolaire_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cycle_id) REFERENCES cycle(id) ON DELETE CASCADE,
      FOREIGN KEY (niveau_scolaire_id) REFERENCES niveau_scolaire(id) ON DELETE CASCADE
    )
  `);

  // Table inscription
  db.exec(`
    CREATE TABLE IF NOT EXISTS inscription (
      id TEXT PRIMARY KEY,
      annee_scolaire TEXT NOT NULL,
      date_inscription TEXT NOT NULL,
      statut_scolaire TEXT CHECK(statut_scolaire IN ('nouveau', 'redoublant')) NOT NULL,
      classe_id TEXT NOT NULL,
      eleve_data_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (classe_id) REFERENCES classe(id) ON DELETE CASCADE,
      FOREIGN KEY (eleve_data_id) REFERENCES eleve_data(id) ON DELETE CASCADE
    )
  `);

  // Table payement
  db.exec(`
    CREATE TABLE IF NOT EXISTS payement (
      id TEXT PRIMARY KEY,
      inscription_id TEXT NOT NULL,
      montant_paye REAL NOT NULL,
      statut TEXT CHECK(statut IN ('partiellement', 'paye')) NOT NULL,
      montant_restant REAL NOT NULL,
      date_payement TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (inscription_id) REFERENCES inscription(id) ON DELETE CASCADE
    )
  `);

  // Table note
  db.exec(`
    CREATE TABLE IF NOT EXISTS note (
      id TEXT PRIMARY KEY,
      inscription_id TEXT NOT NULL,
      matiere_id TEXT NOT NULL,
      periode_id TEXT NOT NULL,
      note REAL NOT NULL,
      coefficient INTEGER NOT NULL,
      enseignant_id TEXT NOT NULL,
      evaluation_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (inscription_id) REFERENCES inscription(id) ON DELETE CASCADE,
      FOREIGN KEY (matiere_id) REFERENCES matiere(id) ON DELETE CASCADE,
      FOREIGN KEY (periode_id) REFERENCES periode(id) ON DELETE CASCADE,
      FOREIGN KEY (enseignant_id) REFERENCES enseignant(id) ON DELETE CASCADE,
      FOREIGN KEY (evaluation_id) REFERENCES evaluation(id) ON DELETE CASCADE
    )
  `);

  // Table seance
  db.exec(`
    CREATE TABLE IF NOT EXISTS seance (
      id TEXT PRIMARY KEY,
      classe_id TEXT NOT NULL,
      matiere_id TEXT NOT NULL,
      enseignant_id TEXT NOT NULL,
      jour TEXT CHECK(jour IN ('LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI')) NOT NULL,
      heure_debut TEXT NOT NULL,
      heure_fin TEXT NOT NULL,
      annee_scolaire TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (classe_id) REFERENCES classe(id) ON DELETE CASCADE,
      FOREIGN KEY (matiere_id) REFERENCES matiere(id) ON DELETE CASCADE,
      FOREIGN KEY (enseignant_id) REFERENCES enseignant(id) ON DELETE CASCADE
    )
  `);

  // Insérer des données initiales si la table est vide
  const count = db.prepare('SELECT COUNT(*) as count FROM niveau_scolaire').get();
  if (count.count === 0) {
    insertInitialData(db);
  }
}

function insertInitialData(db) {
  const insert = db.transaction(() => {
    // Niveaux scolaires
    db.prepare('INSERT INTO niveau_scolaire (id, nom) VALUES (?, ?)').run('1', 'Préscolaire');
    db.prepare('INSERT INTO niveau_scolaire (id, nom) VALUES (?, ?)').run('2', 'Primaire');
    db.prepare('INSERT INTO niveau_scolaire (id, nom) VALUES (?, ?)').run('3', 'Secondaire');

    // Cycles
    db.prepare('INSERT INTO cycle (id, niveau_scolaire_id, nom) VALUES (?, ?, ?)').run('1', '2', '1er cycle');
    db.prepare('INSERT INTO cycle (id, niveau_scolaire_id, nom) VALUES (?, ?, ?)').run('2', '2', '2ème cycle');
    db.prepare('INSERT INTO cycle (id, niveau_scolaire_id, nom) VALUES (?, ?, ?)').run('3', '3', '1er cycle');
    db.prepare('INSERT INTO cycle (id, niveau_scolaire_id, nom) VALUES (?, ?, ?)').run('4', '3', '2ème cycle');

    // Niveaux de classe
    db.prepare('INSERT INTO niveau_classe (id, cycle_id, nom) VALUES (?, ?, ?)').run('1', '1', 'CP');
    db.prepare('INSERT INTO niveau_classe (id, cycle_id, nom) VALUES (?, ?, ?)').run('2', '1', 'CE1');
    db.prepare('INSERT INTO niveau_classe (id, cycle_id, nom) VALUES (?, ?, ?)').run('3', '1', 'CE2');
    db.prepare('INSERT INTO niveau_classe (id, cycle_id, nom) VALUES (?, ?, ?)').run('4', '2', 'CM1');
    db.prepare('INSERT INTO niveau_classe (id, cycle_id, nom) VALUES (?, ?, ?)').run('5', '2', 'CM2');
    db.prepare('INSERT INTO niveau_classe (id, cycle_id, nom) VALUES (?, ?, ?)').run('6', '3', '6ème');
    db.prepare('INSERT INTO niveau_classe (id, cycle_id, nom) VALUES (?, ?, ?)').run('7', '3', '5ème');
    db.prepare('INSERT INTO niveau_classe (id, cycle_id, nom) VALUES (?, ?, ?)').run('8', '4', '4ème');
    db.prepare('INSERT INTO niveau_classe (id, cycle_id, nom) VALUES (?, ?, ?)').run('9', '4', '3ème');

    // Classes
    db.prepare('INSERT INTO classe (id, nom, niveau_classe_id) VALUES (?, ?, ?)').run('1', 'CP A', '1');
    db.prepare('INSERT INTO classe (id, nom, niveau_classe_id) VALUES (?, ?, ?)').run('2', 'CP B', '1');
    db.prepare('INSERT INTO classe (id, nom, niveau_classe_id) VALUES (?, ?, ?)').run('3', '6ème A', '6');
    db.prepare('INSERT INTO classe (id, nom, niveau_classe_id) VALUES (?, ?, ?)').run('4', '6ème B', '6');
  });

  insert();
}