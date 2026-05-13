import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { Bulletin } from '../../../utils/types/data';
import { BulletinPDF } from '../../../components/admin/pdf-views/BulletinPDF';
import { useLocation, useNavigate } from 'react-router-dom';
import useEcoleInfos from '../../../hooks/ecoleInfos/useEcoleInfos';
import useEcoleImages from '../../../hooks/ecoleInfos/useEcoleImages';
import useBulletins from '../../../hooks/bulletins/useBulletins';

const BulletinPDFViewerPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const bulletinData: Bulletin | null = location.state;
    const { ecoleInfos } = useEcoleInfos();
    const { logoUrl } = useEcoleImages()
    const { handleDownload } = useBulletins()


    if (!bulletinData || !ecoleInfos) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Chargement des données du bulletin...</p>
            </div>
        );
    }

    const fileName = `Bulletin_${bulletinData.eleve.nom}_${bulletinData.eleve.prenom}.pdf`;

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
                        Aperçu : {bulletinData.eleve.prenom} {bulletinData.eleve.nom}
                    </span>
                </div>

                {/* Bouton de Téléchargement */}
                <button className='lex items-center gap-2 px-4 
                 py-2 bg-gradient-to-r from-primary to-primary/80 text-white 
                 rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]' onClick={() => {
                        handleDownload(bulletinData)
                    }}>
                    Télécharger le bulletion
                </button>
            </div>

            {/* Zone du PDF */}
            <div className="flex-1 w-full overflow-hidden">
                <PDFViewer style={{ width: '100%', height: '100%', border: 'none' }}>
                    <BulletinPDF data={bulletinData} ecoleInfos={{
                        ...ecoleInfos,
                        logo: logoUrl || ""
                    }} />
                </PDFViewer>
            </div>
        </div>
    );
};

export default BulletinPDFViewerPage;