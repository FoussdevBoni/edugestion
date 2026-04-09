import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';

// Création des styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  titleSection: {
    textAlign: 'center',
    marginBottom: 15,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  studentInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  infoCell: {
    width: '50%',
    flexDirection: 'row',
    marginBottom: 2,
  },
  label: {
    width: 130,
    fontWeight: 'bold',
  },
  // Tableau principal
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
    minHeight: 18,
    alignItems: 'center',
  },
  tableColHeader: {
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 2,
    borderRightWidth: 1,
  },
  tableCol: {
    textAlign: 'center',
    padding: 2,
    borderRightWidth: 1,
  },
  // Section des moyennes et observations
  summaryContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  summaryTable: {
    width: '65%',
    borderWidth: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    height: 18,
    alignItems: 'center',
  },
  observationBox: {
    width: '30%',
    marginLeft: '5%',
    borderWidth: 1,
    padding: 5,
  },
  // Section des mentions (les deux petits tableaux que vous avez fournis)
  mentionsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    width: '65%',
  },
  miniTable: {
    width: '48%',
    borderWidth: 1,
  },
  miniRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    height: 15,
    alignItems: 'center',
  },
  miniLabel: {
    flex: 1,
    fontSize: 8,
    paddingLeft: 3,
  },
  miniCheck: {
    width: 25,
    borderLeftWidth: 1,
    textAlign: 'center',
    height: '100%',
    fontSize: 9,
  },
  footer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

const BulletinScolaire = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* En-tête */}
      <View style={styles.header}>
        <View>
          <Text style={styles.bold}>REPUBLIQUE DU SENEGAL</Text>
          <Text>IA : PIKINE GUEDIAWAYE</Text>
          <Text>IEF : THIAROYE</Text>
          <Text style={styles.bold}>GROUPE SCOLAIRE PIA</Text>
        </View>
        <View style={{ width: 60, height: 40, borderBottomWidth: 1 }}><Text>LOGO</Text></View>
      </View>

      {/* Titre */}
      <View style={styles.titleSection}>
        <Text style={styles.reportTitle}>BULLETIN DE NOTES</Text>
        <Text style={{ fontSize: 13, fontWeight: 'bold' }}>SEMESTRE 2</Text>
        <Text>ANNEE SCOLAIRE : 2021 - 2022</Text>
      </View>

      {/* Infos Elève */}
      <View style={styles.studentInfoGrid}>
        <View style={styles.infoCell}><Text style={styles.label}>Prénom (S) :</Text><Text>FATOU BINTOU</Text></View>
        <View style={styles.infoCell}><Text style={styles.label}>Nom :</Text><Text>DIONGUE</Text></View>
        <View style={styles.infoCell}><Text style={styles.label}>Date de naissance :</Text><Text>10/11/2010 à DAKAR</Text></View>
        <View style={styles.infoCell}><Text style={styles.label}>Classe :</Text><Text>6e</Text></View>
      </View>

      {/* Tableau des notes */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableColHeader, width: '25%' }}><Text>Disciplines</Text></View>
          <View style={{ ...styles.tableColHeader, width: '10%' }}><Text>Dev 1</Text></View>
          <View style={{ ...styles.tableColHeader, width: '10%' }}><Text>Dev 2</Text></View>
          <View style={{ ...styles.tableColHeader, width: '10%' }}><Text>Comp</Text></View>
          <View style={{ ...styles.tableColHeader, width: '10%' }}><Text>Moy/20</Text></View>
          <View style={{ ...styles.tableColHeader, width: '8%' }}><Text>Coef</Text></View>
          <View style={{ ...styles.tableColHeader, width: '27%', borderRightWidth: 0 }}><Text>Appréciations</Text></View>
        </View>

        {/* Exemple de ligne de donnée */}
        <View style={styles.tableRow}>
          <View style={{ ...styles.tableCol, width: '25%' }}><Text>MATHS</Text></View>
          <View style={{ ...styles.tableCol, width: '10%' }}><Text>2</Text></View>
          <View style={{ ...styles.tableCol, width: '10%' }}><Text>6,5</Text></View>
          <View style={{ ...styles.tableCol, width: '10%' }}><Text>4,5</Text></View>
          <View style={{ ...styles.tableCol, width: '10%' }}><Text>4,33</Text></View>
          <View style={{ ...styles.tableCol, width: '8%' }}><Text>3</Text></View>
          <View style={{ ...styles.tableCol, width: '27%', borderRightWidth: 0 }}><Text>Médiocre</Text></View>
        </View>
      </View>

      {/* Totaux et Observations */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryTable}>
          <View style={styles.summaryRow}>
            <Text style={{ width: '70%', paddingLeft: 5 }}>MOYENNE SEMESTRE 1 :</Text>
            <Text style={{ width: '30%', textAlign: 'center', borderLeftWidth: 1 }}>10,17</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={{ width: '70%', paddingLeft: 5 }}>MOYENNE SEMESTRE 2 :</Text>
            <Text style={{ width: '30%', textAlign: 'center', borderLeftWidth: 1 }}>11,34</Text>
          </View>
          <View style={{ ...styles.summaryRow, borderBottomWidth: 0 }}>
            <Text style={{ width: '70%', paddingLeft: 5, fontWeight: 'bold' }}>MOYENNE ANNUELLE :</Text>
            <Text style={{ width: '30%', textAlign: 'center', borderLeftWidth: 1 }}>10,75</Text>
          </View>
        </View>

        <View style={styles.observationBox}>
          <Text style={{ borderBottomWidth: 1, fontSize: 8, marginBottom: 5 }}>Observations :</Text>
          <Text style={{ textAlign: 'center', marginTop: 5 }}>Passe en classe supérieure</Text>
        </View>
      </View>

      {/* Les deux tableaux de mentions que vous avez envoyés */}
      <View style={styles.mentionsWrapper}>
        <View style={styles.miniTable}>
          {[
            { l: "Satisfaisant doit continuer", c: "" },
            { l: "Peut mieux faire", c: "X" },
            { l: "Insuffisant", c: "" },
            { l: "Risque d'exclusion", c: "" },
            { l: "Risque l'exclusion", c: "" },
          ].map((item, i) => (
            <View key={i} style={{ ...styles.miniRow, borderBottomWidth: i === 4 ? 0 : 1 }}>
              <Text style={styles.miniLabel}>{item.l}</Text>
              <Text style={styles.miniCheck}>{item.c}</Text>
            </View>
          ))}
        </View>

        <View style={styles.miniTable}>
          {["Félicitation", "Encouragement", "Tableau d'honneur", "Blâme", "Avertissement"].map((l, i) => (
            <View key={i} style={{ ...styles.miniRow, borderBottomWidth: i === 4 ? 0 : 1 }}>
              <Text style={styles.miniLabel}>{l}</Text>
              <Text style={styles.miniCheck}></Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bas de page */}
      <View style={styles.footer}>
        <Text>Dakar, le : 13/08/2022</Text>
        <Text style={styles.bold}>Le chef d'Etablissement</Text>
      </View>
    </Page>
  </Document>
);

export default BulletinScolaire;