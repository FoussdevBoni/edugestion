// src/hooks/useRecu.ts
import { useEffect, useState } from "react";
import { downloadPdf } from "../../helpers/dowloadPdf";
import { Paiement, Recu } from "../../utils/types/data";
import useEcoleInfos from "../ecoleInfos/useEcoleInfos";
import { photoService } from "../../services/photoService";
import { RecuPDF } from "../../components/admin/pdf-views/RecuPDF";

interface UseRecuProp {
  paiement?: Paiement | null;
}

export default function useRecu({ paiement }: UseRecuProp) {
  const { ecoleInfos } = useEcoleInfos();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  const eleve = paiement?.inscription;

  // Générer un numéro de reçu unique
  const genererNumeroRecu = (paiement: Paiement) => {
    const date = new Date(paiement.datePayement);
    const annee = date.getFullYear();
    const mois = String(date.getMonth() + 1).padStart(2, '0');
    const index = paiement.id.slice(-4).toUpperCase();
    return `REC-${annee}-${mois}-${index}`;
  };

  // Charger le logo en base64
  useEffect(() => {
    const loadImages = async () => {
      if (ecoleInfos?.logo) {
        const base64 = await photoService.getFileBase64(ecoleInfos.logo, 'upload');
        setLogoUrl(base64);
      }
    };
    loadImages();
  }, [ecoleInfos]);

  const handleDownload = async () => {
    if (!paiement || !ecoleInfos || !eleve || !logoUrl) return;

    const fileName = `recu_${eleve.nom}_${eleve.prenom}_${paiement.datePayement}`.replace(/\s+/g, '_').toLowerCase();

    const recuData: Recu = {
      id: `recu_${paiement.id}`,
      numeroRecu: genererNumeroRecu(paiement),
      paiementId: paiement.id,
      inscription: eleve,
      montantPaye: paiement.montantPaye,
      montantRestant: paiement.montantRestant || 0,
      motif: paiement.motif || "Paiement scolarité",
      modePaiement: paiement.modePaiement,
      datePayement: paiement.datePayement,
      dateEmission: new Date().toISOString(),
      statutPayement: paiement.statut,
      ecoleInfos: {
        nom: ecoleInfos.nom,
        adresse: ecoleInfos.adresse,
        telephone: ecoleInfos.telephone,
        email: ecoleInfos.email,
        logo: logoUrl,
        devise: ecoleInfos.devise
      }
    };

    await downloadPdf(
      <RecuPDF recu={recuData} />,
      fileName
    );
  };

  return {
    handleDownload,
  };
}