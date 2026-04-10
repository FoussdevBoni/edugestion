// src/pages/admin/configuration/ecole/UpdateEcoleInfosPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle, Edit } from "lucide-react";
import { EcoleInfo } from "../../../../utils/types/data";
import { photoService } from "../../../../services/photoService";
import EcoleInfosForm from "../../../../components/admin/forms/EcoleInfosForm";
import { alertSuccess, alertError } from "../../../../helpers/alertError";
import { useRefresh } from "../../../../contexts/RefreshContext";
import useEcoleInfos from "../../../../hooks/ecoleInfos/useEcoleInfos";

export default function UpdateEcoleInfosPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const ecoleData = location.state as EcoleInfo;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialFormData, setInitialFormData] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const { triggerRefresh } = useRefresh();
  const {updateEcoleInfos , getEcoleInfos} = useEcoleInfos()
  useEffect(() => {
    const loadImages = async () => {
      if (!ecoleData) return;

      let logoBase64 = null;
      let enTeteBase64 = null;

      if (ecoleData.logo) {
        logoBase64 = await photoService.getFileBase64(ecoleData.logo, 'upload');
      }

      if (ecoleData.enTeteCarte) {
        enTeteBase64 = await photoService.getFileBase64(ecoleData.enTeteCarte, 'upload');
      }

      setInitialFormData({
        ...ecoleData,
        logo: logoBase64,
        enTeteCarte: enTeteBase64
      });
    };

    loadImages();
  }, [ecoleData]);

  if (!ecoleData) {
    navigate("/admin/configuration/ecole");
    return null;
  }

  if (!initialFormData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);

      let logoFileName = ecoleData.logo;
      if (formData.logo && formData.logo !== ecoleData.logo) {
        const logoResult = await photoService.uploadFile({
          base64: formData.logo,
          type: 'logo',
          nom: 'logo_ecole.png'
        });
        logoFileName = logoResult.fileName;
      }

      let enTeteFileName = ecoleData.enTeteCarte;
      if (formData.enTeteCarte && formData.enTeteCarte !== ecoleData.enTeteCarte) {
        const enTeteResult = await photoService.uploadFile({
          base64: formData.enTeteCarte,
          type: 'enTeteCarte',
          nom: 'entete_carte.png'
        });
        enTeteFileName = enTeteResult.fileName;
      }

      const updateData = {
        ...formData,
        logo: logoFileName,
        enTeteCarte: enTeteFileName
      };

      await updateEcoleInfos(updateData);
      getEcoleInfos()
      setSaved(true);
      triggerRefresh()
      alertSuccess("Informations de l'école mises à jour avec succès");

      setTimeout(() => {
        navigate("/admin/configuration/ecole");
      }, 1500);
    } catch (error) {
      console.error("Erreur mise à jour:", error);
      alertError("Erreur lors de la mise à jour");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Message de succès */}
      {saved && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <CheckCircle size={20} className="text-green-600" />
          <span className="text-green-700 font-medium">Informations mises à jour avec succès ! Redirection...</span>
        </div>
      )}

      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button
          onClick={() => navigate("/admin/configuration/ecole")}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier l'école</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Edit size={14} />
            {ecoleData.nom}
          </p>
        </div>
      </div>

      {/* Formulaire avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <EcoleInfosForm
          initialData={initialFormData}
          title="Modifier l'école"
          submitLabel="Mettre à jour"
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => navigate("/admin/configuration/ecole")}
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