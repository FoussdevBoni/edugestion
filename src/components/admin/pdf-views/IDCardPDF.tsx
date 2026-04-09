// src/components/admin/pdf/IDCardPDF.tsx
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  card: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: '#1e3a8a',
    borderRadius: 10,
    padding: 15,
  },
  headerImage: {
    width: '100%',
    height: 80,
    marginBottom: 10,
  },
  collegeNom: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e3a8a',
    marginVertical: 5,
  },
  titreCarte: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: 5,
    marginVertical: 10,
    borderRadius: 5,
  },
  mainContent: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  photoColumn: {
    width: '30%',
    paddingRight: 10,
  },
  photo: {
    width: '100%',
    height: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  infoColumn: {
    width: '35%',
    paddingHorizontal: 5,
  },
  thirdColumn: {
    width: '35%',
    paddingLeft: 10,
  },
  infoRow: {
    marginBottom: 5,
  },
  label: {
    fontSize: 7,
    color: '#666',
  },
  value: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  highlightValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  devise: {
    fontSize: 9,
    fontStyle: 'italic',
    color: '#1e3a8a',
    flex: 1,
  },
  signature: {
    alignItems: 'center',
  },
  signatureLine: {
    marginTop: 5,
    width: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
});

export interface CardData {
  enTeteCarte?: string;
  nomEcole: string;
  devise?: string;
  anneeScolaire: string;
  eleve: {
    nom: string;
    prenom: string;
    dateNaissance: string;
    matricule: string;
    sexe: 'M' | 'F';
    classe: string;
    lieuNaissance?: string;
    photoBase64?: string | null;
  };
}

interface IDCardPDFProps {
  cardData: CardData;
}

export const IDCardPDF = ({ cardData }: IDCardPDFProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          {/* En-tête (image fournie par l'école) */}
          {cardData.enTeteCarte && (
            <Image src={cardData.enTeteCarte} style={styles.headerImage} />
          )}

          {/* Nom du collège */}
          <Text style={styles.collegeNom}>{cardData.nomEcole}</Text>

          {/* Titre de la carte */}
          <Text style={styles.titreCarte}>CARTE D'IDENTITÉ SCOLAIRE</Text>

          {/* Corps principal avec 3 colonnes */}
          <View style={styles.mainContent}>
            {/* Colonne 1 : Photo */}
            <View style={styles.photoColumn}>
              {cardData.eleve.photoBase64 ? (
                <Image src={cardData.eleve.photoBase64} style={styles.photo} />
              ) : (
                <View style={[styles.photo, { backgroundColor: '#f0f0f0' }]} />
              )}
            </View>

            {/* Colonne 2 : Infos principales */}
            <View style={styles.infoColumn}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>ANNÉE SCOLAIRE</Text>
                <Text style={styles.highlightValue}>{cardData.anneeScolaire}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.label}>NOM</Text>
                <Text style={styles.value}>{cardData.eleve.nom}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.label}>PRÉNOM</Text>
                <Text style={styles.value}>{cardData.eleve.prenom}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.label}>DATE DE NAISSANCE</Text>
                <Text style={styles.value}>{formatDate(cardData.eleve.dateNaissance)}</Text>
              </View>
            </View>

            {/* Colonne 3 : Autres infos */}
            <View style={styles.thirdColumn}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>MATRICULE</Text>
                <Text style={styles.value}>{cardData.eleve.matricule}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.label}>SEXE</Text>
                <Text style={styles.value}>
                  {cardData.eleve.sexe === 'M' ? 'Masculin' : 'Féminin'}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.label}>CLASSE</Text>
                <Text style={styles.value}>{cardData.eleve.classe}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Text style={styles.label}>LIEU DE NAISSANCE</Text>
                <Text style={styles.value}>{cardData.eleve.lieuNaissance || '—'}</Text>
              </View>
            </View>
          </View>

          {/* Footer avec devise et signature */}
          <View style={styles.footer}>
            <Text style={styles.devise}>
              {cardData.devise || "L'éducation est l'arme la plus puissante"}
            </Text>
            <View style={styles.signature}>
              <Text style={styles.value}>Le Directeur</Text>
              <View style={styles.signatureLine} />
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};