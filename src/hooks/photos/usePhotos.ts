// src/hooks/photos/usePhotos.ts
import { useState, useCallback } from 'react';
import { photoService, UploadResult, PhotoData } from '../../services/photoService';
import { alertServerError } from '../../helpers/alertError';

export default function usePhotos() {
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const uploadPhotos = useCallback(async (photos: PhotoData[], inscriptions: any[]) => {
    setLoading(true);
    try {
      const result = await photoService.uploadPhotos(photos, inscriptions);
      setUploadResult(result);
      return result;
    } catch (error) {
      alertServerError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPhoto = useCallback(async (matricule: string) => {
    setLoading(true);
    try {
      return await photoService.getPhoto(matricule);
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
    uploadPhotos,
    getPhoto,
    resetUploadResult
  };
}