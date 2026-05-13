// hooks/useElevePhoto.ts
import { useState, useEffect } from 'react';
import { photoService } from '../../services/photoService';

export const useElevePhoto = (matricule: string) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Charger la photo
  useEffect(() => {
    if (!matricule) return;

    const loadPhoto = async () => {
      setLoading(true);
      try {
        const buffer = await photoService.getPhoto(matricule);
        if (buffer) {
          // Convertir le buffer (ArrayBuffer/Uint8Array) en base64
          const uint8Array = new Uint8Array(buffer);
          const base64 = btoa(
            uint8Array.reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          );
          setPhotoUrl(`data:image/jpeg;base64,${base64}`);
        } else {
          setPhotoUrl(null);
        }
      } catch (error) {
        console.error("Erreur chargement photo:", error);
        setPhotoUrl(null);
      } finally {
        setLoading(false);
      }
    };

    loadPhoto();
  }, [matricule]);

  // Uploader une photo
  const uploadPhoto = async (file: File) => {
    if (!matricule) {
      throw new Error("Matricule non défini");
    }

    setUploading(true);
    try {
      // Convertir le File en base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const result = await photoService.uploadElevePhoto(matricule, base64);
      
      if (result.success) {
        // Recharger la photo après upload
        const buffer = await photoService.getPhoto(matricule);
        if (buffer) {
          const uint8Array = new Uint8Array(buffer);
          const newBase64 = btoa(
            uint8Array.reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          );
          setPhotoUrl(`data:image/jpeg;base64,${newBase64}`);
        }
        return result;
      } else {
        throw new Error(result.error || "Erreur lors de l'upload");
      }
    } catch (error) {
      console.error("Erreur upload:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };



  return { 
    photoUrl, 
    loading, 
    uploading,
    uploadPhoto
  };
};