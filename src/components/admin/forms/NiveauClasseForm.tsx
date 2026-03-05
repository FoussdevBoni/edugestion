// src/components/forms/NiveauClasseForm.tsx
import { useState, useEffect } from "react";
import { cycles } from "../../../data/baseData";


export interface NiveauClasseFormData {
    id?: string;
    nom: string;
    cycleId: string;
    cycle: string;
    niveauScolaire: string;
}

interface NiveauClasseFormProps {
    initialData?: NiveauClasseFormData;
    onSubmit: (data: NiveauClasseFormData) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export default function NiveauClasseForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false
}: NiveauClasseFormProps) {
    const [formData, setFormData] = useState<NiveauClasseFormData>(
        initialData || {
            nom: "",
            cycleId: "",
            cycle: "",
            niveauScolaire: "",
        }
    );

    const [errors, setErrors] = useState<Partial<Record<keyof NiveauClasseFormData, string>>>({});

    // Mettre à jour les infos du cycle quand l'ID change
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
    }, [formData.cycleId]);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof NiveauClasseFormData, string>> = {};

        if (!formData.nom.trim()) {
            newErrors.nom = "Le nom du niveau de classe est requis";
        }
        if (!formData.cycleId) {
            newErrors.cycleId = "Le cycle est requis";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    const handleChange = (field: keyof NiveauClasseFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    // Grouper les cycles par niveau scolaire
    const cyclesParNiveau = cycles.reduce((acc, cycle) => {
        if (!acc[cycle.niveauScolaire]) {
            acc[cycle.niveauScolaire] = [];
        }
        acc[cycle.niveauScolaire].push(cycle);
        return acc;
    }, {} as Record<string, typeof cycles>);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Informations du niveau de classe
                </h3>

                <div className="space-y-4">
                    {/* Cycle */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cycle <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.cycleId}
                            onChange={(e) => handleChange("cycleId", e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.cycleId ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Sélectionner un cycle</option>
                            {Object.entries(cyclesParNiveau).map(([niveau, cyclesList]) => (
                                <optgroup key={niveau} label={niveau}>
                                    {cyclesList.map(cycle => (
                                        <option key={cycle.id} value={cycle.id}>
                                            {cycle.nom}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        {errors.cycleId && (
                            <p className="mt-1 text-sm text-red-500">{errors.cycleId}</p>
                        )}
                    </div>

                    {/* Nom du niveau de classe */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom du niveau de classe <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.nom}
                            onChange={(e) => handleChange("nom", e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.nom ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Ex: 6ème, 5ème, CM1, etc."
                        />
                        {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
                    </div>

                    {/* Aperçu des infos dérivées (lecture seule) */}
                    {formData.cycle && (
                        <div className="bg-gray-50 rounded-lg p-3 text-sm">
                            <p className="text-gray-700">
                                <span className="font-medium">Cycle :</span> {formData.cycle}
                            </p>
                            <p className="text-gray-700 mt-1">
                                <span className="font-medium">Niveau scolaire :</span> {formData.niveauScolaire}
                            </p>
                        </div>
                    )}

                    {/* Note informative */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                        <p>
                            <strong>Note :</strong> Après la création du niveau de classe, vous pourrez lui ajouter des classes (avec sections).
                        </p>
                    </div>
                </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                    {isSubmitting ? "Enregistrement..." : initialData ? "Mettre à jour" : "Créer le niveau"}
                </button>
            </div>
        </form>
    );
}