// src/pages/admin/comptabilite/ventes/NouvelleVentePage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PackagePlus, CheckCircle, Users } from "lucide-react";
import VenteForm from "../../../../components/admin/forms/VenteForm";
import { venteService } from "../../../../services/venteService";
import { materielService } from "../../../../services/materielService";
import { BaseVente } from "../../../../utils/types/base";
import { alertServerError, alertSuccess } from "../../../../helpers/alertError";

export default function NouvelleVentePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    const ventesCrees: any[] = [];

    try {
      // Vérifier le stock avant création
      const materiel = await materielService.getById(formData.materielId);
      const besoinTotal = formData.quantite * formData.eleveIds.length;
      
      if ((materiel?.quantite || 0) < besoinTotal) {
        throw new Error(`Stock insuffisant pour ${materiel?.nom}. Disponible: ${materiel?.quantite}, Besoin: ${besoinTotal}`);
      }

      // Créer une vente pour chaque élève sélectionné
      for (const eleveId of formData.eleveIds) {
        const venteData: BaseVente = {
          materielId: formData.materielId,
          quantite: formData.quantite,
          prixUnitaire: formData.prixUnitaire,
          eleveId: eleveId,
          referenceExterne: formData.referenceExterne,
          date: formData.date,
          createdBy: "system",
          modePaiement: formData.modePaiement,
          notes: formData.notes
        };
        
        const nouvelleVente = await venteService.create(venteData);
        ventesCrees.push(nouvelleVente);
      }
      
      // Mettre à jour le stock (une seule fois)
      const nouvelleQuantite = (materiel?.quantite || 0) - besoinTotal;
      await materielService.update(formData.materielId, { quantite: nouvelleQuantite });
      
      setSaved(true);
      alertSuccess(`${ventesCrees.length} vente(s) enregistrée(s) avec succès`);
      
      setTimeout(() => {
        navigate("/admin/comptabilite/ventes");
      }, 2000);
      
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement:", error);
      
      // Rollback en cas d'erreur
      if (ventesCrees.length > 0) {
        for (const vente of ventesCrees) {
          try {
            await venteService.delete(vente.id);
          } catch (e) {
            console.error("Échec du rollback:", e);
          }
        }
      }
      
      alertServerError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAjouterMateriel = () => {
    navigate("/admin/comptabilite/materiel/new");
  };

  const handleAjouterEleve = () => {
    navigate("/admin/eleves/new");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
          >
            <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Nouvelle vente</h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <PackagePlus size={14} />
              Enregistrer la vente de matériel aux élèves
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAjouterEleve}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-md transition-all duration-300"
          >
            <Users size={18} />
            Nouvel élève
          </button>
          <button
            onClick={handleAjouterMateriel}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-md transition-all duration-300"
          >
            <PackagePlus size={18} />
            Nouveau matériel
          </button>
        </div>
      </div>

      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">
            Ventes enregistrées avec succès ! Redirection...
          </span>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-start gap-3">
          <div className="p-1 bg-white rounded-full shadow-sm">
            <span className="text-primary text-sm font-bold block px-2">i</span>
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-700 mb-1">Informations importantes</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Vous pouvez vendre à plusieurs élèves en même temps</li>
              <li>La quantité saisie est la quantité PAR ÉLÈVE</li>
              <li>Le stock total nécessaire = quantité × nombre d'élèves</li>
              <li>Le stock du matériel est automatiquement diminué après la vente</li>
              <li>Une transaction est créée pour chaque élève</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <VenteForm
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