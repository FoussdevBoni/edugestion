// src/hooks/bulletins/useBulletins.ts
import { useEffect, useState, useCallback } from 'react';
import { bulletinService, CreateMultipleResult, GenerateMultipleResult } from '../../services/bulletinService';
import { Bulletin } from '../../utils/types/data';
import { BaseConfigBulletin } from '../../utils/types/base';
import { BulletinPDF } from '../../components/admin/pdf-views/BulletinPDF';
import { downloadPdf } from '../../helpers/dowloadPdf';
import useEcoleInfos from '../ecoleInfos/useEcoleInfos';
import useEcoleImages from '../ecoleInfos/useEcoleImages';

interface UseBulletinsProps {
  periodeId?: string;
  autoLoad?: boolean;
}

export default function useBulletins({ periodeId, autoLoad = true }: UseBulletinsProps = {}) {
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState<string | null>(null);
  const [createResult, setCreateResult] = useState<CreateMultipleResult | null>(null);
  const [generateResult, setGenerateResult] = useState<GenerateMultipleResult | null>(null);
  const { ecoleInfos } = useEcoleInfos();
  const { logoUrl } = useEcoleImages()

  const loadBulletins = useCallback(async (customPeriodeId?: string) => {
    try {
      setLoading(true);
      const data = customPeriodeId || periodeId
        ? await bulletinService.getByPeriode(customPeriodeId || periodeId!)
        : await bulletinService.getAll();
      setBulletins(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [periodeId]);

  const getBulletinById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      return await bulletinService.getById(id);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Création en masse
  const createMultiple = useCallback(async (periodeId: string, inscriptionIds: string[]) => {
    try {
      setLoading(true);
      const result = await bulletinService.createMultiple({ periodeId, inscriptionIds });
      setCreateResult(result);
      await loadBulletins(periodeId);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadBulletins]);

  // Génération en masse
  const generateMultiple = useCallback(async (periodeId: string, bulletinIds: string[], config: BaseConfigBulletin) => {
    try {
      setLoading(true);
      const result = await bulletinService.generateMultiple({ periodeId, bulletinIds, config });
      setGenerateResult(result);
      await loadBulletins(periodeId);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadBulletins]);

  const updateBulletin = useCallback(async (id: string, data: Partial<Bulletin>) => {
    try {
      setLoading(true);
      const updated = await bulletinService.update(id, data);
      setBulletins(prev => prev.map(b => b.id === id ? updated : b));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sauvegarde un bulletin (crée ou met à jour)
  const saveBulletin = useCallback(async (inscriptionId: string, periodeId: string, data: Partial<Bulletin>) => {
    try {
      setLoading(true);
      const saved = await bulletinService.save(inscriptionId, periodeId, data);
      setBulletins(prev => {
        const exists = prev.some(b => b.inscriptionId === inscriptionId && b.periodeId === periodeId);
        if (exists) {
          return prev.map(b => b.inscriptionId === inscriptionId && b.periodeId === periodeId ? saved : b);
        } else {
          return [...prev, saved];
        }
      });
      return saved;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBulletin = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await bulletinService.delete(id);
      setBulletins(prev => prev.filter(b => b.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteManyBulletins = useCallback(async (ids: string[]) => {
    try {
      setLoading(true);
      const result = await bulletinService.deleteMany(ids);
      setBulletins(prev => prev.filter(b => !ids.includes(b.id)));
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStats = useCallback(() => {
    const complets = bulletins.filter(b => b.status === 'complet');
    const incomplets = bulletins.filter(b => b.status === 'incomplet');
    const aFinaliser = bulletins.filter(b => b.status === 'a_finaliser');
    const brouillons = bulletins.filter(b => b.status === 'brouillon');

    return {
      total: bulletins.length,
      complets: complets.length,
      incomplets: incomplets.length,
      aFinaliser: aFinaliser.length,
      brouillons: brouillons.length
    };
  }, [bulletins]);

  const resetCreateResult = useCallback(() => {
    setCreateResult(null);
  }, []);

  const resetGenerateResult = useCallback(() => {
    setGenerateResult(null);
  }, []);

  const handleDownload = async (bulletin: Bulletin) => {
    if (!ecoleInfos) {
      return
    }
    const fileName = `bulletin_${bulletin.eleve.nom}_${bulletin.eleve.prenom}`;
    await downloadPdf(
      <BulletinPDF data={bulletin} ecoleInfos={
        {
          ...ecoleInfos,
          logo: logoUrl!
        }
      } />,
      fileName
    );
  };

  useEffect(() => {
    if (autoLoad) {
      loadBulletins();
    }
  }, [loadBulletins, autoLoad]);

  return {
    bulletins,
    loading,
    error,
    createResult,
    generateResult,
    loadBulletins,
    getBulletinById,
    createMultiple,
    generateMultiple,
    updateBulletin,
    saveBulletin,
    deleteBulletin,
    deleteManyBulletins,
    resetCreateResult,
    resetGenerateResult,
    getStats,
    handleDownload
  };
}