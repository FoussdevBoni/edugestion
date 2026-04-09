import { useEffect, useState } from 'react';
import useEcoleInfos from './useEcoleInfos';
import { photoService } from '../../services/photoService';

export default function useEcoleImages() {
  const { ecoleInfos: ecole, loading: ecoleLoading, error: ecoleError, updateEcoleInfos } = useEcoleInfos();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [enTeteUrl, setEnTeteUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Charger les images en base64 pour l'affichage
  useEffect(() => {
    const loadImages = async () => {
      if (!ecole) return;
      
      setImageLoading(true);
      setImageError(null);
      
      try {
        if (ecole.logo) {
          const base64 = await photoService.getFileBase64(ecole.logo, 'upload');
          setLogoUrl(base64);
        }
        if (ecole.enTeteCarte) {
          const base64 = await photoService.getFileBase64(ecole.enTeteCarte, 'upload');
          setEnTeteUrl(base64);
        }
      } catch (error) {
        console.error("Erreur chargement images:", error);
        setImageError("Erreur lors du chargement des images");
      } finally {
        setImageLoading(false);
      }
    };

    loadImages();
  }, [ecole]);

  // Upload du logo
  const uploadLogo = async (file: File) => {
    if (!file) return;

    setUploadLoading(true);
    setImageError(null);

    try {
      // Convertir le fichier en base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Upload du fichier
      const result = await photoService.uploadFile({
        base64,
        type: 'logo',
        nom: `logo_${Date.now()}.jpg`
      });

      // Mettre à jour l'URL locale pour affichage
      setLogoUrl(base64);

      // Mettre à jour l'école avec le nouveau nom de fichier
      if (ecole) {
        await updateEcoleInfos({
          ...ecole,
          logo: result.fileName
        });
      }

      return result;
    } catch (error) {
      console.error("Erreur upload logo:", error);
      setImageError("Erreur lors de l'upload du logo");
      throw error;
    } finally {
      setUploadLoading(false);
    }
  };

  return {
    logoUrl,
    enTeteUrl,
    imageLoading,
    imageError,
    uploadLoading,
    ecoleLoading,
    ecoleError,
    uploadLogo
  };
}