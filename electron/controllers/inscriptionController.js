import db from '../database/index.js';
import { Inscription } from '../models/index.js';

class InscriptionController {
  getAll(options = {}) {
    let query = `
      SELECT 
        i.*,
        c.nom as classe_nom,
        nc.nom as niveau_classe,
        cy.nom as cycle_nom,
        ns.nom as niveau_scolaire_nom,
        e.nom as eleve_nom,
        e.prenom as eleve_prenom,
        e.date_naissance,
        e.sexe,
        e.photo,
        e.matricule,
        e.statut,
        e.lieu_de_naissance,
        e.contact
      FROM inscription i
      JOIN classe c ON i.classe_id = c.id
      JOIN niveau_classe nc ON c.niveau_classe_id = nc.id
      JOIN cycle cy ON nc.cycle_id = cy.id
      JOIN niveau_scolaire ns ON cy.niveau_scolaire_id = ns.id
      JOIN eleve_data e ON i.eleve_data_id = e.id
      WHERE 1=1
    `;

    const params = [];

    if (options.eleveId) {
      query += ' AND i.eleve_data_id = ?';
      params.push(options.eleveId);
    }

    if (options.anneeScolaire) {
      query += ' AND i.annee_scolaire = ?';
      params.push(options.anneeScolaire);
    }

    query += ' ORDER BY i.date_inscription DESC';

    const stmt = db.prepare(query);
    const rows = stmt.all(...params);

    return rows.map(row => {
      const payements = db.prepare(`
        SELECT * FROM payement WHERE inscription_id = ?
      `).all(row.id);

      return new Inscription({
        ...row,
        classe: row.classe_nom,
        cycle: row.cycle_nom,
        niveauScolaire: row.niveau_scolaire_nom,
        nom: row.eleve_nom,
        prenom: row.eleve_prenom,
        dateNaissance: row.date_naissance,
        sexe: row.sexe,
        photo: row.photo,
        matricule: row.matricule,
        statut: row.statut,
        lieuDeNaissance: row.lieu_de_naissance,
        contact: row.contact,
        payements: payements.map(p => ({
          id: p.id,
          montantPaye: p.montant_paye,
          statut: p.statut,
          datePayement: p.date_payement
        }))
      }).toJSON();
    });
  }

  create(data) {
    const inscription = new Inscription(data);
    
    const errors = inscription.validate();
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }

    const classe = db.prepare(`
      SELECT c.nom, nc.nom as niveau_classe, cy.nom as cycle, ns.nom as niveau_scolaire
      FROM classe c
      JOIN niveau_classe nc ON c.niveau_classe_id = nc.id
      JOIN cycle cy ON nc.cycle_id = cy.id
      JOIN niveau_scolaire ns ON cy.niveau_scolaire_id = ns.id
      WHERE c.id = ?
    `).get(inscription.classeId);

    if (!classe) {
      throw new Error('Classe non trouvée');
    }

    const dbData = inscription.toDB();
    db.prepare(`
      INSERT INTO inscription (
        id, annee_scolaire, date_inscription, statut_scolaire,
        classe_id, eleve_data_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      dbData.id,
      dbData.annee_scolaire,
      dbData.date_inscription,
      dbData.statut_scolaire,
      dbData.classe_id,
      dbData.eleve_data_id,
      dbData.created_at,
      dbData.updated_at
    );

    return this.getAll({ eleveId: inscription.eleveDataId })
      .find(ins => ins.id === inscription.id);
  }

  update(id, updates) {
    const existing = db.prepare('SELECT * FROM inscription WHERE id = ?').get(id);
    if (!existing) {
      throw new Error('Inscription non trouvée');
    }

    const updatedData = { ...existing, ...updates };
    const inscription = new Inscription(updatedData);
    inscription.updatedAt = new Date().toISOString();

    db.prepare(`
      UPDATE inscription 
      SET annee_scolaire = ?, date_inscription = ?, statut_scolaire = ?,
          classe_id = ?, updated_at = ?
      WHERE id = ?
    `).run(
      inscription.anneeScolaire,
      inscription.dateInscription,
      inscription.statutScolaire,
      inscription.classeId,
      inscription.updatedAt,
      id
    );

    return this.getAll({ eleveId: inscription.eleveDataId })
      .find(ins => ins.id === id);
  }

  delete(id) {
    db.prepare('DELETE FROM inscription WHERE id = ?').run(id);
    return { success: true };
  }
}

export default new InscriptionController();