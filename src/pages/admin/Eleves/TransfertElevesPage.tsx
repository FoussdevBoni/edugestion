import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, User, Check, 
  ChevronRight, School, Users, RefreshCw,
   Filter, GraduationCap
} from 'lucide-react';
import { useEcoleNiveau } from '../../../hooks/filters/useEcoleNiveau';
import useClasses from '../../../hooks/classes/useClasses';
import useEleves from '../../../hooks/eleves/useEleves';
import { alertError, alertServerError, alertSuccess } from '../../../helpers/alertError';

export default function TransfertElevesPage() {
  const navigate = useNavigate();
  const { cycleSelectionne, niveauSelectionne } = useEcoleNiveau();
  const { classes } = useClasses();
  const { eleves, transfererEleves } = useEleves();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClasseSource, setSelectedClasseSource] = useState('');
  const [selectedClasseCible, setSelectedClasseCible] = useState('');
  const [selectedEleves, setSelectedEleves] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const classesFiltrees = classes.filter(classe => {
    const matchesNiveau = niveauSelectionne ? classe.niveauScolaire === niveauSelectionne : true;
    const matchesCycle = cycleSelectionne ? classe.cycle === cycleSelectionne : true;
    return matchesNiveau && matchesCycle;
  }).sort((a, b) => a.nom.localeCompare(b.nom));

  const effectifParClasse = eleves.reduce((acc, eleve) => {
    acc[eleve.classeId] = (acc[eleve.classeId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const classesCibles = classesFiltrees.filter(classe => 
    classe.id !== selectedClasseSource
  );

  const elevesDeLaClasse = eleves.filter(e => e.classeId === selectedClasseSource);
  const elevesFiltres = elevesDeLaClasse.filter(eleve =>
    `${eleve.prenom} ${eleve.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eleve.matricule?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setSelectedEleves(new Set());
    setSelectAll(false);
    setSelectedClasseCible('');
  }, [selectedClasseSource]);

  const toggleEleve = (eleveId: string) => {
    setSelectedEleves(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eleveId)) {
        newSet.delete(eleveId);
      } else {
        newSet.add(eleveId);
      }
      return newSet;
    });
    setSelectAll(false);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      const allIds = elevesFiltres.map(e => e.id);
      setSelectedEleves(new Set(allIds));
    } else {
      setSelectedEleves(new Set());
    }
  };

  const handleTransfert = async () => {
    if (!selectedClasseCible) {
      alertError('Veuillez sélectionner une classe cible');
      return;
    }
    if (selectedEleves.size === 0) {
      alertError('Veuillez sélectionner au moins un élève');
      return;
    }

    setIsSubmitting(true);
    try {
      const elevesSelectionnes = eleves.filter(e => selectedEleves.has(e.id));
      const result = await transfererEleves(elevesSelectionnes, selectedClasseCible);
      
      if (result.errors.length > 0) {
        const messages = result.errors.map(e => `${e.nom}: ${e.error}`).join('\n');
        alertServerError({ message: messages }, 'Erreurs lors du transfert');
      } 
      
      if (result.success.length > 0) {
        alertSuccess(`${result.success.length} élève(s) transféré(s) avec succès`);
        setTimeout(() => {
          navigate('/admin/eleves');
        }, 1500);
      }
    } catch (error) {
      alertServerError(error, 'Erreur lors du transfert');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button
          onClick={() => navigate('/admin/eleves')}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transfert d'élèves</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <RefreshCw size={14} />
            Transférer des élèves d'une classe à une autre
          </p>
        </div>
      </div>

      {/* Filtres actifs */}
      {(niveauSelectionne || cycleSelectionne) && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 flex items-center gap-2 text-sm text-gray-600 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <Filter size={14} className="text-primary" />
          <span>Filtres actifs:</span>
          {niveauSelectionne && <span className="px-2 py-0.5 bg-white rounded-full text-primary font-medium">{niveauSelectionne}</span>}
          {cycleSelectionne && <span className="px-2 py-0.5 bg-white rounded-full text-primary font-medium">{cycleSelectionne}</span>}
        </div>
      )}

      {/* Sélection des classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <School size={18} className="text-red-600" />
            </div>
            Classe source
          </h2>
          <select
            value={selectedClasseSource}
            onChange={(e) => setSelectedClasseSource(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="">Sélectionner une classe</option>
            {classesFiltrees.map(classe => (
              <option key={classe.id} value={classe.id}>
                {classe.nom} - {classe.niveauClasse} ({effectifParClasse[classe.id] || 0} élèves)
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <GraduationCap size={18} className="text-green-600" />
            </div>
            Classe cible
          </h2>
          <select
            value={selectedClasseCible}
            onChange={(e) => setSelectedClasseCible(e.target.value)}
            disabled={!selectedClasseSource}
            className={`w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
              !selectedClasseSource ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''
            }`}
          >
            <option value="">Sélectionner une classe</option>
            {classesCibles.map(classe => (
              <option key={classe.id} value={classe.id}>
                {classe.nom} - {classe.niveauClasse}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des élèves */}
      {selectedClasseSource && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users size={18} className="text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Élèves</h2>
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                  {elevesFiltres.length}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="text-gray-600">Tout sélectionner</span>
                </label>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {elevesFiltres.length > 0 ? (
              elevesFiltres.map((eleve, idx) => (
                <div
                  key={eleve.id}
                  className={`flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors duration-200 animate-fade-in-up ${
                    selectedEleves.has(eleve.id) ? 'bg-primary/5' : ''
                  }`}
                  style={{ animationDelay: `${500 + idx * 20}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedEleves.has(eleve.id)}
                      onChange={() => toggleEleve(eleve.id)}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                      <User size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{eleve.prenom} {eleve.nom}</p>
                      <p className="text-xs text-gray-500 font-mono">{eleve.matricule || 'Pas de matricule'}</p>
                    </div>
                  </div>
                  {selectedEleves.has(eleve.id) && (
                    <div className="text-primary">
                      <Check size={18} />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">
                <Users size={48} className="mx-auto text-gray-300 mb-3" />
                <p>Aucun élève trouvé dans cette classe</p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-primary">{selectedEleves.size}</span> élève(s) sélectionné(s)
              </p>
              <button
                onClick={handleTransfert}
                disabled={isSubmitting || selectedEleves.size === 0 || !selectedClasseCible}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Transfert...
                  </>
                ) : (
                  <>
                    Transférer
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
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
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}