/**
 * Ordonne les données par date
 * @param data - Tableau de données
 * @param dateField - Nom du champ contenant la date
 * @param order - Ordre de tri ('asc' pour plus ancien au plus récent, 'desc' pour plus récent au plus ancien)
 * @returns Données ordonnées
 */
export function sortDataByDate(
    data,
    dateField="createdAt",
    order="desc"
) {
    if (!data || !Array.isArray(data)) return [];

    return [...data].sort((a, b) => {
        const dateA = new Date(a[dateField]);
        const dateB = new Date(b[dateField]);

        if (order === 'asc') {
            return dateA.getTime() - dateB.getTime();
        } else {
            return dateB.getTime() - dateA.getTime();
        }
    });
}