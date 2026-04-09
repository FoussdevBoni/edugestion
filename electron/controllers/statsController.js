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

export const statsController = {
  // Stats financières existantes
  async getComptabilite(periode = {}) {
    try {
      
      // Période par défaut: mois en cours
      const now = new Date();
      const debutMois = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const finMois = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
      
      const dateDebut = periode.debut || debutMois;
      const dateFin = periode.fin || finMois;
      
      // Récupérer toutes les données
      const paiements = await paiementController.getAll();
      const achats = await achatController.getAll();
      const charges = await chargeController.getAll();
      
      // Filtrer par période
      const paiementsPeriode = paiements.filter(p => 
        p.datePayement >= dateDebut && p.datePayement <= dateFin
      );
      
      const achatsPeriode = achats.filter(a => 
        a.date >= dateDebut && a.date <= dateFin
      );
      
      const chargesPeriode = charges.filter(c => 
        c.date >= dateDebut && c.date <= dateFin
      );
      
      // Calculs
      const totalPaiements = paiementsPeriode.reduce((sum, p) => sum + p.montantPaye, 0);
      const totalAchats = achatsPeriode.reduce((sum, a) => sum + (a.total || a.quantite * a.prixUnitaire), 0);
      const totalCharges = chargesPeriode.reduce((sum, c) => sum + c.montant, 0);
      
      const totalSorties = totalAchats + totalCharges;
      const solde = totalPaiements - totalSorties;
      
      // Statistiques par catégorie
      const statsParMois = {};
      const sixDerniersMois = [];
      
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const mois = d.toLocaleString('fr-FR', { month: 'long' });
        const annee = d.getFullYear();
        const debut = new Date(annee, d.getMonth(), 1).toISOString().split('T')[0];
        const fin = new Date(annee, d.getMonth() + 1, 0).toISOString().split('T')[0];
        
        const p = paiements.filter(p => p.datePayement >= debut && p.datePayement <= fin)
          .reduce((sum, p) => sum + p.montantPaye, 0);
        const a = achats.filter(a => a.date >= debut && a.date <= fin)
          .reduce((sum, a) => sum + (a.total || a.quantite * a.prixUnitaire), 0);
        const c = charges.filter(c => c.date >= debut && c.date <= fin)
          .reduce((sum, c) => sum + c.montant, 0);
        
        sixDerniersMois.push({
          mois: `${mois} ${annee}`,
          entree: p,
          sortie: a + c
        });
      }
      
      // Statistiques par catégorie de charge
      const chargesParCategorie = chargesPeriode.reduce((acc, charge) => {
        const cat = charge.categorie || 'autre';
        if (!acc[cat]) acc[cat] = 0;
        acc[cat] += charge.montant;
        return acc;
      }, {});
      
      return {
        periode: {
          debut: dateDebut,
          fin: dateFin
        },
        resume: {
          totalPaiements,
          totalAchats,
          totalCharges,
          totalSorties,
          solde
        },
        details: {
          paiements: paiementsPeriode.length,
          achats: achatsPeriode.length,
          charges: chargesPeriode.length
        },
        graphiques: {
          evolution: sixDerniersMois,
          chargesParCategorie
        }
      };
    } catch (error) {
      console.error("Erreur getComptabilite stats:", error);
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
  async getDashboard() {
    try {
      // Récupérer les données via les contrôleurs
      const inscriptions = await inscriptionController.getActives();
      const enseignants = await enseignantController.getAll();
      const classes = await classeController.getAll();
      const paiements = await paiementController.getAll();
      const bulletins = await bulletinController.getAll();
      const materiels = await materielController.getAll();
      const transactions = await transactionController.getAll();

      // Caisse du mois en cours
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

      // Statistiques par classe
      const inscriptionsParClasse = {};
      const bulletinsParClasse = {};
      
      for (const inscription of inscriptions) {
        // Compter par classe
        const classeId = inscription.classeId;
        if (!inscriptionsParClasse[classeId]) {
          inscriptionsParClasse[classeId] = {
            classeId,
            nomClasse: inscription.classe,
            count: 0
          };
        }
        inscriptionsParClasse[classeId].count++;
      }

      // Compter les bulletins par classe
      for (const bulletin of bulletins) {
        const classeId = bulletin.classeId;
        if (!bulletinsParClasse[classeId]) {
          bulletinsParClasse[classeId] = {
            classeId,
            nomClasse: bulletin.eleve?.classe || '',
            count: 0
          };
        }
        bulletinsParClasse[classeId].count++;
      }

      // Statistiques par niveau classe
      const inscriptionsParNiveauClasse = {};
      for (const inscription of inscriptions) {
        const niveauClasse = inscription.niveauClasse;
        if (!inscriptionsParNiveauClasse[niveauClasse]) {
          inscriptionsParNiveauClasse[niveauClasse] = {
            niveauClasse,
            count: 0
          };
        }
        inscriptionsParNiveauClasse[niveauClasse].count++;
      }

      // Statistiques par cycle
      const inscriptionsParCycle = {};
      for (const inscription of inscriptions) {
        const cycle = inscription.cycle;
        if (!inscriptionsParCycle[cycle]) {
          inscriptionsParCycle[cycle] = {
            cycle,
            count: 0
          };
        }
        inscriptionsParCycle[cycle].count++;
      }

      // Statistiques par niveau scolaire
      const inscriptionsParNiveauScolaire = {};
      for (const inscription of inscriptions) {
        const niveauScolaire = inscription.niveauScolaire;
        if (!inscriptionsParNiveauScolaire[niveauScolaire]) {
          inscriptionsParNiveauScolaire[niveauScolaire] = {
            niveauScolaire,
            count: 0
          };
        }
        inscriptionsParNiveauScolaire[niveauScolaire].count++;
      }

      // Impayés (5 derniers)
      const impayes = paiements
        .filter(p => p.statut === 'impaye')
        .sort((a, b) => new Date(b.datePayement) - new Date(a.datePayement))
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          eleve: p.inscription ? `${p.inscription.prenom} ${p.inscription.nom}` : 'Inconnu',
          montant: p.montantRestant || p.montantPaye,
          classe: p.inscription?.classe || ''
        }));

      // Bulletins à finaliser (5 derniers)
      const bulletinsAFinaliser = bulletins
        .filter(b => b.status === 'a_finaliser')
        .slice(0, 5)
        .map(b => ({
          id: b.id,
          eleve: b.eleve,
          classe: b.eleve?.classe || ''
        }));

      // Stock bas (5 premiers)
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
          eleves: inscriptions.length,
          enseignants: enseignants.length,
          classes: classes.length,
          caisseMois: entreesMois - sortiesMois
        },
        repartition: {
          parClasse: Object.values(inscriptionsParClasse).sort((a, b) => a.nomClasse.localeCompare(b.nomClasse)),
          parNiveauClasse: Object.values(inscriptionsParNiveauClasse).sort((a, b) => a.niveauClasse.localeCompare(b.niveauClasse)),
          parCycle: Object.values(inscriptionsParCycle).sort((a, b) => a.cycle.localeCompare(b.cycle)),
          parNiveauScolaire: Object.values(inscriptionsParNiveauScolaire).sort((a, b) => a.niveauScolaire.localeCompare(b.niveauScolaire))
        },
        bulletinsDisponibles: Object.values(bulletinsParClasse).sort((a, b) => a.nomClasse.localeCompare(b.nomClasse)),
        alertes: {
          impayes,
          bulletinsAFinaliser,
          stockBas
        }
      };
    } catch (error) {
      console.error("Erreur getDashboard:", error);
      throw error;
    }
  }
};