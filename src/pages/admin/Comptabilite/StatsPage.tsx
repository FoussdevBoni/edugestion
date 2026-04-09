// src/pages/admin/comptabilite/StatsPage.tsx
import { useEffect, useState } from "react";
import { 
  TrendingUp, TrendingDown, Wallet,
  Package, AlertTriangle, Calendar
} from "lucide-react";
import useStats from "../../../hooks/stats/useStats";


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
    <div className="space-y-6">
     

      {/* Filtre période */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <Calendar size={18} className="text-gray-400" />
          <input
            type="date"
            value={periode.debut}
            onChange={(e) => setPeriode({ ...periode, debut: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
          />
          <span>au</span>
          <input
            type="date"
            value={periode.fin}
            onChange={(e) => setPeriode({ ...periode, fin: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Résumé financier */}
      {statsCompta && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="text-green-600" size={20} />
                </div>
                <p className="text-sm text-gray-500">Entrées</p>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {formatMoney(statsCompta.resume.totalPaiements)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {statsCompta.details.paiements} paiements
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <TrendingDown className="text-red-600" size={20} />
                </div>
                <p className="text-sm text-gray-500">Sorties</p>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {formatMoney(statsCompta.resume.totalSorties)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {statsCompta.details.achats + statsCompta.details.charges} opérations
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Wallet className="text-blue-600" size={20} />
                </div>
                <p className="text-sm text-gray-500">Solde</p>
              </div>
              <p className={`text-2xl font-bold ${
                statsCompta.resume.solde >= 0 ? 'text-primary' : 'text-red-600'
              }`}>
                {formatMoney(statsCompta.resume.solde)}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Package className="text-purple-600" size={20} />
                </div>
                <p className="text-sm text-gray-500">Stock</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {statsStock?.totalUnites || 0} unités
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {statsStock?.totalTypes || 0} types
              </p>
            </div>
          </div>

          {/* Graphique évolution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Évolution sur 6 mois</h3>
            <div className="space-y-3">
              {statsCompta.graphiques.evolution.map((mois) => (
                <div key={mois.mois} className="flex items-center gap-4">
                  <span className="w-24 text-sm text-gray-600">{mois.mois}</span>
                  <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden flex">
                    <div 
                      className="h-full bg-green-500"
                      style={{ width: `${(mois.entree / (mois.entree + mois.sortie || 1)) * 100}%` }}
                    />
                    <div 
                      className="h-full bg-red-500"
                      style={{ width: `${(mois.sortie / (mois.entree + mois.sortie || 1)) * 100}%` }}
                    />
                  </div>
                  <div className="flex gap-3 text-sm">
                    <span className="text-green-600">{formatMoney(mois.entree)}</span>
                    <span className="text-red-600">{formatMoney(mois.sortie)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alertes stock */}
          {statsStock && statsStock.alertes.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-orange-800 mb-3">
                <AlertTriangle size={18} />
                <h3 className="font-medium">Alertes stock bas</h3>
              </div>
              <div className="space-y-2">
                {statsStock.alertes.map(alerte => (
                  <div key={alerte.id} className="flex justify-between text-sm">
                    <span className="text-orange-700">{alerte.nom}</span>
                    <span className="font-mono text-orange-800">
                      {alerte.quantite} / {alerte.seuil}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}