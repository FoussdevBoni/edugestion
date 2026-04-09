export const formatMoney = (montant: number): string => {
  // Convertir en string et inverser pour traiter de droite à gauche
  const montantStr = Math.floor(montant).toString();
  let resultat = '';
  
  // Parcourir de droite à gauche et ajouter un espace tous les 3 chiffres
  for (let i = montantStr.length - 1, j = 0; i >= 0; i--, j++) {
    if (j > 0 && j % 3 === 0) {
      resultat = ' ' + resultat;
    }
    resultat = montantStr[i] + resultat;
  }
  
  return `${resultat} FCFA`;
};