// src/pages/admin/bulletins/CreateBulletinsPage.tsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, CheckCircle, Search, Filter, X, AlertCircle } from "lucide-react";
import useBulletins from "../../../hooks/bulletins/useBulletins";
import usePeriodes from "../../../hooks/periodes/usePeriodes";
import useEleves from "../../../hooks/eleves/useEleves";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import TabsHorizontalScrollable from "../../../components/ui/TabsHorizontalScrollable";

export default function NewBulletinsPage() {
  const navigate = useNavigate();
  const { cycleSelectionne } = useEcoleNiveau();
  const { periodes } = usePeriodes();
  const { eleves } = useEleves();
  const { createMultiple, createResult } = useBulletins({});

  const [selectedPeriode, setSelectedPeriode] = useState("");
  const [selectedEleves, setSelectedEleves] = useState<string[]>([]);
  const [searchEleveTerm, setSearchEleveTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  
  // Onglets pour les filtres
  const [activeFilterTab, setActiveFilterTab] = useState<"niveaux" | "classes" | "tous">("tous");
  const [selectedNiveaux, setSelectedNiveaux] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  // Extraire les niveaux classes uniques
  const niveauxUniques = useMemo(() => {
    return [...new Set(eleves.map(e => e.niveauClasse).filter(Boolean))].sort();
  }, [eleves]);

  // Extraire les classes uniques
  const classesUniques = useMemo(() => {
    return [...new Set(eleves.map(e => e.classe).filter(Boolean))].sort();
  }, [eleves]);

  // Récupérer les élèves selon les sélections
  const elevesFiltres = useMemo(() => {
    let filtered = eleves;

    if (cycleSelectionne) {
      filtered = filtered.filter(e => e.cycle === cycleSelectionne);
    }

    if (activeFilterTab === "niveaux" && selectedNiveaux.length > 0) {
      filtered = filtered.filter(e => selectedNiveaux.includes(e.niveauClasse));
    } else if (activeFilterTab === "classes" && selectedClasses.length > 0) {
      filtered = filtered.filter(e => selectedClasses.includes(e.classe));
    }

    if (searchEleveTerm) {
      const term = searchEleveTerm.toLowerCase();
      filtered = filtered.filter(e => 
        e.nom.toLowerCase().includes(term) ||
        e.prenom.toLowerCase().includes(term) ||
        e.matricule?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [eleves, cycleSelectionne, activeFilterTab, selectedNiveaux, selectedClasses, searchEleveTerm]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEleves([]);
    } else {
      setSelectedEleves(elevesFiltres.map(e => e.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleEleve = (id: string) => {
    setSelectedEleves(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleNiveau = (niveau: string) => {
    setSelectedNiveaux(prev =>
      prev.includes(niveau) ? prev.filter(n => n !== niveau) : [...prev, niveau]
    );
    setSelectedEleves([]);
    setSelectAll(false);
  };

  const toggleClasse = (classe: string) => {
    setSelectedClasses(prev =>
      prev.includes(classe) ? prev.filter(c => c !== classe) : [...prev, classe]
    );
    setSelectedEleves([]);
    setSelectAll(false);
  };

  const handleCreate = async () => {
    if (!selectedPeriode) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner une période' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (selectedEleves.length === 0) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner au moins un élève' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setCreating(true);
    try {
      const result = await createMultiple(selectedPeriode, selectedEleves);
      
      if (result.success.length > 0) {
        setMessage({ 
          type: 'success', 
          text: `${result.success.length} bulletins créés avec succès` 
        });
      } else {
        setMessage({ type: 'error', text: 'Aucun bulletin n\'a pu être créé' });
      }
      
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la création' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setCreating(false);
    }
  };

  const getFilterInfo = () => {
    if (activeFilterTab === "niveaux" && selectedNiveaux.length > 0) {
      return `Niveaux: ${selectedNiveaux.join(', ')}`;
    }
    if (activeFilterTab === "classes" && selectedClasses.length > 0) {
      return `Classes: ${selectedClasses.join(', ')}`;
    }
    return "Tous les élèves";
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Création des bulletins</h1>
          <p className="text-sm text-gray-500 mt-1">
            Créez les squelettes de bulletins pour les élèves sélectionnés
          </p>
        </div>
      </div>

      {message && (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
          message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
          'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          {message.type === 'success' && <CheckCircle size={18} />}
          {message.type === 'error' && <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Sélection de la période */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">1. Sélectionner une période</h2>
        <select
          value={selectedPeriode}
          onChange={(e) => setSelectedPeriode(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Choisir une période</option>
          {periodes.map(p => (
            <option key={p.id} value={p.id}>{p.nom}</option>
          ))}
        </select>
      </div>

      {/* Filtres par onglets */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Filter size={18} className="text-primary" />
          2. Filtrer les élèves
        </h2>

        {/* Onglets */}
        <div className="mb-6">
          <TabsHorizontalScrollable
            tabs={[
              { id: "tous", label: "Tous les élèves", count: eleves.length },
              { id: "niveaux", label: "Par niveau", count: niveauxUniques.length },
              { id: "classes", label: "Par classe", count: classesUniques.length }
            ]}
            activeTab={activeFilterTab}
            onTabChange={(tab) => {
              setActiveFilterTab(tab as "niveaux" | "classes" | "tous");
              setSelectedNiveaux([]);
              setSelectedClasses([]);
              setSelectedEleves([]);
              setSelectAll(false);
            }}
          />
        </div>

        {/* Sélection par niveau */}
        {activeFilterTab === "niveaux" && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Cliquez sur les niveaux pour sélectionner :</p>
            <div className="flex flex-wrap gap-2">
              {niveauxUniques.map(niveau => (
                <button
                  key={niveau}
                  onClick={() => toggleNiveau(niveau)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    selectedNiveaux.includes(niveau)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {niveau}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sélection par classe */}
        {activeFilterTab === "classes" && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Cliquez sur les classes pour sélectionner :</p>
            <div className="flex flex-wrap gap-2">
              {classesUniques.map(classe => (
                <button
                  key={classe}
                  onClick={() => toggleClasse(classe)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    selectedClasses.includes(classe)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {classe}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filtre cycle (header) */}
        {cycleSelectionne && (
          <div className="mb-4">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              Cycle: {cycleSelectionne}
            </span>
          </div>
        )}

        {/* Filtres actifs */}
        {(selectedNiveaux.length > 0 || selectedClasses.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedNiveaux.map(niveau => (
              <span key={niveau} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1">
                Niveau: {niveau}
                <button onClick={() => toggleNiveau(niveau)} className="hover:text-blue-900">
                  <X size={12} />
                </button>
              </span>
            ))}
            {selectedClasses.map(classe => (
              <span key={classe} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
                Classe: {classe}
                <button onClick={() => toggleClasse(classe)} className="hover:text-green-900">
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        <p className="text-sm text-gray-600 mb-4">
          Filtres : <span className="font-medium text-primary">{getFilterInfo()}</span> · <strong>{elevesFiltres.length}</strong> élève(s) trouvé(s)
        </p>

        {/* Recherche d'élèves */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un élève par nom, prénom ou matricule..."
            value={searchEleveTerm}
            onChange={(e) => setSearchEleveTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Liste des élèves */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4 text-primary rounded"
              />
              <span className="text-sm font-medium">Tous les élèves ({elevesFiltres.length})</span>
            </label>
            <span className="text-sm text-gray-500">{selectedEleves.length} sélectionné(s)</span>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {elevesFiltres.map(eleve => (
              <div
                key={eleve.id}
                className="px-4 py-3 border-b hover:bg-gray-50 flex items-center justify-between"
              >
                <label className="flex items-center gap-3 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={selectedEleves.includes(eleve.id)}
                    onChange={() => toggleEleve(eleve.id)}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <div>
                    <p className="font-medium">
                      {eleve.prenom} {eleve.nom}
                    </p>
                    <p className="text-xs text-gray-500">
                      {eleve.matricule} - {eleve.classe}
                    </p>
                  </div>
                </label>
              </div>
            ))}

            {elevesFiltres.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Aucun élève trouvé
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bouton de création */}
      <div className="flex justify-end">
        <button
          onClick={handleCreate}
          disabled={!selectedPeriode || selectedEleves.length === 0 || creating}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          <Plus size={18} />
          {creating ? "Création en cours..." : `Créer les bulletins (${selectedEleves.length})`}
        </button>
      </div>

      {/* Résultat */}
      {createResult && createResult.success.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle size={18} />
            <span>{createResult.success.length} bulletins créés</span>
            {createResult.errors.length > 0 && (
              <span className="text-orange-600 ml-2">({createResult.errors.length} erreurs)</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}