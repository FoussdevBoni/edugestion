// electron/helpers/bulletinHelpers.js
import { inscriptionController } from '../controllers/inscriptionController.js';
import { noteController } from '../controllers/noteController.js';
import { evaluationController } from '../controllers/evaluationController.js';
import { periodeController } from '../controllers/periodeController.js';
import { matiereController } from '../controllers/matiereController.js';
import { classeController } from '../controllers/classeController.js';
import { getDb } from '../db.js';

export const BULLETIN_STATUS = {
  BROUILLON: 'brouillon',
  COMPLET: 'complet',
  INCOMPLET: 'incomplet',
  A_FINALISER: 'a_finaliser'
};

const roundToTwoDecimals = (value) => {
  if (typeof value !== 'number' || isNaN(value)) return 0;
  return Math.round(value * 100) / 100;
};

const formatValue = (value) => {
  if (value === undefined || value === null || isNaN(value) || value === "" || value === "-") return "-";
  return roundToTwoDecimals(parseFloat(value)).toFixed(2);
};

const formaterRang = (rang, total) => {
  if (!rang || rang === 0 || rang > total) return "N/A";
  return rang === 1 ? "1er" : `${rang}ème`;
};

export const getAppreciation = (moyenne) => {
  if (moyenne >= 18) return "Excellent";
  if (moyenne >= 16) return "Très Bien";
  if (moyenne >= 14) return "Bien";
  if (moyenne >= 12) return "Assez Bien";
  if (moyenne >= 10) return "Passable";
  if (moyenne >= 8) return "Insuffisant";
  if (moyenne >= 6) return "Médiocre";
  return "Très Insuffisant";
};

/**
 * Calcule les moyennes de la période actuelle - VERSION OPTIMISÉE
 */
