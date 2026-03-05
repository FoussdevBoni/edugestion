import db from '../database/index.js';
import { EleveData } from '../models/index.js';

class EleveDataController {
  getAll() {
    const stmt = db.prepare(`
      SELECT * FROM eleve_data 
      ORDER BY nom, prenom
    `);
    const rows = stmt.all();
    return rows.map(row => new EleveData(row).toJSON());
  }

  create(data) {
    const eleveData = new EleveData(data);
    
    const errors = eleveData.validate();
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    const existing = db.prepare('SELECT id FROM eleve_data WHERE matricule = ?').get(eleveData.matricule);
    if (existing) {
      throw new Error('Un élève avec ce matricule existe déjà');
    }

    const stmt = db.prepare(`
      INSERT INTO eleve_data (
        id, nom, prenom, date_naissance, sexe, photo,
        annee_scolaire, matricule, statut, lieu_de_naissance,
        contact, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const dbData = eleveData.toDB();
    stmt.run(
      dbData.id,
      dbData.nom,
      dbData.prenom,
      dbData.date_naissance,
      dbData.sexe,
      dbData.photo,
      dbData.annee_scolaire,
      dbData.matricule,
      dbData.statut,
      dbData.lieu_de_naissance,
      dbData.contact,
      dbData.created_at,
      dbData.updated_at
    );

    return eleveData.toJSON();
  }

  update(id, updates) {
    const existing = db.prepare('SELECT * FROM eleve_data WHERE id = ?').get(id);
    if (!existing) {
      throw new Error('Élève non trouvé');
    }

    const updatedData = { ...existing, ...updates };
    const eleveData = new EleveData(updatedData);
    eleveData.updatedAt = new Date().toISOString();

    const stmt = db.prepare(`
      UPDATE eleve_data 
      SET nom = ?, prenom = ?, date_naissance = ?, sexe = ?, photo = ?,
          annee_scolaire = ?, matricule = ?, statut = ?, lieu_de_naissance = ?,
          contact = ?, updated_at = ?
      WHERE id = ?
    `);

    stmt.run(
      eleveData.nom,
      eleveData.prenom,
      eleveData.dateNaissance,
      eleveData.sexe,
      eleveData.photo,
      eleveData.anneeScolaire,
      eleveData.matricule,
      eleveData.statut,
      eleveData.lieuDeNaissance,
      eleveData.contact,
      eleveData.updatedAt,
      id
    );

    return eleveData.toJSON();
  }

  delete(id) {
    const inscriptions = db.prepare('SELECT COUNT(*) as count FROM inscription WHERE eleve_data_id = ?').get(id);
    if (inscriptions.count > 0) {
      throw new Error('Impossible de supprimer : cet élève a des inscriptions');
    }

    db.prepare('DELETE FROM eleve_data WHERE id = ?').run(id);
    return { success: true };
  }
}

export default new EleveDataController();