// src/components/admin/details/BulletinPDF.tsx
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { Bulletin, EcoleInfo } from '../../../utils/types/data';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 9,
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    adminBlock: {
        width: '60%',
    },
    logoBlock: {
        width: 60,
        height: 60,
    },
    titleContainer: {
        textAlign: 'center',
        marginBottom: 15,
    },
    titleMain: {
        fontSize: 14,
        fontWeight: 'bold',
        textDecoration: 'underline',
    },
    studentSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        padding: 5,
        borderWidth: 1,
        borderColor: '#000',
    },
    studentCol: {
        flexDirection: 'column',
        gap: 3,
    },
    table: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#000',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        minHeight: 20,
        alignItems: 'stretch'
    },
    tableHeader: {
        backgroundColor: '#eee',
    },
    cell: {
        borderRightWidth: 1,
        borderRightColor: '#000',
        justifyContent: 'center',
        padding: 2,
    },
    colMatiere: { width: '25%' },
    colNote: { width: '8%', textAlign: 'center' },
    colMoy: { width: '10%', textAlign: 'center' },
    colCoef: { width: '6%', textAlign: 'center' },
    colTotal: { width: '9%', textAlign: 'center' },
    colAppreciation: { width: '26%', borderRightWidth: 0, paddingLeft: 3 },

    // Nouveau style pour la vie scolaire
    vieScolaireSection: {
        flexDirection: 'row',
        marginTop: 15,
        gap: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
    },
    vieScolaireItem: {
        flex: 1,
        alignItems: 'center',
    },
    vieScolaireLabel: {
        fontSize: 8,
        color: '#666',
        marginBottom: 4,
    },
    vieScolaireValue: {
        fontSize: 12,
        fontWeight: 'bold',
    },

    footerSection: {
        flexDirection: 'row',
        marginTop: 15,
        gap: 10,
    },
    resultsBox: {
        width: '40%',
        borderWidth: 1,
        padding: 5,
    },
    observationBox: {
        width: '60%',
        borderWidth: 1,
        padding: 5,
    },
    mentionsWrapper: {
        flexDirection: 'row',
        marginTop: 15,
        gap: 20,
    },
    miniTable: {
        width: '45%',
        borderWidth: 1,
        borderBottomWidth: 0,
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
    signatureSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        textAlign: 'center',
    }
});

interface Props {
    data: Bulletin;
    ecoleInfos: EcoleInfo;
}

