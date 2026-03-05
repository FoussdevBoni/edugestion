import { v4 as uuidv4 } from 'uuid';

export class EleveData {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.nom = data.nom || '';
    this.prenom = data.prenom || '';
    this.dateNaissance = data.dateNaissance || data.date_naissance || '';
    this.sexe = data.sexe || 'M';
    this.photo = data.photo || null;
    this.anneeScolaire = data.anneeScolaire || data.annee_scolaire || '';
    this.matricule = data.matricule || '';
    this.statut = data.statut || 'actif';
    this.lieuDeNaissance = data.lieuDeNaissance || data.lieu_de_naissance || null;
    this.contact = data.contact || null;
    this.createdAt = data.createdAt || data.created_at || new Date().toISOString();
    this.updatedAt = data.updatedAt || data.updated_at || new Date().toISOString();
  }

  toDB() {
    return {
      id: this.id,
      nom: this.nom,
      prenom: this.prenom,
      date_naissance: this.dateNaissance,
      sexe: this.sexe,
      photo: this.photo,
      annee_scolaire: this.anneeScolaire,
      matricule: this.matricule,
      statut: this.statut,
      lieu_de_naissance: this.lieuDeNaissance,
      contact: this.contact,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  toJSON() {
    return {
      id: this.id,
      nom: this.nom,
      prenom: this.prenom,
      dateNaissance: this.dateNaissance,
      sexe: this.sexe,
      photo: this.photo,
      anneeScolaire: this.anneeScolaire,
      matricule: this.matricule,
      statut: this.statut,
      lieuDeNaissance: this.lieuDeNaissance,
      contact: this.contact,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  validate() {
    const errors = [];
    if (!this.nom) errors.push('Le nom est requis');
    if (!this.prenom) errors.push('Le prénom est requis');
    if (!this.dateNaissance) errors.push('La date de naissance est requise');
    if (!this.matricule) errors.push('Le matricule est requis');
    if (!['M', 'F'].includes(this.sexe)) errors.push('Le sexe doit être M ou F');
    if (!['actif', 'inactif', 'exclu'].includes(this.statut)) {
      errors.push('Le statut doit être actif, inactif ou exclu');
    }
    return errors;
  }
}