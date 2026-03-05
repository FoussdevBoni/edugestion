import  { useState } from 'react';
import { ChevronRight, ChevronLeft, Plus, Trash2, Check } from 'lucide-react';

// Types et données par défaut (importés de votre fichier)
interface NiveauScolaire {
  nom: string;
  cycles?: Cycle[];
}

interface Cycle {
  nom: string;
  classes?: Classe[];
  diplome?: string;
}

interface Classe {
  nom: string;
  sections?: Section[];
}

interface Section {
  nom: string;
  sousSections?: Section[];
  matieres: Matiere[];
}

interface Matiere {
  nom: string;
  coef: number;
}

// Données par défaut du Sénégal
const defaultSystemeScolaire: NiveauScolaire[] = [
  {
    nom: "Préscolaire",
    cycles: [
      {
        nom: "Maternelle",
        classes: [
          { nom: "Petite section", sections: [{ nom: "Petite section", matieres: [] }] },
          { nom: "Moyenne section", sections: [{ nom: "Moyenne section", matieres: [] }] },
          { nom: "Grande section", sections: [{ nom: "Grande section", matieres: [] }] }
        ]
      }
    ]
  },
  {
    nom: "Primaire",
    cycles: [
      {
        nom: "Primaire",
        diplome: "CEP",
        classes: [
          { nom: "CP1", sections: [
            { nom: "CP1 A", matieres: [
              { nom: "Français", coef: 4 }, { nom: "Mathématiques", coef: 4 },
              { nom: "Sciences", coef: 3 }, { nom: "Histoire-Géo", coef: 2 },
              { nom: "EPS", coef: 1 }, { nom: "Éducation artistique", coef: 1 }
            ]},
            { nom: "CP1 B", matieres: [
              { nom: "Français", coef: 4 }, { nom: "Mathématiques", coef: 4 },
              { nom: "Sciences", coef: 3 }, { nom: "Histoire-Géo", coef: 2 },
              { nom: "EPS", coef: 1 }, { nom: "Éducation artistique", coef: 1 }
            ]}
          ]},
          { nom: "CP2", sections: [
            { nom: "CP2 A", matieres: [
              { nom: "Français", coef: 4 }, { nom: "Mathématiques", coef: 4 },
              { nom: "Sciences", coef: 3 }, { nom: "Histoire-Géo", coef: 2 },
              { nom: "EPS", coef: 1 }, { nom: "Éducation artistique", coef: 1 }
            ]},
            { nom: "CP2 B", matieres: [
              { nom: "Français", coef: 4 }, { nom: "Mathématiques", coef: 4 },
              { nom: "Sciences", coef: 3 }, { nom: "Histoire-Géo", coef: 2 },
              { nom: "EPS", coef: 1 }, { nom: "Éducation artistique", coef: 1 }
            ]}
          ]},
          { nom: "CE1", sections: [
            { nom: "CE1 A", matieres: [
              { nom: "Français", coef: 4 }, { nom: "Mathématiques", coef: 4 },
              { nom: "Sciences", coef: 3 }, { nom: "Histoire-Géo", coef: 2 },
              { nom: "EPS", coef: 1 }, { nom: "Éducation artistique", coef: 1 }
            ]},
            { nom: "CE1 B", matieres: [
              { nom: "Français", coef: 4 }, { nom: "Mathématiques", coef: 4 },
              { nom: "Sciences", coef: 3 }, { nom: "Histoire-Géo", coef: 2 },
              { nom: "EPS", coef: 1 }, { nom: "Éducation artistique", coef: 1 }
            ]}
          ]},
          { nom: "CE2", sections: [
            { nom: "CE2 A", matieres: [
              { nom: "Français", coef: 4 }, { nom: "Mathématiques", coef: 4 },
              { nom: "Sciences", coef: 3 }, { nom: "Histoire-Géo", coef: 2 },
              { nom: "EPS", coef: 1 }, { nom: "Éducation artistique", coef: 1 }
            ]},
            { nom: "CE2 B", matieres: [
              { nom: "Français", coef: 4 }, { nom: "Mathématiques", coef: 4 },
              { nom: "Sciences", coef: 3 }, { nom: "Histoire-Géo", coef: 2 },
              { nom: "EPS", coef: 1 }, { nom: "Éducation artistique", coef: 1 }
            ]}
          ]},
          { nom: "CM1", sections: [
            { nom: "CM1 A", matieres: [
              { nom: "Français", coef: 4 }, { nom: "Mathématiques", coef: 4 },
              { nom: "Sciences", coef: 3 }, { nom: "Histoire-Géo", coef: 2 },
              { nom: "EPS", coef: 1 }, { nom: "Éducation artistique", coef: 1 }
            ]},
            { nom: "CM1 B", matieres: [
              { nom: "Français", coef: 4 }, { nom: "Mathématiques", coef: 4 },
              { nom: "Sciences", coef: 3 }, { nom: "Histoire-Géo", coef: 2 },
              { nom: "EPS", coef: 1 }, { nom: "Éducation artistique", coef: 1 }
            ]}
          ]},
          { nom: "CM2", sections: [
            { nom: "CM2 A", matieres: [
              { nom: "Français", coef: 4 }, { nom: "Mathématiques", coef: 4 },
              { nom: "Sciences", coef: 3 }, { nom: "Histoire-Géo", coef: 2 },
              { nom: "EPS", coef: 1 }, { nom: "Éducation artistique", coef: 1 }
            ]},
            { nom: "CM2 B", matieres: [
              { nom: "Français", coef: 4 }, { nom: "Mathématiques", coef: 4 },
              { nom: "Sciences", coef: 3 }, { nom: "Histoire-Géo", coef: 2 },
              { nom: "EPS", coef: 1 }, { nom: "Éducation artistique", coef: 1 }
            ]}
          ]}
        ]
      }
    ]
  },
  {
    nom: "Secondaire",
    cycles: [
      {
        nom: "1er cycle (Collège)",
        diplome: "BFEM",
        classes: [
          { nom: "6ᵉ", sections: ["A", "B", "C"].map(s => ({
            nom: `6ᵉ ${s}`, matieres: [
              { nom: "Français", coef: 4 }, { nom: "Mathématiques", coef: 4 },
              { nom: "Physique-Chimie", coef: 3 }, { nom: "SVT", coef: 3 },
              { nom: "Histoire-Géo", coef: 2 }, { nom: "Anglais", coef: 2 },
              { nom: "EPS", coef: 1 }, { nom: "Éducation artistique", coef: 1 }
            ]
          }))},
          { nom: "5ᵉ", sections: ["A", "B", "C"].map(s => ({
            nom: `5ᵉ ${s}`, matieres: [
              { nom: "Français", coef: 4 }, { nom: "Mathématiques", coef: 4 },
              { nom: "Physique-Chimie", coef: 3 }, { nom: "SVT", coef: 3 },
              { nom: "Histoire-Géo", coef: 2 }, { nom: "Anglais", coef: 2 },
              { nom: "EPS", coef: 1 }, { nom: "Éducation artistique", coef: 1 }
            ]
          }))},
          { nom: "4ᵉ", sections: ["A", "B", "C"].map(s => ({
            nom: `4ᵉ ${s}`, matieres: [
              { nom: "Français", coef: 4 }, { nom: "Mathématiques", coef: 4 },
              { nom: "Physique-Chimie", coef: 3 }, { nom: "SVT", coef: 3 },
              { nom: "Histoire-Géo", coef: 2 }, { nom: "Anglais", coef: 2 },
              { nom: "EPS", coef: 1 }, { nom: "Éducation artistique", coef: 1 }
            ]
          }))},
          { nom: "3ᵉ", sections: ["A", "B", "C"].map(s => ({
            nom: `3ᵉ ${s}`, matieres: [
              { nom: "Français", coef: 4 }, { nom: "Mathématiques", coef: 4 },
              { nom: "Physique-Chimie", coef: 3 }, { nom: "SVT", coef: 3 },
              { nom: "Histoire-Géo", coef: 2 }, { nom: "Anglais", coef: 2 },
              { nom: "EPS", coef: 1 }, { nom: "Éducation artistique", coef: 1 }
            ]
          }))}
        ]
      },
      {
        nom: "2ᵉ cycle (Lycée)",
        diplome: "Baccalauréat",
        classes: [
          { nom: "2nde", sections: ["A", "B", "C", "D"].map(s => ({
            nom: `2nde ${s}`, matieres: [
              { nom: "Français", coef: 4 }, { nom: "Mathématiques", coef: 5 },
              { nom: "Physique-Chimie", coef: 4 }, { nom: "SVT", coef: 3 },
              { nom: "Histoire-Géo", coef: 2 }, { nom: "Anglais", coef: 2 },
              { nom: "Philosophie", coef: 2 }, { nom: "EPS", coef: 1 }
            ]
          }))},
          { nom: "1ère", sections: ["A", "B", "C", "D"].map(s => ({
            nom: `1ère ${s}`, matieres: s === "C" ? [
              { nom: "Français", coef: 4 }, { nom: "Mathématiques", coef: 6 },
              { nom: "Physique-Chimie", coef: 5 }, { nom: "SVT", coef: 4 },
              { nom: "Histoire-Géo", coef: 2 }, { nom: "Anglais", coef: 2 },
              { nom: "Philosophie", coef: 2 }, { nom: "EPS", coef: 1 }
            ] : [
              { nom: "Français", coef: 4 }, { nom: "Mathématiques", coef: 5 },
              { nom: "Physique-Chimie", coef: 4 }, { nom: "SVT", coef: 3 },
              { nom: "Histoire-Géo", coef: 2 }, { nom: "Anglais", coef: 2 },
              { nom: "Philosophie", coef: 3 }, { nom: "EPS", coef: 1 }
            ]
          }))},
          { nom: "Terminale", sections: ["A", "B", "C", "D", "S"].map(s => ({
            nom: `Terminale ${s}`, matieres: s === "C" ? [
              { nom: "Français", coef: 3 }, { nom: "Mathématiques", coef: 7 },
              { nom: "Physique-Chimie", coef: 6 }, { nom: "SVT", coef: 4 },
              { nom: "Histoire-Géo", coef: 2 }, { nom: "Anglais", coef: 2 },
              { nom: "Philosophie", coef: 3 }, { nom: "EPS", coef: 1 }
            ] : s === "D" ? [
              { nom: "Français", coef: 3 }, { nom: "Mathématiques", coef: 5 },
              { nom: "Physique-Chimie", coef: 5 }, { nom: "SVT", coef: 6 },
              { nom: "Histoire-Géo", coef: 2 }, { nom: "Anglais", coef: 2 },
              { nom: "Philosophie", coef: 3 }, { nom: "EPS", coef: 1 }
            ] : s === "S" ? [
              { nom: "Français", coef: 3 }, { nom: "Mathématiques", coef: 6 },
              { nom: "Physique-Chimie", coef: 6 }, { nom: "SVT", coef: 5 },
              { nom: "Histoire-Géo", coef: 2 }, { nom: "Anglais", coef: 2 },
              { nom: "Philosophie", coef: 3 }, { nom: "EPS", coef: 1 }
            ] : [
              { nom: "Français", coef: 4 }, { nom: "Mathématiques", coef: 5 },
              { nom: "Physique-Chimie", coef: 4 }, { nom: "SVT", coef: 3 },
              { nom: "Histoire-Géo", coef: 2 }, { nom: "Anglais", coef: 2 },
              { nom: "Philosophie", coef: 4 }, { nom: "EPS", coef: 1 }
            ]
          }))}
        ]
      }
    ]
  }
];