export async function calculerMoyennes(inscriptionId, periodeId, config, noteConduite = null) {
  try {
    const [notes, inscription, evaluationsPeriode] = await Promise.all([
      noteController.getByInscription(inscriptionId),
      inscriptionController.getById(inscriptionId),
      evaluationController.getByPeriode(periodeId)
    ]);

    if (!inscription) throw new Error("Inscription non trouvée");

    const toutesMatieres = await matiereController.getByNiveauClasse(inscription.niveauClasseId);
    const evalMap = new Map(evaluationsPeriode.map(e => [e.id, e]));
    const notesPeriode = notes.filter(n => n.periodeId === periodeId);

    // Structure optimisée pour les notes par matière
    const notesParMatiere = new Map();
    for (const matiere of toutesMatieres) {
      notesParMatiere.set(matiere.id, {
        matiereId: matiere.id,
        matiere: matiere.nom,
        coefficient: matiere.coefficient,
        notesParType: new Map(),
        complete: true,
        aDesNotes: false
      });
    }

    // Remplir les notes
    for (const note of notesPeriode) {
      const evaluation = evalMap.get(note.evaluationId);
      if (!evaluation) continue;

      const mat = notesParMatiere.get(note.matiereId);
      const typeConfig = config[evaluation.type];

      if (mat && typeConfig?.actif) {
        mat.aDesNotes = true;
        if (!mat.notesParType.has(evaluation.type)) {
          mat.notesParType.set(evaluation.type, []);
        }
        mat.notesParType.get(evaluation.type).push({
          evaluationId: note.evaluationId,
          note: note.note,
          nom: evaluation.abreviation || evaluation.nom
        });
      }
    }

    const typesActifs = Object.entries(config)
      .filter(([_, cfg]) => cfg.actif)
      .map(([t]) => t);

    const moyennesParMatiere = [];
    const matieresManquantes = [];
    let bulletinComplet = true;

    // Traiter chaque matière
    for (const [matiereId, mat] of notesParMatiere) {
      // Vérifier si la matière a des notes
      if (!mat.aDesNotes) {
        bulletinComplet = false;
        matieresManquantes.push({
          matiereId: mat.matiereId,
          matiere: mat.matiere,
          evaluationsManquantes: ["Aucune note saisie pour cette matière"]
        });
        
        const itemsMatiereVide = typesActifs.map(type => ({
          evaluationId: `${type}-vide`,
          nom: type === 'interrogation' ? 'Moy. Interros' : type === 'devoir' ? 'Moy. Devoirs' : `Moy. ${type}`,
          note: "-",
          coefficient: "1"
        }));
        
        moyennesParMatiere.push({
          matiereId: mat.matiereId,
          matiere: mat.matiere,
          notes: { items: itemsMatiereVide },
          coefficient: mat.coefficient.toString(),
          moyenneVingtieme: "-",
          pointsPonderes: "-",
          appreciation: "Non évalué"
        });
        continue;
      }

      const itemsMatiere = [];

      // Construire les items de la matière
      for (const [type, typeConfig] of Object.entries(config)) {
        if (!typeConfig.actif) continue;

        const notesDuType = mat.notesParType.get(type) || [];

        if (typeConfig.mode === 'moyenne' && notesDuType.length > 0) {
          const moy = notesDuType.reduce((sum, n) => sum + n.note, 0) / notesDuType.length;
          itemsMatiere.push({
            evaluationId: `${type}-moyenne`,
            nom: type === 'interrogation' ? 'Moy. Interros' : type === 'devoir' ? 'Moy. Devoirs' : `Moy. ${type}`,
            note: formatValue(moy),
            coefficient: "1"
          });
        } else {
          itemsMatiere.push(...notesDuType.map(n => ({
            evaluationId: n.evaluationId,
            nom: n.nom,
            note: formatValue(n.note),
            coefficient: "1"
          })));
        }
      }

      // Vérifier les évaluations manquantes
      const evalsAttendues = evaluationsPeriode.filter(e =>
        e.matiereId === matiereId && typesActifs.includes(e.type)
      );
      const presentesIds = new Set(itemsMatiere.map(n => n.evaluationId));
      const manquantes = evalsAttendues.filter(e => !presentesIds.has(e.id));

      if (manquantes.length > 0) {
        bulletinComplet = false;
        matieresManquantes.push({
          matiereId: mat.matiereId,
          matiere: mat.matiere,
          evaluationsManquantes: manquantes.map(e => `${e.nom} (${e.type})`)
        });

        moyennesParMatiere.push({
          matiereId: mat.matiereId,
          matiere: mat.matiere,
          notes: { items: itemsMatiere },
          coefficient: mat.coefficient.toString(),
          moyenneVingtieme: "-",
          pointsPonderes: "-",
          appreciation: "Incomplet"
        });
        continue;
      }

      // Calculer la moyenne de la matière
      const sommeNotes = itemsMatiere.reduce((acc, n) => {
        const val = n.note !== "-" ? parseFloat(n.note) : 0;
        return acc + val;
      }, 0);

      const sommeCoeffs = itemsMatiere.length;
      const moyenneMatiere = sommeCoeffs > 0 ? sommeNotes / sommeCoeffs : 0;
      const pointsPonderes = moyenneMatiere * mat.coefficient;

      moyennesParMatiere.push({
        matiereId: mat.matiereId,
        matiere: mat.matiere,
        notes: { items: itemsMatiere },
        moyenneVingtieme: formatValue(moyenneMatiere),
        coefficient: mat.coefficient.toString(),
        pointsPonderes: formatValue(pointsPonderes),
        appreciation: getAppreciation(moyenneMatiere)
      });
    }

    // Obtenir le modèle des colonnes pour la présentation
    const modeleColonnes = moyennesParMatiere[0]?.notes?.items || [];

    // Gérer la note de conduite
    const hasConduite = noteConduite !== null && noteConduite !== undefined && noteConduite !== "";

    if (hasConduite) {
      const valConduite = parseFloat(noteConduite);
      const itemsConduite = modeleColonnes.map(col => ({
        evaluationId: `conduite-${col.evaluationId}`,
        nom: col.nom,
        note: "-",
        coefficient: "1"
      }));

      moyennesParMatiere.push({
        matiereId: "conduite",
        matiere: "CONDUITE",
        notes: { items: itemsConduite },
        moyenneVingtieme: formatValue(valConduite),
        coefficient: "1",
        pointsPonderes: formatValue(valConduite),
        appreciation: getAppreciation(valConduite)
      });
    } else {
      bulletinComplet = false;
      matieresManquantes.push({
        matiereId: "conduite",
        matiere: "CONDUITE",
        evaluationsManquantes: ["Note de conduite non saisie"]
      });
    }

    // Calculer les totaux
    let sumMoyennes = 0, sumCoeffs = 0, sumPoints = 0;

    for (const ligne of moyennesParMatiere) {
      if (ligne.moyenneVingtieme !== "-") sumMoyennes += parseFloat(ligne.moyenneVingtieme);
      if (ligne.coefficient !== "-") sumCoeffs += parseFloat(ligne.coefficient);
      if (ligne.pointsPonderes !== "-") sumPoints += parseFloat(ligne.pointsPonderes);
    }

    const itemsTotaux = modeleColonnes.map(col => ({
      evaluationId: `totaux-${col.evaluationId}`,
      nom: col.nom,
      note: "-",
      coefficient: "1"
    }));

    moyennesParMatiere.push({
      matiereId: "totaux",
      matiere: "TOTAUX",
      notes: { items: itemsTotaux },
      moyenneVingtieme: formatValue(sumMoyennes),
      coefficient: sumCoeffs.toString(),
      pointsPonderes: formatValue(sumPoints),
      appreciation: ""
    });

    const resultatFinal = bulletinComplet ? {
      totalPoints: formatValue(sumPoints),
      totalCoefficients: sumCoeffs.toString(),
      moyenneGenerale: sumCoeffs > 0 ? formatValue(sumPoints / sumCoeffs) : "0.00"
    } : null;

    return {
      success: bulletinComplet,
      bulletinComplet,
      moyennesParMatiere,
      matieresManquantes,
      resultatFinal
    };

  } catch (error) {
    console.error(`Erreur calculerMoyennes:`, error);
    throw error;
  }
}

