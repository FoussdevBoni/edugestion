import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Search,
  ChevronRight, Info,
   History, CheckCircle2, GraduationCap, School,
  Users
} from 'lucide-react';
import { useEcoleNiveau } from '../../../hooks/filters/useEcoleNiveau';
import useClasses from '../../../hooks/classes/useClasses';
import useEleves from '../../../hooks/eleves/useEleves';
import { alertError, alertServerError, alertSuccess } from '../../../helpers/alertError';
import useEcoleInfos from '../../../hooks/ecoleInfos/useEcoleInfos';

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

  const [nouvelleAnnee, setNouvelleAnnee] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClasseSource, setSelectedClasseSource] = useState('');
  const [selectedClasseCible, setSelectedClasseCible] = useState('');
  const [selectedEleves, setSelectedEleves] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [historique, setHistorique] = useState<ActionHistory[]>([]);

  useEffect(() => {
    if (ecoleInfos?.anneeScolaire) {
      setNouvelleAnnee(ecoleInfos.anneeScolaire);
    }
  }, [ecoleInfos]);

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

  const handleUpdateAnnee = async () => {
    try {
      await updateEcoleInfos({ anneeScolaire: nouvelleAnnee });
      alertSuccess('Année scolaire mise à jour');
    } catch (e) { alertServerError(e); }
  };

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

  const handleFinCycle = async () => {
    if (selectedEleves.size === 0) return alertError('Sélectionnez les élèves diplômés');
    if (!window.confirm(`Action Fin de Cycle : Les diplômés seront sortis et TOUT le reste sera réinscrit comme redoublant. Confirmer ?`)) return;

    setIsSubmitting(true);
    try {
      const diplomesIds = Array.from(selectedEleves);
      const restants = elevesDeLaClasse.filter(e => !selectedEleves.has(e.id));

      await desactiverEleves(diplomesIds);

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

      await reinscrireEleves(admis, selectedClasseCible, nouvelleAnnee, "Nouveau");

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/eleves')} className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group">
            <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Réinscription & Passage</h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <Users size={14} />
              Gérez la transition vers la nouvelle année scolaire
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gradient-to-r from-primary/5 to-primary/10 p-2 rounded-xl border border-primary/20">
          <span className="text-sm font-semibold text-primary px-2">Année Scolaire :</span>
          <input
            type="text"
            value={nouvelleAnnee}
            onChange={(e) => setNouvelleAnnee(e.target.value)}
            className="w-32 px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
          <button onClick={handleUpdateAnnee} className="p-1.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg hover:shadow-md transition-all">
            <Save size={16} />
          </button>
        </div>
      </div>

      {/* MESSAGE INFOS */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-primary rounded-r-xl p-5 flex gap-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <Info className="text-primary shrink-0" size={24} />
        <div className="text-sm text-gray-700">
          <p className="font-bold text-primary mb-1">Instructions importantes :</p>
          <p>1. <b>Sortie :</b> Gérez d'abord les départs via les boutons de désactivation.</p>
          <p className="font-semibold text-red-600 underline mt-1">
            2. <b>CAS 1 (Fin Cycle) :</b> Les élèves restants après la sortie des diplômés sont considérés comme REDOUBLANTS.
          </p>
          <p className="font-semibold text-red-600 underline">
            3. <b>CAS 2 (Sortie Simple) :</b> Si un élève change d'école, le reste n'est pas réinscrit automatiquement.
          </p>
          <p className="mt-1">
            4. <b>Réinscrire :</b> Les sélectionnés passent en classe supérieure, le reste est réinscrit en Redoublant.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* SÉLECTION CLASSES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                <School size={14} /> Classe Source (Actuelle)
              </label>
              <select
                value={selectedClasseSource}
                onChange={(e) => setSelectedClasseSource(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              >
                <option value="">-- Choisir la source --</option>
                {classesFiltrees.map(c => (
                  <option key={c.id} value={c.id}>{c.nom} ({effectifParClasse[c.id] || 0} él.)</option>
                ))}
              </select>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                <GraduationCap size={14} /> Classe Cible (Destination)
              </label>
              <select
                value={selectedClasseCible}
                onChange={(e) => setSelectedClasseCible(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              >
                <option value="">-- Choisir la cible --</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            </div>
          </div>

          {/* LISTE ÉLÈVES */}
          {selectedClasseSource && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="p-5 border-b bg-gradient-to-r from-gray-50 to-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text" placeholder="Rechercher un élève..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none px-3 py-1.5 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedEleves.size === elevesFiltres.length && elevesFiltres.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded text-primary"
                  />
                  <span className="text-sm font-medium text-gray-700">Tout sélectionner</span>
                </label>
              </div>

              <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {elevesFiltres.map((eleve, idx) => (
                  <div
                    key={eleve.id}
                    onClick={() => toggleEleve(eleve.id)}
                    className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${selectedEleves.has(eleve.id) ? 'bg-primary/5' : ''} animate-fade-in-up`}
                    style={{ animationDelay: `${400 + idx * 20}ms` }}
                  >
                    <input
                      type="checkbox" readOnly
                      checked={selectedEleves.has(eleve.id)}
                      className="w-4 h-4 rounded text-primary mr-4"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{eleve.prenom} {eleve.nom}</p>
                      <p className="text-xs text-gray-500 font-mono">{eleve.matricule || 'Sans matricule'}</p>
                    </div>
                    <div className="text-right text-xs font-bold text-gray-400 uppercase">{eleve.sexe}</div>
                  </div>
                ))}
              </div>

              {/* BARRE D'ACTIONS */}
              <div className="p-5 bg-gray-50 border-t border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    disabled={isSubmitting || selectedEleves.size === 0}
                    onClick={handleSortieSimple}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-100 disabled:opacity-50 text-sm font-semibold transition-all"
                  >
                    <School size={16} /> Changement École
                  </button>
                  <button
                    disabled={isSubmitting || selectedEleves.size === 0}
                    onClick={handleFinCycle}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 disabled:opacity-50 text-sm font-semibold transition-all"
                  >
                    <GraduationCap size={16} /> Fin Cycle (Diplôme)
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="hidden sm:inline text-sm font-bold text-primary">{selectedEleves.size} sélectionné(s)</span>
                  <button
                    disabled={isSubmitting || selectedEleves.size === 0 || !selectedClasseCible}
                    onClick={handleReinscrire}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md disabled:opacity-50 transition-all font-bold"
                  >
                    {isSubmitting ? 'Traitement...' : 'Réinscrire'} <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* COLONNE HISTORIQUE */}
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <History size={20} className="text-primary" />
              Classes déjà gérées
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {historique.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
                  <p className="text-sm text-gray-400 italic">Aucune classe traitée dans cette session</p>
                </div>
              ) : (
                historique.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-xl transition-all duration-200 hover:shadow-sm">
                    <CheckCircle2 className="text-green-500 shrink-0" size={18} />
                    <div>
                      <p className="text-sm font-bold text-green-900">{h.classeSource}</p>
                      <p className="text-xs text-green-700">
                        {h.type === 'REINSCRIPTION' && `Passage vers ${h.classeCible} (${h.nombre} élèves)`}
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
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}