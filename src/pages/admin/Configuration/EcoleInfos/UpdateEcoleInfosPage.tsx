// src/pages/admin/configuration/ecole/UpdateInfosPage.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Save, X, Upload, School } from "lucide-react";
import { ecoleInfos } from "../../../../data/ecoleInfos";
import { EcoleInfo } from "../../../../utils/types/data";

export default function UpdateEcoleInfosPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const ecoleData = location.state || ecoleInfos;

  const [formData, setFormData] = useState<EcoleInfo>({
    id: ecoleData.id || "",
    nom: ecoleData.nom || "",
    logo: ecoleData.logo || "",
    adresse: ecoleData.adresse || "",
    telephone: ecoleData.telephone || "",
    email: ecoleData.email || "",
    siteWeb: ecoleData.siteWeb || "",
    anneeScolaire: ecoleData.anneeScolaire || "",
    devise: ecoleData.devise || "",
    createdAt: ecoleData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EcoleInfo, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(formData.logo || null);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EcoleInfo, string>> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom de l'école est requis";
    }
    if (!formData.adresse.trim()) {
      newErrors.adresse = "L'adresse est requise";
    }
    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le téléphone est requis";
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    if (!formData.anneeScolaire.trim()) {
      newErrors.anneeScolaire = "L'année scolaire est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        // Simulation d'appel API
        console.log("Mise à jour des informations:", formData);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Rediriger vers la page d'informations
        navigate("/admin/configuration/ecole");
      } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (field: keyof EcoleInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoPreview(base64String);
        setFormData(prev => ({ ...prev, logo: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Retour aux informations"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Modifier les informations</h1>
          <p className="text-sm text-gray-500 mt-1">
            Mettez à jour les informations générales de l'établissement
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo et nom */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Identité de l'école</h2>
          
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-200">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <School size={40} className="text-primary" />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 p-1.5 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 shadow-md">
                <Upload size={14} />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleLogoUpload}
                />
              </label>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'école <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => handleChange("nom", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.nom ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nom de l'établissement"
              />
              {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Devise / Slogan
            </label>
            <input
              type="text"
              value={formData.devise}
              onChange={(e) => handleChange("devise", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Ex: Savoir, Excellence, Réussite"
            />
          </div>
        </div>

        {/* Coordonnées */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Coordonnées</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Adresse */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.adresse}
                onChange={(e) => handleChange("adresse", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.adresse ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Adresse complète"
              />
              {errors.adresse && <p className="mt-1 text-sm text-red-500">{errors.adresse}</p>}
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => handleChange("telephone", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.telephone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+228 XX XX XX XX"
              />
              {errors.telephone && <p className="mt-1 text-sm text-red-500">{errors.telephone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="contact@ecole.tg"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Site Web */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Web
              </label>
              <input
                type="text"
                value={formData.siteWeb}
                onChange={(e) => handleChange("siteWeb", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="www.ecole.tg"
              />
            </div>

            {/* Année scolaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Année scolaire <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.anneeScolaire}
                onChange={(e) => handleChange("anneeScolaire", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  errors.anneeScolaire ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="2024-2025"
              />
              {errors.anneeScolaire && <p className="mt-1 text-sm text-red-500">{errors.anneeScolaire}</p>}
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <X size={16} />
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            <Save size={16} />
            {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}