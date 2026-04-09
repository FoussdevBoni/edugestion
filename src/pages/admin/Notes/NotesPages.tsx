import { useState, useEffect, useRef, useMemo } from "react";
import {
  ChevronLeft, ChevronRight, Plus,
  Save, Trash2, Lock,
  Upload,
  Download
} from "lucide-react";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";
import useEvaluations from "../../../hooks/evaluations/useEvaluations";
import useClasses from "../../../hooks/classes/useClasses";
import usePeriodes from "../../../hooks/periodes/usePeriodes";
import useMatieres from "../../../hooks/matieres/useMatieres";
import useNotes from "../../../hooks/notes/useNotes";
import useEleves from "../../../hooks/eleves/useEleves";
import { useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';



interface NoteEdition {
  id?: string;
  inscriptionId: string;
  evaluationId: string;
  matiereId: string;
  periodeId: string;
  classeId: string;
  valeur: number;
  eleveNom: string;
  matiereNom: string;
  closed: boolean;
}

// Composant pour l'affichage stylisé d'une note
const NoteCell = ({ note, isClosed }: { note: number, isClosed: boolean }) => {
  const bgColor = note >= 16
    ? 'bg-emerald-100 text-emerald-800'
    : note >= 12
      ? 'bg-sky-100 text-sky-800'
      : note >= 10
        ? 'bg-yellow-200 text-yellow-800'
        : 'bg-red-200 text-red-800';

  return (
    <span className={`inline-block px-2 py-0.5 text-xs rounded font-medium ${bgColor} ${isClosed ? 'opacity-75' : ''}`}>
      {note}
    </span>
  )
}

export default function NotesPage() {
  const navigate = useNavigate()
  // 1. Contextes et Hooks de données
  const { niveauSelectionne, cycleSelectionne } = useEcoleNiveau();
  const { eleves: inscriptions } = useEleves();
  const { evaluations } = useEvaluations();
  const { periodes } = usePeriodes();
  const { classes } = useClasses();
  const { matieres } = useMatieres();
  const { notes, createNote, updateNote, deleteNote, handleCloseNote, handleCloseNotes } = useNotes();

  // 2. États de l'interface
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 3. États de sélection (Filtres)
  const [selectedNiveauClasse, setSelectedNiveauClasse] = useState("");
  const [selectedClasse, setSelectedClasse] = useState<string>("");
  const [selectedPeriode, setSelectedPeriode] = useState<string>("");
  const [selectedMatiere, setSelectedMatiere] = useState<string>("");

  // 4. États des Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCloseAllModalOpen, setIsCloseAllModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<NoteEdition | null>(null);
  const [noteValue, setNoteValue] = useState<string>("");

  // Refs pour le défilement horizontal des menus
  const classesScrollRef = useRef<HTMLDivElement>(null);
  const periodesScrollRef = useRef<HTMLDivElement>(null);
  const matieresScrollRef = useRef<HTMLDivElement>(null);

  // --- LOGIQUE DE FILTRAGE (MÉMOÏSÉE) ---

  const classesFiltrees = useMemo(() => classes.filter(classe => {
    const matchesNiveau = niveauSelectionne ? classe.niveauScolaire === niveauSelectionne : true;
    const matchesCycle = cycleSelectionne ? classe.cycle === cycleSelectionne : true;
    const matchesNiveauClasse = selectedNiveauClasse ? classe.niveauClasse === selectedNiveauClasse : true;
    return matchesNiveau && matchesCycle && matchesNiveauClasse;
  }), [classes, niveauSelectionne, cycleSelectionne, selectedNiveauClasse]);

  const niveauxClasseDisponibles = useMemo(() => [...new Set(
    classes.filter(c => (niveauSelectionne ? c.niveauScolaire === niveauSelectionne : true) && (cycleSelectionne ? c.cycle === cycleSelectionne : true))
      .map(c => c.niveauClasse)
  )].sort(), [classes, niveauSelectionne, cycleSelectionne]);

  const periodesDisponibles = useMemo(() =>
    periodes.filter(p => !p.niveauScolaireId || p.niveauScolaire === niveauSelectionne)
    , [periodes, niveauSelectionne]);

  const selectedClasseObj = useMemo(() =>
    classes.find(c => c.id === selectedClasse) || null
    , [selectedClasse, classes]);

  const elevesDeLaClasse = useMemo(() =>
    selectedClasseObj ? inscriptions.filter(ins => ins.classeId === selectedClasseObj.id) : []
    , [selectedClasseObj, inscriptions]);

  const matieresDeLaClasse = useMemo(() =>
    selectedClasseObj ? matieres.filter(m => m.niveauClasseId === selectedClasseObj.niveauClasseId) : []
    , [selectedClasseObj, matieres]);

  const evaluationsDeLaPeriode = useMemo(() =>
    selectedPeriode ? evaluations.filter(e => e.periodeId === selectedPeriode) : []
    , [selectedPeriode, evaluations]);

  // --- SYNCHRONISATION DES SÉLECTIONS (CASCADE) ---

  useEffect(() => {
    if (classesFiltrees.length > 0) {
      const existe = classesFiltrees.find(c => c.id === selectedClasse);
      if (!selectedClasse || !existe) setSelectedClasse(classesFiltrees[0].id);
    } else { setSelectedClasse(""); }
  }, [classesFiltrees]);

  useEffect(() => {
    if (periodesDisponibles.length > 0) {
      if (!selectedPeriode || !periodesDisponibles.find(p => p.id === selectedPeriode)) {
        setSelectedPeriode(periodesDisponibles[0].id);
      }
    }
  }, [periodesDisponibles]);

  useEffect(() => {
    if (matieresDeLaClasse.length > 0) {
      const existe = matieresDeLaClasse.find(m => m.id === selectedMatiere);
      if (!selectedMatiere || !existe) setSelectedMatiere(matieresDeLaClasse[0].id);
    } else { setSelectedMatiere(""); }
  }, [matieresDeLaClasse]);

  // --- CONSTRUCTION DE LA MATRICE DE DONNÉES ---
  const { notesData, notesClosedStatus, notesIds } = useMemo(() => {
    const matrix: Record<string, Record<string, number>> = {};
    const closed: Record<string, Record<string, boolean>> = {};
    const ids: Record<string, Record<string, string>> = {};

    if (!selectedMatiere) return { notesData: matrix, notesClosedStatus: closed, notesIds: ids };

    elevesDeLaClasse.forEach(eleve => {
      matrix[eleve.id] = {};
      closed[eleve.id] = {};
      ids[eleve.id] = {};

      evaluationsDeLaPeriode.forEach(evalItem => {
        const noteExistante = notes.find(n =>
          n.inscriptionId === eleve.id &&
          n.evaluationId === evalItem.id &&
          n.matiereId === selectedMatiere
        );
        if (noteExistante) {
          matrix[eleve.id][evalItem.id] = noteExistante.note;
          closed[eleve.id][evalItem.id] = noteExistante.closed || false;
          ids[eleve.id][evalItem.id] = noteExistante.id;
        }
      });
    });

    return { notesData: matrix, notesClosedStatus: closed, notesIds: ids };
  }, [elevesDeLaClasse, evaluationsDeLaPeriode, notes, selectedMatiere]);

  // --- GESTION DES ACTIONS ---

  const handleCellClick = (eleve: any, evaluation: any) => {
    const noteId = notesIds[eleve.id]?.[evaluation.id];
    const isClosed = notesClosedStatus[eleve.id]?.[evaluation.id];

    if (isClosed) return;

    setCurrentNote({
      id: noteId,
      inscriptionId: eleve.id,
      evaluationId: evaluation.id,
      matiereId: selectedMatiere,
      periodeId: selectedPeriode,
      classeId: selectedClasse,
      valeur: notesData[eleve.id]?.[evaluation.id] || 0,
      closed: false,
      eleveNom: `${eleve.prenom} ${eleve.nom}`,
      matiereNom: matieres.find(m => m.id === selectedMatiere)?.nom || ""
    });

    setNoteValue(notesData[eleve.id]?.[evaluation.id]?.toString() || "");
    setIsModalOpen(true);
    setErrorMessage("");
  };

  const handleSaveNote = async () => {
    if (!currentNote || !noteValue) return;
    const valeur = parseFloat(noteValue);
    if (isNaN(valeur) || valeur < 0 || valeur > 20) {
      setErrorMessage("La note doit être entre 0 et 20");
      return;
    }

    try {
      if (currentNote.id) {
        await updateNote(currentNote.id, { note: valeur });
      } else {
        await createNote({
          inscriptionId: currentNote.inscriptionId,
          matiereId: currentNote.matiereId,
          periodeId: currentNote.periodeId,
          note: valeur,
          coefficient: 1,
          evaluationId: currentNote.evaluationId
        });
      }
      setIsModalOpen(false);
    } catch (error: any) { setErrorMessage(error.message || "Erreur lors de l'enregistrement"); }
  };

  const handleIndividualClose = async () => {
    if (!currentNote?.id) return;
    try {
      await handleCloseNote(currentNote.id);
      setIsModalOpen(false);
    } catch (error: any) { setErrorMessage("Erreur de clôture"); }
  };

  const handleDeleteNote = async () => {
    if (!currentNote?.id) return;
    try {
      await deleteNote(currentNote.id);
      setIsDeleteModalOpen(false);
      setIsModalOpen(false);
    } catch (error: any) { setErrorMessage("Erreur de suppression"); }
  };

  const handleCloseAllNotes = async () => {
    try {
      const idsToClose: string[] = [];
      elevesDeLaClasse.forEach(el => {
        evaluationsDeLaPeriode.forEach(ev => {
          const id = notesIds[el.id]?.[ev.id];
          if (id && !notesClosedStatus[el.id]?.[ev.id]) idsToClose.push(id);
        });
      });
      if (idsToClose.length > 0) {
        await handleCloseNotes(idsToClose);
        setIsCloseAllModalOpen(false);
      }
    } catch (error: any) { setErrorMessage("Erreur de clôture groupée"); }
  };

  const getNonClosedNotesCount = () => {
    let count = 0;
    elevesDeLaClasse.forEach(el => {
      evaluationsDeLaPeriode.forEach(ev => {
        if (notesIds[el.id]?.[ev.id] && !notesClosedStatus[el.id]?.[ev.id]) count++;
      });
    });
    return count;
  };



  // Ajouter cette fonction dans le composant NotesPage
  const handleExportExcel = () => {
    if (!selectedClasse || !selectedPeriode || !selectedMatiere) {
      alert("Veuillez sélectionner une classe, une période et une matière");
      return;
    }

    const exportData: any[] = [];

    // En-têtes
    const headers = ['Élève', 'Matricule'];
    evaluationsDeLaPeriode.forEach(evalItem => {
      headers.push(evalItem.abreviation || evalItem.nom);
    });
    exportData.push(headers);

    // Données des élèves
    const elevesFiltres = elevesDeLaClasse.filter(e =>
      `${e.prenom} ${e.nom}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    elevesFiltres.forEach(eleve => {
      const row: any[] = [
        `${eleve.prenom} ${eleve.nom}`,
        eleve.matricule || '-'
      ];

      evaluationsDeLaPeriode.forEach(evalItem => {
        const note = notesData[eleve.id]?.[evalItem.id];
        const isClosed = notesClosedStatus[eleve.id]?.[evalItem.id];

        if (note !== undefined) {
          row.push(isClosed ? `${note} (clôturée)` : note);
        } else {
          row.push('');
        }
      });

      exportData.push(row);
    });

    const ws = XLSX.utils.aoa_to_sheet(exportData);
    ws['!cols'] = [
      { wch: 25 },
      { wch: 15 },
      ...evaluationsDeLaPeriode.map(() => ({ wch: 12 }))
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Notes_${selectedClasseObj?.nom}_${matieres.find(m => m.id === selectedMatiere)?.nom}`);

    const fileName = `Notes_${selectedClasseObj?.nom}_${matieres.find(m => m.id === selectedMatiere)?.nom}_${new Date().toLocaleDateString('fr-FR')}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

 const handleExportAllNotes = () => {
  if (!selectedClasse || !selectedPeriode) {
    alert("Veuillez sélectionner une classe et une période");
    return;
  }

  const wb = XLSX.utils.book_new();
  const elevesFiltres = elevesDeLaClasse.filter(e =>
    `${e.prenom} ${e.nom}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pour chaque matière, créer une feuille
  matieresDeLaClasse.forEach(matiere => {
    const exportData: any[] = [];

    // En-têtes
    const headers = ['Élève', 'Matricule'];
    evaluationsDeLaPeriode.forEach(evalItem => {
      headers.push(evalItem.abreviation || evalItem.nom);
    });
    exportData.push(headers);

    // Données des élèves
    elevesFiltres.forEach(eleve => {
      const row: any[] = [
        `${eleve.prenom} ${eleve.nom}`,
        eleve.matricule || '-'
      ];

      evaluationsDeLaPeriode.forEach(evalItem => {
        const note = notesData[eleve.id]?.[evalItem.id];
        const isClosed = notesClosedStatus[eleve.id]?.[evalItem.id];

        if (note !== undefined) {
          row.push(isClosed ? `${note} (clôturée)` : note);
        } else {
          row.push('');
        }
      });

      exportData.push(row);
    });

    // Créer la feuille
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    ws['!cols'] = [
      { wch: 25 },
      { wch: 15 },
      ...evaluationsDeLaPeriode.map(() => ({ wch: 12 }))
    ];

    // Nom de la feuille (limité à 31 caractères)
    const sheetName = matiere.nom.substring(0, 31);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  // Générer le nom du fichier
  const fileName = `Notes_${selectedClasseObj?.nom}_${new Date().toLocaleDateString('fr-FR')}.xlsx`;
  XLSX.writeFile(wb, fileName);
};
  const scroll = (ref: React.RefObject<HTMLDivElement>, d: number) => ref.current?.scrollBy({ left: d, behavior: 'smooth' });

  // --- RENDU ---

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Gestion des Notes</h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/notes/import")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Importer
          </button>

          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
            title="Exporter les notes de la matière sélectionnée"
          >
            <Download className="w-4 h-4" />
            Exporter matière
          </button>

          {matieresDeLaClasse.length > 1 && (
            <button
              onClick={handleExportAllNotes}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
              title="Exporter toutes les matières"
            >
              <Download className="w-4 h-4" />
              Exporter tout
            </button>
          )}
        </div>
      </header>

      {/* Barre de Recherche et Filtre Niveau */}
      <div className="bg-white rounded-xl border shadow-sm p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un élève par nom ou prénom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
          />
        </div>
        <select
          value={selectedNiveauClasse}
          onChange={(e) => setSelectedNiveauClasse(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm focus:border-primary"
        >
          <option value="">Tous les niveaux (6ème, 5ème...)</option>
          {niveauxClasseDisponibles.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      {/* Sélecteurs Horizontaux (Classes, Périodes, Matières) */}
      <div className="space-y-3">
        {[
          { ref: classesScrollRef, data: classesFiltrees, selected: selectedClasse, setter: setSelectedClasse, label: "Classes" },
          { ref: periodesScrollRef, data: periodesDisponibles, selected: selectedPeriode, setter: setSelectedPeriode, label: "Périodes" },
          { ref: matieresScrollRef, data: matieresDeLaClasse, selected: selectedMatiere, setter: setSelectedMatiere, label: "Matières" }
        ].map((tab, idx) => tab.data.length > 0 && (
          <div key={idx} className="bg-white rounded-xl border shadow-sm p-3 relative group">
            <div className="flex items-center">
              <button onClick={() => scroll(tab.ref, -250)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft size={20} /></button>
              <div ref={tab.ref} className="flex-1 overflow-x-auto scrollbar-hide flex gap-2 px-2 py-1">
                {tab.data.map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => tab.setter(item.id)}
                    className={`px-5 py-2 text-sm rounded-full border whitespace-nowrap transition-all duration-200 ${tab.selected === item.id ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 font-semibold' : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50'}`}
                  >
                    {item.nom}
                  </button>
                ))}
              </div>
              <button onClick={() => scroll(tab.ref, 250)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronRight size={20} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Tableau Principal */}
      {(!selectedClasse || !selectedPeriode || !selectedMatiere) ? (
        <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl p-12 text-center">
          <p className="text-blue-600 font-medium">Veuillez sélectionner une classe, une période et une matière pour commencer la saisie.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border shadow-lg overflow-hidden">
          {/* Header du tableau */}
          <div className="bg-gray-50/80 px-6 py-4 border-b flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-bold">{selectedClasseObj?.nom}</div>
              <span className="text-gray-300 font-light">|</span>
              <div className="text-gray-700 font-semibold">{matieres.find(m => m.id === selectedMatiere)?.nom}</div>
            </div>

            <button
              onClick={() => setIsCloseAllModalOpen(true)}
              disabled={getNonClosedNotesCount() === 0}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl font-bold transition-all ${getNonClosedNotesCount() === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-200'
                }`}
            >
              <Lock size={16} />
              Clôturer la colonne ({getNonClosedNotesCount()})
            </button>
          </div>

          {/* Corps du tableau */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100/50 border-b">
                  <th className="sticky left-0 bg-white px-6 py-4 text-left text-xs font-black text-gray-400 uppercase border-r z-20">Élèves</th>
                  {evaluationsDeLaPeriode.map((e) => (
                    <th key={e.id} className="px-4 py-4 text-center text-xs font-black text-gray-400 uppercase border-r min-w-[120px]">
                      {e.abreviation || e.nom}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {elevesDeLaClasse
                  .filter(e => `${e.prenom} ${e.nom}`.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((eleve, i) => (
                    <tr key={eleve.id} className={`group ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'} hover:bg-primary/5 transition-colors`}>
                      <td className="sticky left-0 bg-inherit px-6 py-4 font-semibold border-r z-10">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {eleve.nom.charAt(0)}{eleve.prenom.charAt(0)}
                          </div>
                          <span className="text-gray-800">{eleve.prenom} {eleve.nom}</span>
                        </div>
                      </td>
                      {evaluationsDeLaPeriode.map((e) => {
                        const note = notesData[eleve.id]?.[e.id];
                        const isClosed = notesClosedStatus[eleve.id]?.[e.id];

                        return (
                          <td
                            key={`${eleve.id}-${e.id}`}
                            onClick={() => handleCellClick(eleve, e)}
                            className={`px-4 py-4 border-r text-center relative transition-all ${isClosed ? 'bg-gray-100/80 cursor-not-allowed' : 'cursor-pointer hover:bg-white'}`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              {note !== undefined ? (
                                <>
                                  {isClosed && <Lock size={12} className="text-gray-400" />}
                                  <NoteCell isClosed={isClosed} note={note} />
                                </>
                              ) : (
                                !isClosed && <Plus size={18} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL DE SAISIE ET MODIFICATION */}
      {isModalOpen && currentNote && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b bg-gray-50 flex items-center justify-between">
              <div>
                <h3 className="font-black text-gray-900 text-lg">{currentNote.id ? 'Modifier la note' : 'Nouvelle saisie'}</h3>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">{currentNote.eleveNom}</p>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary"><Save size={20} /></div>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Note sur 20</label>
                  <span className="text-[10px] text-primary font-bold">{currentNote.matiereNom}</span>
                </div>
                <input
                  autoFocus
                  type="number"
                  value={noteValue}
                  onChange={(e) => setNoteValue(e.target.value)}
                  className="w-full px-6 py-4 text-4xl text-center font-black bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-0 outline-none transition-all"
                  placeholder="00"
                  step="0.25" min="0" max="20"
                />
              </div>

              {errorMessage && <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">{errorMessage}</p>}
            </div>

            <div className="p-6 bg-gray-50 flex flex-col gap-3">
              <div className="flex gap-3">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 text-sm font-bold text-gray-500 hover:bg-white rounded-xl transition-colors">Annuler</button>
                <button onClick={handleSaveNote} className="flex-1 px-4 py-3 text-sm font-black bg-primary text-white rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/30">Enregistrer</button>
              </div>

              {currentNote.id && (
                <div className="flex flex-col gap-2 border-t pt-4 mt-2">
                  <button
                    onClick={handleIndividualClose}
                    className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors"
                  >
                    <Lock size={14} /> Clôturer cette note définitivement
                  </button>
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={14} /> Supprimer la note
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL SUPPRESSION */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteNote}
        title="Supprimer la note ?"
        message="Cette action effacera la note du système. L'élève n'aura plus de note pour cette évaluation."
      />

      {/* MODAL CLÔTURE GROUPÉE */}
      {isCloseAllModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100]">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <div className="h-16 w-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 mb-6 shadow-inner"><Lock size={32} /></div>
            <h3 className="text-xl font-black text-gray-900 mb-3">Clôturer toute la colonne ?</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 font-medium">
              Vous allez verrouiller <span className="text-orange-600 font-black">{getNonClosedNotesCount()} notes</span>.
              Une fois clôturées, ces notes ne pourront plus être modifiées ni supprimées.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setIsCloseAllModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Annuler</button>
              <button onClick={handleCloseAllNotes} className="flex-1 py-3 text-sm font-black bg-orange-600 text-white rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-200">Confirmer</button>
            </div>
          </div>
        </div>
      )}

      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}