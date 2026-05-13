import { PDFViewer } from '@react-pdf/renderer';
import {  Paiement, Recu } from '../../../utils/types/data';
import { useLocation, useNavigate } from 'react-router-dom';
import useEcoleInfos from '../../../hooks/ecoleInfos/useEcoleInfos';
import useEcoleImages from '../../../hooks/ecoleInfos/useEcoleImages';
import useRecu from '../../../hooks/paiements/useRecu';
import { RecuPDF } from '../../../components/admin/pdf-views/RecuPDF';

const PaiementPDFViewerPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const paiement: Paiement | null = location.state;
    const { ecoleInfos } = useEcoleInfos();
    const { logoUrl } = useEcoleImages()
    const { handleDownload } = useRecu({ paiement })

    const eleve = paiement?.inscription;

   



    if (!paiement || !eleve || !ecoleInfos) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Chargement des données du paiement...</p>
            </div>
        );
    }

     const genererNumeroRecu = (paiement: Paiement) => {
        const date = new Date(paiement.datePayement);
        const annee = date.getFullYear();
        const mois = String(date.getMonth() + 1).padStart(2, '0');
        const index = paiement.id.slice(-4).toUpperCase();
        return `REC-${annee}-${mois}-${index}`;
    };


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
            logo: logoUrl!,
            devise: ecoleInfos.devise
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
                        Aperçu : {eleve.prenom} {eleve.nom}
                    </span>
                </div>

                {/* Bouton de Téléchargement */}
                <button className='lex items-center gap-2 px-4 
                 py-2 bg-gradient-to-r from-primary to-primary/80 text-white 
                 rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]' onClick={() => {
                        handleDownload()
                    }}>
                    Télécharger le reçu
                </button>
            </div>

            {/* Zone du PDF */}
            <div className="flex-1 w-full overflow-hidden">
                <PDFViewer style={{ width: '100%', height: '100%', border: 'none' }}>
                    <RecuPDF recu={recuData}  />
                </PDFViewer>
            </div>
        </div>
    );
};

export default PaiementPDFViewerPage;