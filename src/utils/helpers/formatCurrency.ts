// Fonction simple et efficace
export const formatCurrency = (amount: number): string => {
  // Vérifier si le montant est énorme (plus de 1 milliard)
  if (Math.abs(amount) >= 1000000000) {
    // Abréger les montants énormes
    if (Math.abs(amount) >= 1000000000000) return `${(amount / 1000000000000).toFixed(2)}T`;
    if (Math.abs(amount) >= 1000000000) return `${(amount / 1000000000).toFixed(2)}B`;
    if (Math.abs(amount) >= 1000000) return `${(amount / 1000000).toFixed(2)}M`;
    if (Math.abs(amount) >= 1000) return `${(amount / 1000).toFixed(1)}K`;
  }
  
  // Pour les montants normaux, afficher la devise complète
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: "XOF"
  }).format(amount);
};