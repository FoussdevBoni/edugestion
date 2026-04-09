// src/pages/admin/inscriptions/UpdateInscriptionPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import InscriptionForm, { InscriptionFormData } from "../../../components/admin/forms/InscriptionForm";
import { inscriptions } from "../../../data/inscriptions";

export default function UpdateInscriptionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const inscriptionData = location.state;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inscription, setInscription] = useState<InscriptionFormData | null>(null);

  useEffect(() => {
    const fetchInscription = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
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
            lieuDeNaissance: inscriptionData.lieuDeNaissance,
            contact: inscriptionData.contact
          });
        } else {
          // Fallback: prendre la première inscription pour l'exemple
          setInscription({
            id: inscriptions[0].id,
            anneeScolaire: inscriptions[0].anneeScolaire,
            dateInscription: inscriptions[0].dateInscription,
            statutScolaire: inscriptions[0].statutScolaire,
            classeId: inscriptions[0].classeId,
            classe: inscriptions[0].classe,
            niveauClasse: inscriptions[0].niveauClasse,
            cycle: inscriptions[0].cycle,
            niveauScolaire: inscriptions[0].niveauScolaire,
            nom: inscriptions[0].nom,
            prenom: inscriptions[0].prenom,
            dateNaissance: inscriptions[0].dateNaissance,
            sexe: inscriptions[0].sexe,
            photo: inscriptions[0].photo,
            lieuDeNaissance: inscriptions[0].lieuDeNaissance!,
            contact: inscriptions[0].contact!
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
      console.log("Mise à jour de l'inscription:", data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate("/admin/inscriptions");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/inscriptions");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Chargement des informations...</p>
        </div>
      </div>
    );
  }

  if (!inscription) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/inscriptions")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Modifier l'inscription</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-700 mb-2">
            Inscription introuvable
          </h2>
          <button
            onClick={() => navigate("/admin/inscriptions")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/inscriptions")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier l'inscription</h1>
          <p className="text-sm text-gray-500 mt-1">
            {inscription.prenom} {inscription.nom} - {inscription.classe}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <InscriptionForm
          initialData={inscription}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}