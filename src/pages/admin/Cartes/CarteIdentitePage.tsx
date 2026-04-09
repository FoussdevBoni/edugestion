// src/pages/admin/cartes/CarteIdentitePage.tsx
import { useState } from "react";
import { PDFViewer } from '@react-pdf/renderer';
import { IDCardPDF } from "../../../components/admin/pdf-views/IDCardPDF";

const FAKE_ELEVE = {
  nom: "DIONGUE",
  prenom: "FATOU BINTOU",
  dateNaissance: "2010-03-15",
  matricule: "20A053",
  sexe: "F" as const,
  classe: "6ème A",
  lieuNaissance: "Dakar",
  photoBase64: null // Pas de photo pour le test
};

const FAKE_ECOLE = {
  enTeteCarte: "https://via.placeholder.com/800x100/1e3a8a/ffffff?text=REPUBLIQUE+DU+SENEGAL+MINISTERE+EDUCATION",
  nomEcole: "Groupe Scolaire Les Papillons",
  devise: "Le savoir est une lumière",
  anneeScolaire: "2024-2025"
};

export default function CarteIdentitePage() {
  const [cardData] = useState({
    enTeteCarte: FAKE_ECOLE.enTeteCarte,
    nomEcole: FAKE_ECOLE.nomEcole,
    devise: FAKE_ECOLE.devise,
    anneeScolaire: FAKE_ECOLE.anneeScolaire,
    eleve: FAKE_ELEVE
  });

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white border-b p-4">
        <h1 className="text-2xl font-bold text-gray-800">Aperçu carte d'identité</h1>
        <p className="text-sm text-gray-500">
          {FAKE_ELEVE.prenom} {FAKE_ELEVE.nom} - {FAKE_ELEVE.classe}
        </p>
      </div>
      
      <div className="flex-1">
        <PDFViewer width="100%" height="100%" className="border-0">
          <IDCardPDF cardData={cardData} />
        </PDFViewer>
      </div>
    </div>
  );
}