use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;
use sqlx::Type;

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
#[sqlx(type_name = "TEXT", rename_all = "lowercase")]
pub enum StatutScolaire {
    #[serde(rename = "nouveau")]
    Nouveau,
    #[serde(rename = "redoublant")]
    Redoublant,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BaseInscription {
    pub annee_scolaire: String,
    pub date_inscription: String,
    pub statut_scolaire: StatutScolaire,
    pub classe_id: String,
    pub eleve_data_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PayementCompact {
    pub id: String,
    pub montant_paye: f64,
    pub statut: String,
    pub date_payement: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Inscription {
    pub id: String,
    pub annee_scolaire: String,
    pub date_inscription: String,
    pub statut_scolaire: StatutScolaire,
    pub classe_id: String,
    pub eleve_data_id: String,
    pub niveau_classe: String,
    pub classe: String,
    pub cycle: String,
    pub niveau_scolaire: String,
    pub nom: String,
    pub prenom: String,
    pub date_naissance: String,
    pub sexe: super::eleve_data::Sexe,
    pub photo: Option<String>,
    pub matricule: String,
    pub statut: super::eleve_data::StatutEleve,
    pub lieu_de_naissance: Option<String>,
    pub contact: Option<String>,
    pub payements: Option<Vec<PayementCompact>>,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}