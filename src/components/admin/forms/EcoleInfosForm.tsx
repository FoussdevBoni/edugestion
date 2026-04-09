// src/components/ecole/EcoleInfosForm.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X, Upload, School, CreditCard } from "lucide-react";
import { EcoleInfo } from "../../../utils/types/data";

interface EcoleInfosFormProps {
  initialData?: Partial<EcoleInfo>;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  title: string;
  submitLabel: string;
  onCancel?: () => void;
}

export default function EcoleInfosForm({
  initialData = {},
  onSubmit,
  isSubmitting = false,
  title,
  submitLabel,
  onCancel
}: EcoleInfosFormProps) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: initialData.nom || "",
    logo: initialData.logo || "",
    enTeteCarte: initialData.enTeteCarte || "", // Nouveau champ
    ia: initialData.ia || "",
    ief: initialData.ief || "",
    pays: initialData.pays,
    adresse: initialData.adresse || "",
    telephone: initialData.telephone || "",
    email: initialData.email || "",
    siteWeb: initialData.siteWeb || "",
    anneeScolaire: initialData.anneeScolaire || "",
    devise: initialData.devise || ""
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(formData.logo || null);
  const [enTetePreview, setEnTetePreview] = useState<string | null>(formData.enTeteCarte || null);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};

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
      await onSubmit(formData);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
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

  const handleEnTeteUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setEnTetePreview(base64String);
        setFormData(prev => ({ ...prev, enTeteCarte: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Retour"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {submitLabel === "Créer" ? "Configurez les informations de votre établissement" : "Mettez à jour les informations générales"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identité de l'école */}
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
                  accept=".jpg,.jpeg"
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
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.nom ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Nom de l'établissement"
              />
              {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
            </div>
          </div>

          {/* Nouveau champ : En-tête pour carte d'identité */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              En-tête pour carte d'identité
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-64 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-200">
                  {enTetePreview ? (
                    <img src={enTetePreview} alt="En-tête carte" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <CreditCard size={24} className="mx-auto mb-1" />
                      <span className="text-xs">Aperçu en-tête</span>
                    </div>
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 p-1.5 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 shadow-md">
                  <Upload size={14} />
                  <input
                    type="file"
                    accept=".jpg,.jpeg"
                    className="hidden"
                    onChange={handleEnTeteUpload}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Image pour l'en-tête de la carte d'identité (logo + drapeau + texte). Format recommandé : 800x100px
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Votre pays ( Exemple: REPUBLIQUE DU SENEGAL)
              </label>
              <input
                type="text"
                value={formData.pays}
                onChange={(e) => handleChange("pays", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ex: REPUBLIQUE DU SENEGAL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IA (Inspection d'Académie)
              </label>
              <input
                type="text"
                value={formData.ia}
                onChange={(e) => handleChange("ia", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ex: PIKINE GUEDIAWAYE"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IEF (Inspection de l'Éducation)
              </label>
              <input
                type="text"
                value={formData.ief}
                onChange={(e) => handleChange("ief", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ex: THIAROYE"
              />
            </div>
            
            <div className="md:col-span-2">
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
        </div>

        {/* Coordonnées */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Coordonnées</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.adresse}
                onChange={(e) => handleChange("adresse", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.adresse ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="Adresse complète"
              />
              {errors.adresse && <p className="mt-1 text-sm text-red-500">{errors.adresse}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => handleChange("telephone", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.telephone ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="+221 XX XXX XX XX"
              />
              {errors.telephone && <p className="mt-1 text-sm text-red-500">{errors.telephone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="contact@ecole.sn"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Web
              </label>
              <input
                type="text"
                value={formData.siteWeb}
                onChange={(e) => handleChange("siteWeb", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="www.ecole.sn"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Année scolaire <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.anneeScolaire}
                onChange={(e) => handleChange("anneeScolaire", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.anneeScolaire ? 'border-red-500' : 'border-gray-300'
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
            {isSubmitting ? "Enregistrement..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}