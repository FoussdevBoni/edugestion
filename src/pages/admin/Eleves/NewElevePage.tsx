// src/pages/admin/eleves/NewElevePage.tsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, UserPlus, Camera, Upload, X, User } from "lucide-react";
import { useEcoleNiveau } from "../../../hooks/filters/useEcoleNiveau";
import EleveForm, { EleveFormData } from "../../../components/admin/forms/EleveForm";
import { inscriptionService } from "../../../services/inscriptionService";
import { alertServerError, alertSuccess, alertError } from "../../../helpers/alertError";
import { photoService } from "../../../services/photoService";

export default function NewElevePage() {
  const navigate = useNavigate();
  const { niveauSelectionne, cycleSelectionne } = useEcoleNiveau();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  // États pour la photo
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alertError("Veuillez sélectionner une image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alertError("L'image ne doit pas dépasser 5MB");
      return;
    }

    setPhotoFile(file);
    const preview = URL.createObjectURL(file);
    setPhotoPreview(preview);
    setShowPhotoModal(true);
  };

  const cancelPhoto = () => {
    setShowPhotoModal(false);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
    setPhotoFile(null);
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setPhotoFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (data: EleveFormData) => {
    setIsSubmitting(true);
    try {
      const nouvelEleve = {
        nom: data.nom,
        prenom: data.prenom,
        dateNaissance: data.dateNaissance,
        sexe: data.sexe,
        lieuDeNaissance: data.lieuDeNaissance || "",
        contact: data.contact || "",
        photo: "",
        anneeScolaire: data.anneeScolaire,
        statutScolaire: data.statutScolaire,
        classeId: data.classeId,
        matricule: data.matricule,
      };

      console.log("Création d'un nouvel élève:", nouvelEleve);
      const result = await inscriptionService.inscrireNouvelEleve(nouvelEleve);

      // Après la création réussie, uploader la photo si elle existe
      if (photoFile && result?.matricule) {
        setUploadingPhoto(true);
        try {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(photoFile);
          });

          await photoService.uploadElevePhoto(result.matricule, base64);
        } catch (photoError) {
          console.error("Erreur lors de l'upload de la photo:", photoError);
          alertError("Élève créé mais erreur lors de l'ajout de la photo");
        } finally {
          setUploadingPhoto(false);
        }
      }

      setSaved(true);
      alertSuccess("Élève inscrit avec succès");

      setTimeout(() => {
        navigate("/admin/eleves");
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      alertServerError(error, "Erreur lors de l'inscription de l'élève");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/eleves");
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">Élève inscrit avec succès ! Redirection...</span>
        </div>
      )}

      {/* Message d'upload photo */}
      {uploadingPhoto && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-blue-700 font-medium">Ajout de la photo en cours...</span>
        </div>
      )}

      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button
          onClick={() => navigate("/admin/eleves")}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
          title="Retour à la liste"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nouvel élève</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <UserPlus size={14} />
            Remplissez le formulaire pour inscrire un nouvel élève
          </p>
        </div>
      </div>

      {/* Photo de l'élève */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <div className="relative">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Aperçu"
                className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                <User size={24} className="text-gray-400" />
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-1.5 bg-primary text-white rounded-full shadow-md hover:bg-primary/90 transition-all duration-300"
            >
              <Camera size={12} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">Photo de l’élève (format carré recommandé)</p>
            <p className="text-xs text-gray-500">Optionnel - Max 5MB</p>
            {photoPreview && (
              <button
                onClick={removePhoto}
                className="text-xs text-red-500 hover:text-red-700 mt-1"
              >
                Supprimer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Indicateur des filtres actifs */}
      {(niveauSelectionne || cycleSelectionne) && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Filtres actifs :</span>{" "}
            {niveauSelectionne && <span className="text-primary font-medium">{niveauSelectionne}</span>}
            {niveauSelectionne && cycleSelectionne && " - "}
            {cycleSelectionne && <span className="text-primary font-medium">{cycleSelectionne}</span>}
            <span className="ml-2 text-gray-500">
              (La classe sera pré-filtrée en conséquence)
            </span>
          </p>
        </div>
      )}

      {/* Formulaire avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <EleveForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting || uploadingPhoto}
        />
      </div>

      {/* Modal d'aperçu photo */}
      {showPhotoModal && photoPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in-up">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Aperçu de la photo</h3>
              <button
                onClick={cancelPhoto}
                className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 flex flex-col items-center">
              <img
                src={photoPreview}
                alt="Aperçu"
                className="w-48 h-48 rounded-full object-cover border-4 border-primary/20 shadow-lg mb-4"
              />
              <p className="text-sm text-gray-600 mb-4">
                {photoFile?.name} ({(photoFile?.size || 0 / 1024).toFixed(1)} KB)
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={cancelPhoto}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300"
                >
                  Annuler
                </button>
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300"
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message d'aide */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <div className="flex items-start gap-3">
          <div className="p-1 bg-white rounded-full shadow-sm">
            <span className="text-primary text-sm font-bold block px-2">i</span>
          </div>
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-700 mb-1">Informations</p>
            <p>
              Les champs marqués d'un astérisque (<span className="text-red-500 font-medium">*</span>) sont obligatoires.
              Un matricule unique sera automatiquement généré pour l'élève.
            </p>
          </div>
        </div>
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