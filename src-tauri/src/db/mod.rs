use sqlx::sqlite::{SqlitePool, SqlitePoolOptions};
use once_cell::sync::Lazy;
use std::path::PathBuf;
use tauri::AppHandle;
use anyhow::Result;

pub mod migrations;

pub static DB_POOL: Lazy<tokio::sync::Mutex<Option<SqlitePool>>> = 
    Lazy::new(|| tokio::sync::Mutex::new(None));

pub async fn init_db(app_handle: &AppHandle) -> Result<SqlitePool> {
    let app_dir = app_handle.path_resolver()
        .app_data_dir()
        .expect("Failed to get app data dir");
    
    std::fs::create_dir_all(&app_dir)?;
    
    let db_path = app_dir.join("gestion_scolaire.db");
    let db_url = format!("sqlite:{}", db_path.display());
    
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await?;
    
    migrations::run_migrations(&pool).await?;
    
    let mut global_pool = DB_POOL.lock().await;
    *global_pool = Some(pool.clone());
    
    Ok(pool)
}

pub async fn get_db() -> SqlitePool {
    let pool_guard = DB_POOL.lock().await;
    pool_guard.clone().expect("Database not initialized")
}