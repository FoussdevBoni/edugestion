// hooks/useElevePhoto.ts
import { useState, useEffect } from 'react';
import { photoService } from '../../services/photoService';

export const useElevePhoto = (matricule: string) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!matricule) return;

    const loadPhoto = async () => {
      setLoading(true);
      try {
        const buffer = await photoService.getPhoto(matricule);
        if (buffer) {
          // Convertir le buffer en base64
          const base64 = btoa(
            new Uint8Array(buffer).reduce(
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

  return { photoUrl, loading };
};