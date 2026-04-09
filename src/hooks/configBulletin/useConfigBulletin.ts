// src/hooks/configBulletin/useConfigBulletin.ts
import { useEffect, useState, useCallback } from 'react';
import { configBulletinService } from '../../services/configBulletinService';
import { ConfigBulletin } from '../../utils/types/data';
import { BaseConfigBulletin } from '../../utils/types/base';
import { alertServerError } from '../../helpers/alertError';

interface UseConfigBulletinProps {
  autoLoad?: boolean;
}

export default function useConfigBulletin({ autoLoad = true }: UseConfigBulletinProps = {}) {
  const [config, setConfig] = useState<ConfigBulletin | null>(null);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      const data = await configBulletinService.get();
      setConfig(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      alertServerError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveConfig = useCallback(async (data: BaseConfigBulletin) => {
    try {
      setSaving(true);
      const result = await configBulletinService.save(data);
      setConfig(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      alertServerError(err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const deleteConfig = useCallback(async () => {
    try {
      setLoading(true);
      await configBulletinService.delete();
      setConfig(null);
    } catch (err: any) {
      setError(err.message);
      alertServerError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoLoad) {
      loadConfig();
    }
  }, [loadConfig, autoLoad]);

  return {
    config,
    loading,
    saving,
    error,
    loadConfig,
    saveConfig,
    deleteConfig
  };
}