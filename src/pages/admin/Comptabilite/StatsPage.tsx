// src/pages/admin/comptabilite/StatsPage.tsx
import { useEffect, useState } from "react";
import { 
  TrendingUp, TrendingDown, Wallet,
  Package, AlertTriangle, Calendar,
  ArrowUpCircle, ArrowDownCircle, BarChart3
} from "lucide-react";
import useStats from "../../../hooks/stats/useStats";

const StatCard = ({ label, value, subValue, icon, color, delay = 0 }: any) => {
  const colors: any = {
    green: "from-green-50 to-green-100 border-green-200 text-green-700",
    red: "from-red-50 to-red-100 border-red-200 text-red-700",
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-700",
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl border p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02] animate-fade-in-up`} style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subValue && <p className="text-xs opacity-70 mt-1">{subValue}</p>}
        </div>
        <div className="p-3 bg-white/50 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default function StatsPage() {
  const { loading, statsCompta, statsStock, getComptabilite, getStock } = useStats();
  const [periode, setPeriode] = useState(() => {
    const now = new Date();
    const debut = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const fin = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    return { debut, fin };
  });

  useEffect(() => {
    const loadStats = async () => {
      await getComptabilite(periode);
      await getStock();
    };
    loadStats();
  }, [getComptabilite, getStock, periode]);

  const formatMoney = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  };

  if (loading && !statsCompta) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Statistiques financières</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <BarChart3 size={14} />
            Analyse des entrées, sorties et suivi de stock
          </p>
        </div>
      </div>

      {/* Filtre période avec animation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Calendar size={16} className="text-primary" />
            </div>
            <span className="text-sm font-medium text-gray-700">Période</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={periode.debut}
              onChange={(e) => setPeriode({ ...periode, debut: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200"
            />
            <span className="text-gray-500">→</span>
            <input
              type="date"
              value={periode.fin}
              onChange={(e) => setPeriode({ ...periode, fin: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Résumé financier avec animations */}
      {statsCompta && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              label="Entrées" 
              value={formatMoney(statsCompta.resume.totalPaiements)} 
              subValue={`${statsCompta.details.paiements} paiements`}
              icon={<ArrowUpCircle size={20} />} 
              color="green" 
              delay={200}
            />
            <StatCard 
              label="Sorties" 
              value={formatMoney(statsCompta.resume.totalSorties)} 
              subValue={`${statsCompta.details.achats + statsCompta.details.charges} opérations`}
              icon={<ArrowDownCircle size={20} />} 
              color="red" 
              delay={300}
            />
            <StatCard 
              label="Solde" 
              value={formatMoney(statsCompta.resume.solde)} 
              icon={<Wallet size={20} />} 
              color="blue" 
              delay={400}
            />
            <StatCard 
              label="Stock" 
              value={`${statsStock?.totalUnites || 0} unités`} 
              subValue={`${statsStock?.totalTypes || 0} types`}
              icon={<Package size={20} />} 
              color="purple" 
              delay={500}
            />
          </div>

          {/* Graphique évolution avec animation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-800">Évolution sur 6 mois</h3>
            </div>
            <div className="space-y-4">
              {statsCompta.graphiques.evolution.map((mois, idx) => (
                <div key={mois.mois} className="flex flex-wrap items-center gap-4 animate-fade-in-up" style={{ animationDelay: `${650 + idx * 50}ms` }}>
                  <span className="w-24 text-sm font-medium text-gray-700">{mois.mois}</span>
                  <div className="flex-1 h-9 bg-gray-100 rounded-xl overflow-hidden flex shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                      style={{ width: `${(mois.entree / (mois.entree + mois.sortie || 1)) * 100}%` }}
                    />
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
                      style={{ width: `${(mois.sortie / (mois.entree + mois.sortie || 1)) * 100}%` }}
                    />
                  </div>
                  <div className="flex gap-4 text-sm font-medium">
                    <span className="text-green-600 flex items-center gap-1">
                      <TrendingUp size={12} /> {formatMoney(mois.entree)}
                    </span>
                    <span className="text-red-600 flex items-center gap-1">
                      <TrendingDown size={12} /> {formatMoney(mois.sortie)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alertes stock avec animation */}
          {statsStock && statsStock.alertes.length > 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-5 transition-all duration-300 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '700ms' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-200 rounded-lg">
                  <AlertTriangle size={18} className="text-orange-700" />
                </div>
                <h3 className="font-semibold text-orange-800">Alertes stock bas</h3>
              </div>
              <div className="space-y-2">
                {statsStock.alertes.map((alerte, idx) => (
                  <div key={alerte.id} className="flex justify-between items-center p-3 bg-white/60 rounded-xl transition-all duration-200 hover:bg-white animate-fade-in-up" style={{ animationDelay: `${750 + idx * 50}ms` }}>
                    <span className="text-orange-700 font-medium">{alerte.nom}</span>
                    <span className="font-mono font-bold text-orange-800 bg-orange-100 px-3 py-1 rounded-full text-sm">
                      {alerte.quantite} / {alerte.seuil}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

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