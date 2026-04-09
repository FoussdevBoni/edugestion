// src/hooks/inscriptions/useInscriptions.ts
import { useEffect, useState, useCallback } from 'react';
import { inscriptionService } from '../../services/inscriptionService';
import { Inscription } from '../../utils/types/data';



export default function useInscriptions() {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [inscriptionsActives, setInscriptionsActives] = useState<Inscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupère TOUTES les inscriptions (actives et inactives)
  const loadInscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await inscriptionService.getAll();
      setInscriptions(data);
      
      // Filtrer les actives
      const actives = data.filter(i => i.isActive !== false);
      setInscriptionsActives(actives);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupère UNIQUEMENT les inscriptions actives
  const loadInscriptionsActives = useCallback(async () => {
    try {
      setLoading(true);
      const data = await inscriptionService.getActives();
      setInscriptionsActives(data);
      return data;
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
      setInscriptions(prev => [...prev, newInscription]);
      setInscriptionsActives(prev => [...prev, newInscription]);
      return newInscription;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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

  useEffect(() => {
    loadInscriptions();
  }, [loadInscriptions]);

  return {
    inscriptions,           // Toutes les inscriptions
    inscriptionsActives,    // Uniquement les actives
    loading,
    error,
    loadInscriptions,
    loadInscriptionsActives,
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