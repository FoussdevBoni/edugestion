use tauri::command;
use crate::models::Eleve;
use crate::db::get_db;

#[command]
pub async fn get_eleves(annee_scolaire: Option<String>) -> Result<Vec<Eleve>, String> {
    let db = get_db().await;
    
    let annee = annee_scolaire.unwrap_or_else(|| "2024-2025".to_string());
    
    let eleves = sqlx::query_as::<_, Eleve>(
        r#"
        SELECT 
            i.id, i.eleve_data_id,
            i.annee_scolaire, i.date_inscription,
            i.statut_scolaire as "statut_scolaire",
            i.classe_id,
            i.niveau_classe, i.classe, i.cycle, i.niveau_scolaire,
            e.nom, e.prenom, e.date_naissance,
            e.sexe as "sexe",
            e.photo, e.matricule,
            e.statut as "statut",
            e.lieu_de_naissance, e.contact,
            i.created_at, i.updated_at
        FROM inscriptions i
        JOIN eleve_data e ON i.eleve_data_id = e.id
        WHERE i.annee_scolaire = ?
        ORDER BY e.nom, e.prenom
        "#
    )
    .bind(annee)
    .fetch_all(&db)
    .await
    .map_err(|e| e.to_string())?;
    
    Ok(eleves)
}

#[command]
pub async fn add_eleve(_payload: serde_json::Value) -> Result<Eleve, String> {
    Err("Non implémenté".to_string())
}

#[command]
pub async fn update_eleve(id: String, payload: serde_json::Value) -> Result<Eleve, String> {
    let db = get_db().await;
    
    if let Some(statut) = payload.get("statut").and_then(|v| v.as_str()) {
        sqlx::query("UPDATE inscriptions SET statut_scolaire = ? WHERE id = ?")
            .bind(statut)
            .bind(&id)
            .execute(&db)
            .await
            .map_err(|e| e.to_string())?;
    }
    
    if let Some(classe) = payload.get("classe").and_then(|v| v.as_str()) {
        sqlx::query("UPDATE inscriptions SET classe_id = ? WHERE id = ?")
            .bind(classe)
            .bind(&id)
            .execute(&db)
            .await
            .map_err(|e| e.to_string())?;
    }
    
    let eleve = sqlx::query_as::<_, Eleve>(
        r#"
        SELECT 
            i.id, i.eleve_data_id,
            i.annee_scolaire, i.date_inscription,
            i.statut_scolaire as "statut_scolaire",
            i.classe_id,
            i.niveau_classe, i.classe, i.cycle, i.niveau_scolaire,
            e.nom, e.prenom, e.date_naissance,
            e.sexe as "sexe",
            e.photo, e.matricule,
            e.statut as "statut",
            e.lieu_de_naissance, e.contact,
            i.created_at, i.updated_at
        FROM inscriptions i
        JOIN eleve_data e ON i.eleve_data_id = e.id
        WHERE i.id = ?
        "#
    )
    .bind(id)
    .fetch_one(&db)
    .await
    .map_err(|e| e.to_string())?;
    
    Ok(eleve)
}

#[command]
pub async fn delete_eleve(id: String) -> Result<(), String> {
    let db = get_db().await;
    
    sqlx::query("DELETE FROM inscriptions WHERE id = ?")
        .bind(id)
        .execute(&db)
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(())
}