// src/pages/admin/configuration/ecole/UpdateEcoleInfosPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { EcoleInfo } from "../../../../utils/types/data";
import { ecoleInfosService } from "../../../../services/ecoleInfosService";
import { photoService } from "../../../../services/photoService";
import EcoleInfosForm from "../../../../components/admin/forms/EcoleInfosForm";

export default function UpdateEcoleInfosPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const ecoleData = location.state as EcoleInfo;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialFormData, setInitialFormData] = useState<any>(null);

  // Charger les images en base64 pour l'affichage
  useEffect(() => {
    const loadImages = async () => {
      if (!ecoleData) return;

      let logoBase64 = null;
      let enTeteBase64 = null;

      if (ecoleData.logo) {
        logoBase64 = await photoService.getFileBase64(ecoleData.logo, 'upload');
      }

      if (ecoleData.enTeteCarte) {
        enTeteBase64 = await photoService.getFileBase64(ecoleData.enTeteCarte, 'upload');
      }

      setInitialFormData({
        ...ecoleData,
        logo: logoBase64,
        enTeteCarte: enTeteBase64
      });
    };

    loadImages();
  }, [ecoleData]);

  if (!ecoleData) {
    navigate("/admin/configuration/ecole");
    return null;
  }

  if (!initialFormData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      // 1. Upload du logo s'il a changé (si c'est un base64)
      let logoFileName = ecoleData.logo;
      if (formData.logo && formData.logo !== ecoleData.logo) {
        const logoResult = await photoService.uploadFile({
          base64: formData.logo,
          type: 'logo',
          nom: 'logo_ecole.png'
        });
        logoFileName = logoResult.fileName;
      }

      // 2. Upload de l'en-tête s'il a changé
      let enTeteFileName = ecoleData.enTeteCarte;
      if (formData.enTeteCarte && formData.enTeteCarte !== ecoleData.enTeteCarte) {
        const enTeteResult = await photoService.uploadFile({
          base64: formData.enTeteCarte,
          type: 'enTeteCarte',
          nom: 'entete_carte.png'
        });
        enTeteFileName = enTeteResult.fileName;
      }

      // 3. Mettre à jour avec les noms des fichiers
      const updateData = {
        ...formData,
        logo: logoFileName,
        enTeteCarte: enTeteFileName
      };

      await ecoleInfosService.update(updateData);
      navigate("/admin/configuration/ecole");
    } catch (error) {
      console.error("Erreur mise à jour:", error);
      alert("Erreur lors de la mise à jour");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EcoleInfosForm
      initialData={initialFormData}
      title="Modifier l'école"
      submitLabel="Mettre à jour"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onCancel={() => navigate("/admin/configuration/ecole")}
    />
  );
}