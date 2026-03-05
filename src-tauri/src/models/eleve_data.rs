use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;
use sqlx::Type;
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, Type, FromRow)]
#[sqlx(type_name = "TEXT", rename_all = "lowercase")]
pub enum Sexe {
    #[serde(rename = "M")]
    M,
    #[serde(rename = "F")]
    F,
}

#[derive(Debug, Clone, Serialize, Deserialize, Type, FromRow)]
#[sqlx(type_name = "TEXT", rename_all = "lowercase")]
pub enum StatutEleve {
    #[serde(rename = "actif")]
    Actif,
    #[serde(rename = "inactif")]
    Inactif,
    #[serde(rename = "exclu")]
    Exclu,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BaseEleveData {
    pub nom: String,
    pub prenom: String,
    pub date_naissance: String,
    pub sexe: Sexe,
    pub photo: Option<String>,
    pub annee_scolaire: String,
    pub matricule: String,
    pub statut: StatutEleve,
    pub lieu_de_naissance: Option<String>,
    pub contact: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct EleveData {
    pub id: String,
    pub nom: String,
    pub prenom: String,
    pub date_naissance: String,
    pub sexe: Sexe,
    pub photo: Option<String>,
    pub annee_scolaire: String,
    pub matricule: String,
    pub statut: StatutEleve,
    pub lieu_de_naissance: Option<String>,
    pub contact: Option<String>,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

impl From<BaseEleveData> for EleveData {
    fn from(base: BaseEleveData) -> Self {
        let now = Utc::now();
        Self {
            id: Uuid::new_v4().to_string(),
            nom: base.nom,
            prenom: base.prenom,
            date_naissance: base.date_naissance,
            sexe: base.sexe,
            photo: base.photo,
            annee_scolaire: base.annee_scolaire,
            matricule: base.matricule,
            statut: base.statut,
            lieu_de_naissance: base.lieu_de_naissance,
            contact: base.contact,
            created_at: Some(now),
            updated_at: Some(now),
        }
    }
}