/**
 * Calcule le récapitulatif annuel - VERSION OPTIMISÉE
 */
export async function calculerRecapitulatifAnnuel(inscriptionId, periodeId) {
  try {
    const db = getDb();
    const periodeActuelle = await periodeController.getById(periodeId);
    if (!periodeActuelle) return { moyennesPrecedentes: [], moyenneAnnuelle: "-" };

    const toutesPeriodes = await periodeController.getByNiveauScolaire(periodeActuelle.niveauScolaireId);
    const periodesTriees = toutesPeriodes.sort((a, b) => a.ordre - b.ordre);

    // Récupérer tous les bulletins en une fois
    const tousBulletins = db.data.bulletins?.filter(b => b.inscriptionId === inscriptionId) || [];
    const bulletinMap = new Map(tousBulletins.map(b => [b.periodeId, b]));

    const moyennesPrecedentes = [];
    let sommePointsPonderes = 0;
    let sommeCoeffsPeriodes = 0;
    let nbPeriodesCompletes = 0;

    for (const periode of periodesTriees) {
      const bulletin = bulletinMap.get(periode.id);
      const estComplet = bulletin?.status === BULLETIN_STATUS.COMPLET &&
        bulletin.resultatFinal?.moyenneGenerale !== "-";

      if (estComplet) {
        const moyenne = parseFloat(bulletin.resultatFinal.moyenneGenerale);
        const coeff = parseFloat(periode.coefficient) || 1;

        if (periode.ordre < periodeActuelle.ordre) {
          moyennesPrecedentes.push({
            periodeId: periode.id,
            nom: periode.nom,
            moyenne: formatValue(moyenne)
          });
        }

        sommePointsPonderes += moyenne * coeff;
        sommeCoeffsPeriodes += coeff;
        nbPeriodesCompletes++;
      }
    }

    const estDernierePeriode = periodeActuelle.ordre === Math.max(...periodesTriees.map(p => p.ordre));
    let moyenneAnnuelle = "-";

    if (estDernierePeriode && nbPeriodesCompletes === periodesTriees.length) {
      moyenneAnnuelle = formatValue(sommePointsPonderes / sommeCoeffsPeriodes);
    }

    return { moyennesPrecedentes, moyenneAnnuelle };

  } catch (error) {
    console.error("Erreur récapitulatif annuel:", error);
    return { moyennesPrecedentes: [], moyenneAnnuelle: "-" };
  }
}

/**
 * Calcule l'effectif d'une classe
 */
export async function calculerEffectifClasse(classeId) {
  try {
    const classe = await classeController.getById(classeId);
    return classe?.effectifTotalInscrits || 0;
  } catch (error) {
    console.error("Erreur calculEffectifClasse:", error);
    return 0;
  }
}

/**
 * Enrichit un bulletin avec les informations de l'élève et de la période
 */
export async function enrichirBulletin(bulletin) {
  if (!bulletin) return null;

  try {
    const [inscription, periode] = await Promise.all([
      inscriptionController.getById(bulletin.inscriptionId),
      periodeController.getById(bulletin.periodeId)
    ]);

    if (!inscription) return bulletin;

    const classe = await classeController.getById(inscription.classeId);

    return {
      ...bulletin,
      classe: classe?.nom || '',
      eleve: {
        nom: inscription.nom,
        prenom: inscription.prenom,
        matricule: inscription.matricule,
        classe: inscription.classe,
        niveauClasse: inscription?.niveauClasse || '',
        cycle: inscription?.cycle || '',
        niveauScolaire: inscription?.niveauScolaire || ''
      },
      periode: periode?.nom || '',
      anneeScolaire: inscription.anneeScolaire
    };
  } catch (error) {
    console.error("Erreur enrichirBulletin:", error);
    return bulletin;
  }
}

/**
 * Calcule le rang d'un élève - VERSION CORRIGÉE ET OPTIMISÉE
 */
