// electron/controllers/statsController.js
import { getDb } from '../db.js';
import { paiementController } from './paiementController.js';
import { achatController } from './achatController.js';
import { chargeController } from './chargeController.js';
import { inscriptionController } from './inscriptionController.js';
import { enseignantController } from './enseignantController.js';
import { classeController } from './classeController.js';
import { bulletinController } from './bulletinController.js';
import { materielController } from './materielController.js';
import { transactionController } from './transactionController.js';
import { venteController } from './venteController.js';

export const statsController = {
  // Stats financières existantes
 async getComptabilite(periode = {}) {
  try {
    const now = new Date();
    const debutMois = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const finMois = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const dateDebut = periode.debut || debutMois;
    const dateFin = periode.fin || finMois;

    // Récupérer toutes les données
    const transactions = await transactionController.getAll();
    const paiements = await paiementController.getAll();
    const ventes = await venteController.getAll();
    const achats = await achatController.getAll();
    const charges = await chargeController.getAll();

    // Filtrer par période
    const transactionsPeriode = transactions.filter(t =>
      t.date >= dateDebut && t.date <= dateFin
    );

    const paiementsPeriode = paiements.filter(p =>
      p.datePayement >= dateDebut && p.datePayement <= dateFin
    );

    const ventesPeriode = ventes.filter(v =>
      v.date >= dateDebut && v.date <= dateFin
    );

    const achatsPeriode = achats.filter(a =>
      a.date >= dateDebut && a.date <= dateFin
    );

    const chargesPeriode = charges.filter(c =>
      c.date >= dateDebut && c.date <= dateFin
    );

    // Calcul des entrées et sorties à partir des transactions (pour les stats financières)
    const totalEntrees = transactionsPeriode
      .filter(t => t.type === 'entree')
      .reduce((sum, t) => sum + t.montant, 0);

    const totalSorties = transactionsPeriode
      .filter(t => t.type === 'sortie')
      .reduce((sum, t) => sum + t.montant, 0);

    const solde = totalEntrees - totalSorties;

    // Calcul des totaux par catégorie (pour l'affichage détaillé)
    const totalPaiements = paiementsPeriode.reduce((sum, p) => sum + p.montantPaye, 0);
    const totalVentes = ventesPeriode.reduce((sum, v) => sum + (v.total || v.quantite * v.prixUnitaire), 0);
    const totalAchats = achatsPeriode.reduce((sum, a) => sum + (a.total || a.quantite * a.prixUnitaire), 0);
    const totalCharges = chargesPeriode.reduce((sum, c) => sum + c.montant, 0);

    // Statistiques par mois (6 derniers mois) à partir des transactions
    const sixDerniersMois = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mois = d.toLocaleString('fr-FR', { month: 'long' });
      const annee = d.getFullYear();
      const debut = new Date(annee, d.getMonth(), 1).toISOString().split('T')[0];
      const fin = new Date(annee, d.getMonth() + 1, 0).toISOString().split('T')[0];

      const transactionsMois = transactions.filter(t => t.date >= debut && t.date <= fin);
      
      const entreeMois = transactionsMois
        .filter(t => t.type === 'entree')
        .reduce((sum, t) => sum + t.montant, 0);
        
      const sortieMois = transactionsMois
        .filter(t => t.type === 'sortie')
        .reduce((sum, t) => sum + t.montant, 0);

      sixDerniersMois.push({
        mois: `${mois} ${annee}`,
        entree: entreeMois,
        sortie: sortieMois
      });
    }

    // Détail par mode de paiement à partir des transactions
    const entreesParMode = {};
    const sortiesParMode = {};

    for (const transaction of transactionsPeriode) {
      const mode = transaction.modePaiement || 'autre';
      if (transaction.type === 'entree') {
        if (!entreesParMode[mode]) entreesParMode[mode] = 0;
        entreesParMode[mode] += transaction.montant;
      } else {
        if (!sortiesParMode[mode]) sortiesParMode[mode] = 0;
        sortiesParMode[mode] += transaction.montant;
      }
    }

    // Top 5 des transactions
    const topEntrees = [...transactionsPeriode]
      .filter(t => t.type === 'entree')
      .sort((a, b) => b.montant - a.montant)
      .slice(0, 5)
      .map(t => ({
        id: t.id,
        montant: t.montant,
        motif: t.motif,
        date: t.date
      }));

    const topSorties = [...transactionsPeriode]
      .filter(t => t.type === 'sortie')
      .sort((a, b) => b.montant - a.montant)
      .slice(0, 5)
      .map(t => ({
        id: t.id,
        montant: t.montant,
        motif: t.motif,
        date: t.date
      }));

    return {
      periode: {
        debut: dateDebut,
        fin: dateFin
      },
      resume: {
        totalEntrees,
        totalSorties,
        solde
      },
      details: {
        paiements: {
          count: paiementsPeriode.length,
          total: totalPaiements
        },
        ventes: {
          count: ventesPeriode.length,
          total: totalVentes
        },
        achats: {
          count: achatsPeriode.length,
          total: totalAchats
        },
        charges: {
          count: chargesPeriode.length,
          total: totalCharges
        }
      },
      graphiques: {
        evolution: sixDerniersMois,
        entreesParMode,
        sortiesParMode
      },
      top: {
        entrees: topEntrees,
        sorties: topSorties
      }
    };
  } catch (error) {
    console.error("Erreur getComptabilite:", error);
    throw error;
  }
},

  // Stats stock existantes
  async getStock() {
    try {
      const db = getDb();
      const materiels = db.data.materiels || [];

      const stockBas = materiels.filter(m => m.quantite < (m.seuilAlerte || 10));
      const rupture = materiels.filter(m => m.quantite === 0);

      return {
        totalTypes: materiels.length,
        totalUnites: materiels.reduce((sum, m) => sum + m.quantite, 0),
        stockBas: stockBas.length,
        rupture: rupture.length,
        alertes: stockBas.map(m => ({
          id: m.id,
          nom: m.nom,
          quantite: m.quantite,
          seuil: m.seuilAlerte || 10
        }))
      };
    } catch (error) {
      console.error("Erreur getStock stats:", error);
      throw error;
    }
  },

  // NOUVEAU: Dashboard principal
  // Dashboard enrichi
  async getDashboard(payload) {
    const { niveauScolaire } = payload;

    try {
      // Récupérer les données
      const inscriptions = await inscriptionController.getActives();
      const enseignants = await enseignantController.getAll(); // PAS de filtre
      const classes = await classeController.getAll();
      const paiements = await paiementController.getAll();
      const materiels = await materielController.getAll(); // PAS de filtre
      const transactions = await transactionController.getAll(); // PAS de filtre

      // Filtrer par niveauScolaire (nom, pas l'id)
      const inscriptionsFiltrees = inscriptions.filter(
        i => i.niveauScolaire === niveauScolaire
      );

      const classesFiltrees = classes.filter(
        c => c.niveauScolaire === niveauScolaire
      );

      // 1. Nombre total de niveaux classe distincts
      const niveauxClasseDistincts = [...new Set(
        classesFiltrees.map(c => c.niveauClasseId)
      )];
      const totalNiveauxClasse = niveauxClasseDistincts.length;

      // 2. Nombre de classes par niveau classe
      const classesParNiveauClasse = {};
      for (const classe of classesFiltrees) {
        const niveauClasseId = classe.niveauClasseId;
        if (!classesParNiveauClasse[niveauClasseId]) {
          classesParNiveauClasse[niveauClasseId] = {
            niveauClasseId,
            nomNiveauClasse: classe.niveauClasse || `Niveau ${niveauClasseId}`,
            nombreClasses: 0
          };
        }
        classesParNiveauClasse[niveauClasseId].nombreClasses++;
      }

      // 3. Données par classe (effectifs déjà dans la table classe)
      const parClasse = classesFiltrees.map(classe => ({
        classeId: classe.id,
        nomClasse: classe.nom,
        totalEleves: classe.effectifTotalInscrits || 0,
        filles: classe.effectifFInscrits || 0,
        garcons: classe.effectifMInscrits || 0
      }));

      // Total élèves = somme des effectifTotalInscrits
      const totalEleves = classesFiltrees.reduce((sum, c) => sum + (c.effectifTotalInscrits || 0), 0);

      // Caisse du mois (pas de filtre)
      const now = new Date();
      const debutMois = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const finMois = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

      const transactionsMois = transactions.filter(t =>
        t.date >= debutMois && t.date <= finMois
      );

      const entreesMois = transactionsMois
        .filter(t => t.type === 'entree')
        .reduce((sum, t) => sum + t.montant, 0);

      const sortiesMois = transactionsMois
        .filter(t => t.type === 'sortie')
        .reduce((sum, t) => sum + t.montant, 0);

      // Impayés (filtrés par niveauScolaire)
      const paiementsFiltres = paiements.filter(p => {
        const inscription = inscriptions.find(i => i.id === p.inscriptionId);
        return inscription && inscription.niveauScolaire === niveauScolaire;
      });

      const impayes = paiementsFiltres
        .filter(p => p.statut === 'impaye')
        .sort((a, b) => new Date(b.datePayement) - new Date(a.datePayement))
        .slice(0, 5)
        .map(p => {
          const inscription = inscriptions.find(i => i.id === p.inscriptionId);
          return {
            id: p.id,
            eleve: inscription ? `${inscription.prenom} ${inscription.nom}` : 'Inconnu',
            montant: p.montantRestant || p.montantPaye,
            classe: inscription?.classe?.nom || ''
          };
        });

      // Stock bas (pas de filtre)
      const stockBas = materiels
        .filter(m => m.quantite < (m.seuilAlerte || 10))
        .sort((a, b) => a.quantite - b.quantite)
        .slice(0, 5)
        .map(m => ({
          id: m.id,
          nom: m.nom,
          quantite: m.quantite,
          seuil: m.seuilAlerte || 10
        }));

      return {
        stats: {
          totalNiveauxClasse,
          totalClasses: classesFiltrees.length,
          totalEleves,
          enseignants: enseignants.length,
          caisseMois: entreesMois - sortiesMois
        },
        parNiveauClasse: Object.values(classesParNiveauClasse),
        parClasse,
        alertes: {
          impayes,
          stockBas
        }
      };

    } catch (error) {
      console.error("Erreur getDashboard:", error);
      throw error;
    }
  }
};