// src/pages/admin/DashboardPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, BookOpen, GraduationCap, Wallet, 
  AlertTriangle, Package, Plus,
  Eye, TrendingUp, School,
  BarChart3, PieChart
} from 'lucide-react';
import useStats from '../../hooks/stats/useStats';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { loading, statsDashboard, getDashboard } = useStats();

  useEffect(() => {
    getDashboard();
  }, [getDashboard]);

  const formatMoney = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  };

  if (loading && !statsDashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-sm text-gray-500 mt-1">Bienvenue sur votre espace de gestion scolaire</p>
      </div>
     
      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-sm border border-blue-100 p-6 transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: '0ms' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Users className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Élèves</p>
              <p className="text-2xl font-bold text-gray-800">{statsDashboard?.stats.eleves || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-sm border border-green-100 p-6 transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <GraduationCap className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Enseignants</p>
              <p className="text-2xl font-bold text-gray-800">{statsDashboard?.stats.enseignants || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-sm border border-purple-100 p-6 transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <BookOpen className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Classes</p>
              <p className="text-2xl font-bold text-gray-800">{statsDashboard?.stats.classes || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-yellow-50 rounded-xl shadow-sm border border-yellow-100 p-6 transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/10 rounded-xl">
              <Wallet className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Caisse du mois</p>
              <p className="text-2xl font-bold text-gray-800">{formatMoney(statsDashboard?.stats.caisseMois || 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Répartition des élèves */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <PieChart size={18} className="text-primary" />
            </div>
            <h3 className="font-semibold text-gray-800">Par niveau scolaire</h3>
          </div>
          <div className="space-y-3">
            {statsDashboard?.repartition.parNiveauScolaire.map((item, idx) => (
              <div key={item.niveauScolaire} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-sm text-gray-600">{item.niveauScolaire}</span>
                <span className="font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">{item.count} élève{item.count > 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 size={18} className="text-primary" />
            </div>
            <h3 className="font-semibold text-gray-800">Par cycle</h3>
          </div>
          <div className="space-y-3">
            {statsDashboard?.repartition.parCycle.map((item, idx) => (
              <div key={item.cycle} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-sm text-gray-600">{item.cycle}</span>
                <span className="font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">{item.count} élève{item.count > 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Par niveau classe et bulletins disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <School size={18} className="text-primary" />
            </div>
            <h3 className="font-semibold text-gray-800">Par niveau</h3>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-3 pr-2">
            {statsDashboard?.repartition.parNiveauClasse.map((item, idx) => (
              <div key={item.niveauClasse} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-sm text-gray-600">{item.niveauClasse}</span>
                <span className="font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">{item.count} élève{item.count > 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '700ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Eye size={18} className="text-primary" />
            </div>
            <h3 className="font-semibold text-gray-800">Bulletins par classe</h3>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-3 pr-2">
            {statsDashboard?.bulletinsDisponibles.map((item, idx) => (
              <div key={item.classeId} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-sm text-gray-600">{item.nomClasse}</span>
                <span className="font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">{item.count} bulletin{item.count > 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Par classe (détaillé) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '800ms' }}>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users size={18} className="text-primary" />
          </div>
          <h3 className="font-semibold text-gray-800">Effectifs par classe</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {statsDashboard?.repartition.parClasse.map((item, idx) => (
            <div key={item.classeId} className="bg-gradient-to-r from-gray-50 to-white p-3 rounded-xl flex justify-between items-center border border-gray-100 transition-all duration-300 hover:shadow-sm hover:scale-[1.01]">
              <span className="text-sm font-medium text-gray-700">{item.nomClasse}</span>
              <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Alertes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-white to-red-50 rounded-xl shadow-sm border border-red-100 p-4 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '900ms' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle size={18} className="text-red-500" />
              </div>
              <h3 className="font-semibold text-gray-800">Impayés</h3>
            </div>
            <button 
              onClick={() => navigate('/admin/paiements')}
              className="text-xs text-primary hover:underline font-medium"
            >
              Voir tout
            </button>
          </div>
          {(!statsDashboard?.alertes.impayes || statsDashboard.alertes.impayes.length === 0) ? (
            <p className="text-sm text-gray-500 text-center py-4">✅ Aucun impayé</p>
          ) : (
            <ul className="space-y-2">
              {statsDashboard.alertes.impayes.map((impaye, idx) => (
                <li key={idx} className="text-sm flex justify-between items-center p-2 bg-red-50/50 rounded-lg">
                  <span className="text-gray-700">{impaye.eleve}</span>
                  <span className="font-semibold text-red-600">{formatMoney(impaye.montant)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-gradient-to-br from-white to-yellow-50 rounded-xl shadow-sm border border-yellow-100 p-4 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <TrendingUp size={18} className="text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-800">À finaliser</h3>
            </div>
            <button 
              onClick={() => navigate('/admin/bulletins')}
              className="text-xs text-primary hover:underline font-medium"
            >
              Voir tout
            </button>
          </div>
          {(!statsDashboard?.alertes.bulletinsAFinaliser || statsDashboard.alertes.bulletinsAFinaliser.length === 0) ? (
            <p className="text-sm text-gray-500 text-center py-4">✅ Aucun bulletin à finaliser</p>
          ) : (
            <ul className="space-y-2">
              {statsDashboard.alertes.bulletinsAFinaliser.map((bulletin, idx) => (
                <li key={idx} className="text-sm p-2 bg-yellow-50/50 rounded-lg text-gray-700">
                  {bulletin.eleve?.prenom} {bulletin.eleve?.nom} - {bulletin.eleve?.classe}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-sm border border-orange-100 p-4 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '1100ms' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Package size={18} className="text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-800">Stock bas</h3>
            </div>
            <button 
              onClick={() => navigate('/admin/comptabilite/materiel')}
              className="text-xs text-primary hover:underline font-medium"
            >
              Voir tout
            </button>
          </div>
          {(!statsDashboard?.alertes.stockBas || statsDashboard.alertes.stockBas.length === 0) ? (
            <p className="text-sm text-gray-500 text-center py-4">✅ Stock suffisant</p>
          ) : (
            <ul className="space-y-2">
              {statsDashboard.alertes.stockBas.map((item) => (
                <li key={item.id} className="text-sm flex justify-between items-center p-2 bg-orange-50/50 rounded-lg">
                  <span className="text-gray-700">{item.nom}</span>
                  <span className="font-semibold text-orange-600">{item.quantite} / {item.seuil}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-sm border border-indigo-100 p-4 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '1200ms' }}>
        <h3 className="font-semibold text-gray-800 mb-3">Actions rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => navigate('/admin/eleves/new')}
            className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <Plus size={16} />
            Nouvel élève
          </button>
          <button
            onClick={() => navigate('/admin/paiements/new')}
            className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <Plus size={16} />
            Nouveau paiement
          </button>
          <button
            onClick={() => navigate('/admin/comptabilite/achats/new')}
            className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <Plus size={16} />
            Nouvel achat
          </button>
          <button
            onClick={() => navigate('/admin/bulletins')}
            className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <Eye size={16} />
            Voir bulletins
          </button>
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