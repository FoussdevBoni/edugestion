// src/components/admin/pdf-views/RecuPDF.tsx
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { Recu } from '../../../utils/types/data';
import { formatMoney } from '../../../helpers/formatMoney';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#1e3a8a',
    paddingBottom: 10,
  },
  logoContainer: {
    width: 60,
    height: 60,
  },
  ecoleInfos: {
    textAlign: 'right',
  },
  titre: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#1e3a8a',
    color: 'white',
    padding: 8,
    marginBottom: 20,
    borderRadius: 5,
  },
  numeroRecu: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 15,
  },
  section: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    padding: 5,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 120,
    color: '#666',
  },
  value: {
    flex: 1,
    fontWeight: 'bold',
  },
  montant: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'right',
    marginTop: 10,
  },
  reste: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#dc2626',
    textAlign: 'right',
    marginTop: 5,
  },
  statut: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 5,
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    color: '#666',
    fontSize: 8,
  },
  signature: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '40%',
    textAlign: 'center',
  },
  signatureLine: {
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 5,
  },
  devise: {
    fontSize: 9,
    fontStyle: 'italic',
    color: '#1e3a8a',
    textAlign: 'center',
    marginTop: 10,
  },
});

interface RecuPDFProps {
  recu: Recu;
}

export const RecuPDF = ({ recu }: RecuPDFProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatMontant = (montant: number) => {
    return formatMoney(montant)
  };

  const getStatutStyle = () => {
    switch (recu.statutPayement) {
      case 'paye':
        return { color: '#16a34a' };
      case 'partiellement':
        return { color: '#ca8a04' };
      case 'impaye':
        return { color: '#dc2626' };
      default:
        return { color: '#666' };
    }
  };

  const getStatutLabel = () => {
    switch (recu.statutPayement) {
      case 'paye':
        return 'Payé';
      case 'partiellement':
        return 'Paiement partiel';
      case 'impaye':
        return 'Impayé';
      default:
        return recu.statutPayement;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête avec logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {recu.ecoleInfos.logo && (
              <Image 
                src={recu.ecoleInfos.logo}
                cache={false}
                style={styles.logoContainer} 
              />
            )}
          </View>
          <View style={styles.ecoleInfos}>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{recu.ecoleInfos.nom}</Text>
            <Text>{recu.ecoleInfos.adresse}</Text>
            <Text>Tel: {recu.ecoleInfos.telephone}</Text>
            <Text>Email: {recu.ecoleInfos.email}</Text>
          </View>
        </View>

        {/* Titre */}
        <Text style={styles.titre}>REÇU DE PAIEMENT</Text>

        {/* Numéro de reçu */}
        <Text style={styles.numeroRecu}>N° {recu.numeroRecu}</Text>

        {/* Informations élève */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Élève</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nom et prénom :</Text>
            <Text style={styles.value}>{recu.inscription.prenom} {recu.inscription.nom}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Classe :</Text>
            <Text style={styles.value}>{recu.inscription.classe}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Matricule :</Text>
            <Text style={styles.value}>{recu.inscription.matricule}</Text>
          </View>
        </View>

        {/* Détails du paiement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails du paiement</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Motif :</Text>
            <Text style={styles.value}>{recu.motif}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date de paiement :</Text>
            <Text style={styles.value}>{formatDate(recu.datePayement)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Mode de paiement :</Text>
            <Text style={styles.value}>{recu.modePaiement}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date d'émission :</Text>
            <Text style={styles.value}>{formatDate(recu.dateEmission)}</Text>
          </View>
          
          <Text style={styles.montant}>Montant payé : {formatMontant(recu.montantPaye)}</Text>
          
          {recu.statutPayement === 'partiellement' && recu.montantRestant > 0 && (
            <Text style={styles.reste}>Reste à payer : {formatMontant(recu.montantRestant)}</Text>
          )}
          
          <View style={[styles.row, { marginTop: 10 }]}>
            <Text style={styles.label}>Statut :</Text>
            <Text style={[styles.value, getStatutStyle()]}>
              {getStatutLabel()}
            </Text>
          </View>
        </View>

        {/* Devise */}
        {recu.ecoleInfos.devise && (
          <Text style={styles.devise}>"{recu.ecoleInfos.devise}"</Text>
        )}

        {/* Signature */}
        <View style={styles.signature}>
          <View style={styles.signatureBox}>
            <Text>Le parent d'élève</Text>
            <View style={styles.signatureLine} />
          </View>
          <View style={styles.signatureBox}>
            <Text>Le chef d'établissement</Text>
            <View style={styles.signatureLine} />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Ce reçu est délivré à titre de justificatif de paiement.</Text>
        </View>
      </Page>
    </Document>
  );
};