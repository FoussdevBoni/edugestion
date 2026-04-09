// src/hooks/eleves/useEleves.ts
import { useEffect, useState, useCallback } from 'react';
import { inscriptionService } from '../../services/inscriptionService';
import { Inscription } from '../../utils/types/data';

export default function useEleves() {
  const [eleves, setEleves] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les inscriptions actives (élèves actuels)
  const loadEleves = useCallback(async () => {
    try {
      setLoading(true);
      const inscriptions = await inscriptionService.getActives();
      setEleves(inscriptions);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer un élève par son ID (inscription active)
  const getEleveById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const inscription = await inscriptionService.getById(id);
      if (!inscription || inscription.isActive === false) return null;
      return inscription;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupérer les élèves d'une classe spécifique (actifs uniquement)
  const getElevesByClasse = useCallback(async (classeId: string) => {
    try {
      setLoading(true);
      const anneeCourante = new Date().getFullYear() + '-' + (new Date().getFullYear() + 1);
      const inscriptions = await inscriptionService.getByClasse(classeId);
      const actifs = inscriptions.filter(i =>
        i.anneeScolaire === anneeCourante &&
        i.isActive !== false
      );
      return actifs;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Rechercher des élèves (parmi les actifs)
  const searchEleves = useCallback((searchTerm: string) => {
    if (!searchTerm) return eleves;
    const term = searchTerm.toLowerCase();
    return eleves.filter(eleve =>
      eleve.nom.toLowerCase().includes(term) ||
      eleve.prenom.toLowerCase().includes(term) ||
      (eleve.matricule || "").toLowerCase().includes(term) ||
      eleve.classe.toLowerCase().includes(term)
    );
  }, [eleves]);

  // Obtenir les élèves par niveau scolaire
  const getElevesByNiveau = useCallback((niveauScolaire: string) => {
    return eleves.filter(eleve => eleve.niveauScolaire === niveauScolaire);
  }, [eleves]);

  // Obtenir les élèves par cycle
  const getElevesByCycle = useCallback((cycle: string) => {
    return eleves.filter(eleve => eleve.cycle === cycle);
  }, [eleves]);

  // Statistiques sur les élèves actifs
  const getStats = useCallback(() => {
    const total = eleves.length;
    const parNiveau = eleves.reduce((acc, eleve) => {
      const niveau = eleve.niveauScolaire;
      if (!acc[niveau]) acc[niveau] = 0;
      acc[niveau]++;
      return acc;
    }, {} as Record<string, number>);
    const parClasse = eleves.reduce((acc, eleve) => {
      const classe = eleve.classe;
      if (!acc[classe]) acc[classe] = 0;
      acc[classe]++;
      return acc;
    }, {} as Record<string, number>);
    const parSexe = eleves.reduce((acc, eleve) => {
      const sexe = eleve.sexe;
      if (!acc[sexe]) acc[sexe] = 0;
      acc[sexe]++;
      return acc;
    }, {} as Record<string, number>);
    return { total, parNiveau, parClasse, parSexe };
  }, [eleves]);

  // Vérifier si un élève a une inscription active
  const estInscrit = useCallback(async (eleveDataId: string) => {
    try {
      const inscription = await inscriptionService.getCurrentInscription(eleveDataId);
      return !!(inscription && inscription.isActive !== false);
    } catch {
      return false;
    }
  }, []);

  // Supprimer une inscription
  const deleteInscription = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await inscriptionService.delete(id);
      setEleves(prev => prev.filter(i => i.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Supprimer plusieurs inscriptions
  const deleteManyInscriptions = useCallback(async (ids: string[]) => {
    try {
      setLoading(true);
      const result = await inscriptionService.deleteMany(ids);
      setEleves(prev => prev.filter(i => !ids.includes(i.id)));
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Réinscrire les élèves
  const reinscrireEleves = useCallback(async (eleves: Inscription[], classeCibleId: string, 
     anneeCourante: string , statut: "Nouveau" | "Redoublant") => {
    try {
      setLoading(true);
      const result = await inscriptionService.reinscrireEleves(eleves, classeCibleId , 
         anneeCourante , statut);
      await loadEleves();
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadEleves]);

  // Désactiver les élèves
  const desactiverEleves = useCallback(async (elevesId: string[]) => {
    try {
      setLoading(true);
      const result = await inscriptionService.desactiverEleves(elevesId);
      await loadEleves();
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadEleves]);

  // Transférer les élèves
  const transfererEleves = useCallback(async (inscriptions: Inscription[], classeId: string) => {
    try {
      setLoading(true);
      const result = await inscriptionService.transfererEleves(inscriptions, classeId);
      await loadEleves();
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadEleves]);

  // Rafraîchir la liste
  const refresh = useCallback(() => {
    loadEleves();
  }, [loadEleves]);

  useEffect(() => {
    loadEleves();
  }, [loadEleves]);

  return {
    eleves,
    loading,
    error,
    loadEleves,
    getEleveById,
    getElevesByClasse,
    getElevesByNiveau,
    getElevesByCycle,
    searchEleves,
    deleteInscription,
    deleteManyInscriptions,
    reinscrireEleves,
    desactiverEleves,
    transfererEleves,
    getStats,
    estInscrit,
    refresh
  };
}