export async function calculerRang(inscriptionId, periodeId) {
  try {
    const db = getDb();

    const inscription = await inscriptionController.getById(inscriptionId);
    if (!inscription || !inscription.classeId) return "N/A";

    // Récupérer toutes les inscriptions de la classe en une fois
    const inscriptionsClasse = await inscriptionController.getByClasse(inscription.classeId);
    const idsInscriptionsClasse = new Set(inscriptionsClasse.map(ins => ins.id));

    // Récupérer tous les bulletins de la période
    const tousLesBulletins = db.data.bulletins?.filter(b => b.periodeId === periodeId) || [];

    // Construire le tableau des moyennes
    const bulletinsAvecMoyenne = [];

    for (const bulletin of tousLesBulletins) {
      if (idsInscriptionsClasse.has(bulletin.inscriptionId) &&
        bulletin.status === BULLETIN_STATUS.COMPLET &&
        bulletin.resultatFinal?.moyenneGenerale &&
        bulletin.resultatFinal.moyenneGenerale !== "-") {

        bulletinsAvecMoyenne.push({
          inscriptionId: bulletin.inscriptionId,
          moyenne: parseFloat(bulletin.resultatFinal.moyenneGenerale)
        });
      }
    }

    if (bulletinsAvecMoyenne.length === 0) return "N/A";

    // Trier par moyenne décroissante
    bulletinsAvecMoyenne.sort((a, b) => b.moyenne - a.moyenne);

    // Trouver le rang
    const rang = bulletinsAvecMoyenne.findIndex(b => b.inscriptionId === inscriptionId) + 1;

    return rang > 0 && rang <= bulletinsAvecMoyenne.length ? formaterRang(rang, bulletinsAvecMoyenne.length) : "N/A";

  } catch (error) {
    console.error("Erreur calculRang:", error);
    return "N/A";
  }
}

// Cache pour les rangs optimisés
const rangCache = new Map();

/**
 * Version avec cache pour les rangs
 */
export async function calculerRangOptimise(inscriptionId, periodeId, forceRefresh = false) {
  const cacheKey = `${inscriptionId}_${periodeId}`;

  if (!forceRefresh && rangCache.has(cacheKey)) {
    return rangCache.get(cacheKey);
  }

  const rang = await calculerRang(inscriptionId, periodeId);
  rangCache.set(cacheKey, rang);
  setTimeout(() => rangCache.delete(cacheKey), 5 * 60 * 1000);

  return rang;
}

/**
 * Calcule les rangs pour toute une classe en une seule passe - ULTRA OPTIMISÉ
 */
export async function calculerTousLesRangs(classeId, periodeId) {
  try {
    const db = getDb();

    // Récupérer toutes les inscriptions de la classe
    const inscriptions = await inscriptionController.getByClasse(classeId);
    if (!inscriptions?.length) return new Map();

    const idsInscriptions = new Set(inscriptions.map(ins => ins.id));

    // Récupérer tous les bulletins de la période
    const tousLesBulletins = db.data.bulletins?.filter(b => b.periodeId === periodeId) || [];

    // Construire le tableau des moyennes
    const bulletinsAvecMoyenne = [];

    for (const bulletin of tousLesBulletins) {
      if (idsInscriptions.has(bulletin.inscriptionId) &&
        bulletin.status === BULLETIN_STATUS.COMPLET &&
        bulletin.resultatFinal?.moyenneGenerale &&
        bulletin.resultatFinal.moyenneGenerale !== "-") {

        bulletinsAvecMoyenne.push({
          inscriptionId: bulletin.inscriptionId,
          moyenne: parseFloat(bulletin.resultatFinal.moyenneGenerale)
        });
      }
    }

    // Trier par moyenne décroissante
    bulletinsAvecMoyenne.sort((a, b) => b.moyenne - a.moyenne);

    // Créer la map des rangs
    const rangMap = new Map();
    bulletinsAvecMoyenne.forEach((eleve, index) => {
      rangMap.set(eleve.inscriptionId, formaterRang(index + 1, bulletinsAvecMoyenne.length));
    });

    return rangMap;

  } catch (error) {
    console.error("Erreur calculerTousLesRangs:", error);
    return new Map();
  }
}

/**
 * Met à jour les rangs de tous les bulletins d'une classe pour une période
 */
export async function mettreAJourTousLesRangs(classeId, periodeId) {
  try {
    const db = getDb();
    const rangsMap = await calculerTousLesRangs(classeId, periodeId);

    if (rangsMap.size === 0) return { success: false, updatedCount: 0 };

    let updatedCount = 0;

    await db.update((dbData) => {
      for (const bulletin of dbData.bulletins || []) {
        if (bulletin.periodeId === periodeId && rangsMap.has(bulletin.inscriptionId)) {
          const rang = rangsMap.get(bulletin.inscriptionId);
          if (bulletin.resultatFinal) {
            bulletin.resultatFinal.rang = rang;
            updatedCount++;
          }
        }
      }
    });

    return { success: true, updatedCount };

  } catch (error) {
    console.error("Erreur mettreAJourTousLesRangs:", error);
    return { success: false, updatedCount: 0 };
  }
}