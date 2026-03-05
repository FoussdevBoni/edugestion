import db from '../database/index.js';
import { Eleve } from '../models/index.js';

class EleveController {
  getAll(options = {}) {
    const anneeScolaire = options.anneeScolaire || 
      new Date().getFullYear() + '-' + (new Date().getFullYear() + 1);

    const rows = db.prepare(`
      SELECT 
        i.id,
        i.eleve_data_id,
        i.annee_scolaire,
        i.date_inscription,
        i.statut_scolaire,
        i.classe_id,
        c.nom as classe,
        nc.nom as niveau_classe,
        cy.nom as cycle,
        ns.nom as niveau_scolaire,
        e.nom,
        e.prenom,
        e.date_naissance,
        e.sexe,
        e.photo,
        e.matricule,
        e.statut,
        e.lieu_de_naissance,
        e.contact,
        i.created_at,
        i.updated_at
      FROM inscription i
      JOIN classe c ON i.classe_id = c.id
      JOIN niveau_classe nc ON c.niveau_classe_id = nc.id
      JOIN cycle cy ON nc.cycle_id = cy.id
      JOIN niveau_scolaire ns ON cy.niveau_scolaire_id = ns.id
      JOIN eleve_data e ON i.eleve_data_id = e.id
      WHERE i.annee_scolaire = ?
      ORDER BY e.nom, e.prenom
    `).all(anneeScolaire);

    return rows.map(row => new Eleve(row).toJSON());
  }

  update(id, updates) {
    const sets = [];
    const params = [];

    if (updates.statut) {
      sets.push('statut_scolaire = ?');
      params.push(updates.statut);
    }

    if (updates.classe) {
      sets.push('classe_id = ?');
      params.push(updates.classe);
    }

    if (sets.length === 0) {
      throw new Error('Aucune mise à jour fournie');
    }

    params.push(id);

    db.prepare(`
      UPDATE inscription 
      SET ${sets.join(', ')}
      WHERE id = ?
    `).run(...params);

    return this.getAll().find(e => e.id === id);
  }

  delete(id) {
    db.prepare('DELETE FROM inscription WHERE id = ?').run(id);
    return { success: true };
  }
}

export default new EleveController();