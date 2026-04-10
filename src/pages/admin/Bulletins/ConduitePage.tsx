// src/pages/admin/eleves/ConduitePage.tsx
import { useState, useEffect, useMemo } from "react";
import { Search, Save, FileSpreadsheet, Download, AlertCircle, ArrowLeft } from "lucide-react";
import * as XLSX from 'xlsx';
import { useNavigate } from "react-router-dom";

import ClasseFilter from "../../../components/wrappers/ClassesFilter";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import useEleves from "../../../hooks/eleves/useEleves";
import usePeriodes from "../../../hooks/periodes/usePeriodes";
import TableList from "../../../components/ui/tables/TableList";
import { alertSuccess, alertServerError, alertError } from "../../../helpers/alertError";
import { bulletinService } from "../../../services/bulletinService";
import { validateNote } from "../../../shared/validateNote";

interface ConduiteData {
    inscriptionId: string;
    matricule: string;
    nom: string;
    prenom: string;
    classe: string;
    conduite: number | null;
    isModified: boolean;
}

export default function ConduitePage() {
    const navigate = useNavigate();
    const { niveauSelectionne, cycleSelectionne, niveauClasseSelectionne, classeSelectionne } = useEcoleNiveau();
    const { eleves, loading } = useEleves();
    const { periodes } = usePeriodes();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPeriode, setSelectedPeriode] = useState("");
    const [conduites, setConduites] = useState<Map<string, ConduiteData>>(new Map());
    const [saving, setSaving] = useState(false);
    const [loadingConduites, setLoadingConduites] = useState(false);

    // Filtrer les périodes par niveauScolaire
    const filteredPeriodes = useMemo(() => {
        let filtered = periodes || [];
        if (niveauSelectionne) {
            filtered = filtered.filter(p => p.niveauScolaire === niveauSelectionne);
        }
        return filtered.sort((a, b) => a.ordre - b.ordre);
    }, [periodes, niveauSelectionne]);

    // Sélectionner la première période par défaut
    useEffect(() => {
        if (filteredPeriodes.length > 0 && !selectedPeriode) {
            setSelectedPeriode(filteredPeriodes[0].id);
        }
    }, [filteredPeriodes, selectedPeriode]);

    // Initialiser les conduites depuis les bulletins
    useEffect(() => {
        const loadConduites = async () => {
            if (eleves.length > 0 && selectedPeriode) {
                setLoadingConduites(true);
                const newMap = new Map();
                for (const eleve of eleves) {
                    try {
                        const bulletin = await bulletinService.getByPeriodeAndInscription({
                            periodeId: selectedPeriode,
                            inscriptionId: eleve.id
                        });
                        const conduite = bulletin?.vieScolaire?.conduite ?? null;

                        newMap.set(eleve.id, {
                            inscriptionId: eleve.id,
                            matricule: eleve.matricule || '',
                            nom: eleve.nom,
                            prenom: eleve.prenom,
                            classe: eleve.classe,
                            conduite: conduite,
                            isModified: false
                        });
                    } catch (error) {
                        console.error("Erreur chargement bulletin:", error);
                        newMap.set(eleve.id, {
                            inscriptionId: eleve.id,
                            matricule: eleve.matricule || '',
                            nom: eleve.nom,
                            prenom: eleve.prenom,
                            classe: eleve.classe,
                            conduite: null,
                            isModified: false
                        });
                    }
                }
                setConduites(newMap);
                setLoadingConduites(false);
            }
        };
        loadConduites();
    }, [eleves, selectedPeriode]);

    const filteredEleves = eleves.filter(eleve => {
        const matchesGlobal = (!niveauSelectionne || eleve.niveauScolaire === niveauSelectionne) &&
            (!cycleSelectionne || eleve.cycle === cycleSelectionne);
        const matchesLocal = (!niveauClasseSelectionne || eleve.niveauClasse === niveauClasseSelectionne) &&
            (!classeSelectionne || eleve.classe === classeSelectionne);
        const matchesSearch = searchTerm === "" ||
            (eleve.nom?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (eleve.prenom?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (eleve.matricule || "").toLowerCase().includes(searchTerm.toLowerCase());

        return matchesGlobal && matchesLocal && matchesSearch;
    });

    const handleConduiteChange = (inscriptionId: string, value: number | null) => {
        const current = conduites.get(inscriptionId);
        if (current) {
            setConduites(new Map(conduites.set(inscriptionId, {
                ...current,
                conduite: value,
                isModified: true
            })));
        }
    };

    const handleSaveConduite = async (inscriptionId: string) => {
        const data = conduites.get(inscriptionId);
        if (!data || !data.isModified) return;

        try {
            await bulletinService.save(inscriptionId, selectedPeriode, {
                vieScolaire: { conduite: data.conduite }
            });

            setConduites(new Map(conduites.set(inscriptionId, { ...data, isModified: false })));
            alertSuccess("Conduite enregistrée");
        } catch (error) {
            alertServerError(error);
        }
    };

    const handleSaveAll = async () => {
        const modified = Array.from(conduites.values()).filter(c => c.isModified);
        if (modified.length === 0) {
            alertError("Aucune modification");
            return;
        }

        setSaving(true);
        let saved = 0;

        try {
            for (const item of modified) {
                await bulletinService.save(item.inscriptionId, selectedPeriode, {
                    vieScolaire: { conduite: item.conduite }
                });
                saved++;
            }

            const newMap = new Map(conduites);
            modified.forEach(item => {
                newMap.set(item.inscriptionId, { ...item, isModified: false });
            });
            setConduites(newMap);
            alertSuccess(`${saved} conduite(s) enregistrée(s)`);
        } catch (error) {
            alertServerError(error);
        } finally {
            setSaving(false);
        }
    };

    const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!selectedPeriode) {
            alertError("Sélectionnez une période d'abord");
            return;
        }

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows: any[] = XLSX.utils.sheet_to_json(worksheet);

            let imported = 0;
            let notFound = 0;

            for (const row of rows) {
                const matricule = row.matricule || row.Matricule;
                const conduite = row.conduite || row.Conduite;

                if (!matricule || conduite === undefined) continue;

                const eleve = eleves.find(e => e.matricule === matricule);
                if (eleve) {
                    setConduites(new Map(conduites.set(eleve.id, {
                        inscriptionId: eleve.id,
                        matricule: eleve.matricule || '',
                        nom: eleve.nom,
                        prenom: eleve.prenom,
                        classe: eleve.classe,
                        conduite: conduite === "" ? null : Number(conduite),
                        isModified: true
                    })));
                    imported++;
                } else {
                    notFound++;
                }
            }

            alertSuccess(`${imported} importé(s), ${notFound} non trouvé(s)`);
        } catch (error) {
            alertServerError(error);
        }
        e.target.value = '';
    };

    const handleExportTemplate = () => {
        const template = [{ matricule: "EXEMPLE_001", conduite: "" }];
        const ws = XLSX.utils.json_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Conduites");
        XLSX.writeFile(wb, "template_conduites.xlsx");
    };

    const columns = [
        { header: "Matricule", className: "w-1/6" },
        { header: "Nom & Prénom", className: "w-1/4" },
        { header: "Classe", className: "w-1/6" },
        { header: "Conduite (0-20)", className: "w-1/6" },
        { header: "Actions", className: "w-1/6" },
    ];

    const renderRow = (eleve: any) => {
        const data = conduites.get(eleve.id);
        const conduite = data?.conduite === null ? '' : data?.conduite || '';
        const conduiteValue = data?.conduite;
        const conduiteColor = conduiteValue !== null && conduiteValue !== undefined
            ? conduiteValue >= 15 ? "text-green-600 bg-green-50"
                : conduiteValue >= 10 ? "text-yellow-600 bg-yellow-50"
                    : "text-red-600 bg-red-50"
            : "";

        return (
            <tr className={`hover:bg-gray-50 border-b border-gray-100 transition-colors duration-200 ${data?.isModified ? 'bg-yellow-50/50' : ''}`}>
                <td className="py-3 px-4 text-sm font-mono text-gray-600">{eleve.matricule || '-'}</td>
                <td className="py-3 px-4">
                    <div className="font-semibold text-gray-800">{eleve.nom} {eleve.prenom}</div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{eleve.classe}</td>
                <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.5"
                            value={conduite}
                            onChange={(e) => {
                                let value = e.target.value === '' ? null : parseFloat(e.target.value);
                                value = validateNote(value);
                                handleConduiteChange(eleve.id, value);
                            }}
                            className={`w-24 px-3 py-1.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 ${data?.isModified ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}
                            placeholder="—"
                        />
                        <span className="text-xs text-gray-400">/20</span>
                        {conduiteValue !== null && conduiteValue !== undefined && !data?.isModified && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${conduiteColor}`}>
                                {conduiteValue >= 15 ? "Excellent" : conduiteValue >= 10 ? "Correct" : "À améliorer"}
                            </span>
                        )}
                    </div>
                </td>
                <td className="py-3 px-4">
                    {data?.isModified && (
                        <button
                            onClick={() => handleSaveConduite(eleve.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 hover:scale-105"
                            title="Sauvegarder"
                        >
                            <Save size={18} />
                        </button>
                    )}
                </td>
            </tr>
        );
    };

    const modifiedCount = Array.from(conduites.values()).filter(c => c.isModified).length;

    if (loading) {
        return (
            <div className="flex justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            {/* En-tête avec animation */}
            <div className="flex items-center justify-between animate-fade-in-up">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
                    >
                        <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Noter la conduite des élèves</h1>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                            <AlertCircle size={14} />
                            {filteredEleves.length} élèves
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={selectedPeriode}
                        onChange={(e) => setSelectedPeriode(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white transition-all duration-200"
                    >
                        {filteredPeriodes.map(p => (
                            <option key={p.id} value={p.id}>{p.nom}</option>
                        ))}
                    </select>

                    <button
                        onClick={handleExportTemplate}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02]"
                    >
                        <Download size={18} className="text-gray-600" />
                        Template
                    </button>

                    <label className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:scale-[1.02]">
                        <FileSpreadsheet size={18} className="text-gray-600" />
                        Importer Excel
                        <input type="file" accept=".xlsx, .xls" onChange={handleImportExcel} className="hidden" />
                    </label>

                    {modifiedCount > 0 && (
                        <button
                            onClick={handleSaveAll}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                        >
                            <Save size={18} />
                            Sauvegarder ({modifiedCount})
                        </button>
                    )}
                </div>
            </div>

            {!selectedPeriode ? (
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6 text-center animate-fade-in-up">
                    <AlertCircle size={48} className="text-yellow-600 mx-auto mb-3" />
                    <p className="text-yellow-700 font-medium">Veuillez sélectionner une période</p>
                </div>
            ) : (
                <>
                    {/* Recherche */}
                    <div className="relative animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, prénom, matricule..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200"
                        />
                    </div>

                    {/* Filtre par onglets */}
                    <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <ClasseFilter
                            data={eleves}
                            getCycle={(e) => e.cycle || ""}
                            getNiveauClasse={(e) => e.niveauClasse || ""}
                            getClasse={(e) => e.classe || ""}
                        />
                    </div>

                    {/* Liste des élèves */}
                    {loadingConduites ? (
                        <div className="flex justify-center py-20 animate-fade-in-up">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                        </div>
                    ) : (
                        <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                            <TableList
                                items={filteredEleves}
                                columns={columns}
                                getId={(e) => e.id}
                                renderRow={renderRow}
                                selectable={false}
                                actionColumn={false}
                                emptyMessage="Aucun élève trouvé"
                            />
                        </div>
                    )}

                    {/* Légende */}
                    <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap gap-4 text-xs animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded"></div>
                            <span className="text-gray-600">Ligne jaune = modification non sauvegardée</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded-full"></div>
                            <span className="text-gray-600">Note ≥ 15 = Excellent</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded-full"></div>
                            <span className="text-gray-600">Note 10-14 = Correct</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-red-50 border border-red-200 rounded-full"></div>
                            <span className="text-gray-600">Note &lt; 10 = À améliorer</span>
                        </div>
                    </div>
                </>
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