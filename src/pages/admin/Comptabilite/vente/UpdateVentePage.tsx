// src/pages/admin/comptabilite/ventes/UpdateVentePage.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Package, Calendar, CreditCard, AlertCircle, Users } from "lucide-react";
import VenteForm from "../../../../components/admin/forms/VenteForm";
import useVentes from "../../../../hooks/ventes/useVentes";
import { alertServerError, alertSuccess } from "../../../../helpers/alertError";

export default function UpdateVentePage() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [saved, setSaved] = useState(false);
    const { updateVente } = useVentes();

    const location = useLocation();
    const vente = location.state;

    if (!vente) {
        return (
            <div className="text-center py-12 animate-fade-in-up">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} className="text-red-500" />
                    </div>
                    <p className="text-gray-500 text-center mb-4">Vente non trouvée</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300"
                    >
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    const id = vente.id;

    // Transformer les données pour le formulaire (STRUCTURE SIMPLIFIÉE - pas de lignes[])
    const initialData = {
        materielId: vente.materielId,
        quantite: vente.quantite,
        prixUnitaire: vente.prixUnitaire,
        date: vente.date,
        modePaiement: vente.modePaiement,
        eleveIds: vente.eleveId ? [vente.eleveId] : [],
        referenceExterne: vente.referenceExterne || '',
        notes: vente.notes || '',
        eleve: vente.eleve // Pour l'affichage en mode édition
    };

    const handleSubmit = async (formData: any) => {
        setIsSubmitting(true);
        try {
            // Mise à jour avec la nouvelle structure simplifiée
            await updateVente(id, {
                materielId: formData.materielId,
                quantite: Number(formData.quantite),
                prixUnitaire: Number(formData.prixUnitaire),
                eleveId: formData.eleveIds[0] || null, // En édition, un seul élève
                referenceExterne: formData.referenceExterne,
                date: formData.date,
                modePaiement: formData.modePaiement,
                notes: formData.notes
            });
            
            setSaved(true);
            alertSuccess("Vente modifiée avec succès");
            
            setTimeout(() => {
                navigate(-1);
            }, 1500);
        } catch (error) {
            alertServerError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-8">
            {/* En-tête avec animation */}
            <div className="flex items-center gap-4 animate-fade-in-up">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
                >
                    <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-800">Modifier la vente</h1>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <Edit size={14} />
                        Modifier les informations de la vente
                    </p>
                </div>
            </div>

            {/* Message de succès */}
            {saved && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-700 font-medium">Vente modifiée avec succès ! Redirection...</span>
                </div>
            )}

            {/* Informations de la vente à modifier */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="flex flex-wrap gap-4 justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                            <Package size={18} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Matériel</p>
                            <p className="font-medium text-gray-800">{vente.materielNom || vente.materielId}</p>
                        </div>
                    </div>
                    {vente.eleveNom && (
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                <Users size={18} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Élève</p>
                                <p className="font-medium text-gray-800">{vente.eleveNom}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                            <Calendar size={18} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Date de vente</p>
                            <p className="font-medium text-gray-800">{new Date(vente.date).toLocaleDateString('fr-FR')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                            <CreditCard size={18} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Mode de paiement</p>
                            <p className="font-medium text-gray-800">
                                {vente.modePaiement === 'especes' ? 'Espèces' :
                                 vente.modePaiement === 'mobile_money' ? 'Mobile money' :
                                 vente.modePaiement === 'virement' ? 'Virement bancaire' :
                                 vente.modePaiement === 'cheque' ? 'Chèque' : vente.modePaiement}
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* Affichage du montant total */}
                <div className="mt-3 pt-3 border-t border-blue-200 flex justify-end">
                    <div className="text-right">
                        <p className="text-xs text-gray-500">Montant total</p>
                        <p className="text-lg font-bold text-primary">
                            {new Intl.NumberFormat('fr-FR').format(vente.quantite * vente.prixUnitaire)} FCFA
                        </p>
                        <p className="text-xs text-gray-400">
                            {vente.quantite} × {new Intl.NumberFormat('fr-FR').format(vente.prixUnitaire)} FCFA
                        </p>
                    </div>
                </div>
            </div>

            {/* Formulaire */}
            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <VenteForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate(-1)}
                    isSubmitting={isSubmitting}
                />
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
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
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
            `}</style>
        </div>
    );
}