export const BulletinPDF = ({ data, ecoleInfos }: Props) => {

    // Récupérer les noms des colonnes à partir de la première matière
    const colonnesNotes = data.moyennesParMatiere[0]?.notes.items.map(item => item.nom) || [];

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* 1. Header */}
                <View style={styles.header}>
                    <View style={styles.adminBlock}>
                        <Text style={{ fontWeight: 'bold' }}>
                            {ecoleInfos.pays || "REPUBLIQUE DU SENEGAL"}
                        </Text>
                        {ecoleInfos.ia && <Text>IA : {ecoleInfos.ia}</Text>}
                        {ecoleInfos.ief && <Text>IEF : {ecoleInfos.ief}</Text>}
                        <Text style={{ fontWeight: 'bold', marginTop: 2 }}>{ecoleInfos.nom}</Text>
                    </View>
                    <View style={styles.logoBlock}>
                        {ecoleInfos.logo && <Image src={ecoleInfos.logo} />}
                    </View>
                </View>

                {/* 2. Titre */}
                <View style={styles.titleContainer}>
                    <Text style={styles.titleMain}>BULLETIN DE NOTES</Text>
                    <Text style={{ fontWeight: 'bold' }}>{data.periode}</Text>
                    <Text>ANNEE SCOLAIRE : {ecoleInfos.anneeScolaire}</Text>
                </View>

                {/* 3. Infos Élève */}
                <View style={styles.studentSection}>
                    <View style={styles.studentCol}>
                        <Text>Prénom(s) : <Text style={{ fontWeight: 'bold' }}>{data.eleve.prenom}</Text></Text>
                        <Text>Nom : <Text style={{ fontWeight: 'bold' }}>{data.eleve.nom}</Text></Text>
                    </View>
                    <View style={styles.studentCol}>
                        <Text>Classe : {data.eleve.classe}</Text>
                        <Text>Matricule : {data.eleve.matricule}</Text>
                    </View>
                    <View style={styles.studentCol}>
                        <Text>Effectif : {data.infosDeClasse?.effectif || 'N/A'}</Text>
                    </View>
                </View>

                {/* 4. Tableau principal */}
                <View style={styles.table}>
                    <View style={{ ...styles.tableRow, ...styles.tableHeader }}>
                        <Text style={{ ...styles.cell, ...styles.colMatiere }}>Disciplines</Text>
                        {colonnesNotes.map((nom, index) => (
                            <Text key={index} style={{ ...styles.cell, ...styles.colNote }}>{nom}</Text>
                        ))}
                        <Text style={{ ...styles.cell, ...styles.colMoy, fontWeight: 'bold' }}>Moy/20</Text>
                        <Text style={{ ...styles.cell, ...styles.colCoef }}>Coef</Text>
                        <Text style={{ ...styles.cell, ...styles.colTotal }}>Total</Text>
                        <Text style={{ ...styles.cell, ...styles.colAppreciation }}>Appréciations</Text>
                    </View>

                    {data.moyennesParMatiere.map((matiere, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={{ ...styles.cell, ...styles.colMatiere }}>{matiere.matiere}</Text>
                            {matiere.notes.items.map((item, idx) => (
                                <Text key={idx} style={{ ...styles.cell, ...styles.colNote }}>
                                    {item.note || "-"}
                                </Text>
                            ))}
                            <Text style={{ ...styles.cell, ...styles.colMoy }}>{matiere.moyenneVingtieme}</Text>
                            <Text style={{ ...styles.cell, ...styles.colCoef }}>{matiere.coefficient}</Text>
                            <Text style={{ ...styles.cell, ...styles.colTotal }}>{matiere.pointsPonderes}</Text>
                            <Text style={{ ...styles.cell, ...styles.colAppreciation }}>{matiere.appreciation}</Text>
                        </View>
                    ))}
                </View>

                {/* 5. Vie scolaire (Nouvelle section) */}
                <View style={styles.vieScolaireSection}>
                    <View style={styles.vieScolaireItem}>
                        <Text style={styles.vieScolaireLabel}>ABSENCES</Text>
                        <Text style={styles.vieScolaireValue}>{data.vieScolaire?.absences || 0}</Text>
                    </View>
                    <View style={styles.vieScolaireItem}>
                        <Text style={styles.vieScolaireLabel}>RETARDS</Text>
                        <Text style={styles.vieScolaireValue}>{data.vieScolaire?.retards || 0}</Text>
                    </View>
                    <View style={styles.vieScolaireItem}>
                        <Text style={styles.vieScolaireLabel}>CONDUITE</Text>
                        <Text style={styles.vieScolaireValue}>{data.vieScolaire?.conduite || 0}/20</Text>
                    </View>
                </View>

                {/* 6. Totaux & Observations */}
                <View style={styles.footerSection}>
                    <View style={styles.resultsBox}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>RÉSULTATS :</Text>
                        <Text>Moy. Semestre : {data.resultatFinal?.moyenneGenerale}</Text>
                        {
                            data.resultatFinal.moyennesPeriodesAnterieures?.map((m) => {
                                if (!m) {
                                    return null
                                }
                                return (
                                    <Text key={m.periodeId}>Moy. {m.nom} : {m.moyenne}</Text>
                                )
                            })
                        }
                        <Text>Moy. Annuelle : {data.resultatFinal?.moyenneAnnuelle || '-'}</Text>
                        <Text style={{ fontWeight: 'bold', marginTop: 4 }}>RANG : {data.resultatFinal?.rang}</Text>
                    </View>
                    <View style={styles.observationBox}>
                        <Text style={{ fontWeight: 'bold' }}>OBSERVATIONS :</Text>
                        <Text style={{ marginTop: 5 }}>{data.commentaires?.observations || ''}</Text>
                        <Text style={{ marginTop: 10, fontWeight: 'bold' }}>DÉCISION :
                            {data.commentaires?.decisionConseil || ''}
                        </Text>
                    </View>
                </View>

                {/* 7. Mentions & Distinctions */}
                <View style={styles.mentionsWrapper}>
                    <View style={styles.miniTable}>
                        {[
                            { l: "Satisfaisant doit continuer", v: "" },
                            { l: "Peut mieux faire", v: "" },
                            { l: "Insuffisant", v: "" },
                            { l: "Risque d'exclusion", v: "" },
                            { l: "Risque l'exclusion", v: "" },
                        ].map((item, idx) => (
                            <View key={idx} style={styles.miniRow}>
                                <Text style={styles.miniLabel}>{item.l}</Text>
                                <Text style={styles.miniCheck}>{item.v}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={styles.miniTable}>
                        {["Félicitation", "Encouragement", "Tableau d'honneur", "Blâme", "Avertissement"].map((label, idx) => (
                            <View key={idx} style={styles.miniRow}>
                                <Text style={styles.miniLabel}>{label}</Text>
                                <Text style={styles.miniCheck}></Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* 8. Signatures */}
                <View style={styles.signatureSection}>
                    <View style={{ width: '40%' }}>
                        <Text>Le Parent d'Élève</Text>
                    </View>
                    <View style={{ width: '40%' }}>
                        <Text>Le Chef d'Établissement</Text>
                        <Text style={{ marginTop: 30, fontSize: 7 }}>

                        </Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};