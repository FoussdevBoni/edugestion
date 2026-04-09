import { Classe, Eleve } from "../types/data";

export const compterParClasse = (
  eleves: Eleve[],
  classes: Classe[]
) => {
  const normalize = (str: string) => str.trim().toLowerCase();

  const result: Record<string, number> = {};
  const mapping: Record<string, string> = {};

  for (const c of classes) {
    const key = normalize(c.nom);
    result[key] = 0;
    mapping[key] = c.nom;
  }

  for (const eleve of eleves) {
    const key = normalize(eleve.classe);
    if (key in result) {
      result[key]++;
    }
  }

  // reconstruction propre pour affichage
  return Object.fromEntries(
    Object.entries(result).map(([key, count]) => [
      mapping[key],
      count
    ])
  );
};