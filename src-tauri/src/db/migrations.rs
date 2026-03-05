use sqlx::SqlitePool;
use anyhow::Result;

pub async fn run_migrations(pool: &SqlitePool) -> Result<()> {
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS eleve_data (
            id TEXT PRIMARY KEY,
            nom TEXT NOT NULL,
            prenom TEXT NOT NULL,
            date_naissance TEXT NOT NULL,
            sexe TEXT NOT NULL,
            photo TEXT,
            annee_scolaire TEXT NOT NULL,
            matricule TEXT UNIQUE NOT NULL,
            statut TEXT NOT NULL,
            lieu_de_naissance TEXT,
            contact TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        "#
    ).execute(pool).await?;

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS classes (
            id TEXT PRIMARY KEY,
            nom TEXT NOT NULL,
            niveau_classe TEXT NOT NULL,
            cycle TEXT NOT NULL,
            niveau_scolaire TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        "#
    ).execute(pool).await?;

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS inscriptions (
            id TEXT PRIMARY KEY,
            annee_scolaire TEXT NOT NULL,
            date_inscription TEXT NOT NULL,
            statut_scolaire TEXT NOT NULL,
            classe_id TEXT NOT NULL,
            eleve_data_id TEXT NOT NULL,
            niveau_classe TEXT NOT NULL,
            classe TEXT NOT NULL,
            cycle TEXT NOT NULL,
            niveau_scolaire TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (classe_id) REFERENCES classes(id),
            FOREIGN KEY (eleve_data_id) REFERENCES eleve_data(id) ON DELETE CASCADE
        )
        "#
    ).execute(pool).await?;

    sqlx::query(
        r#"
        CREATE INDEX IF NOT EXISTS idx_inscriptions_eleve_data_id 
        ON inscriptions(eleve_data_id)
        "#
    ).execute(pool).await?;

    sqlx::query(
        r#"
        CREATE INDEX IF NOT EXISTS idx_inscriptions_annee_scolaire 
        ON inscriptions(annee_scolaire)
        "#
    ).execute(pool).await?;

    // Trigger pour mettre à jour updated_at
    sqlx::query(
        r#"
        CREATE TRIGGER IF NOT EXISTS update_eleve_data_timestamp 
        AFTER UPDATE ON eleve_data
        BEGIN
            UPDATE eleve_data SET updated_at = CURRENT_TIMESTAMP 
            WHERE id = NEW.id;
        END;
        "#
    ).execute(pool).await?;

    sqlx::query(
        r#"
        CREATE TRIGGER IF NOT EXISTS update_inscriptions_timestamp 
        AFTER UPDATE ON inscriptions
        BEGIN
            UPDATE inscriptions SET updated_at = CURRENT_TIMESTAMP 
            WHERE id = NEW.id;
        END;
        "#
    ).execute(pool).await?;

    insert_default_classes(pool).await?;

    Ok(())
}

async fn insert_default_classes(pool: &SqlitePool) -> Result<()> {
    let count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM classes")
        .fetch_one(pool)
        .await?;
    
    if count.0 == 0 {
        let classes = vec![
            ("1", "6ème A", "6ème", "1er cycle", "Secondaire"),
            ("2", "6ème B", "6ème", "1er cycle", "Secondaire"),
            ("3", "5ème A", "5ème", "1er cycle", "Secondaire"),
            ("4", "5ème B", "5ème", "1er cycle", "Secondaire"),
        ];

        for (id, nom, niveau_classe, cycle, niveau_scolaire) in classes {
            sqlx::query(
                r#"
                INSERT INTO classes (id, nom, niveau_classe, cycle, niveau_scolaire)
                VALUES (?, ?, ?, ?, ?)
                "#
            )
            .bind(id)
            .bind(nom)
            .bind(niveau_classe)
            .bind(cycle)
            .bind(niveau_scolaire)
            .execute(pool)
            .await?;
        }
    }
    
    Ok(())
}