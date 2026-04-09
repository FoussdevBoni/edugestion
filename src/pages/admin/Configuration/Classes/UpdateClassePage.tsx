import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import ClasseForm, { ClasseFormData } from "../../../../components/admin/forms/ClasseForm";
import { classeService } from "../../../../services/classeService";
import { BaseClasse } from "../../../../utils/types/base";
import { alertError } from "../../../../helpers/alertError";


interface PagesProps {
  config?: boolean
}
export default function UpdateClassePage({}: PagesProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Récupération des données passées via le state de la navigation
  const classeData = location.state;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [classe, setClasse] = useState<ClasseFormData | null>(null);

  useEffect(() => {
    const fetchClasse = async () => {
      setIsLoading(true);
      try {
        // Simulation d'un léger délai pour le confort visuel (optionnel)
        await new Promise(resolve => setTimeout(resolve, 300));

        if (classeData) {
          // On mappe les données reçues vers le format attendu par le formulaire
          setClasse({
            id: classeData.id,
            nom: classeData.nom,
            niveauClasseId: classeData.niveauClasseId,
            niveauClasse: classeData.niveauClasse,
            cycle: classeData.cycle,
            niveauScolaire: classeData.niveauScolaire,
            effectifF: classeData.effectifF,
            effectifM: classeData.effectifM
          });
        } 
      } catch (error) {
        console.error("Erreur lors du chargement de la classe:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasse();
  }, [classeData]);

  // CORRECTION DU TYPE : dataArray est un tableau car ClasseForm.onSubmit envoie ClasseFormData[]
  const handleSubmit = async (dataArray: ClasseFormData[]) => {
    // En mode modification, on sait qu'il n'y a qu'un seul élément
    const data = dataArray[0];

    if (!data || !data.id) {
      alertError();
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Mise à jour de la classe en cours...", data);
      
      const updatedFields: Partial<BaseClasse> = {
        nom: data.nom,
        niveauClasseId: data.niveauClasseId,
        effectifF: data.effectifF,
        effectifM: data.effectifM
        // Ajoute ici d'autres champs si nécessaire
      };

      await classeService.update(data.id, updatedFields);
      
      // Retour à la liste après succès
      navigate(-1);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alertError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // --- ÉTATS DE RENDU (CHARGEMENT ET ERREUR) ---

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 size={40} className="animate-spin text-primary mb-4" />
        <p className="text-gray-500 font-medium italic">Récupération de la classe...</p>
      </div>
    );
  }

  if (!classe) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-10 text-center">
          <AlertCircle size={60} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-black text-red-800 mb-2">Oups ! Classe introuvable</h2>
          <p className="text-red-600/70 mb-6">Les informations de cette classe ne sont plus disponibles ou ont été déplacées.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-white border-2 border-red-200 text-red-600 rounded-2xl font-bold hover:bg-red-50 transition-all"
          >
            Retourner à la liste
          </button>
        </div>
      </div>
    );
  }

  // --- RENDU DU FORMULAIRE ---

  return (
    <div className="max-w-4xl mt-5  mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-5">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-white border-2 border-gray-100 rounded-2xl hover:border-primary hover:text-primary transition-all shadow-sm"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Modifier la classe</h1>
          <p className="text-gray-500 font-medium">
            Mise à jour de <span className="text-primary font-bold">{classe.nom}</span> ({classe.niveauClasse})
          </p>
        </div>
      </div>

      {/* Card Formulaire */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <ClasseForm
          initialData={classe}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
          Toute modification impactera l'emploi du temps et les listes d'élèves
        </p>
      </div>
    </div>
  );
}