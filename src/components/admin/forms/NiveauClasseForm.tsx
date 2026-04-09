import { useState, useEffect } from "react";
import useCycles from "../../../hooks/cycles/useCycles";

export interface NiveauClasseFormData {
    id?: string;
    nom: string;
    cycleId: string;
    cycle: string;
    niveauScolaire: string;
    autoCreateClass?: boolean;
    hasMultipleDivisions?: boolean; // Indique si le niveau a plusieurs divisions
    divisions?: string[]; // Liste des divisions (A, B, C...)
}

interface NiveauClasseFormProps {
    initialData?: NiveauClasseFormData;
    onSubmit: (data: NiveauClasseFormData[]) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export default function NiveauClasseForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false
}: NiveauClasseFormProps) {
    const { cycles } = useCycles();
    const isUpdate = !!initialData;
    const [isMultiple, setIsMultiple] = useState(false);
    
    // Pour le mode avec divisions
    const [hasMultipleDivisions, setHasMultipleDivisions] = useState(false);
    const [divisions, setDivisions] = useState<string>("");
    
    const [formData, setFormData] = useState<NiveauClasseFormData>(
        initialData || {
            nom: "",
            cycleId: "",
            cycle: "",
            niveauScolaire: "",
            autoCreateClass: true,
            hasMultipleDivisions: false,
            divisions: []
        }
    );

    const [errors, setErrors] = useState<Partial<Record<keyof NiveauClasseFormData, string>>>({});

    useEffect(() => {
        if (formData.cycleId) {
            const cycle = cycles.find(c => c.id === formData.cycleId);
            if (cycle) {
                setFormData(prev => ({
                    ...prev,
                    cycle: cycle.nom,
                    niveauScolaire: cycle.niveauScolaire
                }));
            }
        }
    }, [formData.cycleId, cycles]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.nom.trim() || !formData.cycleId) {
            setErrors({
                nom: "Le nom est requis",
                cycleId: !formData.cycleId ? "Le cycle est requis" : ""
            });
            return;
        }

        // Si modification : on envoie juste l'objet unique dans un tableau
        if (isUpdate) {
            onSubmit([formData]);
            return;
        }

        let niveauxAcreer: NiveauClasseFormData[] = [];

        if (isMultiple) {
            // Mode multiple : plusieurs niveaux différents (6ème, 5ème, 4ème)
            const noms = formData.nom.split(",").map(s => s.trim()).filter(s => s !== "");
            niveauxAcreer = noms.map(nom => ({
                ...formData,
                nom: nom,
                autoCreateClass: false,
                hasMultipleDivisions: false,
                divisions: []
            }));
        } else {
            // Mode unique : un seul niveau
            if (hasMultipleDivisions) {
                // Le niveau a plusieurs divisions (ex: 6ème A, 6ème B, 6ème C)
                const divisionsList = divisions.split(",").map(d => d.trim()).filter(d => d !== "");
                const niveauNom = formData.nom.trim();
                
                // Créer un seul niveau
                niveauxAcreer = [{
                    ...formData,
                    nom: niveauNom,
                    autoCreateClass: true,
                    hasMultipleDivisions: true,
                    divisions: divisionsList
                }];
            } else {
                // Le niveau a une seule division
                niveauxAcreer = [{
                    ...formData,
                    nom: formData.nom.trim(),
                    autoCreateClass: true,
                    hasMultipleDivisions: false,
                    divisions: []
                }];
            }
        }

        onSubmit(niveauxAcreer);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 1. Message d'astuce (Masqué en modification) */}
            {!isUpdate && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                    <span className="text-blue-500 text-xl">💡</span>
                    <div>
                        <p className="text-blue-800 text-sm font-bold">Mode Création Rapide</p>
                        <p className="text-blue-700 text-xs mt-1">
                            Séparez les noms par des virgules pour créer plusieurs niveaux d'un coup.
                        </p>
                    </div>
                </div>
            )}

            <div className="space-y-5">
                {/* 2. Sélection du Cycle */}
                <div>
                    <label className="block text-gray-700 font-bold mb-2 text-sm uppercase">Cycle de rattachement</label>
                    <select
                        value={formData.cycleId}
                        onChange={(e) => setFormData({...formData, cycleId: e.target.value})}
                        className={`w-full p-3 border-2 rounded-xl outline-none transition ${
                            errors.cycleId ? 'border-red-500' : 'border-gray-100 focus:border-primary'
                        }`}
                    >
                        <option value="">-- Sélectionner le cycle --</option>
                        {cycles.map(c => (
                            <option key={c.id} value={c.id}>{c.nom} ({c.niveauScolaire})</option>
                        ))}
                    </select>
                    {errors.cycleId && <p className="text-red-500 text-xs mt-1">{errors.cycleId}</p>}
                </div>

                {/* 3. Toggle Mode (Masqué en modification) */}
                {!isUpdate && (
                    <div>
                        <label className="block text-gray-700 font-bold mb-2 text-sm uppercase">Méthode d'ajout</label>
                        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-fit">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsMultiple(false);
                                    setHasMultipleDivisions(false);
                                }}
                                className={`px-4 py-2 rounded-lg transition text-xs font-bold ${!isMultiple ? 'bg-white shadow-sm text-primary' : 'text-gray-400'}`}
                            >
                                Unique
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsMultiple(true)}
                                className={`px-4 py-2 rounded-lg transition text-xs font-bold ${isMultiple ? 'bg-white shadow-sm text-primary' : 'text-gray-400'}`}
                            >
                                Multiple (6ème, 5ème...)
                            </button>
                        </div>
                    </div>
                )}

                {/* 4. Saisie du nom du niveau */}
                <div>
                    <label className="block text-gray-700 font-bold mb-2 text-sm uppercase">
                        {isMultiple ? "Noms des niveaux (séparés par des virgules)" : "Nom du niveau"}
                    </label>
                    <input
                        type="text"
                        value={formData.nom}
                        onChange={(e) => {
                            setFormData({...formData, nom: e.target.value});
                            if(errors.nom) setErrors({...errors, nom: ""});
                        }}
                        className={`w-full p-3 border-2 rounded-xl outline-none transition ${
                            errors.nom ? 'border-red-500' : 'border-gray-100 focus:border-primary'
                        }`}
                        placeholder={isMultiple ? "Ex: 6ème, 5ème, 4ème" : "Ex: 6ème"}
                    />
                    {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}

                    {/* Option: Le niveau a plusieurs divisions (UNIQUEMENT en mode unique) */}
                    {!isUpdate && !isMultiple && formData.nom && (
                        <div className="mt-4 space-y-4">
                            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                                <input
                                    type="checkbox"
                                    id="hasMultipleDivisions"
                                    checked={hasMultipleDivisions}
                                    onChange={(e) => setHasMultipleDivisions(e.target.checked)}
                                    className="mt-1 w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                                />
                                <div>
                                    <label htmlFor="hasMultipleDivisions" className="font-bold text-purple-800 text-sm cursor-pointer">
                                        Ce niveau a plusieurs divisions (A, B, C...)
                                    </label>
                                    <p className="text-purple-600 text-xs mt-1">
                                        Exemple: Le niveau 6ème a plusieurs classes: 6ème A, 6ème B, 6ème C
                                    </p>
                                </div>
                            </div>

                            {/* Saisie des divisions */}
                            {hasMultipleDivisions && (
                                <div className="p-4 bg-white rounded-xl border border-purple-200 space-y-3">
                                    <label className="block text-gray-700 font-bold text-sm uppercase">
                                        Divisions (séparées par des virgules)
                                    </label>
                                    <input
                                        type="text"
                                        value={divisions}
                                        onChange={(e) => setDivisions(e.target.value)}
                                        className="w-full p-3 border-2 border-gray-100 rounded-xl outline-none focus:border-primary"
                                        placeholder="Ex: A, B, C"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Les classes seront créées automatiquement: {formData.nom} {divisions.split(",").map(d => d.trim()).filter(d => d).join(", ")}
                                    </p>
                                    
                                    {/* Aperçu des classes à créer */}
                                    {divisions && (
                                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                                            <p className="text-xs font-bold text-green-700 mb-2">📋 Classes à créer :</p>
                                            <div className="flex flex-wrap gap-2">
                                                {divisions.split(",").map((d, i) => d.trim() && (
                                                    <div key={i} className="bg-green-100 px-3 py-1 rounded-lg">
                                                        <span className="text-sm font-medium text-green-800">
                                                            {formData.nom} {d.trim()}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Message pour création automatique */}
                            {!hasMultipleDivisions && (
                                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                    <div className="flex items-start gap-3">
                                        <span className="text-green-500 text-lg">✅</span>
                                        <div>
                                            <p className="font-bold text-green-800 text-sm">Création automatique</p>
                                            <p className="text-green-600 text-xs">
                                                Une classe "{formData.nom}" sera automatiquement créée.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Message pour mode multiple */}
                    {!isUpdate && isMultiple && formData.nom && (
                        <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                            <p className="text-yellow-700 text-sm">
                                ⚠️ Vous créez plusieurs niveaux différents. Aucune classe ne sera créée automatiquement.
                                Vous pourrez ajouter les classes pour chaque niveau après.
                            </p>
                        </div>
                    )}

                    {/* Prévisualisation */}
                    {!isUpdate && formData.nom && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">Aperçu :</p>
                            
                            {isMultiple ? (
                                <div className="flex flex-wrap gap-2">
                                    {formData.nom.split(",").map((s, i) => s.trim() && (
                                        <div key={i} className="flex items-center bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
                                            <span className="text-sm font-bold text-gray-700">{s.trim()}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm w-fit">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></span>
                                        <span className="text-sm font-bold text-gray-700">{formData.nom.trim()}</span>
                                    </div>
                                    
                                    {hasMultipleDivisions && divisions && (
                                        <div className="mt-3 pt-3 border-t border-dashed border-gray-300">
                                            <p className="text-[10px] uppercase tracking-wider text-green-400 font-bold mb-2">Classes à créer :</p>
                                            <div className="flex flex-wrap gap-2">
                                                {divisions.split(",").map((d, i) => d.trim() && (
                                                    <div key={i} className="flex items-center bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                                                        <span className="text-sm font-bold text-green-700">{formData.nom} {d.trim()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* 5. Boutons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                <button type="button" onClick={onCancel} className="px-6 py-2 text-gray-400 font-bold hover:bg-gray-50 rounded-xl transition">
                    Annuler
                </button>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-95 transition-all"
                >
                    {isSubmitting ? "Enregistrement..." : isUpdate ? "Mettre à jour" : "Enregistrer"}
                </button>
            </div>
        </form>
    );
}