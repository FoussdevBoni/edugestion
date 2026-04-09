// src/hooks/useCarte.ts
import { useEffect, useState } from "react";
import { IDCardPDF } from "../../components/admin/pdf-views/IDCardPDF";
import { downloadPdf } from "../../helpers/dowloadPdf";
import {  Inscription } from "../../utils/types/data";
import useEcoleInfos from "../ecoleInfos/useEcoleInfos";
import { useElevePhoto } from "../photos/useElevePhoto";
import { photoService } from "../../services/photoService";

interface UseCarteProp {
  eleve?: Inscription | null;
}

export default function useCarte({ eleve }: UseCarteProp) {
  const { ecoleInfos } = useEcoleInfos();
  const { photoUrl, loading: photoLoading } = useElevePhoto(eleve?.matricule || "");

    const [enTeteUrl, setEnTeteUrl] = useState<string | null>(null);
  
    // Charger les images en base64 pour l'affichage
    useEffect(() => {
      const loadImages = async () => {
       
        if (ecoleInfos?.enTeteCarte) {
          const base64 = await photoService.getFileBase64(ecoleInfos.enTeteCarte, 'upload');
          setEnTeteUrl(base64);
        }
      };
      loadImages();
    }, [ecoleInfos]);

  const handleDownload = async () => {
    if (!eleve || !ecoleInfos) return;

    const fileName = `carte_identite_de_${eleve.nom}_${eleve.prenom}`.replace(/\s+/g, '_').toLowerCase();

    const carteData = {
      enTeteCarte: enTeteUrl!,
      nomEcole: ecoleInfos?.nom || "",
      devise: ecoleInfos?.devise,
      anneeScolaire: ecoleInfos?.anneeScolaire || "",
      eleve: {
        nom: eleve.nom,
        prenom: eleve.prenom,
        dateNaissance: eleve.dateNaissance,
        matricule: eleve.matricule || "",
        sexe: eleve.sexe,
        classe: eleve.classe,
        lieuNaissance: eleve.lieuDeNaissance || "",
        photoBase64: photoUrl || null
      }
    };

    await downloadPdf(
      <IDCardPDF cardData={carteData} />,
      fileName
    );
  };

  return {
    handleDownload,
    loading: photoLoading
  };
}