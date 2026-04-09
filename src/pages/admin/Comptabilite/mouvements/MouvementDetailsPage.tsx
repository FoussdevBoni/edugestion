// src/pages/admin/comptabilite/mouvements/MouvementDetailsPage.tsx
import { 
  ArrowLeft, Package, Calendar, User,
  FileText, Tag, ArrowDown, ArrowUp
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const TYPE_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  entree: { label: "Entrée", color: "bg-green-100 text-green-700", icon: ArrowDown },
  sortie: { label: "Sortie", color: "bg-red-100 text-red-700", icon: ArrowUp },
  correction: { label: "Correction", color: "bg-orange-100 text-orange-700", icon: FileText },
  inventaire: { label: "Inventaire", color: "bg-blue-100 text-blue-700", icon: Calendar }
};

export default function MouvementDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const mouvement = location.state;

  if (!mouvement) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Mouvement non trouvé</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Retour
        </button>
      </div>
    );
  }

  const typeInfo = TYPE_CONFIG[mouvement.type] || TYPE_CONFIG.correction;
  const TypeIcon = typeInfo.icon;

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'dd MMMM yyyy à HH:mm', { locale: fr });
  };

  const formatNombre = (n: number) => {
    return new Intl.NumberFormat('fr-FR').format(n);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Détails du mouvement</h1>
          <p className="text-sm text-gray-500 mt-1">ID: {mouvement.id}</p>
        </div>
      </div>

      {/* Type de mouvement */}
      <div className={`${typeInfo.color} p-6 rounded-lg border flex items-center gap-4`}>
        <div className="p-3 bg-white bg-opacity-30 rounded-full">
          <TypeIcon size={24} />
        </div>
        <div>
          <p className="text-sm opacity-80">Type de mouvement</p>
          <p className="text-2xl font-bold">{typeInfo.label}</p>
        </div>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Colonne gauche */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Matériel</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Package className="text-primary" size={20} />
              <div>
                <p className="text-sm text-gray-500">Matériel</p>
                <p className="font-medium">{mouvement.materiel?.nom || 'Inconnu'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Avant</p>
                <p className="text-xl font-mono font-bold">{formatNombre(mouvement.quantiteAvant)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Après</p>
                <p className="text-xl font-mono font-bold">{formatNombre(mouvement.quantiteApres)}</p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Différence</p>
              <p className={`text-2xl font-mono font-bold ${
                mouvement.difference > 0 
                  ? 'text-green-600' 
                  : mouvement.difference < 0 
                    ? 'text-red-600' 
                    : ''
              }`}>
                {mouvement.difference > 0 ? '+' : ''}{formatNombre(mouvement.difference)}
              </p>
            </div>
          </div>
        </div>

        {/* Colonne droite */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Détails</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="text-gray-500" size={20} />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{formatDate(mouvement.date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="text-gray-500" size={20} />
              <div>
                <p className="text-sm text-gray-500">Motif</p>
                <p className="font-medium">{mouvement.motif}</p>
              </div>
            </div>

            {mouvement.referenceId && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Tag className="text-gray-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Référence</p>
                  <p className="font-mono text-sm">
                    {mouvement.referenceType}: {mouvement.referenceId}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="text-gray-500" size={20} />
              <div>
                <p className="text-sm text-gray-500">Créé par</p>
                <p className="font-medium">{mouvement.createdBy || 'Système'}</p>
              </div>
            </div>

            {mouvement.notes && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Notes</p>
                <p className="text-gray-700">{mouvement.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Métadonnées */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-xs text-gray-500">
        <p>Créé le {formatDate(mouvement.createdAt)}</p>
        {mouvement.updatedAt !== mouvement.createdAt && (
          <p>Modifié le {formatDate(mouvement.updatedAt)}</p>
        )}
      </div>
    </div>
  );
}