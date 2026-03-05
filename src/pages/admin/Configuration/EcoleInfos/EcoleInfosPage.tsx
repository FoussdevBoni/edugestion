// src/pages/admin/configuration/ecole/EcoleInfosPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  School, MapPin, Phone, Mail, Globe, Calendar,
  Quote, Edit, Clock
} from "lucide-react";
import { ecoleInfos } from "../../../../data/ecoleInfos";

export default function EcoleInfosPage() {
  const navigate = useNavigate();
  const [ecole] = useState(ecoleInfos);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleUpdate = () => {
    navigate("/admin/configuration/ecole/update", { state: ecole });
  };

  return (
    <div className="space-y-6">


      {/* Carte principale avec logo et nom */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-lg shadow-md flex items-center justify-center">
              {ecole.logo ? (
                <img src={ecole.logo} alt={ecole.nom} className="w-20 h-20 object-contain" />
              ) : (
                <School size={48} className="text-primary" />
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{ecole.nom}</h2>
              {ecole.devise && (
                <p className="text-gray-600 mt-2 flex items-center gap-2">
                  <Quote size={16} className="text-primary" />
                  "{ecole.devise}"
                </p>
              )}
            </div>
            <button
              onClick={handleUpdate}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Edit size={18} />
              Modifier
            </button>
          </div>
        </div>

        {/* Grille d'informations */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Adresse */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapPin size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Adresse</p>
              <p className="font-medium text-gray-800">{ecole.adresse}</p>
            </div>
          </div>

          {/* Téléphone */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Phone size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <p className="font-medium text-gray-800">{ecole.telephone}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Mail size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{ecole.email}</p>
            </div>
          </div>

          {/* Site Web */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Globe size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Site Web</p>
              <p className="font-medium text-gray-800">{ecole.siteWeb || "Non renseigné"}</p>
            </div>
          </div>

          {/* Année scolaire */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Année scolaire en cours</p>
              <p className="font-medium text-gray-800">{ecole.anneeScolaire}</p>
            </div>
          </div>

          {/* Dates de création/modification */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Dernière mise à jour</p>
              <p className="font-medium text-gray-800">{formatDate(ecole.updatedAt)}</p>
              <p className="text-xs text-gray-400 mt-1">
                Créé le {formatDate(ecole.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section aide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-blue-100 rounded-full">
            <span className="text-blue-600 text-sm font-bold">i</span>
          </div>
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">À propos de cette page</p>
            <p>
              Ces informations sont utilisées dans tout le système : en-têtes, rapports,
              bulletins, factures, etc. Assurez-vous qu'elles sont toujours à jour.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}