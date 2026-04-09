// src/pages/admin/configurations/ConfigBulletinPage.tsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Save, ArrowLeft, Info, Settings, 
  CheckCircle, AlertTriangle,
  School, Filter
} from "lucide-react";
import useConfigBulletin from "../../../hooks/configBulletin/useConfigBulletin";
import usePeriodes from "../../../hooks/periodes/usePeriodes";
import useClasses from "../../../hooks/classes/useClasses";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import { ModeCalcule } from "../../../utils/types/base";

export default function ConfigBulletinPage() {
  const navigate = useNavigate();
  const { niveauSelectionne, cycleSelectionne, niveauClasseSelectionne } = useEcoleNiveau();
  const { periodes } = usePeriodes();
  const { classes } = useClasses();
  const { 
    loading, 
    createResult, 
    createConfig, 
    resetCreateResult,
    loadConfigs 
  } = useConfigBulletin({ autoLoad: true });

  const [selectedPeriodes, setSelectedPeriodes] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [configData, setConfigData] = useState({
    interrogation: { actif: true, mode: 'moyenne' as ModeCalcule, coefficient: 1 },
    devoir: { actif: true, mode: 'conserver' as ModeCalcule, coefficient: 1 },
    composition: { actif: true, mode: 'conserver' as ModeCalcule, coefficient: 1 }
  });

  // Filtrer les classes selon les filtres globaux
  const classesFiltrees = useMemo(() => {
    return classes.filter(c => {
      const matchesNiveau = niveauSelectionne ? c.niveauScolaire === niveauSelectionne : true;
      const matchesCycle = cycleSelectionne ? c.cycle === cycleSelectionne : true;
      const matchesNiveauClasse = niveauClasseSelectionne ? c.niveauClasse === niveauClasseSelectionne : true;
      return matchesNiveau && matchesCycle && matchesNiveauClasse;
    });
  }, [classes, niveauSelectionne, cycleSelectionne, niveauClasseSelectionne]);

  const isAllSelected = classesFiltrees.length > 0 && 
    classesFiltrees.every(c => selectedClasses.includes(c.id));

  const handleSelectAllClasses = (checked: boolean) => {
    const filteredIds = classesFiltrees.map(c => c.id);
    if (checked) {
      setSelectedClasses(prev => Array.from(new Set([...prev, ...filteredIds])));
    } else {
      setSelectedClasses(prev => prev.filter(id => !filteredIds.includes(id)));
    }
  };

  const toggleClasse = (classeId: string) => {
    setSelectedClasses(prev => 
      prev.includes(classeId) 
        ? prev.filter(id => id !== classeId) 
        : [...prev, classeId]
    );
  };

  const handleSelectAllPeriodes = () => {
    if (selectedPeriodes.length === periodes.length) {
      setSelectedPeriodes([]);
    } else {
      setSelectedPeriodes(periodes.map(p => p.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPeriodes.length === 0) {
      alert("Veuillez sélectionner au moins une période");
      return;
    }

    if (selectedClasses.length === 0) {
      alert("Veuillez sélectionner au moins une classe");
      return;
    }

    const payload = {
      classeIds: selectedClasses,
      periodesId: selectedPeriodes,
      types: configData
    };

    await createConfig(payload);
    setShowResult(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-800">Configuration des bulletins</h1>
          <p className="text-sm text-gray-500 mt-1">
            Définissez comment les notes seront calculées dans les bulletins
          </p>
        </div>
      </div>

      {/* Filtres actuels */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Filter size={16} className="text-primary" />
          <span className="text-sm font-medium text-gray-700">Filtres actifs :</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {niveauSelectionne && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
              Niveau: {niveauSelectionne}
            </span>
          )}
          {cycleSelectionne && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
              Cycle: {cycleSelectionne}
            </span>
          )}
          {niveauClasseSelectionne && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
              Niveau classe: {niveauClasseSelectionne}
            </span>
          )}
          {!niveauSelectionne && !cycleSelectionne && !niveauClasseSelectionne && (
            <span className="text-sm text-gray-500">Toutes les classes</span>
          )}
        </div>
      </div>

      {/* Message d'info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
        <div className="text-sm text-blue-700">
          <p className="font-medium mb-1">Comment ça fonctionne ?</p>
          <p>
            Utilisez les filtres en haut de l'écran pour restreindre la liste des classes.
            Ensuite, sélectionnez les classes et périodes concernées par cette configuration.
          </p>
        </div>
      </div>

      {/* Sélection des classes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <School size={18} className="text-primary" />
          Classes concernées
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAllClasses(e.target.checked)}
                  className="w-4 h-4 text-primary rounded"
                />
                <span className="text-sm text-gray-700 font-medium">Toutes les classes filtrées</span>
              </label>
              <span className="text-sm text-gray-500">
                {selectedClasses.length} sélectionnée(s) sur {classesFiltrees.length}
              </span>
            </div>
          </div>

          <div className="border rounded-lg max-h-60 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Sél.</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Classe</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Niveau</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Cycle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {classesFiltrees.map((classe) => (
                  <tr key={classe.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedClasses.includes(classe.id)}
                        onChange={() => toggleClasse(classe.id)}
                        className="w-4 h-4 text-primary rounded cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-2 font-medium">{classe.nom}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{classe.niveauClasse}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{classe.cycle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sélection des périodes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Settings size={18} className="text-primary" />
          Périodes concernées
        </h2>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleSelectAllPeriodes}
              className="text-sm text-primary hover:underline"
            >
              {selectedPeriodes.length === periodes.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </button>
            <span className="text-sm text-gray-500">
              {selectedPeriodes.length} période(s) sélectionnée(s)
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {periodes.map((periode) => (
              <label
                key={periode.id}
                className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedPeriodes.includes(periode.id)
                    ? 'bg-primary/5 border-primary'
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedPeriodes.includes(periode.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPeriodes([...selectedPeriodes, periode.id]);
                    } else {
                      setSelectedPeriodes(selectedPeriodes.filter(id => id !== periode.id));
                    }
                  }}
                  className="w-4 h-4 text-primary rounded"
                />
                <span className="text-sm font-medium">{periode.nom}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Configuration des types d'évaluation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Types d'évaluation</h2>

        <div className="space-y-6">
          {/* Interrogations */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={configData.interrogation.actif}
                  onChange={(e) => setConfigData({
                    ...configData,
                    interrogation: { ...configData.interrogation, actif: e.target.checked }
                  })}
                  className="w-4 h-4 text-primary rounded"
                />
                <h3 className="font-medium text-gray-800">Interrogations</h3>
              </div>
            </div>

            {configData.interrogation.actif && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mode de calcul
                  </label>
                  <select
                    value={configData.interrogation.mode}
                    onChange={(e) => setConfigData({
                      ...configData,
                      interrogation: { 
                        ...configData.interrogation, 
                        mode: e.target.value as ModeCalcule 
                      }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="moyenne">Moyenne des interrogations</option>
                    <option value="conserver">Conserver chaque note</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coefficient
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={configData.interrogation.coefficient}
                    onChange={(e) => setConfigData({
                      ...configData,
                      interrogation: { 
                        ...configData.interrogation, 
                        coefficient: parseInt(e.target.value) || 1 
                      }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Devoirs */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={configData.devoir.actif}
                  onChange={(e) => setConfigData({
                    ...configData,
                    devoir: { ...configData.devoir, actif: e.target.checked }
                  })}
                  className="w-4 h-4 text-primary rounded"
                />
                <h3 className="font-medium text-gray-800">Devoirs</h3>
              </div>
            </div>

            {configData.devoir.actif && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mode de calcul
                  </label>
                  <select
                    value={configData.devoir.mode}
                    onChange={(e) => setConfigData({
                      ...configData,
                      devoir: { 
                        ...configData.devoir, 
                        mode: e.target.value as ModeCalcule 
                      }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="moyenne">Moyenne des devoirs</option>
                    <option value="conserver">Conserver chaque note</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coefficient
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={configData.devoir.coefficient}
                    onChange={(e) => setConfigData({
                      ...configData,
                      devoir: { 
                        ...configData.devoir, 
                        coefficient: parseInt(e.target.value) || 1 
                      }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Compositions */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={configData.composition.actif}
                  onChange={(e) => setConfigData({
                    ...configData,
                    composition: { ...configData.composition, actif: e.target.checked }
                  })}
                  className="w-4 h-4 text-primary rounded"
                />
                <h3 className="font-medium text-gray-800">Compositions</h3>
              </div>
            </div>

            {configData.composition.actif && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mode de calcul
                  </label>
                  <select
                    value={configData.composition.mode}
                    onChange={(e) => setConfigData({
                      ...configData,
                      composition: { 
                        ...configData.composition, 
                        mode: e.target.value as ModeCalcule 
                      }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="moyenne">Moyenne des compositions</option>
                    <option value="conserver">Conserver chaque note</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coefficient
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={configData.composition.coefficient}
                    onChange={(e) => setConfigData({
                      ...configData,
                      composition: { 
                        ...configData.composition, 
                        coefficient: parseInt(e.target.value) || 1 
                      }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bouton de validation */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading || selectedClasses.length === 0 || selectedPeriodes.length === 0}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          <Save size={18} />
          {loading ? "Enregistrement..." : "Enregistrer la configuration"}
        </button>
      </div>

   
    </div>
  );
}