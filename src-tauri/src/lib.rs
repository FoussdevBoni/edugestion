mod models;
mod db;
mod commands;

use tauri::Manager;
use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // Configuration du logging
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            
            // Initialiser la base de données de façon BLOQUANTE
            // pour être SÛR qu'elle est créée avant toute commande
            let handle = app.handle().clone();
            tauri::async_runtime::block_on(async move {
                match db::init_db(&handle).await {
                    Ok(_) => {
                        println!("==================================================");
                        println!("✅ BASE DE DONNÉES INITIALISÉE AVEC SUCCÈS");
                        println!("==================================================");
                    },
                    Err(e) => {
                        eprintln!("==================================================");
                        eprintln!("❌ ERREUR FATALE - BASE DE DONNÉES NON CRÉÉE: {}", e);
                        eprintln!("==================================================");
                    }
                }
            });
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_eleves_data,
            add_eleve_data,
            update_eleve_data,
            delete_eleve_data,
            get_inscriptions,
            add_inscription,
            update_inscription,
            delete_inscription,
            get_eleves,
            add_eleve,
            update_eleve,
            delete_eleve,
        ])
        .run(tauri::generate_context!())
        .expect("Erreur lors du lancement de l'application Tauri");
}