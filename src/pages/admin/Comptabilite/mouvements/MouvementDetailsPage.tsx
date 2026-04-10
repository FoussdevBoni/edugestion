// src/pages/admin/comptabilite/mouvements/MouvementDetailsPage.tsx
import { 
  ArrowLeft, Package, Calendar, User,
  FileText, Tag, ArrowDown, ArrowUp,
  AlertCircle, TrendingUp, TrendingDown
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const TYPE_CONFIG: Record<string, { label: string; color: string; gradient: string; icon: any }> = {
  entree: { label: "Entrée", color: "text-green-700", gradient: "from-green-50 to-green-100 border-green-200", icon: ArrowDown },
  sortie: { label: "Sortie", color: "text-red-700", gradient: "from-red-50 to-red-100 border-red-200", icon: ArrowUp },
  correction: { label: "Correction", color: "text-orange-700", gradient: "from-orange-50 to-orange-100 border-orange-200", icon: FileText },
  inventaire: { label: "Inventaire", color: "text-blue-700", gradient: "from-blue-50 to-blue-100 border-blue-200", icon: Calendar }
};

export default function MouvementDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const mouvement = location.state;

  if (!mouvement) {
    return (
      <div className="text-center py-12 animate-fade-in-up">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <p className="text-gray-500 text-center mb-4">Mouvement non trouvé</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-md transition-all duration-300"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const typeInfo = TYPE_CONFIG[mouvement.type] || TYPE_CONFIG.correction;
  const TypeIcon = typeInfo.icon;
  const isEntree = mouvement.type === 'entree';
  const isSortie = mouvement.type === 'sortie';

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'dd MMMM yyyy à HH:mm', { locale: fr });
  };

  const formatNombre = (n: number) => {
    return new Intl.NumberFormat('fr-FR').format(n);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 group"
        >
          <ArrowLeft size={20} className="text-gray-600 group-hover:text-primary transition-colors" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Détails du mouvement</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Tag size={14} />
            ID: {mouvement.id?.slice(0, 8)}...
          </p>
        </div>
      </div>

      {/* Type de mouvement avec animation */}
      <div className={`bg-gradient-to-br ${typeInfo.gradient} rounded-xl border p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up flex items-center gap-5`} style={{ animationDelay: '100ms' }}>
        <div className={`p-4 bg-white rounded-full shadow-sm ${typeInfo.color}`}>
          <TypeIcon size={28} />
        </div>
        <div>
          <p className="text-sm opacity-70">Type de mouvement</p>
          <p className="text-2xl font-bold">{typeInfo.label}</p>
        </div>
      </div>

      {/* Informations principales avec animations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colonne gauche - Matériel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-800">Matériel</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Matériel</p>
                <p className="font-semibold text-gray-800">{mouvement.materiel?.nom || 'Inconnu'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-xs text-gray-500">Avant</p>
                <p className="text-2xl font-mono font-bold text-gray-800">{formatNombre(mouvement.quantiteAvant)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-xs text-gray-500">Après</p>
                <p className="text-2xl font-mono font-bold text-gray-800">{formatNombre(mouvement.quantiteApres)}</p>
              </div>
            </div>

            <div className={`p-5 rounded-xl text-center transition-all duration-300 ${
              mouvement.difference > 0 
                ? 'bg-gradient-to-r from-green-50 to-green-100 border border-green-200' 
                : mouvement.difference < 0 
                  ? 'bg-gradient-to-r from-red-50 to-red-100 border border-red-200'
                  : 'bg-gray-50'
            }`}>
              <p className="text-sm text-gray-500">Différence</p>
              <p className={`text-3xl font-mono font-bold flex items-center justify-center gap-2 ${
                mouvement.difference > 0 ? 'text-green-700' : mouvement.difference < 0 ? 'text-red-700' : 'text-gray-600'
              }`}>
                {mouvement.difference > 0 && <TrendingUp size={24} />}
                {mouvement.difference < 0 && <TrendingDown size={24} />}
                {mouvement.difference > 0 ? '+' : ''}{formatNombre(mouvement.difference)}
              </p>
            </div>
          </div>
        </div>

        {/* Colonne droite - Détails */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            <h2 className="text-lg font-semibold text-gray-800">Détails</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Calendar className="text-primary" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-medium text-gray-800">{formatDate(mouvement.date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <FileText className="text-primary" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Motif</p>
                <p className="font-medium text-gray-800">{mouvement.motif}</p>
              </div>
            </div>

            {mouvement.referenceId && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Tag className="text-primary" size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Référence</p>
                  <p className="font-mono text-sm text-gray-700">
                    {mouvement.referenceType}: {mouvement.referenceId.slice(0, 8)}...
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <User className="text-primary" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Créé par</p>
                <p className="font-medium text-gray-800">{mouvement.createdBy || 'Système'}</p>
              </div>
            </div>

            {mouvement.notes && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-2">Notes</p>
                <p className="text-gray-700">{mouvement.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Métadonnées avec animation */}
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-xs text-gray-500 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <p>📅 Créé le {formatDate(mouvement.createdAt)}</p>
          {mouvement.updatedAt !== mouvement.createdAt && (
            <p>✏️ Modifié le {formatDate(mouvement.updatedAt)}</p>
          )}
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
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}