// src/pages/admin/materiel/TransactionsPage.tsx
import { useState } from "react";
import { 
 Search,
  ArrowDownCircle, ArrowUpCircle
} from "lucide-react";
import TransactionsList from "../../../../components/admin/lists/TransactionsList";
import useTransactions from "../../../../hooks/transactions/useTransactions";



export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "entree" | "sortie">("all");
  const {transactions } = useTransactions();

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Journal des transactions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Suivi des entrées et sorties d'argent
          </p>
        </div>

      
      </div>

      {/* Résumé financier */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Total entrées</p>
          <p className="text-2xl font-bold text-green-600">{formatMoney(totalEntrees)}</p>
          <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
            <ArrowUpCircle size={16} />
            <span>{transactions.filter(t => t.type === "entree").length} transactions</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Total sorties</p>
          <p className="text-2xl font-bold text-red-600">{formatMoney(totalSorties)}</p>
          <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
            <ArrowDownCircle size={16} />
            <span>{transactions.filter(t => t.type === "sortie").length} transactions</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Solde actuel</p>
          <p className={`text-2xl font-bold ${solde >= 0 ? 'text-primary' : 'text-red-600'}`}>
            {formatMoney(solde)}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Dernière mise à jour: {formatDate(new Date().toISOString())}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une transaction..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setTypeFilter("all")}
            className={`px-4 py-2 rounded-lg border ${
              typeFilter === "all" 
                ? 'bg-primary text-white border-primary' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setTypeFilter("entree")}
            className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
              typeFilter === "entree" 
                ? 'bg-green-600 text-white border-green-600' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <ArrowUpCircle size={16} />
            Entrées
          </button>
          <button
            onClick={() => setTypeFilter("sortie")}
            className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
              typeFilter === "sortie" 
                ? 'bg-red-600 text-white border-red-600' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <ArrowDownCircle size={16} />
            Sorties
          </button>
        </div>
      </div>

      {/* Liste des transactions */}
      <TransactionsList
        transactions={filteredTransactions}
      />

     
    </div>
  );
}