// electron/helpers/bulletinHelpers.js
import { inscriptionController } from '../controllers/inscriptionController.js';
import { noteController } from '../controllers/noteController.js';
import { evaluationController } from '../controllers/evaluationController.js';
import { matiereController } from '../controllers/matiereController.js';

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