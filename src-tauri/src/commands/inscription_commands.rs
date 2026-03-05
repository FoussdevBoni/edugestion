use tauri::command;
use crate::models::{BaseInscription, Inscription, StatutScolaire};
use crate::db::get_db;
use uuid::Uuid;
use chrono::Utc;

#[command]
pub async fn get_inscriptions(
    eleve_id: Option<String>,
    annee_scolaire: Option<String>
) -> Result<Vec<Inscription>, String> {
    let db = get_db().await;
    
    let mut query = r#"
        SELECT 
            i.id, i.annee_scolaire, i.date_inscription,
            i.statut_scolaire as "statut_scolaire: _",
            i.classe_id, i.eleve_data_id,
            i.niveau_classe, i.classe, i.cycle, i.niveau_scolaire,
            e.nom, e.prenom, e.date_naissance,
            e.sexe as "sexe: _",
            e.photo, e.matricule,
            e.statut as "statut: _",
            e.lieu_de_naissance, e.contact,
            i.created_at, i.updated_at
        FROM inscriptions i
        JOIN eleve_data e ON i.eleve_data_id = e.id
        WHERE 1=1
    "#.to_string();
    
    let mut params: Vec<String> = vec![];
    
    if let Some(e_id) = eleve_id {
        query.push_str(" AND i.eleve_data_id = ?");
        params.push(e_id);
    }
    
    if let Some(annee) = annee_scolaire {
        query.push_str(" AND i.annee_scolaire = ?");
        params.push(annee);
    }
    
    query.push_str(" ORDER BY i.date_inscription DESC");
    
    let mut query_builder = sqlx::query_as::<_, Inscription>(&query);
    for param in params {
        query_builder = query_builder.bind(param);
    }
    
    let inscriptions = query_builder
        .fetch_all(&db)
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(inscriptions)
}

#[command]
pub async fn add_inscription(payload: BaseInscription) -> Result<Inscription, String> {
    let db = get_db().await;
    
    let classe = sqlx::query_as::<_, (String, String, String, String)>(
        r#"
        SELECT nom, niveau_classe, cycle, niveau_scolaire
        FROM classes
        WHERE id = ?
        "#
    )
    .bind(&payload.classe_id)
    .fetch_one(&db)
    .await
    .map_err(|e| e.to_string())?;
    
    let eleve = sqlx::query_as::<_, (String, String, String, String, Option<String>, String, String, Option<String>, Option<String>)>(
        r#"
        SELECT nom, prenom, date_naissance, sexe, photo, matricule,
               statut, lieu_de_naissance, contact
        FROM eleve_data
        WHERE id = ?
        "#
    )
    .bind(&payload.eleve_data_id)
    .fetch_one(&db)
    .await
    .map_err(|e| e.to_string())?;
    
    let id = Uuid::new_v4().to_string();
    let now = Utc::now();
    
    sqlx::query(
        r#"
        INSERT INTO inscriptions (
            id, annee_scolaire, date_inscription, statut_scolaire,
            classe_id, eleve_data_id, niveau_classe, classe,
            cycle, niveau_scolaire, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        "#
    )
    .bind(&id)
    .bind(&payload.annee_scolaire)
    .bind(&payload.date_inscription)
    .bind(&payload.statut_scolaire)
    .bind(&payload.classe_id)
    .bind(&payload.eleve_data_id)
    .bind(&classe.1)
    .bind(&classe.0)
    .bind(&classe.2)
    .bind(&classe.3)
    .bind(now)
    .bind(now)
    .execute(&db)
    .await
    .map_err(|e| e.to_string())?;
    
    let inscription = Inscription {
        id,
        annee_scolaire: payload.annee_scolaire,
        date_inscription: payload.date_inscription,
        statut_scolaire: payload.statut_scolaire,
        classe_id: payload.classe_id,
        eleve_data_id: payload.eleve_data_id,
        niveau_classe: classe.1,
        classe: classe.0,
        cycle: classe.2,
        niveau_scolaire: classe.3,
        nom: eleve.0,
        prenom: eleve.1,
        date_naissance: eleve.2,
        sexe: serde_json::from_str(&eleve.3).unwrap(),
        photo: eleve.4,
        matricule: eleve.5,
        statut: serde_json::from_str(&eleve.6).unwrap(),
        lieu_de_naissance: eleve.7,
        contact: eleve.8,
        payements: None,
        created_at: Some(now),
        updated_at: Some(now),
    };
    
    Ok(inscription)
}

#[command]
pub async fn update_inscription(id: String, payload: serde_json::Value) -> Result<Inscription, String> {
    let db = get_db().await;
    
    let existing = sqlx::query_as::<_, Inscription>(
        r#"
        SELECT 
            i.id, i.annee_scolaire, i.date_inscription,
            i.statut_scolaire as "statut_scolaire: _",
            i.classe_id, i.eleve_data_id,
            i.niveau_classe, i.classe, i.cycle, i.niveau_scolaire,
            e.nom, e.prenom, e.date_naissance,
            e.sexe as "sexe: _",
            e.photo, e.matricule,
            e.statut as "statut: _",
            e.lieu_de_naissance, e.contact,
            i.created_at, i.updated_at
        FROM inscriptions i
        JOIN eleve_data e ON i.eleve_data_id = e.id
        WHERE i.id = ?
        "#
    )
    .bind(&id)
    .fetch_one(&db)
    .await
    .map_err(|e| e.to_string())?;
    
    Ok(existing)
}

#[command]
pub async fn delete_inscription(id: String) -> Result<(), String> {
    let db = get_db().await;
    
    sqlx::query("DELETE FROM inscriptions WHERE id = ?")
        .bind(id)
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(())
}