// Composant principal de configuration
const SchoolConfiguration = () => {
  const [step, setStep] = useState(1);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [schoolConfig, setSchoolConfig] = useState<NiveauScolaire[]>([]);

  const niveauxDisponibles = defaultSystemeScolaire.map(n => n.nom);

  // Étape 1: Sélection des niveaux
  const toggleLevel = (level: string) => {
    setSelectedLevels(prev =>
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const handleContinue = () => {
    if (selectedLevels.length === 0) return;
    // Initialiser la config avec les valeurs par défaut pour les niveaux sélectionnés
    const initialConfig = defaultSystemeScolaire
      .filter(n => selectedLevels.includes(n.nom))
      .map(n => ({ ...n }));
    setSchoolConfig(initialConfig);
    setStep(2);
  };

  // Étape 2: Configuration par niveau
  const updateCurrentLevel = (updatedLevel: NiveauScolaire) => {
    const newConfig = [...schoolConfig];
    newConfig[currentLevelIndex] = updatedLevel;
    setSchoolConfig(newConfig);
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < schoolConfig.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
    } else {
      setStep(3); // Finalisation
    }
  };

  const handlePrevLevel = () => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* En-tête avec progression */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-2xl font-bold mb-4">Configuration de l'établissement</h1>
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step > s ? <Check size={16} /> : s}
              </div>
              <div className={`flex-1 h-1 ml-2 ${
                step > s ? 'bg-primary' : 'bg-gray-200'
              }`} />
            </div>
          ))}
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step === 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            3
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className="text-primary font-medium">Niveaux</span>
          <span className={step >= 2 ? 'text-primary font-medium' : 'text-gray-500'}>Configuration</span>
          <span className={step === 3 ? 'text-primary font-medium' : 'text-gray-500'}>Finalisation</span>
        </div>
      </div>

      {/* Étape 1: Sélection des niveaux */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Sélectionnez les niveaux scolaires de votre établissement</h2>
          <div className="space-y-3 mb-6">
            {niveauxDisponibles.map((niveau) => (
              <label key={niveau} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedLevels.includes(niveau)}
                  onChange={() => toggleLevel(niveau)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-3 font-medium">{niveau}</span>
              </label>
            ))}
          </div>
          <button
            onClick={handleContinue}
            disabled={selectedLevels.length === 0}
            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            Continuer
            <ChevronRight size={20} className="ml-2" />
          </button>
        </div>
      )}

      {/* Étape 2: Configuration détaillée par niveau */}
      {step === 2 && schoolConfig.length > 0 && (
        <div className="max-w-6xl mx-auto">
          {/* Navigation entre niveaux */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevLevel}
              disabled={currentLevelIndex === 0}
              className="flex items-center text-gray-600 disabled:text-gray-300"
            >
              <ChevronLeft size={20} />
              <span>Niveau précédent</span>
            </button>
            <div className="text-center">
              <span className="text-sm text-gray-500">Niveau {currentLevelIndex + 1} sur {schoolConfig.length}</span>
              <h2 className="text-xl font-bold text-primary">{schoolConfig[currentLevelIndex].nom}</h2>
            </div>
            <button
              onClick={handleNextLevel}
              className="flex items-center text-gray-600"
            >
              <span>{currentLevelIndex === schoolConfig.length - 1 ? 'Terminer' : 'Niveau suivant'}</span>
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Configuration du niveau actuel */}
          <LevelConfiguration 
            level={schoolConfig[currentLevelIndex]}
            onUpdate={updateCurrentLevel}
          />
        </div>
      )}

      {/* Étape 3: Récapitulatif et finalisation */}
      {step === 3 && (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Récapitulatif de la configuration</h2>
          <div className="space-y-6">
            {schoolConfig.map((niveau, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <h3 className="text-md font-bold text-primary mb-3">{niveau.nom}</h3>
                {niveau.cycles?.map((cycle, cIdx) => (
                  <div key={cIdx} className="ml-4 mb-3">
                    <p className="font-medium">{cycle.nom} {cycle.diplome && `- ${cycle.diplome}`}</p>
                    <p className="text-sm text-gray-600 ml-2">
                      {cycle.classes?.length} classes • {cycle.classes?.reduce((acc, c) => acc + (c.sections?.length || 0), 0)} sections
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button
            onClick={() => alert('Configuration sauvegardée !')}
            className="mt-6 w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90"
          >
            Valider la configuration
          </button>
        </div>
      )}
    </div>
  );
};

// Composant de configuration détaillée d'un niveau
const LevelConfiguration = ({ level, onUpdate }: { level: NiveauScolaire; onUpdate: (level: NiveauScolaire) => void }) => {
  const [activeCycle, setActiveCycle] = useState(0);
  const [activeClass, setActiveClass] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  const addCycle = () => {
    const newCycle: Cycle = {
      nom: `Nouveau cycle ${(level.cycles?.length || 0) + 1}`,
      classes: []
    };
    onUpdate({
      ...level,
      cycles: [...(level.cycles || []), newCycle]
    });
  };

  const updateCycle = (index: number, updatedCycle: Cycle) => {
    const newCycles = [...(level.cycles || [])];
    newCycles[index] = updatedCycle;
    onUpdate({ ...level, cycles: newCycles });
  };

  const deleteCycle = (index: number) => {
    const newCycles = (level.cycles || []).filter((_, i) => i !== index);
    onUpdate({ ...level, cycles: newCycles });
    if (activeCycle >= newCycles.length) {
      setActiveCycle(Math.max(0, newCycles.length - 1));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Barre latérale avec liste des cycles */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 border-r p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Cycles</h3>
            <button onClick={addCycle} className="text-primary hover:bg-primary/10 p-1 rounded">
              <Plus size={20} />
            </button>
          </div>
          <div className="space-y-2">
            {level.cycles?.map((cycle, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg cursor-pointer flex items-center justify-between ${
                  activeCycle === idx ? 'bg-primary/10 border border-primary' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveCycle(idx)}
              >
                <span className="text-sm font-medium">{cycle.nom}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteCycle(idx); }}
                  className="text-red-500 hover:bg-red-50 p-1 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Zone de configuration du cycle sélectionné */}
        <div className="col-span-9 p-4">
          {level.cycles && level.cycles[activeCycle] && (
            <CycleConfiguration
              cycle={level.cycles[activeCycle]}
              onUpdate={(updatedCycle) => updateCycle(activeCycle, updatedCycle)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Configuration d'un cycle
const CycleConfiguration = ({ cycle, onUpdate }: { cycle: Cycle; onUpdate: (cycle: Cycle) => void }) => {
  const [activeClass, setActiveClass] = useState(0);

  const addClass = () => {
    const newClass: Classe = {
      nom: `Nouvelle classe ${(cycle.classes?.length || 0) + 1}`,
      sections: []
    };
    onUpdate({
      ...cycle,
      classes: [...(cycle.classes || []), newClass]
    });
  };

  const updateClass = (index: number, updatedClass: Classe) => {
    const newClasses = [...(cycle.classes || [])];
    newClasses[index] = updatedClass;
    onUpdate({ ...cycle, classes: newClasses });
  };

  const deleteClass = (index: number) => {
    const newClasses = (cycle.classes || []).filter((_, i) => i !== index);
    onUpdate({ ...cycle, classes: newClasses });
    if (activeClass >= newClasses.length) {
      setActiveClass(Math.max(0, newClasses.length - 1));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={cycle.nom}
            onChange={(e) => onUpdate({ ...cycle, nom: e.target.value })}
            className="text-lg font-semibold border-b border-transparent hover:border-gray-300 focus:border-primary focus:outline-none"
          />
          <input
            type="text"
            value={cycle.diplome || ''}
            onChange={(e) => onUpdate({ ...cycle, diplome: e.target.value })}
            placeholder="Diplôme (optionnel)"
            className="text-sm border rounded px-2 py-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 border-r pr-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Classes</h4>
            <button onClick={addClass} className="text-primary hover:bg-primary/10 p-1 rounded">
              <Plus size={18} />
            </button>
          </div>
          <div className="space-y-2">
            {cycle.classes?.map((classe, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg cursor-pointer flex items-center justify-between ${
                  activeClass === idx ? 'bg-primary/10 border border-primary' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveClass(idx)}
              >
                <span className="text-sm">{classe.nom}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteClass(idx); }}
                  className="text-red-500 hover:bg-red-50 p-1 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-9">
          {cycle.classes && cycle.classes[activeClass] && (
            <ClassConfiguration
              classe={cycle.classes[activeClass]}
              onUpdate={(updatedClass) => updateClass(activeClass, updatedClass)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Configuration d'une classe
const ClassConfiguration = ({ classe, onUpdate }: { classe: Classe; onUpdate: (classe: Classe) => void }) => {
  const [activeSection, setActiveSection] = useState(0);

  const addSection = () => {
    const newSection: Section = {
      nom: `Section ${String.fromCharCode(65 + (classe.sections?.length || 0))}`,
      matieres: []
    };
    onUpdate({
      ...classe,
      sections: [...(classe.sections || []), newSection]
    });
  };

  const updateSection = (index: number, updatedSection: Section) => {
    const newSections = [...(classe.sections || [])];
    newSections[index] = updatedSection;
    onUpdate({ ...classe, sections: newSections });
  };

  const deleteSection = (index: number) => {
    const newSections = (classe.sections || []).filter((_, i) => i !== index);
    onUpdate({ ...classe, sections: newSections });
    if (activeSection >= newSections.length) {
      setActiveSection(Math.max(0, newSections.length - 1));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          value={classe.nom}
          onChange={(e) => onUpdate({ ...classe, nom: e.target.value })}
          className="text-md font-medium border-b border-transparent hover:border-gray-300 focus:border-primary focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3 border-r pr-4">
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-medium text-sm">Sections</h5>
            <button onClick={addSection} className="text-primary hover:bg-primary/10 p-1 rounded">
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-2">
            {classe.sections?.map((section, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg cursor-pointer flex items-center justify-between ${
                  activeSection === idx ? 'bg-primary/10 border border-primary' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveSection(idx)}
              >
                <span className="text-sm">{section.nom}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteSection(idx); }}
                  className="text-red-500 hover:bg-red-50 p-1 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-9">
          {classe.sections && classe.sections[activeSection] && (
            <SectionConfiguration
              section={classe.sections[activeSection]}
              onUpdate={(updatedSection) => updateSection(activeSection, updatedSection)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Configuration d'une section
const SectionConfiguration = ({ section, onUpdate }: { section: Section; onUpdate: (section: Section) => void }) => {
  const [showAddMatiere, setShowAddMatiere] = useState(false);
  const [newMatiere, setNewMatiere] = useState({ nom: '', coef: 1 });

  const addMatiere = () => {
    if (newMatiere.nom.trim()) {
      onUpdate({
        ...section,
        matieres: [...section.matieres, { ...newMatiere }]
      });
      setNewMatiere({ nom: '', coef: 1 });
      setShowAddMatiere(false);
    }
  };

  const deleteMatiere = (index: number) => {
    onUpdate({
      ...section,
      matieres: section.matieres.filter((_, i) => i !== index)
    });
  };

  const updateMatiere = (index: number, field: keyof Matiere, value: string | number) => {
    const newMatieres = [...section.matieres];
    newMatieres[index] = { ...newMatieres[index], [field]: value };
    onUpdate({ ...section, matieres: newMatieres });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          value={section.nom}
          onChange={(e) => onUpdate({ ...section, nom: e.target.value })}
          className="text-sm font-medium border-b border-transparent hover:border-gray-300 focus:border-primary focus:outline-none"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h6 className="font-medium text-sm">Matières</h6>
          <button
            onClick={() => setShowAddMatiere(true)}
            className="text-primary hover:bg-primary/10 p-1 rounded flex items-center text-sm"
          >
            <Plus size={16} className="mr-1" />
            Ajouter
          </button>
        </div>

        {showAddMatiere && (
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <input
              type="text"
              value={newMatiere.nom}
              onChange={(e) => setNewMatiere({ ...newMatiere, nom: e.target.value })}
              placeholder="Nom de la matière"
              className="w-full p-2 border rounded text-sm"
              autoFocus
            />
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={newMatiere.coef}
                onChange={(e) => setNewMatiere({ ...newMatiere, coef: parseInt(e.target.value) || 1 })}
                min="1"
                className="w-20 p-2 border rounded text-sm"
              />
              <button
                onClick={addMatiere}
                className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary/90"
              >
                Ajouter
              </button>
              <button
                onClick={() => setShowAddMatiere(false)}
                className="text-gray-500 px-3 py-1 rounded text-sm hover:bg-gray-200"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {section.matieres.map((matiere, idx) => (
            <div key={idx} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
              <input
                type="text"
                value={matiere.nom}
                onChange={(e) => updateMatiere(idx, 'nom', e.target.value)}
                className="flex-1 p-1 border rounded text-sm"
              />
              <input
                type="number"
                value={matiere.coef}
                onChange={(e) => updateMatiere(idx, 'coef', parseInt(e.target.value) || 1)}
                min="1"
                className="w-16 p-1 border rounded text-sm"
              />
              <button
                onClick={() => deleteMatiere(idx)}
                className="text-red-500 hover:bg-red-50 p-1 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchoolConfiguration;