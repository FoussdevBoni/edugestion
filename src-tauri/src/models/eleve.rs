use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Eleve {
    pub id: String,
    pub eleve_data_id: String,
    pub annee_scolaire: String,
    pub date_inscription: String,
    pub statut_scolaire: String,
    pub classe_id: String,
    pub niveau_classe: String,
    pub classe: String,
    pub cycle: String,
    pub niveau_scolaire: String,
    pub nom: String,
    pub prenom: String,
    pub date_naissance: String,
    pub sexe: String,
    pub photo: Option<String>,
    pub matricule: String,
    pub statut: String,
    pub lieu_de_naissance: Option<String>,
    pub contact: Option<String>,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}