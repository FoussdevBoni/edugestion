import { Users, GraduationCap, BarChart3, CreditCard, FileText, Key } from "lucide-react";
import { useEcoleNiveau } from "../../hooks/filters/useEcoleNiveau";

export default function Dashboard() {
  const { niveauSelectionne } = useEcoleNiveau();

  // Déterminer le titre en fonction de la sélection
  const getTitreTableauBord = () => {
    if (!niveauSelectionne) {
      return "Tableau de bord - Tous les niveaux";
    }
    return `Tableau de bord - ${niveauSelectionne}`;
  };

  // Les données pourraient être filtrées selon le niveau
  // Exemple de données dynamiques selon le niveau
  const getDonneesParNiveau = () => {
    switch(niveauSelectionne) {
      case "Préscolaire":
        return {
          eleves: "85",
          bulletins: "0",
          paiements: "8 500  F CFA",
          enseignants: "6",
          matieres: "4",
          licences: "15"
        };
      case "Primaire":
        return {
          eleves: "450",
          bulletins: "450",
          paiements: "45 000  F CFA",
          enseignants: "18",
          matieres: "8",
          licences: "25"
        };
      case "Secondaire":
        return {
          eleves: "665",
          bulletins: "0",
          paiements: "79 800  F CFA",
          enseignants: "21",
          matieres: "16",
          licences: "20"
        };
      default:
        return {
          eleves: "1200",
          bulletins: "450",
          paiements: "133 300   F CFA",
          enseignants: "45",
          matieres: "28",
          licences: "60"
        };
    }
  };

  const donnees = getDonneesParNiveau();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{getTitreTableauBord()}</h1>
      
      {/* Indicateur de cycle si sélectionné (optionnel) */}
      {niveauSelectionne && (
        <p className="text-gray-500 mb-6">
          Affichage des données pour le {niveauSelectionne.toLowerCase()}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          title="Élèves inscrits" 
          value={donnees.eleves} 
          icon={<Users size={32} />} 
        />
        <Card 
          title="Bulletins générés" 
          value={donnees.bulletins} 
          icon={<FileText size={32} />} 
        />
        <Card 
          title="Paiements reçus" 
          value={donnees.paiements} 
          icon={<CreditCard size={32} />} 
        />
        <Card 
          title="Enseignants actifs" 
          value={donnees.enseignants} 
          icon={<GraduationCap size={32} />} 
        />
        <Card 
          title="Matières suivies" 
          value={donnees.matieres} 
          icon={<BarChart3 size={32} />} 
        />
        <Card 
          title="Licences valides" 
          value={donnees.licences} 
          icon={<Key size={32} />} 
        />
      </div>

      {/* Exemple de section avec plus de détails selon le niveau */}
      {niveauSelectionne && (
        <div className="mt-8 bg-white rounded-2xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">
            Détails pour le {niveauSelectionne}
          </h2>
          <p className="text-gray-600">
            {niveauSelectionne === "Préscolaire" && "3 sections maternelles • 85 enfants inscrits"}
            {niveauSelectionne === "Primaire" && "6 classes du CP1 au CM2 • 450 élèves"}
            {niveauSelectionne === "Secondaire" && "Collège et Lycée • 665 élèves répartis en 15 classes"}
          </p>
        </div>
      )}
    </div>
  );
}

function Card({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition flex items-center gap-4">
      <div className="text-primary">{icon}</div>
      <div>
        <div className="text-gray-500 text-sm">{title}</div>
        <div className="font-bold text-xl">{value}</div>
      </div>
    </div>
  );
}