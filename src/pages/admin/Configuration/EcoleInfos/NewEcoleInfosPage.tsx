// src/pages/admin/configuration/ecole/NewEcoleInfosPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ecoleInfosService } from "../../../../services/ecoleInfosService";
import { photoService } from "../../../../services/photoService";
import EcoleInfosForm from "../../../../components/admin/forms/EcoleInfosForm";

export default function NewEcoleInfosPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      // 1. Upload du logo si présent
      let logoFileName = null;
      if (formData.logo) {
        const logoResult = await photoService.uploadFile({
          base64: formData.logo,
          type: 'logo',
          nom: 'logo_ecole.png'
        });
        logoFileName = logoResult.fileName;
      }

      // 2. Upload de l'en-tête si présent
      let enTeteFileName = null;
      if (formData.enTeteCarte) {
        const enTeteResult = await photoService.uploadFile({
          base64: formData.enTeteCarte,
          type: 'enTeteCarte',
          nom: 'entete_carte.png'
        });
        enTeteFileName = enTeteResult.fileName;
      }

      // 3. Créer l'école avec les noms des fichiers
      const ecoleData = {
        ...formData,
        logo: logoFileName, // On remplace le base64 par le nom du fichier
        enTeteCarte: enTeteFileName // On remplace le base64 par le nom du fichier
      };

      await ecoleInfosService.create(ecoleData);
      navigate("/admin/configuration/ecole");
    } catch (error) {
      console.error("Erreur création:", error);
      alert("Erreur lors de la création des informations");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EcoleInfosForm
      title="Nouvelle école"
      submitLabel="Créer"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onCancel={() => navigate("/admin/configuration/ecole")}
    />
  );
}