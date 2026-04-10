import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle, Edit, User, BookOpen, Calendar } from "lucide-react";
import InscriptionForm, { InscriptionFormData } from "../../../components/admin/forms/InscriptionForm";
import { inscriptionService } from "../../../services/inscriptionService";
import { alertError, alertSuccess } from "../../../helpers/alertError";
import { eleveDataService } from "../../../services/eleveDataService";
import { Inscription } from "../../../utils/types/data";

export default function UpdateInscriptionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const inscriptionData: Inscription = location.state;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inscription, setInscription] = useState<InscriptionFormData | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchInscription = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (inscriptionData) {
          setInscription({
            id: inscriptionData.id,
            anneeScolaire: inscriptionData.anneeScolaire,
            dateInscription: inscriptionData.dateInscription,
            statutScolaire: inscriptionData.statutScolaire,
            classeId: inscriptionData.classeId,
            classe: inscriptionData.classe,
            niveauClasse: inscriptionData.niveauClasse,
            cycle: inscriptionData.cycle,
            niveauScolaire: inscriptionData.niveauScolaire,
            nom: inscriptionData.nom,
            prenom: inscriptionData.prenom,
            dateNaissance: inscriptionData.dateNaissance,
            sexe: inscriptionData.sexe,
            photo: inscriptionData.photo,
            lieuDeNaissance: inscriptionData.lieuDeNaissance!,
            contact: inscriptionData.contact!
          });
        } 
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInscription();
  }, [inscriptionData]);

  const handleSubmit = async (data: InscriptionFormData) => {
    setIsSubmitting(true);
    try {

      await eleveDataService.update(inscriptionData.eleveDataId , {
        ...data
        
      })
      
      await inscriptionService.update(inscriptionData.id!, {
        ...data,
        
      });

      setSaved(true);

      alertSuccess("Inscription modifiée avec succès");

      setTimeout(() => {
        navigate("/admin/inscriptions");
      }, 1500);

    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alertError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/inscriptions");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in-up">
        <Loader2 size={40} className="animate-spin text-primary mb-4" />
        <p className="text-gray-500 font-medium">Chargement des informations...</p>
      </div>
    );
  }

  if (!inscription) {
    return (
      <div className="max-w-2xl mx-auto mt-10 animate-fade-in-up">
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-10 text-center">
          <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Inscription introuvable</h2>
          <p className="text-red-600 mb-6">Les informations de cette inscription ne sont plus disponibles.</p>
          <button
            onClick={() => navigate("/admin/inscriptions")}
            className="px-6 py-3 bg-white border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-all duration-300"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">Inscription modifiée avec succès ! Redirection...</span>
        </div>
      )}

      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button
          onClick={() => navigate("/admin/inscriptions")}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier l'inscription</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Edit size={14} />
            {inscription.prenom} {inscription.nom} - {inscription.classe}
          </p>
        </div>
      </div>

      {/* Informations récapitulatives */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <User size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Élève</p>
              <p className="font-medium text-gray-800">{inscription.prenom} {inscription.nom}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <BookOpen size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Classe</p>
              <p className="font-medium text-gray-800">{inscription.classe}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Calendar size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Année scolaire</p>
              <p className="font-medium text-gray-800">{inscription.anneeScolaire}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <InscriptionForm
          initialData={inscription}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
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