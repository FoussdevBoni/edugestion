// src/pages/admin/materiel/TransactionsPage.tsx
import { useState } from "react";
import { 
  Search, ArrowDownCircle, ArrowUpCircle, 
  TrendingUp, TrendingDown, Wallet
} from "lucide-react";
import TransactionsList from "../../../../components/admin/lists/TransactionsList";
import useTransactions from "../../../../hooks/transactions/useTransactions";

const StatCard = ({ label, value, subValue, icon, color, delay = 0 }: any) => {
  const colors: any = {
    green: "from-green-50 to-green-100 border-green-200 text-green-700",
    red: "from-red-50 to-red-100 border-red-200 text-red-700",
    primary: "from-primary/10 to-primary/5 border-primary/20 text-primary",
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

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "entree" | "sortie">("all");
  const { transactions } = useTransactions();

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.motif.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.modePaiement.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || t.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const totalEntrees = transactions
    .filter(t => t.type === "entree")
    .reduce((sum, t) => sum + t.montant, 0);
  
  const totalSorties = transactions
    .filter(t => t.type === "sortie")
    .reduce((sum, t) => sum + t.montant, 0);
  
  const solde = totalEntrees - totalSorties;

  const formatMoney = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* En-tête avec animation */}
      <div className="flex items-center gap-4 animate-fade-in-up">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Journal des transactions</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Wallet size={14} />
            Suivi des entrées et sorties d'argent
          </p>
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard 
          label="Total entrées" 
          value={formatMoney(totalEntrees)} 
          subValue={`${transactions.filter(t => t.type === "entree").length} transactions`}
          icon={<TrendingUp size={20} />} 
          color="green" 
          delay={100}
        />
        <StatCard 
          label="Total sorties" 
          value={formatMoney(totalSorties)} 
          subValue={`${transactions.filter(t => t.type === "sortie").length} transactions`}
          icon={<TrendingDown size={20} />} 
          color="red" 
          delay={200}
        />
        <StatCard 
          label="Solde actuel" 
          value={formatMoney(solde)} 
          subValue={`Dernière mise à jour: ${formatDate(new Date().toISOString())}`}
          icon={<Wallet size={20} />} 
          color="primary" 
          delay={300}
        />
      </div>

      {/* Filtres avec animation */}
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une transaction..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-200"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <span className="text-xs">✕</span>
            </button>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setTypeFilter("all")}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              typeFilter === "all" 
                ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setTypeFilter("entree")}
            className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
              typeFilter === "entree" 
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ArrowUpCircle size={16} />
            Entrées
          </button>
          <button
            onClick={() => setTypeFilter("sortie")}
            className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 ${
              typeFilter === "sortie" 
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ArrowDownCircle size={16} />
            Sorties
          </button>
        </div>
      </div>

      {/* Liste des transactions avec animation */}
      <div className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <TransactionsList
          transactions={filteredTransactions}
        />
      </div>

      {/* Message si aucun résultat */}
      {filteredTransactions.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <Wallet size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Aucune transaction trouvée</p>
          {(searchTerm || typeFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setTypeFilter("all");
              }}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
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