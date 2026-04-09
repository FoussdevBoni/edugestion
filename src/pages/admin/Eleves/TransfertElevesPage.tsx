import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Search, User, Check, X, 
  ChevronRight, AlertCircle, School, Users, RefreshCw
} from 'lucide-react';
import { useEcoleNiveau } from '../../../hooks/filters/useEcoleNiveau';
import useClasses from '../../../hooks/classes/useClasses';
import useEleves from '../../../hooks/eleves/useEleves';
import { alertError, alertServerError } from '../../../helpers/alertError';

export default function TransfertElevesPage() {
  const navigate = useNavigate();
  const { cycleSelectionne, niveauSelectionne } = useEcoleNiveau();
  const { classes } = useClasses();
  const { eleves , transfererEleves } = useEleves();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClasseSource, setSelectedClasseSource] = useState('');
  const [selectedClasseCible, setSelectedClasseCible] = useState('');
  const [selectedEleves, setSelectedEleves] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  // Classes filtrées selon les filtres globaux
  const classesFiltrees = classes.filter(classe => {
    const matchesNiveau = niveauSelectionne ? classe.niveauScolaire === niveauSelectionne : true;
    const matchesCycle = cycleSelectionne ? classe.cycle === cycleSelectionne : true;
    return matchesNiveau && matchesCycle;
  }).sort((a, b) => a.nom.localeCompare(b.nom));

  // Compter les élèves par classe
  const effectifParClasse = eleves.reduce((acc, eleve) => {
    acc[eleve.classeId] = (acc[eleve.classeId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Classes disponibles pour le transfert (toutes sauf la source)
  const classesCibles = classesFiltrees.filter(classe => 
    classe.id !== selectedClasseSource
  );

  // Élèves de la classe source
  const elevesDeLaClasse = eleves.filter(e => e.classeId === selectedClasseSource);

  // Filtrer les élèves par recherche
  const elevesFiltres = elevesDeLaClasse.filter(eleve =>
    `${eleve.prenom} ${eleve.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eleve.matricule?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Réinitialiser quand la classe source change
  useEffect(() => {
    setSelectedEleves(new Set());
    setSelectAll(false);
    setSelectedClasseCible('');
  }, [selectedClasseSource]);

  // Gérer la sélection individuelle
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
    // On décoche "Tout sélectionner" si on manipule unitairement
    setSelectAll(false);
  };

  // NOUVEAU : Gérer la sélection globale proprement
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
        alert(`${result.success.length} élève(s) transféré(s) avec succès`);
        navigate('/admin/eleves');
      }
    } catch (error) {
      alertServerError(error, 'Erreur lors du transfert');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/eleves')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transfert d'élèves</h1>
          <p className="text-sm text-gray-500 mt-1">
            Transférer des élèves d'une classe à une autre
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <School size={20} className="text-primary" />
            Classe source
          </h2>
          <select
            value={selectedClasseSource}
            onChange={(e) => setSelectedClasseSource(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">Sélectionner une classe</option>
            {classesFiltrees.map(classe => (
              <option key={classe.id} value={classe.id}>
                {classe.nom} - {classe.niveauClasse} ({effectifParClasse[classe.id] || 0} élèves)
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <RefreshCw size={20} className="text-blue-600" />
            Classe cible
          </h2>
          <select
            value={selectedClasseCible}
            onChange={(e) => setSelectedClasseCible(e.target.value)}
            disabled={!selectedClasseSource}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
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

      {selectedClasseSource && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Users size={20} className="text-primary" />
                <h2 className="text-lg font-semibold text-gray-800">Élèves</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)} // Correction ici
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span>Tout sélectionner</span>
                </label>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {elevesFiltres.length > 0 ? (
              elevesFiltres.map((eleve) => (
                <div
                  key={eleve.id}
                  className={`flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors ${
                    selectedEleves.has(eleve.id) ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedEleves.has(eleve.id)}
                      onChange={() => toggleEleve(eleve.id)}
                      className="rounded text-primary focus:ring-primary"
                    />
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{eleve.prenom} {eleve.nom}</p>
                      <p className="text-xs text-gray-500">{eleve.matricule}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">Aucun élève trouvé</div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{selectedEleves.size}</span> élève(s) sélectionné(s)
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleTransfert}
                  disabled={isSubmitting || selectedEleves.size === 0 || !selectedClasseCible}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSubmitting ? 'Transfert...' : 'Transférer'}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}