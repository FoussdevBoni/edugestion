// Fonction pour normaliser les noms de classes (optionnel)
export const normalizeClasse = (classe: string) => {
  return classe
    .replace('ème', 'e')
    .replace('ᵉ', 'e')
    .replace('ème', 'e')
    .trim();
};

