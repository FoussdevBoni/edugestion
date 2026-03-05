use tauri::command;
use crate::models::{BaseEleveData, EleveData, Sexe, StatutEleve};
use crate::db::get_db;
use chrono::{DateTime, Utc};

#[command]
pub async fn get_eleves_data() -> Result<Vec<EleveData>, String> {
    let db = get_db().await;
    
    let rows = sqlx::query(
        r#"
        SELECT 
            id, nom, prenom, date_naissance, sexe, photo, 
            annee_scolaire, matricule, statut, lieu_de_naissance, contact,
            created_at, updated_at
        FROM eleve_data
        ORDER BY nom, prenom
        "#
    )
    .fetch_all(&db)
    .await
    .map_err(|e| e.to_string())?;
    
    let mut eleves = Vec::new();
    for row in rows {
        let sexe_str: String = row.try_get("sexe").map_err(|e| e.to_string())?;
        let statut_str: String = row.try_get("statut").map_err(|e| e.to_string())?;
        
        let sexe = match sexe_str.as_str() {
            "M" => Sexe::M,
            "F" => Sexe::F,
            _ => return Err("Sexe invalide".to_string()),
        };
        
        let statut = match statut_str.as_str() {
            "actif" => StatutEleve::Actif,
            "inactif" => StatutEleve::Inactif,
            "exclu" => StatutEleve::Exclu,
            _ => return Err("Statut invalide".to_string()),
        };
        
        eleves.push(EleveData {
            id: row.try_get("id").map_err(|e| e.to_string())?,
            nom: row.try_get("nom").map_err(|e| e.to_string())?,
            prenom: row.try_get("prenom").map_err(|e| e.to_string())?,
            date_naissance: row.try_get("date_naissance").map_err(|e| e.to_string())?,
            sexe,
            photo: row.try_get("photo").map_err(|e| e.to_string())?,
            annee_scolaire: row.try_get("annee_scolaire").map_err(|e| e.to_string())?,
            matricule: row.try_get("matricule").map_err(|e| e.to_string())?,
            statut,
            lieu_de_naissance: row.try_get("lieu_de_naissance").map_err(|e| e.to_string())?,
            contact: row.try_get("contact").map_err(|e| e.to_string())?,
            created_at: row.try_get("created_at").map_err(|e| e.to_string())?,
            updated_at: row.try_get("updated_at").map_err(|e| e.to_string())?,
        });
    }
    
    Ok(eleves)
}

#[command]
pub async fn add_eleve_data(payload: BaseEleveData) -> Result<EleveData, String> {
    let db = get_db().await;
    
    let id = uuid::Uuid::new_v4().to_string();
    let now = Utc::now();
    
    let sexe_str = match payload.sexe {
        Sexe::M => "M",
        Sexe::F => "F",
    };
    
    let statut_str = match payload.statut {
        StatutEleve::Actif => "actif",
        StatutEleve::Inactif => "inactif",
        StatutEleve::Exclu => "exclu",
    };
    
    sqlx::query(
        r#"
        INSERT INTO eleve_data (
            id, nom, prenom, date_naissance, sexe, photo,
            annee_scolaire, matricule, statut, lieu_de_naissance,
            contact, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#
    )
    .bind(&id)
    .bind(&payload.nom)
    .bind(&payload.prenom)
    .bind(&payload.date_naissance)
    .bind(sexe_str)
    .bind(&payload.photo)
    .bind(&payload.annee_scolaire)
    .bind(&payload.matricule)
    .bind(statut_str)
    .bind(&payload.lieu_de_naissance)
    .bind(&payload.contact)
    .bind(now)
    .bind(now)
    .execute(&db)
    .await
    .map_err(|e| e.to_string())?;
    
    Ok(EleveData {
        id,
        nom: payload.nom,
        prenom: payload.prenom,
        date_naissance: payload.date_naissance,
        sexe: payload.sexe,
        photo: payload.photo,
        annee_scolaire: payload.annee_scolaire,
        matricule: payload.matricule,
        statut: payload.statut,
        lieu_de_naissance: payload.lieu_de_naissance,
        contact: payload.contact,
        created_at: Some(now),
        updated_at: Some(now),
    })
}

#[command]
pub async fn update_eleve_data(id: String, payload: serde_json::Value) -> Result<EleveData, String> {
    let db = get_db().await;
    
    let row = sqlx::query(
        r#"
        SELECT 
            id, nom, prenom, date_naissance, sexe, photo, 
            annee_scolaire, matricule, statut, lieu_de_naissance, contact,
            created_at, updated_at
        FROM eleve_data
        WHERE id = ?
        "#
    )
    .bind(&id)
    .fetch_one(&db)
    .await
    .map_err(|e| e.to_string())?;
    
    let sexe_str: String = row.try_get("sexe").map_err(|e| e.to_string())?;
    let statut_str: String = row.try_get("statut").map_err(|e| e.to_string())?;
    
    let sexe = match sexe_str.as_str() {
        "M" => Sexe::M,
        "F" => Sexe::F,
        _ => return Err("Sexe invalide".to_string()),
    };
    
    let statut = match statut_str.as_str() {
        "actif" => StatutEleve::Actif,
        "inactif" => StatutEleve::Inactif,
        "exclu" => StatutEleve::Exclu,
        _ => return Err("Statut invalide".to_string()),
    };
    
    let mut eleve = EleveData {
        id: row.try_get("id").map_err(|e| e.to_string())?,
        nom: row.try_get("nom").map_err(|e| e.to_string())?,
        prenom: row.try_get("prenom").map_err(|e| e.to_string())?,
        date_naissance: row.try_get("date_naissance").map_err(|e| e.to_string())?,
        sexe,
        photo: row.try_get("photo").map_err(|e| e.to_string())?,
        annee_scolaire: row.try_get("annee_scolaire").map_err(|e| e.to_string())?,
        matricule: row.try_get("matricule").map_err(|e| e.to_string())?,
        statut,
        lieu_de_naissance: row.try_get("lieu_de_naissance").map_err(|e| e.to_string())?,
        contact: row.try_get("contact").map_err(|e| e.to_string())?,
        created_at: row.try_get("created_at").map_err(|e| e.to_string())?,
        updated_at: row.try_get("updated_at").map_err(|e| e.to_string())?,
    };
    
    if let Some(nom) = payload.get("nom").and_then(|v| v.as_str()) {
        eleve.nom = nom.to_string();
    }
    if let Some(prenom) = payload.get("prenom").and_then(|v| v.as_str()) {
        eleve.prenom = prenom.to_string();
    }
    
    eleve.updated_at = Some(Utc::now());
    
    sqlx::query(
        r#"
        UPDATE eleve_data
        SET nom = ?, prenom = ?, updated_at = ?
        WHERE id = ?
        "#
    )
    .bind(&eleve.nom)
    .bind(&eleve.prenom)
    .bind(eleve.updated_at)
    .bind(&id)
    .execute(&db)
    .await
    .map_err(|e| e.to_string())?;
    
    Ok(eleve)
}

#[command]
pub async fn delete_eleve_data(id: String) -> Result<(), String> {
    let db = get_db().await;
    
    let count: (i64,) = sqlx::query_as(
        "SELECT COUNT(*) FROM inscriptions WHERE eleve_data_id = ?"
    )
    .bind(&id)
    .fetch_one(&db)
    .await
    .map_err(|e| e.to_string())?;
    
    if count.0 > 0 {
        return Err("Impossible de supprimer : cet élève a des inscriptions".to_string());
    }
    
    sqlx::query("DELETE FROM eleve_data WHERE id = ?")
        .bind(id)
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(())
}