// src/hooks/inscriptions/useInscriptions.ts
import { useEffect, useState, useCallback } from 'react';
import { inscriptionService } from '../../services/inscriptionService';
import { Inscription } from '../../utils/types/data';

interface UseInscriptionsProps {
  classeId?: string;
  eleveDataId?: string;
  anneeScolaire?: string;
  isActive?: boolean;
  autoLoad?: boolean;
}

export default function useInscriptions(props: UseInscriptionsProps = {}) {
  const { 
    classeId, 
    eleveDataId, 
    anneeScolaire: anneeParam, 
    isActive,
    autoLoad = true 
  } = props;

  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [inscriptionsActives, setInscriptionsActives] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ classeId, eleveDataId, anneeScolaire: anneeParam, isActive });

  // Récupère les inscriptions selon les filtres
  const loadInscriptions = useCallback(async (overrideFilters?: Partial<typeof filters>) => {
    try {
      setLoading(true);
      const currentFilters = { ...filters, ...overrideFilters };
      let data: Inscription[] = [];

      // Priorité aux filtres spécifiques
      if (currentFilters.eleveDataId) {
        // Récupérer par élève
        data = await inscriptionService.getByEleve(currentFilters.eleveDataId);
      } else if (currentFilters.classeId) {
        // Récupérer par classe
        data = await inscriptionService.getByClasse(currentFilters.classeId);
      } else if (currentFilters.anneeScolaire) {
        // Récupérer par année scolaire
        data = await inscriptionService.getByAnneeScolaire(currentFilters.anneeScolaire);
      } else {
        // Récupérer toutes
        data = await inscriptionService.getAll();
      }

      // Filtrer par statut actif si demandé
      if (currentFilters.isActive !== undefined) {
        data = data.filter(i => i.isActive === currentFilters.isActive);
      }

      setInscriptions(data);
      
      // Filtrer les actives (si pas déjà filtré)
      if (currentFilters.isActive === undefined) {
        const actives = data.filter(i => i.isActive !== false);
        setInscriptionsActives(actives);
      } else {
        setInscriptionsActives(data.filter(i => i.isActive !== false));
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Met à jour les filtres et recharge
  const updateFilters = useCallback(async (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    return await loadInscriptions(newFilters);
  }, [loadInscriptions]);

  // Récupère UNIQUEMENT les inscriptions actives (avec filtres optionnels)
  const loadInscriptionsActives = useCallback(async (options?: { classeId?: string; eleveDataId?: string; anneeScolaire?: string }) => {
    try {
      setLoading(true);
      let data: Inscription[];

      if (options?.eleveDataId) {
        data = await inscriptionService.getByEleve(options.eleveDataId);
      } else if (options?.classeId) {
        data = await inscriptionService.getByClasse(options.classeId);
      } else if (options?.anneeScolaire) {
        data = await inscriptionService.getByAnneeScolaire(options.anneeScolaire);
      } else {
        data = await inscriptionService.getActives();
      }

      const actives = data.filter(i => i.isActive !== false);
      setInscriptionsActives(actives);
      return actives;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getInscriptionById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      return await inscriptionService.getById(id);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getInscriptionsByEleve = useCallback(async (eleveDataId: string) => {
    try {
      setLoading(true);
      return await inscriptionService.getByEleve(eleveDataId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getInscriptionsByClasse = useCallback(async (classeId: string) => {
    try {
      setLoading(true);
      return await inscriptionService.getByClasse(classeId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getInscriptionsByAnnee = useCallback(async (anneeScolaire: string) => {
    try {
      setLoading(true);
      return await inscriptionService.getByAnneeScolaire(anneeScolaire);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentInscription = useCallback(async (eleveDataId: string) => {
    try {
      setLoading(true);
      return await inscriptionService.getCurrentInscription(eleveDataId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createInscription = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const newInscription = await inscriptionService.create(data);
      
      // Recharger selon les filtres actuels
      await loadInscriptions();
      
      return newInscription;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadInscriptions]);

  const inscrireNouvelEleve = useCallback(async (data: any) => {
    try {
      setLoading(true);
      const result = await inscriptionService.inscrireNouvelEleve(data);
      await loadInscriptions();
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadInscriptions]);

  const updateInscription = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      const updated = await inscriptionService.update(id, data);
      
      // Mettre à jour les listes locales
      setInscriptions(prev => prev.map(i => i.id === id ? updated : i));
      setInscriptionsActives(prev => prev.map(i => i.id === id ? updated : i));
      
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteInscription = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await inscriptionService.delete(id);
      setInscriptions(prev => prev.filter(i => i.id !== id));
      setInscriptionsActives(prev => prev.filter(i => i.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getEffectifClasse = useCallback((classeId: string, anneeScolaire?: string) => {
    const annee = anneeScolaire || new Date().getFullYear() + '-' + (new Date().getFullYear() + 1);
    return inscriptionsActives.filter(i => 
      i.classeId === classeId && 
      i.anneeScolaire === annee
    ).length;
  }, [inscriptionsActives]);

  const searchInscriptions = useCallback((searchTerm: string) => {
    if (!searchTerm) return inscriptions;
    
    const term = searchTerm.toLowerCase();
    return inscriptions.filter(i => 
      i.nom.toLowerCase().includes(term) ||
      i.prenom.toLowerCase().includes(term) ||
      (i.matricule || "").toLowerCase().includes(term) ||
      i.classe.toLowerCase().includes(term)
    );
  }, [inscriptions]);

  // Chargement initial automatique seulement si autoLoad est true
  useEffect(() => {
    if (autoLoad) {
      loadInscriptions();
    }
  }, [autoLoad, loadInscriptions]);

  return {
    inscriptions,           // Inscriptions selon les filtres
    inscriptionsActives,    // Uniquement les actives selon les filtres
    loading,
    error,
    filters,
    loadInscriptions,
    loadInscriptionsActives,
    updateFilters,
    getInscriptionById,
    getInscriptionsByEleve,
    getInscriptionsByClasse,
    getInscriptionsByAnnee,
    getCurrentInscription,
    createInscription,
    inscrireNouvelEleve,
    updateInscription,
    deleteInscription,
    getEffectifClasse,
    searchInscriptions
  };
}