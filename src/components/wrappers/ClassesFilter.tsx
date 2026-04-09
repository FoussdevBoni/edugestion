import { useEcoleNiveau } from "../../hooks/filters/useEcoleNiveau";
import useNiveauxClasses from "../../hooks/niveauxClasses/useNiveauxClasses";
import useClasses from "../../hooks/classes/useClasses";
import TabsHorizontalScrollable from "../ui/TabsHorizontalScrollable";

interface ClasseFilterProps<T> {
  data: T[];
  // On remplace les clés par des fonctions pour extraire la donnée
  getNiveauClasse: (item: T) => string | string[]; // string[] pour gérer les profs multi-niveaux
  getClasse: (item: T) => string | string[];
  getCycle: (item: T) => string | string[];
  showZeroCounts?: boolean; // Afficher les onglets avec 0 count
}

export default function ClasseFilter<T>({ 
  data, 
  getNiveauClasse, 
  getClasse, 
  getCycle,
  showZeroCounts = false
}: ClasseFilterProps<T>) {
  const { 
    cycleSelectionne, niveauClasseSelectionne, classeSelectionne,
    setNiveauClasse, setClasse 
  } = useEcoleNiveau();

  const { niveauxClasse } = useNiveauxClasses();
  const { classes } = useClasses();

  // Helper pour vérifier si un item correspond à un filtre (gère string ou array)
  const matches = (itemValue: string | string[], target: string) => {
    if (!target) return true;
    return Array.isArray(itemValue) ? itemValue.includes(target) : itemValue === target;
  };

  // Filtrer les données une fois pour le niveau actuel
  const filteredByCycle = data.filter(item => matches(getCycle(item), cycleSelectionne));
  const filteredByNiveau = data.filter(item => matches(getNiveauClasse(item), niveauClasseSelectionne));

  // Logique pour les Niveaux
  const niveauClasseTabs = [
    { 
      id: "", 
      label: "Tous les niveaux", 
      count: filteredByCycle.length 
    },
    ...niveauxClasse
      .filter(nc => !cycleSelectionne || nc.cycle === cycleSelectionne)
      .map(nc => ({
        id: nc.nom,
        label: nc.nom,
        count: filteredByCycle.filter(item => matches(getNiveauClasse(item), nc.nom)).length
      }))
      .filter(tab => showZeroCounts || tab.count > 0)
  ];

  // Logique pour les Classes
  const classeTabs = [
    { 
      id: "", 
      label: "Toutes les classes", 
      count: filteredByNiveau.length 
    },
    ...classes
      .filter(c => !niveauClasseSelectionne || c.niveauClasse === niveauClasseSelectionne)
      .map(c => ({
        id: c.nom,
        label: c.nom,
        count: filteredByNiveau.filter(item => matches(getClasse(item), c.nom)).length
      }))
      .filter(tab => showZeroCounts || tab.count > 0)
  ];

  return (
    <div className="space-y-4">
      {niveauClasseTabs.length > 1 && (
        <TabsHorizontalScrollable 
          tabs={niveauClasseTabs} 
          activeTab={niveauClasseSelectionne || ""} 
          onTabChange={setNiveauClasse} 
        />
      )}
      {classeTabs.length > 1 && (
        <TabsHorizontalScrollable 
          tabs={classeTabs} 
          activeTab={classeSelectionne || ""} 
          onTabChange={setClasse} 
        />
      )}
    </div>
  );
}