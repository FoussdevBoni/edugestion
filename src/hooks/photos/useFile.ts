// src/hooks/useFile.ts
import { useState, useCallback } from 'react';
import { photoService, FileUploadResult } from '../../services/photoService';
import { alertServerError } from '../../helpers/alertError';

export default function useFile() {
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState<FileUploadResult | null>(null);

  const uploadFile = useCallback(async (base64: string, type: string, nom?: string) => {
    setLoading(true);
    try {
      const result = await photoService.uploadFile({ base64, type, nom });
      setUploadResult(result);
      return result;
    } catch (error) {
      alertServerError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFile = useCallback(async (fileName: string, type?: string) => {
    setLoading(true);
    try {
      return await photoService.getFile(fileName, type);
    } catch (error) {
      alertServerError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFileBase64 = useCallback(async (fileName: string, type?: string) => {
    setLoading(true);
    try {
      return await photoService.getFileBase64(fileName, type);
    } catch (error) {
      alertServerError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetUploadResult = useCallback(() => {
    setUploadResult(null);
  }, []);

  return {
    loading,
    uploadResult,
    uploadFile,
    getFile,
    getFileBase64,
    resetUploadResult
  };
}