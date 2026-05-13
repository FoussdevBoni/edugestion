/**
 * Ordonne les données par date
 * @param data - Tableau de données
 * @param dateField - Nom du champ contenant la date
 * @param order - Ordre de tri ('asc' pour plus ancien au plus récent, 'desc' pour plus récent au plus ancien)
 * @returns Données ordonnées
 */
export function sortDataByDate<T>(
  data: T[],
  dateField: keyof T,
  order: 'asc' | 'desc' = 'desc'
): T[] {
  if (!data || !Array.isArray(data)) return [];

  return [...data].sort((a, b) => {
    const dateA = new Date(a[dateField] as unknown as string | Date);
    const dateB = new Date(b[dateField] as unknown as string | Date);
    
    if (order === 'asc') {
      return dateA.getTime() - dateB.getTime();
    } else {
      return dateB.getTime() - dateA.getTime();
    }
  });
}