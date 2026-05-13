// utils/formatters.ts
/**
 * Formate un numéro de téléphone
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Supprime tous les caractères non numériques
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format selon la longueur
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  } else if (cleaned.length === 9) {
    return cleaned.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
  } else if (cleaned.length === 8) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
  }
  
  // Retourne le numéro original s'il ne correspond à aucun format connu
  return phoneNumber;
};

/**
 * Formate un montant en devise
 */
export const formatCurrency = (
  amount: number, 
  currency: string = 'XOF',
  locale: string = 'fr-FR'
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    // Fallback en cas d'erreur (devise invalide)
    return `${amount.toFixed(2)} ${currency}`;
  }
};

/**
 * Formate une date
 */
export const formatDate = (
  date: Date | string,
  locale: string = 'fr-FR',
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }
): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  } catch (error) {
    return 'Date invalide';
  }
};

/**
 * Formate un nombre avec séparateurs de milliers
 */
export const formatNumber = (
  number: number,
  locale: string = 'fr-FR',
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 2
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits
  }).format(number);
};

/**
 * Formate un pourcentage
 */
export const formatPercentage = (
  percentage: number,
  locale: string = 'fr-FR',
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 2
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits
  }).format(percentage / 100);
};

/**
 * Tronque un texte avec ellipse
 */
export const truncateText = (
  text: string,
  maxLength: number = 50
): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Formate une adresse
 */
export const formatAddress = (address: {
  rue?: string;
  codePostal?: string;
  ville?: string;
  pays?: string;
}): string => {
  const parts = [];
  
  if (address.rue) parts.push(address.rue);
  if (address.codePostal && address.ville) {
    parts.push(`${address.codePostal} ${address.ville}`);
  } else if (address.codePostal) {
    parts.push(address.codePostal);
  } else if (address.ville) {
    parts.push(address.ville);
  }
  if (address.pays) parts.push(address.pays);
  
  return parts.join(', ');
};

/**
 * Formate un nom avec majuscules
 */
export const formatName = (name: string): string => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Formate un code TVA
 */
export const formatVAT = (vatNumber: string): string => {
  if (!vatNumber) return '';
  
  // Supprime tous les caractères non alphanumériques
  const cleaned = vatNumber.replace(/[^A-Z0-9]/gi, '');
  
  // Ajoute le préfixe de pays si absent (suppose France par défaut)
  if (cleaned.length === 11 && !cleaned.startsWith('FR')) {
    return `FR${cleaned}`;
  }
  
  return cleaned;
};

/**
 * Formate une durée en heures/minutes
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} h`;
  }
  
  return `${hours} h ${remainingMinutes} min`;
};

/**
 * Formate un poids
 */
export const formatWeight = (
  weight: number,
  unit: 'kg' | 'g' = 'kg',
  locale: string = 'fr-FR'
): string => {
  const formattedWeight = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
  }).format(weight);
  
  return `${formattedWeight} ${unit}`;
};

/**
 * Formate une quantité avec unité
 */
export const formatQuantity = (
  quantity: number,
  unit?: string,
  locale: string = 'fr-FR'
): string => {
  const formattedQuantity = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(quantity);
  
  return unit ? `${formattedQuantity} ${unit}` : formattedQuantity;
};

/**
 * Formate un statut en texte lisible
 */
export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'draft': 'Brouillon',
    'pending': 'En attente',
    'validated': 'Validé',
    'cancelled': 'Annulé',
    'paid': 'Payé',
    'unpaid': 'Non payé',
    'partially_paid': 'Partiellement payé',
    'delivered': 'Livré',
    'undelivered': 'Non livré',
    'sent': 'Envoyé',
    'received': 'Reçu',
    'in_progress': 'En cours',
    'completed': 'Terminé',
    'brouillon': 'Brouillon',
    'validée': 'Validée',
    'annulée': 'Annulée',
    'payée': 'Payée',
    'non_payée': 'Non payée',
    'partiellement_payée': 'Partiellement payée',
    'livrée': 'Livrée',
    'non_livrée': 'Non livrée'
  };
  
  return statusMap[status.toLowerCase()] || status;
};

/**
 * Formate un booléen en Oui/Non
 */
export const formatBoolean = (value: boolean): string => {
  return value ? 'Oui' : 'Non';
};

/**
 * Formate un montant HT en TTC
 */
export const calculateTTC = (
  amountHT: number,
  tvaRate: number = 20
): number => {
  return amountHT * (1 + tvaRate / 100);
};

/**
 * Formate un montant TTC en HT
 */
export const calculateHT = (
  amountTTC: number,
  tvaRate: number = 20
): number => {
  return amountTTC / (1 + tvaRate / 100);
};
