import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Search,
  ChevronRight, Info,
  Trash2, History, CheckCircle2, GraduationCap, School
} from 'lucide-react';
import { useEcoleNiveau } from '../../../hooks/filters/useEcoleNiveau';
import useClasses from '../../../hooks/classes/useClasses';
import useEleves from '../../../hooks/eleves/useEleves';
import { alertError, alertServerError, alertSuccess } from '../../../helpers/alertError';
import useEcoleInfos from '../../../hooks/ecoleInfos/useEcoleInfos';

// Type pour l'historique de session
interface ActionHistory {
  classeSource: string;
  classeCible: string | 'SORTIE';
  nombre: number;
  type: 'REINSCRIPTION' | 'SORTIE_SIMPLE' | 'FIN_CYCLE';
}

export default function ReinscriptionPage() {
  const navigate = useNavigate();
  const { cycleSelectionne, niveauSelectionne } = useEcoleNiveau();
  const { classes } = useClasses();
  const { eleves, reinscrireEleves, desactiverEleves } = useEleves();
  const { ecoleInfos, updateEcoleInfos } = useEcoleInfos();

  // États locaux
  const [nouvelleAnnee, setNouvelleAnnee] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClasseSource, setSelectedClasseSource] = useState('');
  const [selectedClasseCible, setSelectedClasseCible] = useState('');
  const [selectedEleves, setSelectedEleves] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [historique, setHistorique] = useState<ActionHistory[]>([]);

  // Initialiser l'année scolaire locale quand les infos arrivent
  useEffect(() => {
    if (ecoleInfos?.anneeScolaire) {
      setNouvelleAnnee(ecoleInfos.anneeScolaire);
    }
  }, [ecoleInfos]);

  // Classes filtrées selon le cycle et le niveau
  const classesFiltrees = classes.filter(classe => {
    const matchesNiveau = niveauSelectionne ? classe.niveauScolaire === niveauSelectionne : true;
    const matchesCycle = cycleSelectionne ? classe.cycle === cycleSelectionne : true;
    return matchesNiveau && matchesCycle;
  }).sort((a, b) => a.nom.localeCompare(b.nom));

  const effectifParClasse = eleves.reduce((acc, eleve) => {
    acc[eleve.classeId] = (acc[eleve.classeId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const elevesDeLaClasse = eleves.filter(e => e.classeId === selectedClasseSource);
  const elevesFiltres = elevesDeLaClasse.filter(eleve =>
    `${eleve.prenom} ${eleve.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eleve.matricule?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- LOGIQUE DE SELECTION ---
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEleves(new Set(elevesFiltres.map(e => e.id)));
    } else {
      setSelectedEleves(new Set());
    }
  };

  const toggleEleve = (eleveId: string) => {
    setSelectedEleves(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eleveId)) newSet.delete(eleveId);
      else newSet.add(eleveId);
      return newSet;
    });
  };

  // --- ACTIONS ---

  const handleUpdateAnnee = async () => {
    try {
      await updateEcoleInfos({ anneeScolaire: nouvelleAnnee });
      alertSuccess('Année scolaire mise à jour');
    } catch (e) { alertServerError(e); }
  };

  /**
   * CAS 2 : Changement d'école
   * On désactive les sélectionnés, mais on ne touche ABSOLUMENT PAS au reste.
   */
  const handleSortieSimple = async () => {
    if (selectedEleves.size === 0) return alertError('Sélectionnez les élèves qui quittent');
    if (!window.confirm(`Confirmer la sortie de ${selectedEleves.size} élèves pour changement d'école ?`)) return;

    setIsSubmitting(true);
    try {
      const ids = Array.from(selectedEleves);
      await desactiverEleves(ids);

      const sourceNom = classes.find(c => c.id === selectedClasseSource)?.nom || '';
      setHistorique(prev => [{
        classeSource: sourceNom,
        classeCible: 'SORTIE',
        nombre: ids.length,
        type: 'SORTIE_SIMPLE'
      }, ...prev]);

      setSelectedEleves(new Set());
      alertSuccess('Sorties effectuées. Le reste de la classe reste inchangé.');
    } catch (e) { alertServerError(e); }
    finally { setIsSubmitting(false); }
  };

  /**
   * CAS 1 : Fin de Cycle (BAC / Diplôme)
   * On désactive les diplômés sélectionnés, et on réinscrit le RESTE comme redoublants.
   */
  const handleFinCycle = async () => {
    if (selectedEleves.size === 0) return alertError('Sélectionnez les élèves diplômés');
    if (!window.confirm(`Action Fin de Cycle : Les diplômés seront sortis et TOUT le reste sera réinscrit comme redoublant. Confirmer ?`)) return;

    setIsSubmitting(true);
    try {
      const diplomesIds = Array.from(selectedEleves);
      const restants = elevesDeLaClasse.filter(e => !selectedEleves.has(e.id));

      // 1. Sortie des bacheliers
      await desactiverEleves(diplomesIds);

      // 2. Réinscription automatique des restants en Redoublant
      if (restants.length > 0) {
        await reinscrireEleves(restants, selectedClasseSource, nouvelleAnnee, "Redoublant");
      }

      const sourceNom = classes.find(c => c.id === selectedClasseSource)?.nom || '';
      setHistorique(prev => [{
        classeSource: sourceNom,
        classeCible: 'SORTIE',
        nombre: diplomesIds.length,
        type: 'FIN_CYCLE'
      }, ...prev]);

      setSelectedEleves(new Set());
      alertSuccess('Traitement fin de cycle terminé.');
    } catch (e) { alertServerError(e); }
    finally { setIsSubmitting(false); }
  };

  /**
   * ACTION 3 : Passage de classe
   * Sélectionnés = Admis (Nouveau dans cible). Reste = Redoublant (dans source).
   */
  const handleReinscrire = async () => {
    if (nouvelleAnnee !== ecoleInfos?.anneeScolaire) {
      alertError("Veuillez modifier l'année scolaire d'abord");
      return;
    }
    if (!selectedClasseCible) return alertError('Sélectionnez une classe cible');
    if (selectedEleves.size === 0) return alertError('Sélectionnez les élèves admis');

    setIsSubmitting(true);
    try {
      const admis = elevesDeLaClasse.filter(e => selectedEleves.has(e.id));
      const redoublants = elevesDeLaClasse.filter(e => !selectedEleves.has(e.id));

      // Passage des admis
           await reinscrireEleves(admis, selectedClasseCible, nouvelleAnnee, "Nouveau");

      // Redoublement auto des autres
      if (redoublants.length > 0) {
        await reinscrireEleves(redoublants, selectedClasseSource, nouvelleAnnee, "Redoublant");
      }

      const sourceNom = classes.find(c => c.id === selectedClasseSource)?.nom || '';
      const cibleNom = classes.find(c => c.id === selectedClasseCible)?.nom || '';

      setHistorique(prev => [{
        classeSource: sourceNom,
        classeCible: cibleNom,
        nombre: admis.length,
        type: 'REINSCRIPTION'
      }, ...prev]);

      setSelectedEleves(new Set());
      alertSuccess('Réinscription et passage effectués !');
    } catch (error) { alertServerError(error); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* HEADER & ANNÉE SCOLAIRE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/eleves')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Réinscription & Passage</h1>
            <p className="text-sm text-gray-500">Gérez la transition vers la nouvelle année scolaire</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-primary/5 p-2 rounded-lg border border-primary/10">
          <span className="text-sm font-medium text-primary px-2">Année Scolaire :</span>
          <input
            type="text"
            value={nouvelleAnnee}
            onChange={(e) => setNouvelleAnnee(e.target.value)}
            className="w-32 px-2 py-1 border rounded bg-white text-sm focus:ring-2 focus:ring-primary"
          />
          <button onClick={handleUpdateAnnee} className="p-1.5 bg-primary text-white rounded hover:bg-primary/90 shadow-sm">
            <Save size={16} />
          </button>
        </div>
      </div>

      {/* MESSAGE INFOS - TON DESIGN EXACT */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg flex gap-3">
        <Info className="text-blue-500 shrink-0" size={24} />
        <div className="text-sm text-blue-800">
          <p className="font-bold">Instructions importantes :</p>
          <p>1. <b>Sortie :</b> Gérez d'abord les départs via les boutons de désactivation.</p>
          <p className="font-semibold text-red-700 underline mt-1">
            2. <b>CAS 1 (Fin Cycle) :</b> Les élèves restants après la sortie des diplômés sont considérés comme REDOUBLANTS.
          </p>
          <p className="font-semibold text-red-700 underline">
            2. <b>CAS 2 (Sortie Simple) :</b> Si un élève change d'école, le reste n'est pas réinscrit automatiquement.
          </p>
          <p className="mt-1">
            3. <b>Réinscrire :</b> Les sélectionnés passent en classe supérieure, le reste est réinscrit en Redoublant.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* SÉLECTION CLASSES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Classe Source (Actuelle)</label>
              <select
                value={selectedClasseSource}
                onChange={(e) => setSelectedClasseSource(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="">-- Choisir la source --</option>
                {classesFiltrees.map(c => (
                  <option key={c.id} value={c.id}>{c.nom} ({effectifParClasse[c.id] || 0} él.)</option>
                ))}
              </select>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Classe Cible (Destination)</label>
              <select
                value={selectedClasseCible}
                onChange={(e) => setSelectedClasseCible(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="">-- Choisir la cible --</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.nom} - {c.niveauClasse}</option>
                ))}
              </select>
            </div>
          </div>

          {/* LISTE ÉLÈVES */}
          {selectedClasseSource && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex flex-wrap items-center justify-between gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={18} />
                  </span>
                  <input
                    type="text" placeholder="Rechercher..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={selectedEleves.size === elevesFiltres.length && elevesFiltres.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded text-primary"
                  />
                  <span className="text-sm font-medium">Tout sélectionner</span>
                </label>
              </div>

              <div className="divide-y max-h-[400px] overflow-y-auto">
                {elevesFiltres.map(eleve => (
                  <div
                    key={eleve.id}
                    onClick={() => toggleEleve(eleve.id)}
                    className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedEleves.has(eleve.id) ? 'bg-primary/5' : ''}`}
                  >
                    <input
                      type="checkbox" readOnly
                      checked={selectedEleves.has(eleve.id)}
                      className="w-4 h-4 rounded text-primary mr-4"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{eleve.prenom} {eleve.nom}</p>
                      <p className="text-xs text-gray-500">{eleve.matricule || 'Sans matricule'}</p>
                    </div>
                    <div className="text-right text-xs text-gray-400 uppercase font-bold">{eleve.sexe}</div>
                  </div>
                ))}
              </div>

              {/* BARRE D'ACTIONS FIXE - SÉPARATION DES CAS */}
              <div className="p-4 bg-gray-50 border-t flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={isSubmitting || selectedEleves.size === 0}
                    onClick={handleSortieSimple}
                    className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 text-xs font-bold"
                    title="L'élève change d'établissement"
                  >
                    <School size={16} /> Changement École
                  </button>
                  <button
                    disabled={isSubmitting || selectedEleves.size === 0}
                    onClick={handleFinCycle}
                    className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 text-xs font-bold"
                    title="Obtention diplôme (BAC) : Réinscrit le reste en redoublant"
                  >
                    <GraduationCap size={16} /> Fin Cycle (Diplôme)
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="hidden sm:inline text-sm font-bold text-gray-600">{selectedEleves.size} sélectionné(s)</span>
                  <button
                    disabled={isSubmitting || selectedEleves.size === 0 || !selectedClasseCible}
                    onClick={handleReinscrire}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 shadow-md transition-all font-bold"
                  >
                    {isSubmitting ? 'Traitement...' : 'Réinscrire'} <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* COLONNE HISTORIQUE */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <History size={20} className="text-gray-400" />
              Classes déjà gérées
            </h3>

            <div className="space-y-3">
              {historique.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-lg">
                  <p className="text-sm text-gray-400 italic">Aucune classe traitée dans cette session</p>
                </div>
              ) : (
                historique.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-lg">
                    <CheckCircle2 className="text-green-500 shrink-0" size={18} />
                    <div>
                      <p className="text-sm font-bold text-green-900">{h.classeSource}</p>
                      <p className="text-xs text-green-700">
                        {h.type === 'REINSCRIPTION' && `Passage vers ${h.classeCible}`}
                        {h.type === 'SORTIE_SIMPLE' && `Sortie simple (${h.nombre} élèves)`}
                        {h.type === 'FIN_CYCLE' && `Fin de cycle (${h.nombre} diplômés)`}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}