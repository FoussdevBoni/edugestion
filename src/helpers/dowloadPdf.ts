import { pdf } from '@react-pdf/renderer';
import { ReactElement } from 'react';

/**
 * Fonction générique pour générer et télécharger un PDF
 * @param pdfComponent Le composant React-PDF (ex: <BulletinPDF data={data} />)
 * @param fileName Le nom du fichier
 */


export const downloadPdf = async (pdfComponent: ReactElement, fileName: string): Promise<void> => {
  try {
    // 1. Générer le Blob en mémoire via react-pdf
    const blob = await pdf(pdfComponent).toBlob();

    // 2. Créer l'URL temporaire pour le navigateur
    const url = URL.createObjectURL(blob);

    // 3. Créer l'élément de téléchargement (Utilisation explicite de window.document)
    const link = window.document.createElement('a');
    link.href = url;
    link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;

    // 4. Déclenchement du téléchargement
    window.document.body.appendChild(link);
    link.click();
    
    // 5. Nettoyage de la mémoire
    setTimeout(() => {
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
  } catch (error) {
    console.error("Erreur lors de la génération du PDF :", error);
    throw error;
  }
};