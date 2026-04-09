import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, CheckCircle, Filter, Search, X, Settings, ChevronDown, ChevronUp, Save, AlertCircle } from "lucide-react";
import useBulletins from "../../../hooks/bulletins/useBulletins";
import usePeriodes from "../../../hooks/periodes/usePeriodes";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import TabsHorizontalScrollable from "../../../components/ui/TabsHorizontalScrollable";
import useConfigBulletin from "../../../hooks/configBulletin/useConfigBulletin";
import { BaseConfigBulletin, ModeCalcule } from "../../../utils/types/base";

export default function GenerateCalculsPage() {
  const navigate = useNavigate();
  const { cycleSelectionne } = useEcoleNiveau();
  const { periodes } = usePeriodes();
  const { bulletins, generateMultiple, generateResult } = useBulletins({});
  const { config, saveConfig, saving } = useConfigBulletin();

  const [selectedPeriode, setSelectedPeriode] = useState("");
  const [selectedBulletins, setSelectedBulletins] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Filtres par statut
  const [statusFilter, setStatusFilter] = useState<"all" | "complet" | "incomplet" | "a_finaliser">("all");

  const [activeFilterTab, setActiveFilterTab] = useState<"niveaux" | "classes" | "tous">("tous");
  const [selectedNiveaux, setSelectedNiveaux] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  // Configuration
  const [showConfig, setShowConfig] = useState(false);
  const [configData, setConfigData] = useState<BaseConfigBulletin>({
    interrogation: { actif: true, mode: 'moyenne' },
    devoir: { actif: true, mode: 'conserver' },
    composition: { actif: true, mode: 'conserver' }
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // LOGIQUE DE SYNCHRONISATION : On ne synchronise que si config est chargé et qu'on n'a pas de modifs en cours
  useEffect(() => {
    if (config) {
      setConfigData({
        interrogation: {
          actif: config.interrogation?.actif ?? true,
          mode: config.interrogation?.mode ?? 'moyenne'
        },
        devoir: {
          actif: config.devoir?.actif ?? true,
          mode: config.devoir?.mode ?? 'conserver'
        },
        composition: {
          actif: config.composition?.actif ?? true,
          mode: config.composition?.mode ?? 'conserver'
        }
      });
      setHasUnsavedChanges(false);
    }
  }, [config]);

  const handleConfigChange = (type: keyof BaseConfigBulletin, field: string, value: any) => {
    setConfigData(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveConfig = async () => {
    try {
      console.log('configData' , configData)
      await saveConfig(configData);
      setHasUnsavedChanges(false);
      setMessage({ type: 'success', text: 'Configuration sauvegardée avec succès !' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Filtrer les bulletins selon les filtres
  const bulletinsFiltres = useMemo(() => {
    let filtered = bulletins;

    if (selectedPeriode) {
      filtered = filtered.filter(b => b.periodeId === selectedPeriode);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(b => b.status === statusFilter);
    }

    if (cycleSelectionne) {
      filtered = filtered.filter(b => b.eleve.cycle === cycleSelectionne);
    }

    if (activeFilterTab === "niveaux" && selectedNiveaux.length > 0) {
      filtered = filtered.filter(b => selectedNiveaux.includes(b.eleve.niveauClasse));
    }

    if (activeFilterTab === "classes" && selectedClasses.length > 0) {
      filtered = filtered.filter(b => selectedClasses.includes(b.eleve.classe));
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(b =>
        b.eleve.nom.toLowerCase().includes(term) ||
        b.eleve.prenom.toLowerCase().includes(term) ||
        b.eleve.matricule.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [bulletins, selectedPeriode, statusFilter, cycleSelectionne, activeFilterTab, selectedNiveaux, selectedClasses, searchTerm]);

  const niveauxUniques = useMemo(() => {
    return [...new Set(bulletins.map(b => b.eleve.niveauClasse).filter(Boolean))].sort();
  }, [bulletins]);

  const classesUniques = useMemo(() => {
    return [...new Set(bulletins.map(b => b.eleve.classe).filter(Boolean))].sort();
  }, [bulletins]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedBulletins([]);
    } else {
      setSelectedBulletins(bulletinsFiltres.map(b => b.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleBulletin = (id: string) => {
    setSelectedBulletins(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleNiveau = (niveau: string) => {
    setSelectedNiveaux(prev =>
      prev.includes(niveau) ? prev.filter(n => n !== niveau) : [...prev, niveau]
    );
    setSelectedBulletins([]);
    setSelectAll(false);
  };

  const toggleClasse = (classe: string) => {
    setSelectedClasses(prev =>
      prev.includes(classe) ? prev.filter(c => c !== classe) : [...prev, classe]
    );
    setSelectedBulletins([]);
    setSelectAll(false);
  };

  const handleGenerate = async () => {
    if (!selectedPeriode) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner une période' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (selectedBulletins.length === 0) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner au moins un bulletin' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setGenerating(true);
    try {
      const result = await generateMultiple(selectedPeriode, selectedBulletins, configData);

      if (result.success.length > 0) {
        setMessage({
          type: 'success',
          text: `Calculs terminés : ${result.success.length} bulletins traités avec succès`
        });
      } else {
        setMessage({ type: 'error', text: 'Aucun bulletin n\'a pu être traité' });
      }

      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors des calculs' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setGenerating(false);
    }
  };

  const getFilterInfo = () => {
    const parts = [];
    if (statusFilter !== "all") {
      parts.push(statusFilter === 'complet' ? 'Complets' : statusFilter === 'incomplet' ? 'Incomplets' : 'À finaliser');
    }
    if (activeFilterTab === "niveaux" && selectedNiveaux.length > 0) {
      parts.push(`Niveaux: ${selectedNiveaux.join(', ')}`);
    }
    if (activeFilterTab === "classes" && selectedClasses.length > 0) {
      parts.push(`Classes: ${selectedClasses.join(', ')}`);
    }
    return parts.length > 0 ? parts.join(' · ') : "Tous les bulletins";
  };

  const stats = useMemo(() => {
    const complets = bulletinsFiltres.filter(b => b.status === 'complet').length;
    const incomplets = bulletinsFiltres.filter(b => b.status === 'incomplet').length;
    const aFinaliser = bulletinsFiltres.filter(b => b.status === 'a_finaliser').length;
    return { complets, incomplets, aFinaliser, total: bulletinsFiltres.length };
  }, [bulletinsFiltres]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Génération des calculs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Calcule les moyennes et met à jour les statuts des bulletins
          </p>
        </div>
      </div>

      {message && (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
          message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
            'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
          {message.type === 'success' && <CheckCircle size={18} />}
          {message.type === 'error' && <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Section Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-primary" />
            <span className="font-semibold text-gray-800">Configuration du calcul des notes</span>
            {!config && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                Non configuré
              </span>
            )}
            {hasUnsavedChanges && (
              <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                Modifications non sauvegardées
              </span>
            )}
          </div>
          {showConfig ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {showConfig && (
          <div className="px-6 pb-6 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-800">Interrogations</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configData.interrogation.actif}
                      onChange={(e) => handleConfigChange('interrogation', 'actif', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                {configData.interrogation.actif && (
                  <div>
                    <label className="text-sm text-gray-600">Mode</label>
                    <select
                      value={configData.interrogation.mode}
                      onChange={(e) => handleConfigChange('interrogation', 'mode', e.target.value as ModeCalcule)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="moyenne">Moyenne des interrogations</option>
                      <option value="conserver">Conserver chaque note</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-800">Devoirs</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configData.devoir.actif}
                      onChange={(e) => handleConfigChange('devoir', 'actif', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                {configData.devoir.actif && (
                  <div>
                    <label className="text-sm text-gray-600">Mode</label>
                    <select
                      value={configData.devoir.mode}
                      onChange={(e) => handleConfigChange('devoir', 'mode', e.target.value as ModeCalcule)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="moyenne">Moyenne des devoirs</option>
                      <option value="conserver">Conserver chaque note</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-800">Compositions</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configData.composition.actif}
                      onChange={(e) => handleConfigChange('composition', 'actif', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                {configData.composition.actif && (
                  <div>
                    <label className="text-sm text-gray-600">Mode</label>
                    <select
                      value={configData.composition.mode}
                      onChange={(e) => handleConfigChange('composition', 'mode', e.target.value as ModeCalcule)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="moyenne">Moyenne des compositions</option>
                      <option value="conserver">Conserver chaque note</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveConfig}
                disabled={saving || !hasUnsavedChanges}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Sauvegarde..." : "Sauvegarder la configuration"}
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedPeriode && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <span className="text-sm text-blue-600">Total</span>
            <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <span className="text-sm text-green-600">Complets</span>
            <p className="text-2xl font-bold text-green-700">{stats.complets}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
            <span className="text-sm text-orange-600">Incomplets</span>
            <p className="text-2xl font-bold text-orange-700">{stats.incomplets}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <span className="text-sm text-yellow-600">À finaliser</span>
            <p className="text-2xl font-bold text-yellow-700">{stats.aFinaliser}</p>
          </div>
        </div>
      )}

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

      {selectedPeriode && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Filter size={18} className="text-primary" />
            2. Filtrer les bulletins
          </h2>

          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Statut</p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${statusFilter === "all"
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Tous
              </button>
              <button
                onClick={() => setStatusFilter("complet")}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${statusFilter === "complet"
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Complets
              </button>
              <button
                onClick={() => setStatusFilter("incomplet")}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${statusFilter === "incomplet"
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Incomplets
              </button>
              <button
                onClick={() => setStatusFilter("a_finaliser")}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${statusFilter === "a_finaliser"
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                À finaliser
              </button>
            </div>
          </div>

          <div className="mb-6">
            <TabsHorizontalScrollable
              tabs={[
                { id: "tous", label: "Tous", count: stats.total },
                { id: "niveaux", label: "Par niveau", count: niveauxUniques.length },
                { id: "classes", label: "Par classe", count: classesUniques.length }
              ]}
              activeTab={activeFilterTab}
              onTabChange={(tab) => {
                setActiveFilterTab(tab as "niveaux" | "classes" | "tous");
                setSelectedNiveaux([]);
                setSelectedClasses([]);
                setSelectedBulletins([]);
                setSelectAll(false);
              }}
            />
          </div>

          {activeFilterTab === "niveaux" && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Cliquez sur les niveaux :</p>
              <div className="flex flex-wrap gap-2">
                {niveauxUniques.map(niveau => (
                  <button
                    key={niveau}
                    onClick={() => toggleNiveau(niveau)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${selectedNiveaux.includes(niveau)
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

          {activeFilterTab === "classes" && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Cliquez sur les classes :</p>
              <div className="flex flex-wrap gap-2">
                {classesUniques.map(classe => (
                  <button
                    key={classe}
                    onClick={() => toggleClasse(classe)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${selectedClasses.includes(classe)
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

          {cycleSelectionne && (
            <div className="mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Cycle: {cycleSelectionne}
              </span>
            </div>
          )}

          {(selectedNiveaux.length > 0 || selectedClasses.length > 0 || statusFilter !== "all") && (
            <div className="flex flex-wrap gap-2 mb-4">
              {statusFilter !== "all" && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs flex items-center gap-1">
                  Statut: {statusFilter === 'complet' ? 'Complets' : statusFilter === 'incomplet' ? 'Incomplets' : 'À finaliser'}
                  <button onClick={() => setStatusFilter("all")} className="hover:text-purple-900">
                    <X size={12} />
                  </button>
                </span>
              )}
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
            Filtres : <span className="font-medium text-primary">{getFilterInfo()}</span> · <strong>{bulletinsFiltres.length}</strong> bulletin(s) trouvé(s)
          </p>

          <div className="relative mb-4">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un élève..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-primary rounded"
                />
                <span className="text-sm font-medium">Tous les bulletins ({bulletinsFiltres.length})</span>
              </label>
              <span className="text-sm text-gray-500">{selectedBulletins.length} sélectionné(s)</span>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {bulletinsFiltres.map(bulletin => (
                <div key={bulletin.id} className="px-4 py-3 border-b hover:bg-gray-50 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedBulletins.includes(bulletin.id)}
                    onChange={() => toggleBulletin(bulletin.id)}
                    className="w-4 h-4 text-primary rounded mr-3"
                  />
                  <div>
                    <p className="font-medium">{bulletin.eleve.prenom} {bulletin.eleve.nom}</p>
                    <p className="text-xs text-gray-500">
                      {bulletin.eleve.matricule} - {bulletin.eleve.classe} - {bulletin.periode}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className={`px-2 py-1 rounded-full text-xs ${bulletin.status === 'complet' ? 'bg-green-100 text-green-700' :
                      bulletin.status === 'incomplet' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                      {bulletin.status === 'complet' ? 'Complet' :
                        bulletin.status === 'incomplet' ? 'Incomplet' : 'À finaliser'}
                    </span>
                  </div>
                </div>
              ))}
              {bulletinsFiltres.length === 0 && (
                <div className="text-center py-8 text-gray-500">Aucun bulletin trouvé</div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedPeriode && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">3. Lancer les calculs</h2>
          <p className="text-sm text-gray-500 mb-4">
            Calcule les moyennes pour <strong>{selectedBulletins.length}</strong> bulletin(s) sélectionné(s).
          </p>

          <button
            onClick={handleGenerate}
            disabled={!selectedPeriode || selectedBulletins.length === 0 || generating}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <RefreshCw size={18} />
            {generating ? "Calcul en cours..." : `Lancer les calculs (${selectedBulletins.length})`}
          </button>

          {generateResult && generateResult.success.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <CheckCircle size={18} />
                <span>Calculs terminés</span>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-green-700">Succès: {generateResult.success.length}</span>
                {generateResult.errors.length > 0 && (
                  <span className="text-red-600">Échecs: {generateResult.errors.length}</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}