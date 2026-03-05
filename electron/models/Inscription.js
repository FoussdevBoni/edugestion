import { v4 as uuidv4 } from 'uuid';

export class Inscription {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.anneeScolaire = data.anneeScolaire || data.annee_scolaire || '';
    this.dateInscription = data.dateInscription || data.date_inscription || new Date().toISOString().split('T')[0];
    this.statutScolaire = data.statutScolaire || data.statut_scolaire || 'nouveau';
    this.classeId = data.classeId || data.classe_id || '';
    this.eleveDataId = data.eleveDataId || data.eleve_data_id || '';
    this.createdAt = data.createdAt || data.created_at || new Date().toISOString();
    this.updatedAt = data.updatedAt || data.updated_at || new Date().toISOString();
    
    this.niveauClasse = data.niveauClasse || data.niveau_classe || '';
    this.classe = data.classe || '';
    this.cycle = data.cycle || '';
    this.niveauScolaire = data.niveauScolaire || data.niveau_scolaire || '';
    this.nom = data.nom || '';
    this.prenom = data.prenom || '';
    this.dateNaissance = data.dateNaissance || data.date_naissance || '';
    this.sexe = data.sexe || '';
    this.photo = data.photo || null;
    this.matricule = data.matricule || '';
    this.statut = data.statut || '';
    this.lieuDeNaissance = data.lieuDeNaissance || data.lieu_de_naissance || null;
    this.contact = data.contact || null;
    this.payements = data.payements || [];
  }

  toDB() {
    return {
      id: this.id,
      annee_scolaire: this.anneeScolaire,
      date_inscription: this.dateInscription,
      statut_scolaire: this.statutScolaire,
      classe_id: this.classeId,
      eleve_data_id: this.eleveDataId,
      created_at: this.createdAt,
      updated_at: this.updatedAt
    };
  }

  toJSON() {
    return {
      id: this.id,
      anneeScolaire: this.anneeScolaire,
      dateInscription: this.dateInscription,
      statutScolaire: this.statutScolaire,
      classeId: this.classeId,
      eleveDataId: this.eleveDataId,
      niveauClasse: this.niveauClasse,
      classe: this.classe,
      cycle: this.cycle,
      niveauScolaire: this.niveauScolaire,
      nom: this.nom,
      prenom: this.prenom,
      dateNaissance: this.dateNaissance,
      sexe: this.sexe,
      photo: this.photo,
      matricule: this.matricule,
      statut: this.statut,
      lieuDeNaissance: this.lieuDeNaissance,
      contact: this.contact,
      payements: this.payements,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  validate() {
    const errors = [];
    if (!this.anneeScolaire) errors.push("L'année scolaire est requise");
    if (!this.dateInscription) errors.push("La date d'inscription est requise");
    if (!this.classeId) errors.push("La classe est requise");
    if (!this.eleveDataId) errors.push("L'élève est requis");
    if (!['nouveau', 'redoublant'].includes(this.statutScolaire)) {
      errors.push('Le statut scolaire doit être nouveau ou redoublant');
    }
    return errors;
  }
}