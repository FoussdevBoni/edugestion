import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, CheckCircle, Filter, Search, X, Settings, ChevronDown, ChevronUp, Save, AlertCircle, Users, BookOpen, GraduationCap } from "lucide-react";
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

  const [statusFilter, setStatusFilter] = useState<"all" | "complet" | "incomplet" | "a_finaliser">("all");
  const [activeFilterTab, setActiveFilterTab] = useState<"niveaux" | "classes" | "tous">("tous");
  const [selectedNiveaux, setSelectedNiveaux] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  const [showConfig, setShowConfig] = useState(false);
  const [configData, setConfigData] = useState<BaseConfigBulletin>({
    interrogation: { actif: true, mode: 'moyenne' },
    devoir: { actif: true, mode: 'conserver' },
    composition: { actif: true, mode: 'conserver' }
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
      await saveConfig(configData);
      setHasUnsavedChanges(false);
      setMessage({ type: 'success', text: 'Configuration sauvegardée avec succès !' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const bulletinsFiltres = useMemo(() => {
    let filtered = bulletins;

    if (selectedPeriode) {
      filtered = filtered.filter(b => b.periodeId === selectedPeriode);
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter(b => b.status === statusFilter);
    }
    if (cycleSelectionne) {
      filtered = filtered.filter(b => b.eleve?.cycle === cycleSelectionne);
    }
    if (activeFilterTab === "niveaux" && selectedNiveaux.length > 0) {
      filtered = filtered.filter(b => selectedNiveaux.includes(b.eleve?.niveauClasse));
    }
    if (activeFilterTab === "classes" && selectedClasses.length > 0) {
      filtered = filtered.filter(b => selectedClasses.includes(b.eleve?.classe));
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(b =>
        b.eleve?.nom?.toLowerCase().includes(term) ||
        b.eleve?.prenom?.toLowerCase().includes(term) ||
        b.eleve?.matricule?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [bulletins, selectedPeriode, statusFilter, cycleSelectionne, activeFilterTab, selectedNiveaux, selectedClasses, searchTerm]);

  const niveauxUniques = useMemo(() => {
    return [...new Set(bulletins.map(b => b.eleve?.niveauClasse).filter(Boolean))].sort();
  }, [bulletins]);

  const classesUniques = useMemo(() => {
    return [...new Set(bulletins.map(b => b.eleve?.classe).filter(Boolean))].sort();
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
        setMessage({ type: 'success', text: `Calculs terminés : ${result.success.length} bulletins traités avec succès` });
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
    <div className="space-y-6 pb-8">
      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Génération des calculs</h1>
          <p className="text-sm text-gray-500 mt-1">
            Calcule les moyennes et met à jour les statuts des bulletins
          </p>
        </div>
      </div>

      {/* Message flottant */}
      {message && (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg animate-slide-in-right ${message.type === 'success' ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200' :
          message.type === 'error' ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200' :
            'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200'
          }`}>
          {message.type === 'success' && <CheckCircle size={18} />}
          {message.type === 'error' && <AlertCircle size={18} />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* Section Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings size={18} className="text-primary" />
            </div>
            <span className="font-semibold text-gray-800">Configuration du calcul des notes</span>
            {!config && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                Non configuré
              </span>
            )}
            {hasUnsavedChanges && (
              <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full animate-pulse">
                Modifications non sauvegardées
              </span>
            )}
          </div>
          {showConfig ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
        </button>

        {showConfig && (
          <div className="px-6 pb-6 border-t pt-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { type: 'interrogation', title: 'Interrogations', color: 'blue' },
                { type: 'devoir', title: 'Devoirs', color: 'green' },
                { type: 'composition', title: 'Compositions', color: 'purple' }
              ].map((item, idx) => (
                <div key={item.type} className={`border-2 rounded-xl p-4 transition-all duration-300 hover:shadow-md animate-fade-in-up`} style={{ animationDelay: `${200 + idx * 100}ms` }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">{item.title}</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configData[item.type as keyof BaseConfigBulletin].actif}
                        onChange={(e) => handleConfigChange(item.type as keyof BaseConfigBulletin, 'actif', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  {configData[item.type as keyof BaseConfigBulletin].actif && (
                    <div>
                      <label className="text-sm text-gray-600">Mode de calcul</label>
                      <select
                        value={configData[item.type as keyof BaseConfigBulletin].mode}
                        onChange={(e) => handleConfigChange(item.type as keyof BaseConfigBulletin, 'mode', e.target.value as ModeCalcule)}
                        className="w-full mt-2 px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200"
                      >
                        <option value="moyenne">Moyenne des {item.title.toLowerCase()}</option>
                        <option value="conserver">Conserver chaque note</option>
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSaveConfig}
                disabled={saving || !hasUnsavedChanges}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? "Sauvegarde..." : "Sauvegarder la configuration"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Statistiques (si période sélectionnée) */}
      {selectedPeriode && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Total</p>
                <p className="text-3xl font-bold text-blue-800 mt-1">{stats.total}</p>
              </div>
              <div className="p-2 bg-white/50 rounded-xl">
                <Users size={20} className="text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-green-700 uppercase tracking-wider">Complets</p>
                <p className="text-3xl font-bold text-green-800 mt-1">{stats.complets}</p>
              </div>
              <div className="p-2 bg-white/50 rounded-xl">
                <CheckCircle size={20} className="text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider">Incomplets</p>
                <p className="text-3xl font-bold text-orange-800 mt-1">{stats.incomplets}</p>
              </div>
              <div className="p-2 bg-white/50 rounded-xl">
                <AlertCircle size={20} className="text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wider">À finaliser</p>
                <p className="text-3xl font-bold text-yellow-800 mt-1">{stats.aFinaliser}</p>
              </div>
              <div className="p-2 bg-white/50 rounded-xl">
                <GraduationCap size={20} className="text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sélection période */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-primary rounded-full"></div>
          1. Sélectionner une période
        </h2>
        <select
          value={selectedPeriode}
          onChange={(e) => setSelectedPeriode(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200 bg-white"
        >
          <option value="">Choisir une période</option>
          {periodes.map(p => (
            <option key={p.id} value={p.id}>{p.nom}</option>
          ))}
        </select>
      </div>

      {/* Filtres et sélection */}
      {selectedPeriode && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            <Filter size={18} className="text-primary" />
            2. Filtrer les bulletins
          </h2>

          {/* Filtre statut */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Statut</p>
            <div className="flex gap-2 flex-wrap">
              {[
                { id: "all", label: "Tous", color: "gray" },
                { id: "complet", label: "Complets", color: "green" },
                { id: "incomplet", label: "Incomplets", color: "orange" },
                { id: "a_finaliser", label: "À finaliser", color: "yellow" }
              ].map(btn => (
                <button
                  key={btn.id}
                  onClick={() => setStatusFilter(btn.id as any)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${statusFilter === btn.id
                      ? `bg-${btn.color}-600 text-white shadow-md`
                      : `bg-gray-100 text-gray-700 hover:bg-gray-200`
                    }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs filtres */}
          <div className="mb-6">
            <TabsHorizontalScrollable
              tabs={[
                { id: "tous", label: "Tous", count: stats.total },
                { id: "niveaux", label: "Par niveau", count: niveauxUniques.length },
                { id: "classes", label: "Par classe", count: classesUniques.length }
              ]}
              activeTab={activeFilterTab}
              onTabChange={(tab) => {
                setActiveFilterTab(tab as any);
                setSelectedNiveaux([]);
                setSelectedClasses([]);
                setSelectedBulletins([]);
                setSelectAll(false);
              }}
            />
          </div>

          {/* Filtres par niveau */}
          {activeFilterTab === "niveaux" && niveauxUniques.length > 0 && (
            <div className="mb-4 animate-fade-in">
              <p className="text-sm text-gray-600 mb-2">Cliquez sur les niveaux :</p>
              <div className="flex flex-wrap gap-2">
                {niveauxUniques.map(niveau => (
                  <button
                    key={niveau}
                    onClick={() => toggleNiveau(niveau)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedNiveaux.includes(niveau)
                        ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {niveau}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filtres par classe */}
          {activeFilterTab === "classes" && classesUniques.length > 0 && (
            <div className="mb-4 animate-fade-in">
              <p className="text-sm text-gray-600 mb-2">Cliquez sur les classes :</p>
              <div className="flex flex-wrap gap-2">
                {classesUniques.map(classe => (
                  <button
                    key={classe}
                    onClick={() => toggleClasse(classe)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedClasses.includes(classe)
                        ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {classe}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filtres actifs */}
          {(selectedNiveaux.length > 0 || selectedClasses.length > 0 || statusFilter !== "all") && (
            <div className="flex flex-wrap gap-2 mb-4 animate-fade-in">
              {statusFilter !== "all" && (
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs flex items-center gap-1">
                  Statut: {statusFilter === 'complet' ? 'Complets' : statusFilter === 'incomplet' ? 'Incomplets' : 'À finaliser'}
                  <button onClick={() => setStatusFilter("all")} className="hover:text-purple-900">
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedNiveaux.map(niveau => (
                <span key={niveau} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1">
                  Niveau: {niveau}
                  <button onClick={() => toggleNiveau(niveau)} className="hover:text-blue-900">
                    <X size={12} />
                  </button>
                </span>
              ))}
              {selectedClasses.map(classe => (
                <span key={classe} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
                  Classe: {classe}
                  <button onClick={() => toggleClasse(classe)} className="hover:text-green-900">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <p className="text-sm text-gray-600 mb-4">
            Filtres : <span className="font-medium text-primary">{getFilterInfo()}</span> · <strong className="text-gray-800">{bulletinsFiltres.length}</strong> bulletin(s) trouvé(s)
          </p>

          {/* Recherche */}
          <div className="relative mb-4">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un élève..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200"
            />
          </div>

          {/* Liste des bulletins */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary/20"
                />
                <span className="text-sm font-medium text-gray-700">Tous les bulletins ({bulletinsFiltres.length})</span>
              </label>
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">{selectedBulletins.length} sélectionné(s)</span>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
              {bulletinsFiltres.map((bulletin, idx) => (
                <div key={bulletin.id} className={`px-4 py-3 hover:bg-gray-50 transition-colors duration-200 animate-fade-in-up`} style={{ animationDelay: `${600 + idx * 20}ms` }}>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBulletins.includes(bulletin.id)}
                      onChange={() => toggleBulletin(bulletin.id)}
                      className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary/20 mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{bulletin.eleve?.prenom} {bulletin.eleve?.nom}</p>
                      <p className="text-xs text-gray-500">
                        {bulletin.eleve?.matricule} - {bulletin.eleve?.classe} - {bulletin.periode}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bulletin.status === 'complet' ? 'bg-green-100 text-green-700' :
                          bulletin.status === 'incomplet' ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                        }`}>
                        {bulletin.status === 'complet' ? 'Complet' :
                          bulletin.status === 'incomplet' ? 'Incomplet' : 'À finaliser'}
                      </span>
                    </div>
                  </label>
                </div>
              ))}
              {bulletinsFiltres.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <AlertCircle size={32} className="mx-auto mb-2 text-gray-400" />
                  Aucun bulletin trouvé
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lancer les calculs */}
      {selectedPeriode && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '700ms' }}>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            3. Lancer les calculs
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Calcule les moyennes pour <strong className="text-primary">{selectedBulletins.length}</strong> bulletin(s) sélectionné(s).
          </p>

          <button
            onClick={handleGenerate}
            disabled={!selectedPeriode || selectedBulletins.length === 0 || generating}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          >
            <RefreshCw size={18} className={generating ? "animate-spin" : ""} />
            {generating ? "Calcul en cours..." : `Lancer les calculs (${selectedBulletins.length})`}
          </button>

          {generateResult && generateResult.success.length > 0 && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl animate-fade-in">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <CheckCircle size={18} />
                <span className="font-medium">Calculs terminés</span>
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

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
          opacity: 0;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}