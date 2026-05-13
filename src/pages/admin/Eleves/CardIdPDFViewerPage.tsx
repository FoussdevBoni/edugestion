import { PDFViewer } from '@react-pdf/renderer';
import {  Inscription } from '../../../utils/types/data';
import { useLocation, useNavigate } from 'react-router-dom';
import useEcoleInfos from '../../../hooks/ecoleInfos/useEcoleInfos';
import useCarte from '../../../hooks/eleves/useCarte';
import { IDCardPDF } from '../../../components/admin/pdf-views/IDCardPDF';
import { useEffect, useState } from 'react';
import { photoService } from '../../../services/photoService';
import { useElevePhoto } from '../../../hooks/photos/useElevePhoto';

const IDCardPDFViewerPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedEleve: Inscription | null = location.state;
    const { ecoleInfos } = useEcoleInfos();
    const { handleDownload } = useCarte({ eleve: selectedEleve });

    const [enTeteUrl, setEnTeteUrl] = useState<string | null>(null);
  const { photoUrl } = useElevePhoto(selectedEleve?.matricule || "");

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

   

    if (!selectedEleve || !ecoleInfos) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Chargement des données de l'élève...</p>
            </div>
        );
    }

     const carteData = {
        enTeteCarte: enTeteUrl!,
        nomEcole: ecoleInfos?.nom || "",
        devise: ecoleInfos?.devise,
        anneeScolaire: ecoleInfos?.anneeScolaire || "",
        eleve: {
            nom: selectedEleve.nom,
            prenom: selectedEleve.prenom,
            dateNaissance: selectedEleve.dateNaissance,
            matricule: selectedEleve.matricule || "",
            sexe: selectedEleve.sexe,
            classe: selectedEleve.classe,
            lieuNaissance: selectedEleve.lieuDeNaissance || "",
            photoBase64: photoUrl || null
        }
    };

    return (
        <div className="w-full h-screen flex flex-col bg-gray-100">
            {/* Barre d'outils */}
            <div className="flex items-center justify-between px-6 py-3 bg-[#2c3e50] text-white shadow-md">
                <div>
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-4 text-sm hover:underline"
                    >
                        ← Retour
                    </button>
                    <span className="font-semibold">
                        Aperçu : {selectedEleve.prenom} {selectedEleve.nom}
                    </span>
                </div>

                {/* Bouton de Téléchargement */}
                <button className='lex items-center gap-2 px-4 
                 py-2 bg-gradient-to-r from-primary to-primary/80 text-white 
                 rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]' onClick={() => {
                        handleDownload()
                    }}>
                    Télécharger la carte de l'élève
                </button>
            </div>

            {/* Zone du PDF */}
            <div className="flex-1 w-full overflow-hidden">
                <PDFViewer style={{ width: '100%', height: '100%', border: 'none' }}>
                    <IDCardPDF cardData={carteData}  />
                </PDFViewer>
            </div>
        </div>
    );
};

export default IDCardPDFViewerPage;