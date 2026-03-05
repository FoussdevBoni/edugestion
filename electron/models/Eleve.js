export class Eleve {
  constructor(data = {}) {
    this.id = data.id || '';
    this.eleveDataId = data.eleveDataId || data.eleve_data_id || '';
    this.anneeScolaire = data.anneeScolaire || data.annee_scolaire || '';
    this.dateInscription = data.dateInscription || data.date_inscription || '';
    this.statutScolaire = data.statutScolaire || data.statut_scolaire || '';
    this.classeId = data.classeId || data.classe_id || '';
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
    this.createdAt = data.createdAt || data.created_at || '';
    this.updatedAt = data.updatedAt || data.updated_at || '';
  }

  toJSON() {
    return {
      id: this.id,
      eleveDataId: this.eleveDataId,
      anneeScolaire: this.anneeScolaire,
      dateInscription: this.dateInscription,
      statutScolaire: this.statutScolaire,
      classeId: this.classeId,
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
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}