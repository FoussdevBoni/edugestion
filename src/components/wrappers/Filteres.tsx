// src/components/admin/filters/ClasseFilter.tsx
import { useState, useEffect, ReactNode } from "react";
import { 
  Search
} from "lucide-react";
import { useEcoleNiveau } from "../../hooks/filters/useEcoleNiveau";
import useNiveauxClasses from "../../hooks/niveauxClasses/useNiveauxClasses";
import useClasses from "../../hooks/classes/useClasses";
import TabsHorizontalScrollable from "../../components/ui/TabsHorizontalScrollable";

interface ClasseFilterProps<T> {
  children: (filteredData: T[]) => ReactNode;
  data: T[];
  baseFilter?: (item: T) => boolean;
  searchFields?: (keyof T)[];
  getNiveauClasse: (item: T) => string | undefined;
  getClasse: (item: T) => string | undefined;
  getCycle: (item: T) => string | undefined;
  getSearchString?: (item: T) => string;
}

export default function ClasseFilter<T>({ 
  children, 
  data, 
  baseFilter,
  searchFields,
  getNiveauClasse,
  getClasse,
  getCycle,
  getSearchString
}: ClasseFilterProps<T>) {
  const { niveauSelectionne, cycleSelectionne } = useEcoleNiveau();
  const { niveauxClasse  } = useNiveauxClasses();
  const { classes } = useClasses();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeNiveauClasseTab, setActiveNiveauClasseTab] = useState("all");
  const [activeClasseTab, setActiveClasseTab] = useState("all");

  // Filtrer les niveaux classes par cycle sélectionné
  const niveauxClassesFiltres = niveauxClasse.filter(
    nc => cycleSelectionne ? nc.cycle === cycleSelectionne : true
  );

  // Appliquer le filtre de base s'il existe
  const dataWithBaseFilter = baseFilter ? data.filter(baseFilter) : data;

  // Fonction de recherche
  const matchesSearch = (item: T): boolean => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    
    // Si getSearchString est fourni, l'utiliser
    if (getSearchString) {
      return getSearchString(item).toLowerCase().includes(term);
    }
    
    // Sinon, utiliser searchFields
    if (searchFields) {
      return searchFields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(term);
      });
    }
    
    return true;
  };

  // Obtenir les onglets des niveaux classes
  const niveauClasseTabs = (() => {
    // D'abord, filtrer les données par niveau et cycle globaux
    const filteredData = dataWithBaseFilter.filter(item => {
      const itemNiveau = getNiveauClasse(item);
      const itemCycle = getCycle(item);
      
      const matchesNiveau = niveauSelectionne ? itemNiveau === niveauSelectionne : true;
      const matchesCycle = cycleSelectionne ? itemCycle === cycleSelectionne : true;
      return matchesNiveau && matchesCycle;
    });

    // Créer le tab "Tous les niveaux"
    const tabs = [
      {
        id: "all",
        label: "Tous les niveaux",
        count: filteredData.length
      }
    ];

    // Ajouter les niveaux classes
    niveauxClassesFiltres.forEach(nc => {
      const count = filteredData.filter(item => getNiveauClasse(item) === nc.nom).length;
      
      if (count > 0) {
        tabs.push({
          id: nc.nom,
          label: nc.nom,
          count: count
        });
      }
    });

    return tabs;
  })();

  // Obtenir les classes d'un niveau sélectionné
  const classesDuNiveau = activeNiveauClasseTab !== "all"
    ? classes.filter(c => c.niveauClasse === activeNiveauClasseTab)
    : [];

  // Obtenir les onglets des classes
  const classeTabs = (() => {
    // Filtrer les données par niveau sélectionné
    const filteredData = dataWithBaseFilter.filter(item => {
      const itemNiveau = getNiveauClasse(item);
      const itemCycle = getCycle(item);
      
      const matchesNiveau = activeNiveauClasseTab !== "all" 
        ? itemNiveau === activeNiveauClasseTab 
        : true;
      const matchesCycle = cycleSelectionne ? itemCycle === cycleSelectionne : true;
      return matchesCycle && matchesNiveau;
    });

    // Créer le tab "Toutes les classes"
    const tabs = [
      {
        id: "all",
        label: "Toutes les classes",
        count: filteredData.length
      }
    ];

    // Si un niveau est sélectionné, montrer ses classes
    if (activeNiveauClasseTab !== "all") {
      classesDuNiveau.forEach(classe => {
        const count = filteredData.filter(item => getClasse(item) === classe.nom).length;
        if (count > 0) {
          tabs.push({
            id: classe.nom,
            label: classe.nom,
            count: count
          });
        }
      });
    } else {
      // Sinon, montrer toutes les classes
      const toutesLesClasses = [...new Set(dataWithBaseFilter.map(item => getClasse(item)).filter(Boolean))].sort();
      toutesLesClasses.forEach(classe => {
        const count = filteredData.filter(item => getClasse(item) === classe).length;
        if (count > 0) {
          tabs.push({
            id: classe as string,
            label: classe as string,
            count: count
          });
        }
      });
    }

    return tabs;
  })();

  // Filtrer les données finales
  const filteredData = dataWithBaseFilter.filter(item => {
    const matchesNiveauGlobal = niveauSelectionne ? getNiveauClasse(item) === niveauSelectionne : true;
    const matchesCycleGlobal = cycleSelectionne ? getCycle(item) === cycleSelectionne : true;
    const matchesSearchTerm = matchesSearch(item);
    
    // Filtre par niveau classe
    const matchesNiveauClasse = activeNiveauClasseTab === "all" 
      ? true 
      : getNiveauClasse(item) === activeNiveauClasseTab;
    
    // Filtre par classe
    const matchesClasse = activeClasseTab === "all" 
      ? true 
      : getClasse(item) === activeClasseTab;

    return matchesNiveauGlobal && matchesCycleGlobal && matchesSearchTerm && 
           matchesNiveauClasse && matchesClasse;
  });

  // Réinitialiser quand les filtres globaux changent
  useEffect(() => {
    setActiveNiveauClasseTab("all");
    setActiveClasseTab("all");
  }, [niveauSelectionne, cycleSelectionne]);

  // Réinitialiser la classe quand le niveau change
  useEffect(() => {
    setActiveClasseTab("all");
  }, [activeNiveauClasseTab]);

  const clearFilters = () => {
    setSearchTerm("");
    setActiveNiveauClasseTab("all");
    setActiveClasseTab("all");
  };

  return (
    <div className="space-y-6">
      {/* Barre de recherche */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Filtres - Tabs horizontaux */}
      <div className="space-y-4">
        {/* Niveaux classes */}
        {niveauClasseTabs.length > 1 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Niveau</p>
            <TabsHorizontalScrollable
              tabs={niveauClasseTabs}
              activeTab={activeNiveauClasseTab}
              onTabChange={setActiveNiveauClasseTab}
            />
          </div>
        )}

        {/* Classes */}
        {classeTabs.length > 1 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Classe</p>
            <TabsHorizontalScrollable
              tabs={classeTabs}
              activeTab={activeClasseTab}
              onTabChange={setActiveClasseTab}
            />
          </div>
        )}
      </div>

      {/* Messages informatifs */}
      {!cycleSelectionne && (
        <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
          Veuillez sélectionner un cycle dans le menu principal pour filtrer les niveaux
        </div>
      )}

      {/* Indicateur de filtres */}
      {(niveauSelectionne || cycleSelectionne || activeNiveauClasseTab !== "all" || activeClasseTab !== "all" || searchTerm) && (
        <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
          <span>Filtres actifs:</span>
          {niveauSelectionne && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
              {niveauSelectionne}
            </span>
          )}
          {cycleSelectionne && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
              {cycleSelectionne}
            </span>
          )}
          {activeNiveauClasseTab !== "all" && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
              {activeNiveauClasseTab}
            </span>
          )}
          {activeClasseTab !== "all" && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
              {activeClasseTab}
            </span>
          )}
          {searchTerm && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">
              "{searchTerm}"
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-red-500 hover:text-red-700 ml-2 text-xs"
          >
            Effacer tout
          </button>
        </div>
      )}

      {/* Les enfants reçoivent les données filtrées */}
      {children(filteredData)}
    </div>
  );
}