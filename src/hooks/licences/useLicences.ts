// src/hooks/licence/useLicence.ts
import { useState, useCallback, useEffect } from 'react';
import { licenceService, LicenseValidationResult } from '../../services/licenceService';
import { alertServerError } from '../../helpers/alertError';

export default function useLicence() {
  const [loading, setLoading] = useState(false);
  const [machineId, setMachineId] = useState<string | null>(null);
  const [formattedMachineId, setFormattedMachineId] = useState<string | null>(null);
  const [licenseStatus, setLicenseStatus] = useState<LicenseValidationResult | null>(null);
  const [checking, setChecking] = useState(true);

  // Récupérer l'ID machine
  const getMachineId = useCallback(async () => {
    setLoading(true);
    try {
      const result = await licenceService.getMachineId();
      if (result.success) {
        setMachineId(result.machineId);
        setFormattedMachineId(result.formattedId);
      }
      return result;
    } catch (error) {
      alertServerError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Valider une licence
  const validateLicense = useCallback(async (licenseKey: string) => {
    setLoading(true);
    try {
      const result = await licenceService.validateLicense(licenseKey);
      return result;
    } catch (error) {
      alertServerError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sauvegarder une licence
  const saveLicense = useCallback(async (licenseKey: string) => {
    setLoading(true);
    try {
      const result = await licenceService.saveLicense(licenseKey);
      if (result.success) {
        setLicenseStatus(result);
      }
      return result;
    } catch (error) {
      alertServerError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Vérifier la licence stockée
  const checkStoredLicense = useCallback(async () => {
    setChecking(true);
    try {
      const result = await licenceService.checkStoredLicense();
      setLicenseStatus(result);
      return result;
    } catch (error) {
      alertServerError(error);
      return { valid: false, reason: 'Erreur de vérification' };
    } finally {
      setChecking(false);
    }
  }, []);

  // Supprimer la licence
  const clearLicense = useCallback(async () => {
    setLoading(true);
    try {
      const result = await licenceService.clearLicense();
      if (result.success) {
        setLicenseStatus(null);
      }
      return result;
    } catch (error) {
      alertServerError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger l'ID machine au montage
  useEffect(() => {
    getMachineId();
  }, [getMachineId]);

  // Vérifier la licence au montage
  useEffect(() => {
    checkStoredLicense();
  }, [checkStoredLicense]);

  return {
    loading,
    checking,
    machineId,
    formattedMachineId,
    licenseStatus,
    getMachineId,
    validateLicense,
    saveLicense,
    checkStoredLicense,
    clearLicense
  };
}